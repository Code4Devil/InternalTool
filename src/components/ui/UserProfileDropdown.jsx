import React, { useState, useRef, useEffect } from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';

const UserProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userProfile = {
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@teamsync.com',
    role: 'Executive Director',
    avatar: '/assets/images/avatar-placeholder.png'
  };

  const menuItems = [
    {
      label: 'Profile Settings',
      icon: 'User',
      onClick: () => {
        console.log('Navigate to profile settings');
        setIsOpen(false);
      }
    },
    {
      label: 'Account Preferences',
      icon: 'Settings',
      onClick: () => {
        console.log('Navigate to account preferences');
        setIsOpen(false);
      }
    },
    {
      label: 'Help & Support',
      icon: 'HelpCircle',
      onClick: () => {
        console.log('Navigate to help center');
        setIsOpen(false);
      }
    },
    {
      label: 'Sign Out',
      icon: 'LogOut',
      onClick: () => {
        console.log('User signed out');
        setIsOpen(false);
      },
      variant: 'destructive'
    }
  ];

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
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-all duration-250 ease-smooth focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-3"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
          <Image
            src={userProfile?.avatar}
            alt={userProfile?.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-foreground">{userProfile?.name}</p>
          <p className="text-xs text-muted-foreground">{userProfile?.role}</p>
        </div>
        <Icon 
          name={isOpen ? 'ChevronUp' : 'ChevronDown'} 
          size={16} 
          className="hidden md:block text-muted-foreground"
        />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-lg z-200 overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
                <Image
                  src={userProfile?.avatar}
                  alt={userProfile?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-card-foreground truncate">
                  {userProfile?.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {userProfile?.email}
                </p>
                <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
                  {userProfile?.role}
                </span>
              </div>
            </div>
          </div>

          <div className="py-2">
            {menuItems?.map((item, index) => (
              <button
                key={index}
                onClick={item?.onClick}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-sm
                  transition-all duration-250 ease-smooth
                  ${item?.variant === 'destructive' ?'text-destructive hover:bg-destructive/10' :'text-card-foreground hover:bg-muted'
                  }
                  focus-visible:outline-none focus-visible:bg-muted
                `}
              >
                <Icon name={item?.icon} size={18} />
                <span className="font-medium">{item?.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;