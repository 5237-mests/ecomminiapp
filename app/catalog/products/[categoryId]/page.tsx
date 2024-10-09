"use client";
import { useRouter } from "next/navigation";
import data from "@/assets/data.json";
import { Category, Product } from "@/types/types";
import {
  FaArrowLeft,
  FaCommentDots,
  FaMinus,
  FaPlus,
  FaRegThumbsUp,

} from "react-icons/fa";
import Image from "next/image";
import { useCart } from "@/context/CartContext"; // Import the context
import WebApp from "@twa-dev/sdk";

interface ProductsProps {
  params: {
    categoryId: string;
  };
}

const ProductsPage: React.FC<ProductsProps> = ({ params }) => {
  const { cartItems, addItem, removeItem } = useCart();
  const { categoryId } = params;
  const router = useRouter();
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

  // const lickProduct = (product: Product) => {
    
  // };
  
  WebApp.BackButton.show();

  return (
    <div className="mb-20">
      <div className="flex z-10 w-full fixed bg-gray-100 p-4 text-2xl font-bold gap-10 left-0 mb-20">
        <FaArrowLeft
          size={30}
          onClick={() => router.back()}
          className="bg-white text-black hover:bg-sky-700 font-bold w-20 h-10 py-2 px-4 border rounded-3xl"
        />
        <h1 className="bg-gray-100 text-2xl font-bold ">{category.name}</h1>
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

      <div className=" p-4 gap-1 pt-20">
        {filteredProducts.map((product: Product) => (
          <div className="border rounded-lg mb-4" key={product.product_id}>
            <div
              onClick={() =>
                router.push(`/catalog/products/detail/${product.product_id}`)
              }
              className="mx-auto mt-1 mb-4 w-[98%]  h-[400px] overflow-hidden object-cover bg-white border rounded-lg"
            >
              <Image
                src={product.img}
                alt={product.name}
                className="h-[350px] w-full object-cover"
                width="100"
                height="150"
              />
            </div>
            <div className="flex justify-between mx-6 mr-12">
              <span className="flex gap-8 ">
                <span className="flex ">
                  <p className="relative z-0 right-1 top-px bg-teal-500 text-white rounded-l w-5 h-4 flex justify-center items-center text-xs">
                    3
                  </p>
                  <FaRegThumbsUp 
                  // onClick={()=>lickProduct(product.product_id)}
                   className="text-teal-500" />
                </span>
                <FaCommentDots className="text-teal-500" />
              </span>
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
            <div className="flex justify-start gap-16 mx-6 p-2">
              <div>
                <p className="text-sky-500">Price: ${product.price}</p>
              </div>
              <h2 className="font-bold">{product.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
