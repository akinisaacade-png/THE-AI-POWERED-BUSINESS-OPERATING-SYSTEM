import { 
  Contact, 
  Deal, 
  Activity, 
  Campaign, 
  AutomationWorkflow, 
  Booking, 
  Review, 
  Payment, 
  CommunityMember, 
  DocumentItem, 
  CallLog, 
  ConversationThread, 
  WebsiteFunnel, 
  WebinarFunnel, 
  FormSurvey, 
  ProspectLead, 
  AdCampaign, 
  SocialPost,
  MultiAgentDecision
} from "./types";

export const initialContacts: Contact[] = [
  {
    id: "cnt-101",
    name: "Eleanor Vance",
    email: "eleanor.vance@apexgroup.io",
    phone: "+1 (555) 234-5678",
    tags: ["Enterprise", "High-Intent", "Decision Maker"],
    source: "Webinar Funnel",
    owner_id: "usr-1",
    owner_name: "Alex Mercer",
    company_name: "Apex Group Holdings",
    status: "Lead",
    notes: "Attended Q3 Revenue Acceleration masterclass. Interested in multi-agent workflow automations.",
    created_at: "2026-08-18 14:20",
    win_probability: 88,
    churn_risk: "Low",
    ai_next_action: "Trigger custom pricing proposal and schedule onboarding workshop.",
    lead_score: 94,
    lead_tier: "Hot",
    interactions: {
      calls_count: 3,
      emails_opened: 8,
      emails_replied: 4,
      website_visits: 12,
      last_visited_page: "/enterprise-pricing",
      form_submissions: 2,
    },
  },
  {
    id: "cnt-102",
    name: "Marcus Thorne",
    email: "m.thorne@vanguardtech.co",
    phone: "+1 (555) 876-5432",
    tags: ["Inbound Call", "Hot Lead"],
    source: "Missed Call Text-Back",
    owner_id: "usr-2",
    owner_name: "Elena Rostova",
    company_name: "Vanguard Tech Labs",
    status: "Lead",
    notes: "Missed inbound call converted automatically via SMS booking link within 2 minutes.",
    created_at: "2026-08-19 09:12",
    win_probability: 75,
    churn_risk: "Low",
    ai_next_action: "Send calendar confirmation and pre-call AI discovery questionnaire.",
    lead_score: 82,
    lead_tier: "Hot",
    interactions: {
      calls_count: 2,
      emails_opened: 4,
      emails_replied: 2,
      website_visits: 7,
      last_visited_page: "/book-demo",
      form_submissions: 1,
    },
  },
  {
    id: "cnt-103",
    name: "Sophia Chen",
    email: "sophia@luminahealth.com",
    phone: "+1 (555) 345-6789",
    tags: ["SaaS Customer", "Annual Plan"],
    source: "Google Ad Campaign",
    owner_id: "usr-1",
    owner_name: "Alex Mercer",
    company_name: "Lumina Health Systems",
    status: "Customer",
    notes: "Subscribed to Growth Tier. Automated review request delivered after 7-day milestone.",
    created_at: "2026-08-10 11:00",
    win_probability: 95,
    churn_risk: "Low",
    ai_next_action: "Offer VIP Community invite and request Trustpilot review.",
    lead_score: 96,
    lead_tier: "Hot",
    interactions: {
      calls_count: 4,
      emails_opened: 14,
      emails_replied: 6,
      website_visits: 19,
      last_visited_page: "/app/dashboard",
      form_submissions: 3,
    },
  },
  {
    id: "cnt-104",
    name: "David Kim",
    email: "david.kim@nexusbrands.org",
    phone: "+1 (555) 987-6543",
    tags: ["E-commerce", "Stalled Deal"],
    source: "QR Biz Card Scan",
    owner_id: "usr-3",
    owner_name: "Sarah Jenkins",
    company_name: "Nexus Global Brands",
    status: "Lead",
    notes: "Scanned at AI World Expo. Proposal sent 4 days ago, awaiting CFO signature.",
    created_at: "2026-08-12 16:45",
    win_probability: 54,
    churn_risk: "Medium",
    ai_next_action: "Send dynamic ROI calculator link via SMS to address budget hesitations.",
    lead_score: 58,
    lead_tier: "Warm",
    interactions: {
      calls_count: 1,
      emails_opened: 3,
      emails_replied: 1,
      website_visits: 4,
      last_visited_page: "/proposals/rev-881",
      form_submissions: 1,
    },
  },
  {
    id: "cnt-105",
    name: "Amira Patel",
    email: "amira@crestwoodlogistics.com",
    phone: "+1 (555) 432-1098",
    tags: ["VIP", "Enterprise"],
    source: "Referral",
    owner_id: "usr-2",
    owner_name: "Elena Rostova",
    company_name: "Crestwood Logistics",
    status: "Customer",
    notes: "Signed 2-year enterprise agreement with 50 seats.",
    created_at: "2026-07-29 10:30",
    win_probability: 99,
    churn_risk: "Low",
    ai_next_action: "Schedule quarterly business review and quarterly AI audit.",
    lead_score: 98,
    lead_tier: "Hot",
    interactions: {
      calls_count: 5,
      emails_opened: 22,
      emails_replied: 11,
      website_visits: 28,
      last_visited_page: "/executive-portal",
      form_submissions: 4,
    },
  }
];

export const initialDeals: Deal[] = [
  {
    id: "deal-201",
    contact_id: "cnt-101",
    contact_name: "Eleanor Vance",
    company_name: "Apex Group Holdings",
    title: "Enterprise Revenue OS - 40 Seats",
    value: 28400,
    stage: "proposal",
    close_date: "2026-08-28",
    probability: 85,
    owner_name: "Alex Mercer",
    ai_insights: {
      next_best_action: "Automated SMS follow-up scheduled in 18 hrs with custom security whitepaper.",
      churn_risk: "Low",
      win_probability: 88,
      reasoning: "High webinar engagement + multiple stakeholders opened the quote document."
    }
  },
  {
    id: "deal-202",
    contact_id: "cnt-102",
    contact_name: "Marcus Thorne",
    company_name: "Vanguard Tech Labs",
    title: "AI Voice & Text-Back Infrastructure",
    value: 14500,
    stage: "qualified",
    close_date: "2026-09-02",
    probability: 70,
    owner_name: "Elena Rostova",
    ai_insights: {
      next_best_action: "Conduct live demo of missed-call text back and call recording transcription.",
      churn_risk: "Low",
      win_probability: 74,
      reasoning: "Rapid response to missed-call text back indicates urgent operational pain point."
    }
  },
  {
    id: "deal-203",
    contact_id: "cnt-104",
    contact_name: "David Kim",
    company_name: "Nexus Global Brands",
    title: "Omnichannel Ad & Funnel Suite",
    value: 19800,
    stage: "negotiation",
    close_date: "2026-08-25",
    probability: 60,
    owner_name: "Sarah Jenkins",
    ai_insights: {
      next_best_action: "Send adjusted payment term (quarterly billing vs upfront annual) to close this week.",
      churn_risk: "Medium",
      win_probability: 62,
      reasoning: "Client requested clarification on Stripe payment gateway processing fees."
    }
  },
  {
    id: "deal-204",
    contact_id: "cnt-105",
    contact_name: "Amira Patel",
    company_name: "Crestwood Logistics",
    title: "Fleet Operations AI Automation",
    value: 48000,
    stage: "won",
    close_date: "2026-08-15",
    probability: 100,
    owner_name: "Elena Rostova",
    ai_insights: {
      next_best_action: "Trigger post-sale onboarding drip sequence and schedule VIP kickoff call.",
      churn_risk: "Low",
      win_probability: 100,
      reasoning: "Fully executed agreement and first invoice paid via Stripe."
    }
  },
  {
    id: "deal-205",
    contact_id: "cnt-106",
    contact_name: "Julian Rivera",
    company_name: "Solaris Media",
    title: "Conversation AI Chat Widget Pro",
    value: 8200,
    stage: "new_lead",
    close_date: "2026-09-10",
    probability: 35,
    owner_name: "Alex Mercer",
    ai_insights: {
      next_best_action: "Send automated 3-day value sequence highlighting 3x lead capture rate.",
      churn_risk: "Low",
      win_probability: 45,
      reasoning: "Downloaded the AI Funnel Playbook from website landing page."
    }
  },
  {
    id: "deal-206",
    contact_id: "cnt-107",
    contact_name: "Karen Bradshaw",
    company_name: "Bradshaw Law",
    title: "Legal Practice Appointment Funnel",
    value: 6500,
    stage: "lost",
    close_date: "2026-08-05",
    probability: 0,
    owner_name: "Sarah Jenkins",
    ai_insights: {
      next_best_action: "Re-engage in 90 days with updated HIPAA compliance and document signing features.",
      churn_risk: "High",
      win_probability: 0,
      reasoning: "Chose legacy system due to strict internal compliance timeline constraints."
    }
  }
];

