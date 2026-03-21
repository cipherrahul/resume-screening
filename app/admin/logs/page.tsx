import { Activity, Info } from 'lucide-react';

export default function LogsPage() {
  return (
    <div className="space-y-10 pb-20 max-w-6xl">
       <div>
        <h1 className="text-4xl font-black tracking-tight text-white font-geist-sans uppercase italic">System Flux</h1>
        <p className="text-zinc-500 font-medium">Real-time telemetry and engine execution logs.</p>
      </div>

      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/50 p-12 text-center space-y-4 backdrop-blur-xl">
        <Activity className="h-12 w-12 text-zinc-800 mx-auto animate-pulse" />
        <h2 className="text-xl font-bold text-white tracking-tight uppercase italic">Neural Link Pending</h2>
        <p className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed font-medium">
          The telemetry engine is aggregating global match data. Real-time streaming will be active once the first 10,000 matches are processed.
        </p>
      </div>
    </div>
  );
}
