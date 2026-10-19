import React, { useState, useRef, useCallback } from 'react';
import { Sliders, Sparkles } from 'lucide-react';

interface BeforeAfterSliderProps {
  rawImage: string;
  gradedImage: string;
  rawLabel?: string;
  gradedLabel?: string;
  title?: string;
  subtitle?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  rawImage,
  gradedImage,
  rawLabel = "Raw Camera LOG Profile",
  gradedLabel = "Final Cinema Color Grade",
  title = "Color Grading & Polish Comparison",
  subtitle = "Drag the slider to see how raw, flat camera profiles are transformed into punchy, cinematic color grades.",
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  }, [handleMove]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
  }, [isDragging, handleMove]);

  return (
    <div className="w-full rounded-2xl glass-card border border-white/10 p-5 md:p-8 overflow-hidden shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={13} />
            <span>Interactive Color Suite</span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white font-['Outfit']">{title}</h3>
          <p className="text-sm text-zinc-400 max-w-xl mt-1">{subtitle}</p>
        </div>

        {/* Quick percentage indicators */}
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
          <Sliders size={14} className="text-indigo-400" />
          <span>Position: {Math.round(sliderPosition)}%</span>
        </div>
      </div>

      {/* Interactive Drag Canvas Container */}
      <div
        ref={containerRef}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        className="relative w-full h-[280px] sm:h-[380px] md:h-[460px] rounded-xl overflow-hidden select-none cursor-ew-resize border border-white/10 bg-black"
      >
        {/* Graded Image (Full background) */}
        <img
          src={gradedImage}
          alt={gradedLabel}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Graded Badge */}
        <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-lg">
          ✨ {gradedLabel}
        </div>

        {/* Raw Image (Clipped overlay) */}
        <div
          className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform"
          style={{ width: `${sliderPosition}%` }}
        >
          <img
            src={rawImage}
            alt={rawLabel}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none filter saturate-30 contrast-75 brightness-95"
            style={{ width: containerRef.current ? `${containerRef.current.clientWidth}px` : '100%', maxWidth: 'none' }}
          />

          {/* Raw Badge */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-zinc-500/40 text-zinc-300 text-xs font-semibold shadow-lg">
            📷 {rawLabel}
          </div>
        </div>

        {/* Center Divider Line */}
        <div
          className="absolute top-0 bottom-0 z-30 w-1 bg-white shadow-[0_0_15px_rgba(255,255,255,0.9)] pointer-events-none"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          {/* Circular Drag Handle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/90 border-2 border-white shadow-[0_0_20px_rgba(99,102,241,0.8)] flex items-center justify-center pointer-events-auto cursor-ew-resize">
            <div className="flex items-center gap-1 text-white text-[10px] font-bold">
              <span>◀</span>
              <span>▶</span>
            </div>
          </div>
        </div>

        {/* Bottom Helper Bar */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs text-zinc-300 pointer-events-none">
          Drag horizontally or touch to compare
        </div>
      </div>
    </div>
  );
};
