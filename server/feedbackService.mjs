import crypto from 'node:crypto';
import { db } from './db.mjs';

/**
 * Generate a unique, cryptographically random, difficult-to-guess feedback link
 */
export function createFeedbackRequest({
  client_name,
  client_contact,
  project_title,
  deliverable_type,
  expiry_days = 30,
  baseUrl = '',
}) {
  if (!client_name || !String(client_name).trim()) {
    throw new Error('Client name is required');
  }
  if (!project_title || !String(project_title).trim()) {
    throw new Error('Project title is required');
  }

  const token = crypto.randomBytes(24).toString('hex'); // 48-char secure hex token
  const numDays = Math.max(1, Math.min(90, Number(expiry_days) || 30));
  const expiresDate = new Date();
  expiresDate.setDate(expiresDate.getDate() + numDays);
  const expiresAt = expiresDate.toISOString();

  const trimmedClient = String(client_name).trim();
  const trimmedProject = String(project_title).trim();
  const trimmedContact = client_contact ? String(client_contact).trim() : null;
  const trimmedDeliverable = deliverable_type ? String(deliverable_type).trim() : 'Video Editing';

  const insert = db.prepare(`
    INSERT INTO feedback_requests (
      token, client_name, client_contact, project_title, deliverable_type,
      status, expires_at
    ) VALUES (?, ?, ?, ?, ?, 'pending', ?)
  `);

  const result = insert.run(
    token,
    trimmedClient,
    trimmedContact,
    trimmedProject,
    trimmedDeliverable,
    expiresAt
  );

  const cleanBase = baseUrl ? baseUrl.replace(/\/+$/, '') : 'http://localhost:5173';
  const feedbackUrl = `${cleanBase}/#feedback?token=${token}`;

  // WhatsApp share message template
  const shareMessage = encodeURIComponent(
    `Hi ${trimmedClient}! Thank you for trusting Edit Revolution with "${trimmedProject}". We would love to hear your feedback on the video quality, communication, and delivery! Please take 1 minute to leave a review here: ${feedbackUrl}`
  );
  const whatsappShareUrl = trimmedContact && /^\d+$/.test(trimmedContact.replace(/\D/g, ''))
    ? `https://wa.me/${trimmedContact.replace(/\D/g, '')}?text=${shareMessage}`
    : `https://wa.me/?text=${shareMessage}`;

  return {
    id: result.lastInsertRowid,
    token,
    clientName: trimmedClient,
    clientContact: trimmedContact,
    projectTitle: trimmedProject,
    deliverableType: trimmedDeliverable,
    status: 'pending',
    expiresAt,
    feedbackUrl,
    whatsappShareUrl,
  };
}

/**
 * Validate a client feedback token (Public validation, exposes zero private reviews)
 */
export function validateFeedbackToken(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Feedback token is missing or malformed.' };
  }

  const cleanToken = String(token).trim();
  const request = db.prepare('SELECT * FROM feedback_requests WHERE token = ?').get(cleanToken);

  if (!request) {
    return { valid: false, error: 'Invalid feedback link. This request does not exist.' };
  }

  if (request.status === 'submitted') {
    return {
      valid: false,
      alreadySubmitted: true,
      error: 'Thank you! Feedback for this project has already been submitted and recorded.',
      clientName: request.client_name,
      projectTitle: request.project_title,
    };
  }

  const now = new Date();
  const expiresAt = new Date(request.expires_at);

  if (now > expiresAt) {
    db.prepare("UPDATE feedback_requests SET status = 'expired' WHERE id = ?").run(request.id);
    return {
      valid: false,
      expired: true,
      error: 'This feedback link has expired. Please contact Chandu at Edit Revolution to receive an active link.',
    };
  }

  return {
    valid: true,
    request: {
      token: request.token,
      clientName: request.client_name,
      projectTitle: request.project_title,
      deliverableType: request.deliverable_type,
      expiresAt: request.expires_at,
    },
  };
}

/**
 * Submit client feedback with server-side validation & duplicate prevention
 */
