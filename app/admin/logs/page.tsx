import { Activity, Info } from 'lucide-react';

export default function LogsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-12 pb-20 px-6 relative">
      <div className="flex flex-col gap-2 border-b border-zinc-900 pb-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Telemetry Engine</span>
        </div>
        <h1 className="text-5xl font-black text-white uppercase italic tracking-tighter flex items-center gap-4">
          System <span className="text-emerald-500 underline decoration-emerald-500/20 underline-offset-8">Flux</span>
        </h1>
        <p className="text-zinc-500 font-medium max-w-lg leading-relaxed mt-2">
          Real-time telemetry and engine execution logs. Monitoring data throughput and AI inference cycles.
        </p>
      </div>

      <div className="rounded-[40px] border border-zinc-900 bg-zinc-950/40 p-24 text-center space-y-6 backdrop-blur-xl shadow-2xl">
        <Activity className="h-16 w-16 text-zinc-800 mx-auto animate-pulse" />
        <div className="space-y-2">
           <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Neural Link Pending</h2>
           <p className="text-zinc-600 max-w-md mx-auto text-sm font-medium leading-relaxed">
             The telemetry engine is aggregating global match data. Real-time streaming will be active once the first 10,000 matches are successfully indexed.
           </p>
        </div>
      </div>
    </div>
  );
}
