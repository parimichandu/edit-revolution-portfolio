import React from 'react';
import { Sparkles, Zap, Headphones, Compass, ShieldCheck, Flame, MapPin, CheckCircle2 } from 'lucide-react';
import { SITE_CONFIG, CONTACTS } from '../../constants';

export const About: React.FC = () => {
  const differentiators = [
    {
      icon: Zap,
      title: "Retention-First Pacing",
      desc: "Every frame and word is auditioned for attention. No dead air, no awkward pauses, and zero fluff.",
      accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      icon: Headphones,
      title: "Deep Sound Architecture",
      desc: "80% of video emotion comes from sound. I layer sub-bass hits, risers, whooshes, and micro-foley.",
      accent: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      icon: Compass,
      title: "Bilingual Telugu & English Nuance",
      desc: "Native understanding of Telugu cinema mass elevations & punch dialogue rhythm alongside global English trends.",
      accent: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      icon: ShieldCheck,
      title: "Reliable 24-48h Delivery",
      desc: "Consistency is king for creators. Clean timelines, structured milestones, and rapid turnarounds.",
      accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#0C0C0F]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Real Profile Photo Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Subtle Purple & Indigo Lighting Aura */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-purple-600/35 via-indigo-600/30 to-cyan-500/20 rounded-3xl blur-2xl opacity-40 animate-pulse pointer-events-none" />

              {/* Main Card with Polished Border */}
              <div className="relative rounded-2xl glass-card border border-purple-500/20 hover:border-purple-500/40 overflow-hidden p-6 shadow-[0_10px_40px_rgba(0,0,0,0.7)] transition-all duration-300">
                {/* Real Profile Photo Container */}
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-6 bg-black border border-white/10 shadow-inner group">
                  <img
                    src="/images/chandu-profile.jpg"
                    alt="Chandu — Founder & Lead Video Editor at Edit Revolution"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      // Fallback in case of image load issue
                      const target = e.currentTarget;
                      if (!target.src.includes('profile.jpg')) {
                        target.src = '/images/profile.jpg';
                      }
                    }}
                  />
                  {/* Subtle cinematic gradient vignette at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-lg">
                    <Flame size={13} className="text-purple-400" />
                    <span>Founder & Video Creator</span>
                  </div>

                  {/* Floating Live Status Indicator */}
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      <span>Open for New Projects</span>
                    </div>
                    <span className="text-zinc-400">Freelance</span>
                  </div>
                </div>

                {/* Profile Summary */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-white font-['Outfit'] tracking-tight flex items-center gap-2">
                        <span>{SITE_CONFIG.name}</span>
                        <CheckCircle2 size={18} className="text-cyan-400" />
                      </h3>
                      <p className="text-xs text-purple-300 font-medium">{SITE_CONFIG.professionalTitle}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-purple-300 font-semibold bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 font-mono">
                        2 Years Experience
                      </span>
                    </div>
                  </div>

                  {/* General Professional Location */}
                  <div className="flex items-start gap-2.5 text-xs text-zinc-300 bg-white/[0.03] p-3 rounded-xl border border-white/5">
                    <MapPin size={16} className="text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] uppercase tracking-wider font-mono text-zinc-400">Professional Location</div>
                      <div className="text-xs text-zinc-200 font-medium mt-0.5 leading-snug">
                        {CONTACTS.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Exact Introduction */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles size={13} />
              <span>About Me & Edit Revolution</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit'] text-white tracking-tight leading-tight mb-6">
              Your Vision.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">
                My Editing. Extraordinary Results.
              </span>
            </h2>

            {/* Exact Introduction per User Specification */}
            <div className="space-y-4 mb-8">
              <div className="p-5 sm:p-6 rounded-2xl glass-card border border-purple-500/20 bg-gradient-to-br from-purple-900/10 via-[#111116] to-[#0D0D12] shadow-xl space-y-3">
                <p className="text-sm sm:text-base text-zinc-100 leading-relaxed font-normal">
                  "Hi, I'm Chandu, the creator behind Edit Revolution. I have 2 years of experience in video editing and AI video creation, specializing in engaging social media content, cinematic promotional videos, and creative visual storytelling."
                </p>
                <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                  "My expertise includes Instagram Reels, YouTube Shorts, promotional advertisements, AI-generated videos, motion graphics, captions, sound design, and color grading. I focus on combining creativity and technology to transform ideas into compelling visual content for creators, businesses, and brands."
                </p>
              </div>

              {/* Location Badge with Clean Typography */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-zinc-300">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-zinc-400 text-[11px] block font-mono">Operating From</span>
                  <span className="text-white font-medium text-xs sm:text-sm">
                    {CONTACTS.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Differentiators Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {differentiators.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl glass-card border border-white/5 hover:border-purple-500/30 transition-all hover:-translate-y-1"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border mb-3 ${item.accent}`}>
                      <IconComponent size={18} />
                    </div>
                    <h4 className="text-sm font-bold text-white font-['Outfit'] mb-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
