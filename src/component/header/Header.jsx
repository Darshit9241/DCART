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
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl md:text-3xl font-bold text-[#FF7004] font-dcart tracking-wider hover:text-orange-600 transition-colors duration-300">
                DCART
              </span>
            </Link>

            {/* Mobile menu button */}
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
                  onClick={() => navigate("/allorderspage")}
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
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50">
              <div className="grid grid-cols-2 gap-4 p-4">
                <button
                  onClick={handleCartClick}
                  className="relative flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:bg-orange-50 transition-colors duration-200"
                >
                  <FaShoppingBag className="text-2xl text-gray-700" />
                  <span className="mt-1 text-sm text-gray-600">Cart</span>
                  {cartItemCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleWishList}
                  className="relative flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:bg-orange-50 transition-colors duration-200"
                >
                  <FaHeart className="text-2xl text-gray-700" />
                  <span className="mt-1 text-sm text-gray-600">Wishlist</span>
                  {wishlistCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={handleCompareList}
                  className="relative flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:bg-orange-50 transition-colors duration-200"
                >
                  <IoMdGitCompare className="text-2xl text-gray-700" />
                  <span className="mt-1 text-sm text-gray-600">Compare</span>
                  {compareCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {compareCount}
                    </span>
                  )}
                </button>


                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate("/view-all-order");
                  }}
                  className="flex flex-col items-center justify-center p-3 bg-white rounded-lg shadow-sm hover:bg-orange-50 transition-colors duration-200"
                >
                  <FiPackage className="text-2xl text-gray-700" />
                  <span className="mt-1 text-sm text-gray-600">Orders</span>
                </button>
              </div>

              <div className="px-4 py-3 border-t border-gray-200">
                {userEmail ? (
                  <div className="flex flex-col space-y-2">
                    <p className="text-sm font-medium text-gray-900">Welcome, {username}!</p>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-sm text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors duration-200"
                    >
                      Log Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <button
                      onClick={handleLogInClick}
                      className="w-full px-4 py-2 text-sm text-white bg-orange-500 rounded-md hover:bg-orange-600 transition-colors duration-200"
                    >
                      Log In
                    </button>
                    <button
                      onClick={handleSignInClick}
                      className="w-full px-4 py-2 text-sm text-orange-500 bg-orange-50 rounded-md hover:bg-orange-100 transition-colors duration-200"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>

              {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                <div className="px-4 py-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigate('/addproduct');
                    }}

                    className="w-full px-4 py-2 text-sm text-white bg-[#2F333A] rounded-md hover:bg-[#444848] transition-colors duration-200"
                  >
                    Add Product
                  </button>
                </div>
              )}
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
