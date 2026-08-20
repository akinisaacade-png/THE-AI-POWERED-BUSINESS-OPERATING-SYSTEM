export type PipelineStage = 
  | "new_lead" 
  | "qualified" 
  | "proposal" 
  | "negotiation" 
  | "won" 
  | "lost";

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  tags: string[];
  source: string;
  owner_id: string;
  owner_name?: string;
  company_name?: string;
  company_id?: string;
  status: "Active" | "Lead" | "Customer" | "Churned" | "Opted-out";
  notes?: string;
  created_at: string;
  win_probability?: number;
  churn_risk?: "Low" | "Medium" | "High";
  ai_next_action?: string;
  lead_score?: number;
  lead_tier?: "Hot" | "Warm" | "Cold";
  interactions?: {
    calls_count: number;
    emails_opened: number;
    emails_replied: number;
    website_visits: number;
    last_visited_page?: string;
    form_submissions?: number;
  };
}

export interface CRMTask {
  id: string;
  title: string;
  contact_name?: string;
  due_date: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  source?: string;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  contacts_count: number;
  revenue?: string;
  website?: string;
}

export interface Deal {
  id: string;
  contact_id: string;
  contact_name: string;
  company_name?: string;
  title: string;
  value: number;
  stage: PipelineStage;
  close_date: string;
  probability: number;
  owner_name: string;
  ai_insights?: {
    next_best_action: string;
    churn_risk: "Low" | "Medium" | "High";
    win_probability: number;
    reasoning: string;
  };
}

export interface Activity {
  id: string;
  type: "call" | "sms" | "email" | "task" | "automation";
  contact_id?: string;
  contact_name?: string;
  deal_id?: string;
  timestamp: string;
  notes: string;
  status: "completed" | "pending" | "failed";
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
  ctr: number;
  cpa: number;
}

export interface Campaign {
  id: string;
  name: string;
  type: "ad" | "sms" | "email";
  channel: string;
  budget: number;
  spent: number;
  status: "active" | "paused" | "completed";
  created_at: string;
  metrics: CampaignMetrics;
}

export interface WorkflowStep {
  id: string;
  title: string;
  type: "trigger" | "condition" | "action" | "delay";
  description: string;
  configured: boolean;
}

export interface AutomationWorkflow {
  id: string;
  name: string;
  trigger_event: string;
  trigger_condition: string;
  steps: WorkflowStep[];
  status: "running" | "paused" | "error";
  last_run: string;
  success_rate: number;
  judge_verdict: "APPROVED" | "REVISE" | "PENDING";
  judge_notes?: string;
}

export interface Booking {
  id: string;
  contact_id: string;
  contact_name: string;
  contact_email: string;
  service_id: string;
  service_name: string;
  datetime: string;
  duration_minutes: number;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  team_member: string;
  meeting_link?: string;
}

export interface Review {
  id: string;
  source: "Google" | "Facebook" | "Trustpilot" | "G2";
  rating: number;
  text: string;
  contact_id?: string;
  author_name: string;
  date: string;
  responded: boolean;
  ai_response?: string;
}

export interface Payment {
  id: string;
  contact_id: string;
  contact_name: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed" | "refunded";
  method: "Stripe" | "Credit Card" | "Bank Transfer" | "PayPal";
  invoice_number: string;
  date: string;
  plan?: string;
}

export interface CommunityMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Moderator" | "VIP Member" | "Member";
  groups: string[];
  engagement_score: number;
  joined_date: string;
  posts_count: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: "proposal" | "contract" | "nda" | "invoice" | "agreement";
  status: "draft" | "sent" | "signed" | "expired";
  link: string;
  contact_id: string;
  contact_name: string;
  deal_id?: string;
  created_at: string;
  signed_at?: string;
  value?: number;
}

export interface DocumentSigning {
  id: string;
  title: string;
  contact_name: string;
  status: "sent" | "signed" | "completed" | "expired";
  created_at: string;
  value?: number;
  link?: string;
}

