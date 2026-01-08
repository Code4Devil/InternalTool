import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, change, changeType, icon, iconColor, trend }) => {
  const getChangeColor = () => {
    if (changeType === 'positive') return 'text-success';
    if (changeType === 'negative') return 'text-error';
    return 'text-muted-foreground';
  };

  const getChangeIcon = () => {
    if (changeType === 'positive') return 'TrendingUp';
    if (changeType === 'negative') return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 transition-all duration-250 hover:shadow-md">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-muted-foreground font-caption uppercase tracking-wide mb-1">
            {title}
          </p>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground truncate">
            {value}
          </h3>
        </div>
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor}`}>
          <Icon name={icon} size={20} className="md:w-6 md:h-6" />
        </div>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <div className={`flex items-center gap-1 ${getChangeColor()}`}>
          <Icon name={getChangeIcon()} size={16} />
          <span className="text-xs md:text-sm font-medium">{change}</span>
        </div>
        <span className="text-xs md:text-sm text-muted-foreground">{trend}</span>
      </div>
    </div>
  );
};

export default MetricsCard;