import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import Icon from '../../../components/AppIcon';
import KanbanCard from './KanbanCard';

const KanbanColumn = ({ 
  column, 
  tasks, 
  onTaskMove, 
  onTaskEdit, 
  onTaskDelete,
  userRole,
  isOverLimit 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'TASK_CARD',
    drop: (item) => {
      if (item?.columnId !== column?.id) {
        onTaskMove(item?.taskId, item?.columnId, column?.id);
      }
    },
    canDrop: (item) => {
      if (userRole === 'guest') return false;
      if (column?.locked && userRole !== 'executive') return false;
      return true;
    },
    collect: (monitor) => ({
      isOver: monitor?.isOver(),
      canDrop: monitor?.canDrop()
    })
  });

  const getColumnColor = () => {
    const colors = {
      backlog: 'border-muted-foreground/20',
      todo: 'border-primary/30',
      inprogress: 'border-warning/30',
      review: 'border-secondary/30',
      done: 'border-success/30'
    };
    return colors?.[column?.id] || 'border-border';
  };

  const getHeaderColor = () => {
    const colors = {
      backlog: 'bg-muted',
      todo: 'bg-primary/10',
      inprogress: 'bg-warning/10',
      review: 'bg-secondary/10',
      done: 'bg-success/10'
    };
    return colors?.[column?.id] || 'bg-muted';
  };

  const getDropIndicator = () => {
    if (!canDrop) return 'opacity-50';
    if (isOver) return 'ring-2 ring-primary bg-primary/5';
    return '';
  };

  return (
    <div
      ref={drop}
      className={`
        flex flex-col h-full bg-card rounded-xl border-2 transition-all duration-250
        ${getColumnColor()} ${getDropIndicator()}
        ${isOverLimit ? 'ring-2 ring-error' : ''}
      `}
    >
      <div className={`p-3 md:p-4 rounded-t-xl ${getHeaderColor()}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm md:text-base font-heading font-semibold text-foreground">
              {column?.name}
            </h3>
            <span className={`
              px-2 py-0.5 text-xs font-bold rounded-full
              ${isOverLimit ? 'bg-error text-error-foreground' : 'bg-muted text-muted-foreground'}
            `}>
              {tasks?.length}
              {column?.wipLimit && ` / ${column?.wipLimit}`}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {column?.locked && (
              <Icon name="Lock" size={14} className="text-muted-foreground" />
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-muted rounded transition-colors duration-250"
              aria-label={isCollapsed ? 'Expand column' : 'Collapse column'}
            >
              <Icon 
                name={isCollapsed ? 'ChevronDown' : 'ChevronUp'} 
                size={16} 
                className="text-muted-foreground"
              />
            </button>
          </div>
        </div>
        {isOverLimit && (
          <div className="flex items-center gap-1 text-xs text-error">
            <Icon name="AlertTriangle" size={12} />
            <span>WIP limit exceeded</span>
          </div>
        )}
      </div>
      <div className={`
        flex-1 overflow-y-auto custom-scrollbar p-2 md:p-3 space-y-2 md:space-y-3
        ${isCollapsed ? 'hidden' : ''}
      `}>
        {tasks?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center">
            <Icon name="Inbox" size={32} className="text-muted-foreground mb-2" />
            <p className="text-xs md:text-sm text-muted-foreground">
              No tasks in {column?.name?.toLowerCase()}
            </p>
          </div>
        ) : (
          tasks?.map((task) => (
            <KanbanCard
              key={task?.id}
              task={task}
              columnId={column?.id}
              onEdit={onTaskEdit}
              onDelete={onTaskDelete}
              userRole={userRole}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;