export interface Category {
  category_id: number;
  name: string;
  description: string;
  img: string;
}

export interface Product {
 
  product_id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category_id: number;
  img: string;
}


// src/types/product.ts
// export type Product = {
//   id: number | null;
//   name: string;
//   description: string;
//   price: number;
//   available: boolean;
//   category_id: string;
//   image?: string | null;
//   file?: any;
// };
