'use client';
import Image from 'next/image';
import img from '@/assets/banner.webp';
import axios from 'axios';
import { retrieveLaunchParams } from '@telegram-apps/sdk';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loading from '../components/Loading/page';

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkInitData = async () => {
      try {
        const { initDataRaw } = retrieveLaunchParams();
        const initData = localStorage.getItem('initData');
        if (initData || initDataRaw) {
          console.log('initData', initData);
        } else {
          console.log('initData not found');
          router.push('/admin');
          return; // Avoid setting loading state if redirecting
        }
      } catch (error) {
        console.error('Error retrieving launch params:', error);
        router.push('/admin');
        return; // Prevent setting loading state if redirecting due to an error
      }
      setLoading(false); // Set loading to false only if no redirect occurs
    };

    checkInitData();
  }, [router]);

  useEffect(() => {
    const init = () => {
      try {
        const { initDataRaw, initData } = retrieveLaunchParams();

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
      }
    };

    const launch = () => {
      try {
        const tg = window?.Telegram?.WebApp;

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
    init();
  }, []);

  if (loading) {
    return <Loading />;
  }

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
