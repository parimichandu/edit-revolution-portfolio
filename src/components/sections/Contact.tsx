import React, { useState, useEffect } from 'react';
import { 
  Send, 
  MessageCircle, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  ExternalLink,
  Flame,
  MapPin
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InstagramIcon } from '../ui/BrandIcons';
import { CONTACTS } from '../../constants';

interface ContactProps {
  initialProjectType?: string;
  initialBudget?: string;
}

export const Contact: React.FC<ContactProps> = ({
  initialProjectType = 'Instagram Reels',
  initialBudget,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState(initialProjectType);
  const [budgetIndex, setBudgetIndex] = useState(initialBudget?.includes('350') || initialBudget?.includes('3,500') ? 1 : 0);
  const [message, setMessage] = useState('');
  const [footageLink, setFootageLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const budgetOptions = [
    'Under ₹1,500 (Starter Reels)',
    '₹1,500 - ₹5,000 (Creator Batch)',
    '₹5,000 - ₹15,000 (Multi-Video / Ads)',
    '₹15,000+ (Full Production)',
  ];

  useEffect(() => {
    if (initialProjectType) {
      setProjectType(initialProjectType);
    }
  }, [initialProjectType]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366F1', '#06B6D4', '#10B981', '#F59E0B'],
      });
    } catch {
      // ignore fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      triggerConfetti();
    }, 900);
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(CONTACTS.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const cleanPhone = CONTACTS.whatsapp.replace(/[^0-9]/g, '');
  const encodedWhatsappMsg = encodeURIComponent(
    `Hi Chandu! My name is ${name || 'a creator'}. I'm interested in ${projectType} editing. Let's discuss!`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedWhatsappMsg}`;

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#09090C]">
      {/* Background glow */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[300px] bg-gradient-to-r from-indigo-600/15 to-cyan-500/15 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles size={13} />
            <span>Connect & Collaborate</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-['Outfit'] text-white tracking-tight mb-4">
            Let's Create Something{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
              Extraordinary.
            </span>
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Have a project in mind? Contact Edit Revolution to discuss your next video.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Fast Channels */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl glass-card border border-white/10 space-y-5">
              <h3 className="text-lg font-bold text-white font-['Outfit'] flex items-center gap-2">
                <Flame size={18} className="text-amber-400" />
                <span>Instant Direct Channels</span>
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Connect directly on your preferred platform for immediate project scoping:
              </p>

              {/* Contact on WhatsApp */}
              <a
                href={CONTACTS.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-white transition-all group cursor-pointer shadow-lg hover:shadow-emerald-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-bold font-['Outfit'] text-emerald-300">Contact on WhatsApp</div>
                    <div className="text-xs text-zinc-400">{CONTACTS.whatsapp}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-500/20 px-3 py-1 rounded-lg">
                  <span>Chat</span>
                  <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>

              {/* Follow on Instagram */}
              <a
                href={CONTACTS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-white transition-all group cursor-pointer shadow-lg hover:shadow-pink-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center">
                    <InstagramIcon size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-bold font-['Outfit'] text-pink-300">Follow on Instagram</div>
                    <div className="text-xs text-zinc-400">{CONTACTS.instagramHandle}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-pink-400 font-semibold bg-pink-500/20 px-3 py-1 rounded-lg">
                  <span>Follow</span>
                  <ExternalLink size={13} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>

              {/* Send an Email */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 text-white hover:border-indigo-500/40 transition-all">
                <a
                  href={`mailto:${CONTACTS.email}`}
                  className="flex items-center gap-3 flex-1"
                >
                  <div className="w-10 h-10 rounded-lg bg-white/5 text-indigo-400 flex items-center justify-center">
                    <Mail size={22} />
                  </div>
                  <div>
                    <div className="text-sm font-bold font-['Outfit'] text-white">Send an Email</div>
                    <div className="text-xs text-zinc-400">{CONTACTS.emailDisplay}</div>
                  </div>
                </a>
                <button
                  type="button"
                  onClick={copyEmailToClipboard}
                  className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-zinc-300 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  {copiedEmail ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copiedEmail ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Professional Location */}
              <div className="flex items-center gap-3.5 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-white">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-purple-300 font-mono uppercase tracking-wider">Professional Location</div>
                  <div className="text-xs sm:text-sm font-medium text-zinc-200 mt-0.5 leading-snug">
                    {CONTACTS.location}
                  </div>
                </div>
              </div>
            </div>

            {/* Turnaround Guarantee Pill */}
            <div className="p-4 rounded-xl glass-card border border-white/5 flex items-center gap-3 text-xs text-zinc-300">
              <Clock size={18} className="text-cyan-400 shrink-0" />
              <span>
                Standard turnaround for individual Reels is <strong>24 to 48 hours</strong>. Rush 24h delivery available upon request.
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl glass-card border border-white/15 shadow-2xl relative">
              {isSubmitted ? (
                /* Success celebration state */
                <div className="text-center py-12 space-y-4 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-black font-['Outfit'] text-white">
                    Inquiry Received!
                  </h3>
                  <p className="text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                    Thanks <strong className="text-white">{name || 'there'}</strong>! I will review your requirements and reply to you on WhatsApp / Email within 30 minutes with next steps.
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg"
                    >
                      <MessageCircle size={15} />
                      <span>Ping me immediately on WhatsApp</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 text-xs font-medium cursor-pointer"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe / Creator Handle"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white text-sm placeholder:text-zinc-600 transition-all"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="youremail@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white text-sm placeholder:text-zinc-600 transition-all"
                      />
                    </div>

                    {/* WhatsApp */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                        WhatsApp Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 XXXXX XXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white text-sm placeholder:text-zinc-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* Project Type selection */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-2 font-mono">
                      Project Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        'Instagram Reels',
                        'YouTube Shorts',
                        'Promotional Video',
                        'AI Video Creation',
                        'Motion Graphics',
                        'Cinematic Edits',
                      ].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setProjectType(type)}
                          className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all cursor-pointer ${
                            projectType === type
                              ? 'bg-gradient-to-r from-indigo-600/30 to-cyan-500/30 border-cyan-400 text-white shadow-md'
                              : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Slider */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-zinc-300 uppercase tracking-wider font-mono">
                        Estimated Budget
                      </span>
                      <span className="font-mono font-bold text-cyan-400">
                        {budgetOptions[budgetIndex]}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="3"
                      step="1"
                      value={budgetIndex}
                      onChange={(e) => setBudgetIndex(parseInt(e.target.value, 10))}
                      className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                      <span>Starter</span>
                      <span>Batch</span>
                      <span>Agency</span>
                      <span>Scale</span>
                    </div>
                  </div>

                  {/* Footage Link */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                      Footage / Reference Link (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="Google Drive, WeTransfer, Dropbox or YouTube link"
                      value={footageLink}
                      onChange={(e) => setFootageLink(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white text-sm placeholder:text-zinc-600 transition-all font-mono"
                    />
                  </div>

                  {/* Message / Brief */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 uppercase tracking-wider mb-1.5 font-mono">
                      Project Notes & Expectations *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Tell me about your video vision, style references, or specific deadline..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-white text-sm placeholder:text-zinc-600 transition-all resize-y"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-[0_0_30px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting Project Brief...</span>
                      </div>
                    ) : (
                      <>
                        <span>Send Project Brief</span>
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
