// src/components/Product.js
import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { HiOutlineViewGrid } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../redux/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
// import products from "../ProductData";
import { toast } from 'react-toastify';
import { addToCompare, removeFromCompare } from '../../redux/compareSlice';
import { removeProduct } from '../../redux/productSlice'; // Import this
import { IoIosCloseCircle } from "react-icons/io";
import { BsArrowRight } from "react-icons/bs";

export default function Product({ onCartClick, onCartOpen }) {
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


  // const [productStates, setProductStates] = useState(products.map(product => ({
  //   ...product,
  //   isFavorite: false, // Initial favorite state
  // })));

  const productStates = useSelector((state) => state.products);;

  const handleRemoveProduct = (productId) => {
    dispatch(removeProduct(productId)); // Update Redux state
    toast.info("Product removed from this section.");
  };

  const handleAddToCart = (product) => {
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/login")
      return; // Exit the function if the user is not logged in
    }

    dispatch(addItem({ ...product, quantity: 1 }));
    toast.success("Product added from cart section.");
    // onCartClick();
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

  // Sort products by id in descending order (newest first)
  const sortedProducts = [...filteredProducts].sort((a, b) => b.id - a.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
            Our Collection
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            We are passionate about transforming houses into beautiful homes with our exquisite collection of handcrafted furniture.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200 shadow-sm"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {sortedProducts.map((product) => {
            const isWished = wishlist.some(item => item.id === product.id);
            const isCompared = compareList.some(item => item.id === product.id);

            return (
              <div key={product.id} className="group bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="relative">
                  <div className="overflow-hidden rounded-t-3xl">
                    <img
                      onClick={() => navigate(`/product/${product.id}`)}
                      src={product.imgSrc}
                      alt={product.name}
                      className="w-full h-[300px] object-cover transform group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                    />
                  </div>

                  <div className="absolute top-4 right-4 flex flex-col gap-3">
                    <button
                      onClick={() => toggleFavorite(product)}
                      className={`p-2.5 rounded-full ${isWished ? 'bg-red-50 text-red-500' : 'bg-white/90 text-gray-600'} shadow-md backdrop-blur-sm hover:scale-110 transition-all duration-200`}
                    >
                      {isWished ? <FaHeart className="text-xl" /> : <FaRegHeart className="text-xl" />}
                    </button>

                    <button
                      onClick={() => handleViewDetails(product)}
                      className="p-2.5 rounded-full bg-white/90 shadow-md backdrop-blur-sm hover:bg-black hover:text-white text-gray-600 hover:scale-110 transition-all duration-200"
                    >
                      <HiOutlineViewGrid className="text-xl" />
                    </button>

                    <button
                      onClick={() => toggleCompare(product)}
                      className={`p-2.5 rounded-full shadow-md backdrop-blur-sm hover:scale-110 transition-all duration-200 ${isCompared ? 'bg-blue-50 text-blue-500' : 'bg-white/90 text-gray-600'}`}
                    >
                      <FaCodeCompare className="text-xl" />
                    </button>

                    {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                      <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="p-2.5 rounded-full bg-red-50 text-red-500 shadow-md backdrop-blur-sm hover:scale-110 transition-all duration-200"
                      >
                        <IoIosCloseCircle className="text-xl" />
                      </button>
                    )}
                  </div>

                  {product?.discount && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3.5 py-1.5 rounded-full shadow-lg transform rotate-2 -skew-x-6">
                      {product.discount} OFF
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-black transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    {typeof product.oldPrice === "number" && product.oldPrice > 0 && (
                      <span className="text-gray-400 line-through">${product.oldPrice.toFixed(2)}</span>
                    )}
                    {typeof product.price === "number" && (
                      <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 group-hover:shadow-lg flex items-center justify-center"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="p-3 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-300"
                    >
                      <BsArrowRight className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
                <div className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedProduct.imgSrc}
                    alt={selectedProduct.name}
                    className="max-h-[450px] object-contain transform hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <div className="flex flex-col py-6">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-gray-400 line-through text-xl">
                      ${selectedProduct.oldPrice ? selectedProduct.oldPrice.toFixed(2) : '0.00'}
                    </span>
                    <span className="text-3xl font-bold text-gray-900">
                      ${selectedProduct.price.toFixed(2)}
                    </span>
                    {selectedProduct.discount && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {selectedProduct.discount}
                      </span>
                    )}
                  </div>

                  <div className="h-px w-full bg-gray-100 my-6"></div>

                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {selectedProduct.description || 
                      "A long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed"}
                  </p>

                  <div className="mt-auto">
                    <button
                      onClick={() => {
                        handleAddToCart(selectedProduct);
                        closeModal();
                      }}
                      className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
