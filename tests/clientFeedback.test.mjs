import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../server/db.mjs';
import {
  createFeedbackRequest,
  validateFeedbackToken,
  submitClientFeedback,
  getFeedbackStats,
  getAllFeedbackList,
  moderateReview,
  deleteReview,
  getPublicApprovedTestimonials,
} from '../server/feedbackService.mjs';

test('Feedback Token Generation: unique, difficult-to-guess cryptographic link with expiry', () => {
  // Rejects invalid inputs
  assert.throws(() => createFeedbackRequest({ client_name: '', project_title: 'Reel' }), /Client name is required/);
  assert.throws(() => createFeedbackRequest({ client_name: 'Tarun Dental', project_title: '' }), /Project title is required/);

  // Generates valid link
  const req = createFeedbackRequest({
    client_name: 'Tarun Dental Clinic',
    client_contact: '+91 98765 43210',
    project_title: 'Dental Implants Awareness Reel',
    deliverable_type: 'Instagram Reel',
    expiry_days: 14,
    baseUrl: 'http://localhost:5173',
  });

  assert.ok(req.token, 'Must generate token');
  assert.equal(req.token.length, 48, 'Must be a 48-char secure hex token');
  assert.ok(req.feedbackUrl.includes(`token=${req.token}`), 'URL must contain token parameter');
  assert.ok(req.whatsappShareUrl.includes('wa.me'), 'Must generate WhatsApp share link');

  // Verify token validation
  const validation = validateFeedbackToken(req.token);
  assert.equal(validation.valid, true, 'Active token must validate');
  assert.equal(validation.request.clientName, 'Tarun Dental Clinic');
  assert.equal(validation.request.projectTitle, 'Dental Implants Awareness Reel');

  // Rejects fake token
  const fakeValidation = validateFeedbackToken('fake-token-1234567890');
  assert.equal(fakeValidation.valid, false, 'Non-existent token must be invalid');
});

test('Feedback Submission: rating validation, written review, and public consent', () => {
  const req = createFeedbackRequest({
    client_name: 'Klook Travel Team',
    project_title: 'Travel Adventure Vertical Short',
    deliverable_type: 'YouTube Shorts',
    baseUrl: 'http://localhost:5173',
  });

  // Rejects invalid star ratings (e.g. 0 or 6)
  assert.throws(
    () =>
      submitClientFeedback({
        token: req.token,
        overallRating: 6,
        qualityRating: 5,
        communicationRating: 5,
        deliveryRating: 5,
      }),
    /between 1 and 5 stars/
  );

  assert.throws(
    () =>
      submitClientFeedback({
        token: req.token,
        overallRating: 5,
        qualityRating: 0,
        communicationRating: 5,
        deliveryRating: 5,
      }),
    /between 1 and 5 stars/
  );

  // Valid submission with consent
  const submission = submitClientFeedback({
    token: req.token,
    overallRating: 5,
    qualityRating: 5,
    communicationRating: 4,
    deliveryRating: 5,
    writtenReview: 'Outstanding visual pacing, dynamic subtitles, and lightning-fast turnaround!',
    allowPublicDisplay: true,
  });

  assert.equal(submission.success, true);
  assert.ok(submission.reviewId);

  // Prevent duplicate submissions with the same token!
  assert.throws(
    () =>
      submitClientFeedback({
        token: req.token,
        overallRating: 5,
        qualityRating: 5,
        communicationRating: 5,
        deliveryRating: 5,
      }),
    /already been submitted/
  );
});

test('Feedback Moderation & Public Testimonials Publication Workflow', () => {
  // Clear reviews for clean state
  db.exec('DELETE FROM client_reviews;');
  db.exec('DELETE FROM feedback_requests;');

  // Before any submission, public testimonials must be empty
  let publicTestimonials = getPublicApprovedTestimonials();
  assert.equal(publicTestimonials.length, 0, 'No unapproved or unsubmitted reviews should be public');

  // Client A: submits review with public consent
  const reqA = createFeedbackRequest({
    client_name: 'Studio Alpha',
    project_title: 'Luxury Brand Commercial',
    deliverable_type: 'Promotional Video',
  });

  const subA = submitClientFeedback({
    token: reqA.token,
    overallRating: 5,
    qualityRating: 5,
    communicationRating: 5,
    deliveryRating: 5,
    writtenReview: 'Chandu turned our raw footage into a cinema-grade commercial. Highly recommended!',
    allowPublicDisplay: true,
  });

  // Review is pending moderation -> MUST NOT appear publicly yet!
  publicTestimonials = getPublicApprovedTestimonials();
  assert.equal(publicTestimonials.length, 0, 'Pending review must not appear on public portfolio');

  // Client B: submits review with NO public consent
  const reqB = createFeedbackRequest({
    client_name: 'Private Client Beta',
    project_title: 'Confidential Internal Video',
    deliverable_type: 'Motion Graphics',
  });

  const subB = submitClientFeedback({
    token: reqB.token,
    overallRating: 4,
    qualityRating: 4,
    communicationRating: 3,
    deliveryRating: 4,
    writtenReview: 'Great edit, but please keep this internal.',
    allowPublicDisplay: false, // NO public display
  });

  // Admin reviews feedback list
  const list = getAllFeedbackList();
  assert.equal(list.reviews.length, 2, 'Admin must see all 2 reviews');

  // Chandu moderates Client A's review: Approves it
  moderateReview(subA.reviewId, {
    status: 'approved',
    adminNotes: 'Verified client project with permission to publish.',
    privateResponse: 'Thank you for the wonderful feedback! Looking forward to our next project.',
  });

  // Chandu moderates Client B's review: Approves it internally
  moderateReview(subB.reviewId, {
    status: 'approved',
    adminNotes: 'Client requested private only, respect consent.',
  });

  // Now check public testimonials
  publicTestimonials = getPublicApprovedTestimonials();
  assert.equal(publicTestimonials.length, 1, 'Only Client A (approved + consent) must appear publicly');
  assert.equal(publicTestimonials[0].name, 'Studio Alpha');
  assert.equal(publicTestimonials[0].rating, 5);
  assert.ok(publicTestimonials[0].quote.includes('cinema-grade commercial'));

  // Ensure Client B (no public consent) is NOT displayed
  const foundB = publicTestimonials.find((t) => t.name === 'Private Client Beta');
  assert.equal(foundB, undefined, 'Client without public permission must never be exposed');

  // Verify Stats & Improvement Areas calculation
  const stats = getFeedbackStats();
  assert.equal(stats.totalReviews, 2);
  assert.equal(stats.approvedCount, 2);
  // Average overall: (5 + 4) / 2 = 4.5
  assert.equal(stats.avgOverall, 4.5);
  // Average communication: (5 + 3) / 2 = 4.0 (< 4.2 -> should flag improvement area)
  assert.equal(stats.avgCommunication, 4.0);
  assert.ok(stats.improvementAreas.some((a) => a.area.includes('Communication')));

  // Clean up
  deleteReview(subA.reviewId);
  deleteReview(subB.reviewId);
});
