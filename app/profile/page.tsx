'use client';
import {
  FaUser,
  FaChevronRight,
  FaFirstOrder,
  FaLocationArrow,
  FaSearchLocation,
  FaQuestion,
  FaMoon,
  FaLanguage,
  FaExclamation,
} from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const { initData } = retrieveLaunchParams();
    const userId = initData?.user?.id;
    setFirstName(initData?.user?.firstName || null);

    axios
      .post('/api/get-profile-photo', { userId })
      .then((response) => {
        setPhotoUrl(response.data.photoUrl);
      })
      .catch((error) => {
        console.error('Error fetching profile photo:', error);
      });
  }, []);

  useEffect(() => {
    const tg = window?.Telegram?.WebApp;
    if (tg) {
      if (!tg.BackButton.isVisible) {
        tg.BackButton.show();
      }
      tg.BackButton.onClick(() => router.push('/'));

      return () => {
        tg.BackButton.offClick(() => router.push('/'));
      };
    }
  }, [router]);

  return (
    <div className="mt-10 mb-20">
      <h1 className="bg-gray-100 w-full p-4 text-2xl font-bold mb-4 fixed top-0">
        Your Profile
      </h1>

      {/* User Profile Card */}
      <div className="mx-4 mb-3 flex items-center justify-between bg-white shadow-md rounded-xl p-4 mt-20">
        <span className="flex items-center space-x-2">
          {photoUrl ? (
            <Image
              src={photoUrl || 'https://via.placeholder.com/150'}
              alt="Profile Photo"
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <FaUser className="text-2xl" />
          )}
          <span>
            <p>{firstName}</p>
            <h2>Your Profile</h2>
          </span>
        </span>
        <Link href="/user">
          <FaChevronRight className="text-2xl" />
        </Link>
      </div>

      {/* Orders and Addresses Section */}
      <div className="mx-4 mb-3 bg-white shadow-md rounded-xl">
        <div className="flex items-center justify-between p-4">
          <span className="flex items-center space-x-2">
            <FaFirstOrder className="text-2xl" />
            <h2>Orders</h2>
          </span>
          <FaChevronRight className="text-2xl" />
        </div>
        <div className="flex items-center justify-between p-4">
          <span className="flex items-center space-x-2">
            <FaSearchLocation className="text-2xl" />
            <h2>Area</h2>
          </span>
          <FaChevronRight className="text-2xl" />
        </div>
        <div className="flex items-center justify-between p-4">
          <span className="flex items-center space-x-2">
            <FaLocationArrow className="text-2xl" />
            <h2>Delivery Addresses</h2>
          </span>
          <FaChevronRight className="text-2xl" />
        </div>
      </div>

      {/* Support and Settings Section */}
      <div className="mx-4 mb-3 bg-white shadow-md rounded-xl">
        <div className="flex items-center justify-between p-4">
          <span className="flex items-center space-x-2">
            <FaQuestion className="text-2xl" />
            <h2>Support</h2>
          </span>
          <FaChevronRight className="text-2xl" />
        </div>
        <div className="flex items-center justify-between p-4">
          <span className="flex items-center space-x-2">
            <FaMoon className="text-2xl" />
            <span>
              <p>Theme</p>
              <h2>Your Profile</h2>
            </span>
          </span>
          <FaChevronRight className="text-2xl" />
        </div>
        <div className="flex items-center justify-between p-4">
          <span className="flex items-center space-x-2">
            <FaLanguage className="text-2xl" />
            <span>
              <p>Language</p>
              <h2>Your Profile</h2>
            </span>
          </span>
          <FaChevronRight className="text-2xl" />
        </div>
      </div>

      {/* About Section */}
      <div className="mx-4 mb-3 flex items-center justify-between bg-white shadow-md rounded-xl p-6">
        <span className="flex items-center space-x-2">
          <FaExclamation className="text-2xl" />
          <h2>About</h2>
        </span>
        <FaChevronRight className="text-2xl" />
      </div>
    </div>
  );
};

export default Page;
