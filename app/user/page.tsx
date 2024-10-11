"use client";

import WebApp from "@twa-dev/sdk";
import { useState, useEffect } from "react";
import Image from "next/image";
// import InitData from "@/components/InitData";
// import { initData } from "@telegram-apps/sdk-react";

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
  photo_url: string;
}

export default function Page() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [photo, setPhoto] = useState<string | null>("");

  // fetch user data from telegram api
  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setPhoto(WebApp.initDataUnsafe?.user?.photo_url as string);
      console.log("effect", WebApp.initDataUnsafe.user.username);
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  return (
    <div className="m-10">
      <h1 className="text-xl font-bold">Profile Details</h1>

      {/* <InitData /> */}
      <hr />

      {photo && (
        <Image src={photo} alt="User profile" width={100} height={100} />
      )}

      {userData && (
        <div>
          <p>
            Name: {userData.first_name} {userData.last_name}
          </p>
          <p>Username: {userData.username}</p>
          <p>Language: {userData.language_code}</p>
          <p>Photo URL: {userData.photo_url}</p>
          <img src={userData.photo_url} alt="User profile" />
        </div>
      )}
    </div>
  );
}
