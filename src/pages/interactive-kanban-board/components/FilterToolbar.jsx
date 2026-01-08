import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterToolbar = ({ 
  filters, 
  onFilterChange, 
  onSavePreset, 
  savedPresets,
  onLoadPreset,
  onClearFilters,
  teamMembers 
}) => {
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetName, setPresetName] = useState('');

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const assigneeOptions = [
    { value: 'all', label: 'All Assignees' },
    ...teamMembers?.map(member => ({
      value: member?.id,
      label: member?.name
    }))
  ];

  const dueDateOptions = [
    { value: 'all', label: 'All Dates' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'today', label: 'Due Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const handleSavePreset = () => {
    if (presetName?.trim()) {
      onSavePreset(presetName, filters);
      setPresetName('');
      setShowPresetModal(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-3 md:p-4 mb-4 md:mb-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-2">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-sm md:text-base font-heading font-semibold text-foreground">
            Filters
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 w-full lg:w-auto">
          <Select
            options={priorityOptions}
            value={filters?.priority}
            onChange={(value) => onFilterChange('priority', value)}
            placeholder="Priority"
            className="w-full sm:w-40"
          />

          <Select
            options={assigneeOptions}
            value={filters?.assignee}
            onChange={(value) => onFilterChange('assignee', value)}
            placeholder="Assignee"
            className="w-full sm:w-40"
          />

          <Select
            options={dueDateOptions}
            value={filters?.dueDate}
            onChange={(value) => onFilterChange('dueDate', value)}
            placeholder="Due Date"
            className="w-full sm:w-40"
          />

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              iconName="X"
              onClick={onClearFilters}
            >
              Clear
            </Button>

            <Button
              variant="secondary"
              size="sm"
              iconName="Save"
              onClick={() => setShowPresetModal(true)}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      {savedPresets?.length > 0 && (
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Star" size={16} className="text-warning" />
            <span className="text-xs md:text-sm font-medium text-foreground">
              Saved Presets
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {savedPresets?.map((preset) => (
              <button
                key={preset?.id}
                onClick={() => onLoadPreset(preset)}
                className="px-3 py-1.5 text-xs md:text-sm bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors duration-250"
              >
                {preset?.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {showPresetModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-200 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl p-4 md:p-6 w-full max-w-md">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
              Save Filter Preset
            </h3>
            <input
              type="text"
              value={presetName}
              onChange={(e) => setPresetName(e?.target?.value)}
              placeholder="Enter preset name"
              className="w-full px-3 md:px-4 py-2 md:py-3 bg-input border border-border rounded-lg text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-ring mb-4"
              autoFocus
            />
            <div className="flex items-center gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setShowPresetModal(false);
                  setPresetName('');
                }}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleSavePreset}
                disabled={!presetName?.trim()}
              >
                Save Preset
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterToolbar;