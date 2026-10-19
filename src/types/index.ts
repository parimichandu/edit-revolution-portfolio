export type ProjectCategory = 
  | 'All' 
  | 'Instagram Reels' 
  | 'YouTube Shorts' 
  | 'Promotional Video' 
  | 'AI Video Creation' 
  | 'Motion Graphics' 
  | 'Cinematic Edits';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  aspectRatio: '9:16' | '16:9';
  description: string;
  client: string;
  duration: string;
  views?: string;
  retention?: string;
  tools: string[];
  tags: string[];
  highlights: string[];
  thumbnailUrl: string;
  videoPreviewUrl?: string; // Optional direct video or interactive preview
  enableThumbnail?: boolean; // User option to enable thumbnail (especially for YouTube Shorts)
  sourcePath?: string; // Original source path if imported (e.g. "E:\\klook redit .mp4")
  beforeAfter?: {
    rawLabel: string;
    gradedLabel: string;
    rawImage: string;
    gradedImage: string;
  };
}

export interface Service {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  features: string[];
  startingPrice: string;
  turnaround: string;
  iconName: string;
  recommendedFor: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  deliverables: string[];
  duration: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  projectType: string;
  metrics?: string;
  rating: number;
}

export interface SkillItem {
  name: string;
  percentage: number;
  description: string;
  category: 'editing' | 'technical' | 'creative';
}

export interface ToolItem {
  name: string;
  role: string;
  level: string;
  iconKey: string;
  color: string;
}

// ---------------------------------------------------------------------------
// Financial Dashboard Types
// ---------------------------------------------------------------------------

export interface SavingsGoal {
  id?: number;
  name: string;
  targetAmount: number;
  startingBalance: number;
  targetDurationMonths: number;
  plannedMonthlySavings: number;
  targetDeadline: string;
  currency: string;
  goalType: string;
  createdAt?: string;
  updatedAt?: string;
  actualSavingsBalance?: number;
  targetRemaining?: number;
  completionPercentage?: number;
  durationMonthsForCalculation?: number;
  daysRemaining?: number;
  requiredMonthlySavings?: number;
  shortfallAmount?: number;
  projectedSavingsByDeadline?: number;
  projectedCompletionMonths?: number | null;
  projectedCompletionDate?: string | null;
  assumptions?: string;
  alert?: {
    isTriggered: boolean;
    message: string | null;
  };
}

export interface SavingsTransaction {
  id: number;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: string;
  notes?: string | null;
  created_at?: string;
}

export interface ClientIncome {
  id: number;
  client_name: string;
  project_name: string;
  amount: number;
  date: string;
  status: 'received' | 'pending';
  invoice_number?: string | null;
  notes?: string | null;
  created_at?: string;
}

export interface Expense {
  id: number;
  title: string;
  category: 'business' | 'personal';
  amount: number;
  date: string;
  notes?: string | null;
  created_at?: string;
}

export interface FinancialOverview {
  totalFreelanceReceived: number;
  pendingClientPayments: number;
  businessExpenses: number;
  personalExpenses: number;
  netBusinessProfit: number;
  actualSavingsBalance: number;
  targetRemaining: number;
  completionPercentage: number;
  hasReceivedIncomeData: boolean;
  hasPendingIncomeData: boolean;
  hasBusinessExpenseData: boolean;
  hasPersonalExpenseData: boolean;
}

export interface CashFlowSummary {
  businessIncomeReceived: number;
  businessExpenses: number;
  netBusinessProfit: number;
  personalExpenses: number;
  savingsTransfersIn: number;
  savingsWithdrawals: number;
  netSavingsAddition: number;
}

export interface FinancialSummaryData {
  overview: FinancialOverview;
  goal: SavingsGoal;
  cashFlow: CashFlowSummary;
}

// ---------------------------------------------------------------------------
// Client Rating & Feedback System Types
// ---------------------------------------------------------------------------

export interface FeedbackRequest {
  id: number;
  token: string;
  client_name: string;
  client_contact?: string | null;
  project_title: string;
  deliverable_type?: string | null;
  status: 'pending' | 'submitted' | 'expired';
  created_at: string;
  expires_at: string;
  submitted_at?: string | null;
}

export interface ClientReview {
  review_id: number;
  request_id: number;
  client_name: string;
  project_title: string;
  overall_rating: number;
  quality_rating: number;
  communication_rating: number;
  delivery_rating: number;
  written_review?: string | null;
  allow_public_display: number; // 0 or 1
  moderation_status: 'pending_review' | 'approved' | 'rejected' | 'archived';
  admin_notes?: string | null;
  private_response?: string | null;
  review_date: string;
  moderated_at?: string | null;
  token?: string;
  client_contact?: string | null;
  deliverable_type?: string | null;
}

export interface ImprovementArea {
  area: string;
  score: number;
  severity: 'high' | 'medium';
  suggestion: string;
}

export interface FeedbackStats {
  totalReviews: number;
  avgOverall: number;
  avgQuality: number;
  avgCommunication: number;
  avgDelivery: number;
  distribution: Record<number, number>;
  improvementAreas: ImprovementArea[];
  approvedCount: number;
  pendingModerationCount: number;
}

export interface PublicTestimonialItem {
  id: string;
  name: string;
  projectTitle: string;
  rating: number;
  qualityRating?: number;
  communicationRating?: number;
  deliveryRating?: number;
  quote: string;
  date: string;
  verified: boolean;
}

export interface FeedbackValidationResult {
  valid: boolean;
  alreadySubmitted?: boolean;
  expired?: boolean;
  error?: string;
  clientName?: string;
  projectTitle?: string;
  request?: {
    token: string;
    clientName: string;
    projectTitle: string;
    deliverableType: string;
    expiresAt: string;
  };
}


