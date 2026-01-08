import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ExportModal = ({ onClose, selectedCount, totalCount }) => {
  const [exportFormat, setExportFormat] = useState('csv');
  const [exportScope, setExportScope] = useState('selected');

  const formatOptions = [
    { value: 'csv', label: 'CSV (Comma Separated)' },
    { value: 'json', label: 'JSON (JavaScript Object)' },
    { value: 'pdf', label: 'PDF (Formatted Report)' },
    { value: 'xlsx', label: 'Excel (Spreadsheet)' }
  ];

  const scopeOptions = [
    { value: 'selected', label: `Selected Entries (${selectedCount})` },
    { value: 'filtered', label: 'Current Filter Results' },
    { value: 'all', label: `All Entries (${totalCount})` }
  ];

  const handleExport = () => {
    console.log('Exporting:', { format: exportFormat, scope: exportScope });
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Icon name="Download" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-foreground">
                Export Audit Logs
              </h3>
              <p className="text-xs text-muted-foreground">
                Choose format and scope for export
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-250"
            aria-label="Close modal"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="p-4 md:p-6 space-y-4">
          <Select
            label="Export Format"
            options={formatOptions}
            value={exportFormat}
            onChange={setExportFormat}
          />

          <Select
            label="Export Scope"
            options={scopeOptions}
            value={exportScope}
            onChange={setExportScope}
          />

          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Icon name="Info" size={16} className="text-primary flex-shrink-0 mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Export Information</p>
                <p>Exported files will include timestamps, user details, action descriptions, and change history for compliance and audit purposes.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 md:p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            iconName="Download"
            iconPosition="left"
            onClick={handleExport}
          >
            Export Logs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;