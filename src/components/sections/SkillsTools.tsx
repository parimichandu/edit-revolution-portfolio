import React from 'react';
import { 
  Scissors, 
  Video, 
  Layers, 
  Palette, 
  Cpu, 
  Image, 
  Sparkles, 
  Sliders, 
  Zap
} from 'lucide-react';
import { TOOLS, SKILLS } from '../../data/skills';

const getToolIcon = (iconKey: string) => {
  switch (iconKey) {
    case 'Scissors':
      return <Scissors size={24} className="text-cyan-400" />;
    case 'Video':
      return <Video size={24} className="text-purple-400" />;
    case 'Layers':
      return <Layers size={24} className="text-indigo-400" />;
    case 'Palette':
      return <Palette size={24} className="text-amber-400" />;
    case 'Cpu':
      return <Cpu size={24} className="text-emerald-400" />;
    case 'Image':
    default:
      return <Image size={24} className="text-blue-400" />;
  }
};

export const SkillsTools: React.FC = () => {
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Mastery & Software</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-4">
            Tools & Technical{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
              Proficiency.
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            The software suite and narrative principles I leverage to deliver broadcast-quality video editing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Software Stack (6 Columns) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Video size={18} className="text-indigo-400" />
                <span>Software Suite</span>
              </h3>
              <span className="text-xs text-zinc-500 font-mono">6 Core Workflows</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {TOOLS.map((tool) => (
                <div
                  key={tool.name}
                  className="p-4 rounded-xl glass-card border border-white/10 hover:border-indigo-500/40 transition-all hover:-translate-y-1 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {getToolIcon(tool.iconKey)}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 border border-white/10 text-cyan-400 font-semibold">
                      {tool.level}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white font-['Outfit'] group-hover:text-cyan-300 transition-colors">
                    {tool.name}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 font-mono">
                    {tool.role}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick Note about CapCut Pro */}
            <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-zinc-300 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-300 shrink-0">
                <Zap size={16} />
              </div>
              <div>
                <strong className="text-cyan-300">Fast-Paced Vertical Specialist:</strong> High-velocity CapCut Pro workflows combined with After Effects keyframing for lightning-fast turnaround times.
              </div>
            </div>
          </div>

          {/* Skill Bars & Percentages (6 Columns) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Sliders size={18} className="text-cyan-400" />
                <span>Editing Skills & Metrics</span>
              </h3>
              <span className="text-xs text-zinc-500 font-mono">Audience Retention Focused</span>
            </div>

            <div className="space-y-4">
              {SKILLS.map((skill) => (
                <div
                  key={skill.name}
                  className="p-4 rounded-xl glass-card border border-white/10 hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-white font-['Outfit'] text-sm">
                      {skill.name}
                    </span>
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      {skill.percentage}%
                    </span>
                  </div>

                  {/* Animated Progress Bar Container */}
                  <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden border border-white/5 mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    {skill.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
