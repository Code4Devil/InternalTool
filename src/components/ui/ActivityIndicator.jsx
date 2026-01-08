import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ActivityIndicator = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      screen: 'task-management-center',
      label: 'Tasks',
      count: 3,
      type: 'update',
      active: true
    },
    {
      id: 2,
      screen: 'team-communication-hub',
      label: 'Chat',
      count: 12,
      type: 'message',
      active: true
    },
    {
      id: 3,
      screen: 'interactive-kanban-board',
      label: 'Kanban',
      count: 1,
      type: 'update',
      active: false
    }
  ]);

  const [onlineUsers, setOnlineUsers] = useState(8);

  useEffect(() => {
    const activityInterval = setInterval(() => {
      setActivities(prev => prev?.map(activity => ({
        ...activity,
        count: activity?.active ? Math.max(0, activity?.count + Math.floor(Math.random() * 3) - 1) : activity?.count
      })));
    }, 5000);

    const userInterval = setInterval(() => {
      setOnlineUsers(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
    }, 10000);

    return () => {
      clearInterval(activityInterval);
      clearInterval(userInterval);
    };
  }, []);

  const getActivityIcon = (type) => {
    const icons = {
      message: 'MessageCircle',
      update: 'RefreshCw',
      alert: 'AlertCircle'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (type) => {
    const colors = {
      message: 'text-primary',
      update: 'text-success',
      alert: 'text-warning'
    };
    return colors?.[type] || 'text-muted-foreground';
  };

  return (
    <div className="space-y-4">
      <div className="px-4 py-3 bg-success/10 rounded-xl border border-success/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <div className="absolute inset-0 w-2 h-2 bg-success rounded-full animate-ping" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-success-foreground">
              {onlineUsers} team members online
            </p>
            <p className="text-xs text-success/80">
              Active collaboration in progress
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="px-4 py-2">
          <h4 className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
            Recent Activity
          </h4>
        </div>

        {activities?.map((activity) => (
          <div
            key={activity?.id}
            className={`
              px-4 py-3 rounded-xl transition-all duration-250 ease-smooth
              ${activity?.count > 0 ? 'bg-muted/50' : 'opacity-50'}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon 
                  name={getActivityIcon(activity?.type)} 
                  size={16} 
                  className={getActivityColor(activity?.type)}
                />
                <span className="text-sm font-medium text-foreground">
                  {activity?.label}
                </span>
              </div>
              {activity?.count > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                  {activity?.count > 99 ? '99+' : activity?.count}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 py-3 bg-muted/30 rounded-xl">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon name="Clock" size={14} />
          <span>Last updated: Just now</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityIndicator;