import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, GraduationCap, Briefcase, BarChart3, ShieldCheck, Globe2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation Segment */}
      <nav className="border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-900 p-1.5 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-900">RK Institution</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="https://www.swagat.space/student">
              <Button variant="ghost" className="text-sm font-semibold text-zinc-600">Student Portal</Button>
            </Link>
            <Link href="/login">
              <Button className="bg-blue-900 hover:bg-blue-800 text-white rounded-full px-6">
                Recruiter login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_#f0f9ff_0%,_transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-6 relative">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-xs font-bold text-blue-700 uppercase tracking-widest leading-none">Career Excellence 2026</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
                Empowering Futures <br /> 
                <span className="text-blue-900">Career Suite.</span>
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl">
                RK Institution's dedicated platform for AI-driven resume screening and automated placement management. Bridging the gap between talent and global opportunities.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/applicant/dashboard">
                  <Button size="lg" className="bg-blue-900 hover:bg-blue-800 text-white gap-2 h-14 px-8 rounded-full text-lg shadow-xl shadow-blue-900/10">
                    Get Started
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg border-zinc-200 text-zinc-600 hover:bg-zinc-50">
                  Placement Statistics
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section className="py-24 bg-zinc-50 border-y border-zinc-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Institutional-Grade Career Solutions</h2>
              <p className="text-slate-500">Advanced AI integration to streamline the entire recruitment lifecycle for RK Institution.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: 'AI Smart Screening', 
                  desc: 'GPT-powered parsing that extracts deep insights from student profiles beyond basic keywords.',
                  icon: BarChart3,
                  color: 'text-blue-600',
                  bg: 'bg-blue-50'
                },
                { 
                  title: 'Automated Matching', 
                  desc: 'Proprietary scoring engine that aligns student skills with real-time industry requirements.',
                  icon: Briefcase,
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50'
                },
                { 
                  title: 'Placement Analytics', 
                  desc: 'Comprehensive dashboards for institutional stakeholders to monitor success rates and trends.',
                  icon: ShieldCheck,
                  color: 'text-amber-600',
                  bg: 'bg-amber-50'
                },
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-3xl bg-white border border-zinc-100 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300">
                  <div className={`w-12 h-12 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand Bar */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-[0.2em] mb-12">Global Partnerships & Integrity</span>
            <div className="flex flex-wrap justify-center gap-12 grayscale opacity-40">
              <div className="flex items-center gap-2"><Globe2 className="h-6 w-6" /><span className="text-xl font-bold">Fortune 500</span></div>
              <div className="flex items-center gap-2"><ShieldCheck className="h-6 w-6" /><span className="text-xl font-bold">ISO Certified</span></div>
              <div className="flex items-center gap-2"><GraduationCap className="h-6 w-6" /><span className="text-xl font-bold">AICTE Approved</span></div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-100 py-12 bg-zinc-50">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-zinc-900 p-1.5 rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">RK Institution Career Suite</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <p className="text-sm text-zinc-500 font-medium tracking-tight">
              © 2026 RK Institution Branding. All rights reserved. Professional Placement Solutions.
            </p>
            <Link href="https://www.swagat.space/" className="text-sm font-bold text-blue-900 hover:underline uppercase tracking-widest">
              Main Website
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
