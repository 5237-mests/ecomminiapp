
"use client";
import React from "react";
import { useRouter } from "next/navigation"; 
import data from "../../../../../assets/data.json"; 
import { Product } from "../../../../../types/types"; 
import { FaArrowLeft } from "react-icons/fa";
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
      <div className="flex w-full fixed bg-gray-100 p-4 text-2xl font-bold mb-20 gap-10 left-0">
        <FaArrowLeft
          size={30}
          onClick={() => router.back()} // Use router.back() to go back
          className="bg-white text-black hover:bg-sky-700 font-bold w-20 h-10 py-2 px-4 border rounded-3xl"
        />
        <h1 className="bg-gray-100 text-2xl font-bold mb-4">{product.name}</h1>
      </div>
      <div className="pt-20">
        <Image src={product.img} alt={product.name} width="200" />
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
        <p>Available: {product.available ? "In Stock" : "Out of Stock"}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
