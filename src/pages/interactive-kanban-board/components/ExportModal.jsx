import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportModal = ({ isOpen, onClose, onExport, columns }) => {
  const [selectedColumns, setSelectedColumns] = useState(columns?.map(c => c?.id));
  const [exportFormat, setExportFormat] = useState('json');
  const [includeArchived, setIncludeArchived] = useState(false);

  if (!isOpen) return null;

  const handleColumnToggle = (columnId) => {
    setSelectedColumns(prev =>
      prev?.includes(columnId)
        ? prev?.filter(id => id !== columnId)
        : [...prev, columnId]
    );
  };

  const handleExport = () => {
    onExport({
      columns: selectedColumns,
      format: exportFormat,
      includeArchived
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-200 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-md">
        <div className="p-4 md:p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="Download" size={20} className="text-primary" />
              </div>
              <h2 className="text-lg font-heading font-semibold text-foreground">
                Export Board
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors duration-250"
              aria-label="Close export modal"
            >
              <Icon name="X" size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Select Columns
            </label>
            <div className="space-y-2">
              {columns?.map((column) => (
                <Checkbox
                  key={column?.id}
                  label={column?.name}
                  checked={selectedColumns?.includes(column?.id)}
                  onChange={() => handleColumnToggle(column?.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['json', 'csv', 'pdf']?.map((format) => (
                <button
                  key={format}
                  onClick={() => setExportFormat(format)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-250
                    ${exportFormat === format
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  {format?.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <Checkbox
            label="Include archived tasks"
            checked={includeArchived}
            onChange={(e) => setIncludeArchived(e?.target?.checked)}
          />
        </div>

        <div className="p-4 md:p-6 border-t border-border flex items-center gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            fullWidth
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleExport}
            disabled={selectedColumns?.length === 0}
            fullWidth
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;