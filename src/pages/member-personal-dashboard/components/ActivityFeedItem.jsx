import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeedItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'task-assigned':
        return 'UserPlus';
      case 'task-completed':
        return 'CheckCircle2';
      case 'task-updated':
        return 'Edit';
      case 'comment-added':
        return 'MessageSquare';
      case 'file-uploaded':
        return 'Upload';
      case 'deadline-changed':
        return 'Calendar';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'task-assigned':
        return 'bg-primary/10 text-primary';
      case 'task-completed':
        return 'bg-success/10 text-success';
      case 'task-updated':
        return 'bg-warning/10 text-warning';
      case 'comment-added':
        return 'bg-accent/10 text-accent';
      case 'file-uploaded':
        return 'bg-secondary/10 text-secondary';
      case 'deadline-changed':
        return 'bg-error/10 text-error';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffMs = now - activityTime;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return activityTime?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex items-start space-x-3 md:space-x-4 lg:space-x-5 p-3 md:p-4 lg:p-5 hover:bg-muted rounded-lg transition-smooth">
      <div className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg ${getActivityColor(activity?.type)} flex items-center justify-center flex-shrink-0`}>
        <Icon name={getActivityIcon(activity?.type)} size={16} color="currentColor" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm lg:text-base text-foreground font-body line-clamp-2">{activity?.message}</p>
        <div className="flex items-center space-x-2 mt-1 md:mt-1.5 lg:mt-2">
          <span className="text-xs md:text-sm font-caption text-muted-foreground">
            {formatTimestamp(activity?.timestamp)}
          </span>
          {activity?.taskTitle && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-xs md:text-sm font-caption text-primary truncate">{activity?.taskTitle}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeedItem;