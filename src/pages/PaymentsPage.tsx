import React from "react";
import { Payment } from "../types";
import { CreditCard, Plus, DollarSign, Download, CheckCircle2, Trash2, ArrowUpRight } from "lucide-react";

interface PaymentsPageProps {
  payments: Payment[];
  onAddPayment: (payment: any) => void;
  onDeletePayment: (paymentId: string) => void;
  onOpenDataModal: (section?: string) => void;
  onNavigateToBilling?: () => void;
  darkMode?: boolean;
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({
  payments,
  onAddPayment,
  onDeletePayment,
  onOpenDataModal,
  onNavigateToBilling,
  darkMode = false,
}) => {
  const totalCollected = payments
    .filter((p) => p.status === "paid")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Payments, Invoicing &amp; Stripe Billing
            </h2>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white font-mono">
              ${(totalCollected ?? 0).toLocaleString()} Processed
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Automated recurring subscriptions, 1-click invoice links, and Stripe payment gateway.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToBilling && (
            <button
              onClick={onNavigateToBilling}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#3F51B5] hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>PayPal Subscriptions ($29.99 / $299.99)</span>
            </button>
          )}
          <button
            onClick={() => onOpenDataModal("payments")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF9800] hover:bg-amber-500 text-indigo-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices & Transactions Table */}
      <div
        className={`rounded-3xl border overflow-hidden ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead
              className={`border-b font-extrabold uppercase tracking-wider text-[10px] ${
                darkMode ? "bg-slate-800/60 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-500"
              }`}
            >
              <tr>
                <th className="p-4">Invoice # &amp; Customer</th>
                <th className="p-4">Plan / Description</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Gateway</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {payments.map((p) => (
                <tr
                  key={p.id}
                  className={`transition-colors ${
                    darkMode ? "hover:bg-slate-800/50" : "hover:bg-slate-50/80"
                  }`}
                >
                  <td className="p-4">
                    <div className="font-mono font-bold text-[#3F51B5] dark:text-indigo-400">
                      {p.invoice_number}
                    </div>
                    <div className="text-slate-900 dark:text-white font-semibold mt-0.5">
                      {p.contact_name}
                    </div>
                  </td>

                  <td className="p-4 text-slate-600 dark:text-slate-300 font-medium">{p.plan}</td>

                  <td className="p-4 font-mono font-black text-slate-900 dark:text-white text-sm">
                    ${(p.amount ?? 0).toLocaleString()} {p.currency || "USD"}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-700 dark:text-slate-300">{p.method}</span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        p.status === "paid"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td className="p-4 text-slate-400 font-mono text-[11px]">{p.date}</td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => onDeletePayment(p.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-all"
                      title="Delete Invoice"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
