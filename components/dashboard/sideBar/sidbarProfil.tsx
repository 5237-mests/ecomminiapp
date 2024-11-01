import Image from 'next/image';
import auth from '@/assets/auth.jpg';
import cart from './cart.jpg';

export const SidebarProfile = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${cart.src})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      className="w-full h-32 relative items-center justify-center text-white font-bold text-xs cursor-pointer"
    >
      <Image
        className="rounded-full w-14 h-14 absolute top-10 left-2 border-2"
        src={auth}
        alt="Profile Picture"
        width={200}
        height={200}
      />
      <div className="w-full px-4 h-6 bg-black absolute bottom-0 bg-opacity-50 flex items-center text-xs">
        <p>Admin</p>
      </div>
    </div>
  );
};
