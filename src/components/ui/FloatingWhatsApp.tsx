import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { CONTACTS } from '../../constants';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const encodedMsg = encodeURIComponent(
    `Hi Edit Revolution! I saw your video editing & AI creation portfolio and I'd like to discuss a project.`
  );
  const whatsappUrl = `https://wa.me/${CONTACTS.whatsappRaw}?text=${encodedMsg}`;



  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end flex-col gap-2 pointer-events-auto">
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="relative group bg-[#161619]/95 border border-emerald-500/30 text-xs px-3.5 py-2 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2 max-w-[220px] animate-bounce">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-zinc-200 font-medium">Quick WhatsApp Chat? Usually replies in 15m</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="text-zinc-400 hover:text-white p-0.5"
            aria-label="Dismiss tooltip"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* Main WhatsApp Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 text-white shadow-[0_8px_30px_rgba(16,185,129,0.45)] hover:shadow-[0_10px_35px_rgba(16,185,129,0.65)] hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-40 animate-ping pointer-events-none" />
        <MessageCircle size={28} className="relative z-10 transition-transform group-hover:rotate-12" />
        
        {/* Online status indicator */}
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-300 border-2 border-[#0A0A0A] rounded-full" />
      </a>
    </div>
  );
};
