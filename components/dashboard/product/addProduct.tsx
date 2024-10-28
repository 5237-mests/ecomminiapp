import React, { useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number | null;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category_id: string;
  file: File | null;
}

interface AddProductProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories: Category[];
  fetchProducts: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({
  isModalOpen,
  setIsModalOpen,
  categories,
  fetchProducts,
}) => {
  const [submitStatus, setSubmitStatus] = useState<string>("Add Product");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<Product>({
    id: null,
    name: "",
    description: "",
    price: 0,
    available: false,
    category_id: "",
    file: null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      setNewProduct((prev) => ({ ...prev, file: files[0] }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const fileInputRef = React.createRef<HTMLInputElement>();
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.price < 0) {
      alert("Price cannot be negative.");
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus("Submitting...");

    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      const value = newProduct[key as keyof Product];
      if (key !== "file" && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (newProduct.file) {
      formData.append("file", newProduct.file);
    }

    const url = "/api/product";
    const method = "POST";

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        setSubmitStatus("Product Added Successfully");
        setTimeout(() => {
          setIsModalOpen(false);
          resetForm();
          fetchProducts();
        }, 2000);
      } else {
        const errorMessage = await res.text();
        setSubmitStatus(`Failed to Add Product: ${errorMessage}`);
      }
    } catch (error) {
      setSubmitStatus(`Failed to Add Product: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      file,
    }));
  };

  const resetForm = () => {
    setNewProduct({
      id: null,
      name: "",
      description: "",
      price: 0,
      available: false,
      category_id: "",
      file: null,
    });
    setSubmitStatus("Add Product");
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen bg-gray-800 bg-opacity-75">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-900">
            <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create New Product
              </h3>
              <button
                type="button"
                onClick={toggleModal}
                className="text-gray-900 bg-transparent dark:text-white dark:focus:ring-blue-500 dark:bg-gray-600 hover:bg-gray-100 rounded-lg text-sm w-8 h-8 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form className="p-5" onSubmit={handleProductSubmit}>
              <div className="grid gap-4 grid-cols-2">
                <div className="col-span-2">
                  <label className="block mb-2 text-sm dark:text-white font-medium">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block mb-2 text-sm dark:text-white font-medium">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block dark:text-white mb-2 text-sm font-medium">
                    Category
                  </label>
                  <select
                    name="category_id"
                    value={newProduct.category_id}
                    onChange={handleSelectChange}
                    className="w-full p-2 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="" disabled>
                      Select a category
                    </option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block dark:text-white mb-2 text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 bg-gray-200 rounded-lg dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block dark:text-white mb-2 text-sm font-medium">
                    Upload Image
                  </label>
                  <div
                    className="flex items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-800 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={handleClick}
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full p-2 text-white rounded-lg ${
                    isSubmitting
                      ? "bg-gray-400"
                      : "bg-blue-600 hover:bg-blue-500"
                  }`}
                >
                  {submitStatus}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
