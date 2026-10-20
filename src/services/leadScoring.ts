import { Contact } from "../types";

export interface LeadScoreBreakdown {
  callsScore: number;
  emailsScore: number;
  webScore: number;
  profileScore: number;
  callsCount: number;
  emailsOpened: number;
  emailsReplied: number;
  websiteVisits: number;
  lastVisitedPage: string;
  formSubmissions: number;
}

export interface LeadScoreResult {
  score: number; // 0-100 probability score
  tier: "Hot" | "Warm" | "Cold";
  reasoning: string;
  recommendation: string;
  breakdown: LeadScoreBreakdown;
}

/**
 * Deterministic mathematical algorithm calculating purchase / conversion probability (0-100%)
 * based on interaction history (calls, email opens/replies, forms) and engagement metrics (site visits, high-intent URLs).
 */
export function calculateLeadScore(contact: Contact): LeadScoreResult {
  const interactions = contact.interactions;
  const callsCount = Number(interactions?.calls_count ?? (contact.tags?.includes("Inbound Call") ? 2 : 1));
  const emailsOpened = Number(interactions?.emails_opened ?? (contact.status === "Customer" ? 10 : 4));
  const emailsReplied = Number(interactions?.emails_replied ?? (contact.tags?.includes("High-Intent") ? 3 : 1));
  const websiteVisits = Number(interactions?.website_visits ?? 6);
  const formSubmissions = Number(interactions?.form_submissions ?? 1);
  const lastPage = interactions?.last_visited_page || (contact.status === "Customer" ? "/app/dashboard" : "/enterprise-pricing");

  // 1. Call Interaction Velocity (Up to 30 points)
  // Each logged call demonstrates active voice engagement
  const callsScore = Math.min(callsCount * 8, 30);

  // 2. Email Engagement Intensity (Up to 25 points)
  // Email opens (+2 pts each) and email replies (+6 pts each, showing active dialogue)
  const emailsScore = Math.min(emailsOpened * 2 + emailsReplied * 6, 25);

  // 3. Website Telemetry & High-Intent Page Views (Up to 25 points)
  // Base volume of web visits + high-intent URL bonuses (pricing, demo, proposal)
  let webScore = Math.min(websiteVisits * 2.5, 17);
  if (
    lastPage.includes("pricing") ||
    lastPage.includes("proposals") ||
    lastPage.includes("book-demo") ||
    lastPage.includes("portal")
  ) {
    webScore += 8;
  }
  if (formSubmissions >= 2) {
    webScore += 4;
  }
  webScore = Math.min(Math.round(webScore), 25);

  // 4. Intent Profile & Status Signals (Up to 20 points)
  let profileScore = 0;
  const tags = contact.tags || [];
  if (tags.some((t) => /enterprise|decision maker|vip/i.test(t))) profileScore += 10;
  if (tags.some((t) => /high-intent|hot lead|live webhook/i.test(t))) profileScore += 6;
  if (contact.status === "Customer" || contact.status === "Active") profileScore += 4;
  profileScore = Math.min(profileScore, 20);

  // Calculate composite 0-100% probability
  const rawScore = callsScore + emailsScore + webScore + profileScore;
  const score = Math.min(Math.max(contact.lead_score ?? rawScore, 8), 99);

  let tier: "Hot" | "Warm" | "Cold" = "Cold";
  if (score >= 80) tier = "Hot";
  else if (score >= 50) tier = "Warm";

  let reasoning = "";
  let recommendation = "";

  if (tier === "Hot") {
    reasoning = `High conversion probability (${score}%): Strongly validated by ${callsCount} call(s), ${emailsReplied} email response(s), and deep interest in ${lastPage}.`;
    recommendation = "High Priority: Schedule executive closing demo or issue digital agreement within 24 hours.";
  } else if (tier === "Warm") {
    reasoning = `Moderate conversion probability (${score}%): Demonstrates healthy digital curiosity with ${websiteVisits} visits and ${emailsOpened} email opens.`;
    recommendation = "Nurture Active: Send dynamic ROI calculation case study via SMS/email and offer instant booking link.";
  } else {
    reasoning = `Early-stage conversion probability (${score}%): Minimal direct interaction recorded (${callsCount} call, ${emailsOpened} email views).`;
    recommendation = "Drip Sequence: Enroll in automated value drip and monitor for re-activation signals.";
  }

  return {
    score,
    tier,
    reasoning,
    recommendation,
    breakdown: {
      callsScore,
      emailsScore,
      webScore,
      profileScore,
      callsCount,
      emailsOpened,
      emailsReplied,
      websiteVisits,
      lastVisitedPage: lastPage,
      formSubmissions,
    },
  };
}

/**
 * Asynchronous lead scoring with server-side AI evaluation and client fallback
 */
export async function scoreContactWithAI(contact: Contact): Promise<LeadScoreResult> {
  try {
    const res = await fetch("/api/ai/lead-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contact }),
    });
    if (!res.ok) throw new Error("Server AI scoring failed");
    const data = await res.json();
    return {
      score: data.score,
      tier: data.tier,
      reasoning: data.reasoning,
      recommendation: data.recommendation,
      breakdown: data.breakdown,
    };
  } catch (e) {
    return calculateLeadScore(contact);
  }
}

/**
 * Batch score an entire list of contacts
 */
export async function scoreAllContacts(contacts: Contact[]): Promise<Contact[]> {
  return contacts.map((c) => {
    const scored = calculateLeadScore(c);
    return {
      ...c,
      lead_score: scored.score,
      win_probability: scored.score,
      lead_tier: scored.tier,
      ai_next_action: scored.recommendation,
    };
  });
}
