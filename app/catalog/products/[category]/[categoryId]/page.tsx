'use client';
import { useRouter } from 'next/navigation';
// import data from '@/assets/data.json';
import { Product } from '@/types/types';
import { FaMinus, FaPlus } from 'react-icons/fa';
import Image from 'next/image';
import logo from '@/assets/fun shop.png';
import { useCart } from '@/context/CartContext';
import WebApp from '@twa-dev/sdk';
import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import ThumbsUp from '@/assets/Thumbs Up.png';
import CommentTag from '@/assets/10001.png';
import { fetchProductByCategory } from '@/controller/ProductController';
import { BeatLoader } from 'react-spinners';

interface ProductsProps {
  params: {
    categoryId: number;
    category: string;
  };
}

const Page = ({ params }: ProductsProps) => {
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
    fetchProductByCategory(categoryId.toString()).then((data) => {
      setProducts(data);
    });

    return () => {
      WebApp.BackButton.offClick(handleBackClick);
    };
  }, [params]);
  const { theme } = useTheme();
  const [likedProducts, setLikedProducts] = useState<{
    [key: number]: boolean;
  }>({});
  const [isAnimating, setIsAnimating] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [likeCounts, setLikeCounts] = useState<{ [key: number]: number }>({});
  const [products, setProducts] = useState<Product[]>([]);
  const { cartItems, addItem, isCartOpen, removeItem, loading, itemQuantity } =
    useCart();
  const { categoryId, category } = params;

  if (!categoryId || typeof categoryId !== 'string') {
    return <p>Loading...</p>;
  }

  const handleLikeClick = (productId: number) => {
    setLikedProducts((prevState) => ({
      ...prevState,
      [productId]: !prevState[productId],
    }));

    // Update the like count based on the current state
    setLikeCounts((prevCounts) => ({
      ...prevCounts,
      [productId]: prevCounts[productId]
        ? prevCounts[productId] + (likedProducts[productId] ? -1 : 1)
        : 1,
    }));
    setIsAnimating((prevState) => ({ ...prevState, [productId]: true }));
    setTimeout(() => {
      setIsAnimating((prevState) => ({ ...prevState, [productId]: false }));
    }, 1100);
  };
  console.log('cartItems', cartItems);
  return (
    <div className="mb-20" style={{ backgroundColor: theme.secondaryBgColor }}>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          zIndex: 9999,
        }}
        className="flex z-10 w-full fixed p-4 gap-8 text-2xl font-bold left-0 mb-20 px-8"
      >
        <Image
          onClick={() => router.push('/')}
          src={logo}
          alt={'logo'}
          width="100"
          height="100"
          style={{ color: theme.textColor }}
        />
        <h1 className="text-2xl font-bold">{category}</h1>
      </div>

      <div className="p-8 gap-1 pt-20">
        {products?.map((product) => (
          <div
            className="border rounded-lg mb-4 shadow-xl"
            style={{ backgroundColor: theme.sectionBgColor }}
            key={product.product_id}
          >
            <div
              onClick={() =>
                router.push(`/catalog/products/detail/${product.product_id}`)
              }
              className="mx-auto mt-3 mb-4 w-[90%] h-[250px] overflow-hidden object-cover  rounded-lg"
              style={{ backgroundColor: theme.bgColor }}
            >
              <Image
                src={product.img}
                alt={product.name}
                className="h-auto w-full object-cover"
                width="100"
                height="150"
              />
            </div>
            <div className="flex justify-between mx-6 mr-12">
              <span className="flex gap-8">
                <span className="flex items-center">
                  <p
                    className="relative z-0 right-1 top-px rounded-l w-5 h-4 flex justify-center items-center text-xs"
                    style={{
                      color: theme.buttonTextColor,
                      backgroundColor: theme.buttonColor,
                    }}
                  >
                    {likeCounts[product.product_id ?? 0]}
                  </p>

                  <div onClick={() => handleLikeClick(product.product_id ?? 0)}>
                    <Image
                      src={
                        isAnimating[product.product_id ?? 0]
                          ? 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/People/Thumbs%20Up.webp'
                          : ThumbsUp // Use your static image here
                      }
                      alt="Thumbs Up"
                      width={25}
                      height={25}
                    />
                  </div>
                </span>
                <Image
                  src={CommentTag}
                  alt="Comment Tag"
                  width={25}
                  height={25}
                />
              </span>
              <div>
                {itemQuantity(product.product_id ?? 0) == 0 ? (
                  <FaPlus
                    size={25}
                    onClick={() =>
                      product.product_id !== null && addItem(product.product_id)
                    }
                    className="p-1 flex items-center justify-center font-bold  rounded-3xl"
                    style={{
                      backgroundColor: theme.buttonColor,
                      color: theme.buttonTextColor,
                    }}
                  />
                ) : (
                  <div className="flex gap-2">
                    <FaMinus
                      size={25}
                      onClick={() =>
                        product.product_id !== null &&
                        removeItem(product.product_id)
                      }
                      className="p-1 flex items-center justify-center font-bold cursor-pointer rounded-3xl"
                      style={{
                        backgroundColor: theme.secondaryBgColor,
                        color: theme.accentTextColor,
                      }}
                    />
                    <span
                      className="flex items-center justify-center font-bold cursor-pointer rounded-3xl w-10 h-6"
                      style={{
                        backgroundColor: theme.buttonColor,
                        color: theme.buttonTextColor,
                      }}
                    >
                      {loading[product.product_id ?? 0] ? (
                        <BeatLoader color="#14eca5" size={8} />
                      ) : (
                        <span>
                          {!isCartOpen[product.product_id ?? 0]
                            ? itemQuantity(product.product_id ?? 0)
                            : cartItems[product.product_id ?? 0]}
                        </span>
                      )}
                    </span>
                    <FaPlus
                      size={25}
                      onClick={() =>
                        product.product_id !== null &&
                        addItem(product.product_id)
                      }
                      className="p-1 flex items-center justify-center font-bold cursor-pointer rounded-3xl"
                      style={{
                        backgroundColor: theme.secondaryBgColor,
                        color: theme.accentTextColor,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-start gap-16 mx-6 p-2">
              <div>
                <p style={{ color: theme.accentTextColor }}>
                  Price: ${product.price}
                </p>
              </div>
              <h2 style={{ color: theme.textColor }} className="font-bold">
                {product.name}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