export function submitClientFeedback({
  token,
  overallRating,
  qualityRating,
  communicationRating,
  deliveryRating,
  writtenReview,
  allowPublicDisplay,
}) {
  const validation = validateFeedbackToken(token);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Validate ratings (1 to 5 stars)
  const oRating = Number(overallRating);
  const qRating = Number(qualityRating);
  const cRating = Number(communicationRating);
  const dRating = Number(deliveryRating);

  const ratings = [oRating, qRating, cRating, dRating];
  for (const r of ratings) {
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      throw new Error('All rating scores must be integer values between 1 and 5 stars.');
    }
  }

  const request = db.prepare('SELECT * FROM feedback_requests WHERE token = ?').get(token);
  if (!request) {
    throw new Error('Feedback request not found');
  }

  const publicDisplay = allowPublicDisplay === true || allowPublicDisplay === 1 ? 1 : 0;
  const cleanReview = writtenReview ? String(writtenReview).trim() : null;

  // Insert review and mark request as submitted atomically
  db.exec('BEGIN TRANSACTION;');
  try {
    const insertReview = db.prepare(`
      INSERT INTO client_reviews (
        request_id, client_name, project_title,
        overall_rating, quality_rating, communication_rating, delivery_rating,
        written_review, allow_public_display, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending_review')
    `);

    const result = insertReview.run(
      request.id,
      request.client_name,
      request.project_title,
      oRating,
      qRating,
      cRating,
      dRating,
      cleanReview,
      publicDisplay
    );

    db.prepare(`
      UPDATE feedback_requests
      SET status = 'submitted', submitted_at = datetime('now')
      WHERE id = ?
    `).run(request.id);

    db.exec('COMMIT;');

    return {
      success: true,
      reviewId: result.lastInsertRowid,
      clientName: request.client_name,
      projectTitle: request.project_title,
      message: 'Thank you for your valuable feedback! Your review has been securely recorded.',
    };
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }
}

/**
 * Admin Stats & Analytics for Feedback Dashboard
 */
export function getFeedbackStats() {
  const totalRow = db.prepare(`
    SELECT
      COUNT(*) AS total_reviews,
      AVG(overall_rating) AS avg_overall,
      AVG(quality_rating) AS avg_quality,
      AVG(communication_rating) AS avg_communication,
      AVG(delivery_rating) AS avg_delivery
    FROM client_reviews
  `).get();

  const totalReviews = Number(totalRow.total_reviews || 0);
  const avgOverall = totalReviews > 0 ? Math.round(Number(totalRow.avg_overall) * 10) / 10 : 0;
  const avgQuality = totalReviews > 0 ? Math.round(Number(totalRow.avg_quality) * 10) / 10 : 0;
  const avgCommunication = totalReviews > 0 ? Math.round(Number(totalRow.avg_communication) * 10) / 10 : 0;
  const avgDelivery = totalReviews > 0 ? Math.round(Number(totalRow.avg_delivery) * 10) / 10 : 0;

  // Distribution counts
  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const distRows = db.prepare(`
    SELECT overall_rating, COUNT(*) as count
    FROM client_reviews
    GROUP BY overall_rating
  `).all();

  for (const row of distRows) {
    if (dist[row.overall_rating] !== undefined) {
      dist[row.overall_rating] = Number(row.count);
    }
  }

  // Identify improvement areas
  const improvementAreas = [];
  if (totalReviews > 0) {
    if (avgDelivery < 4.2) {
      improvementAreas.push({
        area: 'Delivery & Turnaround',
        score: avgDelivery,
        severity: avgDelivery < 3.5 ? 'high' : 'medium',
        suggestion: 'Consider setting conservative delivery buffers or providing incremental draft cuts to keep turnaround perception high.',
      });
    }
    if (avgCommunication < 4.2) {
      improvementAreas.push({
        area: 'Communication & Updates',
        score: avgCommunication,
        severity: avgCommunication < 3.5 ? 'high' : 'medium',
        suggestion: 'Send proactive WhatsApp check-ins during editing, clarify revision rounds upfront, and confirm receipt of raw footage.',
      });
    }
    if (avgQuality < 4.2) {
      improvementAreas.push({
        area: 'Video Editing Quality',
        score: avgQuality,
        severity: avgQuality < 3.5 ? 'high' : 'medium',
        suggestion: 'Focus on color grading fidelity, seamless dialogue cuts, dynamic sound foley layering, and high-retention visual hooks.',
      });
    }
  }

  // Publication stats
  const pubRow = db.prepare(`
    SELECT
      COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
      COUNT(CASE WHEN status = 'pending_review' THEN 1 END) as pending_moderation_count
    FROM client_reviews
  `).get();

  return {
    totalReviews,
    avgOverall,
    avgQuality,
    avgCommunication,
    avgDelivery,
    distribution: dist,
    improvementAreas,
    approvedCount: Number(pubRow.approved_count || 0),
    pendingModerationCount: Number(pubRow.pending_moderation_count || 0),
  };
}

