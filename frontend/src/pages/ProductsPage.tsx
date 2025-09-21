import React, { useState, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import type { ICellRendererParams } from "ag-grid-community";
import { themeAlpine } from "ag-grid-community";
import api from "../api";
import ProductModal from "../components/ProductModal";
import { HiPencil, HiTrash } from "react-icons/hi";

export interface Product {
  product_id?: number;
  product_code: string;
  name: string;
  category: string;
  description?: string;
  unit: string;
  price: number;
  imageUrl?: string;
}
const ImageCellRenderer: React.FC<ICellRendererParams> = ({ value }) => {
    return value ? (
        <img src={value} alt="Product" className="w-12 h-12 object-cover rounded-md" />
    ) : (
        <span className="text-gray-400 text-xs">No Image</span>
    );
};
const ProductsPage: React.FC = () => {
  const [rowData, setRowData] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/api/products");
      setRowData(response.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenModal = (product: Product | null) => {
    setProductToEdit(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
  };

  const handleSaveProduct = async (productData: Partial<Product>, imageFile: File | null) => {
    const formData = new FormData();
    
    Object.keys(productData).forEach(key => {
        const value = productData[key as keyof typeof productData];
        if (value !== null && value !== undefined) {
            formData.append(key, String(value));
        }
    });

    if (imageFile) {
      formData.append('productImage', imageFile);
    }
    
    try {
      if (productData.product_id) {
        await api.put(`/api/products/${productData.product_id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchProducts();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save product', error);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await api.delete(`/api/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error("Failed to delete product", error);
      }
    }
  };

  const ActionsCellRenderer: React.FC<ICellRendererParams> = ({ data }) => (
    <div className="flex gap-2 items-center h-full">
      <button
        onClick={() => handleOpenModal(data)}
        className="text-blue-500 hover:text-blue-700"
      >
        <HiPencil size={20} />
      </button>
      <button
        onClick={() => handleDeleteProduct(data.product_id)}
        className="text-red-500 hover:text-red-700"
      >
        <HiTrash size={20} />
      </button>
    </div>
  );

  const [columnDefs] = useState<ColDef[]>([
    { 
        field: 'imageUrl', 
        headerName: 'Image', 
        cellRenderer: ImageCellRenderer, 
        flex:1  ,
        autoHeight: true,
    },
    { field: "product_code", headerName: "Code", flex: 1 , sortable: true , cellStyle: {  fontSize : '15px' , fontWeight: '600' }},
    { field: "name", headerName: "Product Name", flex: 2 , cellStyle: {  fontSize : '15px' , fontWeight: '600' }},
    { field: "category", headerName: "Category", flex: 1 , cellStyle: {  fontSize : '15px' , fontWeight: '600' }},
    { field: "unit", flex: 1 , cellStyle: {  fontSize : '15px' , fontWeight: '600' }},
    {
      field: "price",
      headerName: "Price",
      valueFormatter: (p) => `$${Number(p.value).toFixed(2)}`,
      flex: 1,
      cellStyle: {  fontSize : '15px' , fontWeight: '600' },
    },
    {
      field: "actions",
      headerName: "Actions",
      cellRenderer: ActionsCellRenderer,
      flex: 1,
      filter: false,
      sortable: false,
      cellStyle: {  fontSize : '15px' , fontWeight: '600' }
    },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        
        <button
          onClick={() => handleOpenModal(null)}
          className="flex gap-3 text-lg cursor-pointer text-white font-semibold bg-gradient-to-r from-[#144a31] to-[#387c40] px-7 py-3 rounded-full border border-[#144a31] hover:scale-105 duration-200 hover:text-white hover:border-[#144a31] hover:[#387c40] hover:to-[#144a31] justify-center items-center"
        >
          + Add New Product
        </button>
      </div>

      <div className="custom-ag-theme" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          pagination={true}
          paginationPageSize={15}
          paginationPageSizeSelector={[15, 20, 50, 100]}
          theme={themeAlpine}
        />
      </div>

      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        productToEdit={productToEdit}
      />
    </div>
  );
};

export default ProductsPage;
