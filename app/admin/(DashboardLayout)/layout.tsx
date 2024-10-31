"use client";

import React, { useState } from "react";
import Header from "@/components/dashboard/header/Header";
import Sidebar from "@/components/dashboard/sideBar/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
      <div className="flex flex-1">
        <Sidebar
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
        <main className=" md:ml-[30%] lg:ml-[16.67%] sm:mt-[5rem] mt-[4rem] w-full p-2 sm:p-8 bg-[#EEF5F9]">
          <div>{children}</div>
        </main>
      </div>
    </div>
  );
}
