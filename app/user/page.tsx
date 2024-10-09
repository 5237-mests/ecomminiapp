"use client";

import WebApp from "@twa-dev/sdk";
import { useState, useEffect } from "react";

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
};

export default function Page() {
  const [userData, setUserData] = useState<UserData | null>(null);

  // fetch user data from telegram api
  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }
  }, []);

  return (
    <div className="m-10">
      <h1 className="text-xl font-bold">Profile Details.</h1> 
      <hr />

       {userData && (
        <div>
         <p>
            Name: {userData.first_name} {userData.last_name}
          </p>
          <p>UserName: {userData.username}</p>
          <p>Language: {userData.language_code}</p>
        </div>
      )}
    </div>
  );

};
