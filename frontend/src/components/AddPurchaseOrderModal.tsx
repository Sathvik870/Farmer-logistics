import React, { useState, useEffect } from "react";
import api from "../api";
import { useAlert } from "../context/AlertContext";
import { HiPlus, HiTrash } from "react-icons/hi";

const labelStyle = "block text-base text-black mb-1 text-left";
const inputStyle = "w-full text-base bg-transparent border-b-2 placeholder-gray-500 border-gray-300 py-2 px-2 text-black focus:outline-none focus:border-[#144a31]";
const primaryButtonStyle = "flex gap-3 text-base cursor-pointer text-white font-semibold bg-gradient-to-r from-[#144a31] to-[#387c40] px-7 py-3 rounded-full border border-[#144a31] hover:scale-105 duration-200 justify-center items-center";
const secondaryButtonStyle = "flex-1 sm:flex-none text-base cursor-pointer font-semibold bg-gray-200 text-gray-700 px-7 py-3 rounded-full hover:bg-gray-300 duration-200";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSuccess: () => void;
}

interface ProductItem {
    product_id: number;
    product_code: string;
    name: string;
    category: string;
    unit: string;
    price: number;
}

interface OrderItem {
    product_id: number;
    product_code: string;
    product_name: string;
    category: string;
    unit: string;
    quantity: number;
    purchase_rate: number;
    line_total: number;
}

