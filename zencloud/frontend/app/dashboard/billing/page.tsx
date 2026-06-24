"use client";

import { useState } from "react";
import {
  CreditCard, Download, Calendar, AlertCircle, Check, 
  TrendingUp, Zap, DollarSign, FileText, ArrowUpRight,
  Clock, Shield, Package, ChevronRight, Info, X, Search,
  Filter, TrendingDown, Minus, HardDrive, Activity, 
  Database, Globe, Cpu, Users
} from "lucide-react";

type BillingTab = "subscription" | "usage" | "invoices" | "payment";

type PlanTier = "free" | "starter" | "pro" | "enterprise";

type PaymentMethod = {
  id: string;
  type: "card" | "paypal" | "bank";
  brand: "visa" | "mastercard" | "amex" | "discover" | "paypal" | "bank";
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  holderName: string;
  isDefault: boolean;
  addedDate: string;
};

type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
  description: string;
  downloadUrl: string;
  periodStart: string;
  periodEnd: string;
  paymentMethod: string;
  subtotal: string;
  tax: string;
};

type UsageMetric = {
  name: string;
  current: number;
  limit: number;
  unit: string;
  icon: any;
  category?: string;
  cost?: string;
  trend?: "up" | "down" | "stable";
  trendPercentage?: number;
};

