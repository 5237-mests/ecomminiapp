"use client";

import Image from "next/image";
import React from "react";
import logo from "@/assets/fun shop-black.png";
import auth from "@/assets/auth.jpg";
// import { useState } from "react";
interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const Header = ({ toggleMobileSidebar }: ItemType) => {
  const [isShowLogOut, setIsShowLogout] = React.useState(false);

  return (
    <div>
      <section className="fixed top-0 z-50 bg-blue-400 sm:h-20 h-16 flex justify-between px-8 items-center w-full shadow-lg">
        <Image
          src={logo}
          alt="logo"
          width={900}
          height={900}
          className="sm:h-16 h-10 w-auto"
        />
        <button
          onClick={toggleMobileSidebar}
          data-drawer-target="logo-sidebar"
          data-drawer-toggle="logo-sidebar"
          aria-controls="logo-sidebar"
          type="button"
          className="inline-flex items-center p-2 text-sm text-white rounded-lg lg:hidden  "
        >
          <span className="sr-only">Open sidebar</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clip-rule="evenodd"
              fill-rule="evenodd"
              color="white"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>
        <div className="flex items-center gap-4">
          {isShowLogOut && (
            <button className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
              🔓 Logout
            </button>
          )}

          <Image
            onClick={() => setIsShowLogout(!isShowLogOut)}
            src={auth}
            alt="Picture of the author"
            width={690}
            height={690}
            className="rounded-full sm:h-16 h-10 w-auto cursor-pointer"
          />
        </div>
      </section>
    </div>
  );
};

export default Header;
