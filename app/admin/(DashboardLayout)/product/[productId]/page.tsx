"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { formatDistanceToNow } from "date-fns";
import { Product, Comment } from "@/types/types";
import {
  fetchProduct,
  handleDeleteDetailImg,
  handleDeleteProduct,
  handleUploadProductDetailImg,
} from "@/controller/controller";
import Loading from "@/components/Loading/page";
import Image from "next/image";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface Props {
  params: {
    productId: number;
  };
}

const Page = ({ params }: Props) => {
  const { productId } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [detailImages, setDetailImages] = useState<string[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [comments, setComments] = useState([{} as Comment]);
  const [render, setRender] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getProduct = async () => {
      try {
        const productData = await fetchProduct(productId);
        setProduct(productData);
        setDetailImages(productData.detail_img);
      } catch (error) {
        setError("Failed to load product details.");
        throw new Error("Failed to load product details." + error);
      } finally {
        setLoading(false);
      }
    };
    const getProductComments = async () => {
      try {
        const productComments = await fetch(
          `/api/product/comments/${productId}`
        );
        const data = await productComments.json();
        setComments(data.data);
      } catch (error) {
        setError("Failed to load product comments.");
        throw new Error("Failed to load product comments." + error);
      } finally {
        setRender(!render);
      }
    };
    getProduct();
    getProductComments();
  }, [productId]);

  //sort comments asc
  comments?.sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setImgFile(acceptedFiles[0]);
      setImagePreview(URL.createObjectURL(acceptedFiles[0]));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".png", ".jpeg"] },
  });

  if (loading) return <Loading />;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  const handleDelete = async () => {
    const status = await handleDeleteProduct(productId);
    if (status) {
      setTimeout(() => router.push("/admin/product"), 3000);
    }
  };

  const DeleteDetailImg = async (imageUrl: string) => {
    setDeleteLoading(true);
    const status = await handleDeleteDetailImg(imageUrl, productId);
    if (status) {
      setDetailImages((prevImages) =>
        prevImages.filter((img) => img !== imageUrl)
      );
    }
    setDeleteLoading(false);
  };

  const uploadDetailImg = async () => {
    if (!imgFile) return;
    setUploadLoading(true);
    try {
      const status = await handleUploadProductDetailImg(productId, imgFile);
      if (status) {
        setDetailImages((prev) => [...prev, status]);
        setImagePreview(null);
        setImgFile(null);
        setRender(!render);
      }
    } catch (err) {
      setError("Failed to upload image.");
      throw new Error("Failed to upload image." + err);
    } finally {
      setUploadLoading(false);
    }
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString(); // Formats date as "MM/DD/YYYY HH:MM:SS AM/PM"
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Product Details</h1>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-8 ">
        <div className="w-full space-y-4 rounded-lg p-4">
          <div className="flex items-center justify-center">
            <Image
              src={product.img}
              alt="Product Image"
              width={500}
              height={500}
              priority
              className="rounded-lg w-auto shadow-lg h-[500px]"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {detailImages.map((imageUrl) => (
              <div key={imageUrl} className="relative group">
                <Image
                  src={imageUrl}
                  alt="Related Image"
                  width={150}
                  height={150}
                  className="rounded-lg object-cover w-full h-auto shadow"
                />
                <div className="absolute top-0 right-0 m-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                  <button
                    onClick={() => DeleteDetailImg(imageUrl)}
                    className="flex items-center px-2 py-1 bg-orange-600 text-white font-semibold rounded-lg shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <div className="flex justify-center ">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white "></div>
                      </div>
                    ) : (
                      <IconTrash size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))}

            {detailImages.length < 3 && (
              <div>
                <div
                  {...getRootProps()}
                  className={`relative ${
                    imagePreview
                      ? "cursor-not-allowed h-[calc(100% - 0.5rem)]"
                      : "cursor-pointer h-full"
                  } flex items-center justify-center border-2 border-dashed border-gray-400 rounded-lg w-full  hover:bg-gray-100`}
                  style={{ pointerEvents: imagePreview ? "none" : "auto" }}
                >
                  <input {...getInputProps()} disabled={!!imagePreview} />
                  {isDragActive ? (
                    <p className="text-gray-400">Drop the image here ...</p>
                  ) : imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Product Image Preview"
                      width={500}
                      height={500}
                      className="rounded-lg w-auto shadow-lg"
                    />
                  ) : (
                    <IconPlus size={24} className="text-gray-400" />
                  )}
                </div>
                {imagePreview && (
                  <div className="flex justify-center space-x-2 mt-2">
                    <button
                      type="button"
                      onClick={uploadDetailImg}
                      className="text-sm px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={uploadLoading}
                    >
                      {uploadLoading ? (
                        <div className="flex justify-center ">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white "></div>
                        </div>
                      ) : (
                        "Add Image"
                      )}
                    </button>
                    <button
                      onClick={() => setImagePreview(null)}
                      className="text-sm px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex space-x-4 mt-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              <IconEdit size={18} />
              <span>Edit</span>
            </button>

            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white font-semibold rounded-lg shadow hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <IconTrash size={18} />
              <span>Delete</span>
            </button>
            {/* {deleteLoading && <p>Deleting product...</p>} */}
          </div>
        </div>

        <div className="space-y-4 mt-8">
          <div className="grid grid-cols-2 gap-y-4 text-lg">
            <p className="font-semibold text-gray-700">Product:</p>
            <p className="text-gray-600">{product.name}</p>

            <p className="font-semibold text-gray-700">Price:</p>
            <p className="text-gray-600">{product.price}</p>

            <p className="font-semibold text-gray-700">Likes:</p>
            <p className="text-gray-600">{product.likes}</p>
            <p className="font-semibold text-gray-700">Category:</p>
            <p className="text-gray-600">{product.category.name}</p>
            <p className="font-semibold text-gray-700">Availability:</p>
            <p
              className={`font-medium ${
                product.available ? "text-green-500" : "text-red-500"
              }`}
            >
              {product.available ? "Available" : "Not Available"}
            </p>
            <p className="font-semibold text-gray-700">Created at</p>
            <p className="text-gray-600">
              {formatDate(product.createdAt ?? "")}
            </p>
            <p className="font-semibold text-gray-700">Updated at</p>
            <p className="text-gray-600">
              {formatDate(product.updatedAt ?? "")}
            </p>
          </div>
          <div className="pt-4 border-t border-gray-200">
            <p className="text-lg font-semibold text-gray-700 mb-2">
              Description:
            </p>
            <p className="text-gray-600 text-md">{product.description}</p>
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold text-gray-700 mb-2 border-t border-gray-200">
            Comments
          </p>
          <div className="space-y-4 mt-4">
            {comments?.map((comment: Comment) => (
              <div key={comment.id} className="bg-gray-100 p-4 rounded-lg">
                <p className="text-gray-700 font-semibold">
                  @{comment.user?.username}
                </p>
                <p className="text-gray-500 text-sm">
                  {formatRelativeTime(comment.createdAt)}
                </p>
                <p className="text-gray-600 text-md">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}
