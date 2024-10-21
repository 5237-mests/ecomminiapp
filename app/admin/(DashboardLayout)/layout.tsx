"use client";
import React, { useState } from "react";
import Header from "@/app/admin/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/admin/(DashboardLayout)/layout/sidebar/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  // const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  return (
    <div>
      <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
      <Sidebar

        // isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)}
      />
      <main style={{ minHeight: "calc(100vh - 170px)" }}>
        {children}
      </main>
    </div>
  );
}

