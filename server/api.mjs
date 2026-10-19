import {
  hashPassword,
  verifyPassword,
  createToken,
  verifyToken,
} from './auth.mjs';
import { db } from './db.mjs';
import {
  getSavingsGoal,
  updateSavingsGoal,
  getSavingsTransactions,
  addSavingsTransaction,
  updateSavingsTransaction,
  deleteSavingsTransaction,
  getClientIncomes,
  addClientIncome,
  updateClientIncome,
  deleteClientIncome,
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getFinancialSummary,
} from './financialService.mjs';
import {
  createFeedbackRequest,
  validateFeedbackToken,
  submitClientFeedback,
  getFeedbackStats,
  getAllFeedbackList,
  moderateReview,
  deleteReview,
  getPublicApprovedTestimonials,
} from './feedbackService.mjs';

/**
 * Read request body as JSON
 */
export async function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 2 * 1024 * 1024) {
        // 2MB limit
        reject(new Error('Request payload too large'));
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (err) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * Send JSON response helper
 */
export function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

/**
 * Authenticate incoming request using Authorization header or cookie
 */
export function authenticateRequest(req) {
  const authHeader = req.headers['authorization'];
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7).trim();
  } else if (req.headers['cookie']) {
    const cookies = Object.fromEntries(
      req.headers['cookie'].split(';').map((c) => {
        const [k, ...v] = c.trim().split('=');
        return [k, decodeURIComponent(v.join('='))];
      })
    );
    token = cookies['edit_revolution_token'] || null;
  }

  if (!token) return null;
  return verifyToken(token);
}

/**
 * Main API request dispatcher
 * Compatible with both Vite connect middleware and Node http.createServer
 */
