"use client";

import WebApp from "@twa-dev/sdk";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  const [allUser, setAllUser] = useState([{} as UserData]);

  const router = useRouter();
  const back = () => {
    router.back();
  };
  
  useEffect(() => {
    if (WebApp.initDataUnsafe.user) {
      setPhoto(WebApp.initDataUnsafe?.user?.photo_url as string);
      console.log("effect", WebApp.initDataUnsafe.user.username);
      setUserData(WebApp.initDataUnsafe.user as UserData);
    }

    WebApp.BackButton.show();
  
    const handleBackClick = () => {
      back();
      WebApp.BackButton.offClick(handleBackClick);
    };
  
    WebApp.BackButton.onClick(handleBackClick);
  
    return () => {
      WebApp.BackButton.offClick(handleBackClick);
    };
  }, []);

  //get all user
  useEffect(() => {
    const getAllUser = async () => {
      try {
        const response = await fetch("/api/user");
        const data = await response.json();
        setAllUser(data);
      } catch (error) {
        console.log("Error:", error);
      }
    };
    getAllUser();
  }, [])

  // delete user
  const deleteUser = async (id: number) => {
    try {
      const response = await fetch(`/api/user?user_id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
    } catch (error) {
      console.log("Error:", error);
    }

    const updatedUser = allUser.filter((user: UserData) => user.id !== id);
    setAllUser(updatedUser);
  };

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
          <Image src={userData.photo_url} alt="User profile" />
        </div>
      )}

      {/* render all user */}
      <div>
        <h1 className="text-xl font-bold">All Users</h1>
        <ul>
          {allUser.map((user: UserData) => (
            <li key={user.id}>{user.username} - {user.first_name} <button className="text-red-500" onClick={() => deleteUser(user.id)}>Delete</button></li>
          ))}
        </ul>
      </div>
    </div>
  );
}
