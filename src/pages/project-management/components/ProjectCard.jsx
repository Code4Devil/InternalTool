import React from 'react';
import Icon from '../../../components/AppIcon';

const ProjectCard = ({ project, currentUserId, onEdit, onManageTeam, onDelete, onClick }) => {
  const userRole = project.project_members?.find(m => m.user_id === currentUserId)?.role || 'viewer';
  const canEdit = ['owner', 'admin', 'manager'].includes(userRole);
  const canDelete = ['owner', 'admin'].includes(userRole);

  const statusColors = {
    active: 'bg-success/10 text-success border-success/20',
    on_hold: 'bg-warning/10 text-warning border-warning/20',
    completed: 'bg-primary/10 text-primary border-primary/20',
    archived: 'bg-muted/10 text-muted-foreground border-muted/20',
    planning: 'bg-secondary/10 text-secondary border-secondary/20',
  };

  const statusIcons = {
    active: 'CheckCircle',
    on_hold: 'Pause',
    completed: 'CheckCheck',
    archived: 'Archive',
    planning: 'Clock',
  };

  const handleCardClick = (e) => {
    // Don't trigger onClick if clicking on action buttons
    if (e.target.closest('button')) return;
    onClick?.();
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-card rounded-xl shadow-elevation-1 hover:shadow-elevation-2 transition-all cursor-pointer overflow-hidden"
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-heading font-semibold text-foreground truncate">
              {project.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {project.description || 'No description'}
            </p>
          </div>
          <div className={`px-2 py-1 rounded text-xs font-medium border ${statusColors[project.status] || statusColors.planning} flex items-center gap-1 ml-2`}>
            <Icon name={statusIcons[project.status] || 'Circle'} size={12} />
            {project.status?.replace('_', ' ')}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Icon name="CheckSquare" size={16} />
            <span>{project.taskCount || 0} tasks</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Icon name="Users" size={16} />
            <span>{project.memberCount || 0} members</span>
          </div>
        </div>

        {/* Role Badge */}
        <div className="flex items-center gap-2">
          <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
            {userRole}
          </div>
          <span className="text-xs text-muted-foreground">
            Created {new Date(project.created_at).toLocaleDateString()}
          </span>
        </div>

        {/* Actions */}
        {canEdit && (
          <div className="flex gap-2 pt-2 border-t border-border">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onManageTeam(project);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted rounded-lg text-sm font-medium text-foreground transition-smooth"
            >
              <Icon name="Users" size={16} />
              Team
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(project);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted rounded-lg text-sm font-medium text-foreground transition-smooth"
            >
              <Icon name="Settings" size={16} />
              Settings
            </button>
            {canDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(project.id);
                }}
                className="flex items-center justify-center px-3 py-2 bg-error/10 hover:bg-error/20 rounded-lg text-sm font-medium text-error transition-smooth"
              >
                <Icon name="Trash2" size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
