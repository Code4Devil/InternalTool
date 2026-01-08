import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';

const TaskTableRow = ({ task, onStatusChange, onPriorityChange, onTaskClick }) => {
  const [isEditing, setIsEditing] = useState(false);

  const statusOptions = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' }
  ];

  const priorityOptions = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return 'bg-success/10 text-success border-success/20';
      case 'in-progress':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'review':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'todo':
        return 'bg-accent/10 text-accent border-accent/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error/10 text-error border-error/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'low':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const isOverdue = new Date(task.deadline) < new Date() && task?.status !== 'done';
  const deadlineColor = isOverdue ? 'text-error font-semibold' : 'text-foreground';

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-smooth">
      <td className="p-3 md:p-4 lg:p-5">
        <button
          onClick={() => onTaskClick(task)}
          className="text-left text-xs md:text-sm lg:text-base font-medium text-foreground hover:text-primary transition-smooth line-clamp-2"
        >
          {task?.title}
        </button>
      </td>
      <td className="p-3 md:p-4 lg:p-5">
        {isEditing ? (
          <Select
            options={priorityOptions}
            value={task?.priority}
            onChange={(value) => {
              onPriorityChange(task?.id, value);
              setIsEditing(false);
            }}
            className="w-full"
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className={`inline-flex items-center px-2 md:px-2.5 lg:px-3 py-1 md:py-1.5 lg:py-2 rounded-lg border text-xs md:text-sm font-caption capitalize transition-smooth ${getPriorityColor(
              task?.priority
            )}`}
          >
            {task?.priority}
          </button>
        )}
      </td>
      <td className="p-3 md:p-4 lg:p-5">
        <span className={`text-xs md:text-sm lg:text-base font-body whitespace-nowrap ${deadlineColor}`}>
          {new Date(task.deadline)?.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
          {isOverdue && (
            <Icon name="AlertCircle" size={14} color="var(--color-error)" className="inline ml-1 md:ml-1.5 lg:ml-2" />
          )}
        </span>
      </td>
      <td className="p-3 md:p-4 lg:p-5">
        <Select
          options={statusOptions}
          value={task?.status}
          onChange={(value) => onStatusChange(task?.id, value)}
          className="w-full"
        />
      </td>
      <td className="p-3 md:p-4 lg:p-5">
        <div className="flex items-center space-x-2 md:space-x-2.5 lg:space-x-3">
          <button
            onClick={() => onTaskClick(task)}
            className="p-1.5 md:p-2 lg:p-2.5 rounded-lg hover:bg-muted transition-smooth"
            aria-label="View task details"
          >
            <Icon name="Eye" size={16} color="var(--color-foreground)" />
          </button>
          <button
            className="p-1.5 md:p-2 lg:p-2.5 rounded-lg hover:bg-muted transition-smooth"
            aria-label="Edit task"
          >
            <Icon name="Edit" size={16} color="var(--color-foreground)" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TaskTableRow;