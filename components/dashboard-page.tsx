"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/mainCOMP/dashboard-header";
import { EnhancedSidebar } from "@/components/mainCOMP/enhanced-sidebar";
import { WebsitesList } from "@/components/websites-list";
import { Analytics } from "@/components/analytics";
import { Settings } from "@/components/settings";
import { Templates } from "@/components/templates";

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState("websites");

  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <div className="flex flex-1 flex-col md:flex-row">
        <EnhancedSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 md:p-6">
          {activeTab === "websites" && <WebsitesList />}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "templates" && <Templates />}
          {activeTab === "settings" && <Settings />}
        </main>
      </div>
    </div>
  );
}
