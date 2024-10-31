import { Link } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Suspense } from "react";
import { BeatLoader } from "react-spinners";
import { Product } from "@/types/types";

interface TableProps {
  filteredData: Product[];
  updateProductAvailability: (product: Product) => void;
  availableItemLoading: string | number | null;
}

const ProductTable: React.FC<TableProps> = ({
  filteredData,
  updateProductAvailability,
  availableItemLoading,
}) => {
  const router = useRouter();

  return (
    <div>
      <div className="overflow-x-auto w-full shadow-md rounded-2xl">
        <table className="min-w-full divide-y divide-gray-200 bg-white ">
          <thead className="bg-gray-100 ">
            <tr>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 ">
                PRODUCTS
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500 ">
                DISCRIPTION
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                PRICE
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                AVAILABILITY
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                LIKES
              </th>
              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                COMMENTS
              </th>

              <th className="py-2 px-4 text-left text-sm font-medium text-gray-500">
                ACTION
              </th>
            </tr>
          </thead>
          <Suspense
            fallback={
              <div className="text-center p-5">
                <BeatLoader color="#14eca5" size={10} />
              </div>
            }
          >
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-2 px-4 text-center text-sm font-medium text-red-500"
                  >
                    <p>No products found.</p>
                  </td>
                </tr>
              ) : (
                filteredData.map((product) => (
                  <tr key={product.product_id} className="border-t">
                    <td className="py-2 px-4 flex items-center">
                      <Image
                        src={product.img}
                        alt="Product Image"
                        width={25}
                        height={25}
                        className="rounded-lg h-10 w-10"
                      />
                      <span>
                        <p className="ml-2 font-medium">{product.name}</p>
                        <p className="ml-2 text-gray-400 text-sm">
                          {product.category.name}
                        </p>
                      </span>
                    </td>
                    <td className="py-2 px-4">{product.description}</td>
                    <td className="py-2 px-4">ETB : {product.price}</td>
                    <td className="py-2 px-4">
                      <label className="inline-flex items-center cursor-pointer bg-blue-100 rounded-2xl">
                        <input
                          checked={product.available}
                          onClick={() => updateProductAvailability(product)}
                          type="checkbox"
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-0 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-400"></div>
                        <span className="ms-3 text-sm font-medium text-gray-600 mr-3 w-20">
                          {availableItemLoading === product.product_id ? (
                            <BeatLoader color="#14eca5" size={8} />
                          ) : product.available ? (
                            "Available"
                          ) : (
                            "Unavailable"
                          )}
                        </span>
                      </label>
                    </td>
                    <td className="py-2 px-4">{product.likes}</td>
                    <td className="py-2 px-4">{product.comments.length}</td>
                    <td className="py-2 px-4 cursor-pointer">
                      <Link
                        onClick={() =>
                          router.push(`/admin/product/${product.product_id}`)
                        }
                        className=""
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Suspense>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
