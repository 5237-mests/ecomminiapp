"use client";
import { useEffect } from "react";
import Image from "next/image";
import img from "@/assets/banner.webp";

export default function Page() {
  useEffect(() => {
    const tg = window?.Telegram?.WebApp; 

    if (tg) {
      if (tg.BackButton.isVisible) {
        tg.BackButton.hide();
      }
tg.enableClosingConfirmation();
    }
  }, []); 

  return (
    <div>
      <main>
        {/* <ModeToggle /> */}
        <Image
          className="bg-gray-200 w-full h-auto object-cover"
          src={img}
          alt="Welcome"
        />
      </main>
    </div>
  );
}
