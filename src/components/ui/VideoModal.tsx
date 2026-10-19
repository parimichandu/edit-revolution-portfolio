import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import type { Project } from '../../types';
import { shouldDisplayThumbnail, getEffectiveThumbnailUrl } from '../../utils/videoThumbnailLogic';

interface VideoModalProps {
  project: Project | null;
  onClose: () => void;
  onSelectProjectForInquiry?: (projectTitle: string, category: string) => void;
  shortsThumbnailOption?: boolean;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  project,
  onClose,
  onSelectProjectForInquiry,
  shortsThumbnailOption = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, togglePlay]);

  if (!project) return null;

  const displayThumbnail = shouldDisplayThumbnail(project, shortsThumbnailOption);
  const effectiveThumbUrl = getEffectiveThumbnailUrl(project, shortsThumbnailOption);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    if (duration > 0) {
      setProgress((current / duration) * 100);
    }
  };

  const handleProgressScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const newTime = pos * (videoRef.current.duration || 1);
    videoRef.current.currentTime = newTime;
    setProgress(pos * 100);
  };

  const handleInquiryClick = () => {
    if (onSelectProjectForInquiry) {
      onSelectProjectForInquiry(project.title, project.category);
    }
    onClose();
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isVertical = project.aspectRatio === '9:16';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-2xl glass-card border border-white/15 p-4 sm:p-6 shadow-2xl flex flex-col md:flex-row gap-6 bg-[#111114]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 z-30 p-2 rounded-full bg-black/60 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors border border-white/10"
        >
          <X size={20} />
        </button>

        {/* Video Player Display Container */}
        <div
          className={`relative rounded-xl overflow-hidden bg-black flex items-center justify-center border border-white/10 shadow-inner group ${
            isVertical
              ? 'w-full md:w-[320px] lg:w-[360px] h-[460px] sm:h-[520px] mx-auto shrink-0'
              : 'w-full md:flex-1 aspect-video min-h-[260px] max-h-[500px]'
          }`}
        >
          {project.videoPreviewUrl ? (
            <video
              ref={videoRef}
              src={project.videoPreviewUrl}
              poster={displayThumbnail ? effectiveThumbUrl : undefined}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
              onClick={togglePlay}
              className="w-full h-full object-cover cursor-pointer"
            />
          ) : displayThumbnail && effectiveThumbUrl ? (
            <img
              src={effectiveThumbUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600">
              <Play size={28} />
            </div>
          )}

          {/* Center Play Overlay on Pause */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center cursor-pointer"
            >
              <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.8)] scale-110 transition-transform">
                <Play size={28} className="translate-x-0.5" />
              </div>
            </div>
          )}

          {/* Aspect Ratio Badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-mono font-semibold text-zinc-300">
            {project.aspectRatio} format
          </div>

          {/* Player Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-6 flex flex-col gap-2 opacity-95 group-hover:opacity-100 transition-opacity">
            {/* Progress bar scrub */}
            <div
              onClick={handleProgressScrub}
              className="w-full h-1.5 bg-white/20 hover:h-2.5 transition-all rounded-full cursor-pointer relative overflow-hidden"
            >
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {isPlaying ? <Pause size={17} /> : <Play size={17} />}
                </button>
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="hover:text-cyan-400 transition-colors"
                >
                  {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                </button>
                <span className="font-mono text-zinc-300 text-[11px]">{project.duration}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] text-zinc-400 font-medium">1080p 60fps Master</span>
                <button
                  onClick={() => {
                    if (videoRef.current?.requestFullscreen) {
                      videoRef.current.requestFullscreen();
                    }
                  }}
                  className="hover:text-cyan-400 transition-colors"
                  aria-label="Fullscreen"
                >
                  <Maximize size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Project Information & Context Details */}
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
                {project.category}
              </span>
              <span className="text-zinc-500">•</span>
              <span className="text-xs text-zinc-400">Client: <strong className="text-zinc-200">{project.client}</strong></span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white font-['Outfit'] mb-3">
              {project.title}
            </h2>

            <p className="text-sm text-zinc-300 leading-relaxed mb-5">
              {project.description}
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              {project.views && (
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono">Organic Views</div>
                  <div className="text-lg font-bold text-cyan-400 font-['Space_Grotesk']">{project.views}</div>
                </div>
              )}
              {project.retention && (
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono">Audience Retention</div>
                  <div className="text-lg font-bold text-indigo-400 font-['Space_Grotesk']">{project.retention}</div>
                </div>
              )}
            </div>

            {/* Key Deliverable Highlights */}
            <div className="mb-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
                <Sparkles size={13} className="text-indigo-400" />
                Editorial Execution Highlights
              </h4>
              <ul className="space-y-1.5">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-300">
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Software / Tools Used */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">Software Stack</h4>
              <div className="flex flex-wrap gap-1.5">
                {project.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-zinc-800/80 border border-white/5 text-zinc-200 text-xs font-mono"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action CTA: Hire / Request Similar Project */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleInquiryClick}
              className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-[0_4px_20px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <span>Get An Edit Like This</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto py-3 px-5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium transition-colors cursor-pointer"
            >
              Back to Gallery
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
