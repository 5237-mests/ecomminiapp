'use client';
import WebApp from '@twa-dev/sdk';
import { useEffect } from 'react';

const useTelegram = () => {
  useEffect(() => {
    WebApp.ready();
    WebApp.enableClosingConfirmation();
    WebApp.BackButton.hide();
  });
};

export default useTelegram;
