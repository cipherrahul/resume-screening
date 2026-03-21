import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center space-y-8">
      <div className="space-y-4 max-w-3xl">
        <h1 className="text-6xl font-extrabold tracking-tighter sm:text-7xl bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          AI Resume Screening <br /> at Scale.
        </h1>
        <p className="text-xl text-zinc-400">
          Upload thousands of resumes and let our AI score them against your job descriptions in seconds. Production-ready, modular, and fast.
        </p>
      </div>
      
      <div className="flex gap-4">
        <Link href="/applicant/dashboard">
          <Button size="lg" className="gap-2">
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
        <Button size="lg" variant="outline">Learn More</Button>
      </div>

      <div className="pt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        {[
          { title: 'AI Parsing', desc: 'GPT-4o powered skill and experience extraction.' },
          { title: 'Instant Scoring', desc: 'Quantitative matching against job requirements.' },
          { title: 'Recruiter CRM', desc: 'Full candidate management lifecycle.' },
        ].map((feature, i) => (
          <div key={i} className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-left">
            <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-zinc-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
