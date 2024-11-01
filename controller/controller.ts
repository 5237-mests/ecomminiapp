import axios from 'axios';

// Fetch product details
export const fetchProduct = async (productId: number) => {
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

//Delete product
// export const deleteProduct = async (productId: number) => {
//   try {
//     const res = await fetch(`/api/product/${productId}`, {
//       method: "DELETE",
//     });
//     if (!res.ok) {
//       throw new Error(
//         `Failed to delete product: ${res.status} ${res.statusText}`
//       );
//     }
//     const data = await res.json();
//     return data.data;
//   } catch (error) {
//     console.error("Error deleting product:", error);
//     return null;
//   }
// }

export const handleDeleteProduct = async (
  productId: number,
): Promise<boolean> => {
  try {
    await axios.delete(`/api/product/${productId}`);
    console.log(`Deleted product with ID ${productId}`);
    return true; // return success status
  } catch (error) {
    console.error('Error deleting product:', error);
    return false; // return failure status
  }
};

//upload productDetailImg
export const handleUploadProductDetailImg = async (
  productId: number,
  file: File,
) => {
  const formData = new FormData();
  formData.append('productId', productId.toString());
  formData.append('file', file);
  try {
    const response = await fetch('/api/product/detail_img', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    if (data.error) {
      console.error(data.error);
    } else {
      return data.data.detail_img;
    }
  } catch (error) {
    console.error('Failed to upload image', error);
  }
};

//delate productDetailImg
export const handleDeleteDetailImg = async (
  imageUrl: string,
  productId: number,
) => {
  try {
    const response = await fetch('/api/product/detail_img', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, imageUrlToRemove: imageUrl }),
    });
    const data = await response.json();

    if (data.error) {
      console.error(data.error);
    } else {
      return data.data.detail_img;
      // setDetailImages(data.data.detail_img); // Update images array after deletion
    }
  } catch (error) {
    console.error('Failed to delete image', error);
  }
};

// export const handleDeleteDetailImg = async (
//   imageUrl: string,
//   productId: number
// ) => {
//   try {
//     const response = await axios.delete("/api/product/detail_img", {
//       data: { productId, imageUrlToRemove: imageUrl },
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const data = response.data;

//     if (data.error) {
//       console.error(data.error);
//     } else {
//       return data.data.detail_img;
//       // setDetailImages(data.data.detail_img); // Update images array after deletion
//     }
//   } catch (error) {
//     console.error("Failed to delete image", error);
//   }
// };
