import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import api from "../api";
import { useAlert } from "../context/AlertContext";
import ProductModal from "../components/ProductModal";
import ProductViewModal from "../components/ProductViewModal";
import { HiPencil, HiTrash, HiEye } from "react-icons/hi";

export interface Product {
  product_id: number;
  product_code: string;
  name: string;
  category: string;
  description?: string;
  unit: string;
  price: number;
  available_quantity: number;
}

export interface ProductWithImage extends Product {
  imageUrl?: string | null;
}

const ProductsPage: React.FC = () => {
  const [rowData, setRowData] = useState<Product[]>([]);
  const { showAlert } = useAlert();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductWithImage | null>(
    null
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );
  const fetchProducts = async () => {
    try {
      const response = await api.get<Product[]>("/api/products");
      setRowData(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
      showAlert(
        "Could not load product data. Please refresh the page.",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenViewModal = (productId: number) => {
    setSelectedProductId(productId);
    setIsViewModalOpen(true);
  };

  const handleOpenEditModal = async (productId: number | null) => {
    if (productId === null) {
      setProductToEdit(null);
    } else {
      try {
        const response = await api.get<ProductWithImage>(
          `/api/products/${productId}`
        );
        setProductToEdit(response.data);
      } catch (error) {
        console.error("Failed to fetch product details for editing", error);
        showAlert("Failed to fetch product details for editing.", "error");
        return;
      }
    }
    setIsEditModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setProductToEdit(null);
    setSelectedProductId(null);
  };

  const handleDeleteProduct = (productId: number) => {
    const performDelete = async () => {
      try {
        await api.delete(`/api/products/${productId}`);
        showAlert("Product deleted successfully!", "success");
        fetchProducts();
      } catch (error) {
        console.error("Failed to delete product", error);
        showAlert("Failed to delete product. Please try again.", "error");
      }
    };
    showAlert(
      "This action cannot be undone. Are you sure you want to delete this product?",
      "warning",
      performDelete
    );
  };

  const ActionsCellRenderer: React.FC<ICellRendererParams> = ({ data }) => (
    <div className="flex gap-4 items-center h-full">
      <button
        onClick={() => handleOpenViewModal(data.product_id)}
        className="text-green-600 hover:text-green-800"
        title="View Details"
      >
        <HiEye size={22} />
      </button>
      <button
        onClick={() => handleOpenEditModal(data.product_id)}
        className="text-blue-500 hover:text-blue-700"
        title="Edit Product"
      >
        <HiPencil size={20} />
      </button>
      <button
        onClick={() => handleDeleteProduct(data.product_id)}
        className="text-red-500 hover:text-red-700"
        title="Delete Product"
      >
        <HiTrash size={20} />
      </button>
    </div>
  );

  const [columnDefs] = useState<ColDef[]>([
    { field: "product_code", headerName: "Code", flex: 1.5, sortable: true },
    { field: "name", headerName: "Product Name", flex: 2.5 },
    { field: "category", headerName: "Category", flex: 2 },
    {
      field: "description",
      headerName: "Description",
      flex: 3,
      wrapText: true,
      autoHeight: true,
      valueFormatter: (params) => (params.value ? params.value : "N/A"),
    },
    {
      field: "available_quantity",
      headerName: "Stock",
      flex: 1.5,
      valueFormatter: (p) => `${p.value} ${p.data.unit}`,
    },
    {
      field: "price",
      headerName: "Price",
      valueFormatter: (p) => `$${Number(p.value).toFixed(2)} / ${p.data.unit}`,
      flex: 1.5,
    },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: ActionsCellRenderer,
      flex: 1.5,
      filter: false,
      sortable: false,
    },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
      cellStyle: { fontSize: "15px", fontWeight: "600" },
    }),
    []
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <button
          onClick={() => handleOpenEditModal(null)}
          className="flex gap-3 text-lg cursor-pointer text-white font-semibold bg-gradient-to-r from-[#144a31] to-[#387c40] px-7 py-3 rounded-full border border-[#144a31] hover:scale-105 duration-200 justify-center items-center"
        >
          + Add New Product
        </button>
      </div>

      <div
        className="ag-theme-alpine custom-ag-theme"
        style={{ height: 600, width: "100%" }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={15}
          paginationPageSizeSelector={[15, 20, 50, 100]}
        />
      </div>
      <ProductModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onSaveSuccess={fetchProducts}
        productToEdit={productToEdit}
      />
      <ProductViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseModals}
        productId={selectedProductId}
      />
    </div>
  );
};

export default ProductsPage;
