'use client';

import React, { useState } from 'react';
import { login, signup } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';
import {
  Briefcase, Users, ArrowRight, Shield, GraduationCap,
  TrendingUp, Globe2, Star, CheckCircle2, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

const STATS = [
  { value: '2,400+', label: 'Students Placed' },
  { value: '180+', label: 'Hiring Partners' },
  { value: '94%', label: 'Placement Rate' },
];

const FEATURES = [
  { icon: TrendingUp, text: 'AI-powered resume screening & ranking' },
  { icon: Globe2,     text: 'Fortune 500 & global company access' },
  { icon: Star,       text: 'Personalized career roadmap & mentorship' },
  { icon: CheckCircle2, text: 'AICTE approved & ISO certified programs' },
];

const TABS = [
  { id: 'applicant', label: 'Applicant', icon: Users },
  { id: 'recruiter', label: 'Recruiter', icon: Briefcase },
  { id: 'admin',     label: 'Admin',     icon: Shield },
] as const;

type Role = 'applicant' | 'recruiter' | 'admin';

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = React.use(searchParams);
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<Role>('applicant');

  const getTitle = () => {
    if (isSignUp) return `Join as ${role === 'applicant' ? 'Applicant' : 'Recruiter'}`;
    if (role === 'admin') return 'System Administration';
    if (role === 'recruiter') return 'Recruiter Portal';
    return 'Welcome back';
  };

  const getDesc = () => {
    if (isSignUp) return 'Create your account to get started';
    if (role === 'admin') return 'Access system configuration and analytics';
    if (role === 'recruiter') return 'Manage jobs and screen top candidates';
    return 'Sign in to access your career dashboard';
  };

  return (
    <div className="flex min-h-screen font-sans">

      {/* ── LEFT PANEL ────────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-blue-950">

        {/* Deep gradient overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#1e40af55_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_#0f172a_0%,_transparent_70%)]" />

        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-700/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-white/[0.03]" />

        {/* Top: Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-2.5 rounded-2xl">
            <GraduationCap className="h-7 w-7 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg tracking-tight leading-none">RK Institution</p>
            <p className="text-blue-300 text-xs font-medium tracking-widest uppercase">Career Suite</p>
          </div>
        </div>

        {/* Middle: Hero copy */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-blue-200 text-xs font-bold uppercase tracking-widest">Career Excellence 2026</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
            Empowering Every<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">
              Career Journey.
            </span>
          </h1>

          <p className="text-blue-200/80 text-base leading-relaxed mb-10 max-w-sm">
            India's most advanced institutional placement platform — connecting students with global opportunities through AI-driven screening and intelligent matching.
          </p>

          {/* Feature list */}
          <ul className="space-y-3 mb-10">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-3.5 w-3.5 text-blue-300" />
                </div>
                <span className="text-blue-100/80 text-sm">{text}</span>
              </li>
            ))}
          </ul>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            {STATS.map(({ value, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-white text-2xl font-extrabold tracking-tight">{value}</p>
                <p className="text-blue-300 text-xs font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom: Footer */}
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-300/60 text-[10px] font-bold uppercase tracking-[0.2em]">Trusted by</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <div className="flex items-center gap-6 text-blue-300/50 text-xs font-bold uppercase tracking-widest">
            <span>Fortune 500</span>
            <span>·</span>
            <span>ISO Certified</span>
            <span>·</span>
            <span>AICTE Approved</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL (Login Form) ───────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center items-center min-h-screen bg-zinc-50 px-6 py-12 relative overflow-hidden">

        {/* Subtle background blobs */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,_#eff6ff_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_90%,_#f0fdf4_0%,_transparent_50%)]" />

        {/* Back link */}
        <Link
          href="/"
          className="absolute top-8 left-8 inline-flex items-center gap-1.5 text-slate-400 hover:text-blue-900 transition-colors text-xs font-bold uppercase tracking-widest group z-10"
        >
          <ChevronRight className="h-3.5 w-3.5 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
          Home
        </Link>

        {/* Mobile-only logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8 relative z-10">
          <div className="bg-blue-900 p-2 rounded-xl">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-lg font-bold text-blue-900">RK Institution Career Suite</span>
        </div>

        <div className="w-full max-w-md relative z-10">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{getTitle()}</h2>
            <p className="text-slate-500 mt-1.5 text-sm">{getDesc()}</p>
          </div>

          {/* Role Tabs */}
          <div className="flex gap-1.5 p-1 bg-white rounded-2xl border border-zinc-200 shadow-sm mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setRole(tab.id);
                  if (tab.id === 'admin') setIsSignUp(false);
                }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  role === tab.id
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-zinc-50'
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-slate-200/60 overflow-hidden">
            <div className="px-8 pt-8 pb-6">
              <form className="space-y-4">
                {isSignUp && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name</label>
                    <input
                      name="fullName"
                      type="text"
                      required
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/15 focus:border-blue-900 focus:bg-white transition-all placeholder:text-zinc-300"
                      placeholder="John Doe"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/15 focus:border-blue-900 focus:bg-white transition-all placeholder:text-zinc-300"
                    placeholder="name@university.edu"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Password</label>
                    {!isSignUp && (
                      <button type="button" className="text-[11px] font-bold text-blue-900 hover:underline">
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/15 focus:border-blue-900 focus:bg-white transition-all placeholder:text-zinc-300"
                    placeholder="••••••••"
                  />
                </div>

                <input type="hidden" name="role" value={role} />

                {params.error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                    <p className="text-xs font-semibold text-red-600 text-center">{params.error}</p>
                  </div>
                )}
                {params.message && (
                  <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <p className="text-xs font-semibold text-emerald-600 text-center">{params.message}</p>
                  </div>
                )}

                <Button
                  formAction={isSignUp ? signup : login}
                  className="w-full h-12 text-sm font-bold bg-blue-900 text-white hover:bg-blue-800 transition-all rounded-xl shadow-lg shadow-blue-900/15 active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                >
                  {isSignUp
                    ? 'Create Account'
                    : `Sign in to ${role === 'admin' ? 'Admin' : role === 'recruiter' ? 'Recruiter' : 'Applicant'} Portal`}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-slate-50/80 border-t border-zinc-100 flex justify-center">
              {role === 'admin' ? (
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                  Institutional Access Only
                </p>
              ) : role === 'recruiter' ? (
                <div className="text-center space-y-1.5">
                  <p className="text-xs text-slate-500 font-medium">Recruiter accounts are managed by administrators.</p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200/50 text-[10px] font-bold text-blue-800 uppercase tracking-widest">
                    Request access from admin
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-slate-500 hover:text-blue-900 transition-colors font-semibold text-sm"
                >
                  {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                  <span className="text-blue-900 font-bold underline underline-offset-2">
                    {isSignUp ? 'Sign in' : 'Register'}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Fine print */}
          <p className="text-center text-[11px] text-slate-400 font-medium mt-6">
            Secure access for RK Institution students & partners.{' '}
            <Link href="https://www.swagat.space/" className="text-blue-900 font-bold hover:underline">
              swagat.space ↗
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
