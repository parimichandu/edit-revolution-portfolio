import React from 'react';
import { Sparkles, Check, Clock, FileCheck } from 'lucide-react';
import { PROCESS_STEPS } from '../../data/process';

export const Process: React.FC = () => {
  return (
    <section id="process" className="py-24 relative overflow-hidden bg-[#0B0B0E]/60">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[300px] bg-indigo-600/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Workflow & Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-4">
            My 4-Step{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
              Editing Blueprint.
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            From raw folder link to viral-ready export in 4 structured, transparent steps.
          </p>
        </div>

        {/* Process Steps Timeline */}
        <div className="relative">
          {/* Desktop Horizontal Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-8 right-8 h-[2px] bg-gradient-to-r from-indigo-500/30 via-cyan-400/40 to-indigo-500/30 -translate-y-12 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {PROCESS_STEPS.map((step) => {
              return (
                <div
                  key={step.number}
                  className="group relative rounded-2xl glass-card border border-white/10 hover:border-cyan-400/40 p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 shadow-xl"
                >
                  <div>
                    {/* Top Step Number & Duration Indicator */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-500 p-[1.5px] shadow-[0_0_20px_rgba(99,102,241,0.4)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all">
                        <div className="w-full h-full bg-[#111115] rounded-[14px] flex items-center justify-center font-['Space_Grotesk'] font-black text-lg text-cyan-300">
                          {step.number}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-mono">
                        <Clock size={12} className="text-cyan-400" />
                        <span>{step.duration}</span>
                      </div>
                    </div>

                    {/* Step Title & Subtitle */}
                    <div className="text-[11px] uppercase tracking-wider font-mono text-indigo-400 font-semibold mb-1">
                      {step.subtitle}
                    </div>
                    <h3 className="text-lg font-bold text-white font-['Outfit'] mb-3 group-hover:text-cyan-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                      {step.description}
                    </p>
                  </div>

                  {/* Deliverables Checklist */}
                  <div className="pt-4 border-t border-white/5">
                    <div className="text-[10px] uppercase tracking-wider font-mono text-zinc-500 font-semibold mb-2 flex items-center gap-1">
                      <FileCheck size={12} className="text-emerald-400" />
                      <span>Deliverables</span>
                    </div>
                    <ul className="space-y-1.5">
                      {step.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-zinc-300">
                          <Check size={12} className="text-cyan-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
