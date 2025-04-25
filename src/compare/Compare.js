import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCompare, clearCompare } from '../redux/compareSlice';
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Separate component for the comparison table
const ComparisonTable = ({ compareList, onRemoveProduct }) => {
    const attributes = [
        { key: 'image', label: 'Image', render: (product) => (
            <img 
                src={product.imgSrc} 
                alt={product.alt} 
                className="h-20 md:h-24 mx-auto object-contain rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300" 
            />
        )},
        { key: 'name', label: 'Product Name', render: (product) => (
            <span className="text-gray-800 font-medium">{product.name}</span>
        )},
        { key: 'oldPrice', label: 'Old Price', render: (product) => (
            <span className="line-through text-gray-500">${product.oldPrice}</span>
        )},
        { key: 'price', label: 'New Price', render: (product) => (
            <span className="text-green-600 font-semibold">${product.price}</span>
        )},
        { key: 'discount', label: 'Discount', render: (product) => (
            <span className="text-orange-500 font-medium">
                {product.discount ? `${product.discount}%` : '0%'}
            </span>
        )},
        { key: 'finalPrice', label: 'Price After Discount', render: (product) => {
            const price = parseFloat(product.price || 0);
            const discount = parseFloat(product.discount || 0);
            const discountedPrice = price - (price * (Math.abs(discount) / 100));
            return (
                <span className="font-bold text-green-600">
                    ${discountedPrice.toFixed(2)}
                </span>
            );
        }}
    ];

    return (
        <div className="overflow-x-auto w-full rounded-lg shadow-lg">
            <table className="table-auto border-collapse w-full min-w-[600px] text-center bg-white">
                <thead>
                    <tr className="bg-gray-100 text-sm md:text-base">
                        <th className="p-3 md:p-4 sticky left-0 bg-gray-100 z-10 rounded-tl-lg">Attributes</th>
                        {compareList.map((product) => (
                            <th key={product.id} className="p-3 md:p-4 relative">
                                <div className="flex flex-col items-center justify-center space-y-2">
                                    <button
                                        onClick={() => onRemoveProduct(product)}
                                        className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                                        aria-label="Remove from comparison"
                                    >
                                        <MdDelete className="text-xl" />
                                    </button>
                                    <span className="font-medium text-sm md:text-base text-center line-clamp-2">
                                        {product.name}
                                    </span>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody className="text-xs md:text-sm">
                    {attributes.map(({ key, label, render }) => (
                        <tr key={key} className="border-t border-gray-200">
                            <td className="p-3 md:p-4 font-semibold sticky left-0 bg-white z-10">
                                {label}
                            </td>
                            {compareList.map((product) => (
                                <td key={`${product.id}-${key}`} className="p-3 md:p-4">
                                    {render(product)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Main Compare component
const Compare = () => {
    const compareList = useSelector((state) => state.compare);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); 

    const handleRemoveProduct = (product) => {
        dispatch(removeFromCompare(product));
        toast.info(`${product.name} removed from comparison`);
    };

    const handleNavigateToHome = () => {
        navigate('/product');
    };

    const handleClearAndRedirect = () => {
        dispatch(clearCompare());
        toast.success('Comparison list cleared');
        navigate('/');
    };

    if (compareList.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
                <div className="text-center p-10 text-lg md:text-xl text-gray-600">
                    <p className="mb-4">No products to compare</p>
                    <button
                        onClick={handleNavigateToHome}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-10 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">
                    Compare Products
                </h1>
                <p className="text-center text-gray-600">
                    Compare {compareList.length} product{compareList.length !== 1 ? 's' : ''}
                </p>
            </div>

            <ComparisonTable 
                compareList={compareList} 
                onRemoveProduct={handleRemoveProduct}
            />

            <div className="mt-8 flex flex-col md:flex-row justify-center md:justify-between items-center gap-4">
                <button
                    onClick={handleNavigateToHome}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 w-full md:w-auto flex items-center justify-center"
                >
                    Back To Products
                </button>
                <button
                    onClick={handleClearAndRedirect}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 w-full md:w-auto flex items-center justify-center"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};

export default Compare;
