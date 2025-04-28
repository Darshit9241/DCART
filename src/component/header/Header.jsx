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
import { MdKeyboardArrowDown } from "react-icons/md";

export default function Header() {
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
  const isMobile = windowWidth < 768; // Mobile breakpoint at 768px

  const profileMenuRef = useRef(null);
  const sidebarRef = useRef(null);
  const fileInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const categoryMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();

  // Mock notification data - in a real app, this would come from an API
  useEffect(() => {
    // Only show notifications for logged in users
    if (localStorage.getItem("token")) {
      const mockNotifications = [
        {
          id: 1,
          title: "Order Shipped",
          message: "Your order #1234 has been shipped and will arrive in 2-3 days.",
          time: "2 hours ago",
          read: false,
          link: "/allorderspage"
        },
        {
          id: 2,
          title: "Price Drop Alert",
          message: "A product in your wishlist is now on sale!",
          time: "Yesterday",
          read: false,
          link: "/WishList"
        },
        {
          id: 3,
          title: "New Coupon Available",
          message: "Use code WELCOME15 for 15% off your next purchase.",
          time: "3 days ago",
          read: true,
          link: "/Coupon"
        }
      ];

      setNotifications(mockNotifications);
      const unread = mockNotifications.filter(notif => !notif.read).length;
      setUnreadCount(unread);
    }
  }, []);

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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      // Close sidebar and other menus when resizing from mobile to desktop
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  const toggleCategoryMenu = () => {
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    // Mark notifications as read when opened
    if (!isNotificationsOpen && unreadCount > 0) {
      const updatedNotifications = notifications.map(notif => ({
        ...notif,
        read: true
      }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    }
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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleCategoryClick = (path) => {
    navigate(path);
    setIsCategoryMenuOpen(false);
    setIsSidebarOpen(false);
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
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button - Only visible on mobile */}
            <div className="md:hidden">
              <button
                data-menu-button
                onClick={toggleSidebar}
                className="text-gray-700 hover:text-orange-500 focus:outline-none transition-colors duration-300"
              >
                <HiMenu className="text-2xl" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex justify-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl md:text-3xl font-bold text-[#FF7004] font-dcart tracking-wider hover:text-orange-600 transition-colors duration-300">
                  DCART
                </span>
              </Link>
            </div>

            {/* Right: Quick Actions */}
            <div className="flex justify-end space-x-4 items-center">
              {/* Search Button */}
              <button
                onClick={toggleSearch}
                className="text-gray-700 hover:text-orange-500 focus:outline-none transition-colors duration-300"
              >
                <FaSearch className="text-xl" />
              </button>

              {/* Notifications - Hidden on small mobile */}
              {localStorage.getItem("token") && (
                <div className="relative hidden sm:block" ref={notificationsRef}>
                  <button
                    data-notifications-button
                    onClick={toggleNotifications}
                    className="text-gray-700 hover:text-orange-500 focus:outline-none transition-colors duration-300 relative"
                  >
                    <FaBell className="text-xl" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl z-50 animate-fadeIn">
                      <div className="py-2">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-lg font-medium text-gray-900">Notifications</p>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <div
                                key={notification.id}
                                className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-orange-50' : ''}`}
                                onClick={() => {
                                  navigate(notification.link);
                                  setIsNotificationsOpen(false);
                                }}
                              >
                                <div className="flex justify-between items-start">
                                  <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                  <span className="text-xs text-gray-500">{notification.time}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-6 text-center">
                              <p className="text-gray-500">No notifications yet</p>
                            </div>
                          )}
                        </div>

                        {notifications.length > 0 && (
                          <div className="px-4 py-2 border-t border-gray-100 text-center">
                            <button
                              className="text-sm text-orange-500 hover:text-orange-600"
                              onClick={() => {
                                // Clear all notifications
                                setNotifications([]);
                                setUnreadCount(0);
                              }}
                            >
                              Clear all
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Cart, Wishlist, Compare - Hidden on smallest screens but visible on tablet */}
              <div className="hidden sm:flex items-center space-x-4">
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
              </div>

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
                        <button
                          onClick={() => navigateTo("/View-all-order")}
                          className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
                        >
                          <FiPackage /> Orders
                        </button>
                        <button
                          onClick={() => navigateTo("/Coupon")}
                          className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
                        >
                          <FaTicketAlt /> Coupon
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar - Expandable */}
          <div className={`overflow-hidden transition-all duration-300 ${isSearchOpen ? 'max-h-20 mt-3' : 'max-h-0'}`}>
            <form onSubmit={handleSearchSubmit} className="flex items-center">
              <div className="relative flex-grow">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Sidebar - Mobile Navigation */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
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