export const initialCalls: CallLog[] = [
  {
    id: "call-301",
    contact_name: "Marcus Thorne",
    phone: "+1 (555) 876-5432",
    type: "missed",
    duration: "00:00",
    outcome: "Missed - Text Sent",
    timestamp: "2026-08-19 09:10",
    ai_summary: "Inbound call missed during executive meeting. Automated missed-call text-back triggered in 8 seconds.",
    sentiment: "Neutral",
    follow_up_task: "Auto-booked discovery meeting for Aug 20, 2:00 PM.",
    key_questions: ["Requested booking link", "Inquired about Voice AI setup time"]
  },
  {
    id: "call-302",
    contact_name: "Eleanor Vance",
    phone: "+1 (555) 234-5678",
    type: "inbound",
    duration: "14:22",
    outcome: "Booked Demo",
    timestamp: "2026-08-18 16:30",
    ai_summary: "Customer evaluated revenue automation workflows, custom domain branding, and document e-signatures.",
    sentiment: "Positive",
    follow_up_task: "Send enterprise proposal document before 5:00 PM tomorrow.",
    key_questions: ["How does Judge Agent ensure workflow reliability?", "Can we gray-label the mobile client?"]
  },
  {
    id: "call-303",
    contact_name: "Amira Patel",
    phone: "+1 (555) 432-1098",
    type: "outbound",
    duration: "08:45",
    outcome: "Answered",
    timestamp: "2026-08-17 11:15",
    ai_summary: "Quarterly review follow-up. Client expressed 100% satisfaction with Stripe payment integration.",
    sentiment: "Positive",
    follow_up_task: "Enroll executive team into the VIP community leadership mastermind."
  }
];

export const initialConversations: ConversationThread[] = [
  {
    id: "conv-401",
    contact_name: "Marcus Thorne",
    contact_phone: "+1 (555) 876-5432",
    channel: "SMS",
    unread: true,
    last_message: "Thanks for the quick text-back! Just booked 2:00 PM tomorrow.",
    timestamp: "09:14 AM",
    messages: [
      {
        id: "m1",
        sender: "system",
        text: "⚡ Automated Trigger: Inbound Call Missed from +1 (555) 876-5432",
        timestamp: "09:10 AM"
      },
      {
        id: "m2",
        sender: "ai",
        text: "Hey Marcus, we saw we just missed your call! You can lock in a time that works best for you directly on our calendar here: https://rev-os.io/b/alex",
        timestamp: "09:10 AM"
      },
      {
        id: "m3",
        sender: "contact",
        text: "Thanks for the quick text-back! Just booked 2:00 PM tomorrow.",
        timestamp: "09:14 AM"
      }
    ]
  },
  {
    id: "conv-402",
    contact_name: "Jessica Taylor",
    channel: "WhatsApp",
    unread: false,
    last_message: "Can you send the brochure for the Webinar Funnel builder?",
    timestamp: "Yesterday",
    messages: [
      {
        id: "m4",
        sender: "contact",
        text: "Hi! We're planning our next product launch. Can you send the brochure for the Webinar Funnel builder?",
        timestamp: "Yesterday 15:30"
      },
      {
        id: "m5",
        sender: "ai",
        text: "Absolutely Jessica! Here is our complete Webinar Funnels & Automated Replay Architecture Guide: https://rev-os.io/docs/webinar-funnels",
        timestamp: "Yesterday 15:31",
        ai_suggested: true
      }
    ]
  },
  {
    id: "conv-403",
    contact_name: "TechTrends Daily",
    channel: "Instagram",
    unread: false,
    last_message: "Loved your recent post on AI Revenue Operating Systems!",
    timestamp: "2 days ago",
    messages: [
      {
        id: "m6",
        sender: "contact",
        text: "Loved your recent post on AI Revenue Operating Systems! Would love to feature your founder on our podcast.",
        timestamp: "2 days ago"
      }
    ]
  },
  {
    id: "conv-404",
    contact_name: "Robert Hughes",
    channel: "X",
    unread: false,
    last_message: "Is there a webhook for Stripe custom subscriptions?",
    timestamp: "3 days ago",
    messages: [
      {
        id: "m7",
        sender: "contact",
        text: "Is there a webhook for Stripe custom subscriptions?",
        timestamp: "3 days ago"
      },
      {
        id: "m8",
        sender: "user",
        text: "Yes! You can configure webhooks in Settings & Gray-Labelled Mobile App > Integrations > Payments.",
        timestamp: "3 days ago"
      }
    ]
  }
];

