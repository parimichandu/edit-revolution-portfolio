import React, { useState } from 'react';
import { X, Save, Target, AlertCircle } from 'lucide-react';
import type { SavingsGoal } from '../../types';

interface EditGoalModalProps {
  goal: SavingsGoal;
  isOpen: boolean;
  onClose: () => void;
  onSaveGoal: (updates: Partial<SavingsGoal>) => Promise<void>;
}

export const EditGoalModal: React.FC<EditGoalModalProps> = ({
  goal,
  isOpen,
  onClose,
  onSaveGoal,
}) => {
  const [name, setName] = useState(goal.name || 'My First ₹1 Lakh Savings');
  const [targetAmount, setTargetAmount] = useState(String(goal.targetAmount || 100000));
  const [startingBalance, setStartingBalance] = useState(String(goal.startingBalance || 0));
  const [targetDurationMonths, setTargetDurationMonths] = useState(String(goal.targetDurationMonths || 3));
  const [plannedMonthlySavings, setPlannedMonthlySavings] = useState(String(goal.plannedMonthlySavings || 5000));
  const [targetDeadline, setTargetDeadline] = useState(
    goal.targetDeadline ? goal.targetDeadline.split('T')[0] : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numTarget = parseFloat(targetAmount);
    const numStarting = parseFloat(startingBalance);
    const numDuration = parseInt(targetDurationMonths, 10);
    const numPlanned = parseFloat(plannedMonthlySavings);

    if (isNaN(numTarget) || numTarget <= 0) {
      setError('Target amount must be a positive number greater than ₹0.');
      return;
    }
    if (isNaN(numStarting) || numStarting < 0) {
      setError('Starting balance cannot be negative.');
      return;
    }
    if (isNaN(numDuration) || numDuration <= 0) {
      setError('Target duration must be at least 1 month.');
      return;
    }
    if (isNaN(numPlanned) || numPlanned < 0) {
      setError('Planned monthly savings cannot be negative.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSaveGoal({
        name: name.trim(),
        targetAmount: numTarget,
        startingBalance: numStarting,
        targetDurationMonths: numDuration,
        plannedMonthlySavings: numPlanned,
        targetDeadline: targetDeadline || undefined,
      });
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update goal';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#14141B] border border-white/15 p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Target size={22} />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Outfit'] text-white">
                Customize Savings Goal
              </h3>
              <p className="text-xs text-zinc-400">
                Adjust your target amount, deadline, and monthly plan anytime.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Savings Goal Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Target Amount (₹ INR)
              </label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Starting Saved Balance (₹)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={startingBalance}
                onChange={(e) => setStartingBalance(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Planned Monthly (₹)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                required
                value={plannedMonthlySavings}
                onChange={(e) => setPlannedMonthlySavings(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Duration (Months)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                required
                value={targetDurationMonths}
                onChange={(e) => setTargetDurationMonths(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Target Deadline
              </label>
              <input
                type="date"
                required
                value={targetDeadline}
                onChange={(e) => setTargetDeadline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer disabled:opacity-50"
            >
              <Save size={15} />
              <span>Save Goal Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
