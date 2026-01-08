import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TaskDetailModal = ({ task, onClose }) => {
  if (!task) return null;

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

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg shadow-elevation-4 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 md:p-5 lg:p-6 flex items-center justify-between">
          <h2 className="text-lg md:text-xl lg:text-2xl font-heading font-semibold text-foreground">Task Details</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-smooth"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} color="var(--color-foreground)" />
          </button>
        </div>

        <div className="p-4 md:p-5 lg:p-6 space-y-6">
          <div>
            <h3 className="text-base md:text-lg lg:text-xl font-heading font-semibold text-foreground mb-2">
              {task?.title}
            </h3>
            <p className="text-sm md:text-base lg:text-lg text-muted-foreground">{task?.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
            <div>
              <p className="text-xs md:text-sm text-muted-foreground mb-2">Status</p>
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-caption capitalize ${getStatusColor(
                  task?.status
                )}`}
              >
                {task?.status?.replace('-', ' ')}
              </span>
            </div>

            <div>
              <p className="text-xs md:text-sm text-muted-foreground mb-2">Priority</p>
              <span
                className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-caption capitalize ${getPriorityColor(
                  task?.priority
                )}`}
              >
                {task?.priority}
              </span>
            </div>

            <div>
              <p className="text-xs md:text-sm text-muted-foreground mb-2">Deadline</p>
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={16} color="var(--color-foreground)" />
                <span className="text-sm md:text-base text-foreground">
                  {new Date(task.deadline)?.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>

            <div>
              <p className="text-xs md:text-sm text-muted-foreground mb-2">Assigned By</p>
              <div className="flex items-center space-x-2">
                <Icon name="User" size={16} color="var(--color-foreground)" />
                <span className="text-sm md:text-base text-foreground">{task?.assignedBy}</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs md:text-sm text-muted-foreground mb-3">Attachments</p>
            <div className="space-y-2">
              {task?.attachments && task?.attachments?.length > 0 ? (
                task?.attachments?.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-smooth"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name="Paperclip" size={16} color="var(--color-foreground)" />
                      <span className="text-sm text-foreground">{file}</span>
                    </div>
                    <button className="p-1.5 rounded hover:bg-background transition-smooth" aria-label="Download file">
                      <Icon name="Download" size={16} color="var(--color-foreground)" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No attachments</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button variant="default" iconName="Edit" iconPosition="left">
              Edit Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailModal;