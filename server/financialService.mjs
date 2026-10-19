import { db } from './db.mjs';

/**
 * Get active savings goal
 */
export function getSavingsGoal() {
  const goal = db.prepare('SELECT * FROM savings_goals ORDER BY id ASC LIMIT 1').get();
  if (!goal) return null;
  return {
    id: goal.id,
    name: goal.name,
    targetAmount: Number(goal.target_amount),
    startingBalance: Number(goal.starting_balance),
    targetDurationMonths: Number(goal.target_duration_months),
    plannedMonthlySavings: Number(goal.planned_monthly_savings),
    targetDeadline: goal.target_deadline,
    currency: goal.currency,
    goalType: goal.goal_type,
    createdAt: goal.created_at,
    updatedAt: goal.updated_at,
  };
}

/**
 * Update savings goal configuration
 */
export function updateSavingsGoal(updates) {
  const current = getSavingsGoal();
  if (!current) throw new Error('No savings goal configured');

  const name = updates.name !== undefined ? String(updates.name).trim() : current.name;
  const targetAmount = updates.targetAmount !== undefined ? Number(updates.targetAmount) : current.targetAmount;
  const startingBalance = updates.startingBalance !== undefined ? Number(updates.startingBalance) : current.startingBalance;
  const targetDurationMonths = updates.targetDurationMonths !== undefined ? Math.max(1, Math.round(Number(updates.targetDurationMonths))) : current.targetDurationMonths;
  const plannedMonthlySavings = updates.plannedMonthlySavings !== undefined ? Number(updates.plannedMonthlySavings) : current.plannedMonthlySavings;
  const targetDeadline = updates.targetDeadline ? String(updates.targetDeadline) : current.targetDeadline;

  if (isNaN(targetAmount) || targetAmount <= 0) {
    throw new Error('Target amount must be a positive number');
  }
  if (isNaN(startingBalance) || startingBalance < 0) {
    throw new Error('Starting balance cannot be negative');
  }
  if (isNaN(plannedMonthlySavings) || plannedMonthlySavings < 0) {
    throw new Error('Planned monthly savings cannot be negative');
  }

  db.prepare(`
    UPDATE savings_goals
    SET name = ?, target_amount = ?, starting_balance = ?,
        target_duration_months = ?, planned_monthly_savings = ?,
        target_deadline = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(
    name,
    targetAmount,
    startingBalance,
    targetDurationMonths,
    plannedMonthlySavings,
    targetDeadline,
    current.id
  );

  return getSavingsGoal();
}

/**
 * Calculate actual savings balance
 */
export function calculateSavingsBalance() {
  const goal = getSavingsGoal();
  const startingBalance = goal ? goal.startingBalance : 0;

  const depositRow = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM savings_transactions
    WHERE type = 'deposit'
  `).get();

  const withdrawalRow = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM savings_transactions
    WHERE type = 'withdrawal'
  `).get();

  const totalDeposits = Number(depositRow.total || 0);
  const totalWithdrawals = Number(withdrawalRow.total || 0);

  const actualSavingsBalance = startingBalance + totalDeposits - totalWithdrawals;
  return {
    startingBalance,
    totalDeposits,
    totalWithdrawals,
    actualSavingsBalance: Math.max(0, actualSavingsBalance),
  };
}

/**
 * Add a savings transaction with validation & overdraft protection
 */
export function addSavingsTransaction({ type, amount, date, notes }) {
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Transaction amount must be a positive number greater than 0');
  }
  if (!['deposit', 'withdrawal'].includes(type)) {
    throw new Error('Transaction type must be either deposit or withdrawal');
  }

  const { actualSavingsBalance } = calculateSavingsBalance();

  if (type === 'withdrawal' && numAmount > actualSavingsBalance) {
    throw new Error(
      `Withdrawal of ₹${numAmount.toLocaleString('en-IN')} exceeds available savings balance of ₹${actualSavingsBalance.toLocaleString('en-IN')}`
    );
  }

  const transactionDate = date ? String(date) : new Date().toISOString().split('T')[0];

  const result = db.prepare(`
    INSERT INTO savings_transactions (type, amount, date, notes)
    VALUES (?, ?, ?, ?)
  `).run(type, numAmount, transactionDate, notes ? String(notes).trim() : null);

  return db.prepare('SELECT * FROM savings_transactions WHERE id = ?').get(result.lastInsertRowid);
}

/**
 * Update an existing savings transaction
 */
export function updateSavingsTransaction(id, { type, amount, date, notes }) {
  const existing = db.prepare('SELECT * FROM savings_transactions WHERE id = ?').get(id);
  if (!existing) {
    throw new Error('Transaction not found');
  }

  const newType = type || existing.type;
  const numAmount = amount !== undefined ? Number(amount) : Number(existing.amount);

  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Transaction amount must be a positive number greater than 0');
  }
  if (!['deposit', 'withdrawal'].includes(newType)) {
    throw new Error('Transaction type must be either deposit or withdrawal');
  }

  // Check balance if this update were applied
  const goal = getSavingsGoal();
  const startingBalance = goal ? goal.startingBalance : 0;

  const allTx = db.prepare('SELECT id, type, amount FROM savings_transactions ORDER BY date ASC, id ASC').all();
  let simBalance = startingBalance;
  for (const tx of allTx) {
    const effType = tx.id === Number(id) ? newType : tx.type;
    const effAmount = tx.id === Number(id) ? numAmount : Number(tx.amount);
    if (effType === 'deposit') simBalance += effAmount;
    else simBalance -= effAmount;

    if (simBalance < 0) {
      throw new Error('Editing this transaction would cause the savings balance to become negative');
    }
  }

  const newDate = date || existing.date;
  const newNotes = notes !== undefined ? (notes ? String(notes).trim() : null) : existing.notes;

  db.prepare(`
    UPDATE savings_transactions
    SET type = ?, amount = ?, date = ?, notes = ?
    WHERE id = ?
  `).run(newType, numAmount, newDate, newNotes, id);

  return db.prepare('SELECT * FROM savings_transactions WHERE id = ?').get(id);
}

/**
 * Delete a savings transaction
 */
export function deleteSavingsTransaction(id) {
  const existing = db.prepare('SELECT * FROM savings_transactions WHERE id = ?').get(id);
  if (!existing) {
    throw new Error('Transaction not found');
  }

  // If deleting a deposit, ensure remaining balance won't be negative
  if (existing.type === 'deposit') {
    const { actualSavingsBalance } = calculateSavingsBalance();
    if (actualSavingsBalance - Number(existing.amount) < 0) {
      throw new Error('Deleting this deposit would cause the overall savings balance to drop below zero');
    }
  }

  db.prepare('DELETE FROM savings_transactions WHERE id = ?').run(id);
  return { success: true, deletedId: id };
}

/**
 * Get all savings transactions
 */
export function getSavingsTransactions() {
  return db.prepare('SELECT * FROM savings_transactions ORDER BY date DESC, id DESC').all();
}

/**
 * Incomes (Client payments / Invoices)
 */
export function getClientIncomes() {
  return db.prepare('SELECT * FROM client_incomes ORDER BY date DESC, id DESC').all();
}

export function addClientIncome({ client_name, project_name, amount, date, status, invoice_number, notes }) {
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Income amount must be greater than 0');
  }
  if (!client_name || !project_name) {
    throw new Error('Client name and project name are required');
  }
  const incomeStatus = ['received', 'pending'].includes(status) ? status : 'received';
  const incomeDate = date || new Date().toISOString().split('T')[0];

  const res = db.prepare(`
    INSERT INTO client_incomes (client_name, project_name, amount, date, status, invoice_number, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    String(client_name).trim(),
    String(project_name).trim(),
    numAmount,
    incomeDate,
    incomeStatus,
    invoice_number ? String(invoice_number).trim() : null,
    notes ? String(notes).trim() : null
  );

  return db.prepare('SELECT * FROM client_incomes WHERE id = ?').get(res.lastInsertRowid);
}

