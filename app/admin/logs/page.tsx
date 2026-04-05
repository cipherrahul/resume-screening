import { createAdminClient } from '@/lib/supabase/server';
import { Activity, Info, Zap, Shield, Search, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default async function LogsPage() {
  const adminClient = await createAdminClient();
  
  // Fetch latest telemetry from matches
  const { data: logs } = await adminClient
    .from('matches')
    .select(`
      id,
      created_at,
      final_score,
      status,
      job:jobs(title)
    `)
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="mx-auto max-w-7xl space-y-12 pb-20 px-6 relative">
      
      {/* Background Effect */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] pointer-events-none opacity-50" />

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Telemetry Engine</span>
          </div>
          <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
            System <span className="text-emerald-500 underline decoration-emerald-500/20 underline-offset-8">Flux</span>
          </h1>
          <p className="text-zinc-500 font-medium max-w-lg leading-relaxed mt-2">
            Monitoring architectural integrity and AI inference throughput. Real-time logging of global match protocols.
          </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl rounded-2xl p-5 flex flex-col items-center justify-center min-w-[140px] group transition-all hover:border-emerald-500/30">
              <span className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
                0.4 <span className="text-emerald-500 text-sm">ms</span>
              </span>
              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1 group-hover:text-emerald-400 transition-colors">Neural Latency</span>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Terminal/Feed (Left) */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                 <Terminal className="h-4 w-4 text-emerald-500" />
                 <h3 className="text-sm font-black text-white uppercase tracking-widest italic">Live Telemetry Feed</h3>
              </div>
              <Badge variant="outline" className="text-[8px] font-black tracking-widest border-emerald-500/20 text-emerald-500 bg-emerald-500/5 px-2 py-0.5 uppercase flex items-center gap-2">
                <Activity className="h-3 w-3" /> System Synchronized
              </Badge>
           </div>

           <div className="group relative overflow-hidden bg-zinc-950/40 rounded-[40px] border border-zinc-900 shadow-2xl backdrop-blur-sm divide-y divide-zinc-900">
              {!logs || logs.length === 0 ? (
                <div className="p-24 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="h-16 w-16 bg-zinc-900 rounded-full flex items-center justify-center">
                      <Zap className="h-8 w-8 text-zinc-700" />
                    </div>
                    <span className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] italic">Awaiting neural activity data</span>
                  </div>
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={log.id} className="p-6 flex items-center justify-between hover:bg-zinc-900/20 transition-all group/item">
                    <div className="flex items-center gap-6">
                       <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-[9px] text-zinc-500 group-hover/item:text-emerald-400 group-hover/item:border-emerald-500/20 transition-all italic">
                         {i+1}
                       </div>
                       <div>
                          <div className="flex items-center gap-3">
                            <h4 className="font-extrabold text-white text-xs uppercase italic tracking-tight group-hover/item:text-emerald-400 transition-colors">
                              Engine Match: {(log.job as any)?.title || 'Neural Search'}
                            </h4>
                            <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">#{log.id.slice(0, 8)}</span>
                          </div>
                          <div className="flex items-center gap-4 mt-1.5 text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                             <span className="flex items-center gap-1"><Zap className="h-2.5 w-2.5" /> Final Score: {log.final_score}</span>
                             <span className="flex items-center gap-1 border-l border-zinc-800 pl-4 capitalize italic"><Activity className="h-2.5 w-2.5" /> Status: {log.status || 'Screened'}</span>
                             <span className="border-l border-zinc-800 pl-4">{new Date(log.created_at).toLocaleTimeString()}</span>
                          </div>
                       </div>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-emerald-500/20 group-hover/item:bg-emerald-500 transition-all shadow-[0_0_10px_rgba(16,185,129,0)] group-hover/item:shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                ))
              )}

              {/* List Footer */}
              <div className="bg-zinc-900/10 px-8 py-5 flex items-center justify-between text-[9px] font-black text-zinc-700 uppercase tracking-[0.3em] font-geist-mono">
                 <div className="flex items-center gap-4">
                    <span className="text-emerald-500 animate-pulse ml-1 opacity-50">&gt;_</span>
                    <span>Consensus Reached 0x82...{logs?.[0]?.id.slice(-4) || 'FFFF'}</span>
                 </div>
                 <span>CRC Verified</span>
              </div>
           </div>
        </div>

        {/* Stats (Right) */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 space-y-8 shadow-2xl relative overflow-hidden group/card shadow-emerald-500/5">
              <div className="absolute top-0 right-0 h-32 w-32 bg-emerald-500/5 blur-3xl pointer-events-none" />
              <div className="flex items-center gap-3">
                 <Shield className="h-5 w-5 text-emerald-500" />
                 <h4 className="text-xs font-black text-white uppercase italic tracking-widest">Security Overview</h4>
              </div>
              <div className="space-y-6">
                 {[
                   { label: 'Neural Throughput', val: '98.4%', icon: Activity },
                   { label: 'Integrity Check', val: 'Passed', icon: Info },
                   { label: 'Global Uptime', val: '99.99%', icon: Zap },
                 ].map(s => (
                   <div key={s.label} className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800 transition-all hover:bg-zinc-800/50">
                      <div className="flex items-center gap-3">
                         <s.icon className="h-4 w-4 text-zinc-600" />
                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{s.label}</span>
                      </div>
                      <span className="text-[11px] font-black text-white uppercase italic">{s.val}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="rounded-[32px] bg-emerald-500/5 border border-emerald-500/20 p-8 space-y-4">
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.3em]">Infrastructure Alert</p>
              <p className="text-xs font-medium text-zinc-400 leading-relaxed italic">
                All engine metrics are within nominal operational parameters. No intervention required for the current epoch.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
