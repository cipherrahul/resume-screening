'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createJob } from '@/app/actions/job';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Briefcase, Plus, X, BrainCircuit, Globe, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'];

export default function NewJobPage() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  async function handleSubmit(formData: FormData) {
    if (skills.length === 0) {
      alert('Please add at least one required skill.');
      return;
    }

    formData.append('requiredSkills', skills.join(','));

    startTransition(async () => {
      try {
        const result = await createJob(formData);
        if (result.success) {
          router.push('/recruiter/dashboard');
          router.refresh();
        }
      } catch (error) {
        console.error('Failed to create job:', error);
        alert('Failed to create job. Please try again.');
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <Link href="/recruiter/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest group/link">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover/link:-translate-x-1" />
        Back to Dashboard
      </Link>
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <BrainCircuit className="h-6 w-6 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white font-geist-sans tracking-tight uppercase italic">Launch New Campaign</h1>
          <p className="text-zinc-500 font-medium">Define your job requirements and let AI handle the screening.</p>
        </div>
      </div>

      <form action={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-zinc-950/50 border-zinc-900 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">Job Fundamentals</CardTitle>
              <CardDescription>Core details about the role and responsibilities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Job Title</label>
                <input
                  name="title"
                  required
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full bg-zinc-900 border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Job Description</label>
                <textarea
                  name="description"
                  required
                  rows={8}
                  placeholder="Describe the role, expectations, and day-to-day responsibilities..."
                  className="w-full bg-zinc-900 border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium resize-none"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950/50 border-zinc-900 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">Required Expertise</CardTitle>
              <CardDescription>Tags and skills used for AI semantic matching.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Technical Skills & Keywords</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="pl-3 pr-1 py-1 bg-zinc-800 border-zinc-700 text-zinc-300 rounded-lg flex items-center gap-2">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {skills.length === 0 && <span className="text-xs text-zinc-600 italic">No skills added yet...</span>}
                </div>
                <input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                  placeholder="Type a skill and press Enter..."
                  className="w-full bg-zinc-900 border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-zinc-950/50 border-zinc-900 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-white">Logistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Globe className="h-3 w-3 text-zinc-500" /> Job Type
                </label>
                <select 
                  name="jobType"
                  className="w-full bg-zinc-900 border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium appearance-none"
                >
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Clock className="h-3 w-3 text-zinc-500" /> Experience Level
                </label>
                <input
                  name="experienceRequired"
                  required
                  placeholder="e.g. 5+ years"
                  className="w-full bg-zinc-900 border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-medium"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-emerald-500/5 border-emerald-500/20 shadow-2xl shadow-emerald-500/5">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-500 shadow-xl shadow-emerald-500/20 rounded-xl mt-1">
                  <Sparkles className="h-4 w-4 text-black" />
                </div>
                <div>
                   <h4 className="font-bold text-white">AI Engine Ready</h4>
                   <p className="text-xs text-zinc-400 leading-relaxed mt-1">
                     Saving this job will automatically generate vector embeddings for semantic matching.
                   </p>
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-emerald-500 text-black hover:bg-emerald-400 font-black py-6 rounded-2xl shadow-xl shadow-emerald-500/10 transition-all uppercase tracking-widest text-xs"
              >
                {isPending ? 'Propagating...' : 'Launch Campaign'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
