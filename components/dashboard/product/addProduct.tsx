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
  addProduct: (product: Product) => void;
  categories: Category[];
  handleProductSubmit: () => void;
}

const AddProduct: React.FC<AddProductProps> = ({
  isModalOpen,
  setIsModalOpen,
  addProduct,
  categories,
  handleProductSubmit,
}) => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (newProduct.price <= 0) {
      alert("Price must be a positive number.");
      return;
    }

    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, value]) => {
      formData.append(key, value);
    });
    try {
      await addProduct(newProduct); // Update this if your addProduct needs FormData
      setNewProduct({
        id: null,
        name: "",
        description: "",
        price: 0,
        available: false,
        category_id: "",
        file: null,
      }); // Reset the form
      handleProductSubmit();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to add product:", error);
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
              <form className="p-4 md:p-5" onSubmit={handleSubmit}>
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
             
                <button
                  type="submit"
                  className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition duration-200 ease-in-out"
                >
                  Add Product
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
