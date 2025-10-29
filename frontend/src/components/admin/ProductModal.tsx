import { useAlert } from "../../context/common/AlertContext";
import api from "../../api";
import React, { useState, useEffect } from "react";
import type { ProductWithImage as Product } from "../../pages/admin/ProductsPage";
import { HiX } from "react-icons/hi";

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
        product_name: "",
        product_category: categoryOptions[0],
        product_description: "",
        unit_type: unitOptions[0],
        cost_price: 0,
        selling_price: 0,
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
      submissionFormData.append("productImage", selectedFile);
    }

    try {
      const isEditing = !!productToEdit?.product_id;

      if (isEditing) {
        await api.put(
          `/api/admin/products/${productToEdit.product_id}`,
          submissionFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else {
        await api.post("/api/admin/products", submissionFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      showAlert(
        `Product ${isEditing ? "updated" : "created"} successfully!`,
        "success"
      );
      onSaveSuccess();
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "An unexpected error occurred";
      showAlert(`Failed to save product: ${errorMessage}`, "error");
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#ffffffe8]">
      <div className="bg-[#f7f7f7] rounded-xl shadow-2xl w-full max-w-[700px] flex flex-col max-h-[90vh] overflow-hidden">
        <div className="relative flex-shrink-0 p-6 bg-[#387c40]">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white  transition-colors"
            aria-label="Close modal"
          >
            <HiX className="h-6 w-6 text-white hover:text-gray-200 transition-colors" />
          </button>
          <h2 className="text-2xl font-bold text-white text-center">
            {productToEdit ? "Edit Product" : "Add New Product"}
          </h2>
          {productToEdit && (
            <div className="mt-2 text-center">
              <p className="text-lg text-gray-200">
                Product Code:{" "}
                <span className="font-semibold text-white">
                  {productToEdit.product_code}
                </span>
              </p>
            </div>
          )}
        </div>

        <div className="flex-grow overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="md:row-span-4 flex flex-col items-center justify-start">
                <input
                  id="productImage"
                  name="productImage"
                  type="file"
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg"
                  className="hidden"
                />
                {previewUrl ? (
                  <div className="w-full text-center h-full flex flex-col">
                    <img
                      src={previewUrl}
                      alt="Product Preview"
                      className="w-full flex-grow object-cover rounded-lg border-2 border-gray-200 cursor-pointer"
                      onClick={() => setIsLargePreviewOpen(true)}
                    />
                    <label
                      htmlFor="productImage"
                      className="mt-2 inline-block text-sm font-semibold text-green-700 cursor-pointer hover:text-green-800 hover:underline transition-colors"
                    >
                      Change Image
                    </label>
                  </div>
                ) : (
                  <label
                    htmlFor="productImage"
                    className="w-full h-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition-colors"
                  >
                                        <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v.01"
                      />{" "}
                    </svg>
                    <span className="mt-2 text-sm font-semibold text-gray-600">
                      Upload Product Image
                    </span>
                    <p className="mt-1 text-xs text-gray-500">
                      JPG, PNG, up to 500KB
                    </p>
                  </label>
                )}
              </div>

              <div>
                <label htmlFor="product_name" className={labelStyle}>Product Name</label>
                <input id="product_name" name="product_name" value={formData.product_name || ""} onChange={handleChange} required className={inputStyle} />
              </div>
              
              <div>
                <label htmlFor="product_category" className={labelStyle}>Category</label>
                <select id="product_category" name="product_category" value={formData.product_category || ""} onChange={handleChange} className={inputStyle}>
                  {categoryOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                </select>
              </div>
              
              <div>
                <label htmlFor="unit_type" className={labelStyle}>Unit</label>
                <select id="unit_type" name="unit_type" value={formData.unit_type || ""} onChange={handleChange} className={inputStyle}>
                  {unitOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                </select>
              </div>

              <div>
                <label htmlFor="cost_price" className={labelStyle}>Cost Price</label>
                <input id="cost_price" name="cost_price" type="number" step="0.01" value={formData.cost_price || 0} onChange={handleChange} required className={inputStyle} />
              </div>
              
              <div>
                <label htmlFor="selling_price" className={labelStyle}>Selling Price</label>
                <input id="selling_price" name="selling_price" type="number" step="0.01" value={formData.selling_price || 0} onChange={handleChange} required className={inputStyle} />
              </div>
              <div>
                <label htmlFor="product_description" className={labelStyle}>Description (Optional)</label>
                <input id="product_description" name="product_description" value={formData.product_description || ""} onChange={handleChange} className={`${inputStyle} w-full`} />
              </div>
            </div>
          </form>
        </div>

        <div className="flex-shrink-0 flex flex-col p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              type="button"
              onClick={onClose}
              className={secondaryButtonStyle}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              type="submit"
              className={`${primaryButtonStyle} flex-1 sm:flex-none`}
            >
              {productToEdit ? "Save Changes" : "Add Product"}
            </button>
          </div>
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
