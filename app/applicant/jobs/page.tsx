import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Briefcase, Building2, Clock, Globe2, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default async function ApplicantJobBoard() {
  const supabase = await createClient();
  
  // Fetch all active jobs 
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto pt-8 px-4">
      <Link href="/applicant/dashboard" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest group">
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Back to Dashboard
      </Link>
      
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight text-white font-geist-sans uppercase italic">Open Positions</h1>
        <p className="text-zinc-500 font-medium tracking-wide">Discover and apply to active roles directly through the AI matching engine.</p>
      </div>

      <div className="grid gap-6 mt-8">
        {!jobs || jobs.length === 0 ? (
          <Card className="bg-zinc-950/50 border-zinc-900 border-dashed border-2">
            <CardContent className="p-20 text-center space-y-4">
               <Briefcase className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
               <h3 className="text-xl font-bold text-white">No Open Roles</h3>
               <p className="text-zinc-500">There are currently no active job postings available.</p>
            </CardContent>
          </Card>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="group overflow-hidden bg-zinc-950/50 border-zinc-900 hover:border-zinc-700 transition-all duration-300">
              <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="space-y-4 max-w-2xl">
                    <div>
                      <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors uppercase italic tracking-tight">{job.title}</h2>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                         <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> Corporate</span>
                         <span className="flex items-center gap-1.5"><Globe2 className="h-3.5 w-3.5" /> {job.job_type || 'Remote'}</span>
                         <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2">
                      {job.description}
                    </p>
                    {job.required_skills && job.required_skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {job.required_skills.slice(0, 5).map((skill: string) => (
                          <Badge key={skill} variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 text-[10px] lowercase tracking-wide">
                            {skill}
                          </Badge>
                        ))}
                        {job.required_skills.length > 5 && (
                          <Badge variant="outline" className="bg-transparent border-dashed border-zinc-700 text-zinc-500 text-[10px]">
                            +{job.required_skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                 </div>
                 <div className="flex-shrink-0 flex items-center gap-4">
                    <Link href={`/applicant/jobs/${job.id}`}>
                      <Button className="rounded-xl bg-white text-black hover:bg-zinc-200 font-bold px-8 shadow-xl shadow-white/5 uppercase tracking-widest text-[10px] gap-2">
                        Apply Now
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                 </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
