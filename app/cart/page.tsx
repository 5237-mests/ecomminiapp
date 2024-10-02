"use client";
import { FaShoppingCart, FaPlus, FaMinus, FaHeart } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../../context/CartContext";
import { Product } from "../../types/types";
import data from "../../assets/data.json";

const CartPage: React.FC = () => {
  const { cartItems, addItem, removeItem} = useCart();
  const products: Product[] = data.products;

  // Get only the products that are in the cart
  const cartProductItems = products.filter(
    (product) => cartItems[product.product_id]
  );

  // Calculate total price of the cart
  const totalPrice = cartProductItems.reduce(
    (total, product) =>
      total + product.price * (cartItems[product.product_id] || 0),
    0
  );

  return (
    <div>
      <div className="p-4 bg-gray-100 flex w-full justify-between fixed top-0 mb-4">
        <h1 className="text-2xl font-bold">Cart</h1>

        {cartProductItems.length > 0 && (
          <span
//          onClick={clearCart} 
            className="cursor-pointer text-red-500 font-bold text-center border rounded-3xl p-2"
          >
            Clear cart
          </span>
        )}
      </div>

      {/* If cart is empty */}
      {cartProductItems.length === 0 ? (
        <div className="flex flex-col gap-4 items-center pt-20">
          <FaShoppingCart className="text-8xl border-4 p-5 text-sky-500 rounded-full" />
          <h2 className="text-2xl font-bold">Your cart is empty</h2>
          <p className="text-sky-500">Add product to cart</p>

          <Link href="/catalog">
            <button
              type="button"
              className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-3xl"
            >
              Continue shopping
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6 pt-20 border-t border-gray-300">
          {cartProductItems.map((product) => (
            <div
              key={product.product_id}
              className="flex items-center gap-4 p-4 border-b"
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
                <FaHeart className="text-sky-500" />
              </div>
              <div className="flex items-center gap-2">
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
            </div>
          ))}
          <div>
            <h2 className="font-bold">
              Unique Products in cart: {cartProductItems.length}
            </h2>
            <h2 className="text-2xl font-bold">
              Total: ${totalPrice.toFixed(2)}
            </h2>
          </div>
          <div className="flex justify-center">
            <Link href="/checkout">
              <button
                type="button"
                className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-3xl"
              >
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