export interface CallLog {
  id: string;
  contact_name: string;
  phone: string;
  type: "inbound" | "outbound" | "missed";
  duration: string;
  outcome: "Answered" | "Voicemail" | "Missed - Text Sent" | "Booked Demo" | "Callback Scheduled" | "Recovered via SMS (8s)" | string;
  timestamp: string;
  ai_summary?: string;
  sentiment?: "Positive" | "Neutral" | "Negative";
  follow_up_task?: string;
  key_questions?: string[];
}

export interface MessageItem {
  id: string;
  sender: "user" | "contact" | "system" | "ai";
  text: string;
  timestamp: string;
  ai_suggested?: boolean;
}

export interface ConversationThread {
  id: string;
  contact_name: string;
  contact_phone?: string;
  channel: "SMS" | "WhatsApp" | "Instagram" | "Facebook" | "X";
  unread: boolean;
  last_message: string;
  timestamp: string;
  messages: MessageItem[];
}

export interface FunnelStep {
  id: string;
  name: string;
  url: string;
  conversion_rate: number;
  visitors: number;
  conversions: number;
}

export interface Funnel {
  id: string;
  name: string;
  conversion_rate: number;
  revenue: number;
  steps: FunnelStep[];
}

export interface WebsiteFunnel {
  id: string;
  name: string;
  type: "lead_gen" | "webinar" | "product" | "booking";
  url: string;
  visits: number;
  conversions: number;
  conversion_rate: number;
  ab_test_status: "Active (A/B: 50/50)" | "Winner Declared: Variant B (+28%)" | "Off";
  steps: string[];
}

export interface WebinarFunnel {
  id: string;
  title: string;
  date: string;
  time: string;
  registered_count: number;
  attended_count: number;
  conversion_rate: number;
  replay_views: number;
  status: "upcoming" | "live" | "completed";
}

export interface FormSurveyField {
  label: string;
  type: string;
}

export interface FormSurvey {
  id: string;
  name?: string;
  title?: string;
  type: string;
  conversion_rate?: number;
  submissions?: number;
  responses_count?: number;
  completion_rate?: number;
  embed_url?: string;
  created_at?: string;
  fields?: FormSurveyField[];
}

export interface ProspectLead {
  id: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  enriched_score: number;
  source: "AI Biz Card OCR" | "QR Code Scan" | "LinkedIn Enrich" | "Inbound Funnel";
  pipeline_stage: PipelineStage;
}

export interface AdCampaign {
  id: string;
  platform: "Google" | "Facebook" | "Instagram" | "X";
  campaign_name: string;
  spend: number;
  budget: number;
  impressions: number;
  clicks: number;
  conversions: number;
  roas: number;
  cpa: number;
  status: "Active" | "Paused" | "Learning";
  ai_creative_tip?: string;
}

export interface SocialPost {
  id: string;
  platforms: ("X" | "LinkedIn" | "Facebook" | "Instagram")[];
  content: string;
  scheduled_for: string;
  status: "scheduled" | "published" | "draft";
  image_url?: string;
  engagement?: { likes: number; shares: number; comments: number };
}

export interface MultiAgentDecision {
  id: string;
  timestamp: string;
  task: string;
  builder_output: string;
  business_ops_output: string;
  judge_verdict: "APPROVED" | "REVISE";
  judge_feedback: string;
  maintenance_schedule: {
    weekly: string;
    monthly: string;
    quarterly: string;
  };
}

export interface UserSubscription {
  status: "trial_active" | "trial_expired" | "subscription_active" | "subscription_cancelled" | "subscription_suspended";
  plan: "monthly" | "yearly" | null;
  planId: string | null;
  amount: number | null;
  paypalSubscriptionId?: string;
  paypalPayerId?: string;
  lastPaymentDate?: string;
  nextBillingDate?: string;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  trialStartDate: string;
  trialExpiresDate: string;
  subscription: UserSubscription;
  isSubscribed?: boolean;
}
