import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSession, signOut, getCurrentUserProfile, getUserPrimaryRole, upsertUserProfile } from '../../lib/supabase';
import Icon from '../AppIcon';
import Image from '../AppImage';

const UserProfileDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const session = await getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      let profile = await getCurrentUserProfile();
      
      // If profile doesn't exist in our database, create it
      if (!profile) {
        console.log('User profile not found, creating...');
        try {
          await upsertUserProfile(session.user.id, {
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
            avatar_url: session.user.user_metadata?.avatar_url || null,
          });
          // Fetch the newly created profile
          profile = await getCurrentUserProfile();
        } catch (createError) {
          console.error('Failed to create user profile:', createError);
        }
      }

      const role = await getUserPrimaryRole(session.user.id);
      
      setUserProfile({
        name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        email: session.user.email || '',
        role: role?.charAt(0).toUpperCase() + role?.slice(1) || 'Member',
        avatar: profile?.avatar_url || '/assets/images/avatar-placeholder.png'
      });
    } catch (error) {
      console.error('Failed to load user data:', error);
      // Still try to show some user data from session
      try {
        const session = await getSession();
        if (session) {
          setUserProfile({
            name: session.user.email?.split('@')[0] || 'User',
            email: session.user.email || '',
            role: 'Member',
            avatar: '/assets/images/avatar-placeholder.png'
          });
        }
      } catch (e) {
        setUserProfile({
          name: 'User',
          email: '',
          role: 'Member',
          avatar: '/assets/images/avatar-placeholder.png'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      await signOut();
      setIsOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Sign out error:', error);
      // Force navigation even if signout fails
      navigate('/', { replace: true });
    }
  };

  const menuItems = [
    {
      label: 'Profile Settings',
      icon: 'User',
      onClick: () => {
        navigate('/user-settings-profile');
        setIsOpen(false);
      }
    },
    {
      label: 'Account Preferences',
      icon: 'Settings',
      onClick: () => {
        navigate('/user-settings-profile');
        setIsOpen(false);
      }
    },
    {
      label: 'Help & Support',
      icon: 'HelpCircle',
      onClick: () => {
        window.open('https://help.example.com', '_blank');
        setIsOpen(false);
      }
    },
    {
      label: 'Sign Out',
      icon: 'LogOut',
      onClick: handleSignOut,
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

  if (loading) {
    return (
      <div className="flex items-center gap-3 p-2 rounded-xl bg-muted animate-pulse">
        <div className="w-10 h-10 rounded-lg bg-muted-foreground/20"></div>
        <div className="hidden md:block space-y-2">
          <div className="w-24 h-3 bg-muted-foreground/20 rounded"></div>
          <div className="w-16 h-2 bg-muted-foreground/20 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-all duration-250 ease-smooth focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-3"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          {userProfile?.avatar && userProfile?.avatar !== '/assets/images/avatar-placeholder.png' ? (
            <Image
              src={userProfile?.avatar}
              alt={userProfile?.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon name="User" size={20} className="text-muted-foreground" />
          )}
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