import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const FilterPanel = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '30days',
    department: 'all',
    projectStatus: 'all',
    priority: 'all'
  });

  const dateRangeOptions = [
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'operations', label: 'Operations' }
  ];

  const projectStatusOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'active', label: 'Active' },
    { value: 'planning', label: 'Planning' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    const defaultFilters = {
      dateRange: '30days',
      department: 'all',
      projectStatus: 'all',
      priority: 'all'
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  const handleExport = () => {
    console.log('Exporting executive report with filters:', filters);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 mb-4 md:mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Icon name="Filter" size={20} className="text-primary" />
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Advanced Filters
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
            label="Department"
            options={departmentOptions}
            value={filters?.department}
            onChange={(value) => handleFilterChange('department', value)}
          />

          <Select
            label="Project Status"
            options={projectStatusOptions}
            value={filters?.projectStatus}
            onChange={(value) => handleFilterChange('projectStatus', value)}
          />

          <Select
            label="Priority Level"
            options={priorityOptions}
            value={filters?.priority}
            onChange={(value) => handleFilterChange('priority', value)}
          />
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
            onClick={handleExport}
          >
            Export Report
          </Button>

          <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
            <Icon name="Info" size={14} />
            <span>Last updated: Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;