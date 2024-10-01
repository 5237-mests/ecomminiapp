"use client";

import { FaHeart } from "react-icons/fa";
import { useRouter } from "next/navigation";

const Page = () => {
  const navigate = useRouter();

  return (
    <div className="flex flex-col items-center mt-20 min-h-screen bg-gray-100">
      <h1 className=" bg-gray-100 w-full p-4 text-2xl font-bold mb-4 fixed top-0 ">
        Favorites
      </h1>

      {/* if cart is empty */}
      <div className="flex flex-col gap-4 items-center pt-20">
        <FaHeart className="text-8xl border-4 p-5 text-sky-500 rounded-full" />
        <h2 className="text-2xl font-bold">Favorites is empty</h2>
        <p className="color-sky-500">
          You can add items to favorites from catalog
        </p>
        {/* on click navigate to /catalog */}
        <button
          type="button"
          onClick={() => {
            navigate.push("/catalog");
          }}
          className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-3xl"
        >
          Go to catalog
        </button>
      </div>
    </div>
  );
};

export default Page;
