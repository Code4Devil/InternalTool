import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
    label: 'Settings',
    path: '/user-settings-profile',
    icon: 'Settings',
    tooltip: 'User settings'
  }
];

const userNavItems = [
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

  const navigationItems = currentRole === 'admin' ? adminNavItems : userNavItems;

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileOpen(false);
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

        <div className="mt-auto p-4 relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="w-full flex items-center justify-between p-3 bg-muted rounded-lg"
          >
            <span className="text-sm font-medium">{currentRole === 'admin' ? 'Admin' : 'User'} View</span>
            <Icon name={isRoleDropdownOpen ? 'ChevronUp' : 'ChevronDown'} size={16} />
          </button>
          {isRoleDropdownOpen && (
            <div className="absolute bottom-full mb-2 w-full bg-card border border-border rounded-lg shadow-lg">
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