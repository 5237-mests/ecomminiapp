"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

import {
  FaHeart,
  FaSearch,
  FaThLarge,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa"; // Importing icons

const Navbar: React.FC = () => {
  const pathname = usePathname(); // Get current path
  const { cartItems } = useCart();

  // Function to apply active class based on current route
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="flex fixed bottom-0 w-full justify-around items-center border-t border-gray-300 bg-white py-2">
      <Link
        href="/favorites"
        className={
          isActive("/favorites")
            ? "text-sky-500 flex flex-col items-center rounded-md p-2 w-[60px] "
            : "text-gray-500 flex flex-col items-center p-2 hover:bg-sky-100 hover:text-sky-500 rounded-md w-[60px]"
        }
      >
        <FaHeart className="text-2xl" />
        <span className="text-xs mt-1">Favorites</span>
      </Link>

      <Link
        href="/search"
        className={
          isActive("/search")
            ? "text-sky-500 flex flex-col items-center rounded-md p-2 w-[60px]"
            : "text-gray-500 flex flex-col items-center p-2 hover:bg-sky-100 hover:text-sky-500 rounded-md w-[60px]"
        }
      >
        <FaSearch className="text-2xl" />
        <span className="text-xs mt-1">Search</span>
      </Link>

      <Link
        href="/catalog"
        className={
          isActive("/catalog")
            ? "text-sky-500 flex flex-col items-center rounded-md p-2 w-[60px]"
            : "text-gray-500 flex flex-col items-center p-2 hover:bg-sky-100 hover:text-sky-500 rounded-md w-[60px]"
        }
      >
        <FaThLarge className="text-2xl" />
        <span className="text-xs mt-1">Catalog</span>
      </Link>

      <Link
        href="/cart"
        className={
          isActive("/cart")
            ? "text-sky-500 flex flex-col items-center relative rounded-md p-2 w-[60px]"
            : "text-gray-500 flex flex-col items-center relative p-2 hover:bg-sky-100 hover:text-sky-500 rounded-md w-[60px]"
        }
      >
        <FaShoppingCart className="text-2xl" />
        <span className="text-xs mt-1">Cart</span>
        {Object.keys(cartItems).length > 0 && (
          <div className="absolute bottom-10 left-8 bg-sky-500 text-white rounded-full w-5 h-5 flex justify-center items-center text-xs">
            {Object.keys(cartItems).length}
          </div>
        )}
      </Link>

      <Link
        href="/profile"
        className={
          isActive("/profile")
            ? "text-sky-500 flex flex-col items-center rounded-md p-2 w-[60px]"
            : "text-gray-500 flex flex-col items-center p-2 hover:bg-sky-100 hover:text-sky-500 rounded-md w-[60px]"
        }
      >
        <FaUser className="text-2xl" />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
};

export default Navbar;
