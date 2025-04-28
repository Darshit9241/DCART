import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { addProduct } from '../../redux/productSlice';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        oldPrice: '',
        discount: '',
        description: '',
        photo: null,
    });
    const dispatch = useDispatch();

    const [preview, setPreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
        const base64Image = await fileToBase64(formData.photo);
        const newProduct = {
            id: Date.now(),
            name: formData.name,
            price: parseFloat(formData.price),
            oldPrice: parseFloat(formData.oldPrice),
            discount: formData.discount,
            description: formData.description,
            imgSrc: base64Image, // which is already a blob, and still temporary
            alt: formData.name,
        };
        console.log('newProduct: ', newProduct);
        dispatch(addProduct(newProduct));
        toast.success("Product uploaded successfully!");
        setFormData({
            name: '',
            price: '',
            oldPrice: '',
            discount: '',
            description: '',
            photo: null,
        });
        setPreview("")
        navigate('/')
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-6"
            >
                <h2 className="text-2xl font-semibold text-center text-gray-800">Upload Product</h2>

                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                        min="0"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Old Price</label>
                    <input
                        type="number"
                        name="oldPrice"
                        value={formData.oldPrice}
                        onChange={handleChange}
                        placeholder="Enter old price"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        min="0"
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Discount</label>
                    <input
                        type="text"
                        name="discount"
                        value={formData.discount}
                        onChange={handleChange}
                        placeholder="Enter discount percentage (e.g. 20)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Enter a numeric value only. The old price must be higher than the new price.
                    </p>
                </div>

                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Enter product description"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows="3"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 text-gray-700 font-medium">Attach Photo</label>
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-2 py-2 bg-white focus:outline-none"
                        required
                    />
                </div>

                {preview && (
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-2">Preview:</p>
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg mx-auto shadow"
                        />
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Upload
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
