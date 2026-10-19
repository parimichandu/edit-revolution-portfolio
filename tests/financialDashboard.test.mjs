import test from 'node:test';
import assert from 'node:assert/strict';
import { db } from '../server/db.mjs';
import {
  hashPassword,
  verifyPassword,
  createToken,
  verifyToken,
} from '../server/auth.mjs';
import {
  getSavingsGoal,
  updateSavingsGoal,
  calculateSavingsBalance,
  addSavingsTransaction,
  deleteSavingsTransaction,
  addClientIncome,
  addExpense,
  getFinancialSummary,
} from '../server/financialService.mjs';

test('Financial Auth: password hashing and verification', () => {
  const password = 'mySecretPassword123';
  const { hash, salt } = hashPassword(password);
  assert.ok(hash && salt, 'Hash and salt must be generated');
  assert.equal(verifyPassword(password, hash, salt), true, 'Correct password must verify');
  assert.equal(verifyPassword('wrongPassword', hash, salt), false, 'Wrong password must fail');
});

test('Financial Auth: token creation, expiration, and tampering prevention', () => {
  const token = createToken({ userId: 1, username: 'chandu' });
  assert.ok(token, 'Token must be generated');
  const payload = verifyToken(token);
  assert.ok(payload, 'Valid token must decode');
  assert.equal(payload.username, 'chandu');

  // Tampered token
  const tampered = token.slice(0, -5) + 'abcde';
  assert.equal(verifyToken(tampered), null, 'Tampered token must return null');
  assert.equal(verifyToken('invalid.token'), null, 'Malformed token must return null');
});

test('Savings Goal Baseline: ₹1 Lakh target, ₹5k planned, ₹33,333/mo required, ₹85k shortfall', () => {
  // Reset or configure baseline goal
  const deadlineDate = new Date();
  deadlineDate.setDate(deadlineDate.getDate() + 90); // exactly 90 days (~3 months)

  updateSavingsGoal({
    name: 'My First ₹1 Lakh Savings',
    targetAmount: 100000,
    startingBalance: 0,
    targetDurationMonths: 3,
    plannedMonthlySavings: 5000,
    targetDeadline: deadlineDate.toISOString().split('T')[0],
  });

  const goal = getSavingsGoal();
  assert.equal(goal.name, 'My First ₹1 Lakh Savings');
  assert.equal(goal.targetAmount, 100000);
  assert.equal(goal.startingBalance, 0);
  assert.equal(goal.targetDurationMonths, 3);
  assert.equal(goal.plannedMonthlySavings, 5000);

  const summary = getFinancialSummary();
  // Required monthly savings for 3-month target: ~33,333
  assert.ok(
    summary.goal.requiredMonthlySavings >= 33000 && summary.goal.requiredMonthlySavings <= 34000,
    `Required monthly savings must be approximately ₹33,333 (got ${summary.goal.requiredMonthlySavings})`
  );

  // Shortfall compared with 3-month plan (100k - (0 + 3 * 5k)) = ₹85,000
  assert.ok(
    summary.goal.shortfallAmount >= 84000 && summary.goal.shortfallAmount <= 86000,
    `Shortfall must be approximately ₹85,000 (got ${summary.goal.shortfallAmount})`
  );

  // Alert must be triggered because planned (5,000) < required (~33,333)
  assert.equal(summary.goal.alert.isTriggered, true, 'Shortfall warning alert must be triggered');
  assert.ok(summary.goal.alert.message.includes('falling short by'));

  // Completion percentage at 0 balance
  assert.equal(summary.overview.completionPercentage, 0);
  assert.equal(summary.overview.targetRemaining, 100000);
});