export const initialWorkflows: AutomationWorkflow[] = [
  {
    id: "wf-501",
    name: "Missed Call to Booking",
    trigger_event: "inbound_call",
    trigger_condition: "call_status == 'missed'",
    status: "running",
    last_run: "2026-08-19 09:10 (Just now)",
    success_rate: 98.4,
    judge_verdict: "APPROVED",
    judge_notes: "Compliance checked: Opt-out tag present, booking URL dynamically resolved, task owner assigned.",
    steps: [
      {
        id: "s1",
        title: "Inbound Call Missed",
        type: "trigger",
        description: "Detects missed inbound phone call across all virtual numbers",
        configured: true
      },
      {
        id: "s2",
        title: "Send Instant SMS Text-Back",
        type: "action",
        description: "Sends personalized SMS: 'Hey {{contact.first_name}}, we saw we missed your call. Book here: {{booking_link}}'",
        configured: true
      },
      {
        id: "s3",
        title: "Create CRM Task",
        type: "action",
        description: "Assigns high-priority follow-up task to account executive with 24h SLA",
        configured: true
      },
      {
        id: "s4",
        title: "Log Activity in CRM",
        type: "action",
        description: "Records missed call timestamp and text-back delivery status",
        configured: true
      }
    ]
  },
  {
    id: "wf-502",
    name: "Lead to Review Nurture",
    trigger_event: "new_contact_created",
    trigger_condition: "source in ['website_funnel', 'webinar_funnel']",
    status: "running",
    last_run: "2026-08-19 08:30",
    success_rate: 96.8,
    judge_verdict: "APPROVED",
    judge_notes: "Delay intervals (3 days post-payment) calibrated to prevent review solicitation spam.",
    steps: [
      {
        id: "s5",
        title: "New Funnel Lead Registered",
        type: "trigger",
        description: "Captures lead details from website or webinar funnels",
        configured: true
      },
      {
        id: "s6",
        title: "Send Welcome SMS & Email",
        type: "action",
        description: "Delivers welcome onboarding pack and calendar link",
        configured: true
      },
      {
        id: "s7",
        title: "3-Step Email Nurture Drip",
        type: "delay",
        description: "Delivers educational case studies on day 1, 3, and 5",
        configured: true
      },
      {
        id: "s8",
        title: "Post-Sale Review Request",
        type: "action",
        description: "When deal = Won & payment = Paid, wait 3 days then send Google/Trustpilot review request",
        configured: true
      }
    ]
  },
  {
    id: "wf-503",
    name: "Stalled Deal Re-Engagement",
    trigger_event: "deal_stage_idle",
    trigger_condition: "stage == 'proposal' && idle_days > 4",
    status: "running",
    last_run: "2026-08-18 22:00",
    success_rate: 94.2,
    judge_verdict: "APPROVED",
    judge_notes: "Dynamic offer generation tested with Flash-Lite model.",
    steps: [
      {
        id: "s9",
        title: "Deal Idle > 4 Days in Proposal",
        type: "trigger",
        description: "Triggers when prospect has not signed or replied to quote in 96 hours",
        configured: true
      },
      {
        id: "s10",
        title: "AI Flash-Lite Generates Custom Offer",
        type: "action",
        description: "Produces personalized ROI summary addressing specific objections",
        configured: true
      },
      {
        id: "s11",
        title: "Send Multi-Channel Nudge (SMS + Email)",
        type: "action",
        description: "Sends conversational check-in from assigned deal owner",
        configured: true
      }
    ]
  }
];

export const initialCampaigns: Campaign[] = [
  {
    id: "cmp-601",
    name: "Q3 AI Revenue OS Masterclass",
    type: "ad",
    channel: "Google & Facebook Ads",
    budget: 4500,
    spent: 2840,
    status: "active",
    created_at: "2026-08-01",
    metrics: {
      impressions: 142800,
      clicks: 5620,
      conversions: 412,
      roas: 4.82,
      ctr: 3.93,
      cpa: 6.89
    }
  },
  {
    id: "cmp-602",
    name: "Missed-Call Recovery SMS Blast",
    type: "sms",
    channel: "Twilio Direct Carrier Route",
    budget: 600,
    spent: 410,
    status: "active",
    created_at: "2026-08-05",
    metrics: {
      impressions: 4800,
      clicks: 1940,
      conversions: 248,
      roas: 8.40,
      ctr: 40.4,
      cpa: 1.65
    }
  },
  {
    id: "cmp-603",
    name: "Enterprise Client Nurture Email Sequence",
    type: "email",
    channel: "Transactional SMTP",
    budget: 350,
    spent: 180,
    status: "active",
    created_at: "2026-08-10",
    metrics: {
      impressions: 12400,
      clicks: 3120,
      conversions: 184,
      roas: 11.2,
      ctr: 25.1,
      cpa: 0.98
    }
  }
];

export const initialBookings: Booking[] = [
  {
    id: "bk-701",
    contact_id: "cnt-102",
    contact_name: "Marcus Thorne",
    contact_email: "m.thorne@vanguardtech.co",
    service_id: "srv-demo",
    service_name: "AI Revenue OS Live Architecture Demo",
    datetime: "2026-08-20 14:00",
    duration_minutes: 45,
    status: "confirmed",
    team_member: "Alex Mercer",
    meeting_link: "https://meet.google.com/ais-rev-demo"
  },
  {
    id: "bk-702",
    contact_id: "cnt-101",
    contact_name: "Eleanor Vance",
    contact_email: "eleanor.vance@apexgroup.io",
    service_id: "srv-onboarding",
    service_name: "Enterprise Onboarding & Security Review",
    datetime: "2026-08-21 10:30",
    duration_minutes: 60,
    status: "confirmed",
    team_member: "Elena Rostova",
    meeting_link: "https://meet.google.com/ais-apex-review"
  },
  {
    id: "bk-703",
    contact_id: "cnt-104",
    contact_name: "David Kim",
    contact_email: "david.kim@nexusbrands.org",
    service_id: "srv-pricing",
    service_name: "Custom Integration & Pricing Strategy",
    datetime: "2026-08-22 15:00",
    duration_minutes: 30,
    status: "pending",
    team_member: "Sarah Jenkins",
    meeting_link: "https://meet.google.com/ais-nexus-call"
  }
];

export const initialReviews: Review[] = [
  {
    id: "rev-801",
    source: "Google",
    rating: 5,
    author_name: "Marcus Thorne, VP Tech",
    date: "2026-08-18",
    text: "The missed-call text-back feature alone captured 3 enterprise clients in our first 48 hours. Absolute game changer.",
    responded: true,
    ai_response: "Thank you so much Marcus! We are thrilled to see your team capturing every revenue opportunity seamlessly."
  },
  {
    id: "rev-802",
    source: "Trustpilot",
    rating: 5,
    author_name: "Sophia Chen, COO",
    date: "2026-08-15",
    text: "Unified inbox + multi-agent workflow verification makes managing 500+ monthly inbound leads completely effortless.",
    responded: true,
    ai_response: "We appreciate your partnership Sophia! The Judge Agent self-maintenance ensures your workflows run with 99.9% uptime."
  },
  {
    id: "rev-803",
    source: "G2",
    rating: 4.9,
    author_name: "Amira Patel, Enterprise Director",
    date: "2026-08-11",
    text: "The AI business card scanner converted an entire conference of leads into our pipeline in under 10 minutes.",
    responded: true,
    ai_response: "Thanks Amira! We continue to refine our OCR and pipeline enrichment speeds for high-volume trade shows."
  }
];

export const initialPayments: Payment[] = [
  {
    id: "pay-901",
    contact_id: "cnt-105",
    contact_name: "Amira Patel",
    amount: 48000,
    currency: "USD",
    status: "paid",
    method: "Stripe",
    invoice_number: "INV-2026-0089",
    date: "2026-08-15",
    plan: "Enterprise 50-Seat Annual"
  },
  {
    id: "pay-902",
    contact_id: "cnt-103",
    contact_name: "Sophia Chen",
    amount: 299.99,
    currency: "USD",
    status: "paid",
    method: "PayPal",
    invoice_number: "INV-PP-2026-0104",
    date: "2026-08-17",
    plan: "Yearly VIP Enterprise (P-57E70186GM393543WNKDHPOQ)"
  },
  {
    id: "pay-903",
    contact_id: "cnt-101",
    contact_name: "Eleanor Vance",
    amount: 29.99,
    currency: "USD",
    status: "paid",
    method: "PayPal",
    invoice_number: "INV-PP-2026-0105",
    date: "2026-08-19",
    plan: "Monthly Pro Subscription (P-1N2589523E589180VNKDHMWA)"
  },
  {
    id: "pay-904",
    contact_id: "cnt-102",
    contact_name: "Marcus Thorne",
    amount: 28400,
    currency: "USD",
    status: "pending",
    method: "Bank Transfer",
    invoice_number: "INV-2026-0091",
    date: "2026-08-18",
    plan: "Enterprise 40-Seat Annual"
  }
];

export const initialFunnels: WebsiteFunnel[] = [
  {
    id: "fn-1",
    name: "Enterprise Revenue Acceleration Funnel",
    type: "lead_gen",
    url: "https://rev-os.io/enterprise-demo",
    visits: 24500,
    conversions: 2180,
    conversion_rate: 8.9,
    ab_test_status: "Winner Declared: Variant B (+28%)",
    steps: ["Landing Page", "AI Capability Matrix", "Booking Calendar", "Instant Confirmation"]
  },
  {
    id: "fn-2",
    name: "High-Ticket Masterclass Webinar Funnel",
    type: "webinar",
    url: "https://rev-os.io/live-webinar",
    visits: 18200,
    conversions: 3240,
    conversion_rate: 17.8,
    ab_test_status: "Active (A/B: 50/50)",
    steps: ["Registration Hero", "Video Teaser", "Live Room", "Special Offer Replay"]
  },
  {
    id: "fn-3",
    name: "Voice AI & Missed Call Demo Booking",
    type: "booking",
    url: "https://rev-os.io/voice-ai-test",
    visits: 9400,
    conversions: 1850,
    conversion_rate: 19.68,
    ab_test_status: "Off",
    steps: ["Interactive Audio Tester", "Select Meeting Slot", "SMS Confirmation Sent"]
  }
];

