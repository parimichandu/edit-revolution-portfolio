import React, { useState, useMemo } from 'react';
import { Play, Sparkles, Clock, Eye, Image as ImageIcon } from 'lucide-react';
import { PROJECTS } from '../../data/projects';
import type { Project, ProjectCategory } from '../../types';
import { BeforeAfterSlider } from '../ui/BeforeAfterSlider';
import { shouldDisplayThumbnail, getEffectiveThumbnailUrl } from '../../utils/videoThumbnailLogic';

interface PortfolioProps {
  onSelectProject: (project: Project) => void;
}

const CATEGORIES: ProjectCategory[] = [
  'All',
  'Instagram Reels',
  'YouTube Shorts',
  'Promotional Video',
  'AI Video Creation',
  'Cinematic Edits',
];

export const Portfolio: React.FC<PortfolioProps> = ({ onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('All');
  // Requirement 3: Add thumbnails only when explicitly intended for YouTube Shorts and user enables thumbnail option
  const [shortsThumbnailOption, setShortsThumbnailOption] = useState<boolean>(false);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return PROJECTS;
    return PROJECTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="work" className="py-24 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles size={13} />
              <span>Selected Portfolio</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit'] text-white tracking-tight">
              Crafted For High{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
                Retention & Reach.
              </span>
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mt-2">
              Every cut is calculated. Explore high-impact vertical reels, commercial promos, and AI-assisted edits engineered to stop the scroll.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400 bg-white/5 px-4 py-2 rounded-xl border border-white/10 self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>Click any project to play preview & inspect breakdown</span>
          </div>
        </div>

        {/* Category Filters Bar & Shorts Thumbnail Option */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] scale-105'
                      : 'bg-[#161619] text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* YouTube Shorts Thumbnail Option Toggle (Requirement 3) */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-[#161619] px-3.5 py-2 rounded-xl border border-white/10 text-xs">
            <ImageIcon size={13} className="text-cyan-400" />
            <span className="text-zinc-400 text-[11px]">Shorts Thumbnails:</span>
            <button
              type="button"
              id="shorts-thumbnail-toggle"
              onClick={() => setShortsThumbnailOption((prev) => !prev)}
              aria-pressed={shortsThumbnailOption}
              className={`px-2.5 py-0.5 rounded-full font-mono text-[11px] transition-all cursor-pointer ${
                shortsThumbnailOption
                  ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {shortsThumbnailOption ? 'Enabled' : 'Disabled (Default)'}
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-20">
          {filteredProjects.map((project) => {
            const isVertical = project.aspectRatio === '9:16';
            const displayThumbnail = shouldDisplayThumbnail(project, shortsThumbnailOption);
            const effectiveThumbUrl = getEffectiveThumbnailUrl(project, shortsThumbnailOption);

            return (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group relative rounded-2xl glass-card border border-white/10 hover:border-indigo-500/40 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
              >
                {/* Media Container */}
                <div
                  className={`relative overflow-hidden bg-black/60 ${
                    isVertical ? 'aspect-[9/14]' : 'aspect-video'
                  }`}
                >
                  {displayThumbnail && effectiveThumbUrl ? (
                    <img
                      src={effectiveThumbUrl}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : project.videoPreviewUrl ? (
                    <video
                      src={project.videoPreviewUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-600">
                      <Play size={28} />
                    </div>
                  )}

                  {/* Dark subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20 group-hover:via-black/20 transition-all pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono font-medium text-zinc-300">
                      {project.aspectRatio}
                    </span>
                    {project.category === 'AI Video Creation' && (
                      <span className="px-2 py-0.5 rounded-md bg-indigo-600/80 backdrop-blur-md border border-indigo-400/30 text-[10px] font-medium text-white flex items-center gap-1 shadow-[0_0_12px_rgba(99,102,241,0.5)]">
                        <Sparkles size={10} className="text-cyan-300" />
                        <span>AI Gen</span>
                      </span>
                    )}
                  </div>

                  {/* Views / Duration Badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 text-[11px] font-medium text-cyan-300">
                    <Clock size={11} />
                    <span>{project.duration}</span>
                  </div>

                  {/* Hover Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-14 h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-[0_0_25px_rgba(99,102,241,0.8)] scale-90 opacity-80 group-hover:scale-110 group-hover:opacity-100 group-hover:bg-cyan-500 transition-all duration-300">
                      <Play size={24} className="fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Floating metric if available */}
                  {project.views && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-mono font-bold text-white bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-md border border-white/10">
                      <Eye size={12} className="text-cyan-400" />
                      <span>{project.views} Views</span>
                    </div>
                  )}
                </div>

                {/* Card Content & Tags */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-indigo-400 font-medium font-mono text-[11px] uppercase tracking-wider">
                        {project.category}
                      </span>
                      <span className="text-zinc-500 text-[11px]">{project.client}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] group-hover:text-cyan-300 transition-colors line-clamp-1 mb-2">
                      {project.title}
                    </h3>

                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                      {project.description}
                    </p>
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                      {project.tags.slice(0, 3).map((tag, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] bg-white/5 text-zinc-300 border border-white/5 font-mono"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Embedded Interactive Color Grading Slider Demo */}
        <div className="mt-8">
          <BeforeAfterSlider
            rawImage="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=40&sat=-80"
            gradedImage="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=90"
            rawLabel="Camera Raw Log (Flat & Desaturated)"
            gradedLabel="Chandu's Signature Cinema Grade (Teal & Orange Pop)"
            title="The Color Grading Transformation"
            subtitle="Raw camera footage looks flat and dull. See how professional LUT mapping, contrast balancing, and color separation breathe cinematic life into the frame."
          />
        </div>
      </div>
    </section>
  );
};