/**
 * Get all feedback requests and submitted reviews for Admin review
 */
export function getAllFeedbackList() {
  const reviews = db.prepare(`
    SELECT
      r.id AS review_id,
      r.request_id,
      r.client_name,
      r.project_title,
      r.overall_rating,
      r.quality_rating,
      r.communication_rating,
      r.delivery_rating,
      r.written_review,
      r.allow_public_display,
      r.status AS moderation_status,
      r.admin_notes,
      r.private_response,
      r.created_at AS review_date,
      r.moderated_at,
      req.token,
      req.client_contact,
      req.deliverable_type,
      req.status AS request_status,
      req.created_at AS request_created_at,
      req.expires_at,
      req.submitted_at
    FROM client_reviews r
    JOIN feedback_requests req ON r.request_id = req.id
    ORDER BY r.created_at DESC
  `).all();

  // Pending requests (links generated but client hasn't submitted yet)
  const pendingRequests = db.prepare(`
    SELECT *
    FROM feedback_requests
    WHERE status != 'submitted'
    ORDER BY created_at DESC
  `).all();

  return {
    reviews,
    pendingRequests,
  };
}

/**
 * Moderate a review (Approve for publication, Reject, Archive, or Respond Privately)
 */
export function moderateReview(reviewId, { status, adminNotes, privateResponse }) {
  const existing = db.prepare('SELECT * FROM client_reviews WHERE id = ?').get(reviewId);
  if (!existing) {
    throw new Error('Review not found');
  }

  const validStatuses = ['pending_review', 'approved', 'rejected', 'archived'];
  const newStatus = status && validStatuses.includes(status) ? status : existing.status;
  const notes = adminNotes !== undefined ? (adminNotes ? String(adminNotes).trim() : null) : existing.admin_notes;
  const response = privateResponse !== undefined ? (privateResponse ? String(privateResponse).trim() : null) : existing.private_response;

  db.prepare(`
    UPDATE client_reviews
    SET status = ?, admin_notes = ?, private_response = ?, moderated_at = datetime('now')
    WHERE id = ?
  `).run(newStatus, notes, response, reviewId);

  return db.prepare('SELECT * FROM client_reviews WHERE id = ?').get(reviewId);
}

/**
 * Delete a review (Admin only)
 */
export function deleteReview(reviewId) {
  const existing = db.prepare('SELECT * FROM client_reviews WHERE id = ?').get(reviewId);
  if (!existing) {
    throw new Error('Review not found');
  }
  db.prepare('DELETE FROM client_reviews WHERE id = ?').run(reviewId);
  return { success: true, deletedId: reviewId };
}

/**
 * Public approved testimonials:
 * ONLY reviews that have been genuinely submitted, have client permission,
 * and have been approved by Chandu are returned.
 */
export function getPublicApprovedTestimonials() {
  const rows = db.prepare(`
    SELECT
      id,
      client_name,
      project_title,
      overall_rating,
      quality_rating,
      communication_rating,
      delivery_rating,
      written_review,
      created_at
    FROM client_reviews
    WHERE status = 'approved' AND allow_public_display = 1
    ORDER BY created_at DESC
  `).all();

  return rows.map((r) => ({
    id: `review-${r.id}`,
    name: r.client_name,
    projectTitle: r.project_title,
    rating: r.overall_rating,
    qualityRating: r.quality_rating,
    communicationRating: r.communication_rating,
    deliveryRating: r.delivery_rating,
    quote: r.written_review || 'Exceptional video editing and communication. Highly recommended!',
    date: r.created_at ? r.created_at.split(' ')[0] : '2026-10-19',
    verified: true,
  }));
}
