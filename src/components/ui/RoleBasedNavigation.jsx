import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const RoleBasedNavigation = ({ userRole = 'executive' }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const rolePermissions = {
    executive: ['dashboard', 'tasks', 'communication', 'reports', 'settings'],
    manager: ['dashboard', 'tasks', 'communication', 'reports'],
    contributor: ['tasks', 'communication'],
    guest: ['communication']
  };

  const allNavigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/executive-dashboard',
      icon: 'LayoutDashboard',
      requiredRole: 'executive'
    },
    {
      id: 'tasks',
      label: 'Tasks',
      path: '/task-management-center',
      icon: 'CheckSquare',
      requiredRole: 'contributor'
    },
    {
      id: 'communication',
      label: 'Communication',
      path: '/team-communication-hub',
      icon: 'MessageSquare',
      requiredRole: 'guest'
    },
    {
      id: 'reports',
      label: 'Reports',
      path: '/reports',
      icon: 'BarChart3',
      requiredRole: 'manager'
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/settings',
      icon: 'Settings',
      requiredRole: 'executive'
    }
  ];

  const hasPermission = (itemId) => {
    return rolePermissions?.[userRole]?.includes(itemId) || false;
  };

  const visibleItems = allNavigationItems?.filter(item => hasPermission(item?.id));

  const handleNavigation = (path) => {
    navigate(path);
  };

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const getRoleBadgeColor = () => {
    const colors = {
      executive: 'bg-primary/10 text-primary',
      manager: 'bg-secondary/10 text-secondary',
      contributor: 'bg-success/10 text-success',
      guest: 'bg-muted text-muted-foreground'
    };
    return colors?.[userRole] || colors?.guest;
  };

  return (
    <div className="space-y-4">
      <div className="px-4 py-3 bg-muted/50 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
            Access Level
          </span>
          <span className={`px-2 py-1 text-xs font-medium rounded ${getRoleBadgeColor()}`}>
            {userRole?.charAt(0)?.toUpperCase() + userRole?.slice(1)}
          </span>
        </div>
      </div>
      <nav className="space-y-1">
        {visibleItems?.map((item) => (
          <button
            key={item?.id}
            onClick={() => handleNavigation(item?.path)}
            className={`
              nav-item w-full
              ${isActiveRoute(item?.path) ? 'active' : ''}
            `}
            aria-label={item?.label}
          >
            <Icon name={item?.icon} size={20} />
            <span className="font-medium">{item?.label}</span>
          </button>
        ))}
      </nav>
      {visibleItems?.length === 0 && (
        <div className="px-4 py-8 text-center">
          <Icon name="Lock" size={32} className="text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No accessible sections for your role
          </p>
        </div>
      )}
    </div>
  );
};

export default RoleBasedNavigation;