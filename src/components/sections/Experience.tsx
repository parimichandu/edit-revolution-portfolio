import React, { useState } from 'react';
import {
  Sparkles,
  Scissors,
  Bot,
  Smartphone,
  Megaphone,
  Layers,
  Palette,
  CheckCircle2,
  Clock,
  ArrowRight,
  Flame,
  Volume2,
} from 'lucide-react';

interface ExperienceArea {
  id: string;
  title: string;
  category: string;
  icon: React.ElementType;
  accentColor: string;
  borderColor: string;
  glowColor: string;
  badgeBg: string;
  summary: string;
  skills: string[];
  focusAreas: string[];
}

export const Experience: React.FC = () => {
  const [activeArea, setActiveArea] = useState<string | null>(null);

  const experienceAreas: ExperienceArea[] = [
    {
      id: 'video-editing',
      title: 'Video Editing and Post-Production',
      category: 'Core Discipline • 2 Years',
      icon: Scissors,
      accentColor: 'text-purple-400',
      borderColor: 'border-purple-500/30 hover:border-purple-500/60',
      glowColor: 'from-purple-600/15 via-purple-900/10 to-transparent',
      badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
      summary:
        'Comprehensive timeline architecture, footage curation, and narrative pacing. Transforming raw video clips into cohesive, high-retention stories with zero dead air and seamless continuity.',
      skills: ['Multi-Cam Assembly', 'Narrative Pacing', 'J/L Audio Cuts', 'Match Cuts', 'Footage Curation'],
      focusAreas: [
        'Frame-by-frame rhythm trimming to keep viewers locked',
        'B-roll integration that enriches spoken commentary',
        'Clean scene transitions and continuity matching',
      ],
    },
    {
      id: 'ai-video',
      title: 'AI Video Creation',
      category: 'Generative Tech • 2 Years',
      icon: Bot,
      accentColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/30 hover:border-cyan-500/60',
      glowColor: 'from-cyan-600/15 via-cyan-900/10 to-transparent',
      badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
      summary:
        'Pioneering hybrid human-AI workflows. Leveraging generative AI tools for prompt engineering, avatar creation, image-to-video diffusion, and futuristic visual synthesis.',
      skills: ['AI Avatars', 'Prompt Engineering', 'Diffusion Synthesis', 'Voice Cloning', 'AI Upscaling'],
      focusAreas: [
        'Script-to-screen avatar generation with natural cadence',
        'Generative visual backgrounds and conceptual B-roll',
        'Hybrid video finishing combining AI clips with manual timeline editing',
      ],
    },
    {
      id: 'reels-shorts',
      title: 'Instagram Reels and YouTube Shorts',
      category: 'Short-Form Specialist • 2 Years',
      icon: Smartphone,
      accentColor: 'text-pink-400',
      borderColor: 'border-pink-500/30 hover:border-pink-500/60',
      glowColor: 'from-pink-600/15 via-pink-900/10 to-transparent',
      badgeBg: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
      summary:
        'Engineered specifically for mobile algorithms and retention metrics. High-velocity 3-second hooks, kinetic word-by-word subtitles, zoom punch-ins, and scroll-stopping visual cues.',
      skills: ['9:16 Framing', '3-Sec Hook Design', 'Kinetic Captions', 'Pattern Interrupts', 'Retention Curves'],
      focusAreas: [
        'Immediate visual & audio hooks in the first 2-3 seconds',
        'Synchronized animated subtitles with custom color accents',
        'Dynamic zoom punch-ins, sound effects, and pattern breaks',
      ],
    },
    {
      id: 'promotional-videos',
      title: 'Promotional Videos and Advertisements',
      category: 'Commercial • 2 Years',
      icon: Megaphone,
      accentColor: 'text-amber-400',
      borderColor: 'border-amber-500/30 hover:border-amber-500/60',
      glowColor: 'from-amber-600/15 via-amber-900/10 to-transparent',
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
      summary:
        'Crafting persuasive promo edits that drive engagement and business conversions. Tailored for products, personal brands, event announcements, and commercial campaigns.',
      skills: ['Commercial Pacing', 'Product Showcases', 'Call-to-Action Design', 'Brand Messaging', 'High-Impact Ads'],
      focusAreas: [
        'Structuring value propositions that highlight product benefits',
        'Bold typographic title cards and brand logo treatments',
        'Clear, action-driving closing sequences and CTA screens',
      ],
    },
    {
      id: 'motion-graphics',
      title: 'Motion Graphics and Visual Effects',
      category: 'Visual Enhancement • 2 Years',
      icon: Layers,
      accentColor: 'text-indigo-400',
      borderColor: 'border-indigo-500/30 hover:border-indigo-500/60',
      glowColor: 'from-indigo-600/15 via-indigo-900/10 to-transparent',
      badgeBg: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
      summary:
        'Polishing raw edits into broadcast-grade visual experiences with animated lower thirds, typography motion, object tracking, speed ramping, and seamless transition effects.',
      skills: ['Lower Thirds', 'Speed Ramping', 'Masking & Mattes', 'Motion Tracking', 'Graphic Overlays'],
      focusAreas: [
        'Custom animated graphics and title cards tailored to branding',
        'Seamless whip-pans, glitch effects, and motion-blurred transitions',
        'Visual callouts, arrows, and highlight overlays for instructional clarity',
      ],
    },
    {
      id: 'sound-color',
      title: 'Sound Design and Color Grading',
      category: 'Atmosphere & Finish • 2 Years',
      icon: Palette,
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/30 hover:border-emerald-500/60',
      glowColor: 'from-emerald-600/15 via-emerald-900/10 to-transparent',
      badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
      summary:
        'Elevating emotional impact through multi-layered audio atmospheres and mood-defining color palettes. From sub-bass drops and crisp foley to cinematic color harmonies.',
      skills: ['Foley Layering', 'Sub-Bass Impacts', 'Audio Ducking', 'Cinematic LUTs', 'Tone Balancing'],
      focusAreas: [
        'Multi-track audio soundscapes with risers, swooshes, and impact hits',
        'Dialogue leveling, noise reduction, and crisp vocal EQ',
        'Skin-tone protection, cinematic contrast curves, and mood grading',
      ],
    },
  ];

  return (
    <section id="experience" className="py-24 relative overflow-hidden bg-[#0A0A0E]/90">
      {/* Background ambient lighting accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-purple-700/15 via-indigo-600/10 to-cyan-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-900/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Sparkles size={13} className="text-purple-400" />
            <span>Professional Experience</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit'] text-white tracking-tight leading-tight mb-4">
            2 Years of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300">
              Creative Experience.
            </span>
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
            Two years dedicated to mastering video editing, AI video workflows, and audience retention for digital creators, businesses, and modern brands.
          </p>

          {/* Core Philosophy Banner */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-zinc-400">
            <span className="flex items-center gap-1.5 bg-white/[0.03] border border-white/10 px-3 py-1 rounded-lg">
              <Clock size={13} className="text-purple-400" />
              <span>2 Years Full Dedication</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/[0.03] border border-white/10 px-3 py-1 rounded-lg">
              <Flame size={13} className="text-amber-400" />
              <span>Retention-Driven Editing</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/[0.03] border border-white/10 px-3 py-1 rounded-lg">
              <Volume2 size={13} className="text-cyan-400" />
              <span>Audio & Visual Harmony</span>
            </span>
          </div>
        </div>

        {/* 6 Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {experienceAreas.map((area, index) => {
            const Icon = area.icon;
            const isHovered = activeArea === area.id;

            return (
              <div
                key={area.id}
                onMouseEnter={() => setActiveArea(area.id)}
                onMouseLeave={() => setActiveArea(null)}
                className={`group relative rounded-2xl p-6 sm:p-7 glass-card border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl ${
                  area.borderColor
                } ${isHovered ? 'scale-[1.02] shadow-[0_12px_40px_rgba(168,85,247,0.15)]' : ''}`}
              >
                {/* Subtle card glow on hover */}
                <div
                  className={`absolute -inset-px bg-gradient-to-br ${area.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl`}
                />

                <div className="relative z-10">
                  {/* Top Header with Number and Category Badge */}
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <span className="text-xs font-mono font-bold text-zinc-500 group-hover:text-purple-300 transition-colors">
                      0{index + 1} //
                    </span>
                    <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${area.badgeBg}`}>
                      {area.category}
                    </span>
                  </div>

                  {/* Icon and Title */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:border-purple-500/40 transition-all duration-300 shadow-inner`}
                    >
                      <Icon size={22} className={area.accentColor} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold font-['Outfit'] text-white leading-snug group-hover:text-purple-200 transition-colors">
                      {area.title}
                    </h3>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-5">
                    {area.summary}
                  </p>

                  {/* Focus Areas List */}
                  <div className="space-y-2 mb-6 pt-3 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
                      Key Highlights & Execution
                    </div>
                    {area.focusAreas.map((point, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 size={13} className="text-purple-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills Chips at Bottom */}
                <div className="relative z-10 pt-4 border-t border-white/10">
                  <div className="flex flex-wrap gap-1.5">
                    {area.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10px] font-mono text-zinc-300 bg-white/[0.03] hover:bg-white/[0.08] px-2 py-0.5 rounded-md border border-white/10 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section Bottom CTA */}
        <div className="mt-14 max-w-3xl mx-auto rounded-2xl p-6 sm:p-8 glass-card border border-purple-500/30 bg-gradient-to-r from-purple-950/20 via-[#121218] to-indigo-950/20 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

          <h3 className="text-xl sm:text-2xl font-black font-['Outfit'] text-white mb-2">
            Ready to Elevate Your Visual Content?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-xl mx-auto mb-6">
            Combining 2 years of hands-on post-production craft with cutting-edge AI technology to transform your ideas into extraordinary videos.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#contact"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-semibold text-xs sm:text-sm shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              <span>Discuss Your Video Project</span>
              <ArrowRight size={15} />
            </a>
            <a
              href="#work"
              className="px-6 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-zinc-200 font-medium text-xs sm:text-sm transition-all"
            >
              <span>View Portfolio Showcase</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
