import type { ProcessStep } from '../types';

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Understand The Brief & Vision",
    subtitle: "Alignment & Strategy",
    description: "We connect via WhatsApp or brief form to discuss your video goals, target audience, brand aesthetic, pacing preferences, and reference links.",
    deliverables: ["Project timeline & milestone agreement", "Asset transfer link (Google Drive / Frame.io)", "Style reference & tone confirmation"],
    duration: "Day 0"
  },
  {
    number: "02",
    title: "Rough Cut & Story Architecture",
    subtitle: "Pacing & Elimination",
    description: "I import your raw footage, trim all dead pauses, build an irresistible first 3-second hook, and lay down the foundational narrative beat structure.",
    deliverables: ["A-roll timeline assembly", "Retention pacing pass", "Rough story cut preview"],
    duration: "Day 1"
  },
  {
    number: "03",
    title: "Motion Graphics, Grade & Sound Magic",
    subtitle: "The Secret Sauce",
    description: "Where ordinary footage transforms into cinema: adding animated kinetic subtitles, relevant B-roll, custom sound effects (wooshes, hits, risers), and filmic color grading.",
    deliverables: ["Sound design mixdown & audio cleanup", "Dynamic subtitle animation", "Color correction & cinematic LUT pass"],
    duration: "Day 1 - 2"
  },
  {
    number: "04",
    title: "Review, Polish & Final Master Delivery",
    subtitle: "100% Satisfaction",
    description: "I send a private review link for your feedback. We fine-tune any timing or text adjustments, then export in crystal-clear high bitrate optimized for social algorithms.",
    deliverables: ["Full HD/4K social media master files", "Clean exports (with and without subtitles)", "Ongoing post-delivery support"],
    duration: "Day 2 - 3"
  }
];
