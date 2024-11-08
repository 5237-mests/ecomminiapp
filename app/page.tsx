'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import img from '@/assets/banner.webp';
import axios from 'axios';
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    const init = () => {
      try {
        const { initDataRaw, initData, platform } = retrieveLaunchParams();

        console.log(
          'Launch Params from miniapp',
          initDataRaw,
          initData,
          platform,
        );
        axios
          .post('/api/store-init-data', { initDataRaw, initData })
          .then((response) => {
            console.log(response.data.message);
          })
          .catch((error) => {
            console.error('Error storing init data:', error);
          });
      } catch (error) {
        console.error('Error Init:', error);
        router.push('/admin');
      }
    };

    init();
  }, []);

  useEffect(() => {
    const launch = () => {
      try {
        const tg = window?.Telegram?.WebApp;
        console.log('TG', tg);
        if (!tg.Telegram) {
          console.log('TG not found');
        }

        if (tg) {
          if (tg.BackButton.isVisible) {
            tg.BackButton.hide();
          }
          tg.enableClosingConfirmation();
        }
      } catch (error) {
        console.error('Error window:', error);
      }
    };

    launch();
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
