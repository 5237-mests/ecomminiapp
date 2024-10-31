import Image from "next/image";
import React from "react";
import { Category } from "@/types/types";

interface CatalogListProps {
  category: Category;
  filterProductsByCategory: (id: number) => void;
  activeCategory: number | null;
}

const CatalogList: React.FC<CatalogListProps> = ({
  category,
  filterProductsByCategory,
  activeCategory,
}) => {
  return (
    <div className="flex items-center justify-center ">
      <button
        key={category.id}
        onClick={() => filterProductsByCategory(category.id)}
        className={`text-sm text-gray-600 pb-1  bg-gray-100 hover:bg-gray-200 rounded-md items-center flex justify-center ${
          activeCategory === category.id ? "border-b-2 border-blue-500" : ""
        }`}
      >
        <Image
          src={category.img}
          alt={category.name}
          width={120}
          height={120}
          className="w-auto h-10 rounded-full hidden sm:block"
        />
        <p className="text-center w-16">{category.name}</p>
      </button>
    </div>
  );
};

export default CatalogList;
