export const fetchCategories = async () => {
  try {
    const res = await fetch('/api/category');
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

export const fetchProducts = async () => {
  try {
    const res = await fetch('/api/product');
    const data = await res.json();
    return data.data;
    // console.log('products', data);
    // setStatus(data.available);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
  // setIsLoading(false);
};

export const fetchProductById = async (productId: string) => {
  try {
    const res = await fetch(`/api/product/${productId}`);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch product: ${res.status} ${res.statusText}`,
      );
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

//get product by category id
export const fetchProductByCategory = async (categoryId: string) => {
  try {
    const res = await fetch(`/api/product/category/${categoryId}`);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch product: ${res.status} ${res.statusText}`,
      );
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};
