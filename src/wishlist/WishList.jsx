import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromWishlist, clearWishlist } from '../redux/wishlistSlice';
import { useNavigate } from 'react-router-dom';
import { addItem } from '../redux/cartSlice';
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const WishList = ({ onCartOpen }) => {
    const wishlistItems = useSelector((state) => state.wishlist);
    const cartItems = useSelector((state) => state.cart.items);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    const [filterPrice, setFilterPrice] = useState('all');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); 

    const handleClearCart = async () => {
        try {
            setIsLoading(true);
            await dispatch(clearWishlist());
            toast.success('Wishlist cleared successfully');
            navigate('/');
        } catch (error) {
            toast.error('Failed to clear wishlist');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigateToPaymentPage = () => {
        if (cartItems.length > 0) {
            navigate('/product');
        }
    };

    const handleRemoveItem = async (item) => {
        try {
            setIsLoading(true);
            await dispatch(removeFromWishlist(item));
            toast.success('Item removed from wishlist');
        } catch (error) {
            toast.error('Failed to remove item');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = async (item) => {
        try {
            setIsLoading(true);
            await dispatch(addItem(item));
            onCartOpen();
            toast.success('Item added to cart');
        } catch (error) {
            toast.error('Failed to add item to cart');
        } finally {
            setIsLoading(false);
        }
    };

    const sortedAndFilteredItems = [...wishlistItems]
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                default:
                    return 0;
            }
        })
        .filter(item => {
            if (filterPrice === 'all') return true;
            if (filterPrice === 'under-50') return item.price < 50;
            if (filterPrice === '50-100') return item.price >= 50 && item.price <= 100;
            if (filterPrice === 'over-100') return item.price > 100;
            return true;
        });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header with enhanced styling */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
                >
                    <div className="flex items-center gap-4">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-200"
                            aria-label="Go back"
                        >
                            <FaArrowLeft className="text-xl" />
                        </motion.button>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
                            My Wishlist 
                            <span className="ml-2 text-orange-500">({wishlistItems.length})</span>
                        </h1>
                    </div>
                    
                    {/* Enhanced Sort & Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm text-gray-700 hover:border-gray-400 transition-all"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                        <select
                            value={filterPrice}
                            onChange={(e) => setFilterPrice(e.target.value)}
                            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm text-gray-700 hover:border-gray-400 transition-all"
                        >
                            <option value="all">All Prices</option>
                            <option value="under-50">Under $50</option>
                            <option value="50-100">$50 - $100</option>
                            <option value="over-100">Over $100</option>
                        </select>
                    </div>
                </motion.div>

                {/* Enhanced Wishlist Grid */}
                {wishlistItems.length > 0 ? (
                    <AnimatePresence>
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            {sortedAndFilteredItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    <div className="relative group">
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 0.3 }}
                                            src={item.imgSrc}
                                            alt={item.name}
                                            className="w-full h-56 object-cover cursor-pointer"
                                            onClick={() => navigate(`/product/${item.id}`)}
                                        />
                                        {item.discount && (
                                            <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-lg">
                                                {item.discount} OFF
                                            </div>
                                        )}
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => handleRemoveItem(item)}
                                            className="absolute top-3 right-3 p-2.5 bg-white rounded-full shadow-lg hover:bg-red-50 transition-all duration-300"
                                            aria-label="Remove from wishlist"
                                        >
                                            <FaTrash className="text-red-500" />
                                        </motion.button>
                                    </div>
                                    <div className="p-5">
                                        <h3
                                            className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-orange-500 transition-colors line-clamp-2"
                                            onClick={() => navigate(`/product/${item.id}`)}
                                        >
                                            {item.name}
                                        </h3>
                                        <p className="text-2xl font-bold text-gray-900 mb-4">
                                            ${parseFloat(item.price).toFixed(2)}
                                        </p>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAddToCart(item)}
                                            disabled={isLoading}
                                            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 shadow-md hover:shadow-lg"
                                        >
                                            <FaShoppingCart className="text-lg" />
                                            <span className="font-medium">Add to Cart</span>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-sm"
                    >
                        <motion.div
                            animate={{ 
                                scale: [1, 1.1, 1],
                                rotate: [0, 10, -10, 0]
                            }}
                            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                        >
                            <FaHeart className="mx-auto text-gray-400 text-7xl mb-6" />
                        </motion.div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-8 text-lg">Add items that you like to your wishlist</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/product')}
                            className="bg-orange-500 text-white py-3 px-8 rounded-lg hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-lg"
                        >
                            Continue Shopping
                        </motion.button>
                    </motion.div>
                )}

                {/* Enhanced Bottom Buttons */}
                {wishlistItems.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-between"
                    >
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleClearCart}
                            disabled={isLoading}
                            className="w-full sm:w-auto bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg font-medium"
                        >
                            Clear Wishlist
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleNavigateToPaymentPage}
                            disabled={cartItems.length === 0 || isLoading}
                            className="w-full sm:w-auto bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-all duration-300 disabled:opacity-50 shadow-md hover:shadow-lg font-medium"
                        >
                            Back to Products
                        </motion.button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default WishList;
