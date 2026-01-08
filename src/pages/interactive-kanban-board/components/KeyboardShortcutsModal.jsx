import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['Tab'], description: 'Move between columns' },
        { keys: ['↑', '↓'], description: 'Navigate within column' },
        { keys: ['←', '→'], description: 'Switch columns' },
        { keys: ['Esc'], description: 'Clear selection' }
      ]
    },
    {
      category: 'Selection',
      items: [
        { keys: ['Space'], description: 'Select/deselect task' },
        { keys: ['Ctrl', 'Click'], description: 'Multi-select tasks' },
        { keys: ['Ctrl', 'A'], description: 'Select all in column' },
        { keys: ['Shift', 'Click'], description: 'Range select' }
      ]
    },
    {
      category: 'Actions',
      items: [
        { keys: ['E'], description: 'Edit selected task' },
        { keys: ['D'], description: 'Delete selected task' },
        { keys: ['M'], description: 'Move selected task' },
        { keys: ['F'], description: 'Toggle filters' }
      ]
    },
    {
      category: 'View',
      items: [
        { keys: ['C'], description: 'Collapse all columns' },
        { keys: ['X'], description: 'Expand all columns' },
        { keys: ['?'], description: 'Show shortcuts' },
        { keys: ['Ctrl', 'E'], description: 'Export board' }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-200 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Keyboard" size={20} className="text-primary" />
            </div>
            <h2 className="text-lg md:text-xl font-heading font-semibold text-foreground">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-250"
            aria-label="Close shortcuts modal"
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {shortcuts?.map((section) => (
            <div key={section?.category}>
              <h3 className="text-sm font-heading font-semibold text-foreground mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded" />
                {section?.category}
              </h3>
              <div className="space-y-2">
                {section?.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors duration-250"
                  >
                    <span className="text-sm text-muted-foreground">
                      {item?.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {item?.keys?.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">
                            {key}
                          </kbd>
                          {keyIndex < item?.keys?.length - 1 && (
                            <span className="text-muted-foreground">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4 md:p-6">
          <Button
            variant="default"
            onClick={onClose}
            fullWidth
          >
            Got it
          </Button>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;