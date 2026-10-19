import type { SkillItem, ToolItem } from '../types';

export const TOOLS: ToolItem[] = [
  {
    name: "CapCut Pro",
    role: "Speed Pacing & Viral Reels",
    level: "Expert (Primary)",
    iconKey: "Scissors",
    color: "#06B6D4",
  },
  {
    name: "Adobe Premiere Pro",
    role: "Long-form Editing & Multi-cam",
    level: "Advanced",
    iconKey: "Video",
    color: "#9333EA",
  },
  {
    name: "Adobe After Effects",
    role: "Motion Graphics, VFX & Tracking",
    level: "Advanced",
    iconKey: "Layers",
    color: "#818CF8",
  },
  {
    name: "DaVinci Resolve Studio",
    role: "Color Grading & Audio Mastering",
    level: "Proficient",
    iconKey: "Palette",
    color: "#F59E0B",
  },
  {
    name: "Runway Gen-2 & AI Tools",
    role: "Generative Video & World Building",
    level: "Specialist",
    iconKey: "Cpu",
    color: "#10B981",
  },
  {
    name: "Adobe Photoshop & Illustrator",
    role: "Assets, Thumbnails & Masking",
    level: "Advanced",
    iconKey: "Image",
    color: "#3B82F6",
  }
];

export const SKILLS: SkillItem[] = [
  {
    name: "Visual Storytelling & Narrative Flow",
    percentage: 100,
    description: "Structuring raw ideas into compelling arcs that grab attention immediately and retain it until the final frame.",
    category: "creative"
  },
  {
    name: "Pacing, Rhythm & Retention Hooks",
    percentage: 95,
    description: "Eliminating dead seconds, matching cuts to audio transients, and crafting high-retention velocity spikes.",
    category: "editing"
  },
  {
    name: "Sound Design & Foley Architecture",
    percentage: 92,
    description: "Multi-layered soundscapes: risers, bass drops, ambient foley, and micro-clicks that make edits feel alive.",
    category: "creative"
  },
  {
    name: "Cinematic Color Correction & Grading",
    percentage: 90,
    description: "Transforming flat camera log footage into cohesive, moody, Hollywood or vibrant social color palettes.",
    category: "technical"
  },
  {
    name: "Motion Graphics & Kinetic Subtitles",
    percentage: 88,
    description: "Custom typography animations, branded lower thirds, animated callouts, and seamless camera tracking.",
    category: "technical"
  },
  {
    name: "AI-Augmented Video Generation",
    percentage: 85,
    description: "Integrating modern generative AI models into human editing workflows for high-speed creative output.",
    category: "creative"
  }
];
