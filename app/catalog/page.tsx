'use client';
import { useEffect, useState } from 'react';
// import data from '../../assets/data.json';
import { Category } from '../../types/types';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchCategories } from '@/controller/ProductController';

const Page: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    // setIsLoading(true);
    fetchCategories().then((data) => {
      console.log('data', data);
      setCategories(data);
    });

    // fetchProducts();
  }, []);
  const router = useRouter();

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
  console.log('categories', categories);
  return (
    <div>
      <h1 className="bg-gray-100 w-full p-4 text-2xl font-bold mb-4 fixed top-0">
        Catalog
      </h1>
      <div className="grid grid-cols-2 gap-1 p-2 mt-16 pb-20">
        {categories?.map((category: Category) => (
          <Link
            key={category.id}
            href={`catalog/products/${category.name}/${category.id}`}
            className="bg-gray-100 border-3 w-full px-2 py-0 cursor-pointer mb-5"
          >
            <div className="w-full  overflow-hidden object-cover bg-white border rounded-lg">
              <h2 className="p-2 font-bold">{category.name}</h2>
              {/* <p>{category.id}</p> */}
              <Image
                src={category.img}
                alt={category.name}
                className="w-full h-auto object-cover"
                width={200}
                height={150}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
// declare global {
//   interface Window {
//     Telegram: any;
//   }
// }
