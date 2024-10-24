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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      file,
    }));
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus("Submitting...");
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
      setSubmitStatus("Product Added Successfully");
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitStatus("Add Product");
        setNewProduct({
          id: null,
          name: "",
          description: "",
          price: 0,
          available: false,
          category_id: "",
          file: null,
        });
        fetchProducts();
      }, 2000); // Wait for 2 seconds
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div>
      {isModalOpen && (
        <div
          id="crud-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden flex justify-center items-center w-full h-[calc(100%-1rem)] max-h-full bg-gray-500 bg-opacity-75"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-white rounded-lg shadow dark:bg-blue-300">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 ">
                  Create New Product
                </h3>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="text-gray-900 bg-transparent hover:bg-gray-100 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white focus:ring-0 focus:outline-none"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form className="p-4 md:p-5" onSubmit={handleProductSubmit}>
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      id="name"
                      className="bg-gray-50 focus:ring-0 focus:outline-none text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-blue-500 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type product name"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="price"
                      className="block mb-2 text-sm font-medium text-gray-900 "
                    >
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      id="price"
                      className="focus:ring-0 focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50  dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="$2999"
                      required
                    />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label
                      htmlFor="category_id"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-text-gray-900"
                    >
                      Category
                    </label>
                    <select
                      name="category_id"
                      value={newProduct.category_id}
                      onChange={handleSelectChange}
                      id="category_id"
                      className="focus:ring-0 focus:outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-50  dark:placeholder-gray-400 dark:text-text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      required
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories?.length > 0 &&
                        categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="description"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-text-gray-900"
                    >
                      Product Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="focus:ring-0 focus:outline-none block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-100 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-50 dark:border-gray-100 dark:placeholder-gray-400 dark:text-text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write product description here"
                      required
                    ></textarea>
                  </div>
                  <div className="col-span-2">
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor="file"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-text-gray-900"
                      >
                        Upload Image
                      </label>
                      <input
                        type="file"
                        id="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="focus:ring-0 focus:outline-none bg-gray-50 border border-gray-100 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-100 dark:placeholder-gray-400 dark:text-text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center mb-4">
                      <input
                        id="available"
                        type="checkbox"
                        name="available"
                        checked={newProduct.available}
                        onChange={(e) =>
                          setNewProduct((prevProduct) => ({
                            ...prevProduct,
                            available: e.target.checked,
                          }))
                        }
                        className="w-4 h-4 text-blue-600 bg-gray-100 rounded border border-gray-300 focus:ring-blue-500 dark:bg-gray-50 dark:border-gray-500"
                      />
                      <label
                        htmlFor="available"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-700"
                      >
                        Available
                      </label>
                    </div>
                  </div>
                </div>

                {/* <button
                  // type="submit"
                  className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition duration-200 ease-in-out"
                >
                  {submitStatus}
                </button> */}
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                >
                  {submitStatus === "Submitting..." && (
                    <svg
                      aria-hidden="true"
                      role="status"
                      className="inline w-4 h-4 me-3 text-white animate-spin"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="#E5E7EB"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentColor"
                      />
                    </svg>
                  )}
                  {submitStatus}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
