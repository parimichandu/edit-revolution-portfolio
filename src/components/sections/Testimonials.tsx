import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Quote, ShieldCheck, CheckCircle2, MessageSquare, Video, Clock } from 'lucide-react';
import { financialApi } from '../../services/financialApi';
import type { PublicTestimonialItem } from '../../types';

export const Testimonials: React.FC = () => {
  const [liveTestimonials, setLiveTestimonials] = useState<PublicTestimonialItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchApproved = async () => {
      try {
        const data = await financialApi.getPublicTestimonials();
        if (isMounted) {
          setLiveTestimonials(data);
        }
      } catch {
        if (isMounted) setLiveTestimonials([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchApproved();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section id="feedback" className="py-24 relative overflow-hidden bg-[#0A0A0D]/70">
      {/* Background ambient blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[300px] bg-cyan-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Client Ratings & Reviews</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-4">
            Trusted By Creators &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
              Modern Brands.
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Authentic, verified client feedback for completed video editing and AI creation projects.
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <ShieldCheck size={14} />
            <span>Verified Reviews Policy: Public testimonials are displayed only after genuine client submission & approval.</span>
          </div>
        </div>

        {/* Live Approved Testimonials */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
            <p className="text-xs text-zinc-500 font-mono">Loading verified reviews...</p>
          </div>
        ) : liveTestimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
            {liveTestimonials.map((t) => (
              <div
                key={t.id}
                className="relative rounded-2xl glass-card p-6 sm:p-7 flex flex-col justify-between border border-white/10 hover:border-indigo-500/40 transition-all duration-300 shadow-xl"
              >
                <div>
                  {/* Rating Header */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <CheckCircle2 size={11} />
                      Verified Client Project
                    </span>
                  </div>

                  {/* Quote */}
                  <div className="relative mb-5">
                    <Quote size={20} className="text-white/10 absolute -top-2 -left-2 pointer-events-none" />
                    <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed relative z-10 italic">
                      "{t.quote}"
                    </p>
                  </div>

                  {/* Category Ratings Breakdown */}
                  {(t.qualityRating || t.communicationRating || t.deliveryRating) && (
                    <div className="flex flex-wrap items-center gap-2 mb-4 text-[10px] font-mono text-zinc-400">
                      {t.qualityRating && (
                        <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                          <Video size={10} className="text-indigo-400" />
                          Quality: {t.qualityRating}★
                        </span>
                      )}
                      {t.communicationRating && (
                        <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                          <MessageSquare size={10} className="text-cyan-400" />
                          Comms: {t.communicationRating}★
                        </span>
                      )}
                      {t.deliveryRating && (
                        <span className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                          <Clock size={10} className="text-emerald-400" />
                          Delivery: {t.deliveryRating}★
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white font-['Outfit']">{t.name}</h4>
                    <p className="text-[11px] text-zinc-400 truncate max-w-[200px]">{t.projectTitle}</p>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{t.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State when no reviews are approved yet */
          <div className="max-w-xl mx-auto rounded-3xl bg-[#111116] border border-white/10 p-8 sm:p-10 text-center shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-4">
              <MessageSquare size={26} />
            </div>
            <h3 className="text-lg font-bold font-['Outfit'] text-white mb-2">
              Verified Client Reviews System Active
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-md mx-auto mb-5">
              Client testimonials on Edit Revolution are 100% genuine and require completion of an actual video project. Reviews will appear here immediately after a client submits feedback and it is approved.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-zinc-300 font-mono bg-white/[0.02] border border-white/5 py-2 px-4 rounded-xl w-fit mx-auto">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Zero fabricated ratings • Single-use client links</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
