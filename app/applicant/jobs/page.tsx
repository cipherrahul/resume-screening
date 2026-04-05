import { createClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  Briefcase, Building2, Clock, Globe2, 
  ArrowLeft, ArrowRight, Search, Filter, 
  MapPin, DollarSign, Zap, Sparkles, 
  FilterX, ChevronRight, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

export default async function ApplicantJobBoard() {
  const supabase = await createClient();
  
  // Fetch all active jobs 
  const { data: jobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // Mock categories
  const categories = ['All Roles', 'Engineering', 'Products', 'Design', 'Marketing', 'Operations'];

  // Identify "Top Matches" (first 2 for UI demo)
  const topMatches = jobs?.slice(0, 2) || [];

  return (
    <div className="space-y-12 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* ── Hero Search Section ───────────────────────────────────── */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="relative text-center max-w-3xl mx-auto space-y-6">
          <Badge variant="outline" className="bg-blue-500/5 text-blue-400 border-blue-500/20 px-4 py-1 animate-in fade-in slide-in-from-bottom-2 duration-700">
            <Sparkles className="h-3 w-3 mr-2" />
            Empowering Your Future
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white uppercase italic">
            Find Your Next <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Breakthrough.</span>
          </h1>
          <p className="text-zinc-400 text-lg font-medium max-w-xl mx-auto">
            Discover roles that align with your unique skill profile using our advanced AI-driven matching engine.
          </p>

          {/* Search Bar UI */}
          <div className="mt-10 flex flex-col md:flex-row items-center gap-3 p-2 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl">
            <div className="relative flex-1 w-full flex items-center px-4">
              <Search className="h-5 w-5 text-zinc-500 absolute left-4" />
              <input 
                type="text" 
                placeholder="Search job titles, skills, or keywords..." 
                className="w-full bg-transparent border-none focus:ring-0 text-white pl-8 py-3 text-sm placeholder:text-zinc-600"
              />
            </div>
            <div className="h-8 w-px bg-zinc-800 hidden md:block" />
            <div className="relative w-full md:w-48 flex items-center px-4">
              <MapPin className="h-4 w-4 text-zinc-500 absolute left-4" />
              <select className="w-full bg-transparent border-none focus:ring-0 text-white pl-8 py-3 text-sm appearance-none cursor-pointer text-zinc-400 hover:text-white transition-colors">
                <option>Remote</option>
                <option>Hybrid</option>
                <option>On-site</option>
              </select>
            </div>
            <Button className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-8 py-4 transition-all shadow-lg shadow-blue-600/20">
              Find Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* ── Featured / Top Matches ───────────────────────────────── */}
      {topMatches.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-400" />
              Featured Top Matches
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topMatches.map((job) => (
              <Card key={`featured-${job.id}`} className="relative group bg-zinc-950 border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                   <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-xl shadow-emerald-500/5">
                     <Zap className="h-3 w-3 fill-emerald-500" />
                     98% Match
                   </div>
                </div>
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors uppercase italic tracking-tight">{job.title}</h3>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5" /> 
                      RK Institution Partner • {job.job_type || 'Remote'}
                    </p>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2 text-zinc-500 font-bold text-[10px] uppercase">
                       <DollarSign className="h-3.5 w-3.5" />
                       $80k - $120k <span className="text-zinc-700">(Est.)</span>
                    </div>
                    <Link href={`/applicant/jobs/${job.id}`}>
                      <Button variant="ghost" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/5 uppercase tracking-widest p-0 group/btn">
                        Apply with AI Profile
                        <ArrowRight className="h-3 w-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ── Category Filters ──────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        <div className="bg-zinc-900 p-1 rounded-2xl border border-zinc-800 flex items-center gap-1">
          {categories.map((cat, i) => (
            <button 
              key={cat}
              className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                i === 0 ? 'bg-white text-black shadow-xl shadow-white/5' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Roles List ───────────────────────────────────────── */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-zinc-500" />
            All Open Opportunities
          </h2>
          <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">
            <Filter className="h-3 w-3" /> Filtered by: Recently Added
          </div>
        </div>

        <div className="grid gap-4 mt-8">
          {!jobs || jobs.length === 0 ? (
            <Card className="bg-zinc-950/50 border-zinc-900 border-dashed border-2">
              <CardContent className="p-20 text-center space-y-4">
                 <FilterX className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-white">No Open Roles</h3>
                 <p className="text-zinc-500">There are currently no active job postings available.</p>
              </CardContent>
            </Card>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="group overflow-hidden bg-zinc-950/30 border-zinc-900 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all duration-300">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                   <div className="space-y-3 max-w-2xl">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-800 flex items-center justify-center p-2.5">
                          <Building2 className="h-full w-full text-zinc-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white group-hover:text-white transition-colors uppercase italic tracking-tight">{job.title}</h2>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-[9px] font-bold text-zinc-500 uppercase tracking-[0.15em]">
                             <span className="flex items-center gap-1.5"><Globe2 className="h-3 w-3" /> {job.job_type || 'Remote'}</span>
                             <span className="flex items-center gap-1.5 text-zinc-700">•</span>
                             <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> Posted {new Date(job.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-500 leading-relaxed line-clamp-1 pl-[60px]">
                        {job.description}
                      </p>
                      {job.required_skills && job.required_skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1 pl-[60px]">
                          {job.required_skills.slice(0, 4).map((skill: string) => (
                            <Badge key={skill} variant="outline" className="bg-zinc-900 border-zinc-800/50 text-zinc-400 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
                              {skill}
                            </Badge>
                          ))}
                          {job.required_skills.length > 4 && (
                            <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest ml-1 self-center">
                              +{job.required_skills.length - 4} More
                            </span>
                          )}
                        </div>
                      )}
                   </div>
                   <div className="flex-shrink-0 flex items-center gap-4 ml-[60px] md:ml-0">
                      <Link href={`/applicant/jobs/${job.id}`}>
                        <Button className="h-11 rounded-xl bg-zinc-900 border border-zinc-800 text-white hover:bg-white hover:text-black font-bold px-8 shadow-xl transition-all uppercase tracking-widest text-[10px] gap-2">
                          View Details
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
    </div>
  );
}
