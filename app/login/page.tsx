'use client';

import React, { useState } from 'react';
import { login, signup } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/Card';
import { Briefcase, Users, ArrowLeft, Shield, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ error?: string, message?: string }> 
}) {
  const params = React.use(searchParams);
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<'applicant' | 'recruiter' | 'admin'>('applicant');

  const getHeaderTitle = () => {
    if (isSignUp) return `Join as ${role === 'applicant' ? 'Applicant' : 'Recruiter'}`;
    if (role === 'admin') return 'System Administration';
    if (role === 'recruiter') return 'Recruiter Portal';
    return 'Applicant Login';
  };

  const getHeaderDesc = () => {
    if (isSignUp) return 'Create your account to get started';
    if (role === 'admin') return 'Access system configuration and analytics';
    if (role === 'recruiter') return 'Manage jobs and screen candidates';
    return 'Access your application status';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 relative font-sans overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,_#f0f9ff_0%,_transparent_40%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_80%,_#fff7ed_0%,_transparent_40%)]" />

      <Link href="/" className="absolute top-8 left-8 inline-flex items-center gap-2 text-slate-500 hover:text-blue-900 transition-colors text-xs font-bold uppercase tracking-widest group/link z-10">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
        Back to Home
      </Link>

      <div className="flex flex-col gap-6 w-full max-w-md relative z-10">
        {/* Institutional Branding */}
        <div className="flex flex-col items-center gap-3 mb-2">
          <div className="bg-blue-900 p-2.5 rounded-2xl shadow-lg shadow-blue-900/20">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-blue-900 tracking-tight">RK Institution Career Suite</h1>
        </div>

        <div className="grid grid-cols-3 gap-2 p-1 bg-white rounded-xl border border-zinc-200 shadow-sm">
          {[
            { id: 'applicant', label: 'Applicant', icon: Users },
            { id: 'recruiter', label: 'Recruiter', icon: Briefcase },
            { id: 'admin', label: 'Admin', icon: Shield },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setRole(tab.id as any);
                if (tab.id === 'admin') setIsSignUp(false);
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                role === tab.id 
                  ? 'bg-blue-900 text-white shadow-md' 
                  : 'text-slate-500 hover:text-slate-800 hover:bg-zinc-50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <Card className="w-full bg-white border-zinc-200 shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-2 pt-8">
            <CardTitle className="text-2xl font-bold text-slate-900 tracking-tight">
              {getHeaderTitle()}
            </CardTitle>
            <CardDescription className="text-slate-500">
              {getHeaderDesc()}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input
                    name="fullName"
                    type="text"
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all placeholder:text-zinc-300"
                    placeholder="John Doe"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all placeholder:text-zinc-300"
                  placeholder="name@university.edu"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  {!isSignUp && <button type="button" className="text-[11px] font-bold text-blue-900 uppercase tracking-wider hover:underline">Forgot?</button>}
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all placeholder:text-zinc-300"
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
                className="w-full py-7 text-sm font-bold bg-blue-900 text-white hover:bg-blue-800 transition-all rounded-xl shadow-lg shadow-blue-900/10 active:scale-[0.98]"
              >
                {isSignUp ? 'Create Account' : `Log in to ${role === 'admin' ? 'Admin' : role === 'recruiter' ? 'Recruiter' : 'Applicant'} Portal`}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center bg-slate-50/50 border-t border-zinc-100 py-6">
            {role === 'admin' ? (
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">Institutional Access Only</p>
            ) : role === 'recruiter' ? (
              <div className="text-center space-y-2 px-6">
                <p className="text-xs text-slate-500 font-medium">Recruiter accounts are managed by institutional administrators.</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200/50 text-[10px] font-bold text-blue-800 uppercase tracking-widest leading-none">
                  Request Access
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-slate-500 hover:text-blue-900 transition-colors uppercase font-bold tracking-[0.15em] text-[11px]"
              >
                {isSignUp ? 'Already have an account? Login' : "Register as New Applicant"}
              </button>
            )}
          </CardFooter>
        </Card>

        <div className="flex flex-col items-center gap-2">
          <p className="text-center text-[10px] text-slate-400 font-medium tracking-tight">
            Secure Access for RK Institution Students and Partners. <br />
            © 2026 RK Institution Branding.
          </p>
          <Link href="https://www.swagat.space/" className="text-[10px] font-bold text-blue-900 hover:underline uppercase tracking-[0.2em] transition-colors">
            Main Website
          </Link>
        </div>
      </div>
    </div>
  );
}
