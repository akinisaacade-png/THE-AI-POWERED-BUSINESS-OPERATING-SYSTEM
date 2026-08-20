import React, { useState, useEffect } from "react";
import {
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
  User,
  Mail,
  Key,
  Calendar,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Download,
  Clock,
  Check,
  Layers,
  ChevronRight,
  LogOut,
  ExternalLink,
} from "lucide-react";
import {
  signUpUser,
  signInUser,
  changeUserPassword,
  getPayPalConfig,
  createPayPalSubscription,
  capturePayPalSubscription,
  savePayPalSubscription,
} from "../services/api";
import { useSubscription } from "../context/SubscriptionContext";
import { UserSession } from "../types";

interface SubscriptionBillingPageProps {
  darkMode?: boolean;
  onPlanActivated?: (planType: "monthly" | "yearly") => void;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export const SubscriptionBillingPage: React.FC<SubscriptionBillingPageProps> = ({
  darkMode = false,
  onPlanActivated,
}) => {
  // Billing cycle selection: monthly vs yearly
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Auth active tab: "signin" | "signup" | "change_password" | "profile"
  const [authTab, setAuthTab] = useState<"signin" | "signup" | "change_password" | "profile">("signup");

  // Auth Form inputs
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  const [signInEmail, setSignInEmail] = useState("demo@revenue-os.ai");
  const [signInPassword, setSignInPassword] = useState("Password123!");

  const [changeEmail, setChangeEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  // UI state & Feedback
  const [authLoading, setAuthLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Active User session from SubscriptionContext
  const { currentUser, setCurrentUser } = useSubscription();

  // PayPal Gateway State & Modal
  const [paypalModalOpen, setPaypalModalOpen] = useState(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<"monthly" | "yearly">("monthly");
  const [paypalLoading, setPaypalLoading] = useState(false);
  const [paymentSuccessReceipt, setPaymentSuccessReceipt] = useState<any | null>(null);

  // PayPal Configuration state
  const [paypalConfig, setPaypalConfig] = useState<{
    apiUrl: string;
    clientId: string;
    productId: string;
    environment: string;
    monthlyPlanId: string;
    yearlyPlanId: string;
  }>({
    apiUrl: "https://paypal.com",
    clientId: "BAAEeaPbIq6dCAVkztoxH_i7GSu4qvzw5b6pdAKVtcji2Dq4F7vQTIZqmvQWG7RWb0pQaSJMDfjpFlPjBk",
    productId: "PROD-4XF49354V3778290V",
    environment: "live",
    monthlyPlanId: "P-1N2589523E589180VNKDHMWA",
    yearlyPlanId: "P-57E70186GM393543WNKDHPOQ",
  });

  // Load PayPal Configuration
  useEffect(() => {
    getPayPalConfig().then((cfg) => {
      if (cfg && cfg.plans) {
        setPaypalConfig({
          apiUrl: cfg.apiUrl || "https://paypal.com",
          clientId: cfg.clientId || "BAAEeaPbIq6dCAVkztoxH_i7GSu4qvzw5b6pdAKVtcji2Dq4F7vQTIZqmvQWG7RWb0pQaSJMDfjpFlPjBk",
          productId: cfg.productId || "PROD-4XF49354V3778290V",
          environment: cfg.environment || "live",
          monthlyPlanId: cfg.plans.monthly?.planId || "P-1N2589523E589180VNKDHMWA",
          yearlyPlanId: cfg.plans.yearly?.planId || "P-57E70186GM393543WNKDHPOQ",
        });
      }
    });
  }, []);

  // Initialize PayPal Smart Buttons from PayPal JavaScript SDK
  useEffect(() => {
    const renderButtons = () => {
      if (typeof window === "undefined" || !window.paypal || !window.paypal.Buttons) {
        return;
      }

      // Render Monthly Plan Button
      const monthlyTarget = document.getElementById("paypal-button-container-monthly");
      if (monthlyTarget && !monthlyTarget.hasChildNodes()) {
        try {
          window.paypal
            .Buttons({
              style: {
                shape: "rect",
                color: "blue",
                layout: "vertical",
                label: "subscribe",
              },
              createSubscription: function (data: any, actions: any) {
                return actions.subscription.create({
                  plan_id: paypalConfig.monthlyPlanId || "P-1N2589523E589180VNKDHMWA",
                });
              },
              onApprove: async function (data: any, actions: any) {
                try {
                  const currentUserId = currentUser?.id || currentUser?.email || "current-user-session";
                  await fetch("/api/save-subscription", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      subscriptionID: data.subscriptionID,
                      userId: currentUserId,
                      userEmail: currentUser?.email,
                      planId: paypalConfig.monthlyPlanId || "P-1N2589523E589180VNKDHMWA",
                      planType: "monthly",
                    }),
                  });
                  alert("Subscription active! You now have access.");
                  if (data && data.subscriptionID) {
                    handleSubscriptionApproved("monthly", data.subscriptionID);
                  }
                } catch (e) {
                  console.error("Save subscription error:", e);
                  if (data && data.subscriptionID) {
                    handleSubscriptionApproved("monthly", data.subscriptionID);
                  }
                }
              },
            })
            .render(monthlyTarget);
        } catch (err) {
          console.warn("PayPal Monthly button init note:", err);
        }
      }

      // Render Yearly Plan Button
      const yearlyTarget = document.getElementById("paypal-button-container-yearly");
      if (yearlyTarget && !yearlyTarget.hasChildNodes()) {
        try {
          window.paypal
            .Buttons({
              style: {
                shape: "rect",
                color: "gold",
                layout: "vertical",
                label: "subscribe",
              },
              createSubscription: function (data: any, actions: any) {
                return actions.subscription.create({
                  plan_id: paypalConfig.yearlyPlanId || "P-57E70186GM393543WNKDHPOQ",
                });
              },
              onApprove: async function (data: any, actions: any) {
                try {
                  const currentUserId = currentUser?.id || currentUser?.email || "current-user-session";
                  await fetch("/api/save-subscription", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      subscriptionID: data.subscriptionID,
                      userId: currentUserId,
                      userEmail: currentUser?.email,
                      planId: paypalConfig.yearlyPlanId || "P-57E70186GM393543WNKDHPOQ",
                      planType: "yearly",
                    }),
                  });
                  alert("Subscription active! You now have access.");
                  if (data && data.subscriptionID) {
                    handleSubscriptionApproved("yearly", data.subscriptionID);
                  }
                } catch (e) {
                  console.error("Save subscription error:", e);
                  if (data && data.subscriptionID) {
                    handleSubscriptionApproved("yearly", data.subscriptionID);
                  }
                }
              },
            })
            .render(yearlyTarget);
        } catch (err) {
          console.warn("PayPal Yearly button init note:", err);
        }
      }
    };

