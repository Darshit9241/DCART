import React, { useState } from 'react';

export default function NotificationsPanel({ isOpen, navigate, closePanel }) {
  // Initial notifications data
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Welcome to DCART! Explore our latest products.", read: false, time: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, text: "New arrivals in electronics category. Check them out!", read: false, time: new Date(Date.now() - 86400000).toISOString() },
    { id: 3, text: "Limited time offer: 20% off on all fashion items.", read: true, time: new Date(Date.now() - 172800000).toISOString() }
  ]);

  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const getUnreadCount = () => {
    return notifications.filter(notification => !notification.read).length;
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = diffMs / (1000 * 60 * 60);
    
    if (diffHrs < 1) {
      return 'Just now';
    } else if (diffHrs < 24) {
      return `${Math.floor(diffHrs)}h ago`;
    } else {
      return `${Math.floor(diffHrs / 24)}d ago`;
    }
  };

  // If not open, render just the notification badge
  if (!isOpen) {
    return getUnreadCount() > 0 ? (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
        {getUnreadCount()}
      </span>
    ) : null;
  }

  // Render the full notifications panel when open
  return (
    <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-xl shadow-xl z-50 animate-fadeIn max-h-96 overflow-hidden flex flex-col">
      <div className="py-2 px-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-medium text-gray-900">Notifications</h3>
        {getUnreadCount() > 0 && (
          <button 
            onClick={markAllAsRead}
            className="text-xs text-orange-500 hover:text-orange-600 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>
      
      <div className="overflow-y-auto flex-grow">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id}
              className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${!notification.read ? 'bg-orange-50' : ''}`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start">
                {!notification.read && (
                  <div className="h-2 w-2 bg-orange-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                )}
                <div className={`flex-grow ${!notification.read ? 'pl-1' : 'pl-4'}`}>
                  <p className="text-sm text-gray-700">{notification.text}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTime(notification.time)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500">No notifications</div>
        )}
      </div>
      
      <div className="p-2 border-t border-gray-100 text-center">
        <button 
          onClick={() => {
            navigate("/notifications");
            closePanel();
          }}
          className="text-sm text-orange-500 hover:text-orange-600 font-medium py-1"
        >
          View all notifications
        </button>
      </div>
    </div>
  );
} 