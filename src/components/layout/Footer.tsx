import React from 'react';
import { ArrowUp, MessageCircle, Mail, Send, Lock } from 'lucide-react';
import { InstagramIcon, YouTubeIcon } from '../ui/BrandIcons';
import { CONTACTS, NAVIGATION_LINKS } from '../../constants';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = 2026;

  return (
    <footer className="relative bg-[#070709] border-t border-white/10 pt-16 pb-12 overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-indigo-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-['Outfit'] font-black text-2xl tracking-wider text-white">
                EDIT REVOLUTION
                <span className="text-purple-400">.</span>
              </span>
            </div>
            <p className="text-purple-300 text-xs font-semibold mb-2">
              Your Vision. My Editing. Extraordinary Results.
            </p>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
              Chandu — Freelance Video Editor & AI Video Creator turning raw footage into scroll-stopping visual stories.
            </p>
            <div className="space-y-1.5 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Open for New Projects</span>
              </div>
              <div className="text-[11px] text-zinc-500 leading-snug">
                Vasili, Atmakur, Nellore Dist., AP, India
              </div>
            </div>
          </div>

          {/* Col 2: Services Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono mb-4">
              Core Services
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="hover:text-cyan-400 transition-colors">
                <a href="#services">Instagram Reels Editing</a>
              </li>
              <li className="hover:text-cyan-400 transition-colors">
                <a href="#services">YouTube Shorts Editing</a>
              </li>
              <li className="hover:text-cyan-400 transition-colors">
                <a href="#services">Promotional Videos</a>
              </li>
              <li className="hover:text-cyan-400 transition-colors">
                <a href="#services">AI Video Creation</a>
              </li>
              <li className="hover:text-cyan-400 transition-colors">
                <a href="#services">Motion Graphics</a>
              </li>
              <li className="hover:text-cyan-400 transition-colors">
                <a href="#services">Captions and Subtitles</a>
              </li>
              <li className="hover:text-cyan-400 transition-colors">
                <a href="#services">Color Grading & Sound Design</a>
              </li>
              <li className="hover:text-cyan-400 transition-colors">
                <a href="#services">Social Media Advertisements</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-zinc-400">
              {NAVIGATION_LINKS.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Direct Connect & Socials */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white font-mono mb-4">
              Connect With Edit Revolution
            </h4>
            <div className="space-y-3 mb-5 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <MessageCircle size={15} className="text-emerald-400" />
                <a
                  href={CONTACTS.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 font-mono transition-colors"
                >
                  {CONTACTS.whatsapp}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <InstagramIcon size={15} className="text-pink-400" />
                <a
                  href={CONTACTS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-400 font-mono transition-colors"
                >
                  {CONTACTS.instagramHandle}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <a
                href={CONTACTS.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-400 text-zinc-300 flex items-center justify-center border border-white/10 hover:border-emerald-500/40 transition-all hover:-translate-y-1"
              >
                <MessageCircle size={17} />
              </a>
              <a
                href={CONTACTS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-pink-500/20 hover:text-pink-400 text-zinc-300 flex items-center justify-center border border-white/10 hover:border-pink-500/40 transition-all hover:-translate-y-1"
              >
                <InstagramIcon size={17} />
              </a>
              <a
                href={`mailto:${CONTACTS.email}`}
                aria-label="Email"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-indigo-500/20 hover:text-indigo-400 text-zinc-300 flex items-center justify-center border border-white/10 hover:border-indigo-500/40 transition-all hover:-translate-y-1"
              >
                <Mail size={17} />
              </a>
              <a
                href={CONTACTS.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-400 text-zinc-300 flex items-center justify-center border border-white/10 hover:border-cyan-500/40 transition-all hover:-translate-y-1"
              >
                <Send size={15} />
              </a>
              <a
                href={CONTACTS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-zinc-300 flex items-center justify-center border border-white/10 hover:border-red-500/40 transition-all hover:-translate-y-1"
              >
                <YouTubeIcon size={17} />
              </a>
            </div>
          </div>
        </div>

        {/* Brand Banner Line requested in prompt */}
        <div className="py-4 text-center border-b border-white/5">
          <p className="text-xs sm:text-sm font-['Space_Grotesk'] text-zinc-400 tracking-wider">
            <strong className="text-white">Edit Revolution</strong> | Video Editing • AI Video Creation • Motion Graphics
          </p>
        </div>

        {/* Bottom Bar: Copyright & AI Acknowledgment */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-zinc-500 text-xs text-center sm:text-left">
            © {currentYear} <span className="text-zinc-300 font-medium">Edit Revolution</span>. All rights reserved.
          </div>

          {/* AI Acknowledgment per master prompt requirement */}
          <p className="text-zinc-500 text-xs flex items-center gap-1.5">
            Crafted with <span className="text-indigo-400 font-medium">✨ AI assistance</span> for video storytellers
          </p>

          <div className="flex items-center gap-3">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-indigo-400 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                title="Admin Financial Portal"
              >
                <Lock size={12} className="text-zinc-600" />
                <span>Creator Admin</span>
              </button>
            )}

            {/* Scroll to Top */}
            <button
              onClick={scrollToTop}
              aria-label="Scroll to top"
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all group cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp size={13} className="group-hover:-translate-y-0.5 transition-transform text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
