import axios from "axios";

// Fetch product details
export const fetchProduct = async (productId: number) => {
  try {
    const res = await fetch(`/api/product/${productId}`);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch product: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching product:", error);
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
  productId: number
): Promise<boolean> => {
  try {
    await axios.delete(`/api/product/${productId}`);
    console.log(`Deleted product with ID ${productId}`);
    return true; // return success status
  } catch (error) {
    console.error("Error deleting product:", error);
    return false; // return failure status
  }
};
