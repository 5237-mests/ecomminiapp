"use client";
// import WebApp from "@twa-dev/sdk";
// import { useState, useEffect } from "react";
// import { ModeToggle } from "@/components/header";
import Image from "next/image";
import img from "@/assets/banner.webp";
// import WebApp from "@twa-dev/sdk";
// import { useEffect } from "react";
// import WebApp from "@twa-dev/sdk";

// interface UserData {
//   id: number;
//   first_name: string;
//   last_name: string;
//   username: string;
//   language: string;
//   isPremium: boolean;
// }

export default function Page() {
  // useEffect(() => {
  //   // Hide the back button only on the client side
  //   WebApp.BackButton.hide();
  // }, []);

  // const [userData, setUserData] = useState<UserData | null>(null);

  //fetch user data from telegram api
  // useEffect(() => {
  //   if (WebApp.initDataUnsafe.user) {
  //     setUserData(WebApp.initDataUnsafe.user as UserData);
  //   }
  // }, []);
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
      {/* {userData && (
        <div>
          <p>
            {userData.first_name} {userData.last_name}
          </p>
          <p>{userData.username}</p>
          <p>{userData.language}</p>
          <p>{userData.isPremium ? "Premium" : "Not Premium"}</p>
        </div>
      )}
      <h1 className="text-3xl font-bold">MAIN PAGE/ HOME PAGE</h1> */}
    </div>
  );
}
