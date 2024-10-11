// src/pages/init-data.tsx
import useTelegramInitData from "@/hooks/useTelegramInitData";

export default function InitData() {
  const initData = useTelegramInitData();
  console.log("test",initData);
  return (
    <div>
      <h1>initData</h1>
      <pre>{JSON.stringify(initData, null, 2)}</pre>
    </div>
  );
}
