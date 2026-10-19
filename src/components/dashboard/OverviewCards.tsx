import React from 'react';
import {
  Wallet,
  Clock,
  Briefcase,
  User,
  TrendingUp,
  PiggyBank,
  Target,
  Percent,
} from 'lucide-react';
import type { FinancialOverview } from '../../types';

interface OverviewCardsProps {
  overview: FinancialOverview;
}

const formatINR = (val: number): string => {
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
};

export const OverviewCards: React.FC<OverviewCardsProps> = ({ overview }) => {
  const cards = [
    {
      id: 'received-income',
      title: 'Total Freelance Received',
      amount: formatINR(overview.totalFreelanceReceived),
      subtitle: overview.hasReceivedIncomeData
        ? 'Cleared client payouts'
        : '₹0 (No payouts recorded yet)',
      icon: Wallet,
      color: 'from-emerald-500/20 to-teal-500/10',
      border: 'border-emerald-500/30',
      textColor: 'text-emerald-400',
      iconColor: 'text-emerald-400',
      badge: 'Cash In Hand',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    },
    {
      id: 'pending-income',
      title: 'Pending Client Payments',
      amount: formatINR(overview.pendingClientPayments),
      subtitle: overview.hasPendingIncomeData
        ? 'Invoiced / Awaiting payment'
        : '₹0 (All invoices cleared)',
      icon: Clock,
      color: 'from-amber-500/20 to-yellow-500/10',
      border: 'border-amber-500/30',
      textColor: 'text-amber-400',
      iconColor: 'text-amber-400',
      badge: 'Unpaid Invoices',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    },
    {
      id: 'business-expenses',
      title: 'Business Expenses',
      amount: formatINR(overview.businessExpenses),
      subtitle: overview.hasBusinessExpenseData
        ? 'Software, assets & gear'
        : '₹0 (No business expenses)',
      icon: Briefcase,
      color: 'from-rose-500/20 to-pink-500/10',
      border: 'border-rose-500/30',
      textColor: 'text-rose-400',
      iconColor: 'text-rose-400',
      badge: 'Deductible',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
    {
      id: 'personal-expenses',
      title: 'Personal Expenses',
      amount: formatINR(overview.personalExpenses),
      subtitle: overview.hasPersonalExpenseData
        ? 'Living & personal outflow'
        : '₹0 (No personal expenses)',
      icon: User,
      color: 'from-purple-500/20 to-indigo-500/10',
      border: 'border-purple-500/30',
      textColor: 'text-purple-300',
      iconColor: 'text-purple-400',
      badge: 'Separate Flow',
      badgeColor: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    },
    {
      id: 'net-business-profit',
      title: 'Net Business Profit',
      amount: formatINR(overview.netBusinessProfit),
      subtitle: 'Received Income − Business Expenses',
      icon: TrendingUp,
      color: overview.netBusinessProfit >= 0 ? 'from-cyan-500/20 to-blue-500/10' : 'from-rose-500/20 to-orange-500/10',
      border: overview.netBusinessProfit >= 0 ? 'border-cyan-500/30' : 'border-rose-500/30',
      textColor: overview.netBusinessProfit >= 0 ? 'text-cyan-300' : 'text-rose-400',
      iconColor: overview.netBusinessProfit >= 0 ? 'text-cyan-400' : 'text-rose-400',
      badge: overview.netBusinessProfit >= 0 ? 'Profitable' : 'Deficit',
      badgeColor: overview.netBusinessProfit >= 0
        ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
        : 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    },
    {
      id: 'actual-savings-balance',
      title: 'Actual Savings Balance',
      amount: formatINR(overview.actualSavingsBalance),
      subtitle: 'Starting Balance + Saved − Withdrawn',
      icon: PiggyBank,
      color: 'from-emerald-500/25 to-indigo-500/10',
      border: 'border-emerald-500/40',
      textColor: 'text-emerald-300',
      iconColor: 'text-emerald-400',
      badge: 'Verified Balance',
      badgeColor: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    },
    {
      id: 'target-remaining',
      title: 'Target Amount Remaining',
      amount: formatINR(overview.targetRemaining),
      subtitle: 'Remaining to reach ₹1,00,000 goal',
      icon: Target,
      color: 'from-amber-500/20 to-orange-500/10',
      border: 'border-amber-500/30',
      textColor: 'text-amber-300',
      iconColor: 'text-amber-400',
      badge: 'Goal Distance',
      badgeColor: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
    },
    {
      id: 'goal-completion',
      title: 'Savings Goal Completion',
      amount: `${overview.completionPercentage.toFixed(1)}%`,
      subtitle: `${formatINR(overview.actualSavingsBalance)} of ₹1,00,000`,
      icon: Percent,
      color: 'from-indigo-500/20 to-cyan-500/10',
      border: 'border-indigo-500/30',
      textColor: 'text-indigo-300',
      iconColor: 'text-indigo-400',
      badge: 'Progress',
      badgeColor: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`relative rounded-2xl bg-gradient-to-br ${card.color} bg-[#121217]/90 border ${card.border} p-5 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col justify-between`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="text-xs font-medium text-zinc-400 tracking-wide">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl bg-white/5 border border-white/10 ${card.iconColor}`}>
                <IconComponent size={18} />
              </div>
            </div>

            <div>
              <div className={`text-2xl font-black font-['Outfit'] tracking-tight ${card.textColor}`}>
                {card.amount}
              </div>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <span className="text-[11px] text-zinc-400 truncate max-w-[170px]">
                  {card.subtitle}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${card.badgeColor}`}
                >
                  {card.badge}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
