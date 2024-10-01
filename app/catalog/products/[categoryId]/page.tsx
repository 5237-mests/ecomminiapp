
"use client";
import { useRouter } from "next/navigation";
import data from "../../../../assets/data.json"; 
import { Category, Product } from "../../../../types/types"; 
import { FaArrowLeft } from "react-icons/fa";
import Image from "next/image";

interface ProductsProps {
  params: {
    categoryId: string;
  };
}

const ProductsPage: React.FC<ProductsProps> = ({ params }) => {
  const { categoryId } = params; 
  const router = useRouter();
  const categories: Category[] = data.categories;
  const products: Product[] = data.products;

  if (!categoryId || typeof categoryId !== "string") {
    return <p>Loading...</p>; 
  }
  const category = categories.find(
    (cat) => cat.category_id === parseInt(categoryId)
  );

  if (!category) return <p>Category not found</p>;

  const filteredProducts = products.filter(
    (prod) => prod.category_id === parseInt(categoryId)
  );

  return (
    <div>
      <div className="flex w-full fixed bg-gray-100 p-4 text-2xl font-bold mb-20 gap-10 left-0">
        <FaArrowLeft
          size={30}
          onClick={() => router.back()} 
          className="bg-white text-black hover:bg-sky-700 font-bold w-20 h-10 py-2 px-4 border rounded-3xl"
        />
        <h1 className="bg-gray-100 text-2xl font-bold mb-4">{category.name}</h1>
      </div>

      <div className="grid grid-cols-2 gap-1 pt-20">
        {filteredProducts.map((product: Product) => (
          <div
            key={product.product_id}
            onClick={() =>
              router.push(`/catalog/products/detail/${product.product_id}`)
            } 
            style={{ marginBottom: "20px", cursor: "pointer" }}
          >
            <Image src={product.img} alt={product.name} width="100" />
            <p>Price: ${product.price}</p>
            <h2>{product.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
