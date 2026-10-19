import React from 'react';
import { AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import type { SavingsGoal } from '../../types';

interface GoalAlertBannerProps {
  goal: SavingsGoal;
  onAdjustGoal: () => void;
}

export const GoalAlertBanner: React.FC<GoalAlertBannerProps> = ({ goal, onAdjustGoal }) => {
  if (!goal.alert?.isTriggered) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/40 p-4 sm:p-5 backdrop-blur-md shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Pace Alert: Savings Shortfall Detected
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                {goal.targetDurationMonths || 3} Month Window
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed max-w-3xl">
              {goal.alert.message}
            </p>
          </div>
        </div>

        <button
          onClick={onAdjustGoal}
          className="self-start sm:self-auto shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-xs shadow-md transition-all cursor-pointer group"
        >
          <Zap size={14} className="fill-zinc-950" />
          <span>Adjust Savings Pace</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
