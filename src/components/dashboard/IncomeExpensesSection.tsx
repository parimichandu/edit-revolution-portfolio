import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Briefcase,
  User,
  AlertCircle,
  X,
  FileText,
} from 'lucide-react';
import type { ClientIncome, Expense } from '../../types';

interface IncomeExpensesSectionProps {
  incomes: ClientIncome[];
  expenses: Expense[];
  onAddIncome: (inc: {
    client_name: string;
    project_name: string;
    amount: number;
    date: string;
    status: 'received' | 'pending';
    invoice_number?: string;
    notes?: string;
  }) => Promise<void>;
  onUpdateIncome: (id: number, inc: Partial<ClientIncome>) => Promise<void>;
  onDeleteIncome: (id: number) => Promise<void>;
  onAddExpense: (exp: {
    title: string;
    category: 'business' | 'personal';
    amount: number;
    date: string;
    notes?: string;
  }) => Promise<void>;
  onDeleteExpense: (id: number) => Promise<void>;
}

export const IncomeExpensesSection: React.FC<IncomeExpensesSectionProps> = ({
  incomes,
  expenses,
  onAddIncome,
  onUpdateIncome,
  onDeleteIncome,
  onAddExpense,
  onDeleteExpense,
}) => {
  const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');

  // Income Form
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeDate, setIncomeDate] = useState(new Date().toISOString().split('T')[0]);
  const [incomeStatus, setIncomeStatus] = useState<'received' | 'pending'>('received');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [incomeNotes, setIncomeNotes] = useState('');

  // Expense Form
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<'business' | 'personal'>('business');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [expenseNotes, setExpenseNotes] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleIncomeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const amount = parseFloat(incomeAmount);
    if (!clientName || !projectName) {
      setErrorMessage('Client name and project name are required.');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage('Income amount must be greater than ₹0.');
      return;
    }

    try {
      await onAddIncome({
        client_name: clientName.trim(),
        project_name: projectName.trim(),
        amount,
        date: incomeDate,
        status: incomeStatus,
        invoice_number: invoiceNumber.trim() || undefined,
        notes: incomeNotes.trim() || undefined,
      });
      setClientName('');
      setProjectName('');
      setIncomeAmount('');
      setInvoiceNumber('');
      setIncomeNotes('');
      setSuccessMessage(`Recorded ${incomeStatus === 'received' ? 'received payment' : 'pending invoice'} of ₹${amount.toLocaleString('en-IN')}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to record income';
      setErrorMessage(msg);
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const amount = parseFloat(expenseAmount);
    if (!expenseTitle) {
      setErrorMessage('Expense title is required.');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      setErrorMessage('Expense amount must be greater than ₹0.');
      return;
    }

    try {
      await onAddExpense({
        title: expenseTitle.trim(),
        category: expenseCategory,
        amount,
        date: expenseDate,
        notes: expenseNotes.trim() || undefined,
      });
      setExpenseTitle('');
      setExpenseAmount('');
      setExpenseNotes('');
      setSuccessMessage(`Recorded ${expenseCategory} expense of ₹${amount.toLocaleString('en-IN')}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to record expense';
      setErrorMessage(msg);
    }
  };

  const handleToggleIncomeStatus = async (income: ClientIncome) => {
    const newStatus = income.status === 'received' ? 'pending' : 'received';
    try {
      await onUpdateIncome(income.id, { status: newStatus });
      setSuccessMessage(
        newStatus === 'received'
          ? `Marked invoice as Received (+₹${income.amount.toLocaleString('en-IN')} added to profit).`
          : `Marked invoice as Pending.`
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to toggle status';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="rounded-3xl bg-[#121217]/90 border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-xl">
      {/* Header and Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <h3 className="text-xl font-bold font-['Outfit'] text-white">
            Income & Expense Separation
          </h3>
          <p className="text-xs text-zinc-400">
            Freelance client payments and business expenses tracked distinctly from personal cash flow.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0A0A0E] border border-white/10 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('income')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'income'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <DollarSign size={14} />
            <span>Client Incomes ({incomes.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'expenses'
                ? 'bg-gradient-to-r from-rose-600 to-pink-500 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileText size={14} />
            <span>Expenses ({expenses.length})</span>
          </button>
        </div>
      </div>

      {/* Alert Notices */}
      {errorMessage && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="ml-auto text-rose-300 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
          <CheckCircle size={16} className="shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* TAB 1: CLIENT INCOMES */}
      {activeTab === 'income' && (
        <div>
          <form onSubmit={handleIncomeSubmit} className="mb-8 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Client Name
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Tarun Dental Clinic / Klook"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Project Title / Deliverable
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. 5x Instagram Reels Batch"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Amount (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={incomeAmount}
                    onChange={(e) => setIncomeAmount(e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Payment Status
                </label>
                <select
                  value={incomeStatus}
                  onChange={(e) => setIncomeStatus(e.target.value as 'received' | 'pending')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="received">Received (Adds to Net Business Profit)</option>
                  <option value="pending">Pending (Invoice issued, awaiting payout)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={incomeDate}
                  onChange={(e) => setIncomeDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Invoice # / Notes (Optional)
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. INV-2026-004"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">
                ⚠️ Rule enforced: Invoices are not counted as received income or profit until marked as "Received".
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer"
              >
                <Plus size={15} />
                <span>Record Client Payment</span>
              </button>
            </div>
          </form>

          {/* Incomes Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="pb-3 pl-2">Status</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Project</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Invoice #</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {incomes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-zinc-500">
                      No client payments recorded yet. Received total is ₹0.
                    </td>
                  </tr>
                ) : (
                  incomes.map((inc) => (
                    <tr key={inc.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pl-2">
                        <button
                          onClick={() => handleToggleIncomeStatus(inc)}
                          title="Click to toggle status"
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border cursor-pointer transition-all ${
                            inc.status === 'received'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                          }`}
                        >
                          {inc.status === 'received' ? (
                            <>
                              <CheckCircle size={12} />
                              Received
                            </>
                          ) : (
                            <>
                              <Clock size={12} />
                              Pending
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3 font-semibold text-white">
                        {inc.client_name}
                      </td>
                      <td className="py-3 text-zinc-300">
                        {inc.project_name}
                      </td>
                      <td className="py-3 text-zinc-400 font-mono text-[11px]">
                        {inc.date}
                      </td>
                      <td className="py-3 font-semibold font-['Outfit'] text-sm text-emerald-400">
                        ₹{Number(inc.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-zinc-400 font-mono text-[11px]">
                        {inc.invoice_number || '—'}
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => onDeleteIncome(inc.id)}
                          title="Delete Income Record"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: EXPENSES */}
      {activeTab === 'expenses' && (
        <div>
          <form onSubmit={handleExpenseSubmit} className="mb-8 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Expense Description
                </label>
                <input
                  type="text"
                  required
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="e.g. Adobe Premiere / Soundly SFX"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Category
                </label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as 'business' | 'personal')}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="business">Business (Deducted from Business Profit)</option>
                  <option value="personal">Personal (Personal Cash Flow Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Amount (₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-zinc-400">
                💡 Business expenses subtract from Net Business Profit. Personal expenses do NOT touch business profit.
              </span>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer"
              >
                <Plus size={15} />
                <span>Record Expense</span>
              </button>
            </div>
          </form>

          {/* Expenses Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                <tr>
                  <th className="pb-3 pl-2">Category</th>
                  <th className="pb-3">Title</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      No expenses recorded yet. Total is ₹0.
                    </td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 pl-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            exp.category === 'business'
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                          }`}
                        >
                          {exp.category === 'business' ? (
                            <>
                              <Briefcase size={12} />
                              Business
                            </>
                          ) : (
                            <>
                              <User size={12} />
                              Personal
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 font-semibold text-white">
                        {exp.title}
                      </td>
                      <td className="py-3 text-zinc-400 font-mono text-[11px]">
                        {exp.date}
                      </td>
                      <td className="py-3 font-semibold font-['Outfit'] text-sm text-rose-400">
                        ₹{Number(exp.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          title="Delete Expense"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
