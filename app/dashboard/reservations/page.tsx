import { PropertyReservationsPage } from "@/components/property-reservations-page";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";

export default function ReservationsPage() {
  return (
    <div className="flex min-h-screen flex-col" dir="rtl">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="reservations" />
        <main className="flex-1 p-4 md:p-6">
          <PropertyReservationsPage />
        </main>
      </div>
    </div>
  );
}
