"use client";
import React, { useState, useEffect } from "react";
import { Product } from "@/types/types";
import { fetchProduct, handleDeleteProduct } from "@/controller/controller";
import Loading from "@/components/Loading/page";
import Image from "next/image";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
// import { handleDeleteProduct } from "@/controller/controller";

interface Props {
  params: {
    productId: number;
  };
}

const Page = ({ params }: Props) => {
  const { productId } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
const [deleteStatus, setDeleteStatus] = useState<boolean | null>(null);
// const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
const router = useRouter();
  useEffect(() => {
    const getProduct = async () => {
      try {
        const productData = await fetchProduct(productId);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [productId]);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!product) {
    return <p>Product not found.</p>;
  }

  const {
    name,
    description,
    price,
    available,
    category_id,
    img,
    createdAt,
    updatedAt,
  } = product;
  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  }

  const handleDelete = async (productId: number) => {
    // setDeleteLoading(true);
    const status = await handleDeleteProduct(productId); 
    setDeleteStatus(status);
    console.log(status); 
if (status) {
  // setDeleteLoading(false);
}
    if (status) {
      setTimeout(() => {
        router.push("/admin/product");
      }, 3000);
    }
   

  };
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Details</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8">
        <div className="w-full space-y-4">
          {/* Main Product Image */}
          <div className="flex items-center justify-center">
            <Image
              src={img}
              alt="Product Image"
              width={500}
              height={500}
              className="rounded-lg w-auto shadow-lg h-[500px]"
            />
          </div>

          {/* Related Images Grid with Edit and Delete Options */}
          <div className="grid grid-cols-3 gap-4">
            {[img, img, img].map((imageSrc, index) => (
              <div key={index} className="relative group">
                <Image
                  src={imageSrc}
                  alt={`Related Product Image ${index + 1}`}
                  width={150}
                  height={150}
                  className="rounded-lg object-cover w-full h-auto shadow"
                />
                <div className="absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <button className="flex items-center px-2 py-1 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <IconEdit size={14} />
                  </button>
                  <button className="flex items-center px-2 py-1 bg-orange-600 text-white font-semibold rounded-lg shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                    <IconTrash size={14} />
                  </button>
                  <p>{deleteStatus}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons for Main Product */}
          <div className="flex space-x-4 mt-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              <IconEdit size={18} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleDelete(productId)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <IconTrash size={18} />
              <span>Delete</span>
            </button>
              <p>{deleteStatus && <p>Product deleted successfully!</p>}</p>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="space-y-4 mt-8">
          <div className="grid grid-cols-2 gap-y-4 text-lg">
            <p className="font-semibold text-gray-700">Product:</p>
            <p className="text-gray-600">{name}</p>

            <p className="font-semibold text-gray-700">Price:</p>
            <p className="text-gray-600">${price}</p>

            <p className="font-semibold text-gray-700">Category:</p>
            <p className="text-gray-600">{category_id}</p>

            <p className="font-semibold text-gray-700">Availability:</p>
            <p
              className={`font-medium ${
                available ? "text-green-500" : "text-red-500"
              }`}
            >
              {available ? "Available" : "Not Available"}
            </p>

            <p className="font-semibold text-gray-700">Created At:</p>
            <p className="text-gray-600">{formatDate(createdAt ?? "")}</p>

            <p className="font-semibold text-gray-700">Updated At:</p>
            <p className="text-gray-600">{formatDate(updatedAt ?? "")}</p>
          </div>

          {/* Description Section */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Description:
            </p>
            <p className="text-gray-600 text-md">{description}</p>
          </div>
        </div>
      </section>

      {/* Comments Section */}
      <div className="pt-4 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Comments</h2>
        {/* Add comments component or display here */}
      </div>
    </div>
  );
};

export default Page;
