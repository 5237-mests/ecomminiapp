'use client';
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaHeart,
  FaRegHeart,
} from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/context/FavoriteContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { fetchcart } from '@/controller/CartController';
import { BeatLoader } from 'react-spinners';

const Page = () => {
  const router = useRouter();
  // const [cart, setCart] = useState<{ product_id: number; quantity: number }[]>(
  //   [],
  // );
  // console.log('cart', cart[0]);
  // // console.log('Full Cart Data:', JSON.stringify(cart[0].prod, null, 2));

  useEffect(() => {
    const tg = window?.Telegram?.WebApp;
    if (tg) {
      if (!tg.BackButton.isVisible) {
        tg.BackButton.show();
      }
      tg.BackButton.onClick(() => router.push('/'));

      return () => {
        tg.BackButton.offClick(() => router.push('/'));
      };
    }
  }, [router]);
  const {
    cartItems,
    addItem,
    removeItem,
    clearCart,
    cartIteemsProducts,
    loading,
    itemQuantity,
    isCartOpen,
    userId,
  } = useCart();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  // const products = data.products;
  console.log('cartIteemsProducts', cartIteemsProducts.length);

  const createOrder = async () => {
    const response = await fetch('/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        deliveryType: 'ontable',
        pickupAddress: '',
        deliveryAddress: '',
      }),
    });
    const data = await response.json();
    console.log('Order created:', data.order.order_id);
    router.push(`/checkout/${data.order.order_id}`);
  };

  // const userId = 'cm2w8sjta00009lg4w2152lwo';
  const totalPrice = cartIteemsProducts.reduce(
    (quantity, item) => quantity + item.product.price * item.quantity,
    0,
  );
  return (
    <div className="mb-20">
      <div className="d-hidden p-4 bg-gray-100 flex w-full justify-between fixed top-0 mb-20">
        <h1 className="text-2xl font-bold">Cart</h1>
        {cartIteemsProducts.length > 0 && (
          <span
            onClick={() => clearCart()} // No argument needed
            className="cursor-pointer text-red-500 font-bold text-center border rounded-3xl p-2"
          >
            Clear cart
          </span>
        )}
      </div>

      {/* If cart is empty */}
      {cartIteemsProducts.length === 0 ? (
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
        <div className="p-4 flex flex-col gap-6 pt-20 border-gray-300">
          {cartIteemsProducts.map((item) => (
            <div
              key={item.product_id}
              className="flex items-center gap-4 p-4 border-t"
            >
              <Image
                src={item.product.img}
                alt={item.product.name}
                width={100}
                height={100}
                className="rounded-lg"
              />
              <div className="flex-grow">
                <h2 className="text-xl font-bold">{item.product.name}</h2>
                <p className="text-sky-500">Price: ${item.product.price}</p>
              </div>
              {/* flex columns */}
              <div className="flex flex-col gap-5 items-center">
                <div className="flex items-center gap-2">
                  <FaMinus
                    size={25}
                    onClick={() => removeItem(item.product_id)}
                    className="p-1 flex items-center justify-center text-sky-500 bg-white font-bold border rounded-3xl"
                  />

                  <span className="flex items-center justify-center text-white bg-sky-500 font-bold border rounded-3xl w-10 h-6">
                    {loading[item.product.product_id] ? (
                      <BeatLoader color="#14eca5" size={8} />
                    ) : !isCartOpen[item.product.product_id ?? 0] ? (
                      itemQuantity(item.product.product_id ?? 0)
                    ) : (
                      cartItems[item.product.product_id ?? 0]
                    )}
                  </span>
                  <FaPlus
                    size={25}
                    onClick={() => addItem(item.product_id)}
                    className="p-1 flex items-center justify-center text-sky-500 bg-white font-bold border rounded-3xl"
                  />
                </div>
                <>
                  {isFavorite(item.product_id) ? (
                    <FaHeart
                      onClick={() => removeFavorite(item.product_id)}
                      className="text-sky-500 cursor-pointer border rounded-3xl p-1 w-8 h-8"
                    />
                  ) : (
                    <FaRegHeart
                      onClick={() => addFavorite(item.product_id)}
                      className="text-gray-500 cursor-pointer border rounded-3xl p-1 w-8 h-8"
                    />
                  )}
                </>
                {/* <FaHeart size={35} className="text-gray-400 border rounded-3xl p-1" /> */}
              </div>
            </div>
          ))}

          {/* // */}

          <div className="relative overflow-x-auto bg-white shadow-lg sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th
                    scope="col"
                    className="py-2 px-4 text-left text-sm font-medium text-gray-500"
                  >
                    Product name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Qty
                  </th>
                  <th>Price per unit</th>
                  <th scope="col" className="px-6 py-3 rounded-e-lg">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartIteemsProducts.map((item) => (
                  <tr className="bg-white border-b">
                    <th
                      scope="row"
                      className="py-2 px-4 text-left text-sm font-medium text-gray-500 "
                    >
                      {item.product.name}
                    </th>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">${item.product.price}</td>
                    <td>${item.product.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="font-semibold text-gray-900 bg-gray-50 w-full">
                <tr className="font-semibold text-gray-900 bg-gray-50 ">
                  <th
                    scope="row"
                    className="py-2 px-4 text-left text-sm font-medium text-gray-500 "
                  >
                    Total
                  </th>
                  <td className="px-6 py-3"></td>
                  <td></td>
                  <td className="px-6 py-3">${totalPrice}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* // */}
          <div className="flex justify-center">
            {/* <Link href={`/checkout/${userId}`}> */}
            <button
              onClick={createOrder}
              type="button"
              className="bg-sky-500 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded-3xl"
            >
              Proceed to Checkout
            </button>
            {/* </Link> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
