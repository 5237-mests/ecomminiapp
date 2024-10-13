"use client";
import { useRouter } from "next/navigation";
import data from "@/assets/data.json";
import { Product } from "@/types/types";
import { useFavorites } from "@/context/FavoriteContext"; // Import the useFavorites hook
import { useCart } from "@/context/CartContext"; // Import the context
import { FaArrowLeft, FaHeart, FaMinus, FaPlus } from "react-icons/fa";
import Image from "next/image";
import WebApp from "@twa-dev/sdk";
import { useEffect } from "react";

interface ProductProps {
  params: {
    productId: string;
  };
}

const Page = ({ params }: ProductProps) => {
  const router = useRouter();
  const back = () => {
    router.back();
  };
  useEffect(() => {
    WebApp.BackButton.show();
  
    const handleBackClick = () => {
      back();
      WebApp.BackButton.offClick(handleBackClick);
    };
  
    WebApp.BackButton.onClick(handleBackClick);
  
    return () => {
      WebApp.BackButton.offClick(handleBackClick);
    };
  });
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { cartItems, addItem, removeItem } = useCart(); 

  const { productId } = params;
  const products: Product[] = data.products;

  if (!productId) {
    return <p>Loading...</p>;
  }

  const product = products.find(
    (prod) => prod.product_id === parseInt(productId)
  );

  if (!product) return <p>Product not found</p>;

  // Check if the product is already a favorite
  const favoriteStatus = isFavorite(product.product_id);

  const handleFavoriteToggle = () => {
    if (favoriteStatus) {
      removeFavorite(product.product_id);
    } else {
      addFavorite(product.product_id);
    }
  };




  return (
    <div>
      <div className="flex justify-between w-full fixed bg-gray-100 p-4 text-2xl font-bold mb-20 left-0">
        <FaArrowLeft
          size={30}
          onClick={() => router.back()} // Use router.back() to go back
          className="bg-white text-black hover:bg-sky-500 font-bold w-20 h-10 py-2 px-4 border rounded-3xl"
        />

        {/* FaHeart icon with click functionality to toggle favorites */}
        <FaHeart
          onClick={handleFavoriteToggle}
          className={`bg-white w-20 h-10 py-2 px-4 border rounded-3xl ${
            favoriteStatus ? "text-sky-500" : "text-gray-500"
          } `}
        />
      </div>

      <div className="pt-20 p-4 w-full">
        <Image
          src={product.img}
          alt={`Image of ${product.name}`}
          width="200"
          height="150"
          className="w-full h-[200px] object-cover border rounded-xl"
        />

        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-gray-500">Description: {product.description}</p>
        <p className="text-sky-500">Price: ${product.price}</p>
        <p className="text-gray-500">
          Availability: {product.available ? "In Stock" : "Out of Stock"}
        </p>
        <div className="flex justify-between px-4 py-2 gap-4 bg-sky-500 fixed bottom-20 w-full left-0">
          <p className="text-white">${product.price}</p>
          {!cartItems[product.product_id] ? (
            <span
              onClick={() => addItem(product.product_id)}
              className="items-center flex bg-white font-small px-4 text-sky-500 h-8 border rounded-3xl"
            >
              Add to cart <b className="font-bold ml-2">+</b>
            </span>
          ) : (
            <div className="flex gap-2 p-1">
              <FaMinus
                size={25}
                onClick={() => removeItem(product.product_id)}
                className="p-1 flex items-center justify-center text-white bg-sky-500 font-bold border rounded-3xl"
              />
              <span className="flex items-center justify-center text-sky-500 bg-white font-bold border rounded-3xl w-10 h-6">
                {cartItems[product.product_id] || 0}
              </span>
              <FaPlus
                size={25}
                onClick={() => addItem(product.product_id)}
                className="p-1 flex items-center justify-center text-white bg-sky-500 font-bold border rounded-3xl"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
