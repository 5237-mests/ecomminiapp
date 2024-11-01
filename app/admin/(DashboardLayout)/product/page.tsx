'use client';
import { useState, useEffect } from 'react';
import React from 'react';
import { IconSearch } from '@tabler/icons-react';
import AddProduct from '@/components/dashboard/product/addProduct';
import { useRouter } from 'next/navigation';
import { Product, Category } from '@/types/types';
import CatalogList from '@/components/dashboard/product/CatalogList';
import ProductTable from '@/components/dashboard/product/ProductTable';
import Loading from '@/components/Loading/page';

export default function ProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [availableItems, setAvailableItems] = useState<Product[]>(products);
  const [availableItemLoading, setAvailableItemLoading] = useState<
    string | number | null
  >(null);

  const router = useRouter();

  // Fetch categories and products
  useEffect(() => {
    setIsLoading(true);
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    // Set initial filtered products to all products when the component mounts
    setFilteredProducts(products);
    const availableProducts = products?.filter((product) => product.available);
    setAvailableItems(availableProducts);
    setActiveCategory(null);
  }, [products]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/category');
      const data = await res.json();
      setCategories(data.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/product');
      const data = await res.json();
      setProducts(data.data);
      console.log('products', data);
      // setStatus(data.available);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setIsLoading(false);
  };
  const updateProductAvailability = async (product: Product) => {
    setAvailableItemLoading(String(product.product_id));
    const newAvailability = !product.available;

    const formData = new FormData();
    formData.append('available', newAvailability.toString());

    const res = await fetch(`/api/product/${product.product_id}`, {
      method: 'PUT',
      body: formData,
    });

    if (res.ok) {
      fetchProducts();
      setAvailableItemLoading(null);
    }
  };

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
      (product) => product.category_id === categoryId,
    );
    setFilteredProducts(filteredProducts);
    const availableProducts = filteredProducts.filter(
      (product) => product.available,
    );
    setAvailableItems(availableProducts);
    setActiveCategory(categoryId);
  };

  // Filter search products
  const filteredData = filteredProducts
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      return a.available === b.available ? 0 : a.available ? -1 : 1;
    });

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-gray-50 sm:p-6 p-2 ">
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
            <div className="flex gap-4 border-b w-full relative  overflow-x-auto">
              <button
                onClick={() => showAllProducts()}
                className={`w-24 text-sm text-gray-600 pb-1  bg-gray-100 hover:bg-gray-200 rounded-md ${
                  activeCategory === null
                    ? 'border-b-2 border-blue-500 pb-1'
                    : ''
                }`}
              >
                <span>All </span>
                <span className="hidden sm:inline"> Products</span>
              </button>
              {categories?.map((category) => (
                <CatalogList
                  key={category.id}
                  category={category}
                  filterProductsByCategory={filterProductsByCategory}
                  activeCategory={activeCategory}
                />
              ))}
              <button
                onClick={() => router.push('/admin/product/category')}
                className="hidden sm:inline ml-auto absolute right-0 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Add Category
              </button>
            </div>
          </div>
          {/* quantity and status */}
          <div className="sm:flex items-center justify-between mb-6">
            <div className="w-full flex items-center gap-4 rounded-lg bg-gray-200 p-1 sm:w-fit">
              <p className="text-blue-500 bg-white rounded-lg py-1 px-3 shadow-md">
                All <span className="text-gray-400"> {products?.length}</span>
              </p>
              <p className="text-blue-500 bg-white rounded-lg py-1 px-3 shadow-md">
                Item{' '}
                <span className="text-gray-400">
                  {' '}
                  {filteredProducts.length}
                </span>
              </p>
              <p className="text-blue-500 bg-white rounded-lg py-1 px-3 shadow-md">
                On Service{' '}
                <span className="text-gray-400"> {availableItems.length}</span>
              </p>
            </div>

            {/* Search Input */}
            <div className="relative ml-auto rounded-md">
              <input
                onChange={(e) => setSearchTerm(e.target.value)}
                type="search"
                placeholder="Search"
                className="ml-auto w-full border rounded-md p-1 pl-10  focus:ring-0 focus:outline-none"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IconSearch className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
          {/* Product Table */}
          <ProductTable
            filteredData={filteredData}
            updateProductAvailability={updateProductAvailability}
            availableItemLoading={availableItemLoading}
          />

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
      )}
    </>
  );
}
