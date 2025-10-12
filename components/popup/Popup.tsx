"use client";
import { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ShieldCheck } from "lucide-react";

const PaymentPopup = ({ paymentUrl, onClose }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailed, setShowFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === "payment_success") {
        setShowSuccess(true);
        setTimeout(() => {
          window.location.reload();
          onClose();
        }, 2000);
      } else if (event.data === "payment_failed") {
        setShowFailed(true);
        setTimeout(() => {
          window.location.reload();
          onClose();
        }, 2000);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [onClose]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg max-w-2xl w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {showFailed ? (
          <div className="animate-bounce-in flex flex-col items-center justify-center h-[700px]">
            <FaTimesCircle className="text-6xl text-red-500 mb-4 animate-pulse" />
            <h2 className="text-3xl font-bold text-red-700 mb-2">
              فشلت عملية الترقية!
            </h2>
            <p className="text-lg text-gray-600">
              سيتم إغلاق النافذة تلقائياً...
            </p>
          </div>
        ) : (
          <>
            {showSuccess ? (
              <div className="animate-bounce-in flex flex-col items-center justify-center h-[700px]">
                <FaCheckCircle className="text-6xl text-green-500 mb-4 animate-pulse" />
                <h2 className="text-3xl font-bold text-green-700 mb-2">
                  تمت العملية بنجاح!
                </h2>
                <p className="text-lg text-gray-600">
                  سيتم إغلاق النافذة تلقائياً...
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2 text-center text-blue-700">
                  بوابة دفع إلكترونية آمنة
                </h2>

                <div className="flex flex-row items-center justify-center gap-2 mb-4">
                  <ShieldCheck className="text-center" />
                  <p className="text-md text-center text-green-500 font-bold">
                    مدعومة من مصرف الراجحي - تشفير وحماية عالية
                  </p>
                  <ShieldCheck className="text-center" />
                </div>

                {isLoading && (
                  <div className="flex flex-col items-center justify-center h-[700px]">
                    <p className="text-lg font-semibold mb-4">
                      جاري تحميل بوابة الدفع
                    </p>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                  </div>
                )}

                <iframe
                  src={paymentUrl}
                  className={`w-full h-[700px] border-0 ${isLoading ? "hidden" : "block"}`}
                  title="Payment Gateway"
                  onLoad={handleLoad}
                />

                <div className="text-center text-sm mt-4">
                  تتم معالجة معلوماتك المالية من خلال نظام مشفر وآمن تمامًا
                  لضمان حماية بياناتك.
                </div>

                <button
                  className="mt-4 w-full bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  onClick={onClose}
                >
                  إلغاء
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentPopup;