export function updateClientIncome(id, updates) {
  const existing = db.prepare('SELECT * FROM client_incomes WHERE id = ?').get(id);
  if (!existing) throw new Error('Income record not found');

  const client_name = updates.client_name ?? existing.client_name;
  const project_name = updates.project_name ?? existing.project_name;
  const amount = updates.amount !== undefined ? Number(updates.amount) : existing.amount;
  const date = updates.date ?? existing.date;
  const status = updates.status ?? existing.status;
  const invoice_number = updates.invoice_number !== undefined ? updates.invoice_number : existing.invoice_number;
  const notes = updates.notes !== undefined ? updates.notes : existing.notes;

  if (isNaN(amount) || amount <= 0) throw new Error('Amount must be positive');

  db.prepare(`
    UPDATE client_incomes
    SET client_name = ?, project_name = ?, amount = ?, date = ?, status = ?, invoice_number = ?, notes = ?
    WHERE id = ?
  `).run(client_name, project_name, amount, date, status, invoice_number, notes, id);

  return db.prepare('SELECT * FROM client_incomes WHERE id = ?').get(id);
}

export function deleteClientIncome(id) {
  const existing = db.prepare('SELECT * FROM client_incomes WHERE id = ?').get(id);
  if (!existing) throw new Error('Income record not found');
  db.prepare('DELETE FROM client_incomes WHERE id = ?').run(id);
  return { success: true, deletedId: id };
}

