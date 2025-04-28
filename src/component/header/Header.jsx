import React, { useState, useEffect, useRef } from "react";
import { CgProfile } from "react-icons/cg";
import { FaShoppingBag, FaHeart, FaSearch, FaBell } from "react-icons/fa";
import { IoMdGitCompare } from "react-icons/io";
import { HiMenu } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FiPackage, FiUpload } from "react-icons/fi";
import { FaSignInAlt, FaUserPlus, FaSignOutAlt, FaTicketAlt, FaHome, FaCamera } from "react-icons/fa";
import { MdLanguage, MdDarkMode, MdLightMode } from "react-icons/md";
import ProfileMenu from "./ProfileMenu";
import MobileSidebar from "./MobileSidebar";
import SearchBar from "./SearchBar";
import LanguageMenu from "./LanguageMenu";
import QuickActions from "./QuickActions";
import { useTheme, ThemeProvider } from "./ThemeContext";

const HeaderContent = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isRecentlyViewedOpen, setIsRecentlyViewedOpen] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);

  const profileMenuRef = useRef(null);
  const sidebarRef = useRef(null);
  const fileInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const languageMenuRef = useRef(null);
  const recentlyViewedRef = useRef(null);
  const navigate = useNavigate();

  // Language options
  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];

  // Check for saved profile image on component mount
  useEffect(() => {
    const savedProfileImage = localStorage.getItem("profileImage");
    if (savedProfileImage) {
      setProfileImage(savedProfileImage);
    }
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Toggle sidebar when mobile menu button is clicked
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Toggle profile menu when profile button is clicked
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  // Toggle search bar
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Handle file input change for profile image upload
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageDataUrl = event.target.result;
        setProfileImage(imageDataUrl);
        localStorage.setItem("profileImage", imageDataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'visible';
    }

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isSidebarOpen]);

  // Search suggestion mock data
  const mockProductSearchData = [
    { id: 1, name: "iPhone 13 Pro Max", category: "Electronics" },
    { id: 2, name: "Samsung Galaxy S21", category: "Electronics" },
    { id: 3, name: "MacBook Air M1", category: "Computers" },
    { id: 4, name: "AirPods Pro", category: "Audio" },
    { id: 5, name: "Nike Air Max", category: "Footwear" },
    { id: 6, name: "Levi's 501 Jeans", category: "Clothing" },
    { id: 7, name: "Sony PlayStation 5", category: "Gaming" },
    { id: 8, name: "Kindle Paperwhite", category: "Books" }
  ];

  // Update search query and show suggestions
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim().length > 1) {
      // Filter products that match the query
      const filteredSuggestions = mockProductSearchData
        .filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5); // Limit to 5 suggestions

      setSearchSuggestions(filteredSuggestions);
    } else {
      setSearchSuggestions([]);
    }
  };

  const handleSearchItemClick = (product) => {
    navigate(`/product/${product.id}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchSuggestions([]);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setSearchSuggestions([]);
    }
  };

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
    // Don't remove the profile image on logout
    localStorage.removeItem("profileImage");
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

    if (
      categoryMenuRef.current &&
      !categoryMenuRef.current.contains(event.target) &&
      !event.target.closest('[data-category-button]')
    ) {
      setIsCategoryMenuOpen(false);
    }

    if (
      notificationsRef.current &&
      !notificationsRef.current.contains(event.target) &&
      !event.target.closest('[data-notifications-button]')
    ) {
      setIsNotificationsOpen(false);
    }

    if (
      languageMenuRef.current &&
      !languageMenuRef.current.contains(event.target) &&
      !event.target.closest('[data-language-button]')
    ) {
      setIsLanguageMenuOpen(false);
    }

    if (
      recentlyViewedRef.current &&
      !recentlyViewedRef.current.contains(event.target) &&
      !event.target.closest('[data-recently-viewed-button]')
    ) {
      setIsRecentlyViewedOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Language toggle
  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const changeLanguage = (langCode) => {
    setCurrentLanguage(langCode);
    localStorage.setItem("language", langCode);
    setIsLanguageMenuOpen(false);
    // In a real app, you would implement proper i18n here
  };

  // Mock notification data - in a real app, this would come from an API
  const cartItems = useSelector((state) => state.cart.items);
  const cartItemCount = cartItems.length;

  const wishlistItems = useSelector((state) => state.wishlist);
  const wishlistCount = wishlistItems.length;

  const compareItems = useSelector((state) => state.compare);
  const compareCount = compareItems.length;

  const userEmail = localStorage.getItem("userEmail");
  const username = userEmail ? userEmail.split("@")[0] : null;

  return (
    <>
      {/* Hidden file input for profile image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
        accept="image/*"
      />

      {/* Mobile Sidebar Component */}
      <MobileSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        profileImage={profileImage}
        triggerFileInput={triggerFileInput}
      />

      {/* Top Bar */}
      <div className={`fixed top-0 left-0 right-0 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} py-3 z-30 shadow-md transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                data-menu-button
                onClick={toggleSidebar}
                className={`${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'} focus:outline-none transition-colors duration-300`}
              >
                <HiMenu className="text-2xl" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-none">
              <Link to="/" className="flex items-center">
                <span className={`text-2xl md:text-3xl font-bold text-[#FF7004] font-dcart tracking-wider hover:text-orange-600 transition-colors duration-300`}>
                  DCART
                </span>
              </Link>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex justify-end space-x-3 md:space-x-4 items-center">
              {/* Search Button */}
              <button
                onClick={toggleSearch}
                className={`${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'} focus:outline-none transition-colors duration-300`}
              >
                <FaSearch className="text-xl" />
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`${isDarkMode ? 'text-white hover:text-orange-400' : 'text-gray-700 hover:text-orange-500'} hidden sm:block focus:outline-none transition-colors duration-300`}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
              </button>

              {/* Language Menu Component */}
              <LanguageMenu />

              {/* Quick Actions Component (Cart, Wishlist, Compare) */}
              <QuickActions />

              {/* Profile Menu Component */}
              <ProfileMenu
                isOpen={isProfileMenuOpen}
                toggleMenu={toggleProfileMenu}
                profileImage={profileImage}
                triggerFileInput={triggerFileInput}
              />
              {localStorage.getItem("userEmail") === "test1278@gmail.com" && (
                <button
                  onClick={() => navigateTo('/addproduct')}
                  className="w-[150px] flex items-center justify-center gap-2 px-4 py-2 text-white bg-[#2F333A] rounded-lg hover:bg-[#444848] transition-colors duration-200"
                >
                  <span>Add Product</span>
                </button>
              )}
            </div>
          </div>

          {/* Search Bar Component */}
          <SearchBar
            isOpen={isSearchOpen}
            toggleSearch={toggleSearch}
          />
        </div>
      </div>
    </>
  );
};

// Wrap with ThemeProvider to provide context
const Header = () => {
  return (
    <ThemeProvider>
      <HeaderContent />
    </ThemeProvider>
  );
};

export default Header;