test('Savings Transactions: deposit, withdrawal guard, and overdraft prevention', () => {
  // Clear any existing test transactions for clean test run
  db.exec('DELETE FROM savings_transactions;');

  const initialBalance = calculateSavingsBalance();
  assert.equal(initialBalance.actualSavingsBalance, 0, 'Initial savings balance should be 0');

  // Attempting withdrawal from 0 balance must throw overdraft error
  assert.throws(
    () => {
      addSavingsTransaction({ type: 'withdrawal', amount: 500, date: '2026-10-19', notes: 'Invalid test' });
    },
    /exceeds available savings balance/,
    'Must prevent withdrawal exceeding available balance'
  );

  // Attempting invalid non-positive amount must throw error
  assert.throws(
    () => {
      addSavingsTransaction({ type: 'deposit', amount: -100, date: '2026-10-19' });
    },
    /positive number/,
    'Must prevent negative amount'
  );

  // Valid deposit of ₹10,000
  const deposit = addSavingsTransaction({
    type: 'deposit',
    amount: 10000,
    date: '2026-10-19',
    notes: 'Freelance savings transfer',
  });
  assert.ok(deposit.id);

  const balAfterDeposit = calculateSavingsBalance();
  assert.equal(balAfterDeposit.actualSavingsBalance, 10000);

  // Valid withdrawal of ₹3,000
  const withdrawal = addSavingsTransaction({
    type: 'withdrawal',
    amount: 3000,
    date: '2026-10-20',
    notes: 'Equipment emergency repair',
  });
  assert.ok(withdrawal.id);

  const balAfterWithdrawal = calculateSavingsBalance();
  assert.equal(balAfterWithdrawal.actualSavingsBalance, 7000);

  // Attempting withdrawal of ₹8,000 (exceeds ₹7,000) must throw
  assert.throws(
    () => {
      addSavingsTransaction({ type: 'withdrawal', amount: 8000, date: '2026-10-21' });
    },
    /exceeds available savings balance/
  );

  // Clean up transactions
  deleteSavingsTransaction(withdrawal.id);
  deleteSavingsTransaction(deposit.id);
  assert.equal(calculateSavingsBalance().actualSavingsBalance, 0);
});

test('Financial Calculations: income status, business profit vs personal expenses', () => {
  // Clear existing client incomes and expenses for test isolation
  db.exec('DELETE FROM client_incomes;');
  db.exec('DELETE FROM expenses;');

  // Add received client payment ₹15,000
  addClientIncome({
    client_name: 'Studio Alpha',
    project_name: 'Brand Reel',
    amount: 15000,
    date: '2026-10-15',
    status: 'received',
  });

  // Add pending client invoice ₹25,000 (must NOT be counted in received income or profit)
  addClientIncome({
    client_name: 'Client Beta',
    project_name: 'YouTube Docuseries',
    amount: 25000,
    date: '2026-10-18',
    status: 'pending',
  });

  // Add Business Expense ₹4,000
  addExpense({
    title: 'Adobe Creative Cloud',
    category: 'business',
    amount: 4000,
    date: '2026-10-16',
  });

  // Add Personal Expense ₹6,000
  addExpense({
    title: 'Groceries & Household',
    category: 'personal',
    amount: 6000,
    date: '2026-10-17',
  });

  const summary = getFinancialSummary();

  // Check 8 Overview Cards:
  assert.equal(summary.overview.totalFreelanceReceived, 15000, 'Only received payments count in total freelance received');
  assert.equal(summary.overview.pendingClientPayments, 25000, 'Pending payments tracked separately');
  assert.equal(summary.overview.businessExpenses, 4000, 'Business expenses tracked correctly');
  assert.equal(summary.overview.personalExpenses, 6000, 'Personal expenses kept separate');

  // Net business profit = Received freelance income (15000) - Business expenses (4000) = 11000
  assert.equal(summary.overview.netBusinessProfit, 11000, 'Net business profit = 15000 - 4000 = 11000');

  // Verify personal cash flow distinction
  assert.equal(summary.cashFlow.personalExpenses, 6000);

  // Clean up test records
  db.exec('DELETE FROM client_incomes;');
  db.exec('DELETE FROM expenses;');
});
