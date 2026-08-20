import React, { createContext, useContext, useState, useEffect } from "react";
import { UserSession } from "../types";
import { syncUserToFirestore, fetchUserFromFirestore } from "../services/firebase";

interface SubscriptionContextType {
  currentUser: UserSession | null;
  setCurrentUser: (user: UserSession | null) => void;
  isSubscribed: boolean;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  isExpiringSoon: boolean;
  trialDaysRemaining: number;
  billingTierDisplay: string;
  renewalDateFormatted: string;
  bannerDismissed: boolean;
  dismissBanner: () => void;
  updateUserSession: (updates: Partial<UserSession>) => void;
  simulateTrialStatus: (mode: "trial_active" | "trial_expiring_soon" | "trial_expired" | "subscription_active") => void;
  logout: () => void;
}

const DEFAULT_USER_SESSION: UserSession = {
  id: "usr-demo-001",
  name: "Alex Mercer",
  email: "demo@revenue-os.ai",
  createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  trialStartDate: new Date(Date.now() - 3 * 86400000).toISOString(),
  trialExpiresDate: new Date(Date.now() + 4 * 86400000).toISOString(),
  subscription: {
    status: "trial_active",
    plan: null,
    planId: null,
    amount: null,
  },
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem("revenue_os_user_session");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_USER_SESSION;
  });

  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Sync to localStorage and Firestore whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("revenue_os_user_session", JSON.stringify(currentUser));
      syncUserToFirestore(currentUser);
    } else {
      localStorage.removeItem("revenue_os_user_session");
    }
  }, [currentUser]);

  // Initial cloud restore if available
  useEffect(() => {
    async function restoreCloudUser() {
      if (currentUser?.id) {
        const cloudData = await fetchUserFromFirestore(currentUser.id);
        if (cloudData && cloudData.subscription) {
          setCurrentUser((prev) => (prev ? { ...prev, ...cloudData } : cloudData));
        }
      }
    }
    restoreCloudUser();
  }, []);

  // Compute trial & subscription attributes
  const now = new Date();
  const expiresDate = currentUser ? new Date(currentUser.trialExpiresDate) : new Date();
  const diffTime = expiresDate.getTime() - now.getTime();
  const trialDaysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const isPaidActive = currentUser?.subscription?.status === "subscription_active";
  const isTrialActive =
    currentUser?.subscription?.status === "trial_active" && diffTime > 0;
  const isTrialExpired =
    currentUser?.subscription?.status === "trial_expired" ||
    (!isPaidActive && diffTime <= 0);

  // user.isSubscribed is true if paid subscription is active OR active trial is valid
  const isSubscribed = Boolean(isPaidActive || isTrialActive);

  // Expiring soon if trial days <= 3 and > 0, or if paid renewal is within 3 days
  const isExpiringSoon =
    (!isPaidActive && trialDaysRemaining <= 3 && !isTrialExpired) ||
    (isPaidActive && currentUser?.subscription?.nextBillingDate
      ? Math.ceil((new Date(currentUser.subscription.nextBillingDate).getTime() - now.getTime()) / (1000 * 86400)) <= 3
      : false);

  // Formatted display names
  let billingTierDisplay = "7-Day Free Trial";
  if (isPaidActive) {
    billingTierDisplay =
      currentUser?.subscription?.plan === "yearly"
        ? "VIP Yearly ($299.99/yr)"
        : "Pro Monthly ($29.99/mo)";
  } else if (isTrialExpired) {
    billingTierDisplay = "Trial Expired";
  }

  let renewalDateFormatted = "—";
  if (isPaidActive && currentUser?.subscription?.nextBillingDate) {
    renewalDateFormatted = new Date(currentUser.subscription.nextBillingDate).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } else if (currentUser?.trialExpiresDate) {
    renewalDateFormatted = new Date(currentUser.trialExpiresDate).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  const dismissBanner = () => setBannerDismissed(true);

  const updateUserSession = (updates: Partial<UserSession>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const simulateTrialStatus = (mode: "trial_active" | "trial_expiring_soon" | "trial_expired" | "subscription_active") => {
    if (!currentUser) return;
    const baseDate = new Date();

    if (mode === "trial_active") {
      setCurrentUser({
        ...currentUser,
        trialStartDate: new Date(baseDate.getTime() - 2 * 86400000).toISOString(),
        trialExpiresDate: new Date(baseDate.getTime() + 5 * 86400000).toISOString(),
        subscription: {
          status: "trial_active",
          plan: null,
          planId: null,
          amount: null,
        },
      });
      setBannerDismissed(false);
    } else if (mode === "trial_expiring_soon") {
      setCurrentUser({
        ...currentUser,
        trialStartDate: new Date(baseDate.getTime() - 5 * 86400000).toISOString(),
        trialExpiresDate: new Date(baseDate.getTime() + 2 * 86400000).toISOString(), // 2 days left
        subscription: {
          status: "trial_active",
          plan: null,
          planId: null,
          amount: null,
        },
      });
      setBannerDismissed(false);
    } else if (mode === "trial_expired") {
      setCurrentUser({
        ...currentUser,
        trialStartDate: new Date(baseDate.getTime() - 8 * 86400000).toISOString(),
        trialExpiresDate: new Date(baseDate.getTime() - 1 * 86400000).toISOString(), // Expired 1 day ago
        subscription: {
          status: "trial_expired",
          plan: null,
          planId: null,
          amount: null,
        },
      });
      setBannerDismissed(false);
    } else if (mode === "subscription_active") {
      setCurrentUser({
        ...currentUser,
        subscription: {
          status: "subscription_active",
          plan: "monthly",
          planId: "P-1N2589523E589180VNKDHMWA",
          amount: 29.99,
          paypalSubscriptionId: `I-PP-ACT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          lastPaymentDate: new Date().toISOString(),
          nextBillingDate: new Date(baseDate.getTime() + 30 * 86400000).toISOString(),
        },
      });
      setBannerDismissed(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("revenue_os_user_session");
  };

  return (
    <SubscriptionContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isSubscribed,
        isTrialActive,
        isTrialExpired,
        isExpiringSoon,
        trialDaysRemaining,
        billingTierDisplay,
        renewalDateFormatted,
        bannerDismissed,
        dismissBanner,
        updateUserSession,
        simulateTrialStatus,
        logout,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};
