import { createAdminClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ShieldCheck, Trash2, Mail, Building } from 'lucide-react';
import { deleteRecruiterAction } from '@/app/actions/admin';
import { Badge } from '@/components/ui/Badge';
import { CreateRecruiterForm } from '@/components/admin/CreateRecruiterForm';
import { revalidatePath } from 'next/cache';

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
    <div className="space-y-10 pb-20 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white font-geist-sans uppercase italic">Personnel Control</h1>
          <p className="text-zinc-500 font-medium">Manage recruitment staff and organizational access privileges.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Creation Form */}
        <CreateRecruiterForm />

        {/* List View */}
        <Card className="lg:col-span-2 bg-zinc-950/20 border-zinc-900 overflow-hidden">
          <CardHeader className="border-b border-zinc-900 bg-zinc-900/10 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
               <ShieldCheck className="h-5 w-5 text-zinc-500" />
               Active Recruiter Core
            </CardTitle>
            <Badge variant="outline" className="bg-zinc-900 text-[10px] font-bold">{recruiters.length} Active</Badge>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-900">
              {recruiters.length === 0 ? (
                <div className="p-12 text-center text-zinc-600 italic">No recruiters provisioned.</div>
              ) : (
                recruiters.map((u) => (
                  <div key={u.id} className="p-6 flex items-center justify-between hover:bg-zinc-900/30 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 font-bold uppercase transition-colors group-hover:bg-emerald-500/10 group-hover:text-emerald-400 group-hover:border-emerald-500/20">
                        {u.user_metadata.full_name?.substring(0, 2) || u.email?.substring(0, 2)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white tracking-tight">{u.user_metadata.full_name || 'Unnamed Agent'}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                            <Mail className="h-3 w-3" /> {u.email}
                          </span>
                          {u.user_metadata.company_name && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-600 uppercase tracking-widest border-l border-zinc-800 pl-3">
                              <Building className="h-3 w-3" /> {u.user_metadata.company_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <form action={handleDelete.bind(null, u.id)}>
                       <Button type="submit" variant="outline" size="icon" className="h-8 w-8 rounded-lg border-zinc-800 bg-zinc-900 hover:bg-red-500/10 hover:text-red-500 transition-all group/del">
                         <Trash2 className="h-4 w-4 transition-transform group-hover/del:scale-110" />
                       </Button>
                    </form>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
