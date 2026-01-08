import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onAction }) => {
  const actions = [
    {
      id: 'create-task',
      label: 'New Task',
      icon: 'Plus',
      variant: 'default',
      description: 'Create a new task'
    },
    {
      id: 'import-tasks',
      label: 'Import',
      icon: 'Upload',
      variant: 'outline',
      description: 'Import tasks from CSV'
    },
    {
      id: 'export-tasks',
      label: 'Export',
      icon: 'Download',
      variant: 'outline',
      description: 'Export filtered tasks'
    },
    {
      id: 'kanban-view',
      label: 'Kanban',
      icon: 'Trello',
      variant: 'secondary',
      description: 'Switch to Kanban board'
    }
  ];

  const shortcuts = [
    { key: 'N', description: 'New task' },
    { key: 'F', description: 'Focus search' },
    { key: 'K', description: 'Kanban view' },
    { key: '/', description: 'Show shortcuts' }
  ];

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <h3 className="text-base md:text-lg font-heading font-semibold text-foreground mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {actions?.map((action) => (
            <Button
              key={action?.id}
              variant={action?.variant}
              iconName={action?.icon}
              iconPosition="left"
              onClick={() => onAction(action?.id)}
              fullWidth
            >
              {action?.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-4 md:p-6">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <Icon name="Keyboard" size={16} />
          Keyboard Shortcuts
        </h4>
        <div className="space-y-2">
          {shortcuts?.map((shortcut) => (
            <div key={shortcut?.key} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{shortcut?.description}</span>
              <kbd className="px-2 py-1 text-xs font-mono bg-muted text-foreground rounded border border-border">
                {shortcut?.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-xl p-4 md:p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
            <Icon name="Lightbulb" size={20} className="text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Pro Tip</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Use bulk actions to update multiple tasks at once. Select tasks and choose an action from the toolbar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;