"use client"; // لأن النافذة المنبثقة تعتمد على تفاعلات الجانب العميل

import { useEffect } from "react";

const PaymentPopup = ({ paymentUrl, onClose }) => {
  // إغلاق النافذة عند الضغط على مفتاح Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // إغلاق النافذة عند الضغط على الخلفية
    >
      <div
        className="bg-white p-6 rounded-lg max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()} // منع الإغلاق عند الضغط داخل المربع
      >
        <h2 className="text-xl font-bold mb-2">بوابة دفع آمنة</h2>
        <p className="mb-4">يرجى إكمال عملية الدفع أدناه بأمان.</p>
        <iframe
          src={paymentUrl}
          className="w-full h-96 border-0"
          title="Payment Gateway"
        ></iframe>
        <button
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={onClose}
        >
          إلغاء
        </button>
      </div>
    </div>
  );
};

export default PaymentPopup;