"use client";

import React, { useState } from "react";
import Header from "@/app/admin/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/admin/(DashboardLayout)/layout/sidebar/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
      <div className="flex flex-1">
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
        <main className="pl-4 md:ml-[25%] lg:ml-[16.67%] w-full p-8 bg-[#EEF5F9]">
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}