export async function handleApiRequest(req, res, next) {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname;

  // If mounted on Vite's /api prefix directly or full url
  if (!pathname.startsWith('/api')) {
    if (next) return next();
    return sendJson(res, 404, { error: 'Not found' });
  }

  // Set CORS headers for local testing
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  try {
    // -------------------------------------------------------------------------
    // AUTH ENDPOINTS (Public login, protected logout/me)
    // -------------------------------------------------------------------------
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const { username, password } = await readJsonBody(req);
      if (!username || !password) {
        return sendJson(res, 400, { error: 'Username and password are required' });
      }

      const user = db.prepare('SELECT * FROM users WHERE username = ?').get(String(username).trim());
      if (!user || !verifyPassword(password, user.password_hash, user.salt)) {
        return sendJson(res, 401, { error: 'Invalid username or password' });
      }

      const token = createToken({ userId: user.id, username: user.username });
      res.setHeader(
        'Set-Cookie',
        `edit_revolution_token=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${7 * 24 * 60 * 60}`
      );

      return sendJson(res, 200, {
        success: true,
        token,
        user: { id: user.id, username: user.username },
      });
    }

    if (pathname === '/api/auth/logout' && req.method === 'POST') {
      res.setHeader('Set-Cookie', 'edit_revolution_token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0');
      return sendJson(res, 200, { success: true, message: 'Logged out successfully' });
    }

    if (pathname === '/api/auth/me' && req.method === 'GET') {
      const userPayload = authenticateRequest(req);
      if (!userPayload) {
        return sendJson(res, 401, { error: 'Unauthorized' });
      }
      return sendJson(res, 200, { authenticated: true, user: userPayload });
    }

    if (pathname === '/api/auth/change-password' && req.method === 'POST') {
      const userPayload = authenticateRequest(req);
      if (!userPayload) return sendJson(res, 401, { error: 'Unauthorized' });

      const { currentPassword, newPassword } = await readJsonBody(req);
      if (!newPassword || newPassword.length < 6) {
        return sendJson(res, 400, { error: 'New password must be at least 6 characters long' });
      }

      const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userPayload.userId);
      if (!user || !verifyPassword(currentPassword, user.password_hash, user.salt)) {
        return sendJson(res, 400, { error: 'Current password is incorrect' });
      }

      const { hash, salt } = hashPassword(newPassword);
      db.prepare('UPDATE users SET password_hash = ?, salt = ? WHERE id = ?').run(hash, salt, user.id);

      return sendJson(res, 200, { success: true, message: 'Password updated successfully' });
    }

    // -------------------------------------------------------------------------
    // SERVER-SIDE AUTHORIZATION GATE FOR ALL FINANCIAL DATA
    // -------------------------------------------------------------------------
    if (pathname.startsWith('/api/financial')) {
      const userPayload = authenticateRequest(req);
      if (!userPayload) {
        return sendJson(res, 401, {
          error: 'Unauthorized: Access to financial dashboard data is protected and restricted to authenticated administrators.',
        });
      }

      // 1. Overall Summary (All 8 Overview Cards + Savings Widget + Cash Flow)
      if (pathname === '/api/financial/summary' && req.method === 'GET') {
        const summary = getFinancialSummary();
        return sendJson(res, 200, summary);
      }

      // 2. Savings Goal Config
      if (pathname === '/api/financial/goal') {
        if (req.method === 'GET') {
          return sendJson(res, 200, getSavingsGoal());
        }
        if (req.method === 'POST' || req.method === 'PUT') {
          const body = await readJsonBody(req);
          const updated = updateSavingsGoal(body);
          return sendJson(res, 200, { success: true, goal: updated });
        }
      }

      // 3. Savings Transactions
      if (pathname === '/api/financial/savings') {
        if (req.method === 'GET') {
          return sendJson(res, 200, getSavingsTransactions());
        }
        if (req.method === 'POST') {
          const body = await readJsonBody(req);
          const created = addSavingsTransaction(body);
          return sendJson(res, 201, { success: true, transaction: created });
        }
      }

      const savingsMatch = pathname.match(/^\/api\/financial\/savings\/(\d+)$/);
      if (savingsMatch) {
        const id = Number(savingsMatch[1]);
        if (req.method === 'PUT') {
          const body = await readJsonBody(req);
          const updated = updateSavingsTransaction(id, body);
          return sendJson(res, 200, { success: true, transaction: updated });
        }
        if (req.method === 'DELETE') {
          const result = deleteSavingsTransaction(id);
          return sendJson(res, 200, result);
        }
      }

      // 4. Client Incomes (Freelance Payments)
      if (pathname === '/api/financial/incomes') {
        if (req.method === 'GET') {
          return sendJson(res, 200, getClientIncomes());
        }
        if (req.method === 'POST') {
          const body = await readJsonBody(req);
          const created = addClientIncome(body);
          return sendJson(res, 201, { success: true, income: created });
        }
      }

      const incomeMatch = pathname.match(/^\/api\/financial\/incomes\/(\d+)$/);
      if (incomeMatch) {
        const id = Number(incomeMatch[1]);
        if (req.method === 'PUT') {
          const body = await readJsonBody(req);
          const updated = updateClientIncome(id, body);
          return sendJson(res, 200, { success: true, income: updated });
        }
        if (req.method === 'DELETE') {
          const result = deleteClientIncome(id);
          return sendJson(res, 200, result);
        }
      }

      // 5. Expenses (Business vs Personal)
      if (pathname === '/api/financial/expenses') {
        if (req.method === 'GET') {
          return sendJson(res, 200, getExpenses());
        }
        if (req.method === 'POST') {
          const body = await readJsonBody(req);
          const created = addExpense(body);
          return sendJson(res, 201, { success: true, expense: created });
        }
      }

      const expenseMatch = pathname.match(/^\/api\/financial\/expenses\/(\d+)$/);
      if (expenseMatch) {
        const id = Number(expenseMatch[1]);
        if (req.method === 'PUT') {
          const body = await readJsonBody(req);
          const updated = updateExpense(id, body);
          return sendJson(res, 200, { success: true, expense: updated });
        }
        if (req.method === 'DELETE') {
          const result = deleteExpense(id);
          return sendJson(res, 200, result);
        }
      }
    }

    // -------------------------------------------------------------------------
    // PUBLIC CLIENT FEEDBACK & TESTIMONIAL ENDPOINTS
    // -------------------------------------------------------------------------
    if (pathname === '/api/feedback/validate-token' && req.method === 'GET') {
      const token = parsedUrl.searchParams.get('token');
      const validation = validateFeedbackToken(token);
      return sendJson(res, 200, validation);
    }

    if (pathname === '/api/feedback/submit' && req.method === 'POST') {
      const body = await readJsonBody(req);
      const result = submitClientFeedback(body);
      return sendJson(res, 200, result);
    }

    if (pathname === '/api/feedback/public-testimonials' && req.method === 'GET') {
      const testimonials = getPublicApprovedTestimonials();
      return sendJson(res, 200, testimonials);
    }

    // -------------------------------------------------------------------------
    // ADMIN FEEDBACK MANAGEMENT (Requires Authorization)
    // -------------------------------------------------------------------------
    if (pathname.startsWith('/api/admin/feedback')) {
      const userPayload = authenticateRequest(req);
      if (!userPayload) {
        return sendJson(res, 401, { error: 'Unauthorized: Admin authentication required to access feedback management.' });
      }

      if (pathname === '/api/admin/feedback/create-link' && req.method === 'POST') {
        const body = await readJsonBody(req);
        const host = req.headers.host || 'localhost:5173';
        const protocol = req.headers['x-forwarded-proto'] || 'http';
        const baseUrl = `${protocol}://${host}`;
        const created = createFeedbackRequest({ ...body, baseUrl });
        return sendJson(res, 201, { success: true, request: created });
      }

      if (pathname === '/api/admin/feedback/stats' && req.method === 'GET') {
        const stats = getFeedbackStats();
        return sendJson(res, 200, stats);
      }

      if (pathname === '/api/admin/feedback/list' && req.method === 'GET') {
        const list = getAllFeedbackList();
        return sendJson(res, 200, list);
      }

      const moderateMatch = pathname.match(/^\/api\/admin\/feedback\/moderate\/(\d+)$/);
      if (moderateMatch && req.method === 'POST') {
        const id = Number(moderateMatch[1]);
        const body = await readJsonBody(req);
        const updated = moderateReview(id, body);
        return sendJson(res, 200, { success: true, review: updated });
      }

      const deleteMatch = pathname.match(/^\/api\/admin\/feedback\/(\d+)$/);
      if (deleteMatch && req.method === 'DELETE') {
        const id = Number(deleteMatch[1]);
        const result = deleteReview(id);
        return sendJson(res, 200, result);
      }
    }

    // Default 404 for unhandled API routes
    return sendJson(res, 404, { error: 'API route not found' });
  } catch (error) {
    console.error('API Error:', error);
    return sendJson(res, 400, { error: error.message || 'Internal server error' });
  }
}
