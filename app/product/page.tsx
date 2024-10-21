'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category_id: number;
  img: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    available: false,
    category_id: '',
    file: null as File | null,
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const res = await fetch('/api/product');
    const data = await res.json();
    setProducts(data);
  };

  const fetchProductById = async (id: number) => {
    const res = await fetch(`/api/product/${id}`);
    const data = await res.json();
    setSelectedProduct(data.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewProduct({ ...newProduct, file });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      if (key !== 'file' && newProduct[key as keyof typeof newProduct] !== null) {
        formData.append(key, newProduct[key as keyof typeof newProduct] as string);
      }
    });

    if (newProduct.file) {
      formData.append('file', newProduct.file);
    }

    const res = await fetch('/api/product', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      fetchProducts();
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/product/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      fetchProducts();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold my-4">Products</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div>
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
        </div>
        <br />
        <div>
          <textarea name="description" placeholder="Description" onChange={handleChange} required />
        </div>
        <div>
          <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
        </div>
        <div>
          <input
            type="checkbox"
            name="available"
            onChange={(e) => setNewProduct({ ...newProduct, available: e.target.checked })}
          />
        </div>
        <div>
          <input type="text" name="category_id" placeholder="Category ID" onChange={handleChange} required />
        </div>
        <br />
        <div>
          <input type="file" name="file" onChange={handleFileChange} required />
        </div>
        <br />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Create Product</button>
      </form>

      <ul>
        {products.map((product: Product) => (
          <li key={product.id} className="border p-2 mb-2">
            <p>{product.name}</p>
            <p>{product.description}</p>
            <Image src={product.img} alt={product.name} width="100" />
            <button onClick={() => fetchProductById(product.id)} className="bg-green-500 text-white px-4 py-2">
              View
            </button>
            <button onClick={() => handleDelete(product.id)} className="bg-red-500 text-white px-4 py-2">
              Delete
            </button>
          </li>
        ))}
      </ul>

      {selectedProduct && (
        <div className="mt-4 p-4 border">
          <h2 className="text-lg font-bold">Product Details</h2>
          <p>Name: {selectedProduct.name}</p>
          <p>Description: {selectedProduct.description}</p>
          <p>Price: {selectedProduct.price}</p>
          <p>Available: {selectedProduct.available ? 'Yes' : 'No'}</p>
          <Image src={selectedProduct.img} alt={selectedProduct.name} width="300" />
        </div>
      )}
    </div>
  );
}
