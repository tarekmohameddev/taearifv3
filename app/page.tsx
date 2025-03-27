import { WelcomeDashboard } from "@/components/welcome-dashboard";
import { DashboardHeader } from "@/components/dashboard-header";
import { EnhancedSidebar } from "@/components/enhanced-sidebar";
import { GuidedTour } from "@/components/guided-tour";

export const metadata = {
  title: "Taearif Dashboard",
};

export default function Page() {

  
  
  
  
  
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab="websites" />
        <main className="flex-1 p-4 md:p-6">
          <WelcomeDashboard />
        </main>
      </div>
      <GuidedTour />
    </div>
  );
}
