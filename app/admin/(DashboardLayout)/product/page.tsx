"use client";
import { useState, useEffect } from "react";
// import axios from "axios";
import Image from "next/image";
import React from "react";
import { IconSearch } from "@tabler/icons-react";
import AddProduct from "@/components/dashboard/product/addProduct";
import { BeatLoader } from "react-spinners";

interface Category {
  id: number;
  name: string;
  description: string;
  img: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category_id: number;
  img: string;
  createdAt: string;
}

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [availableItems, setAvailableItems] = useState<Product[]>(products);
  const [availableItemLoading, setAvailableItemLoading] = useState<number | null>(null);
  // Fetch categories and products
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    // Set initial filtered products to all products when the component mounts
    setFilteredProducts(products);
    const availableProducts = products.filter((product) => product.available);
    setAvailableItems(availableProducts);
    setActiveCategory(null);
  }, [products]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/category");
      const data = await res.json();
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/product");
      const data = await res.json();
      setProducts(data);
      // setStatus(data.available);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  const updateProductAvailability = async (product: Product) => {
    setAvailableItemLoading(product.id);
    const newAvailability = !product.available;

    const formData = new FormData();
    formData.append("available", newAvailability.toString()); 

    const res = await fetch(`/api/product/${product.id}`, {
      method: "PUT",
      body: formData, 
    });

    if (res.ok) {
      fetchProducts();
      setAvailableItemLoading(null);
    }
  };

const getCategoryName = (categoryId: number) => {
  const category = categories.find((category) => category.id === categoryId);
  return category?.name;
}

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  // show all products
  const showAllProducts = () => {
    setFilteredProducts(products);
    setActiveCategory(null);
    const availableProducts = products.filter((product) => product.available);
    setAvailableItems(availableProducts);
  };

  // filter product by categories
  const filterProductsByCategory = (categoryId: number) => {
    const filteredProducts = products.filter(
      (product) => product.category_id === categoryId
    );
    setFilteredProducts(filteredProducts);
    const availableProducts = filteredProducts.filter(
      (product) => product.available
    );
    setAvailableItems(availableProducts);
    setActiveCategory(categoryId);
  };

  // Filter search products
 const filteredData = filteredProducts
   .filter((product) =>
     product.name.toLowerCase().includes(searchTerm.toLowerCase())
   )
   .sort((a, b) => {
     return a.available === b.available ? 0 : a.available ? -1 : 1;
   });


  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <button
          onClick={toggleModal}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Add Products
        </button>
      </header>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex gap-4 border-b w-full">
          <button
            onClick={() => showAllProducts()}
            className={`text-sm text-gray-600 pb-1 ${
              activeCategory === null ? "border-b-2 border-blue-500 pb-1" : ""
            }`}
          >
            All Products
          </button>
          {categories?.map((category) => (
            <button
              key={category.id}
              onClick={() => filterProductsByCategory(category.id)}
              className={`text-sm text-gray-600 pb-1 ${
                activeCategory === category.id
                  ? "border-b-2 border-blue-500"
                  : ""
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      {/* quantity and status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 rounded-lg bg-gray-200 p-1 w-fit">
          <p className="text-blue-500 bg-white rounded-lg py-1 px-3 shadow-md">
            All <span className="text-gray-400"> {products.length}</span>
          </p>
          <p className="text-blue-500 bg-white rounded-lg py-1 px-3 shadow-md">
            Item{" "}
            <span className="text-gray-400"> {filteredProducts.length}</span>
          </p>
          <p className="text-blue-500 bg-white rounded-lg py-1 px-3 shadow-md">
            On Service{" "}
            <span className="text-gray-400"> {availableItems.length}</span>
          </p>
        </div>

        {/* Search Input */}
        <div className="relative ml-auto rounded-md">
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="search"
            placeholder="Search"
            className="ml-auto border rounded-md p-1 pl-10  focus:ring-0 focus:outline-none"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <IconSearch className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>
      {/* Product Table */}
      <div className="overflow-x-auto shadow-md rounded-2xl">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 ">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 ">
                PRODUCTS
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 ">
                DISCRIPTION
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                PRICE
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                AVAILABILITY
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                LIKES
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                COMMENTS
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                CREATED AT
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((product) => (
              <tr key={product.id} className="border-t">
                <td className="py-2 px-4 flex items-center">
                  <Image
                    src={product.img}
                    alt="Product Image"
                    width={25}
                    height={25}
                    className="rounded-lg h-10 w-10"
                  />
                  <span>
                    <p className="ml-2 font-medium">{product.name}</p>
                    <p className="ml-2 text-gray-400 text-sm">{getCategoryName(product.category_id)}</p>
                  </span>
                </td>
                <td className="py-2 px-4">{product.description}</td>
                <td className="py-2 px-4">ETB : {product.price}</td>
                <td className="py-2 px-4">
                  <label className="inline-flex items-center cursor-pointer bg-blue-100 rounded-2xl">
                    <input
                      checked={product.available}
                      onClick={() => updateProductAvailability(product)}
                      type="checkbox"
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-400"></div>

                    <span className="ms-3 text-sm font-medium text-gray-600 mr-3 w-20">
                      {availableItemLoading ===product.id ? (
                        <BeatLoader color="#14eca5" size={8}/>
                      ) : product.available ? (
                        "Available"
                      ) : (
                        "Unavailable"
                      )}
                    </span>
                  </label>
                </td>
                <td className="py-2 px-4">?</td>
                <td className="py-2 px-4">?</td>
                <td className="py-2 px-4">{product.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <button className="text-blue-500">Load More</button>
      </div>

      {isModalOpen && (
        <AddProduct
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          fetchProducts={fetchProducts}
          categories={categories}
        />
      )}
    </div>
  );
}

{
  /* <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      product.status === "Published"
                        ? "bg-green-100 text-green-800"
                        : product.status === "Draft"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status}
                  </span> */
}
