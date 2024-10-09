"use client";
import { useEffect } from "react";
import data from "../../assets/data.json";
import { Category } from "../../types/types";
import Link from "next/link";
import Image from "next/image";
import WebApp from "@twa-dev/sdk";

const page: React.FC = () => {
  const categories: Category[] = data.categories;

  useEffect(() => {
    // Hide the back button only on the client side
    WebApp.BackButton.hide();
  }, []);

  return (
    <div>
      <h1 className="bg-gray-100 w-full p-4 text-2xl font-bold mb-4 fixed top-0">
        Catalog
      </h1>
      <div className="grid grid-cols-2 gap-1 p-2 mt-16">
        {categories.map((category: Category) => (
          // console.log(category.img)
          <Link
            key={category.category_id}
            href={`catalog/products/${category.category_id}`}
            className="bg-gray-100 border-3 w-full px-2 py-0 cursor-pointer mb-5"
          >
            <div className="w-full h-[200px] overflow-hidden object-cover bg-white border rounded-lg">
              <h2 className="p-2 font-bold">{category.name}</h2>
              <Image
                src={category.img}
                alt={category.name}
                className="h-[150px]"
                width="200"
                height="150"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
