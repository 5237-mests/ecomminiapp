export interface Category {
  name: string;
  description: string;
  img: string;
  id: number;
}

// for frontendtesting
export interface category {
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
  likes: number;
  comments: Comment[];
  available: boolean;
  category_id: number;
  category: {
    name: string;
  };
  img: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomFile {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  file: File | ArrayBuffer | Blob | null;
}
export interface Products {
  id: number | null;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category_id: number;
  image?: string | null;
  file?: CustomFile;
  createdAt?: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    username: string;
  };
}
