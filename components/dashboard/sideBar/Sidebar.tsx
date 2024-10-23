"use client";
import React, { useEffect, useState } from "react";
import SidebarItems from "./SidebarItems";
import { SidebarProfile } from "./sidbarProfil";
import logo from "@/assets/fun shop.png";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import Image from "next/image";

interface ItemType {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: MouseEvent | null) => void;
}
const Sidebar = ({ isMobileSidebarOpen, onSidebarClose }: ItemType) => {
  const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => setMatches(media.matches);
      media.addListener(listener);
      return () => media.removeListener(listener);
    }, [matches, query]);

    return matches;
  };

  const matches = useMediaQuery("(min-width: 768px)");
  if (matches) {
    return (
      <div className="md:w-1/4 lg:w-1/6 fixed top-0 left-0 z-40 h-full flex flex-col bg-white shadow-xl mt-[5rem] border">
        <div className="text-base font-semibold leading-6 text-gray-900">
          <SidebarProfile />
        </div>
        <div className="relative mt-2 flex-1 overflow-y-auto">
          <SidebarItems toggleMobileSidebar={onSidebarClose} />
        </div>
      </div>
    );
  }

  return (
    <Dialog
      open={isMobileSidebarOpen}
      onClose={() => onSidebarClose(null)}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-40">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:-translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className=" bg-white  ">
                  <DialogTitle className="text-base font-semibold leading-6 text-gray-900">
                    <Image
                      className=" rounded-full h-10 w-auto"
                      src={logo}
                      alt="Fun Shop"
                      width={200}
                      height={200}
                    />
                    <SidebarProfile />
                  </DialogTitle>
                </div>
                <div className="relative mt-2 flex-1 px-4 ">
                  {/* Your content */}
                  <SidebarItems {...{ toggleMobileSidebar: onSidebarClose }} />
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Sidebar;
