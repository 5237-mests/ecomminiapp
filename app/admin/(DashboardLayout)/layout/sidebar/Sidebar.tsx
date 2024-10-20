'use client';
import React, { useState } from 'react';
import SidebarItems from './SidebarItems';
import { SidebarProfile } from './sidbarProfil';

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleMobileSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="" >
      {/* Sidebar container */}
      <div
        className={`bg-red-300  w-[200px] ${
          isSidebarOpen ? "block" : "hidden"
        } sm:block`}
      >
        <section
          id="default-sidebar"
          className={`fixed left-0 z-40 w-64 h-screen transition-transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
          aria-label="Sidebar"
        >
          <div className="h-full shadow-2xl overflow-y-auto bg-gray-500 dark:bg-white">
            <div>
              <SidebarProfile/>
              {/* <Image src={cart} alt="logo" width={100} height={100} /> */}
            </div>
            <div className="px-3 py-4 overflow-y-auto text-sm text-gray-500 dark:text-gray-400">
            <SidebarItems toggleMobileSidebar={toggleMobileSidebar} />
            </div>
          </div>
        </section>
      </div>

      {/* Sidebar Toggle Button for mobile */}
      <button
        className="fixed top-4 left-4 z-50 sm:hidden bg-gray-800 text-white p-2 rounded"
        onClick={toggleMobileSidebar}
      >
        {isSidebarOpen ? "Close" : "Open"} Sidebar
      </button>
    </div>
  );
};

export default Sidebar;
