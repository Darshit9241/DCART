// src/pages/CouponPage.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { coupons } from '../../data/coupons';

const CouponPage = () => {
    const [copiedCode, setCopiedCode] = useState(null);

    const handleCopyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success('🎉 Copied! Now paste it at checkout.');
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-orange-100 via-white to-orange-100 px-4 py-12">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
                    🎁 Explore & Copy Coupons Instantly
                </h1>

                <ul className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(coupons).map(([code, details], idx) => (
                        <li
                            key={idx}
                            className="bg-white bg-opacity-80 backdrop-blur-md border border-orange-200 shadow-lg rounded-3xl p-6 transition-all hover:scale-[1.02]"
                        >
                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-orange-600 tracking-wide">
                                        {code}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-2">{details.description}</p>
                                </div>

                                <div className="mt-6">
                                    <button
                                        className={`w-full py-2 px-4 text-lg font-medium text-white rounded-xl transition duration-200 ${
                                            copiedCode === code
                                                ? 'bg-green-500 cursor-not-allowed'
                                                : 'bg-orange-500 hover:bg-orange-600'
                                        }`}
                                        onClick={() => handleCopyCode(code)}
                                        disabled={copiedCode === code}
                                        aria-label={`Copy ${code} to clipboard`}
                                    >
                                        {copiedCode === code ? '✅ Copied' : '📋 Copy Code'}
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CouponPage;
