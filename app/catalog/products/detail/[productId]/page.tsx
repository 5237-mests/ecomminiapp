
"use client";
import React from "react";
import { useRouter } from "next/navigation"; 
import data from "../../../../../assets/data.json"; 
import { Product } from "../../../../../types/types"; 
import { FaArrowLeft, FaHeart } from "react-icons/fa";
import Image from "next/image";

interface ProductProps {
  params: {
    productId: string;
  };
}

const ProductDetail: React.FC<ProductProps> = ({ params }) => {
  const router = useRouter();

  const { productId } = params; 
  const products: Product[] = data.products;

  if (!productId) {
    return <p>Loading...</p>;
  }

  const product = products.find(
    (prod) => prod.product_id === parseInt(productId)
  );

  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <div className="flex justify-between w-full fixed bg-gray-100 p-4 text-2xl font-bold mb-20 left-0">
        <FaArrowLeft
          size={30}
          onClick={() => router.back()} // Use router.back() to go back
          className="bg-white text-black hover:bg-sky-500 font-bold w-20 h-10 py-2 px-4 border rounded-3xl"
        />
        {/* <div className="bg-white text-black hover:bg-sky-500 w-20 h-10 py-2 px-4 border rounded-3xl">
          {product.name}
        </div> */}
        <FaHeart className="bg-white text-gray-500 hover:bg-sky-500 w-20 h-10 py-2 px-4 border rounded-3xl" />
      </div>
      <div className="pt-20 p-4 w-full">
        <Image src={product.img} alt={product.name} width="200" height="150"
        className="w-full h-[200px] object-cover border rounded-xl" />
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <p>Available: {product.available ? "In Stock" : "Out of Stock"}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