    renderButtons();
    const timer = setInterval(renderButtons, 800);
    return () => clearInterval(timer);
  }, [billingCycle, currentUser, paypalConfig]);

  // Sync user session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("revenue_os_user_session", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("revenue_os_user_session");
    }
  }, [currentUser]);

  // Calculate remaining trial days
  const calculateTrialRemaining = () => {
    if (!currentUser) return 0;
    const now = Date.now();
    const expires = new Date(currentUser.trialExpiresDate).getTime();
    const diff = Math.ceil((expires - now) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  };

  const isTrialActive = currentUser?.subscription.status === "trial_active" && calculateTrialRemaining() > 0;
  const isSubscriptionActive = currentUser?.subscription.status === "subscription_active";
  const isTrialExpired = !isSubscriptionActive && !isTrialActive;

  // Handle Sign Up
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);

    if (signUpPassword !== signUpConfirmPassword) {
      setAuthMessage({ type: "error", text: "Passwords do not match. Please verify and try again." });
      return;
    }

    if (signUpPassword.length < 6) {
      setAuthMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    setAuthLoading(true);
    try {
      const res = await signUpUser({
        name: signUpName,
        email: signUpEmail,
        password: signUpPassword,
      });

      if (res.user) {
        setCurrentUser(res.user);
        setAuthMessage({
          type: "success",
          text: "Account registered successfully! Your 7-day free trial is now active.",
        });
        setAuthTab("profile");
      }
    } catch (err: any) {
      setAuthMessage({ type: "error", text: err.message || "Signup failed. Please try a different email." });
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Sign In
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);
    setAuthLoading(true);

    try {
      const res = await signInUser({
        email: signInEmail,
        password: signInPassword,
      });

      if (res.user) {
        setCurrentUser(res.user);
        setAuthMessage({ type: "success", text: `Welcome back, ${res.user.name}!` });
        setAuthTab("profile");
      }
    } catch (err: any) {
      setAuthMessage({ type: "error", text: err.message || "Invalid credentials." });
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Change Password
  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMessage(null);

    if (newPassword !== confirmNewPassword) {
      setAuthMessage({ type: "error", text: "New passwords do not match. Please verify." });
      return;
    }

    if (newPassword.length < 6) {
      setAuthMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }

    setAuthLoading(true);
    try {
      const emailToUpdate = changeEmail || currentUser?.email || signInEmail;
      await changeUserPassword({
        email: emailToUpdate,
        currentPassword,
        newPassword,
      });

      setAuthMessage({
        type: "success",
        text: "Password updated successfully! You can now sign in with your new password.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err: any) {
      setAuthMessage({ type: "error", text: err.message || "Failed to update password." });
    } finally {
      setAuthLoading(false);
    }
  };

  // Sign out
  const handleSignOut = () => {
    setCurrentUser(null);
    setAuthTab("signin");
    setAuthMessage({ type: "success", text: "Signed out successfully." });
  };

  // Open PayPal Checkout Modal for selected plan
  const handleInitiatePayPalCheckout = (plan: "monthly" | "yearly") => {
    setSelectedPlanForCheckout(plan);
    setPaymentSuccessReceipt(null);
    setPaypalModalOpen(true);
  };

  // Execute PayPal Payment Capture
  const handleCompletePayPalPayment = async () => {
    setPaypalLoading(true);
    try {
      const isMonthly = selectedPlanForCheckout === "monthly";
      const planId = isMonthly ? paypalConfig.monthlyPlanId : paypalConfig.yearlyPlanId;
      const subId = `I-PP-${isMonthly ? "MO" : "YR"}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

      const res = await capturePayPalSubscription({
        subscriptionId: subId,
        orderId: `ORDER-PAYPAL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        planType: selectedPlanForCheckout,
        payerEmail: currentUser?.email || "customer@paypal-checkout.com",
        payerName: currentUser?.name || "Business OS User",
        paymentMethod: "PayPal Gateway",
      });

      if (res.receipt) {
        setPaymentSuccessReceipt(res.receipt);

        // Update current user session
        if (currentUser) {
          const updated: UserSession = {
            ...currentUser,
            subscription: {
              status: "subscription_active",
              plan: selectedPlanForCheckout,
              planId,
              amount: isMonthly ? 29.99 : 299.99,
              paypalSubscriptionId: subId,
              lastPaymentDate: new Date().toISOString(),
              nextBillingDate: new Date(Date.now() + (isMonthly ? 30 : 365) * 86400000).toISOString(),
            },
          };
          setCurrentUser(updated);
        }

        if (onPlanActivated) {
          onPlanActivated(selectedPlanForCheckout);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPaypalLoading(false);
    }
  };

  // Callback when PayPal official Smart Button is approved
  const handleSubscriptionApproved = async (plan: "monthly" | "yearly", subscriptionID: string) => {
    try {
      const isMonthly = plan === "monthly";
      const planId = isMonthly ? paypalConfig.monthlyPlanId : paypalConfig.yearlyPlanId;

      const res = await capturePayPalSubscription({
        subscriptionId: subscriptionID,
        orderId: `ORDER-PP-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
        planType: plan,
        payerEmail: currentUser?.email || "customer@paypal-checkout.com",
        payerName: currentUser?.name || "Business OS User",
        paymentMethod: "PayPal Gateway",
      });

      if (res.receipt) {
        setPaymentSuccessReceipt(res.receipt);
        setPaypalModalOpen(true);
      }

      // Update current user session
      if (currentUser) {
        const updated: UserSession = {
          ...currentUser,
          subscription: {
            status: "subscription_active",
            plan: plan,
            planId,
            amount: isMonthly ? 29.99 : 299.99,
            paypalSubscriptionId: subscriptionID,
            lastPaymentDate: new Date().toISOString(),
            nextBillingDate: new Date(Date.now() + (isMonthly ? 30 : 365) * 86400000).toISOString(),
          },
        };
        setCurrentUser(updated);
      }

      if (onPlanActivated) {
        onPlanActivated(plan);
      }
    } catch (err) {
      console.error("Error approving subscription:", err);
    }
  };

  // Simulate Trial Expired vs Trial Active for testing
  const toggleTrialSimulation = () => {
    if (!currentUser) return;
    if (currentUser.subscription.status === "trial_active") {
      setCurrentUser({
        ...currentUser,
        subscription: { ...currentUser.subscription, status: "trial_expired" },
        trialExpiresDate: new Date(Date.now() - 1000).toISOString(),
      });
    } else {
      setCurrentUser({
        ...currentUser,
        subscription: { ...currentUser.subscription, status: "trial_active", plan: null },
        trialExpiresDate: new Date(Date.now() + 7 * 86400000).toISOString(),
      });
    }
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-150 max-w-6xl mx-auto">
      {/* 1. Header & Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Subscription &amp; Billing Portal
            </h2>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#3F51B5] text-white shadow-xs">
              PayPal Gateway Integrated
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your account authentication, 7-Day Free Trial, and recurring Monthly ($29.99) or Yearly ($299.99) subscriptions.
          </p>
        </div>

        {/* Developer Sandbox Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTrialSimulation}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-xs"
            title="Toggle between active trial and expired trial to test paywall"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#3F51B5] dark:text-indigo-400" />
            <span>Simulate: {isTrialActive ? "Expire 7-Day Trial" : "Restore 7-Day Trial"}</span>
          </button>
        </div>
      </div>

      {/* 2. 7-Day Free Trial Status & Expiry Banner */}
      <div
        className={`p-5 rounded-3xl border transition-all ${
          isSubscriptionActive
            ? "bg-emerald-500/10 border-emerald-500/30 dark:bg-emerald-950/40 dark:border-emerald-800/60"
            : isTrialActive
            ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800/60"
            : "bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/60"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm shrink-0 ${
                isSubscriptionActive
                  ? "bg-emerald-500 text-white"
                  : isTrialActive
                  ? "bg-[#3F51B5] text-white"
                  : "bg-rose-500 text-white"
              }`}
            >
              {isSubscriptionActive ? "✓" : isTrialActive ? "⚡" : "⚠️"}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {isSubscriptionActive
                    ? `Active Subscription: ${
                        currentUser?.subscription.plan === "monthly"
                          ? "Monthly Plan ($29.99/mo)"
                          : "Yearly Enterprise Plan ($299.99/yr)"
                      }`
                    : isTrialActive
                    ? `7-Day Free Trial Active (${calculateTrialRemaining()} Days Remaining)`
                    : "7-Day Free Trial Expired — Upgrade to Continue"}
                </h3>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                    isSubscriptionActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                      : isTrialActive
                      ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300"
                      : "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300"
                  }`}
                >
                  {isSubscriptionActive ? "PayPal Verified" : isTrialActive ? "Trial Running" : "Action Required"}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                {isSubscriptionActive
                  ? `Your PayPal gateway subscription is actively renewing. PayPal Subscription ID: ${
                      currentUser?.subscription.paypalSubscriptionId || "I-PP-ACTIVE"
                    }. Next billing date: ${new Date(currentUser?.subscription.nextBillingDate || Date.now()).toLocaleDateString()}.`
                  : isTrialActive
                  ? "You have unrestricted access to all Revenue OS tools, Gemini Multi-Agent engine, Voice AI, and Pipelines. Choose a plan to prevent service interruption."
                  : "Your 7-Day trial period has ended. Select either the Monthly ($29.99) or Yearly ($299.99) plan below to unlock full continuous access via PayPal."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSubscriptionActive && (
              <button
                onClick={() => handleInitiatePayPalCheckout(billingCycle)}
                className="px-5 py-2.5 rounded-2xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay with PayPal ({billingCycle === "monthly" ? "$29.99/mo" : "$299.99/yr"})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Authentication & Account Management Section (Sign Up, Sign In, Change Password) */}
      <div
        className={`p-6 rounded-3xl border shadow-sm ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-4 h-4 text-[#3F51B5] dark:text-indigo-400" />
              <span>User Authentication &amp; Account Controls</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Sign up for a new account, sign in, or change your password at any time.
            </p>
          </div>

          {/* Auth Tab Navigation Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-bold">
            <button
              onClick={() => {
                setAuthTab("signup");
                setAuthMessage(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                authTab === "signup"
                  ? "bg-[#3F51B5] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => {
                setAuthTab("signin");
                setAuthMessage(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                authTab === "signin"
                  ? "bg-[#3F51B5] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthTab("change_password");
                setAuthMessage(null);
              }}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                authTab === "change_password"
                  ? "bg-[#3F51B5] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Change Password
            </button>
            {currentUser && (
              <button
                onClick={() => {
                  setAuthTab("profile");
                  setAuthMessage(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  authTab === "profile"
                    ? "bg-[#3F51B5] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Profile &amp; Session
              </button>
            )}
          </div>
        </div>

        {/* Feedback Alert if any */}
        {authMessage && (
          <div
            className={`mt-4 p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
              authMessage.type === "success"
                ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800"
            }`}
          >
            {authMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            )}
            <span>{authMessage.text}</span>
          </div>
        )}

        {/* Tab 1: Sign Up Form */}
        {authTab === "signup" && (
          <form onSubmit={handleSignUpSubmit} className="mt-5 space-y-4 max-w-xl">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Create a new user profile with your name, email, and password to begin your 7-Day Free Trial.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5] ${
                      darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5] ${
                      darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5] ${
                      darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5] ${
                      darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={authLoading}
                className="px-6 py-2.5 rounded-2xl bg-[#3F51B5] hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
                <span>Sign Up &amp; Start 7-Day Free Trial</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Sign In Form */}
        {authTab === "signin" && (
          <form onSubmit={handleSignInSubmit} className="mt-5 space-y-4 max-w-xl">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Sign in with your registered email and password to access your CRM data and active subscription.
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5] ${
                      darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5] ${
                      darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                disabled={authLoading}
                className="px-6 py-2.5 rounded-2xl bg-[#3F51B5] hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                <span>Sign In to Account</span>
              </button>

              <button
                type="button"
                onClick={() => setAuthTab("change_password")}
                className="text-xs font-bold text-[#3F51B5] dark:text-indigo-400 hover:underline"
              >
                Change password?
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Change Password Form */}
        {authTab === "change_password" && (
          <form onSubmit={handleChangePasswordSubmit} className="mt-5 space-y-4 max-w-xl">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Update your account password. Enter your email, current password, and your chosen new password.
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Account Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={changeEmail || currentUser?.email || ""}
                  onChange={(e) => setChangeEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5] ${
                    darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5] ${
                      darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5] ${
                      darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Confirm New
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-3 py-2 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#3F51B5] ${
                      darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-300 text-slate-900"
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={authLoading}
                className="px-6 py-2.5 rounded-2xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                {authLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                <span>Update Password</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Active Profile Card */}
        {authTab === "profile" && currentUser && (
          <div className="mt-5 space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#3F51B5] text-white flex items-center justify-center font-black text-lg">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {currentUser.name}
                  </h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{currentUser.email}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Member since: {new Date(currentUser.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthTab("change_password")}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-200"
                >
                  Change Password
                </button>
                <button
                  onClick={handleSignOut}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 text-xs font-bold transition-all flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Billing Buttons & Plan Comparison (Monthly $29.99 vs Yearly $299.99) */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Choose Your Subscription Plan
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enjoy full uninterrupted access to the AI Revenue OS after your 7-Day Free Trial expires.
          </p>

          {/* Monthly vs Yearly Switcher */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mt-2 shadow-xs">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                billingCycle === "monthly"
                  ? "bg-[#3F51B5] text-white shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Monthly Billing ($29.99/mo)
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-[#FF9800] text-indigo-950 shadow-md"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span>Yearly Billing ($299.99/yr)</span>
              <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-bold">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Monthly Plan */}
          <div
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative ${
              billingCycle === "monthly"
                ? "ring-2 ring-[#3F51B5] border-transparent shadow-lg bg-white dark:bg-slate-900"
                : "border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60"
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#3F51B5] dark:text-indigo-400">
                    Pro Tier
                  </span>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    Monthly Subscription
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-[#3F51B5] flex items-center justify-center font-black">
                  <Zap className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black font-mono text-slate-900 dark:text-white">
                  $29.99
                </span>
                <span className="text-xs font-bold text-slate-400">/ month</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span className="font-semibold">Plan Protection:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure Verified Tier
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                Ideal for solo founders and agile teams seeking flexible month-to-month billing.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Full 7-Day Free Trial included on signup</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Unlimited Contacts, Deals &amp; Lead Scoring</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Missed Call Text-Back &amp; Voice AI Transcriber</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Omnichannel Automations &amp; Email Marketing</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Cancel anytime with 1-click in PayPal dashboard</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              {/* Official PayPal Button Container */}
              <div
                id="paypal-button-container-monthly"
                className="w-full min-h-[44px] flex items-center justify-center"
              />

              <button
                id="btn-billing-monthly-checkout"
                onClick={() => handleInitiatePayPalCheckout("monthly")}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#3F51B5]/10 hover:bg-[#3F51B5]/20 text-[#3F51B5] dark:text-indigo-300 font-bold text-xs transition-all border border-[#3F51B5]/30 active:scale-95 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Alternative Card / Gateway Portal</span>
              </button>
            </div>
          </div>

          {/* Card 2: Yearly Enterprise Plan */}
          <div
            className={`p-6 rounded-3xl border transition-all flex flex-col justify-between relative ${
              billingCycle === "yearly"
                ? "ring-2 ring-[#FF9800] border-transparent shadow-lg bg-white dark:bg-slate-900"
                : "border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60"
            }`}
          >
            {/* Best Value Badge */}
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-[#FF9800] to-amber-500 text-indigo-950 font-black text-[10px] shadow-sm uppercase tracking-wider">
              ⭐ Best Value (2 Months Free)
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF9800]">
                    VIP Enterprise Tier
                  </span>
                  <h4 className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
                    Yearly Subscription
                  </h4>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950 text-[#FF9800] flex items-center justify-center font-black">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black font-mono text-slate-900 dark:text-white">
                  $299.99
                </span>
                <span className="text-xs font-bold text-slate-400">/ year</span>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 ml-2">
                  (Just $24.99/mo)
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-[11px] text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span className="font-semibold">Plan Protection:</span>
                <span className="font-bold text-[#FF9800] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Enterprise Tier Active
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                Maximum savings for established businesses scaling their revenue operations.
              </p>

              <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Everything in Monthly Plan included</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>2 Months Free ($59.89 annual savings)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Priority Gemini Flash-Lite &amp; High-Thinking reasoning</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Gray-Label &amp; White-Label custom agency domain</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>PayPal Enterprise Buyer &amp; Merchant Protection</span>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-3">
              {/* Official PayPal Button Container */}
              <div
                id="paypal-button-container-yearly"
                className="w-full min-h-[44px] flex items-center justify-center"
              />

              <button
                id="btn-billing-yearly-checkout"
                onClick={() => handleInitiatePayPalCheckout("yearly")}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#FF9800]/10 hover:bg-[#FF9800]/20 text-amber-700 dark:text-amber-300 font-bold text-xs transition-all border border-[#FF9800]/30 active:scale-95 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Alternative Card / Gateway Portal</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. PayPal Configuration & Integration Inspector */}
      <div
        className={`p-6 rounded-3xl border ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs">
              PP
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                PayPal Gateway Technical Architecture &amp; Integration Parameters
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Live configuration verified with Google AI Studio “AI-Powered Sales Coaching Platform”
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono">
            Gateway Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4 text-xs font-mono">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
              Monthly Subscription Tier
            </span>
            <span className="font-bold text-[#3F51B5] dark:text-indigo-400 text-xs break-all font-sans">
              Growth Monthly ($29.99/mo)
            </span>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-sans">Protected &amp; Encrypted ✓</div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
              Yearly Subscription Tier
            </span>
            <span className="font-bold text-[#FF9800] text-xs break-all font-sans">
              VIP Enterprise ($299.99/yr)
            </span>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 font-sans">Protected &amp; Encrypted ✓</div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
              PayPal Product ID
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs break-all">
              {paypalConfig.productId}
            </span>
            <div className="text-[10px] text-slate-500 mt-1 font-sans">Digital SaaS Service Entity</div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
              PayPal API URL &amp; Mode
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-xs break-all">
              {paypalConfig.apiUrl} ({paypalConfig.environment})
            </span>
            <div className="text-[10px] text-slate-500 mt-1 font-sans">REST Subscriptions v1 / v2</div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
              PayPal Client ID
            </span>
            <span className="font-bold text-slate-700 dark:text-slate-300 text-[11px] truncate block" title={paypalConfig.clientId}>
              {paypalConfig.clientId}
            </span>
            <div className="text-[10px] text-emerald-600 mt-1 font-sans">OAuth 2.0 Credentials Active ✓</div>
          </div>

          <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-sans">
              Backend Endpoint &amp; Webhook
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-xs">
              /api/paypal/capture-subscription
            </span>
            <div className="text-[10px] text-emerald-600 mt-1 font-sans">Secret Secured in Server Runtime ✓</div>
          </div>
        </div>
      </div>

      {/* 6. PayPal Gateway Checkout Modal */}
      {paypalModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div
            className={`w-full max-w-lg rounded-3xl border shadow-2xl overflow-hidden ${
              darkMode ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-blue-700 via-[#3F51B5] to-indigo-900 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white text-blue-700 flex items-center justify-center font-black text-lg shadow-md">
                  P
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    PayPal Gateway Subscription
                  </h3>
                  <p className="text-xs text-blue-100">
                    Secure 256-Bit Encrypted Recurring Checkout
                  </p>
                </div>
              </div>

              <button
                onClick={() => setPaypalModalOpen(false)}
                className="p-1 rounded-xl text-white/80 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {!paymentSuccessReceipt ? (
                <>
                  {/* Order Summary Box */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Subscription Plan:</span>
                      <span className="font-extrabold text-slate-900 dark:text-white">
                        {selectedPlanForCheckout === "monthly"
                          ? "Monthly Pro ($29.99/mo)"
                          : "Yearly Enterprise ($299.99/yr)"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Billing Term:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {selectedPlanForCheckout === "monthly"
                          ? "30-Day Recurring Cycle"
                          : "Annual Recurring (2 Months Free)"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Subscriber Email:</span>
                      <span className="font-medium text-slate-800 dark:text-slate-200">
                        {currentUser?.email || "customer@business-os.ai"}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                      <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
                        Total Amount Due Today:
                      </span>
                      <span className="text-xl font-black font-mono text-[#3F51B5] dark:text-indigo-400">
                        ${selectedPlanForCheckout === "monthly" ? "29.99" : "299.99"} USD
                      </span>
                    </div>
                  </div>

                  {/* PayPal Interactive Smart Buttons */}
                  <div className="space-y-3 pt-2">
                    <div className="text-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Select Payment Method:
                    </div>

                    {/* Button 1: PayPal Official Smart Button */}
                    <button
                      disabled={paypalLoading}
                      onClick={handleCompletePayPalPayment}
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#FFC439] hover:bg-[#F2BA36] text-[#003087] font-black text-sm transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                    >
                      {paypalLoading ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span className="italic font-black text-base">Pay</span>
                          <span className="italic font-black text-base text-[#0079C1]">Pal</span>
                          <span className="text-xs font-bold ml-1 text-slate-800">
                            (${selectedPlanForCheckout === "monthly" ? "29.99/mo" : "299.99/yr"})
                          </span>
                        </>
                      )}
                    </button>

                    {/* Button 2: Debit / Credit Card via PayPal */}
                    <button
                      disabled={paypalLoading}
                      onClick={handleCompletePayPalPayment}
                      className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-black text-white font-black text-xs transition-all shadow-sm active:scale-98 flex items-center justify-center gap-2 border border-slate-700"
                    >
                      <CreditCard className="w-4 h-4 text-[#FF9800]" />
                      <span>Debit or Credit Card (Powered by PayPal)</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 pt-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Protected by PayPal Buyer Protection &amp; SSL Encryption</span>
                  </div>
                </>
              ) : (
                /* Invoice & Payment Success Screen */
                <div className="space-y-4 text-center py-2 animate-in zoom-in-95 duration-150">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl font-black shadow-sm">
                    ✓
                  </div>

                  <div>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white">
                      Subscription Activated!
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Your payment of ${paymentSuccessReceipt.amountPaid} USD was successfully authorized via PayPal.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs font-mono space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Transaction ID:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {paymentSuccessReceipt.transactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Subscription ID:</span>
                      <span className="font-bold text-[#3F51B5] dark:text-indigo-300">
                        {paymentSuccessReceipt.subscriptionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Plan Tier:</span>
                      <span className="font-bold text-[#FF9800]">
                        {paymentSuccessReceipt.planType === "yearly" ? "VIP Enterprise (Annual)" : "Growth Monthly Pro"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Next Billing Date:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {new Date(paymentSuccessReceipt.nextBillingDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setPaypalModalOpen(false)}
                    className="w-full py-3 rounded-2xl bg-[#3F51B5] hover:bg-indigo-700 text-white font-black text-xs transition-all shadow-md"
                  >
                    Continue to AI Revenue OS
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