/**
 * Expenses (Business vs Personal)
 */
export function getExpenses() {
  return db.prepare('SELECT * FROM expenses ORDER BY date DESC, id DESC').all();
}

export function addExpense({ title, category, amount, date, notes }) {
  const numAmount = Number(amount);
  if (isNaN(numAmount) || numAmount <= 0) {
    throw new Error('Expense amount must be greater than 0');
  }
  if (!title) {
    throw new Error('Expense title is required');
  }
  if (!['business', 'personal'].includes(category)) {
    throw new Error('Expense category must be either business or personal');
  }
  const expDate = date || new Date().toISOString().split('T')[0];

  const res = db.prepare(`
    INSERT INTO expenses (title, category, amount, date, notes)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    String(title).trim(),
    category,
    numAmount,
    expDate,
    notes ? String(notes).trim() : null
  );

  return db.prepare('SELECT * FROM expenses WHERE id = ?').get(res.lastInsertRowid);
}

export function updateExpense(id, updates) {
  const existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
  if (!existing) throw new Error('Expense record not found');

  const title = updates.title ?? existing.title;
  const category = updates.category ?? existing.category;
  const amount = updates.amount !== undefined ? Number(updates.amount) : existing.amount;
  const date = updates.date ?? existing.date;
  const notes = updates.notes !== undefined ? updates.notes : existing.notes;

  if (isNaN(amount) || amount <= 0) throw new Error('Amount must be positive');
  if (!['business', 'personal'].includes(category)) throw new Error('Category must be business or personal');

  db.prepare(`
    UPDATE expenses
    SET title = ?, category = ?, amount = ?, date = ?, notes = ?
    WHERE id = ?
  `).run(title, category, amount, date, notes, id);

  return db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
}

export function deleteExpense(id) {
  const existing = db.prepare('SELECT * FROM expenses WHERE id = ?').get(id);
  if (!existing) throw new Error('Expense record not found');
  db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
  return { success: true, deletedId: id };
}

/**
 * Complete Financial Summary & Forecast Engine
 */
export function getFinancialSummary() {
  const goal = getSavingsGoal() || {
    name: 'My First ₹1 Lakh Savings',
    targetAmount: 100000,
    startingBalance: 0,
    targetDurationMonths: 3,
    plannedMonthlySavings: 5000,
    targetDeadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'INR',
    goalType: 'Personal savings',
  };

  const { startingBalance, totalDeposits, totalWithdrawals, actualSavingsBalance } =
    calculateSavingsBalance();

  // Incomes
  const receivedIncomeRow = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) as count
    FROM client_incomes
    WHERE status = 'received'
  `).get();

  const pendingIncomeRow = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) as count
    FROM client_incomes
    WHERE status = 'pending'
  `).get();

  const totalFreelanceReceived = Number(receivedIncomeRow.total || 0);
  const pendingClientPayments = Number(pendingIncomeRow.total || 0);
  const receivedIncomeCount = Number(receivedIncomeRow.count || 0);
  const pendingIncomeCount = Number(pendingIncomeRow.count || 0);

  // Expenses
  const businessExpenseRow = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) as count
    FROM expenses
    WHERE category = 'business'
  `).get();

  const personalExpenseRow = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total, COUNT(*) as count
    FROM expenses
    WHERE category = 'personal'
  `).get();

  const businessExpenses = Number(businessExpenseRow.total || 0);
  const personalExpenses = Number(personalExpenseRow.total || 0);
  const businessExpenseCount = Number(businessExpenseRow.count || 0);
  const personalExpenseCount = Number(personalExpenseRow.count || 0);

  // Net Business Profit
  // Rule: Total freelance payments actually received - Business expenses
  const netBusinessProfit = totalFreelanceReceived - businessExpenses;

  // Savings Goal calculations
  const targetRemaining = Math.max(0, goal.targetAmount - actualSavingsBalance);
  const completionPercentage =
    goal.targetAmount > 0
      ? Math.min(100, Math.round((actualSavingsBalance / goal.targetAmount) * 10000) / 100)
      : 0;

  // Time calculations
  const now = new Date();
  const deadline = new Date(goal.targetDeadline);
  const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate remaining months until deadline:
  // Use goal.targetDurationMonths or calculated months, minimum 1/30 month
  const rawMonthsRemaining = diffDays > 0 ? diffDays / 30.4375 : 0;
  const effectiveMonthsRemaining =
    rawMonthsRemaining > 0 ? Math.max(0.1, rawMonthsRemaining) : 0;

  // Required monthly savings to hit target deadline
  // In the baseline 3-month setup with 0 balance: 100,000 / 3 = 33,333.33 (~33,333)
  const durationMonthsForCalculation =
    effectiveMonthsRemaining > 0 ? effectiveMonthsRemaining : goal.targetDurationMonths;

  const requiredMonthlySavings =
    targetRemaining > 0 && durationMonthsForCalculation > 0
      ? Math.round(targetRemaining / durationMonthsForCalculation)
      : 0;

  // Shortfall compared with the current 3-month savings plan:
  // Current savings + (monthsRemaining * plannedMonthlySavings)
  const projectedSavingsByDeadline =
    actualSavingsBalance + durationMonthsForCalculation * goal.plannedMonthlySavings;

  const shortfallAmount = Math.max(
    0,
    Math.round(goal.targetAmount - projectedSavingsByDeadline)
  );

  // Projected completion date at planned pace:
  let projectedCompletionMonths = null;
  let projectedCompletionDate = null;
  if (goal.plannedMonthlySavings > 0) {
    projectedCompletionMonths = targetRemaining / goal.plannedMonthlySavings;
    const projDate = new Date();
    projDate.setDate(projDate.getDate() + Math.round(projectedCompletionMonths * 30.4375));
    projectedCompletionDate = projDate.toISOString().split('T')[0];
  }

  // Goal Alerts
  const hasShortfallAlert =
    targetRemaining > 0 && goal.plannedMonthlySavings < requiredMonthlySavings;

  return {
    overview: {
      totalFreelanceReceived,
      pendingClientPayments,
      businessExpenses,
      personalExpenses,
      netBusinessProfit,
      actualSavingsBalance,
      targetRemaining,
      completionPercentage,
      // Metadata to distinguish zero from unentered data
      hasReceivedIncomeData: receivedIncomeCount > 0,
      hasPendingIncomeData: pendingIncomeCount > 0,
      hasBusinessExpenseData: businessExpenseCount > 0,
      hasPersonalExpenseData: personalExpenseCount > 0,
    },
    goal: {
      ...goal,
      actualSavingsBalance,
      targetRemaining,
      completionPercentage,
      durationMonthsForCalculation: Math.round(durationMonthsForCalculation * 10) / 10,
      daysRemaining: Math.max(0, diffDays),
      requiredMonthlySavings,
      shortfallAmount,
      projectedSavingsByDeadline: Math.round(projectedSavingsByDeadline),
      projectedCompletionMonths:
        projectedCompletionMonths !== null ? Math.round(projectedCompletionMonths * 10) / 10 : null,
      projectedCompletionDate,
      assumptions:
        `Forecast assumes a steady monthly savings contribution of ₹${goal.plannedMonthlySavings.toLocaleString('en-IN')} with no additional withdrawals, emergency dips, interest compounding, or inflation adjustments. Target deadline evaluation spans ${goal.targetDurationMonths} months.`,
      alert: {
        isTriggered: hasShortfallAlert,
        message: hasShortfallAlert
          ? `At your current plan of ₹${goal.plannedMonthlySavings.toLocaleString('en-IN')}/month, you will save ₹${Math.round(projectedSavingsByDeadline).toLocaleString('en-IN')} by the target deadline, falling short by ₹${shortfallAmount.toLocaleString('en-IN')}. To hit your ₹${goal.targetAmount.toLocaleString('en-IN')} goal on schedule, you need to save ~₹${requiredMonthlySavings.toLocaleString('en-IN')}/month (+₹${Math.max(0, requiredMonthlySavings - goal.plannedMonthlySavings).toLocaleString('en-IN')}/mo increase).`
          : null,
      },
    },
    cashFlow: {
      businessIncomeReceived: totalFreelanceReceived,
      businessExpenses,
      netBusinessProfit,
      personalExpenses,
      savingsTransfersIn: totalDeposits,
      savingsWithdrawals: totalWithdrawals,
      netSavingsAddition: totalDeposits - totalWithdrawals,
    },
  };
}
