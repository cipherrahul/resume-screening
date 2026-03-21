import { createAdminClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, Mail, ArrowUpRight, Search } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

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

  return (
    <div className="space-y-10 pb-20 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white font-geist-sans uppercase italic">Applicant Registry</h1>
          <p className="text-zinc-500 font-medium">Monitoring platform usage and applicant growth metrics.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="bg-zinc-950/50 border-zinc-900 overflow-hidden relative group">
           <CardContent className="p-6">
             <div className="flex justify-between items-start">
               <div>
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total Applicants</p>
                 <p className="text-3xl font-black text-white mt-1">{applicants.length}</p>
               </div>
               <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-blue-400">
                 <Users className="h-5 w-5" />
               </div>
             </div>
           </CardContent>
        </Card>
      </div>

      <Card className="bg-zinc-950/20 border-zinc-900 overflow-hidden">
        <CardHeader className="border-b border-zinc-900 bg-zinc-900/10 flex flex-row items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
               <Users className="h-5 w-5 text-zinc-500" />
               Active Applicant Population
            </CardTitle>
          </div>
          <div className="relative w-72">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
             <input 
               type="text" 
               placeholder="Search applicants..." 
               className="w-full bg-zinc-900 border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
             />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-900 bg-zinc-900/10">
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Applicant</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Joined</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Last Sign In</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {applicants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-zinc-500 italic text-sm">No applicants registered.</td>
                  </tr>
                ) : (
                  applicants.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-900/30 transition-colors group">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] font-black text-white uppercase italic transition-colors group-hover:bg-blue-500/10 group-hover:text-blue-400">
                               {u.user_metadata.full_name?.substring(0, 2) || u.email?.substring(0, 2)}
                            </div>
                            <span className="font-bold text-white text-sm tracking-tight">{u.user_metadata.full_name || 'Anonymous Applicant'}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-2 text-zinc-500 font-geist-mono text-xs">
                           <Mail className="h-3 w-3" /> {u.email}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-xs text-zinc-600 font-medium">{new Date(u.created_at).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4">
                         <span className="text-xs text-zinc-600 font-medium">
                           {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString() : 'Never'}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                         <Link href={`/admin/applicants/${u.id}`}>
                            <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-bold text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all uppercase tracking-widest group/btn">
                               Inspect
                               <ArrowUpRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                            </button>
                         </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
