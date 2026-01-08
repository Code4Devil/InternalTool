import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityIndicator = ({ type, status, message }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'active':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getIconName = () => {
    switch (type) {
      case 'ssl':
        return 'Shield';
      case 'chat':
        return 'MessageSquare';
      case 'video':
        return 'Video';
      case 'database':
        return 'Database';
      default:
        return 'CheckCircle';
    }
  };

  return (
    <div className="flex items-center space-x-2 px-3 py-2 bg-muted/50 rounded-lg">
      <Icon 
        name={getIconName()} 
        size={16} 
        color={`var(--color-${status === 'active' ? 'success' : status === 'warning' ? 'warning' : status === 'error' ? 'error' : 'muted-foreground'})`}
      />
      <span className={`text-xs font-caption ${getStatusColor()}`}>
        {message}
      </span>
    </div>
  );
};

export default SecurityIndicator;