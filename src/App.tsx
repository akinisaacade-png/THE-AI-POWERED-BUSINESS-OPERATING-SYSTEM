import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { GlobalSearchModal } from "./components/GlobalSearchModal";
import { MultiAgentA2AModal } from "./components/MultiAgentA2AModal";
import { AudioTranscriberModal } from "./components/AudioTranscriberModal";
import { ImageGenModal } from "./components/ImageGenModal";
import { DataManagementModal } from "./components/DataManagementModal";
import { GeminiChatbotWidget } from "./components/GeminiChatbotWidget";
import { KeyboardShortcutsModal } from "./components/KeyboardShortcutsModal";
import { SubscriptionBanner } from "./components/SubscriptionBanner";
import { SubscriptionGuard } from "./components/SubscriptionGuard";
import {
  saveDealToFirestore,
  deleteDealFromFirestore,
  saveWorkflowToFirestore,
  deleteWorkflowFromFirestore,
  saveBookingToFirestore,
  subscribeToDeals,
} from "./services/firebase";

// Pages
import { DashboardPage } from "./pages/DashboardPage";
import { CrmPipelinePage } from "./pages/CrmPipelinePage";
import { ContactsPage } from "./pages/ContactsPage";
import { CalendarsPage } from "./pages/CalendarsPage";
import { CallsVoicePage } from "./pages/CallsVoicePage";
import { SmsConversationsPage } from "./pages/SmsConversationsPage";
import { ReputationPage } from "./pages/ReputationPage";
import { FunnelsWebsitesPage } from "./pages/FunnelsWebsitesPage";
import { FormsSurveysPage } from "./pages/FormsSurveysPage";
import { EmailMarketingPage } from "./pages/EmailMarketingPage";
import { AiImageStudioPage } from "./pages/AiImageStudioPage";
import { UnifiedChatPage } from "./pages/UnifiedChatPage";
import { AdManagerPage } from "./pages/AdManagerPage";
import { PaymentsPage } from "./pages/PaymentsPage";
import { AutomationPage } from "./pages/AutomationPage";
import { MembershipPage } from "./pages/MembershipPage";
import { AffiliatePage } from "./pages/AffiliatePage";
import { DocumentSigningPage } from "./pages/DocumentSigningPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { GrayLabelAppPage } from "./pages/GrayLabelAppPage";
import { SocialPlannerPage } from "./pages/SocialPlannerPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SubscriptionBillingPage } from "./pages/SubscriptionBillingPage";

