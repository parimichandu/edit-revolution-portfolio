import React, { useState } from 'react';
import {
  PlusCircle,
  ArrowDownLeft,
  ArrowUpRight,
  Trash2,
  Edit2,
  CheckCircle,
  AlertCircle,
  X,
  PiggyBank,
} from 'lucide-react';
import type { SavingsTransaction } from '../../types';

interface SavingsTransactionsSectionProps {
  transactions: SavingsTransaction[];
  currentSavingsBalance: number;
  onAddTransaction: (tx: {
    type: 'deposit' | 'withdrawal';
    amount: number;
    date: string;
    notes?: string;
  }) => Promise<void>;
  onUpdateTransaction: (
    id: number,
    tx: { type: 'deposit' | 'withdrawal'; amount: number; date: string; notes?: string }
  ) => Promise<void>;
  onDeleteTransaction: (id: number) => Promise<void>;
}

export const SavingsTransactionsSection: React.FC<SavingsTransactionsSectionProps> = ({
  transactions,
  currentSavingsBalance,
  onAddTransaction,
  onUpdateTransaction,
  onDeleteTransaction,
}) => {
  const [type, setType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editType, setEditType] = useState<'deposit' | 'withdrawal'>('deposit');
  const [editAmount, setEditAmount] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Please enter a valid amount greater than ₹0.');
      return;
    }

    if (type === 'withdrawal' && numAmount > currentSavingsBalance) {
      setErrorMessage(
        `Withdrawal of ₹${numAmount.toLocaleString('en-IN')} exceeds your current savings balance of ₹${currentSavingsBalance.toLocaleString('en-IN')}. Overdrafts are not permitted.`
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddTransaction({
        type,
        amount: numAmount,
        date,
        notes: notes.trim() || undefined,
      });
      setAmount('');
      setNotes('');
      setSuccessMessage(
        type === 'deposit'
          ? `Transferred ₹${numAmount.toLocaleString('en-IN')} into savings!`
          : `Withdrew ₹${numAmount.toLocaleString('en-IN')} from savings.`
      );
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to record transaction';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartEdit = (tx: SavingsTransaction) => {
    setEditingId(tx.id);
    setEditType(tx.type);
    setEditAmount(String(tx.amount));
    setEditDate(tx.date);
    setEditNotes(tx.notes || '');
  };

  const handleSaveEdit = async (id: number) => {
    setErrorMessage(null);
    const numAmount = parseFloat(editAmount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMessage('Amount must be greater than ₹0.');
      return;
    }

    try {
      await onUpdateTransaction(id, {
        type: editType,
        amount: numAmount,
        date: editDate,
        notes: editNotes.trim() || undefined,
      });
      setEditingId(null);
      setSuccessMessage('Transaction updated successfully.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update transaction';
      setErrorMessage(message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this savings transaction?')) return;
    try {
      await onDeleteTransaction(id);
      setSuccessMessage('Transaction deleted.');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete transaction';
      setErrorMessage(message);
    }
  };

  return (
    <div className="rounded-3xl bg-[#121217]/90 border border-white/10 p-6 md:p-8 backdrop-blur-xl shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
            <PiggyBank size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold font-['Outfit'] text-white">
              Savings Transactions
            </h3>
            <p className="text-xs text-zinc-400">
              Record money transferred into your savings pot or withdrawals with balance protection.
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold self-start sm:self-auto">
          Available: ₹{currentSavingsBalance.toLocaleString('en-IN')}
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

      {/* Entry Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Type Selector */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#0A0A0E] border border-white/10">
              <button
                type="button"
                onClick={() => setType('deposit')}
                className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  type === 'deposit'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ArrowDownLeft size={14} />
                <span>Transfer In</span>
              </button>
              <button
                type="button"
                onClick={() => setType('withdrawal')}
                className={`flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  type === 'withdrawal'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <ArrowUpRight size={14} />
                <span>Withdraw</span>
              </button>
            </div>
          </div>

          {/* Amount Input */}
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Date Input */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Notes Input */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Notes / Description (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. YouTube client payment portion"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0A0A0E] border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            <PlusCircle size={15} />
            <span>{type === 'deposit' ? 'Save Transfer' : 'Record Withdrawal'}</span>
          </button>
        </div>
      </form>

      {/* Transaction History Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-zinc-300">
          <thead className="border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            <tr>
              <th className="pb-3 pl-2">Type</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Notes</th>
              <th className="pb-3 text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-zinc-500">
                  No savings transactions recorded yet. Starting balance is ₹0.
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  {editingId === tx.id ? (
                    <>
                      <td className="py-3 pl-2">
                        <select
                          value={editType}
                          onChange={(e) => setEditType(e.target.value as 'deposit' | 'withdrawal')}
                          className="bg-zinc-900 border border-white/20 rounded px-2 py-1 text-xs text-white"
                        >
                          <option value="deposit">Deposit (+)</option>
                          <option value="withdrawal">Withdrawal (-)</option>
                        </select>
                      </td>
                      <td className="py-3">
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="bg-zinc-900 border border-white/20 rounded px-2 py-1 text-xs text-white"
                        />
                      </td>
                      <td className="py-3">
                        <input
                          type="number"
                          step="any"
                          value={editAmount}
                          onChange={(e) => setEditAmount(e.target.value)}
                          className="bg-zinc-900 border border-white/20 rounded px-2 py-1 text-xs text-white w-24"
                        />
                      </td>
                      <td className="py-3">
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          className="bg-zinc-900 border border-white/20 rounded px-2 py-1 text-xs text-white w-full"
                        />
                      </td>
                      <td className="py-3 text-right pr-2">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveEdit(tx.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-semibold"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 pl-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border ${
                            tx.type === 'deposit'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {tx.type === 'deposit' ? (
                            <>
                              <ArrowDownLeft size={12} />
                              Transfer In
                            </>
                          ) : (
                            <>
                              <ArrowUpRight size={12} />
                              Withdrawal
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 text-zinc-300 font-mono text-[11px]">
                        {tx.date}
                      </td>
                      <td className="py-3 font-semibold font-['Outfit'] text-sm">
                        <span className={tx.type === 'deposit' ? 'text-emerald-400' : 'text-rose-400'}>
                          {tx.type === 'deposit' ? '+' : '-'}₹{Number(tx.amount).toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 text-zinc-400 max-w-xs truncate">
                        {tx.notes || '—'}
                      </td>
                      <td className="py-3 text-right pr-2">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleStartEdit(tx)}
                            title="Edit Transaction"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            title="Delete Transaction"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
