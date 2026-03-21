import React from 'react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Settings, Info } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="h-8 w-8 text-zinc-400" />
            System Settings
          </h1>
          <p className="text-zinc-500">Configure your screening thresholds and account preferences.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-12 text-center space-y-4">
        <Info className="h-12 w-12 text-zinc-600 mx-auto" />
        <h2 className="text-xl font-bold text-white">Feature Coming Soon</h2>
        <p className="text-zinc-500 max-w-md mx-auto">
          Settings and account management are currently being finalized. You will soon be able to customize your AI screening parameters here.
        </p>
      </div>
    </div>
  );
}
