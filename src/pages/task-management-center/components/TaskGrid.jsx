import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { Checkbox } from '../../../components/ui/Checkbox';

const TaskGrid = ({ tasks, onTaskSelect, selectedTasks, onBulkAction, onTaskClick }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'asc' });

  const priorityColors = {
    critical: 'bg-error/10 text-error border-error/20',
    high: 'bg-warning/10 text-warning border-warning/20',
    medium: 'bg-accent/10 text-accent border-accent/20',
    low: 'bg-success/10 text-success border-success/20'
  };

  const statusColors = {
    backlog: 'bg-muted text-muted-foreground',
    todo: 'bg-primary/10 text-primary',
    'in-progress': 'bg-secondary/10 text-secondary',
    review: 'bg-warning/10 text-warning',
    done: 'bg-success/10 text-success'
  };

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig?.key === key && sortConfig?.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onTaskSelect(tasks?.map(t => t?.id));
    } else {
      onTaskSelect([]);
    }
  };

  const handleSelectTask = (taskId, checked) => {
    if (checked) {
      onTaskSelect([...selectedTasks, taskId]);
    } else {
      onTaskSelect(selectedTasks?.filter(id => id !== taskId));
    }
  };

  const isAllSelected = tasks?.length > 0 && selectedTasks?.length === tasks?.length;
  const isSomeSelected = selectedTasks?.length > 0 && selectedTasks?.length < tasks?.length;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {selectedTasks?.length > 0 && (
        <div className="px-4 md:px-6 py-3 bg-primary/5 border-b border-border flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {selectedTasks?.length} task{selectedTasks?.length !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onBulkAction('status', 'in-progress')}
              className="px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors duration-250"
            >
              <Icon name="Play" size={14} className="inline mr-1" />
              Start
            </button>
            <button
              onClick={() => onBulkAction('priority', 'high')}
              className="px-3 py-1.5 text-xs font-medium bg-warning text-warning-foreground rounded-lg hover:bg-warning/90 transition-colors duration-250"
            >
              <Icon name="Flag" size={14} className="inline mr-1" />
              High Priority
            </button>
            <button
              onClick={() => onBulkAction('delete')}
              className="px-3 py-1.5 text-xs font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors duration-250"
            >
              <Icon name="Trash2" size={14} className="inline mr-1" />
              Delete
            </button>
          </div>
        </div>
      )}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isSomeSelected}
                  onChange={(e) => handleSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('id')}
                  className="flex items-center gap-2 text-xs font-caption uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-250"
                >
                  ID
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left min-w-[250px]">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center gap-2 text-xs font-caption uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-250"
                >
                  Task Title
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-caption uppercase tracking-wide text-muted-foreground">
                  Assignee
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center gap-2 text-xs font-caption uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-250"
                >
                  Priority
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-caption uppercase tracking-wide text-muted-foreground">
                  Status
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => handleSort('deadline')}
                  className="flex items-center gap-2 text-xs font-caption uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors duration-250"
                >
                  Deadline
                  <Icon name="ArrowUpDown" size={14} />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-caption uppercase tracking-wide text-muted-foreground">
                  Progress
                </span>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-caption uppercase tracking-wide text-muted-foreground">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tasks?.map((task) => (
              <tr
                key={task?.id}
                className="hover:bg-muted/30 transition-colors duration-250 cursor-pointer"
                onClick={() => onTaskClick(task?.id)}
              >
                <td className="px-4 py-3" onClick={(e) => e?.stopPropagation()}>
                  <Checkbox
                    checked={selectedTasks?.includes(task?.id)}
                    onChange={(e) => handleSelectTask(task?.id, e?.target?.checked)}
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-mono text-muted-foreground">
                    #{task?.id}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground line-clamp-1">
                      {task?.title}
                    </span>
                    {task?.hasAttachments && (
                      <Icon name="Paperclip" size={14} className="text-muted-foreground" />
                    )}
                    {task?.commentCount > 0 && (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Icon name="MessageSquare" size={14} />
                        {task?.commentCount}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {task?.assignee ? (
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={task?.assignee?.avatar}
                          alt={task?.assignee?.avatarAlt}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm text-foreground hidden lg:inline">
                        {task?.assignee?.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Unassigned</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`
                    inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border
                    ${priorityColors?.[task?.priority]}
                  `}>
                    <Icon name="Flag" size={12} />
                    {task?.priority?.charAt(0)?.toUpperCase() + task?.priority?.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`
                    inline-flex items-center px-2 py-1 text-xs font-medium rounded
                    ${statusColors?.[task?.status]}
                  `}>
                    {task?.status?.split('-')?.map(word => 
                      word?.charAt(0)?.toUpperCase() + word?.slice(1)
                    )?.join(' ')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`
                      text-sm font-medium
                      ${task?.isOverdue ? 'text-error' : 'text-foreground'}
                    `}>
                      {task?.deadline}
                    </span>
                    {task?.isOverdue && (
                      <Icon name="AlertCircle" size={14} className="text-error" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-250"
                        style={{ width: `${task?.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {task?.progress}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3" onClick={(e) => e?.stopPropagation()}>
                  <div className="flex items-center gap-1">
                    <button
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors duration-250"
                      aria-label="Edit task"
                    >
                      <Icon name="Edit2" size={16} className="text-muted-foreground" />
                    </button>
                    <button
                      className="p-1.5 hover:bg-muted rounded-lg transition-colors duration-250"
                      aria-label="More options"
                    >
                      <Icon name="MoreVertical" size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tasks?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Inbox" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No tasks found</p>
        </div>
      )}
    </div>
  );
};

export default TaskGrid;