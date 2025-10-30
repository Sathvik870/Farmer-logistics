import React, { useState, useEffect } from "react";
import api from "../../api";
import type { ProductWithImage } from "../admin/ProductsPage";
import ProductCard from "../../components/customer/ProductCard";

const ShoppingPage: React.FC = () => {
  const [products, setProducts] = useState<ProductWithImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSaleableProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get<ProductWithImage[]>("/api/public/products/saleable");
        setProducts(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to load products. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleableProducts();
  }, []);

  if (loading) {
    return <div className="text-center p-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-red-500">{error}</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {products.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ShoppingPage;