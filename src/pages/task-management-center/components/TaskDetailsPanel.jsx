import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TaskDetailsPanel = ({ task, onClose, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('details');
  const [newComment, setNewComment] = useState('');

  if (!task) {
    return (
      <div className="bg-card border border-border rounded-xl h-full flex items-center justify-center">
        <div className="text-center p-8">
          <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Select a task to view details</p>
        </div>
      </div>
    );
  }

  const priorityOptions = [
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const statusOptions = [
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' }
  ];

  const tabs = [
    { id: 'details', label: 'Details', icon: 'FileText' },
    { id: 'comments', label: 'Comments', icon: 'MessageSquare', badge: task?.comments?.length },
    { id: 'activity', label: 'Activity', icon: 'Activity' },
    { id: 'attachments', label: 'Files', icon: 'Paperclip', badge: task?.attachments?.length }
  ];

  const handleAddComment = () => {
    if (newComment?.trim()) {
      console.log('Adding comment:', newComment);
      setNewComment('');
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl h-full flex flex-col">
      <div className="p-4 md:p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-muted-foreground">#{task?.id}</span>
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground line-clamp-1">
            {task?.title}
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-muted rounded-lg transition-colors duration-250"
          aria-label="Close panel"
        >
          <Icon name="X" size={20} />
        </button>
      </div>
      <div className="border-b border-border">
        <div className="flex items-center gap-2 px-4 md:px-6 overflow-x-auto">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-250
                ${activeTab === tab?.id
                  ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              {tab?.badge > 0 && (
                <span className="px-1.5 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                  {tab?.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6">
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Description
              </label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {task?.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Priority"
                options={priorityOptions}
                value={task?.priority}
                onChange={(value) => onUpdate({ priority: value })}
              />

              <Select
                label="Status"
                options={statusOptions}
                value={task?.status}
                onChange={(value) => onUpdate({ status: value })}
              />
            </div>

            <Input
              type="date"
              label="Deadline"
              value={task?.deadlineRaw}
              onChange={(e) => onUpdate({ deadline: e?.target?.value })}
            />

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Assignee
              </label>
              {task?.assignee ? (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-background">
                    <Image
                      src={task?.assignee?.avatar}
                      alt={task?.assignee?.avatarAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{task?.assignee?.name}</p>
                    <p className="text-xs text-muted-foreground">{task?.assignee?.email}</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No assignee</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Progress
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-250"
                    style={{ width: `${task?.progress}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-foreground whitespace-nowrap">
                  {task?.progress}%
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-4">
            <div className="space-y-4">
              {task?.comments?.map((comment) => (
                <div key={comment?.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={comment?.author?.avatar}
                      alt={comment?.author?.avatarAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {comment?.author?.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {comment?.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {comment?.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <Input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e?.target?.value)}
                className="mb-3"
              />
              <Button
                variant="default"
                iconName="Send"
                iconPosition="right"
                onClick={handleAddComment}
                disabled={!newComment?.trim()}
              >
                Post Comment
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4">
            {task?.activity?.map((item) => (
              <div key={item?.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name={item?.icon} size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">{item?.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item?.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'attachments' && (
          <div className="space-y-3">
            {task?.attachments?.map((file) => (
              <div
                key={file?.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors duration-250"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon name="File" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{file?.name}</p>
                    <p className="text-xs text-muted-foreground">{file?.size}</p>
                  </div>
                </div>
                <button
                  className="p-2 hover:bg-background rounded-lg transition-colors duration-250"
                  aria-label="Download file"
                >
                  <Icon name="Download" size={16} className="text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-4 md:p-6 border-t border-border flex items-center gap-3">
        <Button variant="default" iconName="Save" fullWidth>
          Save Changes
        </Button>
        <Button variant="outline" iconName="Copy" fullWidth>
          Duplicate
        </Button>
      </div>
    </div>
  );
};

export default TaskDetailsPanel;