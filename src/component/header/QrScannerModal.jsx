import React from 'react';
import { IoMdClose } from "react-icons/io";
import { FaQrcode } from "react-icons/fa";
import { useQRCode } from 'next-qrcode';

export default function QrScannerModal({ closeModal, userEmail }) {
  const { Canvas } = useQRCode();
  
  const handleQrResult = (result) => {
    closeModal();
    // If result is a URL, navigate to it
    if (result && result.startsWith('http')) {
      window.open(result, '_blank');
    } else if (result) {
      // If it's a product ID or other data, handle appropriately
      // For now we'll just alert the result
      alert(`QR code data: ${result}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50 animate-fadeIn">
      <div 
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-11/12 max-w-md mx-4 animate-slide-in-up"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Scan QR Code</h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 p-2 -m-2"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="mb-5 border-2 border-dashed border-gray-300 dark:border-gray-600 p-3 rounded-lg">
            {/* Placeholder for camera view - in a real app this would use the device camera */}
            <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
              <div className="text-center p-4">
                <FaQrcode className="text-4xl mx-auto mb-3 text-gray-500 dark:text-gray-400" />
                <p className="text-gray-500 dark:text-gray-400 mb-2">Point your camera at a QR code</p>
                <button 
                  className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  onClick={() => {
                    // For demo, simulate a scan result after a delay
                    setTimeout(() => {
                      handleQrResult("https://example.com/product/12345");
                    }, 1500);
                  }}
                >
                  Simulate Scan
                </button>
              </div>
            </div>
          </div>
          
          <div className="text-center w-full">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Share your cart with friends</p>
            <div className="bg-white p-3 rounded-lg inline-block">
              <Canvas
                text={"https://dcart.store/shared-cart/" + (userEmail || "guest")}
                options={{
                  level: 'M',
                  margin: 3,
                  scale: 4,
                  width: 200,
                  color: {
                    dark: '#000',
                    light: '#FFF',
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 