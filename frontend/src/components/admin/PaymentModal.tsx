import React, { useState, useMemo, useEffect } from "react";
import { HiX } from "react-icons/hi";
import api from "../../api";
import { useAlert } from "../../context/common/AlertContext";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSuccess: () => void;
  invoice: any;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSaveSuccess,
  invoice,
}) => {
  const amountDue = useMemo(() => {
    if (!invoice) return 0;
    console.log(invoice);
    return parseFloat(invoice.total_amount) - parseFloat(invoice.amount_paid);
  }, [invoice]);

  const [amountPaidNow, setAmountPaidNow] = useState("0");

  useEffect(() => {
    if (invoice) {
      setAmountPaidNow(amountDue.toFixed(2));
    }
  }, [invoice, amountDue]);

  const { showAlert } = useAlert();

  if (!isOpen || !invoice) return null;

  const handleSubmit = async () => {
    const numericAmount = parseFloat(amountPaidNow);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      showAlert("Please enter a valid positive amount.", "error");
      return;
    }
    if (numericAmount > amountDue) {
      showAlert("Payment cannot exceed the amount due.", "error");
      return;
    }

    try {
      await api.put(`/api/admin/invoices/${invoice.invoice_id}/payment`, {
        amount_paid_now: numericAmount,
      });
      showAlert("Payment updated successfully!", "success");
      onSaveSuccess();
      onClose();
    } catch (error: any) {
      showAlert(
        error.response?.data?.message || "Failed to update payment.",
        "error"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#ffffff45]">
      <div className="bg-[white] rounded-lg shadow-xl w-full max-w-md">
        <div className="bg-[#387c40] p-4 flex justify-between items-center">
          <h3 className="text-lg text-white font-bold">
            Record Payment for {invoice.invoice_code}
          </h3>
          <button className="text-white hover:text-gray-400" onClick={onClose}>
            <HiX size={24} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-lg font-medium text-black">
              Total Invoice Amount : ₹
              {parseFloat(invoice.total_amount).toFixed(2)}
            </label>
          </div>
          {amountDue !== 0 && (
            <div>
              <label className="block text-lg font-medium text-red-600">
                Amount Due : {`₹${amountDue.toFixed(2)}`}
              </label>
            </div>
          )}
          <hr />
          <div>
            <label className="block text-sm font-medium">
              Amount Received Now
            </label>
            <input
              type="number"
              value={amountPaidNow}
              onChange={(e) => setAmountPaidNow(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mt-1 focus:ring-2 focus:ring-green-500"
              placeholder="Enter amount"
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold"
          >
            Save Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
