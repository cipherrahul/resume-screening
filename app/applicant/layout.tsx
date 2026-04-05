import { ApplicantSidebar } from '@/components/dashboard/ApplicantSidebar';
import { RKConcierge } from '@/components/applicant/RKConcierge';

export default function ApplicantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black">
      <ApplicantSidebar />
      <main className="flex-1 overflow-y-auto p-8 relative">
        {children}
        <RKConcierge />
      </main>
    </div>
  );
}
