import React from 'react';
import { FaUserPlus, FaSignInAlt, FaSignOutAlt, FaTicketAlt, FaKey, FaCamera } from "react-icons/fa";

export default function ProfileMenu({ 
  userEmail, 
  username, 
  userPhoto, 
  handleProfilePhotoClick, 
  handleNavigate, 
  handleLogout 
}) {
  return (
    <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 animate-fadeIn">
      <div className="py-2">
        {userEmail && (
          <div className="px-4 py-3 border-b border-gray-100 flex items-center space-x-3">
            <div 
              className="w-10 h-10 rounded-full overflow-hidden relative group cursor-pointer"
              onClick={handleProfilePhotoClick}
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
            onClick={() => handleNavigate("/sign-up")}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
          >
            <FaUserPlus /> Sign Up
          </button>

          <button
            onClick={() => handleNavigate("/login")}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
          >
            <FaSignInAlt /> Log In
          </button>

          <button
            onClick={() => handleNavigate("/forgot-password")}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
          >
            <FaKey /> Forgot Password
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
          >
            <FaSignOutAlt /> Log Out
          </button>

          <button
            onClick={() => handleNavigate("/Coupon")}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-md transition-colors duration-200"
          >
            <FaTicketAlt /> Coupon
          </button>
        </div>
      </div>
    </div>
  );
} 