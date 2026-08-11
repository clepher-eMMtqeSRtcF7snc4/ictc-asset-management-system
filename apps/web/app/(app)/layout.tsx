import { Navbar } from "@/components/layout/navbar";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardShell
      header={<Navbar />}
    >
      <div className="w-full px-6 py-6">
        {children}
      </div>
    </DashboardShell>
  );
}