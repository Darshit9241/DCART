import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addProduct } from '../redux/productSlice';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        oldPrice: '',
        discount: '',
        description: '',
        category: '',
        photo: null,
        currency: 'USD',
    });
    const dispatch = useDispatch();

    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    // State for dropdowns
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
    const categoryDropdownRef = useRef(null);
    const currencyDropdownRef = useRef(null);
    const currentCurrency = useSelector((state) => state.currency.currentCurrency);

    // Loading state
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        "Electronics",
        "Clothing",
        "Home & Kitchen",
        "Beauty & Personal Care",
        "Toys & Games",
        "Books",
        "Sports & Outdoors",
        "Automotive",
        "Health & Wellness",
        "Grocery",
        "Other"
    ];

    // Currency options with symbols
    const currencies = [
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
        { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
        { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
        { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
        { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
        { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
        { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
                setCategoryDropdownOpen(false);
            }
            if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
                setCurrencyDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Helper function to get currency symbol
    const getCurrencySymbol = (code) => {
        const currency = currencies.find(c => c.code === code);
        return currency ? currency.symbol : '$';
    };

    const handleChange = (e) => {
        const { name, value, files, type } = e.target;

        if (name === 'photo') {
            const file = files?.[0];
            if (file) {
                setFormData({ ...formData, photo: file });
                setPreview(URL.createObjectURL(file));
            } else {
                setFormData({ ...formData, photo: null });
                setPreview(null);
            }
        } else if (name === 'discount') {
            // Remove any non-numeric characters except for dash at the beginning
            let numericValue = value.replace(/[^0-9-]/g, '');
            if (numericValue.startsWith('-')) {
                numericValue = '-' + numericValue.substring(1).replace(/-/g, '');
            } else {
                numericValue = numericValue.replace(/-/g, '');
            }

            // Ensure it's a valid number
            if (numericValue === '' || numericValue === '-') {
                setFormData({ ...formData, discount: '' });
                return;
            }

            // Convert to number and check if discount makes sense
            const discountValue = parseInt(numericValue);

            // Check if we have both price and oldPrice to validate discount
            if (formData.price && formData.oldPrice) {
                const price = parseFloat(formData.price);
                const oldPrice = parseFloat(formData.oldPrice);

                // Calculate what percentage discount would make new price = price
                const maxDiscount = Math.floor((oldPrice - price) / oldPrice * 100);

                // Ensure old price is higher than new price
                if (oldPrice <= price) {
                    toast.error("Old price must be higher than new price for a discount to be valid.");
                    return;
                }

                // Check if the discount is too high or negative
                if (discountValue > maxDiscount) {
                    toast.error(`Discount cannot be more than ${maxDiscount}%. This would make the new price lower than specified price.`);
                    return;
                }
            }

            // Format with percentage sign
            let formattedValue = numericValue + '%';
            setFormData({ ...formData, discount: formattedValue });
        } else if (type === 'number') {
            // Allow only positive numbers for price and old price
            if (name === 'price' || name === 'oldPrice') {
                if (parseFloat(value) < 0) {
                    toast.error("Price and Old Price cannot be negative.");
                    return;
                }
            }
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const base64Image = await fileToBase64(formData.photo);
            const newProduct = {
                id: Date.now(),
                name: formData.name,
                price: parseFloat(formData.price),
                oldPrice: parseFloat(formData.oldPrice),
                discount: formData.discount,
                description: formData.description,
                category: formData.category,
                currency: formData.currency,
                imgSrc: base64Image,
                alt: formData.name,
            };

            dispatch(addProduct(newProduct));
            toast.success("Product uploaded successfully!");
            setFormData({
                name: '',
                price: '',
                oldPrice: '',
                discount: '',
                description: '',
                category: '',
                currency: 'USD',
                photo: null,
            });
            setPreview("");
            navigate('/');
        } catch (error) {
            toast.error("Failed to upload product. Please try again.");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCategorySelect = (category) => {
        setFormData({ ...formData, category });
        setCategoryDropdownOpen(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-4 sm:px-6">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Add New Product</h2>
                    <p className="mt-2 text-gray-600">Complete the form below to add a new product to your inventory</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left column - Basic Info & Image */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Basic Information</h3>

                                <div className="mt-4">
                                    <label className="block mb-1 text-gray-700 font-medium">Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter product name"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="relative" ref={categoryDropdownRef}>
                                <label className="block mb-1 text-gray-700 font-medium">Category <span className="text-red-500">*</span></label>
                                <div
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 flex justify-between items-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400 hover:bg-gray-50 transition"
                                    onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                                >
                                    <span className={formData.category ? "text-gray-800" : "text-gray-400"}>
                                        {formData.category || "Select a category"}
                                    </span>
                                    <svg
                                        className={`w-5 h-5 transition-transform duration-300 ${categoryDropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </div>

                                {categoryDropdownOpen && (
                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {categories.map((category, index) => (
                                            <div
                                                key={index}
                                                className="px-4 py-2 hover:bg-indigo-50 cursor-pointer transition-colors"
                                                onClick={() => handleCategorySelect(category)}
                                            >
                                                {category}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <input
                                    type="hidden"
                                    name="category"
                                    value={formData.category}
                                    required
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-gray-700 font-medium">Description <span className="text-red-500">*</span></label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Enter product description"
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Product Image</h3>

                                <div className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <input
                                        type="file"
                                        name="photo"
                                        id="product-photo"
                                        accept="image/*"
                                        onChange={handleChange}
                                        className="hidden"
                                        required
                                    />

                                    {!preview ? (
                                        <label htmlFor="product-photo" className="cursor-pointer block">
                                            <div className="mx-auto w-14 h-14 mb-3 rounded-full bg-indigo-50 flex items-center justify-center">
                                                <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                                                </svg>
                                            </div>
                                            <p className="text-indigo-600 font-medium text-sm">Click to upload image</p>
                                            <p className="text-gray-500 text-xs mt-1">SVG, PNG, JPG or GIF</p>
                                        </label>
                                    ) : (
                                        <div>
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded-lg mx-auto shadow"
                                            />
                                            <div className="mt-3 flex justify-center space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFormData({ ...formData, photo: null });
                                                        setPreview(null);
                                                    }}
                                                    className="text-red-500 font-medium text-xs"
                                                >
                                                    Remove
                                                </button>
                                                <label htmlFor="product-photo" className="text-indigo-600 font-medium text-xs cursor-pointer">
                                                    Change
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right column - Pricing */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Pricing Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1 text-gray-700 font-medium">New Price <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-500">{getCurrencySymbol(currentCurrency)}</span>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-gray-700 font-medium">Old Price</label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-3 text-gray-500">{getCurrencySymbol(currentCurrency)}</span>
                                            <input
                                                type="number"
                                                name="oldPrice"
                                                value={formData.oldPrice}
                                                onChange={handleChange}
                                                placeholder="0.00"
                                                className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="block mb-1 text-gray-700 font-medium">Discount</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="discount"
                                            value={formData.discount}
                                            onChange={handleChange}
                                            placeholder="Enter discount percentage"
                                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                                        />
                                        {!formData.discount && (
                                            <span className="absolute right-3 top-3 text-gray-400">%</span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Enter a numeric value only. Old price must be higher than current price.
                                    </p>
                                </div>

                                {formData.price && formData.oldPrice && (
                                    <div className="mt-4 bg-indigo-50 p-3 rounded-lg">
                                        <p className="text-sm text-indigo-700">
                                            <span className="font-medium">Savings: </span>
                                            {getCurrencySymbol(currentCurrency)}{(parseFloat(formData.oldPrice) - parseFloat(formData.price)).toFixed(2)}
                                            {' '}({Math.round((1 - parseFloat(formData.price) / parseFloat(formData.oldPrice)) * 100)}% off)
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Preview Card */}
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Product Preview</h3>

                                <div className="mt-4 bg-white border border-gray-200 rounded-lg overflow-hidden shadow">
                                    <div className="p-4">
                                        <div className="flex items-start space-x-4">
                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="w-20 h-20 object-cover rounded-lg shadow"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                </div>
                                            )}

                                            <div>
                                                <h4 className="font-medium text-gray-800">{formData.name || "Product Name"}</h4>
                                                <p className="text-gray-500 text-sm">{formData.category || "Category"}</p>

                                                <div className="flex items-center space-x-2 mt-2">
                                                    <span className="font-bold text-gray-900">{getCurrencySymbol(currentCurrency)}{parseFloat(formData.price || 0).toFixed(2)}</span>
                                                    {formData.oldPrice && (
                                                        <span className="text-gray-500 line-through text-sm">{getCurrencySymbol(currentCurrency)}{parseFloat(formData.oldPrice).toFixed(2)}</span>
                                                    )}
                                                    {formData.discount && (
                                                        <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full font-medium">
                                                            {formData.discount}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 text-sm mt-3 line-clamp-2">{formData.description || "No description provided"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !formData.photo || !formData.name || !formData.price || !formData.category || !formData.description}
                                    className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white ${isSubmitting || !formData.photo || !formData.name || !formData.price || !formData.category || !formData.description ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'} transition`}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            Upload Product
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
