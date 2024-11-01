'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

interface Category {
  name: string;
  description: string;
  img: File | null;
}

const AddCategory: React.FC = () => {
  const router = useRouter();
  const [submitStatus, setSubmitStatus] = useState<string>('Add Category');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<Category>({
    name: '',
    description: '',
    img: null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    setNewCategory((prevCategory) => ({
      ...prevCategory,
      img: file,
    }));
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('Submitting...');

    const formData = new FormData();
    Object.keys(newCategory).forEach((key) => {
      const value = newCategory[key as keyof Category];
      if (key !== 'img' && value !== null) {
        formData.append(key, String(value));
      }
    });

    if (newCategory.img) {
      formData.append('img', newCategory.img);
    }

    const url = '/api/category'; // Adjust the URL as necessary
    const method = 'POST';

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        resetForm();
        setSubmitStatus('Category Added Successfully');
        setTimeout(() => {
          router.push('/admin/product');
        }, 2000);
      } else {
        const errorMessage = await res.text();
        setSubmitStatus(`Failed to Add Category: ${errorMessage}`);
      }
    } catch (error) {
      setSubmitStatus(`Failed to Add Category: ${(error as Error).message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewCategory({
      name: '',
      description: '',
      img: null,
    });
    setImagePreview(null);
    setSubmitStatus('Add Category');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-lg font-semibold text-gray-900">Add New Category</h2>
      <form className="mt-5" onSubmit={handleCategorySubmit}>
        <div className="grid gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={newCategory.name}
              onChange={handleInputChange}
              className="w-full p-2 bg-gray-200 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={newCategory.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 bg-gray-200 rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">
              Upload Image
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full p-2 bg-gray-200 rounded-lg"
              accept="image/*"
              required
            />
          </div>
          {imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt="Category Preview"
                className="w-full h-auto rounded"
              />
            </div>
          )}
        </div>
        {isSubmitting && (
          <div className="flex justify-center mt-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}
        <div className="mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 text-white rounded-lg ${
              isSubmitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {submitStatus}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCategory;
