import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const AuditLogEntry = ({ log, isSelected, isExpanded, onSelect, onExpand }) => {
  const getActionIcon = (actionType) => {
    const icons = {
      task_change: 'CheckSquare',
      chat_message: 'MessageSquare',
      video_call: 'Video',
      role_modification: 'Shield',
      system_event: 'Settings'
    };
    return icons?.[actionType] || 'Activity';
  };

  const getActionColor = (actionType) => {
    const colors = {
      task_change: 'text-primary bg-primary/10',
      chat_message: 'text-secondary bg-secondary/10',
      video_call: 'text-success bg-success/10',
      role_modification: 'text-warning bg-warning/10',
      system_event: 'text-muted-foreground bg-muted'
    };
    return colors?.[actionType] || 'text-muted-foreground bg-muted';
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      critical: 'bg-error/10 text-error border-error/20',
      warning: 'bg-warning/10 text-warning border-warning/20',
      info: 'bg-primary/10 text-primary border-primary/20'
    };
    return colors?.[severity] || colors?.info;
  };

  return (
    <div className="border border-border rounded-lg hover:border-primary/30 transition-all duration-250">
      <div 
        className="flex items-start gap-3 p-3 md:p-4 cursor-pointer"
        onClick={() => onExpand?.(log?.id)}
      >
        <div className="flex items-center pt-1" onClick={(e) => e?.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect?.(log?.id)}
          />
        </div>

        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActionColor(log?.actionType)}`}>
          <Icon name={getActionIcon(log?.actionType)} size={18} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm md:text-base font-medium text-foreground">
                {log?.action}
              </h4>
              <span className={`px-2 py-0.5 text-xs font-medium rounded border flex-shrink-0 ${getSeverityBadge(log?.severity)}`}>
                {log?.severity}
              </span>
            </div>
            <Icon 
              name={isExpanded ? 'ChevronUp' : 'ChevronDown'} 
              size={16} 
              className="text-muted-foreground flex-shrink-0"
            />
          </div>

          <p className="text-xs md:text-sm text-muted-foreground mb-2">
            {log?.description}
          </p>

          <div className="flex items-center gap-3 md:gap-4 text-xs text-muted-foreground flex-wrap">
            <div className="flex items-center gap-1">
              <Icon name="Clock" size={12} />
              <span className="whitespace-nowrap">{log?.timeAgo}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium">
                {log?.user?.avatar}
              </div>
              <span className="whitespace-nowrap">{log?.user?.name}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Folder" size={12} />
              <span className="whitespace-nowrap">{log?.project}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Tag" size={12} />
              <span className="whitespace-nowrap">{log?.resource}</span>
            </div>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-border p-3 md:p-4 bg-muted/30">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                <Icon name="Info" size={14} />
                Details
              </h5>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Timestamp:</span>
                  <span>{log?.timestamp}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">User Role:</span>
                  <span>{log?.user?.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">IP Address:</span>
                  <span>{log?.ipAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Device:</span>
                  <span>{log?.device}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                <Icon name="GitCompare" size={14} />
                Change Details
              </h5>
              <div className="space-y-2">
                {log?.details?.before && (
                  <div className="bg-error/5 border border-error/20 rounded p-2">
                    <div className="text-xs font-medium text-error mb-1">Before:</div>
                    <pre className="text-xs text-muted-foreground overflow-x-auto">
                      {JSON.stringify(log?.details?.before, null, 2)}
                    </pre>
                  </div>
                )}
                {log?.details?.after && (
                  <div className="bg-success/5 border border-success/20 rounded p-2">
                    <div className="text-xs font-medium text-success mb-1">After:</div>
                    <pre className="text-xs text-muted-foreground overflow-x-auto">
                      {JSON.stringify(log?.details?.after, null, 2)}
                    </pre>
                  </div>
                )}
                {!log?.details?.before && !log?.details?.after && (
                  <div className="text-xs text-muted-foreground">
                    <pre className="overflow-x-auto">
                      {JSON.stringify(log?.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogEntry;