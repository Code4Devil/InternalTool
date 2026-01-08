import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const KanbanCard = ({ task, columnId, onEdit, onDelete, userRole }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task?.title);

  const [{ isDragging }, drag] = useDrag({
    type: 'TASK_CARD',
    item: { taskId: task?.id, columnId },
    canDrag: userRole !== 'guest',
    collect: (monitor) => ({
      isDragging: monitor?.isDragging()
    })
  });

  const getPriorityColor = () => {
    const colors = {
      critical: 'bg-error text-error-foreground',
      high: 'bg-warning text-warning-foreground',
      medium: 'bg-primary text-primary-foreground',
      low: 'bg-muted text-muted-foreground'
    };
    return colors?.[task?.priority] || colors?.medium;
  };

  const getPriorityIcon = () => {
    const icons = {
      critical: 'AlertCircle',
      high: 'ArrowUp',
      medium: 'Minus',
      low: 'ArrowDown'
    };
    return icons?.[task?.priority] || 'Minus';
  };

  const getDueDateColor = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-error';
    if (diffDays <= 2) return 'text-warning';
    return 'text-muted-foreground';
  };

  const formatDueDate = () => {
    const date = new Date(task.dueDate);
    const today = new Date();
    const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`;
    
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleTitleEdit = () => {
    if (editedTitle?.trim() && editedTitle !== task?.title) {
      onEdit(task?.id, { title: editedTitle });
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleTitleEdit();
    } else if (e?.key === 'Escape') {
      setEditedTitle(task?.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      ref={drag}
      className={`
        bg-surface border border-border rounded-lg p-3 md:p-4 cursor-move
        transition-all duration-250 hover:shadow-md
        ${isDragging ? 'opacity-50 rotate-2' : 'opacity-100'}
      `}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e?.target?.value)}
            onBlur={handleTitleEdit}
            onKeyDown={handleKeyPress}
            className="flex-1 text-sm font-medium bg-input border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring"
            autoFocus
          />
        ) : (
          <h4
            className="flex-1 text-sm font-medium text-foreground line-clamp-2 cursor-text"
            onClick={() => userRole !== 'guest' && setIsEditing(true)}
          >
            {task?.title}
          </h4>
        )}
        <div className={`px-2 py-1 rounded-full flex items-center gap-1 ${getPriorityColor()}`}>
          <Icon name={getPriorityIcon()} size={12} />
          <span className="text-xs font-bold uppercase hidden md:inline">
            {task?.priority}
          </span>
        </div>
      </div>
      {task?.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {task?.description}
        </p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task?.assignees?.map((assignee, index) => (
            <div
              key={assignee?.id}
              className="relative"
              style={{ marginLeft: index > 0 ? '-8px' : '0' }}
            >
              <div className="w-6 h-6 md:w-7 md:h-7 rounded-full overflow-hidden border-2 border-surface">
                <Image
                  src={assignee?.avatar}
                  alt={assignee?.avatarAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {task?.attachments > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Icon name="Paperclip" size={12} />
              <span className="text-xs">{task?.attachments}</span>
            </div>
          )}
          {task?.comments > 0 && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Icon name="MessageSquare" size={12} />
              <span className="text-xs">{task?.comments}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className={`flex items-center gap-1 text-xs ${getDueDateColor()}`}>
          <Icon name="Calendar" size={12} />
          <span className="font-medium">{formatDueDate()}</span>
        </div>

        {task?.tags && task?.tags?.length > 0 && (
          <div className="flex items-center gap-1">
            {task?.tags?.slice(0, 2)?.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded"
              >
                {tag}
              </span>
            ))}
            {task?.tags?.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{task?.tags?.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;