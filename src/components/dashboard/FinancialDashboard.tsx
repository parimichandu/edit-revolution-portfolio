import React, { useState, useEffect, useCallback } from 'react';
import {
  LogOut,
  RefreshCw,
  Globe,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { financialApi } from '../../services/financialApi';
import type {
  FinancialSummaryData,
  SavingsTransaction,
  ClientIncome,
  Expense,
  SavingsGoal,
} from '../../types';
import { OverviewCards } from './OverviewCards';
import { SavingsGoalWidget } from './SavingsGoalWidget';
import { GoalAlertBanner } from './GoalAlertBanner';
import { SavingsTransactionsSection } from './SavingsTransactionsSection';
import { IncomeExpensesSection } from './IncomeExpensesSection';
import { EditGoalModal } from './EditGoalModal';
import { FeedbackManagementSection } from './FeedbackManagementSection';
import { Star, Wallet } from 'lucide-react';

interface FinancialDashboardProps {
  onBackToPortfolio: () => void;
  onLogout: () => void;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  onBackToPortfolio,
  onLogout,
}) => {
  const [summary, setSummary] = useState<FinancialSummaryData | null>(null);
  const [savingsTransactions, setSavingsTransactions] = useState<SavingsTransaction[]>([]);
  const [clientIncomes, setClientIncomes] = useState<ClientIncome[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [adminTab, setAdminTab] = useState<'financials' | 'feedback'>('financials');

  const loadAllData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setError(null);
    try {
      const [sumData, txData, incData, expData] = await Promise.all([
        financialApi.getSummary(),
        financialApi.getSavingsTransactions(),
        financialApi.getClientIncomes(),
        financialApi.getExpenses(),
      ]);
      setSummary(sumData);
      setSavingsTransactions(txData);
      setClientIncomes(incData);
      setExpenses(expData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load financial data';
      setError(msg);
      if (msg.includes('Unauthorized')) {
        onLogout();
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [onLogout]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadAllData(true);
  };

  // Savings Transactions Handlers
  const handleAddSavingsTransaction = async (tx: {
    type: 'deposit' | 'withdrawal';
    amount: number;
    date: string;
    notes?: string;
  }) => {
    await financialApi.addSavingsTransaction(tx);
    await loadAllData(true);
  };

  const handleUpdateSavingsTransaction = async (
    id: number,
    tx: { type: 'deposit' | 'withdrawal'; amount: number; date: string; notes?: string }
  ) => {
    await financialApi.updateSavingsTransaction(id, tx);
    await loadAllData(true);
  };

  const handleDeleteSavingsTransaction = async (id: number) => {
    await financialApi.deleteSavingsTransaction(id);
    await loadAllData(true);
  };

  // Income Handlers
  const handleAddIncome = async (inc: {
    client_name: string;
    project_name: string;
    amount: number;
    date: string;
    status: 'received' | 'pending';
    invoice_number?: string;
    notes?: string;
  }) => {
    await financialApi.addClientIncome(inc);
    await loadAllData(true);
  };

  const handleUpdateIncome = async (id: number, inc: Partial<ClientIncome>) => {
    await financialApi.updateClientIncome(id, inc);
    await loadAllData(true);
  };

  const handleDeleteIncome = async (id: number) => {
    await financialApi.deleteClientIncome(id);
    await loadAllData(true);
  };

  // Expense Handlers
  const handleAddExpense = async (exp: {
    title: string;
    category: 'business' | 'personal';
    amount: number;
    date: string;
    notes?: string;
  }) => {
    await financialApi.addExpense(exp);
    await loadAllData(true);
  };

  const handleDeleteExpense = async (id: number) => {
    await financialApi.deleteExpense(id);
    await loadAllData(true);
  };

  // Goal Update Handler
  const handleSaveGoal = async (updates: Partial<SavingsGoal>) => {
    await financialApi.updateGoal(updates);
    await loadAllData(true);
  };

  if (isLoading && !summary) {
    return (
      <div className="min-h-screen bg-[#0A0A0E] flex flex-col items-center justify-center text-white p-6">
        <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
        <span className="text-sm font-medium text-zinc-400">
          Loading Edit Revolution Financial Database...
        </span>
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className="min-h-screen bg-[#0A0A0E] flex flex-col items-center justify-center text-white p-6">
        <div className="max-w-md p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center">
          <AlertCircle size={36} className="text-rose-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Authentication Required</h3>
          <p className="text-xs text-zinc-300 mb-5">{error}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Sign In Again
            </button>
            <button
              onClick={onBackToPortfolio}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-xs font-semibold cursor-pointer"
            >
              Return to Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0E] text-[#F8FAFC] font-['Inter'] selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0E0E14]/90 backdrop-blur-xl border-b border-white/10 px-4 sm:px-6 lg:px-8 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1.5px] shadow-[0_0_15px_rgba(99,102,241,0.5)]">
              <div className="w-full h-full bg-[#0E0E14] rounded-[10px] flex items-center justify-center">
                <Sparkles size={16} className="text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-['Outfit'] font-black text-base tracking-wider text-white">
                  EDIT REVOLUTION
                </span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono uppercase">
                  Admin Dashboard
                </span>
              </div>
              <span className="text-[10px] text-zinc-400 block -mt-0.5">
                Chandu's Personal Savings & Freelance Financial Hub
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Refresh */}
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              title="Refresh financial data from database"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-cyan-400' : ''} />
              <span className="hidden sm:inline">Sync</span>
            </button>

            {/* Back to Public Portfolio */}
            <button
              onClick={onBackToPortfolio}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <Globe size={14} />
              <span className="hidden sm:inline">View Public Portfolio</span>
              <span className="sm:hidden">Portfolio</span>
            </button>

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Log out and lock dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Lock / Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Security & Isolation Pill */}
        <div className="flex items-center justify-between text-xs text-zinc-400 bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-2.5">
          <div className="flex items-center gap-2 text-emerald-400">
            <ShieldCheck size={16} />
            <span className="font-medium">Persistent SQLite Database Active & Encrypted Session Authorized</span>
          </div>
          <span className="hidden md:inline font-mono text-[11px] text-zinc-500">
            Node SQLite • WAL Mode • Server-Side Validation
          </span>
        </div>

        {/* Module Switcher: Financials & Savings vs Client Rating & Feedback */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#14141C] border border-white/10 w-fit">
          <button
            onClick={() => setAdminTab('financials')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'financials'
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Wallet size={15} />
            <span>Financials & ₹1 Lakh Savings Goal</span>
          </button>

          <button
            onClick={() => setAdminTab('feedback')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              adminTab === 'feedback'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 shadow-lg'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Star size={15} className={adminTab === 'feedback' ? 'fill-zinc-950' : ''} />
            <span>Client Ratings & Feedback</span>
          </button>
        </div>

        {/* TAB 1: FINANCIALS */}
        {adminTab === 'financials' && summary && (
          <>
            {/* 1. Goal Alert Banner (if savings plan falls short of target date) */}
            <GoalAlertBanner
              goal={summary.goal}
              onAdjustGoal={() => setIsEditGoalOpen(true)}
            />

            {/* 2. Overview Cards (All 8 Cards) */}
            <section aria-label="Financial Overview Cards">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-3 pl-1">
                Financial Performance Overview
              </h3>
              <OverviewCards overview={summary.overview} />
            </section>

            {/* 3. Savings Goal Widget */}
            <section aria-label="Savings Goal Widget">
              <SavingsGoalWidget
                goal={summary.goal}
                onEditGoal={() => setIsEditGoalOpen(true)}
              />
            </section>

            {/* 4. Savings Transactions Section */}
            <section aria-label="Savings Transactions">
              <SavingsTransactionsSection
                transactions={savingsTransactions}
                currentSavingsBalance={summary.overview.actualSavingsBalance}
                onAddTransaction={handleAddSavingsTransaction}
                onUpdateTransaction={handleUpdateSavingsTransaction}
                onDeleteTransaction={handleDeleteSavingsTransaction}
              />
            </section>

            {/* 5. Income & Expense Separation Section */}
            <section aria-label="Client Income and Expenses">
              <IncomeExpensesSection
                incomes={clientIncomes}
                expenses={expenses}
                onAddIncome={handleAddIncome}
                onUpdateIncome={handleUpdateIncome}
                onDeleteIncome={handleDeleteIncome}
                onAddExpense={handleAddExpense}
                onDeleteExpense={handleDeleteExpense}
              />
            </section>
          </>
        )}

        {/* TAB 2: CLIENT FEEDBACK & RATINGS */}
        {adminTab === 'feedback' && (
          <FeedbackManagementSection />
        )}
      </main>

      {/* Edit Goal Modal */}
      {summary && (
        <EditGoalModal
          goal={summary.goal}
          isOpen={isEditGoalOpen}
          onClose={() => setIsEditGoalOpen(false)}
          onSaveGoal={handleSaveGoal}
        />
      )}
    </div>
  );
};
