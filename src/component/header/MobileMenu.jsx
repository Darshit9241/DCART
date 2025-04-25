import React, { useRef, forwardRef } from 'react';
import { Link } from "react-router-dom";
import { IoMdClose, IoMdGitCompare } from "react-icons/io";
import { FaShoppingBag, FaHeart, FaUserPlus, FaSignInAlt, FaSignOutAlt, FaTicketAlt, FaKey, FaCamera, FaMoon, FaSun, FaQrcode } from "react-icons/fa";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiPackage } from "react-icons/fi";
import { BiSearch } from "react-icons/bi";

const MobileMenu = forwardRef(({
  setIsMobileMenuOpen,
  userEmail,
  username,
  userPhoto,
  isAdmin,
  fileInputRef,
  cartItemCount,
  wishlistCount,
  compareCount,
  darkMode,
  toggleDarkMode,
  handleNavigate,
  handleAuthRequiredNavigate,
  handleLogout,
  setIsNotificationsOpen,
  setIsSearchModalOpen,
  setIsQrScannerOpen
}, ref) => {
  // For swipe gesture detection
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  // Handle swipe gesture
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 100) {
      // Swiped left, close the menu
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-fadeIn" onClick={() => setIsMobileMenuOpen(false)}>
      <div 
        ref={ref}
        className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out animate-slide-in-left flex flex-col"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '85%' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile Menu Header - Fixed */}
        <div className="sticky top-0 z-10 bg-white">
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
            <div className="px-4 py-4 bg-gradient-to-r from-orange-50 to-white border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-14 h-14 rounded-full overflow-hidden relative group cursor-pointer shadow-sm border-2 border-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current.click();
                  }}
                >
                  {userPhoto ? (
                    <>
                      <img 
                        src={userPhoto} 
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
        </div>

        {/* Main menu items - Scrollable */}
        <div className="flex-grow overflow-y-auto py-2 px-2 overscroll-contain">
          <div className="space-y-1">
            {/* Quick Action Buttons */}
            <div className="grid grid-cols-3 gap-2 p-2 mb-3">
              <button
                onClick={() => handleAuthRequiredNavigate("/cart")}
                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 transition-colors"
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
                onClick={() => handleAuthRequiredNavigate("/WishList")}
                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 transition-colors"
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

              <button
                onClick={() => {
                  setIsNotificationsOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 transition-colors"
              >
                <div className="relative">
                  <IoNotificationsOutline className="text-xl text-gray-700 mb-1" />
                </div>
                <span className="text-sm font-medium">Alerts</span>
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-2 p-2 mb-4">
              <button
                onClick={() => handleAuthRequiredNavigate("/compare")}
                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 transition-colors"
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
                onClick={() => handleNavigate("/view-all-order")}
                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 transition-colors"
              >
                <FiPackage className="text-xl text-gray-700 mb-1" />
                <span className="text-sm font-medium">Orders</span>
              </button>
              
              <button
                onClick={toggleDarkMode}
                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 transition-colors"
              >
                {darkMode ? (
                  <>
                    <FaSun className="text-xl text-gray-700 mb-1" />
                    <span className="text-sm font-medium">Light</span>
                  </>
                ) : (
                  <>
                    <FaMoon className="text-xl text-gray-700 mb-1" />
                    <span className="text-sm font-medium">Dark</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 p-2 mb-4">
              <button
                onClick={() => {
                  setIsQrScannerOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 transition-colors"
              >
                <FaQrcode className="text-xl text-gray-700 mb-1" />
                <span className="text-sm font-medium">QR Scan</span>
              </button>
              
              <button
                onClick={() => {
                  setIsSearchModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:bg-orange-50 transition-colors"
              >
                <BiSearch className="text-xl text-gray-700 mb-1" />
                <span className="text-sm font-medium">Search</span>
              </button>
            </div>
            
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account
            </div>

            {!userEmail ? (
              <>
                <button
                  onClick={() => handleNavigate("/sign-up")}
                  className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-orange-50 rounded-xl"
                >
                  <FaUserPlus className="text-lg text-gray-500" />
                  <span className="font-medium">Sign Up</span>
                </button>

                <button
                  onClick={() => handleNavigate("/login")}
                  className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-orange-50 rounded-xl"
                >
                  <FaSignInAlt className="text-lg text-gray-500" />
                  <span className="font-medium">Log In</span>
                </button>

                <button
                  onClick={() => handleNavigate("/forgot-password")}
                  className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-orange-50 rounded-xl"
                >
                  <FaKey className="text-lg text-gray-500" />
                  <span className="font-medium">Forgot Password</span>
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
              onClick={() => handleNavigate("/Coupon")}
              className="w-full flex items-center gap-3 p-4 text-gray-700 hover:bg-orange-50 rounded-xl"
            >
              <FaTicketAlt className="text-lg text-gray-500" />
              <span className="font-medium">Coupon</span>
            </button>
            
            {/* Add padding to ensure content scrolls properly on all screen sizes */}
            <div className="h-16"></div>
          </div>
        </div>
        
        {/* Admin section if admin user - Fixed at the bottom */}
        {isAdmin && (
          <div className="sticky bottom-0 p-4 border-t border-gray-200 bg-white z-10 shadow-inner">
            <button
              onClick={() => handleNavigate("/addproduct")}
              className="w-full flex items-center justify-center gap-2 p-3 bg-[#2F333A] text-white rounded-xl hover:bg-[#444848] transition-all"
            >
              <span className="font-medium">Add Product</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default MobileMenu; 