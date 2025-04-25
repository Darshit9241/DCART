import React, { useState, useEffect, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { FaShoppingBag, FaHeart } from "react-icons/fa";
import { IoMdGitCompare } from "react-icons/io";
import { HiMenu } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiPackage } from "react-icons/fi";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTicketAlt } from "react-icons/fa";

// Add animation styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInLeft {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(0);
    }
  }
  .animate-slide-in-left {
    animation: slideInLeft 0.3s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default function Header() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const searchModalRef = useRef(null);
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems.length;

  const wishlistItems = useSelector((state) => state.wishlist);
  const wishlistCount = wishlistItems.length;

  const compareItems = useSelector((state) => state.compare);
  const compareCount = compareItems.length;

  const userEmail = localStorage.getItem("userEmail");
  const username = userEmail ? userEmail.split("@")[0] : null;

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target)
    ) {
      setIsProfileMenuOpen(false);
    }
    if (
      searchModalRef.current &&
      !searchModalRef.current.contains(event.target)
    ) {
      setIsSearchModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSignInClick = () => {
    navigate("/sign-up");
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false)
  };

  const handleLogInClick = () => {
    navigate("/login");
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false)
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
    setIsProfileMenuOpen(false);
    window.location.reload();
  };

  const handleWishList = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/WishList");
    } else {
      navigate("/login");
    }
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false)
  };

  const handleCompareList = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/compare");
    } else {
      navigate("/login");
    }
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false)
  };

  const handleCartClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false)

  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white py-3 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Mobile menu button - Now on the left */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-orange-500 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <IoMdClose className="h-6 w-6" />
                ) : (
                  <HiMenu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Logo - Moved to the right on mobile */}
            <Link to="/" className="flex items-center order-last md:order-first">
              <span className="text-2xl md:text-3xl font-bold text-[#FF7004] font-dcart tracking-wider hover:text-orange-600 transition-colors duration-300">
                DCART
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex space-x-6 items-center">
                {/* Profile */}
                <div className="relative" ref={profileMenuRef}>
                  <button
                    className="flex items-center space-x-1 group"
                    onClick={toggleProfileMenu}
                  >
                    <CgProfile className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                  </button>

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 animate-fadeIn">
                      <div className="py-2">
                        {userEmail && (
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                            <p className="text-sm text-gray-600 truncate">{username}</p>
                          </div>
                        )}
                        <div className="px-2 py-2 space-y-1">
                          <button
                            onClick={handleSignInClick}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
                          >
                            <FaUserPlus /> Sign Up
                          </button>

                          <button
                            onClick={handleLogInClick}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
                          >
                            <FaSignInAlt /> Log In
                          </button>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
                          >
                            <FaSignOutAlt /> Log Out
                          </button>

                          <button
                            onClick={() => navigate("/Coupon")}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
                          >
                            <FaTicketAlt /> Coupon
                          </button>

                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart */}
                <button
                  onClick={handleCartClick}
                  className="relative group"
                >
                  <FaShoppingBag className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                  {cartItemCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                {/* Wishlist */}
                <button
                  onClick={handleWishList}
                  className="relative group"
                >
                  <FaHeart className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                  {wishlistCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Compare */}
                <button
                  onClick={handleCompareList}
                  className="relative group"
                >
                  <IoMdGitCompare className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                  {compareCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {compareCount}
                    </span>
                  )}
                </button>

                {/* Orders */}
                <button
                  onClick={() => navigate("/view-all-order")}
                  className="group"
                >
                  <FiPackage className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                </button>

                {/* Admin Product Add Button */}
                {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                  <button
                    onClick={() => navigate(`/addproduct`)}
                    className="px-4 py-2 bg-[#2F333A] text-white text-sm font-semibold rounded-lg shadow-md hover:bg-[#444848] transition-all duration-300 transform hover:scale-105"
                  >
                    Add Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
            <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out animate-slide-in-left">
              {/* Mobile Menu Header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <span className="text-xl font-bold text-[#FF7004]">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <IoMdClose className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Menu Items */}
              <div className="py-4 px-4 space-y-3 overflow-y-auto max-h-[calc(100vh-80px)]">
                {userEmail && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                    <p className="text-sm text-gray-600 truncate">{username}</p>
                  </div>
                )}

                <button
                  onClick={handleCartClick}
                  className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FaShoppingBag className="text-xl" />
                    <span>Cart</span>
                  </div>
                  {cartItemCount > 0 && localStorage.getItem("token") && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleWishList}
                  className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <FaHeart className="text-xl" />
                    <span>Wishlist</span>
                  </div>
                  {wishlistCount > 0 && localStorage.getItem("token") && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleCompareList}
                  className="w-full flex items-center justify-between p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <IoMdGitCompare className="text-xl" />
                    <span>Compare</span>
                  </div>
                  {compareCount > 0 && localStorage.getItem("token") && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {compareCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    navigate("/view-all-order");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg"
                >
                  <FiPackage className="text-xl" />
                  <span>Orders</span>
                </button>

                <div className="border-t border-gray-200 my-4"></div>

                {!userEmail ? (
                  <>
                    <button
                      onClick={handleSignInClick}
                      className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg"
                    >
                      <FaUserPlus className="text-xl" />
                      <span>Sign Up</span>
                    </button>

                    <button
                      onClick={handleLogInClick}
                      className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg"
                    >
                      <FaSignInAlt className="text-xl" />
                      <span>Log In</span>
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg"
                  >
                    <FaSignOutAlt className="text-xl" />
                    <span>Log Out</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    navigate("/Coupon");
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg"
                >
                  <FaTicketAlt className="text-xl" />
                  <span>Coupon</span>
                </button>

                {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                  <button
                    onClick={() => {
                      navigate("/addproduct");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-3 bg-[#2F333A] text-white hover:bg-[#444848] rounded-lg"
                  >
                    <span>Add Product</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div ref={searchModalRef} className="bg-white p-6 rounded-xl shadow-xl w-11/12 max-w-lg mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Search Products</h2>
              <button
                onClick={() => setIsSearchModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <IoMdClose className="h-6 w-6" />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
