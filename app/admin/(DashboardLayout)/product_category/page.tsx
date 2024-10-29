"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Image from "next/image";

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
}

export default function CategoriesAndProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    id: null as number | null,
    name: "",
    description: "",
    price: 0,
    available: false,
    category_id: "",
    file: null as File | null,
  });
  const [newCategory, setNewCategory] = useState({
    id: null as number | null,
    name: "",
    description: "",
    img: null as File | null,
  });

  const fetchCategories = async () => {
    const res = await fetch("/api/category");
    const data = await res.json();
    setCategories(data.data);
  };

  const fetchProducts = async () => {
    const res = await fetch("/api/product");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  // Handle Category Input Change
  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewCategory({ ...newCategory, [name]: value });
  };

  // Handle Category Image Change
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewCategory({ ...newCategory, img: file });
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newCategory.name);
    formData.append("description", newCategory.description);
    if (newCategory.img) {
      formData.append("img", newCategory.img);
    }

    const url = newCategory.id
      ? `/api/category/${newCategory.id}`
      : "/api/category";
    const method = newCategory.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      body: formData,
    });

    if (res.ok) {
      fetchCategories();
      setNewCategory({ id: null, name: "", description: "", img: null });
    }
  };

  // Handle Product Input Change
  const handleProductChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: name === "price" ? parseFloat(value) : value,
    });
  };

  // Handle Product Image Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewProduct({ ...newProduct, file });
  };

  // Handle Product Submit (Create/Update)
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      const value = newProduct[key as keyof typeof newProduct];
      if (key !== "file" && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (newProduct.file) {
      formData.append("file", newProduct.file);
    }

    const url = newProduct.id
      ? `/api/product/${newProduct.id}`
      : "/api/product";
    const method = newProduct.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      body: formData,
    });

    if (res.ok) {
      fetchProducts();
      setNewProduct({
        id: null,
        name: "",
        description: "",
        price: 0,
        available: false,
        category_id: "",
        file: null,
      });
    }
  };

  const handleDeleteCategory = async (id: number) => {
    await fetch(`/api/category`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    fetchCategories();
  };

  const handleDeleteProduct = async (id: number) => {
    await axios.delete(`/api/product/${id}`);
    fetchProducts();
  };

  const handleEditProduct = (product: Product) => {
    setNewProduct({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      available: product.available,
      category_id: product.category_id.toString(),
      file: null,
    });
  };

  const handleEditCategory = (category: Category) => {
    setNewCategory({
      id: category.id,
      name: category.name,
      description: category.description,
      img: null, // We don't have the actual file, so keep it null.
    });
  };

  return (
    <div className="container mx-auto p-4 mb-20">
      <h1 className="text-xl font-bold">Categories and Products</h1>

      {/* Category Section */}
      <section className="mb-4">
        <h2 className="text-lg font-bold">Create/Update a Category</h2>
        <form
          onSubmit={handleCategorySubmit}
          className="flex flex-row gap-4 p-0"
        >
          <div className="my-2">
            <input
              type="text"
              name="name"
              placeholder="Category Name"
              className="px-4 py-2"
              value={newCategory.name}
              onChange={handleCategoryChange}
              required
            />
          </div>
          <div className="my-2">
            <textarea
              name="description"
              placeholder="Category Description"
              className="px-4"
              value={newCategory.description}
              onChange={handleCategoryChange}
              required
            />
          </div>
          <div className="my-2">
            <input type="file" name="img" onChange={handleImageChange} />
          </div>
          <div>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">
              {newCategory.id ? "Update Category" : "Create Category"}
            </button>
          </div>
        </form>
        <hr />
        <ul className="flex flex-row gap-4">
          {categories?.length > 0 &&
            categories?.map((category) => (
              <li key={category.id} className="border p-2 mb-2">
                <p>{category.name}</p>
                <p>{category.description}</p>
                <Image
                  src={category.img}
                  alt={category.name}
                  width="100"
                  height="100"
                />
                <button
                  onClick={() => handleEditCategory(category)}
                  className="bg-blue-500 text-white px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </section>

      {/* Product Section */}
      <section className="mb-4 ">
        <h2 className="text-lg font-bold">Create/Update a Product</h2>
        <form
          onSubmit={handleProductSubmit}
          className="flex flex-row gap-4 p-0"
        >
          <div className="my-2">
            <input
              type="text"
              name="name"
              className="px-2 py-2"
              placeholder="Product Name"
              value={newProduct.name}
              onChange={handleProductChange}
              required
            />
          </div>
          <div className="my-2">
            <textarea
              name="description"
              className="px-2 py-2"
              placeholder="Description"
              value={newProduct.description}
              onChange={handleProductChange}
              required
            />
          </div>
          <div className="my-2 w-24">
            <input
              type="number"
              name="price"
              className="px-2 py-2 w-24"
              placeholder="Price"
              value={newProduct.price}
              onChange={handleProductChange}
              required
            />
          </div>

          <div className="my-2">
            <select
              name="category_id"
              value={newProduct.category_id}
              onChange={handleProductChange}
              required
              className="px-2 py-2"
            >
              <option value="">Select Category</option>
              {categories?.length > 0 &&
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="my-2">
            <input
              type="file"
              className="px-2"
              name="file"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <button type="submit" className="bg-green-500 text-white">
              {newProduct.id ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
        <hr />
        <ul className="flex flex-row gap-4">
          {products?.length > 0 &&
            products?.map((product) => (
              <li key={product.id} className="border p-2 mb-2">
                <p>{product.name}</p>
                <p>{product.description}</p>
                <p>Price: {product.price}</p>
                <Image
                  src={product.img}
                  alt={product.name}
                  width="100"
                  height="100"
                />
                <button
                  onClick={() => handleEditProduct(product)}
                  className="bg-yellow-500 text-white px-2 py-1"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="bg-red-500 text-white px-2 py-1"
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
