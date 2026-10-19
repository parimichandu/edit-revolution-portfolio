import React, { useState } from 'react';
import { Lock, Shield, ArrowRight, X, AlertCircle } from 'lucide-react';
import { financialApi } from '../../services/financialApi';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: { id: number; username: string }) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('chandu');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await financialApi.login(username, password);
      onLoginSuccess(res.user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid username or password';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn font-['Inter']">
      <div className="relative w-full max-w-md rounded-3xl bg-[#111117] border border-indigo-500/30 p-7 shadow-[0_0_60px_rgba(99,102,241,0.2)]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Security Icon & Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_25px_rgba(99,102,241,0.5)] mb-3">
            <div className="w-full h-full bg-[#0E0E14] rounded-[14px] flex items-center justify-center text-cyan-400">
              <Lock size={24} />
            </div>
          </div>
          <h3 className="text-xl font-bold font-['Outfit'] text-white">
            Admin Financial Portal
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Protected server authorization for Edit Revolution financials.
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Admin Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="chandu"
              className="w-full px-4 py-2.5 rounded-xl bg-[#08080C] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Admin Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-[#08080C] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div className="p-3 rounded-xl bg-indigo-500/[0.07] border border-indigo-500/20 text-[11px] text-zinc-400 flex items-start gap-2">
            <Shield size={14} className="text-indigo-400 shrink-0 mt-0.5" />
            <span>
              Secure default credentials: <strong className="text-white">chandu</strong> /{' '}
              <strong className="text-white">chandu@2026</strong>. Financial data is hidden from public visitors.
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-bold shadow-[0_0_25px_rgba(99,102,241,0.4)] flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            <span>{isLoading ? 'Authenticating...' : 'Enter Financial Dashboard'}</span>
            <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
};
