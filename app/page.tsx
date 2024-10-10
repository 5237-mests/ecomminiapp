"use client";
import Image from "next/image";
import img from "@/assets/banner.webp";

export default function Page() {
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
