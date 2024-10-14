"use client";
import { useRouter } from "next/navigation";
import data from "@/assets/data.json";
import { Category, Product } from "@/types/types";
import {  FaMinus, FaPlus } from "react-icons/fa";
import Image from "next/image";
import logo from "@/assets/fun shop.png";
import { useCart } from "@/context/CartContext";
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import ThumbsUp from "@/assets/Thumbs Up.png";
import CommentTag from "@/assets/10001.png";

interface ProductsProps {
  params: {
    categoryId: string;
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

     return () => {
       WebApp.BackButton.offClick(handleBackClick);
     };
   });
  const { theme } = useTheme();
  const [likedProducts, setLikedProducts] = useState<{
    [key: number]: boolean;
  }>({});
  const [isAnimating, setIsAnimating] = useState<{ [key: number]: boolean }>(
    {}
  );
  const [likeCounts, setLikeCounts] = useState<{ [key: number]: number }>({});
  const { cartItems, addItem, removeItem } = useCart();
  const { categoryId } = params;
  const categories: Category[] = data.categories;
  const products: Product[] = data.products;

  if (!categoryId || typeof categoryId !== "string") {
    return <p>Loading...</p>;
  }

  const category = categories.find(
    (cat) => cat.category_id === parseInt(categoryId)
  );
  if (!category) return <p>Category not found</p>;

  const filteredProducts = products.filter(
    (prod) => prod.category_id === parseInt(categoryId)
  );

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

    // Start animation
    setIsAnimating((prevState) => ({ ...prevState, [productId]: true }));

    // Stop animation after 2 seconds
    setTimeout(() => {
      setIsAnimating((prevState) => ({ ...prevState, [productId]: false }));
    }, 1100);
  };
  return (
    <div className="mb-20" style={{ backgroundColor: theme.secondaryBgColor }}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          zIndex: 9999,
        }}
        className="flex z-10 w-full fixed p-4 gap-8 text-2xl font-bold left-0 mb-20 px-8"
      >
        <Image
          onClick={() => router.push("/")}
          src={logo}
          alt={category.name}
          width="100"
          height="100"
          style={{ color: theme.textColor }}
        />
        <h1 className="text-2xl font-bold">{category.name}</h1>
      </div>

      <div className="p-8 gap-1 pt-20">
        {filteredProducts.map((product: Product) => (
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
                    {likeCounts[product.product_id] || 0}
                  </p>

                  <div onClick={() => handleLikeClick(product.product_id)}>
                    <Image
                      src={
                        isAnimating[product.product_id]
                          ? "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/People/Thumbs%20Up.webp"
                          : ThumbsUp // Use your static image here
                      }
                      alt="Thumbs Up"
                      width={25}
                      height={25}
                    />
                  </div>
                </span>
                <Image src={CommentTag} alt="Comment Tag" width={25} height={25}/>
                {/* <CommentTag className="text-teal-500" /> */}
              </span>
              <div>
                {!cartItems[product.product_id] ? (
                  <FaPlus
                    size={25}
                    onClick={() => addItem(product.product_id)}
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
                      onClick={() => removeItem(product.product_id)}
                      className="p-1 flex items-center justify-center font-bold  rounded-3xl"
                      style={{
                        backgroundColor: theme.secondaryBgColor,
                        color: theme.accentTextColor,
                      }}
                    />
                    <span
                      className="flex items-center justify-center font-bold  rounded-3xl w-10 h-6"
                      style={{
                        backgroundColor: theme.buttonColor,
                        color: theme.buttonTextColor,
                      }}
                    >
                      {cartItems[product.product_id] || 0}
                    </span>
                    <FaPlus
                      size={25}
                      onClick={() => addItem(product.product_id)}
                      className="p-1 flex items-center justify-center font-bold  rounded-3xl"
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
              <h2 style={{ color: theme.textColor }} className="font-bold">{product.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
