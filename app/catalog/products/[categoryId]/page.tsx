"use client";
import { useRouter } from "next/navigation";
import data from "@/assets/data.json";
import { Category, Product } from "@/types/types";
import {
  // FaArrowLeft,
  FaCommentDots,
  FaMinus,
  FaPlus,
  FaRegThumbsUp,
} from "react-icons/fa";
import Image from "next/image";
import logo from "@/assets/fun shop.png";
import { useCart } from "@/context/CartContext"; // Import the context
import WebApp from "@twa-dev/sdk";
import { useEffect, useState } from "react";

interface ProductsProps {
  params: {
    categoryId: string;
  };
}

const Page = ({ params }: ProductsProps) => {
  const [theme, setTheme] = useState({
    bgColor: "#fff",//black
    textColor: "#000",//white
    hintColor: "#999",//grey
    buttonColor: "#0088cc",//blue
    buttonTextColor: "#fff",//black
    secondaryBgColor: "#f4f4f5",//light grey
    sectionBgColor: "#ffffff",//white
    accentTextColor : "#3390ec",//blue
  });

  console.log(Telegram.WebApp.themeParams);
  const back = () => {
    router.back();
  };

  useEffect(() => {
    const tg = window?.Telegram?.WebApp;
    if (tg) {
      const {
        bg_color,
        text_color,
        hint_color,
        button_color,
        button_text_color,
        secondary_bg_color,
        section_bg_color,
        accent_text_color,
      } = tg.themeParams;
      setTheme({
        bgColor: bg_color || "#fff",
        textColor: text_color || "#000",
        hintColor: hint_color || "#999",
        buttonColor: button_color || "#0088cc",
        buttonTextColor: button_text_color || "#fff",
        secondaryBgColor: secondary_bg_color || "#f4f4f5",
        sectionBgColor: section_bg_color || "#ffffff",
        accentTextColor : accent_text_color || "#3390ec",
      });
    }
    WebApp.BackButton.show();

    const handleBackClick = () => {
      back();
      WebApp.BackButton.offClick(handleBackClick);
    };

    WebApp.BackButton.onClick(handleBackClick);

    return () => {
      WebApp.BackButton.offClick(handleBackClick);
    };
  }, []);

  const router = useRouter();
  const { cartItems, addItem, removeItem } = useCart();
  const { categoryId } = params;
  const categories: Category[] = data.categories;
  const products: Product[] = data.products;
  //  const [isLiked, setIsLiked] = React.useState(false);

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
        className="flex z-10 w-full fixed p-4 gap-8 text-2xl font-bold left-0 mb-20 px-8 "
      >
        {/* <FaArrowLeft
          size={30}
          onClick={() => back()}
          className="bg-white text-black hover:bg-sky-700 font-bold w-20 h-10 py-2 px-4 border rounded-3xl"
        /> */}
        <Image
          onClick={() => router.push("/")}
          src={logo}
          alt={category.name}
          width="100"
          height="100"
          style={{
            color: theme.textColor,
          }}
        />
        <h1
          className=" text-2xl font-bold "
        >
          {category.name}
        </h1>
      </div>

      {/* <div className="grid grid-cols-2 p-4 gap-1 pt-20">
        {filteredProducts.map((product: Product) => (
          <div key={product.product_id}>
            <div
              onClick={() =>
                router.push(`/catalog/products/detail/${product.product_id}`)
              }
              className="mb-4 w-full h-[150px] overflow-hidden object-cover bg-white border rounded-lg"
            >
              <Image
                src={product.img}
                alt={product.name}
                style={{ width: "100%", height: "auto" }}
                width="200"
                height="150"
              />
            </div>
            <div className="flex justify-between mx-6">
              <span className="flex ">
                <p className="relative z-10 right-1 top-px bg-teal-500 text-white rounded-l w-5 h-4 flex justify-center items-center text-xs">
                  3
                </p>
                <FaRegThumbsUp className="text-teal-500" />
              </span>
              <FaCommentDots className="text-teal-500" />
            </div>
            <p className="text-sky-500">Price: ${product.price}</p>
            <h2>{product.name}</h2>
            <div>
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
          </div>
        ))}
      </div> */}

      <div className=" p-8 gap-1 pt-20">
        {filteredProducts.map((product: Product) => (
          // set border shadow
          <div
            className="border rounded-lg mb-4 shadow-xl"
            style={{ backgroundColor: theme.sectionBgColor }}
            key={product.product_id}
          >
            <div
              onClick={() =>
                router.push(`/catalog/products/detail/${product.product_id}`)
              }
              className="mx-auto mt-3 mb-4 w-[90%]  h-[250px] overflow-hidden object-cover border rounded-lg"
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
              <span className="flex gap-8 ">
                <span className="flex ">
                  <p
                    className="relative z-0 right-1 top-px bg-teal-500 rounded-l w-5 h-4 flex justify-center items-center text-xs"
                    style={{ color: theme.buttonTextColor }}
                  >
                    3
                  </p>
                  <FaRegThumbsUp
                    // onClick={()=>lickProduct(product.product_id)}
                    className="text-teal-500"
                  />
                </span>
                <FaCommentDots className="text-teal-500" />
              </span>
              <div>
                {!cartItems[product.product_id] ? (
                  <FaPlus
                    size={25}
                    onClick={() => addItem(product.product_id)}
                    className="p-1 flex items-center justify-center font-bold border rounded-3xl"
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
                      className="p-1 flex items-center justify-center font-bold border rounded-3xl"
                      style={{
                        backgroundColor: theme.secondaryBgColor,
                        color: theme.accentTextColor,
                      }}
                    />
                    <span
                      className="flex items-center justify-center font-bold border rounded-3xl w-10 h-6"
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
                      className="p-1 flex items-center justify-center font-bold border rounded-3xl"
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
              <h2 className="font-bold">{product.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
