import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight, Calculator, Flame } from 'lucide-react';

interface PricingCalculatorProps {
  onSelectTierForQuote: (tierTitle: string, estimatedPrice?: string) => void;
}

export const PricingCalculator: React.FC<PricingCalculatorProps> = ({ onSelectTierForQuote }) => {
  // Calculator state
  const [reelCount, setReelCount] = useState<number>(5);
  const [includeSoundDesign, setIncludeSoundDesign] = useState<boolean>(true);
  const [includeRushDelivery, setIncludeRushDelivery] = useState<boolean>(false);
  const [includeAIHooks, setIncludeAIHooks] = useState<boolean>(true);

  // Dynamic pricing calculation
  // Base: ₹400/reel. If reelCount >= 10, discount to ₹350/reel. If reelCount >= 20, discount to ₹320/reel.
  const ratePerReel = reelCount >= 20 ? 320 : reelCount >= 10 ? 350 : 400;
  const baseTotal = reelCount * ratePerReel;
  const soundAddon = includeSoundDesign ? reelCount * 60 : 0;
  const aiAddon = includeAIHooks ? reelCount * 40 : 0;
  const rushAddon = includeRushDelivery ? 500 : 0;
  const calculatedTotal = baseTotal + soundAddon + aiAddon + rushAddon;
  const savings = (reelCount * 400) - baseTotal;

  const handleBookCalculated = () => {
    const summary = `${reelCount} Reels Package (~₹${calculatedTotal.toLocaleString('en-IN')})`;
    onSelectTierForQuote(summary, `₹${calculatedTotal.toLocaleString('en-IN')}`);
  };

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Transparent Investment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-4">
            Simple, Transparent{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
              Pricing.
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            No hidden fees. Just crisp, high-retention edits that respect your creative vision and budget.
          </p>
        </div>

        {/* 3 Main Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Card 1: Starter Single Reel */}
          <div className="rounded-2xl glass-card border border-white/10 p-7 flex flex-col justify-between hover:border-white/20 transition-all hover:-translate-y-1">
            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-zinc-400 mb-2">Single Video</div>
              <h3 className="text-xl font-bold text-white font-['Outfit'] mb-1">Starter Reel / Short</h3>
              <p className="text-xs text-zinc-400 mb-6">Perfect for testing my editing style or sporadic high-priority posts.</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
                  ₹400
                </span>
                <span className="text-xs text-zinc-400 font-mono">/ reel</span>
              </div>

              <div className="space-y-2.5 pt-6 border-t border-white/10 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Hook cut & tight pacing elimination</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Dynamic animated subtitles</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Basic color correction</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>1 round of revisions included</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>48h delivery</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectTierForQuote('Starter Reel (₹400/reel)', '₹400')}
              className="mt-8 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
            >
              Order Single Reel
            </button>
          </div>

          {/* Card 2: Creator Growth Pack (MOST POPULAR) */}
          <div className="relative rounded-2xl glass-card border-2 border-indigo-500/60 p-7 flex flex-col justify-between shadow-[0_0_40px_rgba(99,102,241,0.25)] hover:border-indigo-400 transition-all hover:-translate-y-2">
            {/* Popular Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-cyan-500 text-white text-[11px] font-bold font-mono tracking-wide uppercase shadow-lg flex items-center gap-1.5">
              <Flame size={13} className="text-amber-300 fill-amber-300" />
              <span>Most Popular Creator Pack</span>
            </div>

            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-indigo-400 mb-2">Monthly Batch</div>
              <h3 className="text-2xl font-bold text-white font-['Outfit'] mb-1">Creator 10-Reels Pack</h3>
              <p className="text-xs text-zinc-300 mb-6">Designed for consistent creators looking to explode on IG & YT algorithms.</p>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-cyan-300 font-['Space_Grotesk']">
                  ₹3,500
                </span>
                <span className="text-xs text-zinc-400 font-mono">for 10 reels (₹350/reel)</span>
              </div>

              <div className="space-y-2.5 pt-6 border-t border-white/10 text-xs text-zinc-200">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-cyan-400" />
                  <span className="font-semibold text-white">Full sound architecture & micro-foley</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-cyan-400" />
                  <span>Cinematic color grading & LUT pass</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-cyan-400" />
                  <span>Meme / B-roll research & insertion</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-cyan-400" />
                  <span>Thumbnail frame optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-cyan-400" />
                  <span>Priority 24-36h turnaround batching</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-cyan-400" />
                  <span>2 rounds of revisions per reel</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectTierForQuote('Creator 10-Reels Pack (₹3,500)', '₹3,500')}
              className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-[0_0_25px_rgba(99,102,241,0.5)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Get 10-Reels Pack</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 3: Custom Commercial & Long-Form */}
          <div className="rounded-2xl glass-card border border-white/10 p-7 flex flex-col justify-between hover:border-white/20 transition-all hover:-translate-y-1">
            <div>
              <div className="text-xs uppercase font-mono tracking-wider text-zinc-400 mb-2">Bespoke Production</div>
              <h3 className="text-xl font-bold text-white font-['Outfit'] mb-1">Promotional, AI & Complex Projects</h3>
              <p className="text-xs text-zinc-400 mb-6">Custom quotes tailored for promotional brand videos, AI video creations, motion graphics, and multi-cam productions.</p>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl sm:text-4xl font-extrabold text-white font-['Space_Grotesk']">
                  Custom
                </span>
                <span className="text-xs text-zinc-400 font-mono">/ scoped quote</span>
              </div>

              <div className="space-y-2.5 pt-6 border-t border-white/10 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Multi-cam sync & podcast cuts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>4K ProRes / Master Color Grading</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Licensed commercial score & sound mix</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Custom kinetic 2D/3D motion graphics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-emerald-400" />
                  <span>Dedicated Slack/WhatsApp channel</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectTierForQuote('Custom Commercial / Long-Form (Custom Quote)', 'Custom')}
              className="mt-8 w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-all cursor-pointer"
            >
              Discuss Custom Project
            </button>
          </div>
        </div>

        {/* Interactive Live Price Estimator */}
        <div className="rounded-2xl glass-card border border-indigo-500/30 p-6 sm:p-8 shadow-2xl bg-gradient-to-br from-[#141418] to-[#0D0D11]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Calculator size={20} />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white font-['Outfit']">
                  Interactive Volume Estimator
                </h3>
                <p className="text-xs text-zinc-400">
                  Select your exact video quantity & optional features for an instant tailored quote.
                </p>
              </div>
            </div>

            {savings > 0 && (
              <div className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold self-start md:self-auto">
                🎉 Volume discount applied: Save ₹{savings.toLocaleString('en-IN')}!
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Slider & Options */}
            <div className="lg:col-span-7 space-y-6">
              {/* Slider */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-zinc-300 font-medium">How many Reels / Shorts do you need?</span>
                  <span className="font-mono font-bold text-cyan-400 text-base">
                    {reelCount} {reelCount === 1 ? 'Reel' : 'Reels'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={reelCount}
                  onChange={(e) => setReelCount(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                  <span>1 Reel (₹400)</span>
                  <span>10 Reels (₹350/ea)</span>
                  <span>20+ Reels (₹320/ea)</span>
                </div>
              </div>

              {/* Addon Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setIncludeSoundDesign(!includeSoundDesign)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    includeSoundDesign
                      ? 'bg-indigo-500/15 border-indigo-500/50 text-white'
                      : 'bg-white/5 border-white/5 text-zinc-400'
                  }`}
                >
                  <div className="text-xs font-bold font-['Outfit'] mb-0.5">Sound Architecture</div>
                  <div className="text-[10px] font-mono text-cyan-300">+₹60/reel</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIncludeAIHooks(!includeAIHooks)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    includeAIHooks
                      ? 'bg-indigo-500/15 border-indigo-500/50 text-white'
                      : 'bg-white/5 border-white/5 text-zinc-400'
                  }`}
                >
                  <div className="text-xs font-bold font-['Outfit'] mb-0.5">AI Visual Hooks</div>
                  <div className="text-[10px] font-mono text-cyan-300">+₹40/reel</div>
                </button>

                <button
                  type="button"
                  onClick={() => setIncludeRushDelivery(!includeRushDelivery)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    includeRushDelivery
                      ? 'bg-indigo-500/15 border-indigo-500/50 text-white'
                      : 'bg-white/5 border-white/5 text-zinc-400'
                  }`}
                >
                  <div className="text-xs font-bold font-['Outfit'] mb-0.5">24h Express Rush</div>
                  <div className="text-[10px] font-mono text-cyan-300">+₹500 flat</div>
                </button>
              </div>
            </div>

            {/* Price Output & Lock-In Button */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-black/60 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-mono text-zinc-400">Estimated Total</span>
                <div className="text-3xl sm:text-4xl font-black text-white font-['Space_Grotesk'] my-1">
                  ₹{calculatedTotal.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-zinc-400 font-mono">
                  Approx. ₹{Math.round(calculatedTotal / reelCount)} per reel (all inclusions)
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={handleBookCalculated}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Lock In This Custom Quote</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
