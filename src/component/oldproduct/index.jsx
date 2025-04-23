// src/components/Product.js
import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { HiOutlineViewGrid } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import products from "../ProductData";
import { toast } from 'react-toastify';
import { addToCompare, removeFromCompare } from '../../redux/compareSlice';
import { removeProduct } from '../../redux/productSlice'; // Import this


export default function Product({ onCartOpen }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const wishlist = useSelector((state) => state.wishlist);
    const compareList = useSelector((state) => state.compare);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const toggleCompare = (product) => {
        const isCompared = compareList.some(item => item.id === product.id);
        if (isCompared) {
            dispatch(removeFromCompare(product));
            toast.info(`Removed from comparison Section`);
        } else {
            if (compareList.length >= 4) {
                toast.warning("You can only compare up to 4 products");
                return;
            }
            dispatch(addToCompare(product));
            toast.success(`Added to comparison section`);
        }
    };


    const [productStates, setProductStates] = useState(products.map(product => ({
        ...product,
        isFavorite: false, // Initial favorite state
    })));

    // const productStates = useSelector((state) => state.products);;

    const handleRemoveProduct = (productId) => {
        dispatch(removeProduct(productId)); // Update Redux state
        toast.info("Product removed from this section.");
    };



    const handleAddToCart = (product) => {
        dispatch(addItem({ ...product, quantity: 1 }));
        toast.success(`Add Product Succesfully`);
        // onCartOpen();
    };



    // Function to toggle favorite status
    const toggleFavorite = (product) => {
        const isWished = wishlist.some(item => item.id === product.id);
        if (isWished) {
            dispatch(removeFromWishlist(product));
            toast.info(`Removed from wishlist`);
        } else {
            dispatch(addToWishlist(product));
            toast.success(`Added to wishlist`);
        }
    };

    const filteredProducts = productStates.filter((product) => {
        const lowerSearch = searchTerm.toLowerCase();
        const name = product?.name?.toLowerCase() || "";
        const price = typeof product?.price === "number" ? product.price.toFixed(2) : "";
        const oldPrice = typeof product?.oldPrice === "number" ? product.oldPrice.toFixed(2) : "";


        return (
            name.includes(lowerSearch) ||
            price === searchTerm ||
            oldPrice === searchTerm
        );
    });


    return (
        <div className="py-10">
            <div className="flex flex-col justify-center items-center py-5">
                <h1 className="text-3xl font-bold text-center">Our Product</h1>
                <p className="pt-2 text-lg text-center">
                    We are passionate about transforming houses into beautiful homes with our exquisite collection of handcrafted furniture.
                </p>
            </div>

            <div className="w-full max-w-md mx-auto my-6">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 sm:px-10 md:px-20 lg:px-40">
                {filteredProducts.map((product) => {
                    const isWished = wishlist.some(item => item.id === product.id);

                    return (
                        <div key={product.id} className="relative group">
                            <div className="relative cursor-pointer">
                                <div onClick={() => navigate(`/product/${product.id}`)}>
                                    <img
                                        style={{ borderRadius: "20px" }}
                                        src={product.imgSrc}
                                        className="w-full h-auto mb-4"
                                        // className="h-[350px] w-[500px]   mb-4"
                                        alt={product.alt}
                                    />
                                </div>

                                {/* Heart icon */}

                                <div
                                    className={`absolute top-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isWished ? 'text-red-500' : 'text-gray-500'
                                        }`}
                                    onClick={() => toggleFavorite(product)}
                                >
                                    {isWished ? (
                                        <FaHeart className="text-xl" />
                                    ) : (
                                        <FaRegHeart className="text-xl" />
                                    )}
                                </div>

                                <div
                                    className="absolute top-10 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    onClick={() => handleViewDetails(product)}
                                >
                                    <HiOutlineViewGrid className="text-gray-500 text-xl size-6" />
                                </div>

                                <div
                                    className={`absolute top-20 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${compareList.some(item => item.id === product.id) ? 'text-blue-500' : 'text-gray-500'
                                        }`}
                                    onClick={() => toggleCompare(product)}
                                >
                                    <FaCodeCompare className="text-xl size-6" />
                                </div>


                                {showModal && selectedProduct && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
                                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-2xl relative animate-fade-in">
                                            {/* Close button */}
                                            <button
                                                onClick={closeModal}
                                                className="absolute top-3 right-3 text-gray-500 hover:text-black text-xl"
                                            >
                                                &times;
                                            </button>

                                            <div className="grid grid-cols-1 md:grid-cols-2">
                                                {/* Image section */}
                                                <div className="bg-gray-100 flex items-center justify-center p-4">
                                                    <img
                                                        src={selectedProduct.imgSrc}
                                                        alt={selectedProduct.alt}
                                                        className="max-h-72 object-contain rounded"
                                                    />
                                                </div>

                                                {/* Details section */}
                                                <div className="p-6 flex flex-col justify-between">
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h2>
                                                        <p className="text-sm text-gray-500 mb-4">
                                                            {selectedProduct.description || "No description available."}
                                                        </p>
                                                        <div className="flex items-center space-x-4 mb-4">
                                                            <span className="text-gray-400 line-through text-lg">
                                                                ${selectedProduct.oldPrice.toFixed(2)}
                                                            </span>
                                                            <span className="text-green-600 font-semibold text-xl">
                                                                ${selectedProduct.price.toFixed(2)}
                                                            </span>
                                                            <span className="bg-red-500 text-white px-2 py-0.5 text-sm rounded">
                                                                {selectedProduct.discount}
                                                            </span>
                                                        </div>
                                                        <span className="text-black text-sm rounded">
                                                            A long established fact that a reader will be distracted by the
                                                            readable content of a page when looking at its layout. The point
                                                            of using Lorem Ipsum is that it has a more-or-less normal
                                                            distribution of letters, as opposed
                                                        </span>
                                                    </div>

                                                    {/* CTA */}
                                                    <button
                                                        className="mt-4 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-all"
                                                        onClick={() => {
                                                            handleAddToCart(selectedProduct);
                                                            closeModal();
                                                        }}
                                                    >
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    style={{ borderRadius: "20px" }}
                                    className="absolute bottom-2 left-2 right-2 bg-white text-black font-semibold rounded py-2 hover:bg-white-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    onClick={() => handleAddToCart(product)}
                                >
                                    Add to Cart
                                </button>
                                <div className="bg-red-700 px-2 rounded absolute top-5 left-2 text-white">
                                    {product?.discount}
                                </div>
                                {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                                    <div
                                        className="absolute top-[-18px] left-[-20px] cursor-pointer text-white bg-black rounded-full w-6 h-6 flex items-center justify-center text-sm"
                                        onClick={() => handleRemoveProduct(product.id)}
                                    >
                                        &times;
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col justify-center items-center">
                                <h1 className="text-lg font-semibold">{product.name}</h1>
                                <div className="flex text-lg">
                                    {typeof product.oldPrice === "number" && (
                                        <h1 className="line-through">${product.oldPrice.toFixed(1)}</h1>
                                    )}
                                    {typeof product.price === "number" && (
                                        <h1 className="ml-5">${product.price.toFixed(1)}</h1>
                                    )}

                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
