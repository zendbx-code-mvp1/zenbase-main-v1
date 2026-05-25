"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Rocket, Zap, Shield, Database, Globe, BarChart3,
  ArrowRight, Check, Github, Terminal, Clock, Server,
  GitBranch, Activity, ChevronRight, Star, Play,
  Lock, RefreshCw, Cpu, Package
} from "lucide-react";

const MARQUEE_ITEMS = [
  "Next.js", "React", "Vue", "Nuxt", "SvelteKit", "Remix",
  "FastAPI", "Django", "Express", "NestJS", "Laravel", "Rails",
];

const LIVE_DEPLOYS = [
  { project: "my-portfolio", user: "alex_dev", time: "2s ago", status: "success", framework: "Next.js" },
  { project: "api-service", user: "priya_k", time: "14s ago", status: "building", framework: "FastAPI" },
  { project: "dashboard-app", user: "marco_r", time: "31s ago", status: "success", framework: "React" },
  { project: "blog-site", user: "sarah_m", time: "1m ago", status: "success", framework: "Nuxt" },
  { project: "backend-api", user: "dev_john", time: "2m ago", status: "success", framework: "Express" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Full Stack Developer",
    avatar: "PS",
    text: "ZenCloud cut our deployment time from 45 minutes to under 2 minutes. The GitHub integration just works — push and it's live.",
    stars: 5,
  },
  {
    name: "Marcus Chen",
    role: "Startup Founder",
    avatar: "MC",
    text: "We went from idea to production in a single afternoon. No DevOps hire needed. ZenCloud handles everything.",
    stars: 5,
  },
  {
    name: "Aisha Patel",
    role: "Backend Engineer",
    avatar: "AP",
    text: "The auto-scaling saved us during a traffic spike. Zero downtime, zero intervention. Exactly what we needed.",
    stars: 5,
  },
];

export default function Home() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-[#080808] text-white overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#080808]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">ZenCloud</span>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
              <a href="#features" className="hover:text-white transition">Features</a>
              <a href="#how-it-works" className="hover:text-white transition">How it works</a>
              <a href="#pricing" className="hover:text-white transition">Pricing</a>
              <a href="#testimonials" className="hover:text-white transition">Reviews</a>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm text-gray-400 hover:text-white transition px-3 py-2">
                Sign in
              </Link>
              <Link
                href="/signup"
                className="text-sm bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Start free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-4 relative">
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,107,53,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,53,0.03) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#FF6B35]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 rounded-full px-4 py-1.5 text-sm text-gray-300 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Live deploys happening right now</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.08] mb-6">
            Ship your app
            <br />
            <span className="text-[#FF6B35]">before lunch.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Connect GitHub, pick a repo, and go live in seconds.
            No YAML. No Kubernetes. No DevOps degree required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-7 py-3.5 rounded-xl text-base font-semibold transition group"
            >
              Deploy for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/8 text-white px-7 py-3.5 rounded-xl text-base font-medium transition"
            >
              <Play className="w-4 h-4" />
              See how it works
            </a>
          </div>

          <div className="flex items-center justify-center flex-wrap gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> 2 free projects forever</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-green-500" /> Deploy in 30 seconds</span>
          </div>
        </div>

        {/* Live deploy feed */}
        <div className="max-w-3xl mx-auto mt-16 relative z-10">
          <div className="border border-white/8 rounded-2xl overflow-hidden bg-[#0d0d0d]">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-[#111]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <span className="text-xs text-gray-500 ml-2 font-mono">zencloud — live deployments</span>
              <div className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                Live
              </div>
            </div>
            {/* Feed rows */}
            <div className="divide-y divide-white/5">
              {LIVE_DEPLOYS.map((d, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-white/2 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-md bg-[#FF6B35]/15 flex items-center justify-center">
                      <Rocket className="w-3.5 h-3.5 text-[#FF6B35]" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-white">{d.project}</span>
                      <span className="text-xs text-gray-500 ml-2">by {d.user}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-mono">{d.framework}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      d.status === "success"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-blue-500/10 text-blue-400"
                    }`}>
                      {d.status === "building" ? "● building" : "✓ deployed"}
                    </span>
                    <span className="text-xs text-gray-600">{d.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div className="border-y border-white/5 py-4 overflow-hidden bg-[#0a0a0a]">
        <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="text-sm text-gray-500 font-medium shrink-0">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden border border-white/5">
          {[
            { value: "10,000+", label: "Projects deployed" },
            { value: "50,000+", label: "Successful builds" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "<30s", label: "Average deploy time" },
          ].map((stat, i) => (
            <div key={i} className="bg-[#0d0d0d] px-8 py-10 text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest text-[#FF6B35] uppercase mb-3">How it works</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              From code to live
              <br />
              in three steps.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                icon: Github,
                title: "Connect your repo",
                desc: "Link GitHub and select any repository. We detect your framework automatically — no config files needed.",
              },
              {
                num: "02",
                icon: Zap,
                title: "We build it",
                desc: "ZenCloud runs your build pipeline, installs dependencies, and packages your app in an isolated container.",
              },
              {
                num: "03",
                icon: Globe,
                title: "You go live",
                desc: "Your app gets a live URL with HTTPS, auto-scaling, and zero-downtime deploys on every push.",
              },
            ].map((step) => (
              <div key={step.num} className="relative border border-white/8 rounded-2xl p-7 bg-[#0d0d0d] group hover:border-[#FF6B35]/30 transition">
                <div className="text-5xl font-black text-white/5 absolute top-5 right-6 select-none">{step.num}</div>
                <div className="w-10 h-10 rounded-xl bg-[#FF6B35]/10 flex items-center justify-center mb-5">
                  <step.icon className="w-5 h-5 text-[#FF6B35]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest text-[#FF6B35] uppercase mb-3">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Everything included.
              <br />
              Nothing to configure.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: Rocket,
                title: "Instant Deployments",
                desc: "Push to GitHub and your app is live in under 30 seconds. Automatic framework detection.",
              },
              {
                icon: Lock,
                title: "SSL by Default",
                desc: "Every project gets a free HTTPS certificate. Automatic renewal, zero configuration.",
              },
              {
                icon: Database,
                title: "Managed Databases",
                desc: "PostgreSQL and Redis with automated backups, monitoring, and one-click provisioning.",
              },
              {
                icon: Globe,
                title: "Custom Domains",
                desc: "Point your domain to ZenCloud and we handle DNS, SSL, and routing automatically.",
              },
              {
                icon: BarChart3,
                title: "Real-time Metrics",
                desc: "CPU, memory, request rate, and error tracking — all in a live dashboard.",
              },
              {
                icon: RefreshCw,
                title: "Auto Scaling",
                desc: "Traffic spike? We scale up automatically and back down when it's quiet.",
              },
              {
                icon: GitBranch,
                title: "Preview Deployments",
                desc: "Every pull request gets its own live preview URL. Share before you merge.",
              },
              {
                icon: Terminal,
                title: "Build Logs",
                desc: "Full streaming build and runtime logs. Debug issues in real time.",
              },
              {
                icon: Cpu,
                title: "Container Isolation",
                desc: "Each project runs in its own container. No noisy neighbours, no shared resources.",
              },
            ].map((f, i) => (
              <div key={i} className="border border-white/6 rounded-xl p-6 bg-[#0d0d0d] hover:border-white/12 transition group">
                <div className="w-9 h-9 rounded-lg bg-[#FF6B35]/10 flex items-center justify-center mb-4 group-hover:bg-[#FF6B35]/15 transition">
                  <f.icon className="w-4.5 h-4.5 text-[#FF6B35]" style={{ width: "18px", height: "18px" }} />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section id="testimonials" className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-widest text-[#FF6B35] uppercase mb-3">Reviews</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Loved by developers.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="border border-white/8 rounded-2xl p-6 bg-[#0d0d0d] flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#FF6B35] text-[#FF6B35]" />
                  ))}
                </div>
                <p className="text-sm text-gray-300 leading-relaxed flex-1">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-[#FF6B35]/20 flex items-center justify-center text-xs font-bold text-[#FF6B35]">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-[#FF6B35] uppercase mb-3">Pricing</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Simple pricing.
              <br />
              No surprises.
            </h2>
            {/* Toggle */}
            <div className="inline-flex items-center gap-1 border border-white/10 bg-white/5 rounded-lg p-1 mt-4">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${billingCycle === "monthly" ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition flex items-center gap-2 ${billingCycle === "yearly" ? "bg-white text-black" : "text-gray-400 hover:text-white"}`}
              >
                Yearly
                <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                name: "Free",
                price: { monthly: "$0", yearly: "$0" },
                desc: "For hobby projects and learning.",
                features: ["2 projects", "1 GB storage", "Community support", "Shared infrastructure", "HTTPS included"],
                cta: "Get started free",
                highlight: false,
              },
              {
                name: "Pro",
                price: { monthly: "$29", yearly: "$23" },
                desc: "For professionals shipping real products.",
                features: ["Unlimited projects", "10 GB storage", "Priority support", "Custom domains", "Preview deployments", "Team collaboration", "Advanced metrics"],
                cta: "Start Pro trial",
                highlight: true,
              },
              {
                name: "Team",
                price: { monthly: "$99", yearly: "$79" },
                desc: "For growing teams with serious workloads.",
                features: ["Everything in Pro", "100 GB storage", "Dedicated support", "SSO & RBAC", "Audit logs", "SLA guarantee", "Dedicated infra"],
                cta: "Start Team trial",
                highlight: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-7 flex flex-col gap-6 ${
                  plan.highlight
                    ? "bg-[#FF6B35] text-white"
                    : "border border-white/8 bg-[#0d0d0d]"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-[#FF6B35] text-xs font-bold px-3 py-1 rounded-full">
                    Most popular
                  </div>
                )}
                <div>
                  <div className={`text-sm font-semibold mb-1 ${plan.highlight ? "text-white/80" : "text-gray-400"}`}>{plan.name}</div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-bold">{plan.price[billingCycle]}</span>
                    <span className={`text-sm mb-1 ${plan.highlight ? "text-white/60" : "text-gray-500"}`}>/mo</span>
                  </div>
                  <p className={`text-sm ${plan.highlight ? "text-white/70" : "text-gray-500"}`}>{plan.desc}</p>
                </div>

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm">
                      <Check className={`w-4 h-4 shrink-0 ${plan.highlight ? "text-white" : "text-[#FF6B35]"}`} />
                      <span className={plan.highlight ? "text-white/90" : "text-gray-300"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/signup"
                  className={`block text-center py-3 rounded-xl text-sm font-semibold transition ${
                    plan.highlight
                      ? "bg-white text-[#FF6B35] hover:bg-gray-100"
                      : "border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/8 text-white"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#FF6B35]/8 rounded-full blur-[100px]" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
            Stop configuring.
            <br />
            <span className="text-[#FF6B35]">Start shipping.</span>
          </h2>
          <p className="text-lg text-gray-400 mb-10">
            Join thousands of developers who deploy with ZenCloud.
            Free tier included — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-[#FF6B35] hover:bg-[#e85d2a] text-white px-8 py-4 rounded-xl text-base font-semibold transition group"
            >
              Deploy your first app free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 border border-white/10 hover:border-white/20 bg-white/5 text-white px-8 py-4 rounded-xl text-base font-medium transition"
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-5 gap-10 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-[#FF6B35] rounded-lg flex items-center justify-center">
                  <Rocket className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-bold text-lg">ZenCloud</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                The deployment platform built for developers who want to ship fast without the ops overhead.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Changelog", "Roadmap"],
              },
              {
                title: "Company",
                links: ["About", "Blog", "Careers", "Contact"],
              },
              {
                title: "Resources",
                links: ["Docs", "API Reference", "Support", "Status"],
              },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-gray-500 hover:text-white transition">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600">© 2026 ZenCloud. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-gray-600">
              <a href="#" className="hover:text-white transition">Privacy</a>
              <a href="#" className="hover:text-white transition">Terms</a>
              <a href="#" className="hover:text-white transition">Security</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Marquee keyframe */}
      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
