'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import img from '@/assets/banner.webp';
import axios from 'axios';
import { retrieveLaunchParams } from '@telegram-apps/sdk';

export default function Page() {
  useEffect(() => {
    const { initDataRaw, initData } = retrieveLaunchParams();

    axios
      .post('/api/store-init-data', { initDataRaw, initData })
      .then((response) => {
        console.log(response.data.message);
      })
      .catch((error) => {
        console.error('Error storing init data:', error);
      });
  }, []);

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
