import React from 'react';
import {
  Target,
  Calendar,
  Clock,
  ArrowUpRight,
  TrendingDown,
  Info,
  Edit3,
} from 'lucide-react';
import type { SavingsGoal } from '../../types';

interface SavingsGoalWidgetProps {
  goal: SavingsGoal;
  onEditGoal: () => void;
}

const formatINR = (val?: number): string => {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
};

export const SavingsGoalWidget: React.FC<SavingsGoalWidgetProps> = ({ goal, onEditGoal }) => {
  const targetAmount = goal.targetAmount || 100000;
  const actualSaved = goal.actualSavingsBalance || 0;
  const startingBalance = goal.startingBalance || 0;
  const plannedMonthly = goal.plannedMonthlySavings || 5000;
  const percentage = Math.min(100, Math.round(((actualSaved / targetAmount) * 100) * 10) / 10);
  const remaining = Math.max(0, targetAmount - actualSaved);
  const requiredMonthly = goal.requiredMonthlySavings ?? Math.round(remaining / (goal.targetDurationMonths || 3));
  const shortfall = goal.shortfallAmount ?? Math.max(0, targetAmount - (actualSaved + (goal.targetDurationMonths || 3) * plannedMonthly));

  // Format dates
  const deadlineStr = goal.targetDeadline
    ? new Date(goal.targetDeadline).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'In 3 Months';

  const projectedDateStr = goal.projectedCompletionDate
    ? new Date(goal.projectedCompletionDate).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      })
    : 'Dynamic';

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#151520] via-[#101018] to-[#0D0D12] border border-indigo-500/30 p-6 md:p-8 shadow-[0_0_50px_rgba(99,102,241,0.12)]">
      {/* Background glow accent */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 border border-indigo-500/40 text-cyan-400">
            <Target size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-indigo-400 uppercase bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                {goal.goalType || 'Personal savings'}
              </span>
              <span className="text-xs text-zinc-400">• {goal.targetDurationMonths || 3}-Month Target</span>
            </div>
            <h2 className="text-2xl font-black font-['Outfit'] text-white mt-0.5">
              {goal.name}
            </h2>
          </div>
        </div>

        <button
          onClick={onEditGoal}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-zinc-200 hover:text-white transition-all shadow-md cursor-pointer"
        >
          <Edit3 size={14} className="text-indigo-400" />
          <span>Edit Goal & Plan</span>
        </button>
      </div>

      {/* Main Target & Progress Bar */}
      <div className="relative z-10 my-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-3">
          <div>
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
              Current Saved Balance
            </span>
            <div className="text-4xl sm:text-5xl font-black font-['Outfit'] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              {formatINR(actualSaved)}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-zinc-400">Goal Target</span>
            <div className="text-2xl font-black font-['Outfit'] text-white">
              {formatINR(targetAmount)}
            </div>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="relative w-full h-4 bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 transition-all duration-700 ease-out shadow-[0_0_20px_rgba(6,182,212,0.6)]"
            style={{ width: `${Math.max(percentage, 2)}%` }}
          />
        </div>

        {/* Milestone Marks */}
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mt-2">
          <span>Starting: {formatINR(startingBalance)}</span>
          <span className="text-indigo-300 font-semibold">{percentage}% Achieved</span>
          <span>Remaining: {formatINR(remaining)}</span>
        </div>
      </div>

      {/* Breakdown Grid: Required, Planned, Shortfall, Timeline */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-6">
        {/* Planned Monthly Contribution */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
            <span>Planned Monthly</span>
            <ArrowUpRight size={15} className="text-cyan-400" />
          </div>
          <div className="text-xl font-bold font-['Outfit'] text-cyan-300">
            {formatINR(plannedMonthly)}
            <span className="text-xs font-normal text-zinc-400">/mo</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Current contribution schedule
          </span>
        </div>

        {/* Required per Month */}
        <div className="rounded-2xl bg-white/[0.03] border border-indigo-500/20 p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
            <span>Required For Target</span>
            <Clock size={15} className="text-indigo-400" />
          </div>
          <div className="text-xl font-bold font-['Outfit'] text-indigo-300">
            ~{formatINR(requiredMonthly)}
            <span className="text-xs font-normal text-zinc-400">/mo</span>
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            To hit ₹1L in 3 months
          </span>
        </div>

        {/* Shortfall Warning Card */}
        <div className="rounded-2xl bg-amber-500/[0.06] border border-amber-500/30 p-4">
          <div className="flex items-center justify-between text-amber-300 text-xs mb-1.5 font-medium">
            <span>3-Month Shortfall</span>
            <TrendingDown size={15} className="text-amber-400" />
          </div>
          <div className="text-xl font-bold font-['Outfit'] text-amber-400">
            {formatINR(shortfall)}
          </div>
          <span className="text-[11px] text-amber-400/80 mt-1 block">
            Gap vs current ₹5k/mo plan
          </span>
        </div>

        {/* Timeline & Forecast Date */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
          <div className="flex items-center justify-between text-zinc-400 text-xs mb-1.5">
            <span>Deadlines & Forecast</span>
            <Calendar size={15} className="text-emerald-400" />
          </div>
          <div className="text-sm font-semibold text-white">
            Target: <span className="text-indigo-300">{deadlineStr}</span>
          </div>
          <div className="text-xs text-zinc-400 mt-1">
            Projected at ₹5k/mo:{' '}
            <span className="text-amber-300 font-semibold">{projectedDateStr}</span>
          </div>
        </div>
      </div>

      {/* Clear Assumptions Disclaimer */}
      <div className="relative z-10 flex items-start gap-2.5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-zinc-400 leading-relaxed">
        <Info size={16} className="text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-zinc-300">Forecast Assumptions: </span>
          {goal.assumptions ||
            `Forecast assumes a steady monthly savings contribution of ₹${plannedMonthly.toLocaleString('en-IN')} with no additional withdrawals, interest compounding, or inflation adjustments. Target deadline evaluation spans ${goal.targetDurationMonths || 3} months.`}
        </div>
      </div>
    </div>
  );
};