export const initialWebinars: WebinarFunnel[] = [
  {
    id: "web-1",
    title: "Scaling to $10M ARR with Autonomous AI Revenue Agents",
    date: "2026-08-25",
    time: "2:00 PM EST",
    registered_count: 1420,
    attended_count: 890,
    conversion_rate: 22.4,
    replay_views: 3410,
    status: "upcoming"
  },
  {
    id: "web-2",
    title: "Missed-Call Text Back: The Zero-Friction Lead Capture Playbook",
    date: "2026-08-12",
    time: "1:00 PM EST",
    registered_count: 980,
    attended_count: 710,
    conversion_rate: 29.8,
    replay_views: 5120,
    status: "completed"
  }
];

export const initialForms: FormSurvey[] = [
  {
    id: "frm-1",
    title: "Enterprise Revenue Assessment & ROI Quiz",
    type: "quiz",
    responses_count: 840,
    completion_rate: 82.5,
    embed_url: "https://rev-os.io/forms/quiz-roi",
    created_at: "2026-08-01"
  },
  {
    id: "frm-2",
    title: "VIP Onboarding & CRM Migration Intake",
    type: "onboarding",
    responses_count: 215,
    completion_rate: 94.0,
    embed_url: "https://rev-os.io/forms/onboarding-intake",
    created_at: "2026-08-05"
  },
  {
    id: "frm-3",
    title: "Net Promoter Score (NPS) 30-Day Check",
    type: "nps",
    responses_count: 530,
    completion_rate: 88.2,
    embed_url: "https://rev-os.io/forms/nps-satisfaction",
    created_at: "2026-08-10"
  }
];

export const initialProspects: ProspectLead[] = [
  {
    id: "prsp-1",
    name: "Cassandra Sterling",
    company: "Sterling Ventures",
    title: "Managing Partner",
    email: "c.sterling@sterlingventures.vc",
    phone: "+1 (555) 777-8899",
    enriched_score: 96,
    source: "AI Biz Card OCR",
    pipeline_stage: "qualified"
  },
  {
    id: "prsp-2",
    name: "Brandon Cole",
    company: "Cole Logistics Group",
    title: "Chief Commercial Officer",
    email: "bcole@colelogistics.com",
    phone: "+1 (555) 333-2211",
    enriched_score: 91,
    source: "QR Code Scan",
    pipeline_stage: "new_lead"
  },
  {
    id: "prsp-3",
    name: "Tanya Rivera",
    company: "Rivera Digital Retail",
    title: "Head of Growth",
    email: "tanya@riveradigital.com",
    phone: "+1 (555) 666-4433",
    enriched_score: 84,
    source: "LinkedIn Enrich",
    pipeline_stage: "proposal"
  }
];

export const initialAds: AdCampaign[] = [
  {
    id: "ad-1",
    platform: "Google",
    campaign_name: "Search - High Intent Revenue OS Keywords",
    spend: 1840,
    budget: 3000,
    impressions: 48900,
    clicks: 2940,
    conversions: 182,
    roas: 5.4,
    cpa: 10.11,
    status: "Active",
    ai_creative_tip: "Add exact-match 'missed call text back software' for +18% higher CTR."
  },
  {
    id: "ad-2",
    platform: "Facebook",
    campaign_name: "Meta Video Ad - Live Missed Call Demo",
    spend: 1200,
    budget: 2000,
    impressions: 64200,
    clicks: 1890,
    conversions: 145,
    roas: 4.2,
    cpa: 8.28,
    status: "Active",
    ai_creative_tip: "Shorten hook to first 2.5 seconds showing real-time SMS arrival notification."
  },
  {
    id: "ad-3",
    platform: "Instagram",
    campaign_name: "Stories - Fast Booking Flow Demo",
    spend: 650,
    budget: 1000,
    impressions: 32000,
    clicks: 810,
    conversions: 62,
    roas: 3.8,
    cpa: 10.48,
    status: "Active",
    ai_creative_tip: "Feature dynamic orange CTA button with high-contrast text."
  },
  {
    id: "ad-4",
    platform: "X",
    campaign_name: "X Promoted Trend - #AIRevenueOS",
    spend: 420,
    budget: 800,
    impressions: 21000,
    clicks: 440,
    conversions: 28,
    roas: 3.1,
    cpa: 15.00,
    status: "Learning",
    ai_creative_tip: "Target SaaS founders and agency owners with customer retention metrics."
  }
];

