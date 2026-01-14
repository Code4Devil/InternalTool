import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getSession, signOut, getCurrentUserProfile, upsertUserProfile } from '../../lib/supabase';
import Icon from '../AppIcon';
import logo from '/logo/deltaxerolighthorizontallogo.png';

const adminNavItems = [
  {
    label: 'Executive Dashboard',
    path: '/executive-dashboard',
    icon: 'LayoutDashboard',
    tooltip: 'Executive Dashboard'
  },
  {
    label: 'Tasks',
    path: '/task-management-center',
    icon: 'CheckSquare',
    tooltip: 'Task management',
    subItems: [
      {
        label: 'Task Center',
        path: '/task-management-center',
        icon: 'List'
      },
      {
        label: 'Kanban Board',
        path: '/interactive-kanban-board',
        icon: 'Trello'
      }
    ]
  },
  {
    label: 'Communication',
    path: '/team-communication-hub',
    icon: 'MessageSquare',
    tooltip: 'Team collaboration',
    subItems: [
      {
        label: 'Chat Hub',
        path: '/team-communication-hub',
        icon: 'MessageCircle'
      },
      {
        label: 'Video Call',
        path: '/video-call-interface',
        icon: 'Video'
      }
    ]
  },
  {
    label: 'Audit Log',
    path: '/audit-log-activity-tracking',
    icon: 'FileText',
    tooltip: 'Activity audit log'
  },
  {
    label: 'Settings',
    path: '/user-settings-profile',
    icon: 'Settings',
    tooltip: 'User settings'
  }
];

const userNavItems = [
  {
    label: 'My Dashboard',
    path: '/member-personal-dashboard',
    icon: 'LayoutDashboard',
    tooltip: 'My Personal Dashboard'
  },
  {
    label: 'My View',
    path: '/member-focused-view',
    icon: 'User',
    tooltip: 'My Focused View'
  },
  {
    label: 'Communication',
    path: '/team-communication-hub',
    icon: 'MessageSquare',
    tooltip: 'Team collaboration',
    subItems: [
      {
        label: 'Chat Hub',
        path: '/team-communication-hub',
        icon: 'MessageCircle'
      },
      {
        label: 'Video Call',
        path: '/video-call-interface',
        icon: 'Video'
      }
    ]
  },
  {
    label: 'Settings',
    path: '/user-settings-profile',
    icon: 'Settings',
    tooltip: 'User settings'
  }
];

