    import React, { useState } from 'react';
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
        
        const handleChange = (e) => {
            const { name, value, files } = e.target;
        
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
                let formattedValue = value.replace('%', '').trim(); // remove existing %
        
                if (formattedValue !== '') {
                    formattedValue += '%';
                }
        
                setFormData({ ...formData, discount: formattedValue });
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
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-gray-700 font-medium">Discount</label>
                        <input
                            type="text"
                            name="discount"
                            value={formData.discount}
                            onChange={handleChange}
                            placeholder="Enter discount (e.g. -20%)"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
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
