import React from 'react';
import { 
  Megaphone, 
  Cpu, 
  Sparkles, 
  Film, 
  ArrowRight, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';
import { InstagramIcon, YouTubeIcon } from '../ui/BrandIcons';
import { SERVICES } from '../../data/services';
import type { Service } from '../../types';

interface ServicesProps {
  onSelectServiceForQuote: (serviceTitle: string) => void;
}

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Instagram':
      return <InstagramIcon size={22} className="text-pink-400" />;
    case 'Youtube':
      return <YouTubeIcon size={22} className="text-red-400" />;
    case 'Megaphone':
      return <Megaphone size={22} className="text-amber-400" />;
    case 'Cpu':
      return <Cpu size={22} className="text-emerald-400" />;
    case 'Sparkles':
      return <Sparkles size={22} className="text-cyan-400" />;
    case 'Film':
    default:
      return <Film size={22} className="text-indigo-400" />;
  }
};

export const Services: React.FC<ServicesProps> = ({ onSelectServiceForQuote }) => {
  return (
    <section id="services" className="py-24 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/3 -right-20 w-80 h-80 bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 -left-20 w-80 h-80 bg-cyan-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Core Editing Offerings</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-4">
            Services Engineered For{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
              Maximum Impact.
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            From single viral reels starting at ₹400 to complete end-to-end commercial productions and next-gen AI video pipelines.
          </p>
        </div>

        {/* 3-Column Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {SERVICES.map((service: Service) => {
            return (
              <div
                key={service.id}
                className="group relative rounded-2xl glass-card border border-white/10 hover:border-indigo-500/40 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
              >
                <div>
                  {/* Top Bar with Icon & Turnaround */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-indigo-500/50 transition-all">
                      {getIcon(service.iconName)}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[11px] font-mono">
                      <Clock size={12} className="text-cyan-400" />
                      <span>{service.turnaround}</span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="text-xl font-bold text-white font-['Outfit'] group-hover:text-cyan-300 transition-colors mb-2">
                    {service.title}
                  </h3>
                  <div className="text-xs font-semibold text-indigo-400 font-mono mb-3">
                    {service.tagline}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features Bullet List */}
                  <div className="space-y-2 mb-6 pt-4 border-t border-white/5">
                    {service.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Pricing & CTA */}
                <div className="pt-5 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono">Pricing</span>
                    <span className="text-base font-bold text-white font-['Space_Grotesk']">
                      {service.startingPrice}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectServiceForQuote(service.title)}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-cyan-500 text-zinc-200 hover:text-white border border-white/10 hover:border-transparent text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer group/btn"
                  >
                    <span>Get a Quote for this</span>
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