export default function BillingPage() {
  const [activeTab, setActiveTab] = useState<BillingTab>("subscription");
  const [currentPlan, setCurrentPlan] = useState<PlanTier>("pro");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanTier | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState<"all" | "paid" | "pending" | "failed">("all");
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showRemovePaymentModal, setShowRemovePaymentModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);

  const plans = [
    {
      id: "free" as PlanTier,
      name: "Free",
      description: "Perfect for testing and personal projects",
      price: { monthly: "$0", yearly: "$0" },
      features: [
        "1 Project",
        "500MB Storage",
        "10GB Bandwidth",
        "Basic Support",
        "Community Access"
      ],
      limits: {
        projects: 1,
        storage: "500MB",
        bandwidth: "10GB",
        support: "Community"
      }
    },
    {
      id: "starter" as PlanTier,
      name: "Starter",
      description: "For small teams and growing applications",
      price: { monthly: "$29", yearly: "$290" },
      features: [
        "5 Projects",
        "10GB Storage",
        "100GB Bandwidth",
        "Email Support",
        "Custom Domains",
        "SSL Certificates",
        "Basic Monitoring"
      ],
      limits: {
        projects: 5,
        storage: "10GB",
        bandwidth: "100GB",
        support: "Email"
      },
      popular: false
    },
    {
      id: "pro" as PlanTier,
      name: "Pro",
      description: "For professional teams and production apps",
      price: { monthly: "$99", yearly: "$990" },
      features: [
        "20 Projects",
        "100GB Storage",
        "1TB Bandwidth",
        "Priority Support",
        "Advanced Monitoring",
        "Automated Backups",
        "Team Collaboration",
        "API Access",
        "Custom Integrations"
      ],
      limits: {
        projects: 20,
        storage: "100GB",
        bandwidth: "1TB",
        support: "Priority"
      },
      popular: true
    },
    {
      id: "enterprise" as PlanTier,
      name: "Enterprise",
      description: "For large organizations with custom needs",
      price: { monthly: "Custom", yearly: "Custom" },
      features: [
        "Unlimited Projects",
        "Unlimited Storage",
        "Unlimited Bandwidth",
        "24/7 Dedicated Support",
        "SLA Guarantee",
        "Custom Infrastructure",
        "Advanced Security",
        "SSO & SAML",
        "Compliance Tools",
        "Dedicated Account Manager"
      ],
      limits: {
        projects: "Unlimited",
        storage: "Unlimited",
        bandwidth: "Unlimited",
        support: "24/7 Dedicated"
      },
      popular: false
    }
  ];

  const invoices: Invoice[] = [
    {
      id: "INV-2024-006",
      date: "2024-06-01",
      amount: "$99.00",
      status: "paid",
      description: "Pro Plan - Monthly Subscription",
      downloadUrl: "#",
      periodStart: "2024-06-01",
      periodEnd: "2024-06-30",
      paymentMethod: "Visa •••• 4242",
      subtotal: "$99.00",
      tax: "$0.00"
    },
    {
      id: "INV-2024-005",
      date: "2024-05-01",
      amount: "$99.00",
      status: "paid",
      description: "Pro Plan - Monthly Subscription",
      downloadUrl: "#",
      periodStart: "2024-05-01",
      periodEnd: "2024-05-31",
      paymentMethod: "Visa •••• 4242",
      subtotal: "$99.00",
      tax: "$0.00"
    },
    {
      id: "INV-2024-004",
      date: "2024-04-01",
      amount: "$99.00",
      status: "paid",
      description: "Pro Plan - Monthly Subscription",
      downloadUrl: "#",
      periodStart: "2024-04-01",
      periodEnd: "2024-04-30",
      paymentMethod: "Visa •••• 4242",
      subtotal: "$99.00",
      tax: "$0.00"
    },
    {
      id: "INV-2024-003",
      date: "2024-03-01",
      amount: "$99.00",
      status: "paid",
      description: "Pro Plan - Monthly Subscription",
      downloadUrl: "#",
      periodStart: "2024-03-01",
      periodEnd: "2024-03-31",
      paymentMethod: "Visa •••• 4242",
      subtotal: "$99.00",
      tax: "$0.00"
    },
    {
      id: "INV-2024-002",
      date: "2024-02-01",
      amount: "$99.00",
      status: "paid",
      description: "Pro Plan - Monthly Subscription",
      downloadUrl: "#",
      periodStart: "2024-02-01",
      periodEnd: "2024-02-29",
      paymentMethod: "Visa •••• 4242",
      subtotal: "$99.00",
      tax: "$0.00"
    },
    {
      id: "INV-2024-001",
      date: "2024-01-15",
      amount: "$29.00",
      status: "paid",
      description: "Starter Plan - Upgrade",
      downloadUrl: "#",
      periodStart: "2024-01-15",
      periodEnd: "2024-02-14",
      paymentMethod: "Visa •••• 4242",
      subtotal: "$29.00",
      tax: "$0.00"
    },
    {
      id: "INV-2023-012",
      date: "2023-12-15",
      amount: "$0.00",
      status: "paid",
      description: "Free Plan",
      downloadUrl: "#",
      periodStart: "2023-12-15",
      periodEnd: "2024-01-14",
      paymentMethod: "N/A",
      subtotal: "$0.00",
      tax: "$0.00"
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: "pm_1",
      type: "card",
      brand: "visa",
      last4: "4242",
      expiryMonth: "12",
      expiryYear: "2026",
      holderName: "John Doe",
      isDefault: true,
      addedDate: "2024-01-15"
    },
    {
      id: "pm_2",
      type: "card",
      brand: "mastercard",
      last4: "5555",
      expiryMonth: "08",
      expiryYear: "2025",
      holderName: "John Doe",
      isDefault: false,
      addedDate: "2023-11-20"
    },
    {
      id: "pm_3",
      type: "card",
      brand: "amex",
      last4: "0005",
      expiryMonth: "03",
      expiryYear: "2027",
      holderName: "John Doe",
      isDefault: false,
      addedDate: "2024-03-10"
    }
  ];

  const usageMetrics: UsageMetric[] = [
    {
      name: "Projects",
      current: 8,
      limit: 20,
      unit: "projects",
      icon: Package,
      category: "Compute",
      cost: "$0.00",
      trend: "stable",
      trendPercentage: 0
    },
    {
      name: "Storage",
      current: 45,
      limit: 100,
      unit: "GB",
      icon: HardDrive,
      category: "Storage",
      cost: "$0.00",
      trend: "up",
      trendPercentage: 12
    },
    {
      name: "Bandwidth",
      current: 512,
      limit: 1000,
      unit: "GB",
      icon: Activity,
      category: "Network",
      cost: "$0.00",
      trend: "down",
      trendPercentage: -5
    },
    {
      name: "API Calls",
      current: 125000,
      limit: 1000000,
      unit: "calls",
      icon: Zap,
      category: "Compute",
      cost: "$0.00",
      trend: "up",
      trendPercentage: 8
    },
    {
      name: "Database Instances",
      current: 3,
      limit: 10,
      unit: "instances",
      icon: Database,
      category: "Database",
      cost: "$0.00",
      trend: "stable",
      trendPercentage: 0
    },
    {
      name: "Custom Domains",
      current: 5,
      limit: 20,
      unit: "domains",
      icon: Globe,
      category: "Network",
      cost: "$0.00",
      trend: "up",
      trendPercentage: 25
    },
    {
      name: "Build Minutes",
      current: 420,
      limit: 2000,
      unit: "minutes",
      icon: Cpu,
      category: "Compute",
      cost: "$0.00",
      trend: "stable",
      trendPercentage: 0
    },
    {
      name: "Team Members",
      current: 4,
      limit: 10,
      unit: "members",
      icon: Users,
      category: "Collaboration",
      cost: "$0.00",
      trend: "stable",
      trendPercentage: 0
    }
  ];

  const handleUpgrade = (planId: PlanTier) => {
    setSelectedPlan(planId);
    setShowUpgradeModal(true);
  };

  const handleCancelSubscription = () => {
    setShowCancelModal(true);
  };

  const confirmUpgrade = () => {
    if (selectedPlan) {
      setCurrentPlan(selectedPlan);
      setShowUpgradeModal(false);
      setSelectedPlan(null);
    }
  };

  const tabs = [
    { id: "subscription" as BillingTab, label: "Subscription", icon: Package },
    { id: "usage" as BillingTab, label: "Usage", icon: TrendingUp },
    { id: "invoices" as BillingTab, label: "Invoices", icon: FileText },
    { id: "payment" as BillingTab, label: "Payment Methods", icon: CreditCard }
  ];

  const currentPlanDetails = plans.find(p => p.id === currentPlan);

  return (
    <div className="min-h-screen bg-[#0B0B0F] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Billing & Subscription</h1>
            <p className="text-sm text-gray-400">Manage your subscription, usage, and payment methods</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-lg">
              <span className="text-xs font-semibold text-[#FF6B35]">{currentPlanDetails?.name} Plan</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-white/5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition relative ${
                  activeTab === tab.id
                    ? "text-[#FF6B35]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6B35]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Subscription Tab */}
        {activeTab === "subscription" && (
          <div className="space-y-6">
            {/* Current Plan Card */}
            <div className="bg-gradient-to-br from-[#FF6B35]/10 to-transparent border border-[#FF6B35]/20 rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-white">{currentPlanDetails?.name} Plan</h2>
                    <span className="px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-md">
                      Active
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{currentPlanDetails?.description}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-white">
                      {currentPlanDetails?.price[billingCycle]}
                    </span>
                    {currentPlanDetails?.id !== "free" && currentPlanDetails?.id !== "enterprise" && (
                      <span className="text-gray-400 text-sm mb-1">/{billingCycle === "monthly" ? "month" : "year"}</span>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <div className="text-xs text-gray-500">Next billing date</div>
                  <div className="text-sm font-semibold text-white">July 24, 2026</div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleUpgrade("enterprise")}
                  className="px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition flex items-center gap-2"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  Upgrade Plan
                </button>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition">
                  Change Billing Cycle
                </button>
                {currentPlan !== "free" && (
                  <button
                    onClick={handleCancelSubscription}
                    className="px-4 py-2 text-red-400 hover:text-red-300 text-sm font-medium transition"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>

            {/* Plan Features */}
            <div className="bg-[#111116] border border-white/6 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-white mb-4">Plan Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentPlanDetails?.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-[#FF6B35] shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="bg-[#111116] border border-white/6 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-1">Billing Cycle</h3>
                  <p className="text-xs text-gray-400">Save up to 20% with yearly billing</p>
                </div>
                <div className="inline-flex items-center gap-1 border border-white/10 bg-white/5 rounded-lg p-1">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition ${
                      billingCycle === "monthly" ? "bg-[#FF6B35] text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("yearly")}
                    className={`px-4 py-1.5 rounded-md text-xs font-medium transition ${
                      billingCycle === "yearly" ? "bg-[#FF6B35] text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
            </div>

            {/* Available Plans */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Available Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`bg-[#111116] border rounded-xl p-5 transition hover:border-[#FF6B35]/50 ${
                      plan.popular 
                        ? "border-[#FF6B35]/50 ring-1 ring-[#FF6B35]/20" 
                        : plan.id === currentPlan
                        ? "border-green-500/50 ring-1 ring-green-500/20"
                        : "border-white/6"
                    }`}
                  >
                    {plan.popular && (
                      <span className="inline-block px-2 py-1 bg-[#FF6B35]/10 border border-[#FF6B35]/20 text-[#FF6B35] text-[10px] font-semibold rounded mb-3">
                        MOST POPULAR
                      </span>
                    )}
                    {plan.id === currentPlan && (
                      <span className="inline-block px-2 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-semibold rounded mb-3">
                        CURRENT PLAN
                      </span>
                    )}
                    <h4 className="text-lg font-bold text-white mb-1">{plan.name}</h4>
                    <p className="text-xs text-gray-400 mb-4">{plan.description}</p>
                    <div className="flex items-end gap-1 mb-4">
                      <span className="text-2xl font-bold text-white">{plan.price[billingCycle]}</span>
                      {plan.id !== "free" && plan.id !== "enterprise" && (
                        <span className="text-gray-400 text-xs mb-1">/mo</span>
                      )}
                    </div>
                    <ul className="space-y-2 mb-5">
                      {plan.features.slice(0, 5).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-xs text-gray-300">
                          <Check className="w-3.5 h-3.5 text-[#FF6B35] shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {plan.id === currentPlan ? (
                      <button
                        disabled
                        className="w-full py-2 bg-white/5 border border-white/10 text-gray-400 text-sm font-semibold rounded-lg cursor-not-allowed"
                      >
                        Current Plan
                      </button>
                    ) : plan.id === "free" ? (
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
                      >
                        Downgrade
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpgrade(plan.id)}
                        className={`w-full py-2 text-sm font-semibold rounded-lg transition ${
                          plan.popular
                            ? "bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white"
                            : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
                        }`}
                      >
                        {currentPlan === "free" || plans.findIndex(p => p.id === plan.id) > plans.findIndex(p => p.id === currentPlan) 
                          ? "Upgrade" 
                          : "Switch"}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Usage Tab */}
        {activeTab === "usage" && (
          <div className="space-y-6">
            {/* Usage Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#FF6B35]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Resources</p>
                    <p className="text-xl font-bold text-white">
                      {usageMetrics.reduce((acc, m) => acc + (m.category === "Compute" || m.category === "Storage" ? 1 : 0), 0)}/8
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500">Active resources</p>
              </div>
              
              <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Avg. Usage</p>
                    <p className="text-xl font-bold text-white">
                      {Math.round(usageMetrics.reduce((acc, m) => acc + (m.current / m.limit * 100), 0) / usageMetrics.length)}%
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500">Across all metrics</p>
              </div>

              <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">High Usage</p>
                    <p className="text-xl font-bold text-white">
                      {usageMetrics.filter(m => (m.current / m.limit * 100) > 80).length}
                    </p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500">Resources over 80%</p>
              </div>

              <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Extra Costs</p>
                    <p className="text-xl font-bold text-white">$0.00</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500">This billing period</p>
              </div>
            </div>

            {/* Current Plan Limits Info */}
            <div className="bg-gradient-to-br from-[#FF6B35]/10 to-transparent border border-[#FF6B35]/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#FF6B35] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">
                    Current Plan: {currentPlanDetails?.name} Plan
                  </p>
                  <p className="text-xs text-gray-400">
                    You're using {Math.round(usageMetrics.reduce((acc, m) => acc + (m.current / m.limit * 100), 0) / usageMetrics.length)}% of your resources on average. 
                    {usageMetrics.filter(m => (m.current / m.limit * 100) > 80).length > 0 && (
                      <span className="text-yellow-400"> Some resources are approaching their limits.</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Usage by Category */}
            <div className="bg-[#111116] border border-white/6 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Usage by Category</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Detailed breakdown of your resource usage</p>
                </div>
                <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium rounded-lg transition">
                  Export Report
                </button>
              </div>

              <div className="space-y-4">
                {["Compute", "Storage", "Network", "Database", "Collaboration"].map((category) => {
                  const categoryMetrics = usageMetrics.filter(m => m.category === category);
                  if (categoryMetrics.length === 0) return null;

                  return (
                    <div key={category} className="space-y-3">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-sm font-semibold text-white">{category}</h3>
                        <span className="text-[10px] text-gray-500">
                          {categoryMetrics.length} {categoryMetrics.length === 1 ? 'metric' : 'metrics'}
                        </span>
                      </div>
                      
                      <div className="space-y-4 pl-4 border-l-2 border-white/5">
                        {categoryMetrics.map((metric) => {
                          const Icon = metric.icon;
                          const percentage = (metric.current / metric.limit) * 100;
                          const isWarning = percentage > 80;
                          const isDanger = percentage > 95;
                          
                          const getTrendIcon = () => {
                            if (metric.trend === "up") return <TrendingUp className="w-3 h-3 text-green-400" />;
                            if (metric.trend === "down") return <TrendingDown className="w-3 h-3 text-red-400" />;
                            return <Minus className="w-3 h-3 text-gray-400" />;
                          };

                          return (
                            <div key={metric.name} className="bg-white/5 rounded-lg p-4 border border-white/5">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center border border-white/5">
                                    <Icon className="w-5 h-5 text-[#FF6B35]" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm font-semibold text-white">{metric.name}</span>
                                      {(isWarning || isDanger) && (
                                        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${
                                          isDanger 
                                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                            : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                        }`}>
                                          {isDanger ? "CRITICAL" : "HIGH"}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                      <span className={isWarning ? "text-yellow-400 font-semibold" : "text-white"}>
                                        {metric.current.toLocaleString()}
                                      </span>
                                      <span>/</span>
                                      <span>{metric.limit.toLocaleString()} {metric.unit}</span>
                                      {metric.trend && (
                                        <>
                                          <span>•</span>
                                          <div className="flex items-center gap-1">
                                            {getTrendIcon()}
                                            <span className={
                                              metric.trend === "up" ? "text-green-400" :
                                              metric.trend === "down" ? "text-red-400" :
                                              "text-gray-400"
                                            }>
                                              {metric.trendPercentage && metric.trendPercentage !== 0
                                                ? `${Math.abs(metric.trendPercentage)}%`
                                                : "0%"
                                              }
                                            </span>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-white">{Math.round(percentage)}%</div>
                                  <div className="text-[10px] text-gray-500">{metric.cost}</div>
                                </div>
                              </div>
                              
                              <div className="w-full bg-white/5 rounded-full h-2.5 mb-2">
                                <div
                                  className={`h-2.5 rounded-full transition-all ${
                                    isDanger ? "bg-red-500" :
                                    isWarning ? "bg-yellow-500" : 
                                    "bg-[#FF6B35]"
                                  }`}
                                  style={{ width: `${Math.min(percentage, 100)}%` }}
                                />
                              </div>

                              {isWarning && (
                                <div className={`flex items-start gap-2 p-2 rounded-lg ${
                                  isDanger 
                                    ? "bg-red-500/10 border border-red-500/20"
                                    : "bg-yellow-500/10 border border-yellow-500/20"
                                }`}>
                                  <AlertCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                                    isDanger ? "text-red-400" : "text-yellow-400"
                                  }`} />
                                  <p className={`text-xs ${
                                    isDanger ? "text-red-400" : "text-yellow-400"
                                  }`}>
                                    {isDanger 
                                      ? `You've reached ${Math.round(percentage)}% of your ${metric.name.toLowerCase()} limit. Upgrade now to avoid service interruption.`
                                      : `You're approaching your ${metric.name.toLowerCase()} limit. Consider upgrading your plan.`
                                    }
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upgrade CTA */}
            {usageMetrics.filter(m => (m.current / m.limit * 100) > 80).length > 0 && (
              <div className="bg-gradient-to-r from-[#FF6B35]/20 to-purple-500/20 border border-[#FF6B35]/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Need More Resources?</h3>
                    <p className="text-sm text-gray-300 mb-4">
                      You're running low on {usageMetrics.filter(m => (m.current / m.limit * 100) > 80).length} resource
                      {usageMetrics.filter(m => (m.current / m.limit * 100) > 80).length !== 1 ? 's' : ''}. 
                      Upgrade to get more capacity and unlock advanced features.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveTab("subscription")}
                        className="px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition flex items-center gap-2"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        Upgrade Plan
                      </button>
                      <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition">
                        View Plans
                      </button>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-32 h-32 bg-gradient-to-br from-[#FF6B35]/20 to-purple-500/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-16 h-16 text-[#FF6B35]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === "invoices" && (
          <div className="space-y-6">
            {/* Invoice Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Check className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Total Paid</p>
                    <p className="text-xl font-bold text-white">$594.00</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500">6 invoices</p>
              </div>
              
              <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Pending</p>
                    <p className="text-xl font-bold text-white">$0.00</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500">0 invoices</p>
              </div>

              <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-[#FF6B35]/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#FF6B35]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">This Month</p>
                    <p className="text-xl font-bold text-white">$99.00</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500">June 2024</p>
              </div>

              <div className="bg-[#111116] border border-white/6 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Avg. Monthly</p>
                    <p className="text-xl font-bold text-white">$99.00</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500">Last 6 months</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-[#111116] border border-white/6 rounded-xl p-4">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex items-center gap-3 flex-1 w-full md:w-auto">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search invoices..."
                      value={invoiceSearchQuery}
                      onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50"
                    />
                  </div>
                  <div className="flex items-center gap-2 border border-white/10 bg-white/5 rounded-lg p-1">
                    {(["all", "paid", "pending", "failed"] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setInvoiceStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition capitalize ${
                          invoiceStatusFilter === status
                            ? "bg-[#FF6B35] text-white"
                            : "text-gray-400 hover:text-white"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export All
                </button>
              </div>
            </div>

            {/* Invoices List */}
            <div className="bg-[#111116] border border-white/6 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h2 className="text-sm font-semibold text-white">Invoice History</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {invoices.filter(inv => {
                    const matchesSearch = invoiceSearchQuery === "" || 
                      inv.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
                      inv.description.toLowerCase().includes(invoiceSearchQuery.toLowerCase());
                    const matchesStatus = invoiceStatusFilter === "all" || inv.status === invoiceStatusFilter;
                    return matchesSearch && matchesStatus;
                  }).length} invoices found
                </p>
              </div>
              <div className="divide-y divide-white/5">
                {invoices
                  .filter(inv => {
                    const matchesSearch = invoiceSearchQuery === "" || 
                      inv.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
                      inv.description.toLowerCase().includes(invoiceSearchQuery.toLowerCase());
                    const matchesStatus = invoiceStatusFilter === "all" || inv.status === invoiceStatusFilter;
                    return matchesSearch && matchesStatus;
                  })
                  .map((invoice) => (
                    <div key={invoice.id} className="px-6 py-4 hover:bg-white/2 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm font-semibold text-white">{invoice.id}</h3>
                                <span
                                  className={`px-2 py-0.5 text-[10px] font-semibold rounded-md ${
                                    invoice.status === "paid"
                                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                      : invoice.status === "pending"
                                      ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                      : "bg-red-500/10 text-red-400 border border-red-500/20"
                                  }`}
                                >
                                  {invoice.status.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400">{invoice.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] text-gray-500 ml-7">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(invoice.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-3 h-3" />
                              {invoice.paymentMethod}
                            </span>
                            <span>•</span>
                            <span>
                              Period: {new Date(invoice.periodStart).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })} - {new Date(invoice.periodEnd).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-white">{invoice.amount}</div>
                            <div className="text-[10px] text-gray-500">
                              Subtotal: {invoice.subtotal} + Tax: {invoice.tax}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setSelectedInvoice(invoice)}
                              className="p-2 hover:bg-[#FF6B35]/10 border border-[#FF6B35]/20 rounded-lg transition text-[#FF6B35]"
                              title="View Details"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                            <button 
                              className="p-2 hover:bg-white/5 rounded-lg transition text-gray-400 hover:text-white"
                              title="Download Invoice"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                {invoices.filter(inv => {
                  const matchesSearch = invoiceSearchQuery === "" || 
                    inv.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
                    inv.description.toLowerCase().includes(invoiceSearchQuery.toLowerCase());
                  const matchesStatus = invoiceStatusFilter === "all" || inv.status === invoiceStatusFilter;
                  return matchesSearch && matchesStatus;
                }).length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-sm text-gray-400">No invoices found</p>
                    <p className="text-xs text-gray-500 mt-1">Try adjusting your filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === "payment" && (
          <div className="space-y-6">
            {/* Payment Methods Card */}
            <div className="bg-[#111116] border border-white/6 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm font-semibold text-white">Payment Methods</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Manage your payment methods and billing information</p>
                </div>
                <button 
                  onClick={() => setShowAddPaymentModal(true)}
                  className="px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition flex items-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Add Payment Method
                </button>
              </div>
              
              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const getBrandColor = () => {
                    switch (method.brand) {
                      case "visa": return "from-blue-500 to-blue-700";
                      case "mastercard": return "from-orange-500 to-red-600";
                      case "amex": return "from-teal-500 to-blue-600";
                      case "discover": return "from-orange-400 to-yellow-500";
                      default: return "from-gray-500 to-gray-700";
                    }
                  };

                  const getBrandName = () => {
                    return method.brand.charAt(0).toUpperCase() + method.brand.slice(1);
                  };

                  const isExpiringSoon = () => {
                    const currentYear = new Date().getFullYear();
                    const currentMonth = new Date().getMonth() + 1;
                    const expiryYear = parseInt(method.expiryYear);
                    const expiryMonth = parseInt(method.expiryMonth);
                    
                    if (expiryYear === currentYear && expiryMonth - currentMonth <= 2 && expiryMonth >= currentMonth) {
                      return true;
                    }
                    return false;
                  };

                  const isExpired = () => {
                    const currentYear = new Date().getFullYear();
                    const currentMonth = new Date().getMonth() + 1;
                    const expiryYear = parseInt(method.expiryYear);
                    const expiryMonth = parseInt(method.expiryMonth);
                    
                    if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
                      return true;
                    }
                    return false;
                  };

                  return (
                    <div 
                      key={method.id} 
                      className={`p-5 bg-white/5 border rounded-xl transition hover:bg-white/8 ${
                        method.isDefault ? "border-[#FF6B35]/50 ring-1 ring-[#FF6B35]/20" : "border-white/10"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-14 h-14 bg-gradient-to-br ${getBrandColor()} rounded-xl flex items-center justify-center shadow-lg`}>
                            <CreditCard className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-white">
                                {getBrandName()} •••• {method.last4}
                              </span>
                              {method.isDefault && (
                                <span className="px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-semibold rounded-md">
                                  DEFAULT
                                </span>
                              )}
                              {isExpired() && (
                                <span className="px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-semibold rounded-md">
                                  EXPIRED
                                </span>
                              )}
                              {!isExpired() && isExpiringSoon() && (
                                <span className="px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] font-semibold rounded-md">
                                  EXPIRING SOON
                                </span>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-400">
                                <span className="text-gray-500">Cardholder:</span> {method.holderName}
                              </p>
                              <p className="text-xs text-gray-400">
                                <span className="text-gray-500">Expires:</span> {method.expiryMonth}/{method.expiryYear}
                              </p>
                              <p className="text-xs text-gray-400">
                                <span className="text-gray-500">Added:</span> {new Date(method.addedDate).toLocaleDateString('en-US', {
                                  month: 'long',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!method.isDefault && (
                            <button className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-medium rounded-lg transition">
                              Set Default
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              setSelectedPaymentMethod(method);
                              setShowRemovePaymentModal(true);
                            }}
                            className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/20 rounded-lg transition font-medium"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-[#111116] border border-white/6 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-white">Billing Address</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Your default billing address for invoices</p>
                </div>
                <button className="text-xs text-[#FF6B35] hover:text-[#FF6B35]/80 transition font-medium">
                  Edit
                </button>
              </div>
              
              <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">Full Name</p>
                    <p className="text-sm text-white">John Doe</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-white">john.doe@example.com</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[10px] text-gray-500 mb-1">Address</p>
                    <p className="text-sm text-white">123 Main Street, Suite 100</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">City</p>
                    <p className="text-sm text-white">San Francisco</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">State / Province</p>
                    <p className="text-sm text-white">California</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">ZIP / Postal Code</p>
                    <p className="text-sm text-white">94102</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 mb-1">Country</p>
                    <p className="text-sm text-white">United States</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Security Info */}
            <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-white mb-1">Secure Payment Processing</p>
                  <p className="text-xs text-gray-400">
                    All payment information is encrypted and processed securely through Stripe. 
                    We never store your full card details on our servers. Your payment data is 
                    protected by bank-level security and PCI-DSS compliance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111116] border border-white/10 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Confirm Plan Change</h3>
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  setSelectedPlan(null);
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to {plans.findIndex(p => p.id === selectedPlan) > plans.findIndex(p => p.id === currentPlan) ? "upgrade" : "switch"} to the{" "}
              <span className="text-white font-semibold">{plans.find(p => p.id === selectedPlan)?.name}</span> plan?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  setSelectedPlan(null);
                }}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpgrade}
                className="flex-1 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111116] border border-red-500/20 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Cancel Subscription</h3>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-start gap-3 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-400 font-medium mb-1">This action cannot be undone</p>
                <p className="text-xs text-gray-400">
                  Your subscription will remain active until the end of the current billing period.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to cancel your subscription? You will lose access to all premium features.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
              >
                Keep Subscription
              </button>
              <button
                onClick={() => {
                  setCurrentPlan("free");
                  setShowCancelModal(false);
                }}
                className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-semibold rounded-lg transition"
              >
                Cancel Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111116] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="sticky top-0 bg-[#111116] border-b border-white/5 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Invoice Details</h3>
                <p className="text-xs text-gray-400 mt-0.5">{selectedInvoice.id}</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Status Banner */}
              <div className={`p-4 rounded-lg border ${
                selectedInvoice.status === "paid"
                  ? "bg-green-500/10 border-green-500/20"
                  : selectedInvoice.status === "pending"
                  ? "bg-yellow-500/10 border-yellow-500/20"
                  : "bg-red-500/10 border-red-500/20"
              }`}>
                <div className="flex items-center gap-3">
                  {selectedInvoice.status === "paid" ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : selectedInvoice.status === "pending" ? (
                    <Clock className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <X className="w-5 h-5 text-red-400" />
                  )}
                  <div>
                    <p className={`text-sm font-semibold ${
                      selectedInvoice.status === "paid"
                        ? "text-green-400"
                        : selectedInvoice.status === "pending"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}>
                      {selectedInvoice.status === "paid" && "Payment Successful"}
                      {selectedInvoice.status === "pending" && "Payment Pending"}
                      {selectedInvoice.status === "failed" && "Payment Failed"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {selectedInvoice.status === "paid" && `Paid on ${new Date(selectedInvoice.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}
                      {selectedInvoice.status === "pending" && "Your payment is being processed"}
                      {selectedInvoice.status === "failed" && "There was an issue processing your payment"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Invoice Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-gray-400 mb-1">Invoice Number</p>
                  <p className="text-sm font-semibold text-white">{selectedInvoice.id}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-gray-400 mb-1">Invoice Date</p>
                  <p className="text-sm font-semibold text-white">
                    {new Date(selectedInvoice.date).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-gray-400 mb-1">Billing Period</p>
                  <p className="text-sm font-semibold text-white">
                    {new Date(selectedInvoice.periodStart).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })} - {new Date(selectedInvoice.periodEnd).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                  <p className="text-xs text-gray-400 mb-1">Payment Method</p>
                  <p className="text-sm font-semibold text-white">{selectedInvoice.paymentMethod}</p>
                </div>
              </div>

              {/* Line Items */}
              <div className="border border-white/5 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-white/5 border-b border-white/5">
                  <p className="text-xs font-semibold text-white">Line Items</p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{selectedInvoice.description}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(selectedInvoice.periodStart).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })} - {new Date(selectedInvoice.periodEnd).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-white">{selectedInvoice.subtotal}</p>
                  </div>
                </div>
                <div className="px-4 py-3 bg-white/5 border-t border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">{selectedInvoice.subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-400">Tax</span>
                    <span className="text-white">{selectedInvoice.tax}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-white/5">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-lg font-bold text-white">{selectedInvoice.amount}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Payment Method Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111116] border border-white/10 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Add Payment Method</h3>
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Card Number</label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35]/50"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                <p className="text-xs text-gray-400">
                  Your payment information is encrypted and secure
                </p>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="setDefault"
                  className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#FF6B35] focus:ring-[#FF6B35]/50"
                />
                <label htmlFor="setDefault" className="text-xs text-gray-400">
                  Set as default payment method
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPaymentModal(false)}
                  className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAddPaymentModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-[#FF6B35] hover:bg-[#FF6B35]/90 text-white text-sm font-semibold rounded-lg transition"
                >
                  Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remove Payment Method Modal */}
      {showRemovePaymentModal && selectedPaymentMethod && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111116] border border-red-500/20 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Remove Payment Method</h3>
              <button
                onClick={() => {
                  setShowRemovePaymentModal(false);
                  setSelectedPaymentMethod(null);
                }}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-start gap-3 mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-400 font-medium mb-1">Permanent Action</p>
                <p className="text-xs text-gray-400">
                  This payment method will be permanently removed from your account.
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to remove{" "}
              <span className="text-white font-semibold">
                {selectedPaymentMethod.brand.charAt(0).toUpperCase() + selectedPaymentMethod.brand.slice(1)} •••• {selectedPaymentMethod.last4}
              </span>
              ?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRemovePaymentModal(false);
                  setSelectedPaymentMethod(null);
                }}
                className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-semibold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRemovePaymentModal(false);
                  setSelectedPaymentMethod(null);
                }}
                className="flex-1 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-semibold rounded-lg transition"
              >
                Remove Card
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
