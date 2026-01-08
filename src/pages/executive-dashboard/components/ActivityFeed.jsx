import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    const icons = {
      escalation: 'AlertTriangle',
      approval: 'CheckCircle',
      milestone: 'Flag',
      risk: 'AlertCircle',
      budget: 'DollarSign',
      resource: 'Users'
    };
    return icons?.[type] || 'Activity';
  };

  const getActivityColor = (priority) => {
    if (priority === 'critical') return 'text-error bg-error/10';
    if (priority === 'high') return 'text-warning bg-warning/10';
    if (priority === 'medium') return 'text-primary bg-primary/10';
    return 'text-muted-foreground bg-muted';
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      critical: 'bg-error/10 text-error border-error/20',
      high: 'bg-warning/10 text-warning border-warning/20',
      medium: 'bg-primary/10 text-primary border-primary/20',
      low: 'bg-muted text-muted-foreground border-border'
    };
    return colors?.[priority] || colors?.low;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-4 md:mb-6">
        <div>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-1">
            Critical Activities
          </h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            Items requiring executive attention
          </p>
        </div>
        <button className="text-xs md:text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-250">
          View All
        </button>
      </div>
      <div className="space-y-3 md:space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
        {activities?.map((activity) => (
          <div 
            key={activity?.id}
            className="flex items-start gap-3 p-3 md:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-all duration-250 cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.priority)}`}>
              <Icon name={getActivityIcon(activity?.type)} size={18} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="text-sm md:text-base font-medium text-foreground line-clamp-1">
                  {activity?.title}
                </h4>
                <span className={`px-2 py-0.5 text-xs font-medium rounded border flex-shrink-0 ${getPriorityBadge(activity?.priority)}`}>
                  {activity?.priority}
                </span>
              </div>
              
              <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-2">
                {activity?.description}
              </p>
              
              <div className="flex items-center gap-3 md:gap-4 text-xs text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <Icon name="Clock" size={12} />
                  <span className="whitespace-nowrap">{activity?.timestamp}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="User" size={12} />
                  <span className="whitespace-nowrap">{activity?.assignee}</span>
                </div>
                {activity?.project && (
                  <div className="flex items-center gap-1">
                    <Icon name="Folder" size={12} />
                    <span className="whitespace-nowrap">{activity?.project}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;