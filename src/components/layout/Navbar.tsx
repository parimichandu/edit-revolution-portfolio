import React, { useState, useEffect } from 'react';
import { Menu, X, Play, ArrowRight, Globe } from 'lucide-react';
import { NAVIGATION_LINKS, CONTACTS } from '../../constants';

interface NavbarProps {
  onOpenShowreel?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenShowreel }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-[#0A0A0A]/85 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="flex items-center gap-2.5 group cursor-pointer"
          aria-label="Chandu Portfolio Home"
        >
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] transition-all">
            <div className="w-full h-full bg-[#0E0E11] rounded-[10px] flex items-center justify-center">
              <Play size={16} className="text-cyan-400 fill-cyan-400/30 group-hover:scale-110 transition-transform ml-0.5" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-['Outfit'] font-black text-lg tracking-wider text-white group-hover:text-cyan-300 transition-colors">
              EDIT REVOLUTION
              <span className="text-purple-400">.</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase -mt-1">
              By Chandu • Video & AI Creator
            </span>
          </div>
        </a>

        {/* Center Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#141418]/70 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {NAVIGATION_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action & Status Badge */}
        <div className="hidden sm:flex items-center gap-3">
          {onOpenShowreel && (
            <button
              onClick={onOpenShowreel}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              <Play size={11} className="text-cyan-400 fill-cyan-400" />
              <span>Showreel</span>
            </button>
          )}

          {/* Language pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
            <Globe size={13} className="text-cyan-400" />
            <span>Telugu & English</span>
          </div>

          {/* Availability Status */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden md:inline">Open for Projects</span>
          </div>

          {/* Primary CTA */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-semibold shadow-[0_0_20px_rgba(99,102,241,0.35)] flex items-center gap-1.5 transition-all cursor-pointer group"
          >
            <span>Hire Me</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="sm:hidden px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold"
          >
            Hire
          </a>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 hover:text-white"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mt-2 mx-4 rounded-2xl glass-card border border-white/15 p-5 shadow-2xl backdrop-blur-2xl flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Available for new projects
            </span>
            <span className="font-mono">Telugu | English</span>
          </div>

          <div className="flex flex-col gap-1">
            {NAVIGATION_LINKS.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-3.5 py-2.5 text-sm font-medium text-zinc-200 hover:text-cyan-300 hover:bg-white/5 rounded-xl transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-center text-white text-sm font-semibold shadow-lg"
            >
              Get a Quote (Starting ₹400)
            </a>
            <a
              href={CONTACTS.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 text-center text-xs font-semibold"
            >
              Direct WhatsApp Chat
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
