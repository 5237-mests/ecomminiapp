"use client";
import Image from "next/image";
import img from "@/assets/banner.webp";
// import useTelegram from "@/hooks/useTelegram";

export default function Page() {
// useTelegram();
  return (
    <div>
      <main>
        {/* <ModeToggle /> */}
        <Image
          className=" bg-gray-200  w-full h-auto object-cover"
          src={img}
          alt="Welcome"
        />
      </main>
    </div>
  );
}
