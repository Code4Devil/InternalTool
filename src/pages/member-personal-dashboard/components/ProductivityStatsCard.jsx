import React from 'react';
import Icon from '../../../components/AppIcon';

const ProductivityStatsCard = ({ icon, label, value, trend, trendValue, color }) => {
  const getTrendColor = (trend) => {
    return trend === 'up' ? 'text-success' : trend === 'down' ? 'text-error' : 'text-muted-foreground';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 md:p-5 lg:p-6 transition-smooth hover:shadow-elevation-2">
      <div className="flex items-start justify-between mb-3 md:mb-4 lg:mb-5">
        <div className={`w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-lg ${color} flex items-center justify-center`}>
          <Icon name={icon} size={20} color="var(--color-primary-foreground)" />
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${getTrendColor(trend)}`}>
            <Icon name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={16} color="currentColor" />
            <span className="text-xs md:text-sm font-caption font-medium">{trendValue}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs md:text-sm lg:text-base text-muted-foreground font-body">{label}</p>
        <p className="text-xl md:text-2xl lg:text-3xl font-heading font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
};

export default ProductivityStatsCard;