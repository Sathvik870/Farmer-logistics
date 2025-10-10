import { useAlert } from '../context/AlertContext';
import api from "../api";
import React, { useState, useEffect } from "react";
import type { ProductWithImage as Product } from "../pages/ProductsPage";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void; 
  productToEdit: Product | null;
}

const categoryOptions = ["Fruits", "Vegetables", "Dairy", "Grains"];
const unitOptions = ["Kilo gram", "grams", "packet", "dozen", "box"];

const labelStyle = "block text-base text-black mb-1 text-left";
const inputStyle =
  "w-full text-base bg-transparent border-b-2 placeholder-gray-500 border-gray-300 py-2 px-2 text-black focus:outline-none focus:border-[#144a31] transition-colors duration-300 ease-in-out";
const primaryButtonStyle =
  "flex gap-3 text-base cursor-pointer text-white font-semibold bg-gradient-to-r from-[#144a31] to-[#387c40] px-7 py-3 rounded-full border border-[#144a31] hover:scale-105 duration-200 justify-center items-center";
const secondaryButtonStyle =
  "flex-1 sm:flex-none text-base cursor-pointer font-semibold bg-gray-200 text-gray-700 px-7 py-3 rounded-full hover:bg-gray-300 duration-200";

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
  productToEdit,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLargePreviewOpen, setIsLargePreviewOpen] = useState(false);
  const { showAlert } = useAlert();
  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
      setPreviewUrl(productToEdit.imageUrl || null);
    } else {
      setFormData({
        name: "",
        category: categoryOptions[0],
        description: "",
        unit: unitOptions[0],
        price: 0,
      });
      setPreviewUrl(null);
    }
    setSelectedFile(null);
  }, [productToEdit, isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (!isOpen) return null;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const isNumberField = (e.target as HTMLInputElement).type === "number";
    setFormData((prev) => ({
      ...prev,
      [name]: isNumberField ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        submissionFormData.append(key, String(value));
      }
    });
    if (selectedFile) {
      submissionFormData.append('productImage', selectedFile);
    }

    try {
      const isEditing = !!productToEdit?.product_id;
      
      if (isEditing) {
        await api.put(`/api/products/${productToEdit.product_id}`, submissionFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/api/products', submissionFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      
      showAlert(`Product ${isEditing ? 'updated' : 'created'} successfully!`, 'success');
      onSaveSuccess();
      onClose();

    } catch (error) {
      showAlert('Failed to save product.', 'error');
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#ffffffe8]">
      <div className="bg-[#f7f7f7] p-6 rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0">
          <h2 className="text-2xl font-bold text-black mb-6 text-center">
            {productToEdit ? "Edit Product" : "Add New Product"}
          </h2>

          {productToEdit && (
            <div className="mb-4 text-center">
              <p className="text-lg text-gray-500">
                Product Code:{" "}
                <span className="font-semibold text-black">
                  {productToEdit.product_code}
                </span>
              </p>
            </div>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto space-y-5 pr-4 -mr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <label htmlFor="name" className={labelStyle}>
                Product Name
              </label>
              <input
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="category" className={labelStyle}>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                className={inputStyle}
              >
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="unit" className={labelStyle}>
                Unit
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit || ''}
                onChange={handleChange}
                className={inputStyle}
              >
                {unitOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="price" className={labelStyle}>
                Price
              </label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price || 0}
                onChange={handleChange}
                required
                className={inputStyle}
              />
            </div>
          </div>
          <div>
            <label htmlFor="productImage" className={labelStyle}>
              Product Image
            </label>
            <input
              id="productImage"
              name="productImage"
              type="file"
              onChange={handleFileChange}
              accept="image/png, image/jpeg"
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
          </div>

          {previewUrl && (
            <div className="mt-2">
              <label className={labelStyle}>Image Preview</label>
              <img
                src={previewUrl}
                alt="Product Preview"
                className="w-24 h-24 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-green-500 transition"
                onClick={() => setIsLargePreviewOpen(true)}
              />
            </div>
          )}
          <div>
            <label htmlFor="description" className={labelStyle}>
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className={`${inputStyle} w-full`}
              rows={2}
            ></textarea>
          </div>
        </form>
        <div className="flex-shrink-0 flex flex-col sm:flex-row justify-end gap-4 pt-5">
          <button
            type="button"
            onClick={onClose}
            className={secondaryButtonStyle}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className={`${primaryButtonStyle} flex-1 sm:flex-none`}
          >
            {productToEdit ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </div>
      {isLargePreviewOpen && previewUrl && (
        <div
          className="fixed inset-0 z-[60] bg-black bg-opacity-80 flex items-center justify-center"
          onClick={() => setIsLargePreviewOpen(false)}
        >
          <img
            src={previewUrl}
            alt="Product Preview"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ProductModal;