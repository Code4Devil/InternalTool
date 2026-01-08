import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'mention',
      title: 'New mention in Project Alpha',
      message: 'John mentioned you in a comment',
      timestamp: '2 minutes ago',
      read: false,
      icon: 'AtSign',
      color: 'primary'
    },
    {
      id: 2,
      type: 'task',
      title: 'Task deadline approaching',
      message: 'UI Design Review due in 2 hours',
      timestamp: '1 hour ago',
      read: false,
      icon: 'Clock',
      color: 'warning'
    },
    {
      id: 3,
      type: 'success',
      title: 'Task completed',
      message: 'Backend API Integration marked as done',
      timestamp: '3 hours ago',
      read: true,
      icon: 'CheckCircle',
      color: 'success'
    },
    {
      id: 4,
      type: 'message',
      title: 'New message from Sarah',
      message: 'Can we schedule a quick sync call?',
      timestamp: '5 hours ago',
      read: true,
      icon: 'MessageCircle',
      color: 'secondary'
    }
  ]);

  const dropdownRef = useRef(null);
  const unreadCount = notifications?.filter(n => !n?.read)?.length;

  const handleMarkAsRead = (id) => {
    setNotifications(notifications?.map(n => 
      n?.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications?.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event?.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl hover:bg-muted transition-all duration-250 ease-smooth focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-3"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Icon name="Bell" size={24} className="text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-card border border-border rounded-xl shadow-lg z-200 overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Notifications
            </h3>
            {notifications?.length > 0 && (
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-xs text-primary hover:text-primary/80 font-medium transition-colors duration-250"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={handleClearAll}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-250"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {notifications?.length === 0 ? (
              <div className="p-8 text-center">
                <Icon name="Bell" size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications?.map((notification) => (
                  <div
                    key={notification?.id}
                    className={`
                      p-4 transition-all duration-250 ease-smooth cursor-pointer
                      ${notification?.read ? 'bg-card' : 'bg-primary/5'}
                      hover:bg-muted
                    `}
                    onClick={() => handleMarkAsRead(notification?.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                        bg-${notification?.color}/10
                      `}>
                        <Icon 
                          name={notification?.icon} 
                          size={20} 
                          className={`text-${notification?.color}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-medium text-foreground">
                            {notification?.title}
                          </h4>
                          {!notification?.read && (
                            <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {notification?.message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {notification?.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications?.length > 0 && (
            <div className="p-3 border-t border-border">
              <button className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-250">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;