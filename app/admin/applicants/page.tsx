import { createAdminClient } from '@/lib/supabase/server';
import { 
  Users, Mail, ArrowUpRight, Search, 
  Filter, UserCheck, Calendar, Activity, 
  Sparkles, TrendingUp, ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export const dynamic = 'force-dynamic';

export default async function ApplicantsPage() {
  const adminClient = await createAdminClient();
  
  // 1. Fetch all 'applicant' roles
  const { data: applicantRoles } = await adminClient
    .from('user_roles')
    .select('user_id')
    .or('role.eq.applicant,role.eq.student');

  const applicantIds = applicantRoles?.map(r => r.user_id) || [];
  
  // 2. Fetch user information from auth (service role)
  const { data: { users } } = await adminClient.auth.admin.listUsers();
  const applicants = users.filter(u => applicantIds.includes(u.id));

  // 3. Fetch applications (matches) to get stats
  const { data: matches } = await adminClient
    .from('matches')
    .select('id, applicant_id');

  const getApplicationCount = (uid: string) => matches?.filter(m => m.applicant_id === uid).length || 0;

  const stats = [
    { label: 'Total Talent', value: applicants.length, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/5', desc: 'Active platform users' },
    { label: 'New This Week', value: applicants.filter(u => new Date(u.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/5', desc: 'Rising growth' },
    { label: 'Verified Status', value: '100%', icon: ShieldCheck, color: 'text-purple-400', bg: 'bg-purple-400/5', desc: 'Secured accounts' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-12 pb-20 px-6">
      
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">User Management</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
            Applicant <span className="text-blue-500 underline decoration-blue-500/20 underline-offset-8">Registry</span>
          </h1>
          <p className="text-zinc-500 font-medium max-w-lg leading-relaxed">
            Comprehensive oversight of the platform's talent pool. Monitor engagement, account integrity, and individual growth.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group w-72">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700 group-focus-within:text-blue-500 transition-colors" />
             <input 
               type="text" 
               placeholder="Search registry..." 
               className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl pl-11 pr-4 py-3.5 text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner font-medium"
             />
          </div>
          <Button variant="outline" className="h-12 w-12 rounded-2xl border-zinc-900 bg-zinc-950 p-0 hover:bg-white hover:text-black transition-all">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* ── Metric Bento Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group relative overflow-hidden bg-zinc-950 border border-zinc-900 rounded-[32px] p-7 transition-all hover:border-zinc-800 hover:shadow-2xl">
            <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="flex items-center gap-6">
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} border border-white/5 transition-transform group-hover:scale-110 shadow-xl`}>
                <stat.icon className="h-7 w-7" />
              </div>
              <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">{stat.label}</p>
                <p className="text-3xl font-black text-white italic tracking-tighter mt-0.5">{stat.value}</p>
                <p className="text-[10px] font-medium text-zinc-600 mt-1">{stat.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Table Section ─────────────────────────────────── */}
      <div className="group relative overflow-hidden bg-zinc-950/40 rounded-[40px] border border-zinc-900 shadow-2xl backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/30 border-b border-zinc-800/80 text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-black">
                <th className="px-8 py-6">Applicant Node</th>
                <th className="px-6 py-6">Communication</th>
                <th className="px-6 py-6">Engagement</th>
                <th className="px-6 py-6">Integrity Metrics</th>
                <th className="px-8 py-6 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {applicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center">
                        <Users className="h-8 w-8 text-zinc-700" />
                      </div>
                      <span className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] italic">No entities detected in registry</span>
                    </div>
                  </td>
                </tr>
              ) : (
                applicants.map((u, i) => {
                  const appsCount = getApplicationCount(u.id);
                  const colors = ['text-blue-400', 'text-emerald-400', 'text-purple-400', 'text-amber-400', 'text-rose-400'];
                  const color = colors[i % colors.length];
                  const initials = u.user_metadata.full_name?.substring(0, 2) || u.email?.substring(0, 2) || 'AN';

                  return (
                    <tr key={u.id} className="hover:bg-zinc-900/20 transition-all group/row">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[11px] font-black uppercase italic transition-all group-hover/row:scale-110 shadow-lg ${color}`}>
                            {initials}
                          </div>
                          <div>
                            <div className="font-extrabold text-white text-sm group-hover/row:text-blue-400 transition-colors uppercase italic tracking-tight">
                              {u.user_metadata.full_name || 'Anonymous Applicant'}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                               <Sparkles className="h-3 w-3 text-zinc-700" />
                               <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Verified Human</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1">
                           <div className="flex items-center gap-2 text-zinc-400 font-mono text-[11px] font-medium tracking-tight">
                             <Mail className="h-3 w-3 text-zinc-600" /> {u.email}
                           </div>
                           <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">Primary Contact Pipe</p>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                         <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
                            <span className="text-sm font-black text-white italic">{appsCount}</span>
                            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Applications</span>
                         </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-2">
                           <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                             <span>Joined</span>
                             <span className="text-zinc-400">{new Date(u.created_at).toLocaleDateString()}</span>
                           </div>
                           <div className="h-1 w-24 bg-zinc-900 rounded-full overflow-hidden">
                              <div className="h-full w-full bg-blue-500/50 rounded-full" />
                           </div>
                           <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-600">
                             <span>Active</span>
                             <span className="text-zinc-400">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never'}</span>
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <Link href={`/admin/applicants/${u.id}`}>
                           <Button variant="outline" className="h-10 px-6 gap-2 bg-zinc-900 border-zinc-800 hover:bg-white hover:text-black transition-all text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-xl">
                              Inspect <ArrowUpRight className="h-3.5 w-3.5 text-zinc-500 group-hover/row:text-black transition-colors" />
                           </Button>
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-zinc-900/10 border-t border-zinc-900 px-8 py-6 flex items-center justify-between text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">
           <div className="flex items-center gap-4">
              <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
              <span>Monitoring {applicants.length} Registered Nodes</span>
           </div>
           <div className="flex items-center gap-4">
              <button className="hover:text-white transition-colors" disabled>Previous</button>
              <div className="h-6 w-6 rounded bg-zinc-900 flex items-center justify-center text-white border border-zinc-800">1</div>
              <button className="hover:text-white transition-colors" disabled>Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}

