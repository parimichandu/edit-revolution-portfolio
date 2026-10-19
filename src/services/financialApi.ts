import type {
  FinancialSummaryData,
  SavingsGoal,
  SavingsTransaction,
  ClientIncome,
  Expense,
  FeedbackRequest,
  ClientReview,
  FeedbackStats,
  PublicTestimonialItem,
  FeedbackValidationResult,
} from '../types';

const TOKEN_KEY = 'edit_revolution_auth_token';

class FinancialApiClient {
  private token: string | null = null;

  constructor() {
    this.token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
  }

  public setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
  }

  public getToken(): string | null {
    if (!this.token && typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  public isAuthenticated(): boolean {
    return Boolean(this.getToken());
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    const token = this.getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(endpoint, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      this.setToken(null);
      throw new Error('Unauthorized: Session expired or invalid credentials. Please log in again.');
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data as T;
  }

  // Auth Endpoints
  async login(username: string, password: string): Promise<{ success: boolean; token: string; user: { id: number; username: string } }> {
    const res = await this.request<{ success: boolean; token: string; user: { id: number; username: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    if (res.token) {
      this.setToken(res.token);
    }
    return res;
  }

  async logout(): Promise<void> {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      this.setToken(null);
    }
  }

  async checkAuth(): Promise<{ authenticated: boolean; user?: { userId: number; username: string } }> {
    if (!this.getToken()) return { authenticated: false };
    try {
      const res = await this.request<{ authenticated: boolean; user: { userId: number; username: string } }>('/api/auth/me');
      return res;
    } catch {
      this.setToken(null);
      return { authenticated: false };
    }
  }

  // Financial Summary
  async getSummary(): Promise<FinancialSummaryData> {
    return this.request<FinancialSummaryData>('/api/financial/summary');
  }

  // Savings Goal
  async updateGoal(updates: Partial<SavingsGoal>): Promise<{ success: boolean; goal: SavingsGoal }> {
    return this.request<{ success: boolean; goal: SavingsGoal }>('/api/financial/goal', {
      method: 'POST',
      body: JSON.stringify(updates),
    });
  }

  // Savings Transactions
  async getSavingsTransactions(): Promise<SavingsTransaction[]> {
    return this.request<SavingsTransaction[]>('/api/financial/savings');
  }

  async addSavingsTransaction(transaction: {
    type: 'deposit' | 'withdrawal';
    amount: number;
    date: string;
    notes?: string;
  }): Promise<{ success: boolean; transaction: SavingsTransaction }> {
    return this.request<{ success: boolean; transaction: SavingsTransaction }>('/api/financial/savings', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateSavingsTransaction(
    id: number,
    transaction: { type: 'deposit' | 'withdrawal'; amount: number; date: string; notes?: string }
  ): Promise<{ success: boolean; transaction: SavingsTransaction }> {
    return this.request<{ success: boolean; transaction: SavingsTransaction }>(`/api/financial/savings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  }

  async deleteSavingsTransaction(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/financial/savings/${id}`, {
      method: 'DELETE',
    });
  }

  // Client Incomes
  async getClientIncomes(): Promise<ClientIncome[]> {
    return this.request<ClientIncome[]>('/api/financial/incomes');
  }

  async addClientIncome(income: {
    client_name: string;
    project_name: string;
    amount: number;
    date: string;
    status: 'received' | 'pending';
    invoice_number?: string;
    notes?: string;
  }): Promise<{ success: boolean; income: ClientIncome }> {
    return this.request<{ success: boolean; income: ClientIncome }>('/api/financial/incomes', {
      method: 'POST',
      body: JSON.stringify(income),
    });
  }

  async updateClientIncome(
    id: number,
    income: Partial<ClientIncome>
  ): Promise<{ success: boolean; income: ClientIncome }> {
    return this.request<{ success: boolean; income: ClientIncome }>(`/api/financial/incomes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(income),
    });
  }

  async deleteClientIncome(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/financial/incomes/${id}`, {
      method: 'DELETE',
    });
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return this.request<Expense[]>('/api/financial/expenses');
  }

  async addExpense(expense: {
    title: string;
    category: 'business' | 'personal';
    amount: number;
    date: string;
    notes?: string;
  }): Promise<{ success: boolean; expense: Expense }> {
    return this.request<{ success: boolean; expense: Expense }>('/api/financial/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  }

  async updateExpense(
    id: number,
    expense: Partial<Expense>
  ): Promise<{ success: boolean; expense: Expense }> {
    return this.request<{ success: boolean; expense: Expense }>(`/api/financial/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  }

  async deleteExpense(id: number): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(`/api/financial/expenses/${id}`, {
      method: 'DELETE',
    });
  }

  // -------------------------------------------------------------------------
  // Client Rating & Feedback Methods
  // -------------------------------------------------------------------------

  // Public: Validate feedback token
  async validateFeedbackToken(token: string): Promise<FeedbackValidationResult> {
    const res = await fetch(`/api/feedback/validate-token?token=${encodeURIComponent(token)}`);
    return res.json();
  }

  // Public: Submit client feedback
  async submitClientFeedback(data: {
    token: string;
    overallRating: number;
    qualityRating: number;
    communicationRating: number;
    deliveryRating: number;
    writtenReview?: string;
    allowPublicDisplay: boolean;
  }): Promise<{ success: boolean; message: string; reviewId?: number }> {
    const res = await fetch('/api/feedback/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(json.error || 'Failed to submit feedback');
    }
    return json;
  }

  // Public: Fetch approved client testimonials
  async getPublicTestimonials(): Promise<PublicTestimonialItem[]> {
    try {
      const res = await fetch('/api/feedback/public-testimonials');
      if (!res.ok) return [];
      return res.json();
    } catch {
      return [];
    }
  }

  // Admin: Create feedback link for completed project
  async createFeedbackLink(data: {
    client_name: string;
    client_contact?: string;
    project_title: string;
    deliverable_type?: string;
    expiry_days?: number;
  }): Promise<{ success: boolean; request: FeedbackRequest & { feedbackUrl: string; whatsappShareUrl: string } }> {
    return this.request<{
      success: boolean;
      request: FeedbackRequest & { feedbackUrl: string; whatsappShareUrl: string };
    }>('/api/admin/feedback/create-link', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin: Fetch feedback statistics & improvement areas
  async getFeedbackStats(): Promise<FeedbackStats> {
    return this.request<FeedbackStats>('/api/admin/feedback/stats');
  }

  // Admin: Fetch all reviews and pending requests
  async getFeedbackList(): Promise<{ reviews: ClientReview[]; pendingRequests: FeedbackRequest[] }> {
    return this.request<{ reviews: ClientReview[]; pendingRequests: FeedbackRequest[] }>('/api/admin/feedback/list');
  }

  // Admin: Moderate review (approve/reject/archive/notes/private response)
  async moderateReview(
    reviewId: number,
    data: { status?: string; adminNotes?: string; privateResponse?: string }
  ): Promise<{ success: boolean; review: ClientReview }> {
    return this.request<{ success: boolean; review: ClientReview }>(`/api/admin/feedback/moderate/${reviewId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Admin: Delete review
  async deleteReview(reviewId: number): Promise<{ success: boolean; deletedId: number }> {
    return this.request<{ success: boolean; deletedId: number }>(`/api/admin/feedback/${reviewId}`, {
      method: 'DELETE',
    });
  }
}

export const financialApi = new FinancialApiClient();
