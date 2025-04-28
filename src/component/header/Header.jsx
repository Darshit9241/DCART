import React, { useState, useEffect, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { FaShoppingBag, FaHeart } from "react-icons/fa";
import { IoMdGitCompare } from "react-icons/io";
import { HiMenu } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiPackage, FiUpload } from "react-icons/fi";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTicketAlt, FaHome, FaCamera } from "react-icons/fa";

export default function Header() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const profileMenuRef = useRef(null);
  const sidebarRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems.length;

  const wishlistItems = useSelector((state) => state.wishlist);
  const wishlistCount = wishlistItems.length;

  const compareItems = useSelector((state) => state.compare);
  const compareCount = compareItems.length;

  const userEmail = localStorage.getItem("userEmail");
  const username = userEmail ? userEmail.split("@")[0] : null;

  useEffect(() => {
    // Check if there's a saved profile image in localStorage
    const savedProfileImage = localStorage.getItem("profileImage");
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleClickOutside = (event) => {
    if (
      profileMenuRef.current &&
      !profileMenuRef.current.contains(event.target)
    ) {
      setIsProfileMenuOpen(false);
    }
    
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target) &&
      !event.target.closest('[data-menu-button]')
    ) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Prevent scrolling when sidebar is open
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }
    
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isSidebarOpen]);

  const handleSignInClick = () => {
    navigate("/sign-up");
    setIsProfileMenuOpen(false);
    setIsSidebarOpen(false);
  };

  const handleLogInClick = () => {
    navigate("/login");
    setIsProfileMenuOpen(false);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    // Don't remove the profile image on logout if you want to keep it
    // localStorage.removeItem("profileImage");
    navigate("/login");
    setIsProfileMenuOpen(false);
    setIsSidebarOpen(false);
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
    setIsSidebarOpen(false);
  };

  const handleCompareList = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/compare");
    } else {
      navigate("/login");
    }
    setIsProfileMenuOpen(false);
    setIsSidebarOpen(false);
  };

  const handleCartClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/cart");
    } else {
      navigate("/login");
    }
    setIsProfileMenuOpen(false);
    setIsSidebarOpen(false);
  };

  const navigateTo = (path) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        setProfileImage(imageDataUrl);
        // Save to localStorage
        localStorage.setItem("profileImage", imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
        accept="image/*"
      />
      
      {/* Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 bg-white py-3 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Menu Button */}
            <button
              data-menu-button
              onClick={toggleSidebar}
              className="text-gray-700 hover:text-orange-500 focus:outline-none transition-colors duration-300"
            >
              <HiMenu className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-2xl md:text-3xl font-bold text-[#FF7004] font-dcart tracking-wider hover:text-orange-600 transition-colors duration-300">
                DCART
              </span>
            </Link>

            {/* Quick Actions */}
            <div className="flex space-x-4 items-center">
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
              
              {/* Profile */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  className="flex items-center space-x-1 group"
                  onClick={toggleProfileMenu}
                >
                  {profileImage ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200 hover:border-orange-500 transition-colors duration-300">
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <CgProfile className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                  )}
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 animate-fadeIn">
                    <div className="py-2">
                      {userEmail && (
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">Welcome back!</p>
                          <p className="text-sm text-gray-600 truncate">{username}</p>
                          
                          {/* Profile Image */}
                          <div className="mt-3 flex items-center justify-center">
                            <div 
                              className="group relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer"
                              onClick={triggerFileInput}
                            >
                              {profileImage ? (
                                <>
                                  <img 
                                    src={profileImage} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300">
                                    <FaCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <FaCamera className="text-gray-400 text-xl" />
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-center mt-1 text-gray-500">Click to change</p>
                        </div>
                      )}
                      <div className="px-2 py-2 space-y-1">
                        {!userEmail ? (
                          <>
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
                          </>
                        ) : (
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
                          >
                            <FaSignOutAlt /> Log Out
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link to="/" className="flex items-center" onClick={() => setIsSidebarOpen(false)}>
              <span className="text-2xl font-bold text-[#FF7004] font-dcart tracking-wider">
                DCART
              </span>
            </Link>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-gray-500 hover:text-orange-500 focus:outline-none"
            >
              <IoMdClose className="h-6 w-6" />
            </button>
          </div>

          {/* User Info */}
          {userEmail && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center">
                {/* Profile image */}
                <div 
                  className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer mr-3 group"
                  onClick={triggerFileInput}
                >
                  {profileImage ? (
                    <>
                      <img 
                        src={profileImage} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center transition-all duration-300">
                        <FiUpload className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <CgProfile className="text-gray-400 text-2xl" />
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Welcome!</p>
                  <p className="text-sm text-gray-600 truncate">{username}</p>
                  <p className="text-xs text-gray-500 mt-1">Tap image to change</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-1">
              <button
                onClick={() => navigateTo('/')}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
              >
                <FaHome className="text-lg" />
                <span>Home</span>
              </button>

              <button
                onClick={handleCartClick}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
              >
                <div className="relative">
                  <FaShoppingBag className="text-lg" />
                  {cartItemCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </div>
                <span>Cart</span>
              </button>

              <button
                onClick={handleWishList}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
              >
                <div className="relative">
                  <FaHeart className="text-lg" />
                  {wishlistCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span>Wishlist</span>
              </button>

              <button
                onClick={handleCompareList}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
              >
                <div className="relative">
                  <IoMdGitCompare className="text-lg" />
                  {compareCount > 0 && localStorage.getItem("token") && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {compareCount}
                    </span>
                  )}
                </div>
                <span>Compare</span>
              </button>

              <button
                onClick={() => navigateTo("/allorderspage")}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
              >
                <FiPackage className="text-lg" />
                <span>Orders</span>
              </button>

              <button
                onClick={() => navigateTo("/Coupon")}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors duration-200"
              >
                <FaTicketAlt className="text-lg" />
                <span>Coupons</span>
              </button>
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            {userEmail ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                <FaSignOutAlt />
                <span>Log Out</span>
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleLogInClick}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-200"
                >
                  <FaSignInAlt />
                  <span>Log In</span>
                </button>
                <button
                  onClick={handleSignInClick}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-orange-500 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors duration-200"
                >
                  <FaUserPlus />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>

          {/* Admin Section */}
          {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => navigateTo('/addproduct')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white bg-[#2F333A] rounded-lg hover:bg-[#444848] transition-colors duration-200"
              >
                <span>Add Product</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