export const initialDocuments: DocumentItem[] = [
  {
    id: "doc-1",
    title: "Apex Group Holdings - Enterprise Agreement 2026-2028",
    type: "contract",
    status: "sent",
    link: "https://rev-os.io/docs/sign/apex-2026",
    contact_id: "cnt-101",
    contact_name: "Eleanor Vance",
    created_at: "2026-08-18",
    value: 28400
  },
  {
    id: "doc-2",
    title: "Crestwood Logistics - Master Services & SLA Agreement",
    type: "contract",
    status: "signed",
    link: "https://rev-os.io/docs/sign/crestwood-signed",
    contact_id: "cnt-105",
    contact_name: "Amira Patel",
    created_at: "2026-08-14",
    signed_at: "2026-08-15 11:24",
    value: 48000
  },
  {
    id: "doc-3",
    title: "Vanguard Tech Labs - Voice AI Architecture Proposal",
    type: "proposal",
    status: "sent",
    link: "https://rev-os.io/docs/prop/vanguard-voice",
    contact_id: "cnt-102",
    contact_name: "Marcus Thorne",
    created_at: "2026-08-19",
    value: 14500
  }
];

export const initialCommunities: CommunityMember[] = [
  {
    id: "mem-1",
    name: "Dr. Aris Vance",
    email: "aris@apexgroup.io",
    role: "VIP Member",
    groups: ["Founders Circle", "Revenue Masterminds"],
    engagement_score: 98,
    joined_date: "2026-07-15",
    posts_count: 24
  },
  {
    id: "mem-2",
    name: "Elena Rostova",
    email: "elena@rev-os.internal",
    role: "Admin",
    groups: ["All Members", "Technical Council"],
    engagement_score: 100,
    joined_date: "2026-01-01",
    posts_count: 142
  },
  {
    id: "mem-3",
    name: "Marcus Thorne",
    email: "m.thorne@vanguardtech.co",
    role: "Member",
    groups: ["AI Voice Pioneers"],
    engagement_score: 82,
    joined_date: "2026-08-19",
    posts_count: 3
  }
];

export const initialSocialPosts: SocialPost[] = [
  {
    id: "post-1",
    platforms: ["LinkedIn", "X"],
    content: "Why 67% of inbound phone leads die in voicemail — and how autonomous missed-call text-back automations recover $45k+ in lost revenue monthly. 📈⚡ #AIRevenue #Automation",
    scheduled_for: "2026-08-20 09:00",
    status: "scheduled",
    engagement: { likes: 142, shares: 38, comments: 19 }
  },
  {
    id: "post-2",
    platforms: ["Instagram", "Facebook"],
    content: "Meet the 3-Agent Architecture behind THE AI-POWERED BUSINESS OPERATING SYSTEM: Builder Agent 🛠️, Business Ops Agent 📊, and the self-maintaining Judge Agent ⚖️.",
    scheduled_for: "2026-08-22 12:30",
    status: "scheduled",
    engagement: { likes: 310, shares: 84, comments: 42 }
  }
];

export const initialMultiAgentLog: MultiAgentDecision[] = [
  {
    id: "dec-1",
    timestamp: "2026-08-19 09:10",
    task: "Optimize Missed Call Text-Back to Booking Flow",
    builder_output: "Constructed trigger on `inbound_call.missed`. Formatted SMS template with opt-out clause and dynamic booking link {{booking_link}}. Assigned CRM task owner.",
    business_ops_output: "Projected +38% lead recapture. Set target text-back latency at <45s and booking conversion at 28%.",
    judge_verdict: "APPROVED",
    judge_feedback: "Schema consistent with Contact and Deal models. Opt-out safety rules compliant. No circular triggers detected.",
    maintenance_schedule: {
      weekly: "Scan telephony logs for SMS delivery failure codes (e.g. carrier filter).",
      monthly: "A/B test SMS text-back copy for higher booking CTR.",
      quarterly: "Audit calendar availability zones and team routing rules."
    }
  }
];
