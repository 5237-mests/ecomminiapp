// import Image from 'next/image';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Category, Product } from '@/types/types';
import { useDropzone } from 'react-dropzone';

interface EditProductProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  categories: Category[];
  fetchProducts: () => void;
  productToEdit: Product | null;
}

const EditProduct: React.FC<EditProductProps> = ({
  isModalOpen,
  categories,
  fetchProducts,
  setIsModalOpen,
  productToEdit,
}) => {
  const [submitStatus, setSubmitStatus] = useState<string>('Update Product');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const defaultProduct: Product = {
    product_id: null,
    name: '',
    description: '',
    price: 0,
    likes: 0,
    comments: [],
    available: false,
    category_id: '',
    category: { name: '', img: '' },
    img: '',
    isLiked: false,
    createdAt: undefined,
    updatedAt: undefined,
  };

  const [updatedProduct, setUpdatedProduct] = useState<Product>({
    ...defaultProduct,
    product_id: null,
    name: '',
    description: '',
    price: 0,
    category_id: '',
    available: false,
    img: '',
  });

  useEffect(() => {
    if (productToEdit) {
      setUpdatedProduct({
        product_id: productToEdit.product_id,
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price,
        category_id: productToEdit.category_id,
        available: productToEdit.available,
        img: productToEdit.img,
        likes: productToEdit.likes,
        isLiked: productToEdit.isLiked,
        comments: productToEdit.comments,
        category: productToEdit.category,
      });
    }
  }, [productToEdit]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updatedProduct?.price < 0) {
      alert('Price cannot be negative.');
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus('Submitting...');

    try {
      const formData = new FormData();
      formData.append('name', updatedProduct.name);
      formData.append('price', updatedProduct.price.toString());
      formData.append('category_id', updatedProduct.category_id.toString());
      formData.append('available', updatedProduct.available.toString());
      formData.append('description', updatedProduct.description);

      // Add the image file if present
      if (updatedProduct.img) {
        formData.append('img', updatedProduct.img);
      }

      const response = await fetch(
        `/api/product/${updatedProduct.product_id}`,
        {
          method: 'PUT',
          body: formData,
        },
      );

      if (response.ok) {
        alert('Product updated successfully!');
        fetchProducts(); // Refresh product list
        setIsModalOpen(false); // Close modal on success
      } else {
        const responseData = await response.json();
        alert(`Failed to update product: ${responseData.error}`);
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred while updating the product.');
    } finally {
      setIsSubmitting(false);
      setSubmitStatus('Update Product');
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUpdatedProduct((prevProduct) => ({
        ...prevProduct,
        img: URL.createObjectURL(acceptedFiles[0]),
      }));
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.png', '.jpeg'] },
  });
  return (
    <div className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
      {isModalOpen && (
        <div className="fixed mx inset-0 z-50 flex items-center justify-center w-full h-screen bg-gray-800 bg-opacity-75 ">
          <div className="relative w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-900">
            <div className="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Product
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
                    value={updatedProduct.name}
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
                    value={updatedProduct.price}
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
                    value={updatedProduct.category_id}
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
                    value={updatedProduct.description}
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
                    className="flex gap-4 items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-200 dark:bg-gray-800 dark:border-gray-600 hover:bg-gray-300 dark:hover:bg-gray-700"
                    {...getRootProps()}
                  >
                    {updatedProduct.img ? (
                      <>
                        <div className="w-42 h-full">
                          <Image
                            src={updatedProduct.img}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </>
                    ) : (
                      ''
                    )}
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
                        <span className="font-semibold">Click to upload</span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 400x400px)
                      </p>
                    </div>
                    <input
                      {...getInputProps()}
                      // disabled={!!imagePreview}
                      disabled={false}
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
                      ? 'bg-gray-400'
                      : 'bg-blue-600 hover:bg-blue-500'
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

export default EditProduct;
