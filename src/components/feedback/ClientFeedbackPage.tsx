import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Video,
  MessageSquare,
  Clock,
  ThumbsUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { financialApi } from '../../services/financialApi';
import type { FeedbackValidationResult } from '../../types';

interface ClientFeedbackPageProps {
  token: string;
  onBackToPortfolio: () => void;
}

interface StarPickerProps {
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  value: number;
  onChange: (val: number) => void;
}

const STAR_LABELS: Record<number, string> = {
  1: '1 - Needs Improvement',
  2: '2 - Fair',
  3: '3 - Good',
  4: '4 - Very Good',
  5: '5 - Exceptional / Flawless',
};

const StarPicker: React.FC<StarPickerProps> = ({
  label,
  description,
  icon: IconComponent,
  value,
  onChange,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  const activeStar = hovered ?? value;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 transition-all hover:border-indigo-500/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <IconComponent size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-['Outfit']">{label}</h4>
            <p className="text-[11px] text-zinc-400">{description}</p>
          </div>
        </div>

        {activeStar > 0 && (
          <span className="text-xs font-semibold text-amber-300 font-mono bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 self-start sm:self-auto">
            {STAR_LABELS[activeStar]}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 pt-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= activeStar;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(null)}
              className="p-1 rounded-lg transition-transform hover:scale-125 focus:outline-none cursor-pointer"
              aria-label={`Rate ${star} star`}
            >
              <Star
                size={28}
                className={`transition-colors ${
                  isFilled
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                    : 'text-zinc-600 hover:text-zinc-400'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ClientFeedbackPage: React.FC<ClientFeedbackPageProps> = ({
  token,
  onBackToPortfolio,
}) => {
  const [validation, setValidation] = useState<FeedbackValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [overallRating, setOverallRating] = useState<number>(5);
  const [qualityRating, setQualityRating] = useState<number>(5);
  const [communicationRating, setCommunicationRating] = useState<number>(5);
  const [deliveryRating, setDeliveryRating] = useState<number>(5);
  const [writtenReview, setWrittenReview] = useState<string>('');
  const [allowPublicDisplay, setAllowPublicDisplay] = useState<boolean>(true);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const checkToken = async () => {
      setIsLoading(true);
      try {
        const res = await financialApi.validateFeedbackToken(token);
        if (isMounted) {
          setValidation(res);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg = err instanceof Error ? err.message : 'Failed to validate link';
          setValidation({ valid: false, error: msg });
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    checkToken();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (
      overallRating < 1 ||
      qualityRating < 1 ||
      communicationRating < 1 ||
      deliveryRating < 1
    ) {
      setErrorMessage('Please select a star rating (1 to 5) for all categories.');
      return;
    }

    try {
      setIsSubmitting(true);
      await financialApi.submitClientFeedback({
        token,
        overallRating,
        qualityRating,
        communicationRating,
        deliveryRating,
        writtenReview: writtenReview.trim() || undefined,
        allowPublicDisplay,
      });

      setIsSubmittedSuccess(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366F1', '#06B6D4', '#10B981', '#F59E0B'],
        });
      } catch {
        // Confetti fallback
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to submit review';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#08080C] flex flex-col items-center justify-center p-6 text-white font-['Inter']">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
        <span className="text-sm font-medium text-zinc-400">
          Loading Edit Revolution Client Feedback Portal...
        </span>
      </div>
    );
  }

  // 2. Invalid / Expired / Already Submitted State
  if (!validation?.valid) {
    return (
      <div className="min-h-screen bg-[#08080C] flex items-center justify-center p-4 sm:p-6 text-white font-['Inter']">
        <div className="relative w-full max-w-lg rounded-3xl bg-[#111117] border border-white/10 p-7 sm:p-9 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
            {validation?.alreadySubmitted ? (
              <CheckCircle2 size={32} className="text-emerald-400" />
            ) : (
              <AlertCircle size={32} className="text-amber-400" />
            )}
          </div>

          <h2 className="text-2xl font-black font-['Outfit'] text-white mb-2">
            {validation?.alreadySubmitted ? 'Feedback Already Received' : 'Feedback Link Notice'}
          </h2>

          <p className="text-sm text-zinc-300 mb-6 leading-relaxed">
            {validation?.error || 'This link is not active or has reached its expiration limit.'}
          </p>

          <button
            onClick={onBackToPortfolio}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
          >
            <span>Visit Edit Revolution Portfolio</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  // 3. Submitted Success Screen
  if (isSubmittedSuccess) {
    return (
      <div className="min-h-screen bg-[#08080C] flex items-center justify-center p-4 sm:p-6 text-white font-['Inter']">
        <div className="relative w-full max-w-xl rounded-3xl bg-[#111117] border border-emerald-500/30 p-8 sm:p-10 shadow-[0_0_60px_rgba(16,185,129,0.15)] text-center animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
            <CheckCircle2 size={36} />
          </div>

          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Review Successfully Submitted
          </span>

          <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white mt-3 mb-2">
            Thank You, {validation.request?.clientName}!
          </h2>

          <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed mb-6">
            Your feedback for <strong className="text-white">"{validation.request?.projectTitle}"</strong> has been securely recorded. Your honest evaluation helps Edit Revolution continually sharpen video storytelling and deliver extraordinary results.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onBackToPortfolio}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-lg transition-all cursor-pointer"
            >
              <span>Explore Portfolio</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Main Feedback Form
  const req = validation.request!;

  return (
    <div className="min-h-screen bg-[#08080C] text-[#F8FAFC] font-['Inter'] py-12 px-4 sm:px-6 lg:px-8 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background ambient lighting */}
      <div className="fixed top-12 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        {/* Top Header Card */}
        <div className="rounded-3xl bg-[#111117]/90 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl mb-6">
          <div className="flex items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                <div className="w-full h-full bg-[#0E0E14] rounded-[10px] flex items-center justify-center">
                  <Sparkles size={18} className="text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="font-['Outfit'] font-black text-lg text-white">
                  EDIT REVOLUTION<span className="text-purple-400">.</span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-zinc-400 block -mt-1 uppercase">
                  Client Rating & Feedback
                </span>
              </div>
            </div>

            <button
              onClick={onBackToPortfolio}
              className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Exit to Portfolio
            </button>
          </div>

          <div className="mt-5">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Completed Project
              </span>
              <span className="text-xs font-mono text-zinc-400">
                • {req.deliverableType || 'Video Editing'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] text-white">
              {req.projectTitle}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Client: <strong className="text-zinc-200">{req.clientName}</strong>
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 flex items-center gap-2.5 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle size={18} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Rating Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Overall Experience */}
          <StarPicker
            label="1. Overall Experience"
            description="Your holistic satisfaction with the finished video and service experience"
            icon={ThumbsUp}
            value={overallRating}
            onChange={setOverallRating}
          />

          {/* 2. Video Editing Quality */}
          <StarPicker
            label="2. Video Editing Quality"
            description="Visual storytelling, dynamic pacing, hook retention, color grading & sound foley"
            icon={Video}
            value={qualityRating}
            onChange={setQualityRating}
          />

          {/* 3. Communication */}
          <StarPicker
            label="3. Communication & Responsiveness"
            description="Promptness, clear revision handling, and collaboration ease"
            icon={MessageSquare}
            value={communicationRating}
            onChange={setCommunicationRating}
          />

          {/* 4. Delivery & Speed */}
          <StarPicker
            label="4. Delivery & Turnaround Speed"
            description="Adherence to promised timelines, rapid draft cuts, and export delivery"
            icon={Clock}
            value={deliveryRating}
            onChange={setDeliveryRating}
          />

          {/* 5. Written Review */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <label className="block text-sm font-bold text-white font-['Outfit'] mb-1">
              5. Written Feedback / Review (Optional)
            </label>
            <p className="text-[11px] text-zinc-400 mb-3">
              What stood out most about the video edits, engagement, or results? Any suggestions?
            </p>
            <textarea
              rows={4}
              value={writtenReview}
              onChange={(e) => setWrittenReview(e.target.value)}
              placeholder="e.g. The pacing and sound design in the first 3 seconds were incredible. Client engagement jumped 40% on this reel!"
              className="w-full px-4 py-3 rounded-xl bg-[#0B0B10] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* 6. Permission to Display Publicly */}
          <div className="p-5 rounded-2xl bg-indigo-500/[0.05] border border-indigo-500/20">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={allowPublicDisplay}
                onChange={(e) => setAllowPublicDisplay(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-white/20 text-indigo-600 focus:ring-indigo-500 bg-[#0B0B10] cursor-pointer"
              />
              <div className="text-xs text-zinc-300 leading-relaxed">
                <span className="font-semibold text-white block">
                  Allow this review to be displayed publicly as a portfolio testimonial
                </span>
                <span className="text-zinc-400 block mt-0.5">
                  If selected, your review quote, name, and project may appear on the Edit Revolution portfolio after admin verification. If unchecked, your review remains 100% private for Chandu's internal eyes only.
                </span>
              </div>
            </label>
          </div>

          {/* Security & Anti-Spam Notice */}
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 px-2">
            <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            <span>Single-use cryptographic link. Duplicate submissions are automatically prevented.</span>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send size={16} />
              <span>{isSubmitting ? 'Submitting Your Review...' : 'Submit Feedback'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