const AddPurchaseOrderModal: React.FC<ModalProps> = ({ isOpen, onClose, onSaveSuccess }) => {
    const [supplierName, setSupplierName] = useState('');
    const [supplierContact, setSupplierContact] = useState('');
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [availableProducts, setAvailableProducts] = useState<ProductItem[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const { showAlert } = useAlert();

    const [currentItem, setCurrentItem] = useState({
        product_id: '',
        product_code: '',
        product_name: '',
        category: '',
        unit: '',
        quantity: 0,
        purchase_rate: 0,
    });

    useEffect(() => {
        if (isOpen) {
            const fetchProducts = async () => {
                setLoadingProducts(true);
                try {
                    const response = await api.get('/api/products'); 
                    setAvailableProducts(response.data);
                } catch (error) {
                    showAlert('Failed to load product list for purchase order.', 'error');
                    console.error(error);
                } finally {
                    setLoadingProducts(false);
                }
            };
            fetchProducts();
        }
    }, [isOpen]);

    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({ ...prev, [name]: value }));
    };

    const handleProductSelect = (selectedId: string) => {
        const product = availableProducts.find(p => String(p.product_id) === selectedId);
        if (product) {
            setCurrentItem({
                product_id: String(product.product_id),
                product_code: product.product_code,
                product_name: product.name,
                category: product.category,
                unit: product.unit,
                quantity: 0,
                purchase_rate: product.price, 
            });
        }
    };

    const handleAddItem = () => {
        const { product_id, quantity, purchase_rate, product_name, product_code, category, unit } = currentItem;
        
        if (!product_id || quantity <= 0 || purchase_rate <= 0) {
            showAlert('Please select a product and enter valid quantity/rate.', 'warning');
            return;
        }

        const newItem: OrderItem = {
            product_id: Number(product_id),
            product_code,
            product_name,
            category,
            unit,
            quantity: Number(quantity),
            purchase_rate: Number(purchase_rate),
            line_total: Number(quantity) * Number(purchase_rate),
        };

        setOrderItems(prev => [...prev, newItem]);
        
        setCurrentItem({ product_id: '', product_code: '', product_name: '', category: '', unit: '', quantity: 0, purchase_rate: 0 });
    };
    
    const handleRemoveItem = (index: number) => {
        setOrderItems(prev => prev.filter((_, i) => i !== index));
    };

    const calculateOrderTotal = () => {
        return orderItems.reduce((sum, item) => sum + item.line_total, 0);
    };

    const handleFinalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (orderItems.length === 0) {
            showAlert('Please add at least one item to the purchase order.', 'warning');
            return;
        }

        try {
            const payload = {
                supplier_name: supplierName,
                supplier_contact: supplierContact,
                items: orderItems.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    purchase_rate: item.purchase_rate,
                })),
            };

            await api.post('/api/purchases', payload);
            showAlert('Purchase Order submitted successfully!', 'success');
            onSaveSuccess();
            onClose();
        } catch (error) {
            showAlert('Failed to create purchase order.', 'error');
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-[#f7f7f7] p-6 rounded-xl shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
                <div className="flex-shrink-0">
                    <h2 className="text-2xl font-bold text-black mb-6 text-center">Add New Purchase Order</h2>
                </div>

                <form onSubmit={handleFinalSubmit} className="flex-grow overflow-y-auto space-y-6 pr-4 -mr-4">
                    {/* SUPPLIER DETAILS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 border-b pb-4">
                        <div>
                            <label htmlFor="supplierName" className={labelStyle}>Supplier Name</label>
                            <input id="supplierName" value={supplierName} onChange={(e) => setSupplierName(e.target.value)} required className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="supplierContact" className={labelStyle}>Supplier Phone/Contact</label>
                            <input id="supplierContact" value={supplierContact} onChange={(e) => setSupplierContact(e.target.value)} className={inputStyle} />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 pt-2 border-b pb-2">Add Items</h3>

                    <div className="grid grid-cols-1 md:grid-cols-7 gap-x-4 items-end">
                        <div className="col-span-2">
                            <label htmlFor="productSelect" className={labelStyle}>Product (Code/Name)</label>
                            {loadingProducts ? (
                                <p className="text-sm text-gray-500">Loading products...</p>
                            ) : (
                                <select 
                                    id="productSelect"
                                    value={currentItem.product_id}
                                    onChange={(e) => handleProductSelect(e.target.value)}
                                    className={inputStyle}
                                >
                                    <option value="">-- Select Product --</option>
                                    {availableProducts.map(p => (
                                        <option key={p.product_id} value={p.product_id}>
                                            {p.product_code} - {p.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>
                        
                        <div className="col-span-1">
                             <label className={labelStyle}>Category</label>
                             <p className="py-2 px-2 text-black border-b-2 border-gray-300">
                                {currentItem.category || 'N/A'}
                             </p>
                        </div>
                        <div className="col-span-1">
                             <label className={labelStyle}>Unit</label>
                             <p className="py-2 px-2 text-black border-b-2 border-gray-300">
                                {currentItem.unit || 'N/A'}
                             </p>
                        </div>

                        <div className="col-span-1">
                            <label htmlFor="quantity" className={labelStyle}>Quantity</label>
                            <input 
                                id="quantity"
                                name="quantity"
                                type="number"
                                min="1"
                                value={currentItem.quantity || ''}
                                onChange={handleItemChange}
                                className={inputStyle}
                            />
                        </div>
                        
                        <div className="col-span-1">
                            <label htmlFor="purchase_rate" className={labelStyle}>Purchase Rate</label>
                            <input 
                                id="purchase_rate"
                                name="purchase_rate"
                                type="number"
                                step="0.01"
                                value={currentItem.purchase_rate || ''}
                                onChange={handleItemChange}
                                className={inputStyle}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleAddItem}
                            className="col-span-1 h-full py-3 mt-4 text-white font-semibold bg-[#144a31] rounded-full hover:bg-[#387c40]"
                        >
                            <HiPlus size={20} className="inline mr-1" /> Add
                        </button>
                    </div>
                    <div className="pt-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Order Summary</h3>
                        {orderItems.length === 0 ? (
                            <p className="text-gray-500">No items added to the order.</p>
                        ) : (
                            <div className="overflow-x-auto rounded-lg border shadow-sm">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Code</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Product Name</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Category</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Qty ({orderItems[0]?.unit})</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase">Rate</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-600 uppercase">Total</th>
                                            <th className="px-4 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {orderItems.map((item, index) => (
                                            <tr key={index}>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{item.product_code}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{item.product_name}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{item.category}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">{item.quantity}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm">${item.purchase_rate.toFixed(2)}</td>
                                                <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-right">${item.line_total.toFixed(2)}</td>
                                                <td className="px-4 py-2">
                                                    <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-500 hover:text-red-700">
                                                        <HiTrash size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        <tr className="bg-gray-50 font-bold">
                                            <td colSpan={5} className="px-4 py-2 text-right text-sm">ORDER TOTAL:</td>
                                            <td className="px-4 py-2 text-right text-sm text-[#144a31]">${calculateOrderTotal().toFixed(2)}</td>
                                            <td></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </form>
                <div className="flex-shrink-0 flex flex-col sm:flex-row justify-end gap-4 pt-5 border-t mt-4">
                    <button type="button" onClick={onClose} className={secondaryButtonStyle}>Cancel</button>
                    <button type="submit" onClick={handleFinalSubmit} className={`${primaryButtonStyle} flex-1 sm:flex-none`}>
                        Submit Purchase Order
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddPurchaseOrderModal;