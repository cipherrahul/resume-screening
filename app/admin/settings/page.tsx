import { Settings, Shield } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-10 pb-20 max-w-6xl">
       <div>
        <h1 className="text-4xl font-black tracking-tight text-white font-geist-sans uppercase italic">Kernal Config</h1>
        <p className="text-zinc-500 font-medium">Global system parameters and security protocols.</p>
      </div>

      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/50 p-12 text-center space-y-4 backdrop-blur-xl">
        <Shield className="h-12 w-12 text-zinc-800 mx-auto" />
        <h2 className="text-xl font-bold text-white tracking-tight uppercase italic">Protocol Locked</h2>
        <p className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed font-medium">
          System-wide settings require Multi-Factor Authentication (MFA) to be enabled on your account. Please visit the Security Center to proceed.
        </p>
      </div>
    </div>
  );
}
