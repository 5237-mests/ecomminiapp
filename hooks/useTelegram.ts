import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useTelegram = () => {
  const router = useRouter();

  WebApp.enableClosingConfirmation();
  useEffect(() => {
    if (typeof window !== "undefined") {
      WebApp.BackButton.show();

      const back = () => {
        router.back();
      };

      WebApp.BackButton.onClick(back);

      return () => {
        WebApp.BackButton.offClick(back); 
      };
    }
  }, [router]);
};

export default useTelegram;
