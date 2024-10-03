"use client";

import { FaHeart, FaMinus, FaPlus, FaRegHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/context/FavoriteContext"; // Import the useFavorites hook
import data from "@/assets/data.json"; // Example data
import Image from "next/image";
import { useCart } from "@/context/CartContext";

const Page = () => {
  const router = useRouter();
  // const { isFavorite, favoriteItems } = useFavorites();
  const { addItem, removeItem, cartItems } = useCart();
  const { isFavorite, removeFavorite, clearFavorites } = useFavorites();
  const products = data.products; // Example products from data.json

  // Get the products that are marked as favorite
  const favoriteProductItems = products.filter((product) =>
    isFavorite(product.product_id)
  );

  return (
    <div className="mt-20 p-4">
      <div className="p-4 bg-gray-100 flex w-full justify-between fixed top-0 mb-20">
        <h1 className="text-2xl font-bold">Cart</h1>
        {favoriteProductItems.length > 0 && (
          <span
            onClick={() => clearFavorites()} // No argument needed
            className="cursor-pointer text-red-500 font-bold text-center border rounded-3xl p-2"
          >
            Clear favorites
          </span>
        )}
      </div>

      {/* If favorites list is empty */}
      {favoriteProductItems.length === 0 ? (
        <div className="flex flex-col gap-4 items-center pt-20">
          <FaHeart className="text-8xl border-4 p-5 text-sky-500 rounded-full" />
          <h2 className="text-2xl font-bold">Favorites is empty</h2>
          <p className="text-sky-500">
            You can add items to favorites from the catalog
          </p>
          <button
            type="button"
            onClick={() => {
              router.push("/catalog");
            }}
            className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-3xl"
          >
            Go to catalog
          </button>
        </div>
      ) : (
        <div className=" flex flex-col gap-6 pb-20">
          {favoriteProductItems.map((product) => (
            <div
              key={product.product_id}
              className="flex items-center gap-4 p-4 border-t"
            >
              <Image
                src={product.img}
                alt={product.name}
                width={100}
                height={100}
                className="rounded-lg"
              />
              <div className="flex-grow">
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-sky-500">Price: ${product.price}</p>
              </div>
              {/* flex columns */}
              <div className="flex flex-col gap-5 items-center ">
                <div className="flex items-center gap-2">
                  {!cartItems[product.product_id] ? (
                    <FaPlus
                      size={25}
                      onClick={() => addItem(product.product_id)}
                      className="p-1 flex items-center justify-center text-white bg-sky-500 font-bold border rounded-3xl"
                    />
                  ) : (
                    <div className="flex gap-2">
                      <FaMinus
                        size={25}
                        onClick={() => removeItem(product.product_id)}
                        className="p-1 flex items-center justify-center text-sky-500 bg-white font-bold border rounded-3xl"
                      />
                      <span className="flex items-center justify-center text-white bg-sky-500 font-bold border rounded-3xl w-10 h-6">
                        {cartItems[product.product_id] || 0}
                      </span>
                      <FaPlus
                        size={25}
                        onClick={() => addItem(product.product_id)}
                        className="p-1 flex items-center justify-center text-sky-500 bg-white font-bold border rounded-3xl"
                      />
                    </div>
                  )}
                </div>
                <>
                  {isFavorite(product.product_id) ? (
                    <FaHeart
                      onClick={() => removeFavorite(product.product_id)}
                      className="text-sky-500 cursor-pointer border rounded-3xl p-1 w-8 h-8"
                    />
                  ) : (
                    <FaRegHeart
                      // onClick={() => addFavorite(product.product_id)}
                      className="text-gray-500 cursor-pointer border rounded-3xl p-1 w-8 h-8"
                    />
                  )}
                </>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