// Initial Mock Data
import {
  initialContacts,
  initialDeals,
  initialCalls,
  initialBookings,
  initialReviews,
  initialPayments,
  initialWorkflows,
  initialCampaigns,
  initialFunnels,
  initialForms,
  initialDocuments,
  initialSocialPosts,
} from "./mockData";
import {
  Contact,
  Deal,
  CallLog,
  Booking,
  Review,
  Payment,
  AutomationWorkflow,
  Campaign,
  Funnel,
  FormSurvey,
  DocumentSigning,
  SocialPost,
} from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [aiMode, setAiMode] = useState<"flash-lite" | "thinking" | "standard">("flash-lite");

  // Global State for all modules
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [calls, setCalls] = useState<CallLog[]>(initialCalls);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(initialWorkflows);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [funnels, setFunnels] = useState<Funnel[]>(initialFunnels);
  const [forms, setForms] = useState<FormSurvey[]>(initialForms);
  const [documents, setDocuments] = useState<DocumentSigning[]>(initialDocuments);
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>(initialSocialPosts);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMultiAgentOpen, setIsMultiAgentOpen] = useState(false);
  const [isTranscriberOpen, setIsTranscriberOpen] = useState(false);
  const [isImageGenOpen, setIsImageGenOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [activeDataSection, setActiveDataSection] = useState<string>("contacts");

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      // ⌘K / Ctrl+K for Global Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
        return;
      }

      // Ignore standard key bindings if user is typing in an input
      if (isInput) return;

      // '?' or 'Shift + /' for Shortcuts Modal
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // '/' to focus/open search
      if (e.key === "/") {
        e.preventDefault();
        setIsSearchOpen(true);
        return;
      }

      // 'v' to open Audio Transcriber Modal
      if (e.key === "v" || e.key === "V") {
        e.preventDefault();
        setIsTranscriberOpen(true);
        return;
      }

      // Escape to close active modal
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        setIsShortcutsOpen(false);
        setIsTranscriberOpen(false);
        setIsImageGenOpen(false);
        setIsDataModalOpen(false);
        setIsMultiAgentOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync dark class on document body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Subscribe to real-time Deals from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToDeals((remoteDeals) => {
      if (remoteDeals && remoteDeals.length > 0) {
        setDeals(remoteDeals);
      }
    });
    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  // Entity Handlers with Firestore Cloud Sync
  const handleAddContact = (newC: Contact) => setContacts((prev) => [newC, ...prev]);
  const handleDeleteContact = (id: string) => setContacts((prev) => prev.filter((c) => c.id !== id));

  const handleAddDeal = (newD: Deal) => {
    setDeals((prev) => [newD, ...prev]);
    saveDealToFirestore(newD);
  };
  const handleUpdateDeal = (dealId: string, updates: Partial<Deal>) => {
    setDeals((prev) => {
      const updatedList = prev.map((d) => (d.id === dealId ? { ...d, ...updates } : d));
      const target = updatedList.find((d) => d.id === dealId);
      if (target) saveDealToFirestore(target);
      return updatedList;
    });
  };
  const handleDeleteDeal = (id: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== id));
    deleteDealFromFirestore(id);
  };

  const handleAddCall = (newCall: CallLog) => setCalls((prev) => [newCall, ...prev]);
  const handleDeleteCall = (id: string) => setCalls((prev) => prev.filter((c) => c.id !== id));

  const handleAddBooking = (newBk: Booking) => {
    setBookings((prev) => [newBk, ...prev]);
    saveBookingToFirestore(newBk);
  };
  const handleDeleteBooking = (id: string) => setBookings((prev) => prev.filter((b) => b.id !== id));

  const handleAddReview = (newRev: Review) => setReviews((prev) => [newRev, ...prev]);
  const handleDeleteReview = (id: string) => setReviews((prev) => prev.filter((r) => r.id !== id));

  const handleAddPayment = (newPay: Payment) => setPayments((prev) => [newPay, ...prev]);
  const handleDeletePayment = (id: string) => setPayments((prev) => prev.filter((p) => p.id !== id));

  const handleAddWorkflow = (newWf: AutomationWorkflow) => {
    setWorkflows((prev) => [newWf, ...prev]);
    saveWorkflowToFirestore(newWf);
  };
  const handleDeleteWorkflow = (id: string) => {
    setWorkflows((prev) => prev.filter((w) => w.id !== id));
    deleteWorkflowFromFirestore(id);
  };

  const handleAddFunnel = (newF: Funnel) => setFunnels((prev) => [newF, ...prev]);
  const handleDeleteFunnel = (id: string) => setFunnels((prev) => prev.filter((f) => f.id !== id));

  const handleAddDocument = (newDoc: DocumentSigning) => setDocuments((prev) => [newDoc, ...prev]);
  const handleDeleteDocument = (id: string) => setDocuments((prev) => prev.filter((d) => d.id !== id));

  const handleAddSocialPost = (newPost: SocialPost) => setSocialPosts((prev) => [newPost, ...prev]);
  const handleDeleteSocialPost = (id: string) => setSocialPosts((prev) => prev.filter((p) => p.id !== id));

  const [tasks, setTasks] = useState<any[]>([]);
  const handleAddTask = (newTask: any) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleAddAd = (newAd: any) => {
    const normalized: Campaign = {
      id: newAd.id || `cmp-${Date.now()}`,
      name: newAd.name || newAd.campaign_name || "Ad Campaign",
      type: newAd.type || "ad",
      channel: newAd.channel || newAd.platform || "Meta & Google Ads",
      budget: Number(newAd.budget) || 1000,
      spent: Number(newAd.spent ?? newAd.spend ?? 0),
      status: newAd.status || "active",
      created_at: newAd.created_at || new Date().toISOString().slice(0, 10),
      metrics: newAd.metrics || {
        impressions: Number(newAd.impressions) || 15000,
        clicks: Number(newAd.clicks) || 640,
        conversions: Number(newAd.conversions ?? newAd.leads ?? 45),
        roas: Number(newAd.roas) || 4.5,
        ctr: Number(newAd.ctr) || 3.8,
        cpa: Number(newAd.cpa) || 12.0,
      },
    };
    setCampaigns((prev) => [normalized, ...prev]);
  };

  const openDataModalForSection = (section?: string) => {
    if (section) setActiveDataSection(section);
    setIsDataModalOpen(true);
  };

  // Export CSV Functionality
  const handleExportCsv = () => {
    const rows = [
      ["Type", "Name / Title", "Value / Spent", "Status / Outcome", "Date / Timestamp"],
      ...deals.map((d) => ["Deal", d.title, (d.value ?? 0).toString(), d.stage, d.close_date]),
      ...calls.map((c) => ["Call", c.contact_name, "0", c.outcome, c.timestamp]),
      ...campaigns.map((cmp) => ["Campaign", cmp.name, (cmp.spent ?? 0).toString(), cmp.status, "Active"]),
      ...payments.map((p) => ["Payment", p.contact_name, (p.amount ?? 0).toString(), p.status, p.date]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," + rows.map((e) => e.map((val) => `"${val}"`).join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ai_revenue_os_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Formatted PDF Report
  const handleDownloadPdf = () => {
    window.print();
  };

  return (
    <div
      className={`min-h-screen flex font-sans antialiased transition-colors duration-200 ${
        darkMode ? "bg-slate-950 text-slate-100" : "bg-[#F8FAFC] text-slate-900"
      }`}
    >
      {/* 1. Left Sidebar Navigation (280px, Indigo) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadMessagesCount={1}
        pendingReviewsCount={1}
        pendingDealsCount={deals.filter((d) => d.stage === "new_lead").length}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenMultiAgent={() => setIsMultiAgentOpen(true)}
          onOpenImageGen={() => setIsImageGenOpen(true)}
          onOpenTranscriber={() => setIsTranscriberOpen(true)}
          onOpenDataModal={() => openDataModalForSection(activeTab)}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          onNavigateToBilling={() => setActiveTab("subscription-billing")}
          onExportCsv={handleExportCsv}
          onDownloadPdf={handleDownloadPdf}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          aiMode={aiMode}
          setAiMode={setAiMode}
        />

        {/* Non-intrusive Subscription & Trial Expiration Alert Banner */}
        <SubscriptionBanner
          onNavigateToBilling={() => setActiveTab("subscription-billing")}
          darkMode={darkMode}
        />

        {/* Dynamic Page Router */}
        <main
          id="main-applet-content-workspace"
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar"
        >
          {activeTab === "dashboard" && (
            <DashboardPage
              deals={deals}
              calls={calls}
              reviews={reviews}
              campaigns={campaigns}
              workflows={workflows}
              bookings={bookings}
              onNavigate={(tabId) => setActiveTab(tabId)}
              onOpenDataModal={openDataModalForSection}
              onOpenMultiAgent={() => setIsMultiAgentOpen(true)}
              onDownloadPdf={handleDownloadPdf}
              onExportCsv={handleExportCsv}
              darkMode={darkMode}
            />
          )}

          {activeTab === "crm-pipeline" && (
            <CrmPipelinePage
              deals={deals}
              onAddDeal={handleAddDeal}
              onUpdateDeal={handleUpdateDeal}
              onDeleteDeal={handleDeleteDeal}
              onOpenDataModal={openDataModalForSection}
              darkMode={darkMode}
            />
          )}

          {activeTab === "contacts" && (
            <ContactsPage
              contacts={contacts}
              onAddContact={handleAddContact}
              onDeleteContact={handleDeleteContact}
              onOpenDataModal={openDataModalForSection}
              darkMode={darkMode}
            />
          )}

          {activeTab === "calendars-booking" && (
            <CalendarsPage
              bookings={bookings}
              onAddBooking={handleAddBooking}
              onDeleteBooking={handleDeleteBooking}
              onOpenDataModal={openDataModalForSection}
              darkMode={darkMode}
            />
          )}

          {activeTab === "calls-voice-ai" && (
            <CallsVoicePage
              calls={calls}
              onAddCall={handleAddCall}
              onDeleteCall={handleDeleteCall}
              onOpenDataModal={openDataModalForSection}
              onOpenTranscriber={() => setIsTranscriberOpen(true)}
              darkMode={darkMode}
            />
          )}

          {activeTab === "sms-conversations" && (
            <SmsConversationsPage darkMode={darkMode} />
          )}

          {activeTab === "reputation" && (
            <ReputationPage
              reviews={reviews}
              onAddReview={handleAddReview}
              onDeleteReview={handleDeleteReview}
              onOpenDataModal={openDataModalForSection}
              darkMode={darkMode}
            />
          )}

          {activeTab === "funnels-websites" && (
            <FunnelsWebsitesPage
              funnels={funnels}
              onAddFunnel={handleAddFunnel}
              onDeleteFunnel={handleDeleteFunnel}
              onOpenDataModal={openDataModalForSection}
              darkMode={darkMode}
            />
          )}

          {activeTab === "forms-surveys" && (
            <FormsSurveysPage
              forms={forms}
              onOpenDataModal={openDataModalForSection}
              darkMode={darkMode}
            />
          )}

          {activeTab === "email-marketing" && (
            <EmailMarketingPage
              onOpenDataModal={openDataModalForSection}
              darkMode={darkMode}
            />
          )}

          {activeTab === "ai-image-studio" && (
            <SubscriptionGuard
              moduleName="AI Image & Creative Studio"
              description="Generate custom AI ad creatives, logos, and viral promotional assets powered by Gemini Imagen."
              onNavigateToBilling={() => setActiveTab("subscription-billing")}
              darkMode={darkMode}
            >
              <AiImageStudioPage
                darkMode={darkMode}
                onNavigate={(tabId) => setActiveTab(tabId)}
                onSendToSocial={(url) => {
                  const newPost: SocialPost = {
                    id: `post-${Date.now()}`,
                    platforms: ["Instagram"],
                    content: "🚀 Scaled our revenue operations with autonomous AI workflows! Check out our latest strategy.",
                    image_url: url,
                    scheduled_for: new Date(Date.now() + 86400000).toISOString(),
                    status: "scheduled",
                  };
                  handleAddSocialPost(newPost);
                }}
                onSendToAdManager={(url) => {
                  const newAd = {
                    id: `ad-${Date.now()}`,
                    name: "AI Visual Asset Campaign",
                    platform: "facebook" as const,
                    budget: 500,
                    spent: 0,
                    leads: 0,
                    cpl: 0,
                    status: "active" as const,
                  };
                  handleAddAd(newAd);
                }}
              />
            </SubscriptionGuard>
          )}

          {activeTab === "unified-chat" && (
            <UnifiedChatPage darkMode={darkMode} />
          )}

          {activeTab === "ad-manager" && (
            <AdManagerPage
              campaigns={campaigns}
              onOpenDataModal={openDataModalForSection}
              darkMode={darkMode}
            />
          )}

          {activeTab === "payments" && (
            <PaymentsPage
              payments={payments}
              onAddPayment={handleAddPayment}
              onDeletePayment={handleDeletePayment}
              onOpenDataModal={openDataModalForSection}
              onNavigateToBilling={() => setActiveTab("subscription-billing")}
              darkMode={darkMode}
            />
          )}

          {activeTab === "subscription-billing" && (
            <SubscriptionBillingPage
              darkMode={darkMode}
              onPlanActivated={(plan) => {
                console.log(`PayPal plan activated: ${plan}`);
              }}
            />
          )}

          {activeTab === "automation" && (
            <SubscriptionGuard
              moduleName="Autonomous Workflows & Multi-Step Triggers"
              description="Build autonomous missed-call text backs, multi-channel lead nurture sequences, and agentic business logic."
              onNavigateToBilling={() => setActiveTab("subscription-billing")}
              darkMode={darkMode}
            >
              <AutomationPage
                workflows={workflows}
                onAddWorkflow={handleAddWorkflow}
                onDeleteWorkflow={handleDeleteWorkflow}
                onOpenDataModal={openDataModalForSection}
                onOpenMultiAgent={() => setIsMultiAgentOpen(true)}
                darkMode={darkMode}
              />
            </SubscriptionGuard>
          )}

          {activeTab === "membership" && (
            <MembershipPage darkMode={darkMode} />
          )}

          {activeTab === "affiliate" && (
            <AffiliatePage darkMode={darkMode} />
          )}

          {activeTab === "document-signing" && (
            <DocumentSigningPage
              documents={documents}
              onAddDocument={handleAddDocument}
              onDeleteDocument={handleDeleteDocument}
              onOpenDataModal={openDataModalForSection}
              darkMode={darkMode}
            />
          )}

          {activeTab === "analytics" && (
            <AnalyticsPage
              payments={payments}
              deals={deals}
              onDownloadPdf={handleDownloadPdf}
              onExportCsv={handleExportCsv}
              darkMode={darkMode}
            />
          )}

          {activeTab === "gray-label-app" && (
            <GrayLabelAppPage darkMode={darkMode} />
          )}

          {activeTab === "social-planner" && (
            <SocialPlannerPage
              posts={socialPosts}
              onAddPost={handleAddSocialPost}
              onDeletePost={handleDeleteSocialPost}
              onOpenDataModal={openDataModalForSection}
              onOpenImageGen={() => setIsImageGenOpen(true)}
              darkMode={darkMode}
            />
          )}

          {activeTab === "settings" && (
            <SettingsPage darkMode={darkMode} />
          )}
        </main>
      </div>

      {/* Floating Context-Aware Gemini Chatbot Widget */}
      <GeminiChatbotWidget darkMode={darkMode} />

      {/* Global Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(tabId) => setActiveTab(tabId)}
        contacts={contacts}
        deals={deals}
        workflows={workflows}
        campaigns={campaigns}
        darkMode={darkMode}
      />

      <MultiAgentA2AModal
        isOpen={isMultiAgentOpen}
        onClose={() => setIsMultiAgentOpen(false)}
        darkMode={darkMode}
      />

      <AudioTranscriberModal
        isOpen={isTranscriberOpen}
        onClose={() => setIsTranscriberOpen(false)}
        onAddContact={handleAddContact}
        onAddDeal={handleAddDeal}
        onAddTask={handleAddTask}
        darkMode={darkMode}
      />

      <ImageGenModal
        isOpen={isImageGenOpen}
        onClose={() => setIsImageGenOpen(false)}
        darkMode={darkMode}
        onSendToSocial={(url) => {
          const newPost: SocialPost = {
            id: `post-${Date.now()}`,
            platforms: ["Instagram"],
            content: "🚀 Scaled our revenue operations with autonomous AI workflows! Check out our latest strategy.",
            image_url: url,
            scheduled_for: new Date(Date.now() + 86400000).toISOString(),
            status: "scheduled",
          };
          handleAddSocialPost(newPost);
        }}
        onSendToAdManager={(url) => {
          const newAd = {
            id: `ad-${Date.now()}`,
            name: "AI Visual Asset Campaign",
            platform: "facebook" as const,
            budget: 500,
            spent: 0,
            leads: 0,
            cpl: 0,
            status: "active" as const,
          };
          handleAddAd(newAd);
        }}
      />

      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        activeSection={activeDataSection}
        onAddContact={handleAddContact}
        onAddDeal={handleAddDeal}
        onAddCall={handleAddCall}
        onAddBooking={handleAddBooking}
        onAddReview={handleAddReview}
        onAddPayment={handleAddPayment}
        onAddWorkflow={handleAddWorkflow}
        onAddFunnel={handleAddFunnel}
        onAddAd={handleAddAd}
        onAddDocument={handleAddDocument}
        onAddSocialPost={handleAddSocialPost}
        darkMode={darkMode}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setIsShortcutsOpen(false);
        }}
        darkMode={darkMode}
      />
    </div>
  );
}
