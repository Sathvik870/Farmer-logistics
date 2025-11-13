import React, { useMemo } from "react";
import ProductCard from "../../components/customer/ProductCard";
import { useCategory } from "../../context/customer/category/useCategory.ts";
import { useSearch } from "../../context/customer/search/useSearch.ts";
import { useDebounce } from "use-debounce";
import { useProducts } from "../../context/customer/product/useProducts.ts";

const ShoppingPage: React.FC = () => {
  const { selectedCategory } = useCategory();
  const { products, loading, error } = useProducts();
  const { searchTerm } = useSearch();
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const filteredProducts = useMemo(() => {
    // ✅ Move safe array logic inside useMemo
    const safeProducts = Array.isArray(products) ? products : [];

    return safeProducts.filter((product) => {
      const categoryMatch =
        selectedCategory === "All" ||
        product.product_category === selectedCategory;

      const searchMatch =
        !debouncedSearchTerm ||
        product.product_name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [products, selectedCategory, debouncedSearchTerm]);

  if (loading) {
    return <div className="text-center p-10">Loading products...</div>;
  }
  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center p-10 text-gray-500">No products found.</div>
      )}
    </div>
  );
};

// <div>
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         {products.map((product) => (
//           <ProductCard key={product.product_id} product={product} />
//         ))}
//       </div>
//     </div>

export default ShoppingPage;
