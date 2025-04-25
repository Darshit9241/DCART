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
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTicketAlt, FaKey, FaCamera } from "react-icons/fa";

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
  const [userPhoto, setUserPhoto] = useState(null);
  const profileMenuRef = useRef(null);
  const searchModalRef = useRef(null);
  const fileInputRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems.length;

  const wishlistItems = useSelector((state) => state.wishlist);
  const wishlistCount = wishlistItems.length;

  const compareItems = useSelector((state) => state.compare);
  const compareCount = compareItems.length;

  const userEmail = localStorage.getItem("userEmail");
  const username = userEmail ? userEmail.split("@")[0] : null;

  // Load user photo from localStorage
  useEffect(() => {
    const storedPhoto = localStorage.getItem("userPhoto");
    if (storedPhoto) {
      setUserPhoto(storedPhoto);
      console.log("Photo loaded from localStorage in Header");
    }
  }, [userEmail]);

  // Force header to update when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedPhoto = localStorage.getItem("userPhoto");
      if (storedPhoto) {
        setUserPhoto(storedPhoto);
      } else {
        setUserPhoto(null);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

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
    // Close mobile menu when clicking outside
    if (
      isMobileMenuOpen &&
      mobileMenuRef.current && 
      !mobileMenuRef.current.contains(event.target)
    ) {
      // Don't close if clicking the menu button
      if (!event.target.closest('button[aria-label="toggle-mobile-menu"]')) {
        setIsMobileMenuOpen(false);
      }
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
    // Clear all user data
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhoto");
    
    // Clear local state
    setUserPhoto(null);
    
    // Trigger storage event for any other components
    window.dispatchEvent(new Event('storage'));
    
    // Close menus and navigate to login
    setIsProfileMenuOpen(false);
    navigate("/login");
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

  const handleForgotPassword = () => {
    navigate("/forgot-password");
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleProfilePhotoClick = (e) => {
    if (userEmail) {
      e.stopPropagation(); // Prevent opening/closing the profile menu
      fileInputRef.current.click();
    } else {
      toggleProfileMenu();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result;
        // Save to localStorage
        localStorage.setItem("userPhoto", photoData);
        // Update state
        setUserPhoto(photoData);
        // Trigger storage event for other components
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
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
                aria-label="toggle-mobile-menu"
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
                    {(userPhoto || localStorage.getItem("userPhoto")) && userEmail ? (
                      <div 
                        className="w-8 h-8 rounded-full overflow-hidden relative group cursor-pointer"
                        onClick={handleProfilePhotoClick}
                      >
                        <img 
                          src={userPhoto || localStorage.getItem("userPhoto")} 
                          alt="User" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error("Error loading user photo");
                            e.target.src = "https://via.placeholder.com/40"; // Fallback image
                          }}
                        />
                        {userEmail && (
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                            <FaCamera className="text-white text-lg" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <CgProfile className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                    )}
                  </button>

                  {/* Hidden file input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />

                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 animate-fadeIn">
                      <div className="py-2">
                        {userEmail && (
                          <div className="px-4 py-3 border-b border-gray-100 flex items-center space-x-3">
                            <div 
                              className="w-10 h-10 rounded-full overflow-hidden relative group cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current.click();
                              }}
                            >
                              {(userPhoto || localStorage.getItem("userPhoto")) ? (
                                <>
                                  <img 
                                    src={userPhoto || localStorage.getItem("userPhoto")} 
                                    alt="User" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.src = "https://via.placeholder.com/40";
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                                    <FaCamera className="text-white text-lg" />
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <FaCamera className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Welcome To Dcart!</p>
                              <p className="text-sm text-gray-600 truncate">{username}</p>
                            </div>
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
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={handleClickOutside}>
            <div 
              ref={mobileMenuRef}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out animate-slide-in-left overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Menu Header with logo and close button */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center">
                  <span className="text-2xl font-bold text-[#FF7004] font-dcart tracking-wider">DCART</span>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                >
                  <IoMdClose className="h-6 w-6" />
                </button>
              </div>

              {/* User Profile Section - if logged in */}
              {userEmail && (
                <div className="px-4 py-5 bg-gradient-to-r from-orange-50 to-white">
                  <div className="flex items-center space-x-4">
                    <div 
                      className="w-14 h-14 rounded-full overflow-hidden relative group cursor-pointer shadow-sm border-2 border-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current.click();
                      }}
                    >
                      {(userPhoto || localStorage.getItem("userPhoto")) ? (
                        <>
                          <img 
                            src={userPhoto || localStorage.getItem("userPhoto")} 
                            alt="User" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/40";
                            }}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100">
                            <FaCamera className="text-white text-lg" />
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          <FaCamera className="text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Welcome To Dcart!</p>
                      <p className="text-base font-semibold text-[#FF7004] truncate">{username}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main menu items */}
              <div className="flex-grow overflow-y-auto py-2 px-2">
                <div className="space-y-1">
                  {/* Quick Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 p-2 mb-3">
                    <button
                      onClick={handleCartClick}
                      className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-orange-50 transition-colors"
                    >
                      <div className="relative">
                        <FaShoppingBag className="text-xl text-gray-700 mb-1" />
                        {cartItemCount > 0 && localStorage.getItem("token") && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {cartItemCount}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium">Cart</span>
                    </button>
                    
                    <button
                      onClick={handleWishList}
                      className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-orange-50 transition-colors"
                    >
                      <div className="relative">
                        <FaHeart className="text-xl text-gray-700 mb-1" />
                        {wishlistCount > 0 && localStorage.getItem("token") && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {wishlistCount}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium">Wishlist</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 p-2 mb-4">
                    <button
                      onClick={handleCompareList}
                      className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-orange-50 transition-colors"
                    >
                      <div className="relative">
                        <IoMdGitCompare className="text-xl text-gray-700 mb-1" />
                        {compareCount > 0 && localStorage.getItem("token") && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {compareCount}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium">Compare</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate("/view-all-order");
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-orange-50 transition-colors"
                    >
                      <FiPackage className="text-xl text-gray-700 mb-1" />
                      <span className="text-sm font-medium">Orders</span>
                    </button>
                  </div>
                  
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Account
                  </div>

                  {!userEmail ? (
                    <>
                      <button
                        onClick={handleSignInClick}
                        className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-orange-50 rounded-xl"
                      >
                        <FaUserPlus className="text-lg text-gray-500" />
                        <span className="font-medium">Sign Up</span>
                      </button>

                      <button
                        onClick={handleLogInClick}
                        className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-orange-50 rounded-xl"
                      >
                        <FaSignInAlt className="text-lg text-gray-500" />
                        <span className="font-medium">Log In</span>
                      </button>

                      <button
                        onClick={handleForgotPassword}
                        className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-orange-50 rounded-xl"
                      >
                        <FaKey className="text-lg text-gray-500" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-orange-50 rounded-xl"
                    >
                      <FaSignOutAlt className="text-lg text-gray-500" />
                      <span className="font-medium">Log Out</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      navigate("/Coupon");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-orange-50 rounded-xl"
                  >
                    <FaTicketAlt className="text-lg text-gray-500" />
                    <span className="font-medium">Coupon</span>
                  </button>
                </div>
              </div>
              
              {/* Admin section if admin user */}
              {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                <div className="p-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      navigate("/addproduct");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 p-3 bg-[#2F333A] text-white rounded-xl hover:bg-[#444848] transition-all"
                  >
                    <span className="font-medium">Add Product</span>
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