const Sidebar = ({ isCollapsed = false, currentRole, onRoleChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const navigationItems = currentRole === 'admin' ? adminNavItems : userNavItems;

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const session = await getSession();
      if (!session) return;

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

      // Set profile from database or fallback to session data
      // Note: email comes from session since it's in auth.users, not public.users
      setUserProfile({
        ...(profile || {}),
        full_name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
        email: session.user.email,
        avatar_url: profile?.avatar_url || session.user.user_metadata?.avatar_url || null
      });
    } catch (error) {
      console.error('Failed to load user profile:', error);
      // Set a default profile to avoid breaking the UI
      try {
        const session = await getSession();
        if (session) {
          setUserProfile({
            full_name: session.user.email?.split('@')[0] || 'User',
            email: session.user.email,
            avatar_url: null
          });
        }
      } catch (e) {
        console.error('Failed to get session:', e);
      }
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    try {
      console.log('Logging out...');
      setIsProfileDropdownOpen(false);
      await signOut();
      console.log('Logout successful, redirecting to login...');
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if signout fails
      navigate('/', { replace: true });
    }
  };

  const isActiveRoute = (path) => location.pathname === path;

  const isParentActive = (item) =>
    item.subItems && item.subItems.some(subItem => isActiveRoute(subItem.path));

  const handleRoleChange = (role) => {
    onRoleChange(role);
    setIsRoleDropdownOpen(false);
  };

  const renderNavItem = (item) => (
    <div key={item.path}>
      <button
        onClick={() => handleNavigation(item.path)}
        className={`
          flex items-center w-full gap-3 px-4 py-3 rounded-lg text-base
          transition-all duration-250 ease-smooth
          ${isCollapsed ? 'justify-center' : ''}
          ${isActiveRoute(item.path) || isParentActive(item)
            ? 'bg-primary/10 text-primary font-semibold'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }
        `}
        title={isCollapsed ? item.tooltip : ''}
        aria-label={item.label}
      >
        <Icon name={item.icon} size={20} />
        {!isCollapsed && <span className="font-medium">{item.label}</span>}
      </button>

      {!isCollapsed && item.subItems && (isActiveRoute(item.path) || isParentActive(item)) && (
        <div className="ml-6 mt-2 space-y-1">
          {item.subItems.map(subItem => (
            <button
              key={subItem.path}
              onClick={() => handleNavigation(subItem.path)}
              className={`
                flex items-center gap-3 px-4 py-2 rounded-lg text-sm
                transition-all duration-250 ease-smooth w-full
                ${isActiveRoute(subItem.path)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}
              aria-label={subItem.label}
            >
              <Icon name={subItem.icon} size={16} />
              <span>{subItem.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-card text-foreground p-3 rounded-xl shadow-md"
        aria-label="Toggle mobile menu"
      >
        <Icon name={isMobileOpen ? 'X' : 'Menu'} size={24} />
      </button>
      <aside
        className={`
          fixed lg:relative top-0 left-0 h-screen bg-card border-r border-border z-100
          transition-all duration-250 ease-smooth custom-scrollbar
          flex flex-col
          ${isCollapsed ? 'w-20' : 'w-60'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className={`py-6 ${isCollapsed ? 'px-4' : 'px-6'}`}>
          <Link to={currentRole === 'admin' ? '/executive-dashboard' : '/member-focused-view'} className="flex items-center justify-center h-22 mb-6">
            {isCollapsed ? (
              <Icon name="Zap" size={28} className="text-primary" />
            ) : (
              <img src={logo} alt="TeamSync Pro" className="h-full" />
            )}
          </Link>
          <nav className="space-y-2">
            {navigationItems.map(renderNavItem)}
          </nav>
        </div>

        <div className="mt-auto p-4 space-y-3">
          {/* User Profile Section */}
          {!isCollapsed && userProfile && (
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-full flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-smooth"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  {userProfile.avatar_url ? (
                    <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <Icon name="User" size={20} color="var(--color-primary)" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-foreground truncate">
                    {userProfile.full_name || 'User'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {userProfile.email}
                  </p>
                </div>
                <Icon name={isProfileDropdownOpen ? 'ChevronUp' : 'ChevronDown'} size={16} />
              </button>
              
              {isProfileDropdownOpen && (
                <div className="absolute bottom-full mb-2 w-full bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                  <button
                    onClick={() => {
                      handleNavigation('/user-settings-profile');
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-muted flex items-center gap-2"
                  >
                    <Icon name="Settings" size={16} />
                    Profile Settings
                  </button>
                  <div className="border-t border-border"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-sm hover:bg-muted flex items-center gap-2 text-error"
                  >
                    <Icon name="LogOut" size={16} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Role Switcher (Dev/Testing) */}
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="relative w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg text-xs"
          >
            <span className="font-medium">{currentRole === 'admin' ? 'Admin' : 'User'} View</span>
            <Icon name={isRoleDropdownOpen ? 'ChevronUp' : 'ChevronDown'} size={14} />
            {isRoleDropdownOpen && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-card border border-border rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => handleRoleChange('admin')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted"
                >
                  Admin
                </button>
                <button
                  onClick={() => handleRoleChange('user')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-muted"
                >
                  Normal User
                </button>
              </div>
            )}
          </button>
        </div>
      </aside>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-background/50 z-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default Sidebar;