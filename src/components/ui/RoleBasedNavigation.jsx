import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getUserPrimaryRole, getSession } from '../../lib/supabase';
import Icon from '../AppIcon';

const RoleBasedNavigation = ({ projectId = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState('member');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserRole();
  }, [projectId]);

  const loadUserRole = async () => {
    try {
      const session = await getSession();
      if (!session) {
        setUserRole('member');
        setLoading(false);
        return;
      }

      const primaryRole = await getUserPrimaryRole(session.user.id);
      setUserRole(primaryRole);
    } catch (error) {
      console.error('Failed to load user role:', error);
      setUserRole('member');
    } finally {
      setLoading(false);
    }
  };

  const rolePermissions = {
    owner: ['dashboard', 'tasks', 'communication', 'reports', 'settings', 'audit'],
    admin: ['dashboard', 'tasks', 'communication', 'reports', 'settings', 'audit'],
    manager: ['dashboard', 'tasks', 'communication', 'reports'],
    contributor: ['tasks', 'communication'],
    viewer: ['tasks', 'communication'],
    member: ['tasks', 'communication']
  };

  const allNavigationItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      path: '/executive-dashboard',
      icon: 'LayoutDashboard',
      requiredRole: 'manager'
    },
    {
      id: 'tasks',
      label: 'Tasks',
      path: '/task-management-center',
      icon: 'CheckSquare',
      requiredRole: 'viewer'
    },
    {
      id: 'communication',
      label: 'Communication',
      path: '/team-communication-hub',
      icon: 'MessageSquare',
      requiredRole: 'viewer'
    },
    {
      id: 'reports',
      label: 'Reports',
      path: '/reports',
      icon: 'BarChart3',
      requiredRole: 'manager'
    },
    {
      id: 'audit',
      label: 'Audit Log',
      path: '/audit-log-activity-tracking',
      icon: 'FileText',
      requiredRole: 'admin'
    },
    {
      id: 'settings',
      label: 'Settings',
      path: '/user-settings-profile',
      icon: 'Settings',
      requiredRole: 'owner'
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
      owner: 'bg-primary/10 text-primary',
      admin: 'bg-primary/10 text-primary',
      manager: 'bg-secondary/10 text-secondary',
      contributor: 'bg-success/10 text-success',
      viewer: 'bg-muted text-muted-foreground',
      member: 'bg-muted text-muted-foreground'
    };
    return colors?.[userRole] || colors?.member;
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-16 bg-muted/50 rounded-xl"></div>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-12 bg-muted/30 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

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