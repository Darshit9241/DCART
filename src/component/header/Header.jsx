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
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTicketAlt, FaKey, FaCamera, FaMoon, FaSun, FaMicrophone, FaQrcode } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import { IoNotificationsOutline } from "react-icons/io5";
import { IoEarth, IoChevronDown } from "react-icons/io5";
import { useQRCode } from 'next-qrcode';

// Import components
import ProfileMenu from './ProfileMenu';
import MobileMenu from './MobileMenu';
import SearchModal from './SearchModal';
import NotificationsPanel from './NotificationsPanel';
import LanguageMenu from './LanguageMenu';
import QrScannerModal from './QrScannerModal';

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
  
  /* Prevent body scrolling when modal is open */
  body.modal-open {
    overflow: hidden;
    position: fixed;
    width: 100%;
    height: 100%;
  }
  
  /* Animation classes */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out forwards;
  }
  
  @keyframes slideInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  .animate-slide-in-up {
    animation: slideInUp 0.3s ease-out forwards;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  .animate-pulse {
    animation: pulse 1.5s infinite;
  }
  
  /* Dark mode styles */
  .dark {
    color-scheme: dark;
  }
  
  .dark body {
    background-color: #1a1a1a;
    color: #f3f4f6;
  }
  
  .dark .bg-white {
    background-color: #1a1a1a;
  }
  
  .dark .text-gray-700 {
    color: #d1d5db;
  }
    .dark .text-gray-800 {
    color: #d1d5db;
  }
    .dark .text-gray-900 {
    color: #d1d5db;
  }
  
  .dark .text-gray-500 {
    color: #9ca3af;
  }
  
  .dark .border-gray-100 {
    border-color: #374151;
  }
  
  .dark .border-gray-200 {
    border-color: #374151;
  }
  
  .dark .shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  }
