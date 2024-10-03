'use client'
import WebApp from "@twa-dev/sdk";
import { useState, useEffect } from "react";
import { ModeToggle } from "@/components/header";
import Link from "next/link";

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  language: string;
  isPremium: boolean;
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null)

  //fetch user data from telegram api
  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, [])
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <ModeToggle />
      </main>

      // render user data if it exists here
      {userData && (
        <div>
          <p>{userData.first_name} {userData.last_name}</p>
          <p>{userData.username}</p>
          <p>{userData.language}</p>
          <p>{userData.isPremium ? "Premium" : "Not Premium"}</p>
        </div>
      )}

      <Link href="/user">Go to User Page</Link>
    </div>
  );
}
