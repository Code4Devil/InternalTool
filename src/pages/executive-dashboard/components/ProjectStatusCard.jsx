import React from 'react';
import Icon from '../../../components/AppIcon';

const ProjectStatusCard = ({ project }) => {
  const getHealthColor = () => {
    if (project?.health === 'healthy') return 'bg-success/10 text-success border-success/20';
    if (project?.health === 'at-risk') return 'bg-warning/10 text-warning border-warning/20';
    if (project?.health === 'critical') return 'bg-error/10 text-error border-error/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  const getHealthIcon = () => {
    if (project?.health === 'healthy') return 'CheckCircle';
    if (project?.health === 'at-risk') return 'AlertTriangle';
    if (project?.health === 'critical') return 'AlertCircle';
    return 'Circle';
  };

  const getProgressColor = () => {
    if (project?.progress >= 75) return 'bg-success';
    if (project?.progress >= 50) return 'bg-primary';
    if (project?.progress >= 25) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-5 transition-all duration-250 hover:shadow-md">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm md:text-base font-heading font-semibold text-foreground mb-1 truncate">
            {project?.name}
          </h4>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
            {project?.description}
          </p>
        </div>
        <div className={`px-2 py-1 rounded-lg border flex items-center gap-1 flex-shrink-0 ml-2 ${getHealthColor()}`}>
          <Icon name={getHealthIcon()} size={14} />
          <span className="text-xs font-medium capitalize whitespace-nowrap">{project?.health}</span>
        </div>
      </div>
      <div className="space-y-2 md:space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Progress</span>
            <span className="text-xs font-medium text-foreground">{project?.progress}%</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${project?.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Icon name="Calendar" size={14} />
            <span className="whitespace-nowrap">{project?.deadline}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Icon name="Users" size={14} />
            <span className="whitespace-nowrap">{project?.teamSize} members</span>
          </div>
        </div>

        {project?.risks && project?.risks?.length > 0 && (
          <div className="pt-2 border-t border-border">
            <div className="flex items-start gap-2">
              <Icon name="AlertTriangle" size={14} className="text-warning flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground line-clamp-2">{project?.risks?.[0]}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectStatusCard;