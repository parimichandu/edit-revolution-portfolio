import React, { useState, useEffect, useCallback } from 'react';
import {
  Star,
  MessageSquare,
  Link2,
  Copy,
  Check,
  Share2,
  ShieldAlert,
  Clock,
  Trash2,
  CheckCircle,
  XCircle,
  Plus,
  RefreshCw,
  Video,
  X,
  Lock,
  Globe,
} from 'lucide-react';
import { financialApi } from '../../services/financialApi';
import type {
  ClientReview,
  FeedbackRequest,
  FeedbackStats,
} from '../../types';

export const FeedbackManagementSection: React.FC = () => {
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [reviews, setReviews] = useState<ClientReview[]>([]);
  const [pendingRequests, setPendingRequests] = useState<FeedbackRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Link Generator State
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [deliverableType, setDeliverableType] = useState('Instagram Reels');
  const [expiryDays, setExpiryDays] = useState('30');
  const [generatedLinkData, setGeneratedLinkData] = useState<{
    feedbackUrl: string;
    whatsappShareUrl: string;
    token: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Private Response / Moderation Modal State
  const [selectedReviewForResponse, setSelectedReviewForResponse] = useState<ClientReview | null>(null);
  const [privateResponseText, setPrivateResponseText] = useState('');
  const [adminNotesText, setAdminNotesText] = useState('');
  const [isSavingModeration, setIsSavingModeration] = useState(false);

  const loadFeedbackData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, listData] = await Promise.all([
        financialApi.getFeedbackStats(),
        financialApi.getFeedbackList(),
      ]);
      setStats(statsData);
      setReviews(listData.reviews);
      setPendingRequests(listData.pendingRequests);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load feedback';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeedbackData();
  }, [loadFeedbackData]);

  // Handle Link Generation
  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !projectTitle) return;
    setIsGenerating(true);
    try {
      const res = await financialApi.createFeedbackLink({
        client_name: clientName.trim(),
        client_contact: clientContact.trim() || undefined,
        project_title: projectTitle.trim(),
        deliverable_type: deliverableType,
        expiry_days: parseInt(expiryDays, 10) || 30,
      });

      setGeneratedLinkData({
        feedbackUrl: res.request.feedbackUrl,
        whatsappShareUrl: res.request.whatsappShareUrl,
        token: res.request.token,
      });
      loadFeedbackData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate link';
      alert(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Moderation Handlers
  const handleSetModerationStatus = async (
    reviewId: number,
    status: 'approved' | 'rejected' | 'archived'
  ) => {
    try {
      await financialApi.moderateReview(reviewId, { status });
      loadFeedbackData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Moderation failed';
      alert(msg);
    }
  };

  const handleOpenPrivateResponseModal = (review: ClientReview) => {
    setSelectedReviewForResponse(review);
    setPrivateResponseText(review.private_response || '');
    setAdminNotesText(review.admin_notes || '');
  };

  const handleSavePrivateResponse = async () => {
    if (!selectedReviewForResponse) return;
    setIsSavingModeration(true);
    try {
      await financialApi.moderateReview(selectedReviewForResponse.review_id, {
        privateResponse: privateResponseText.trim() || undefined,
        adminNotes: adminNotesText.trim() || undefined,
      });
      setSelectedReviewForResponse(null);
      loadFeedbackData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save notes';
      alert(msg);
    } finally {
      setIsSavingModeration(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!window.confirm('Are you sure you want to delete this review permanently?')) return;
    try {
      await financialApi.deleteReview(reviewId);
      loadFeedbackData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      alert(msg);
    }
  };

  return (
    <div className="rounded-3xl bg-[#121217]/90 border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Star size={22} className="fill-amber-400/20" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-['Outfit'] text-white">
              Client Rating & Feedback Moderation
            </h3>
            <p className="text-xs text-zinc-400">
              Track client satisfaction, generate unique project feedback links, and curate verified testimonials.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => loadFeedbackData()}
            title="Refresh reviews"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={() => {
              setGeneratedLinkData(null);
              setClientName('');
              setClientContact('');
              setProjectTitle('');
              setIsGenerateModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Plus size={15} />
            <span>Create Client Feedback Link</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* 1. Analytics & Scorecards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Overall Average */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span>Overall Average Rating</span>
              <Star size={16} className="text-amber-400 fill-amber-400" />
            </div>
            <div>
              <div className="text-3xl font-black font-['Outfit'] text-white flex items-baseline gap-1.5">
                <span>{stats.totalReviews > 0 ? stats.avgOverall : '0.0'}</span>
                <span className="text-xs text-zinc-400 font-normal">/ 5.0</span>
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Based on {stats.totalReviews} genuine client review{stats.totalReviews === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* Quality Average */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span>Editing Quality</span>
              <Video size={16} className="text-indigo-400" />
            </div>
            <div>
              <div className="text-3xl font-black font-['Outfit'] text-indigo-300 flex items-baseline gap-1.5">
                <span>{stats.totalReviews > 0 ? stats.avgQuality : '0.0'}</span>
                <span className="text-xs text-zinc-400 font-normal">/ 5.0</span>
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Pacing, color grade & sound foley
              </span>
            </div>
          </div>

          {/* Communication Average */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span>Communication</span>
              <MessageSquare size={16} className="text-cyan-400" />
            </div>
            <div>
              <div className="text-3xl font-black font-['Outfit'] text-cyan-300 flex items-baseline gap-1.5">
                <span>{stats.totalReviews > 0 ? stats.avgCommunication : '0.0'}</span>
                <span className="text-xs text-zinc-400 font-normal">/ 5.0</span>
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Revision responsiveness & clarity
              </span>
            </div>
          </div>

          {/* Delivery Average */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between text-zinc-400 text-xs mb-2">
              <span>Delivery & Speed</span>
              <Clock size={16} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-3xl font-black font-['Outfit'] text-emerald-300 flex items-baseline gap-1.5">
                <span>{stats.totalReviews > 0 ? stats.avgDelivery : '0.0'}</span>
                <span className="text-xs text-zinc-400 font-normal">/ 5.0</span>
              </div>
              <span className="text-[11px] text-zinc-400 mt-1 block">
                Timeliness & turnaround compliance
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. Improvement Areas Alert Banner */}
      {stats && stats.improvementAreas.length > 0 && (
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <ShieldAlert size={18} />
            </div>
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Actionable Improvement Insights
              </h4>
              {stats.improvementAreas.map((item, idx) => (
                <div key={idx} className="text-xs text-zinc-300 leading-relaxed">
                  <strong className="text-white">{item.area} ({item.score}/5):</strong>{' '}
                  {item.suggestion}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Client Reviews List & Moderation Table */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-white font-['Outfit']">
            Submitted Client Reviews ({reviews.length})
          </h4>
          <span className="text-xs text-zinc-400">
            {stats?.approvedCount || 0} Published to Portfolio • {stats?.pendingModerationCount || 0} Awaiting Moderation
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              <tr>
                <th className="pb-3 pl-2">Status</th>
                <th className="pb-3">Client & Project</th>
                <th className="pb-3">Ratings (Overall / Q / C / D)</th>
                <th className="pb-3">Written Review</th>
                <th className="pb-3">Public Permission</th>
                <th className="pb-3 text-right pr-2">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-zinc-500">
                    No client reviews submitted yet. Use "Create Client Feedback Link" to send an invite to your first client!
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <tr key={r.review_id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Status Badge */}
                    <td className="py-4 pl-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                          r.moderation_status === 'approved'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : r.moderation_status === 'pending_review'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-zinc-700/30 text-zinc-400 border-zinc-700/50'
                        }`}
                      >
                        {r.moderation_status === 'approved' ? (
                          <>
                            <CheckCircle size={11} />
                            Published
                          </>
                        ) : r.moderation_status === 'pending_review' ? (
                          <>
                            <Clock size={11} />
                            Pending Review
                          </>
                        ) : (
                          <>
                            <XCircle size={11} />
                            {r.moderation_status}
                          </>
                        )}
                      </span>
                    </td>

                    {/* Client & Project */}
                    <td className="py-4">
                      <div className="font-bold text-white text-xs">{r.client_name}</div>
                      <div className="text-[11px] text-zinc-400 truncate max-w-xs">{r.project_title}</div>
                      <span className="text-[10px] font-mono text-zinc-500">{r.review_date.split(' ')[0]}</span>
                    </td>

                    {/* Ratings */}
                    <td className="py-4">
                      <div className="flex items-center gap-1 text-amber-400 font-bold text-xs mb-1">
                        <Star size={13} className="fill-amber-400" />
                        <span>{r.overall_rating}.0</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono space-x-1.5">
                        <span title="Video Editing Quality">Q: {r.quality_rating}★</span>
                        <span title="Communication">C: {r.communication_rating}★</span>
                        <span title="Delivery Speed">D: {r.delivery_rating}★</span>
                      </div>
                    </td>

                    {/* Written Review */}
                    <td className="py-4 max-w-xs">
                      {r.written_review ? (
                        <p className="text-xs text-zinc-300 italic line-clamp-2">
                          "{r.written_review}"
                        </p>
                      ) : (
                        <span className="text-zinc-500 italic text-[11px]">No written text</span>
                      )}

                      {r.private_response && (
                        <div className="mt-1 text-[10px] text-indigo-400 bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20">
                          <strong>Private Response:</strong> {r.private_response}
                        </div>
                      )}
                    </td>

                    {/* Public Consent */}
                    <td className="py-4">
                      {r.allow_public_display === 1 ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px] font-medium">
                          <Globe size={13} />
                          Allowed Public
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-zinc-500 text-[11px] font-medium">
                          <Lock size={12} />
                          Private Only
                        </span>
                      )}
                    </td>

                    {/* Moderation Actions */}
                    <td className="py-4 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        {r.allow_public_display === 1 && r.moderation_status !== 'approved' && (
                          <button
                            onClick={() => handleSetModerationStatus(r.review_id, 'approved')}
                            title="Approve & Publish to Portfolio Testimonials"
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                        )}

                        {r.moderation_status === 'approved' && (
                          <button
                            onClick={() => handleSetModerationStatus(r.review_id, 'rejected')}
                            title="Unpublish from Public Testimonials"
                            className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[11px] transition-colors cursor-pointer"
                          >
                            Unpublish
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenPrivateResponseModal(r)}
                          title="Add private reply or notes"
                          className="p-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          <MessageSquare size={13} />
                        </button>

                        <button
                          onClick={() => handleDeleteReview(r.review_id)}
                          title="Delete Review"
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Active / Pending Client Requests List */}
      {pendingRequests.length > 0 && (
        <div className="pt-6 border-t border-white/10">
          <h4 className="text-sm font-bold text-white font-['Outfit'] mb-3">
            Active Feedback Links Awaiting Client Response ({pendingRequests.length})
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-white">{req.client_name}</div>
                  <div className="text-[11px] text-zinc-400 truncate max-w-xs">{req.project_title}</div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-1">
                    Expires: {req.expires_at ? req.expires_at.split('T')[0] : 'In 30 days'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/#feedback?token=${req.token}`;
                      handleCopy(url);
                    }}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    title="Copy Link"
                  >
                    <Copy size={14} />
                  </button>

                  {req.client_contact && (
                    <a
                      href={`https://wa.me/${req.client_contact.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hi ${req.client_name}! Please share your quick feedback on "${req.project_title}" here: ${window.location.origin}/#feedback?token=${req.token}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                      title="Send via WhatsApp"
                    >
                      <Share2 size={14} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Generate Client Feedback Link */}
      {isGenerateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#14141B] border border-white/15 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                  <Link2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Outfit'] text-white">
                    Create Client Feedback Link
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Generate a single-use secure link for a delivered video project.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsGenerateModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {generatedLinkData ? (
              <div className="space-y-4 animate-fadeIn">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                  <CheckCircle size={18} className="shrink-0" />
                  <span>Unique client feedback link generated successfully!</span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Feedback URL
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={generatedLinkData.feedbackUrl}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-zinc-300 font-mono text-xs select-all"
                    />
                    <button
                      onClick={() => handleCopy(generatedLinkData.feedbackUrl)}
                      className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
                    >
                      {copiedLink ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={generatedLinkData.whatsappShareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-2 transition-all"
                  >
                    <Share2 size={15} />
                    <span>Send Invite via WhatsApp</span>
                  </a>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setIsGenerateModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Tarun Dental Clinic / Aura Acoustics"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Project Deliverable Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Dental Implants & Care Awareness Reel"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Client Contact (WhatsApp / Phone)
                    </label>
                    <input
                      type="text"
                      value={clientContact}
                      onChange={(e) => setClientContact(e.target.value)}
                      placeholder="+91 78423 94026"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                      Deliverable Category
                    </label>
                    <select
                      value={deliverableType}
                      onChange={(e) => setDeliverableType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Instagram Reels">Instagram Reels</option>
                      <option value="YouTube Shorts">YouTube Shorts</option>
                      <option value="Promotional Video">Promotional Video</option>
                      <option value="AI Video Creation">AI Video Creation</option>
                      <option value="Motion Graphics">Motion Graphics</option>
                      <option value="Cinematic Edits">Cinematic Edits</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Link Expiration Window
                  </label>
                  <select
                    value={expiryDays}
                    onChange={(e) => setExpiryDays(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="7">7 Days</option>
                    <option value="14">14 Days</option>
                    <option value="30">30 Days (Recommended)</option>
                    <option value="60">60 Days</option>
                  </select>
                </div>

                <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsGenerateModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Link2 size={15} />
                    <span>{isGenerating ? 'Generating...' : 'Create Feedback Link'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Private Response & Admin Notes Modal */}
      {selectedReviewForResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#14141B] border border-white/15 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div>
                <h3 className="text-lg font-bold font-['Outfit'] text-white">
                  Private Response & Notes
                </h3>
                <p className="text-xs text-zinc-400">
                  Review for "{selectedReviewForResponse.project_title}" ({selectedReviewForResponse.client_name})
                </p>
              </div>

              <button
                onClick={() => setSelectedReviewForResponse(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Private Follow-up Response (Logged for Client Record)
                </label>
                <textarea
                  rows={3}
                  value={privateResponseText}
                  onChange={(e) => setPrivateResponseText(e.target.value)}
                  placeholder="e.g. Thank you Tarun! Appreciate the note regarding revision speed. We have streamlined the export timeline."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Internal Admin Notes (Chandu's Eyes Only)
                </label>
                <textarea
                  rows={2}
                  value={adminNotesText}
                  onChange={(e) => setAdminNotesText(e.target.value)}
                  placeholder="e.g. Excellent client, offered retainer for 8 reels monthly starting November."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-xs focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedReviewForResponse(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSavingModeration}
                  onClick={handleSavePrivateResponse}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSavingModeration ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
