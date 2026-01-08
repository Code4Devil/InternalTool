import React from 'react';

import Button from '../../../components/ui/Button';

const BulkOperationsBar = ({ 
  selectedTasks, 
  onMoveSelected, 
  onDeleteSelected, 
  onClearSelection,
  columns 
}) => {
  if (selectedTasks?.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-100 animate-in slide-in-from-bottom-4 duration-250">
      <div className="bg-card border-2 border-primary rounded-xl shadow-lg p-3 md:p-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary text-primary-foreground rounded-lg flex items-center justify-center font-bold text-sm">
              {selectedTasks?.length}
            </div>
            <span className="text-sm font-medium text-foreground">
              {selectedTasks?.length === 1 ? 'task' : 'tasks'} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative group">
              <Button
                variant="secondary"
                size="sm"
                iconName="Move"
              >
                Move to
              </Button>
              <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block">
                <div className="bg-popover border border-border rounded-lg shadow-lg p-2 min-w-40">
                  {columns?.map((column) => (
                    <button
                      key={column?.id}
                      onClick={() => onMoveSelected(column?.id)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted rounded transition-colors duration-250"
                    >
                      {column?.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              variant="destructive"
              size="sm"
              iconName="Trash2"
              onClick={onDeleteSelected}
            >
              Delete
            </Button>

            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClearSelection}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkOperationsBar;