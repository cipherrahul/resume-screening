import { createAdminClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { 
  ShieldCheck, Trash2, Mail, Building, 
  UserPlus, Shield, Activity, Search, 
  MoreVertical, ChevronRight, Zap
} from 'lucide-react';
import { deleteRecruiterAction } from '@/app/actions/admin';
import { Badge } from '@/components/ui/Badge';
import { CreateRecruiterForm } from '@/components/admin/CreateRecruiterForm';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function RecruitersPage() {
  const adminClient = await createAdminClient();
  
  // Fetch users with 'recruiter' role from user_roles
  const { data: userRoles } = await adminClient
    .from('user_roles')
    .select('user_id')
    .eq('role', 'recruiter');

  const recruiterIds = userRoles?.map(r => r.user_id) || [];
  
  // Use admin auth to get user details
  const { data: { users } } = await adminClient.auth.admin.listUsers();
  const recruiters = users.filter(u => recruiterIds.includes(u.id));

  async function handleDelete(userId: string) {
    'use server';
    await deleteRecruiterAction(userId);
    revalidatePath('/admin/recruiters');
  }

  return (
    <div className="mx-auto max-w-7xl space-y-12 pb-20 px-6 relative">
      
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/5 blur-[120px] pointer-events-none" />

      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Access Management</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
            Personnel <span className="text-emerald-500 underline decoration-emerald-500/20 underline-offset-8">Intelligence</span>
          </h1>
          <p className="text-zinc-500 font-medium max-w-lg leading-relaxed">
            Provision and manage authorized recruitment agents. Oversight of organizational units and personnel throughput.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl rounded-2xl p-5 flex flex-col items-center justify-center min-w-[140px] group transition-all hover:border-emerald-500/30">
              <span className="text-3xl font-black text-white tracking-tighter">{recruiters.length}</span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1 group-hover:text-emerald-400 transition-colors">Agents Active</span>
          </div>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-12">
        {/* Creation Form (Left/Top) */}
        <div className="lg:col-span-4">
           <CreateRecruiterForm />
        </div>

        {/* List View (Right/Bottom) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
             <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-emerald-500" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Authorized Agent Core</h3>
             </div>
             <div className="relative group w-64">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-700 group-focus-within:text-emerald-500 transition-colors" />
               <input 
                 type="text" 
                 placeholder="Search personnel..." 
                 className="w-full bg-zinc-950 border border-zinc-900 rounded-xl pl-9 pr-4 py-2.5 text-[10px] text-white placeholder:text-zinc-700 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all font-bold uppercase tracking-widest"
               />
             </div>
          </div>

          <div className="group relative overflow-hidden bg-zinc-950/40 rounded-[40px] border border-zinc-900 shadow-2xl backdrop-blur-sm divide-y divide-zinc-900">
             {recruiters.length === 0 ? (
               <div className="p-24 text-center">
                 <div className="flex flex-col items-center gap-4">
                   <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center">
                     <ShieldCheck className="h-8 w-8 text-zinc-700" />
                   </div>
                   <span className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] italic">No active personnel detected</span>
                 </div>
               </div>
             ) : (
               recruiters.map((u, i) => {
                 const initials = u.user_metadata.full_name?.substring(0, 2) || u.email?.substring(0, 2) || 'AN';
                 const colors = ['text-emerald-400', 'text-blue-400', 'text-amber-400', 'text-purple-400'];
                 const color = colors[i % colors.length];

                 return (
                   <div key={u.id} className="p-6 flex items-center justify-between hover:bg-zinc-900/20 transition-all group/row">
                     <div className="flex items-center gap-5">
                       <div className={`h-12 w-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-[11px] uppercase italic transition-all group-hover/row:scale-110 shadow-lg ${color}`}>
                         {initials}
                       </div>
                       <div>
                         <div className="flex items-center gap-3">
                           <h4 className="font-extrabold text-white text-sm uppercase italic tracking-tight group-hover/row:text-emerald-400 transition-colors">{u.user_metadata.full_name || 'Unnamed Agent'}</h4>
                           <Badge variant="outline" className="text-[8px] font-black tracking-widest border-emerald-500/20 text-emerald-500 bg-emerald-500/5 px-2 py-0.5 uppercase">L1 Clearance</Badge>
                         </div>
                         <div className="flex items-center gap-4 mt-1.5">
                           <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                             <Mail className="h-3 w-3" /> {u.email}
                           </span>
                           {u.user_metadata.company_name && (
                             <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-l border-zinc-800/50 pl-4 italic">
                               <Building className="h-3 w-3" /> {u.user_metadata.company_name}
                             </span>
                           )}
                         </div>
                       </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-9 px-4 gap-2 bg-zinc-950 border-zinc-900 hover:bg-white hover:text-black transition-all text-[9px] font-black uppercase tracking-widest rounded-xl shadow-xl">
                          Activity <Zap className="h-3 w-3" />
                        </Button>
                        <form action={handleDelete.bind(null, u.id)}>
                           <Button type="submit" variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all">
                             <Trash2 className="h-4 w-4" />
                           </Button>
                        </form>
                     </div>
                   </div>
                 )
               })
             )}
             
             {/* List Footer */}
             <div className="bg-zinc-900/10 px-8 py-5 flex items-center justify-between text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em]">
                <div className="flex items-center gap-4">
                   <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
                   <span>Monitoring Infrastructure Integrity</span>
                </div>
                <span>Session Active</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

