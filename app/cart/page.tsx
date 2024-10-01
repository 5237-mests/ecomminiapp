import { FaShoppingCart } from "react-icons/fa";
import Link from "next/link";

const page: React.FC = () => {
  return (
    <div className="mt-20">
      <h1 className="bg-gray-100 w-full p-4 text-2xl font-bold mb-4 fixed top-0">
        Cart
      </h1>

      {/* If cart is empty */}
      <div className="flex flex-col gap-4 items-center pt-20">
        <FaShoppingCart className="text-8xl border-4 p-5 text-sky-500 rounded-full" />
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-sky-500">Add product to cart</p>

        {/* Navigate to /catalog */}
        <Link href="/catalog">
          <button
            type="button"
            className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-3xl"
          >
            Continue shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default page;