`;
document.head.appendChild(style);

export default function Header() {
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
  const [userPhoto, setUserPhoto] = useState(localStorage.getItem("userPhoto") || null);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const profileMenuRef = useRef(null);
  const searchModalRef = useRef(null);
  const fileInputRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const languageMenuRef = useRef(null);

  // Redux data
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems.length;
  const wishlistItems = useSelector((state) => state.wishlist);
  const wishlistCount = wishlistItems.length;
  const compareItems = useSelector((state) => state.compare);
  const compareCount = compareItems.length;

  // User data from localStorage
  const userEmail = localStorage.getItem("userEmail");
  const username = userEmail ? userEmail.split("@")[0] : null;
  const isAdmin = userEmail === "test1278@gmail.com";

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
      if (searchModalRef.current && !searchModalRef.current.contains(event.target)) {
        setIsSearchModalOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target)) {
        setIsLanguageMenuOpen(false);
      }
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        if (!event.target.closest('button[aria-label="toggle-mobile-menu"]')) {
          setIsMobileMenuOpen(false);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Update body class for modals
  useEffect(() => {
    const isModalOpen = isMobileMenuOpen || isSearchModalOpen || isQrScannerOpen;
    if (isModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [isMobileMenuOpen, isSearchModalOpen, isQrScannerOpen]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Update photo when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const storedPhoto = localStorage.getItem("userPhoto");
      setUserPhoto(storedPhoto || null);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Navigation handlers
  const handleNavigate = (path) => {
    navigate(path);
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleAuthRequiredNavigate = (path) => {
    const token = localStorage.getItem("token");
    navigate(token ? path : "/login");
    setIsProfileMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    ["token", "userEmail", "userPhoto"].forEach(key => localStorage.removeItem(key));
    setUserPhoto(null);
    window.dispatchEvent(new Event('storage'));
    setIsProfileMenuOpen(false);
    navigate("/login");
    window.location.reload();
  };

  // Photo upload handler
  const handleProfilePhotoClick = (e) => {
    if (userEmail) {
      e.stopPropagation();
      fileInputRef.current.click();
    } else {
      setIsProfileMenuOpen(!isProfileMenuOpen);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result;
        localStorage.setItem("userPhoto", photoData);
        setUserPhoto(photoData);
        window.dispatchEvent(new Event('storage'));
      };
      reader.readAsDataURL(file);
    }
  };

  // UI state toggles
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleLanguageMenu = () => setIsLanguageMenuOpen(!isLanguageMenuOpen);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-white py-3 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-orange-500 focus:outline-none p-2 -m-2"
                aria-label="toggle-mobile-menu"
              >
                {isMobileMenuOpen ? <IoMdClose className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
              </button>
            </div>

            {/* Logo */}
            <Link to="/" className="flex items-center order-last md:order-first">
              <span className="text-2xl md:text-3xl font-bold text-[#FF7004] font-dcart tracking-wider hover:text-orange-600 transition-colors duration-300">
                DCART
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Language/Currency Selector */}
              <div className="relative" ref={languageMenuRef}>
                <button
                  onClick={toggleLanguageMenu}
                  className="flex items-center space-x-1 text-gray-700 hover:text-orange-500 transition-colors duration-300"
                >
                  <IoEarth className="text-lg" />
                  <span className="text-sm font-medium">{selectedLanguage} / {selectedCurrency}</span>
                  <IoChevronDown className={`text-xs transition-transform duration-200 ${isLanguageMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLanguageMenuOpen && (
                  <LanguageMenu
                    selectedLanguage={selectedLanguage}
                    selectedCurrency={selectedCurrency}
                    setSelectedLanguage={setSelectedLanguage}
                    setSelectedCurrency={setSelectedCurrency}
                    closeMenu={() => setIsLanguageMenuOpen(false)}
                  />
                )}
              </div>

              <div className="flex space-x-6 items-center">
                {/* Search Button */}
                <button onClick={() => setIsSearchModalOpen(true)} className="group">
                  <BiSearch className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300 dark:text-gray-300" />
                </button>

                {/* Dark Mode Toggle */}
                <button onClick={toggleDarkMode} className="group" aria-label="Toggle dark mode">
                  {darkMode ? (
                    <FaSun className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300 dark:text-gray-300" />
                  ) : (
                    <FaMoon className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                  )}
                </button>

                {/* QR Scanner Button */}
                <button onClick={() => setIsQrScannerOpen(true)} className="group">
                  <FaQrcode className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300 dark:text-gray-300" />
                </button>

                {/* Notifications */}
                <div className="relative" ref={notificationsRef}>
                  <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative group">
                    <IoNotificationsOutline className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                    <NotificationsPanel
                      isOpen={isNotificationsOpen}
                      navigate={navigate}
                      closePanel={() => setIsNotificationsOpen(false)}
                    />
                  </button>
                </div>

                {/* Profile */}
                <div className="relative" ref={profileMenuRef}>
                  <button className="flex items-center space-x-1 group" onClick={toggleProfileMenu}>
                    {userPhoto && userEmail ? (
                      <div
                        className="w-8 h-8 rounded-full overflow-hidden relative group cursor-pointer"
                        onClick={handleProfilePhotoClick}
                      >
                        <img
                          src={userPhoto}
                          alt="User"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://via.placeholder.com/40"; }}
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

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {isProfileMenuOpen && (
                    <ProfileMenu
                      userEmail={userEmail}
                      username={username}
                      userPhoto={userPhoto}
                      handleProfilePhotoClick={handleProfilePhotoClick}
                      handleNavigate={handleNavigate}
                      handleLogout={handleLogout}
                    />
                  )}
                </div>

                {/* Cart */}
                <button
                  onClick={() => handleAuthRequiredNavigate("/cart")}
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
                  onClick={() => handleAuthRequiredNavigate("/WishList")}
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
                  onClick={() => handleAuthRequiredNavigate("/compare")}
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
                <button onClick={() => handleNavigate("/view-all-order")} className="group">
                  <FiPackage className="text-2xl text-gray-700 group-hover:text-orange-500 transition-colors duration-300" />
                </button>

                {/* Admin Product Add Button */}
                {isAdmin && (
                  <button
                    onClick={() => handleNavigate("/addproduct")}
                    className="px-4 py-2 bg-[#2F333A] text-white text-sm font-semibold rounded-lg shadow-md hover:bg-[#444848] transition-all duration-300 transform hover:scale-105"
                  >
                    Add Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <MobileMenu
          ref={mobileMenuRef}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          userEmail={userEmail}
          username={username}
          userPhoto={userPhoto}
          isAdmin={isAdmin}
          fileInputRef={fileInputRef}
          cartItemCount={cartItemCount}
          wishlistCount={wishlistCount}
          compareCount={compareCount}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          handleNavigate={handleNavigate}
          handleAuthRequiredNavigate={handleAuthRequiredNavigate}
          handleLogout={handleLogout}
          setIsNotificationsOpen={setIsNotificationsOpen}
          setIsSearchModalOpen={setIsSearchModalOpen}
          setIsQrScannerOpen={setIsQrScannerOpen}
        />
      )}

      {/* Search Modal */}
      {isSearchModalOpen && (
        <SearchModal
          ref={searchModalRef}
          closeModal={() => setIsSearchModalOpen(false)}
          navigate={navigate}
        />
      )}

      {/* QR Scanner Modal */}
      {isQrScannerOpen && (
        <QrScannerModal
          closeModal={() => setIsQrScannerOpen(false)}
          userEmail={userEmail}
        />
      )}
    </>
  );
}
