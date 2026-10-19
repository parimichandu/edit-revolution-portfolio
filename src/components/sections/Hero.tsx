import React from 'react';
import { Play, ArrowRight, Sparkles, Film, CheckCircle2, Clock } from 'lucide-react';
import { SITE_CONFIG, CONTACTS } from '../../constants';

interface HeroProps {
  onOpenShowreel: () => void;
  onExploreWork: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenShowreel, onExploreWork }) => {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      {/* Background cinematic lighting glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] h-[380px] bg-gradient-to-tr from-indigo-600/20 via-cyan-500/15 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -left-32 w-80 h-80 bg-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 -right-20 w-96 h-96 bg-cyan-500/10 blur-[110px] pointer-events-none rounded-full" />

      {/* Film Strip Border Accents */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
        {/* Creator Identity & Price Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#18181D]/80 border border-purple-500/30 backdrop-blur-md mb-6 shadow-[0_0_25px_rgba(168,85,247,0.2)]">
          <img
            src="/images/chandu-profile.jpg"
            alt="Chandu - Edit Revolution"
            className="w-7 h-7 rounded-full object-cover object-top ring-2 ring-purple-500/60 shadow-md"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('profile.jpg')) {
                target.src = '/images/profile.jpg';
              }
            }}
          />
          <span className="text-xs font-semibold text-zinc-200">
            Chandu <span className="text-zinc-500">|</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300 font-bold">Edit Revolution</span>
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-xs font-medium text-emerald-400">
            {SITE_CONFIG.basePrice}/reel starter
          </span>
          <span className="text-zinc-600 hidden sm:inline">•</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-purple-300 font-medium">
            <Sparkles size={11} /> Video & AI Creator
          </span>
        </div>

        {/* Cinematic Headline with letter/word styling */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-['Outfit'] tracking-tight text-white max-w-4xl leading-[1.1] mb-6">
          Your Vision. My Editing.{' '}
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-200 to-cyan-300">
              Extraordinary Results.
            </span>
            <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full opacity-70" />
          </span>
        </h1>

        {/* Subheadline with clear niche positioning */}
        <p className="text-base sm:text-lg md:text-xl text-zinc-300 max-w-3xl font-light leading-relaxed mb-8">
          I transform raw footage into engaging reels, cinematic promotional videos, and creative AI-powered content that helps brands and creators stand out.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-14">
          {/* Primary View Work */}
          <button
            onClick={onExploreWork}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-[0_0_30px_rgba(99,102,241,0.45)] hover:shadow-[0_0_45px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 cursor-pointer group"
          >
            <span>View My Work</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Hire Me (Secondary) */}
          <a
            href="#contact"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#18181D]/80 hover:bg-white/10 border border-white/20 text-white text-sm font-semibold backdrop-blur-md flex items-center justify-center gap-2 transition-all hover:border-indigo-400"
          >
            <span>Hire Me</span>
          </a>

          {/* Watch Showreel */}
          <button
            onClick={onOpenShowreel}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-sm font-medium backdrop-blur-md flex items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play size={11} className="fill-indigo-400 translate-x-0.5" />
            </div>
            <span>Watch Showreel</span>
          </button>

          {/* Quick WhatsApp Inquiry */}
          <a
            href={CONTACTS.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-medium flex items-center justify-center gap-2 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* Creative Highlights Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 w-full max-w-4xl p-5 sm:p-6 rounded-2xl glass-card border border-purple-500/20 shadow-2xl">
          <div className="flex flex-col items-center justify-center p-2">
            <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
              <span>2 Years</span>
              <Sparkles size={18} className="text-purple-400" />
            </div>
            <div className="text-[11px] sm:text-xs text-zinc-400 font-medium uppercase tracking-wider mt-1">
              Video & AI Experience
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 border-l border-white/5">
            <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-cyan-400 font-['Space_Grotesk']">
              <span>9:16 & 16:9</span>
              <Film size={18} className="text-cyan-400" />
            </div>
            <div className="text-[11px] sm:text-xs text-zinc-400 font-medium uppercase tracking-wider mt-1">
              Reels, Shorts & Films
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 border-l border-white/5">
            <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-emerald-400 font-['Space_Grotesk']">
              <span>Creative AI</span>
              <CheckCircle2 size={18} className="text-emerald-400" />
            </div>
            <div className="text-[11px] sm:text-xs text-zinc-400 font-medium uppercase tracking-wider mt-1">
              Avatars & Visual Storytelling
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-2 border-l border-white/5">
            <div className="flex items-center gap-1.5 text-2xl sm:text-3xl font-extrabold text-amber-400 font-['Space_Grotesk']">
              <span>24-48h</span>
              <Clock size={18} className="text-amber-400" />
            </div>
            <div className="text-[11px] sm:text-xs text-zinc-400 font-medium uppercase tracking-wider mt-1">
              Fast Turnaround
            </div>
          </div>
        </div>

        {/* Subtle scroll cue */}
        <div className="mt-12 flex flex-col items-center gap-2 text-zinc-500 text-xs">
          <span className="tracking-widest uppercase text-[10px] font-mono">Scroll to explore work</span>
          <div className="w-5 h-9 rounded-full border border-zinc-700 flex items-start justify-center p-1">
            <div className="w-1.5 h-2 rounded-full bg-indigo-400 animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};
