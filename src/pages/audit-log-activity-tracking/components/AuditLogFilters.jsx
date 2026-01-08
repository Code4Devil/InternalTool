import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AuditLogFilters = ({ filters, onFilterChange, onExport }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dateRangeOptions = [
    { value: '24hours', label: 'Last 24 Hours' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const userOptions = [
    { value: 'all', label: 'All Users' },
    { value: 'sarah', label: 'Sarah Mitchell' },
    { value: 'john', label: 'John Davis' },
    { value: 'emily', label: 'Emily Roberts' },
    { value: 'michael', label: 'Michael Chen' },
    { value: 'system', label: 'System Events' }
  ];

  const actionTypeOptions = [
    { value: 'all', label: 'All Actions' },
    { value: 'task_change', label: 'Task Changes' },
    { value: 'chat_message', label: 'Chat Messages' },
    { value: 'video_call', label: 'Video Calls' },
    { value: 'role_modification', label: 'Role Modifications' },
    { value: 'system_event', label: 'System Events' }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severity Levels' },
    { value: 'critical', label: 'Critical' },
    { value: 'warning', label: 'Warning' },
    { value: 'info', label: 'Info' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      dateRange: '30days',
      user: 'all',
      actionType: 'all',
      severity: 'all',
      searchQuery: ''
    };
    onFilterChange?.(defaultFilters);
  };

  const handleSearchChange = (e) => {
    handleFilterChange('searchQuery', e?.target?.value);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 mb-4 md:mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Audit Log Filters
          </h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden p-2 hover:bg-muted rounded-lg transition-colors duration-250"
          aria-label="Toggle filters"
        >
          <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={20} />
        </button>
      </div>

      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => handleFilterChange('dateRange', value)}
          />

          <Select
            label="User"
            options={userOptions}
            value={filters?.user}
            onChange={(value) => handleFilterChange('user', value)}
          />

          <Select
            label="Action Type"
            options={actionTypeOptions}
            value={filters?.actionType}
            onChange={(value) => handleFilterChange('actionType', value)}
          />

          <Select
            label="Severity Level"
            options={severityOptions}
            value={filters?.severity}
            onChange={(value) => handleFilterChange('severity', value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1">
            <Input
              id="audit-search"
              placeholder="Search audit logs... (Ctrl+F)"
              value={filters?.searchQuery}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={handleReset}
          >
            Reset Filters
          </Button>

          <Button
            variant="default"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={onExport}
          >
            Export Logs
          </Button>

          <Button
            variant="outline"
            size="sm"
            iconName="Save"
            iconPosition="left"
            onClick={() => console.log('Save preset')}
          >
            Save Preset
          </Button>

          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span>Live Updates Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditLogFilters;