'use client';

import React, { useState } from 'react';
import { login, signup } from '@/app/actions/auth';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/Card';
import { Briefcase, Users, ArrowLeft, Shield } from 'lucide-react';
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
    <div className="flex min-h-screen items-center justify-center bg-black p-4 relative">
      <Link href="/" className="absolute top-8 left-8 inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group/link">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
        Back to Home
      </Link>

      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
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
                role === tab.id ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <Card className="w-full bg-zinc-950 border-zinc-800 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-white tracking-tight">
              {getHeaderTitle()}
            </CardTitle>
            <CardDescription className="text-zinc-500">
              {getHeaderDesc()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              {isSignUp && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Full Name</label>
                  <input
                    name="fullName"
                    type="text"
                    required
                    className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                    placeholder="John Doe"
                  />
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                  placeholder="name@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-400">Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full rounded-md border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white transition-all"
                  placeholder="••••••••"
                />
              </div>

              <input type="hidden" name="role" value={role} />

              {params.error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                  <p className="text-xs font-medium text-red-500 text-center">{params.error}</p>
                </div>
              )}
              {params.message && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                  <p className="text-xs font-medium text-emerald-500 text-center">{params.message}</p>
                </div>
              )}

              <Button
                formAction={isSignUp ? signup : login}
                className="w-full py-6 text-sm font-bold bg-white text-black hover:bg-zinc-200 transition-colors"
              >
                {isSignUp ? 'Create Account' : `Log in as ${role === 'admin' ? 'Admin' : role === 'recruiter' ? 'Recruiter' : 'Applicant'}`}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-zinc-900 mt-2 pt-6">
            {role === 'admin' ? (
              <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">Administrative Access Only</p>
            ) : role === 'recruiter' ? (
              <div className="text-center space-y-2">
                <p className="text-xs text-zinc-500 font-medium italic">Self-registration is disabled for recruiters.</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Contact Admin for Access
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-zinc-500 hover:text-white transition-colors uppercase font-bold tracking-widest text-xs"
              >
                {isSignUp ? 'Back to Login' : "Create Applicant Account"}
              </button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
