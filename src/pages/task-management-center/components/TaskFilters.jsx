import React, { useState, useEffect } from 'react';
import { supabase, getSession } from '../../../lib/supabase';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const TaskFilters = ({ onFilterChange, activeFilters, projectMembers = [] }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [savedFilters, setSavedFilters] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    loadSavedFilters();
  }, []);

  const loadSavedFilters = async () => {
    try {
      const session = await getSession();
      if (!session) return;

      setCurrentUserId(session.user.id);

      const { data, error } = await supabase
        .from('users')
        .select('preferences')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      const savedPresets = data?.preferences?.savedFilters || [];
      setSavedFilters(savedPresets);
    } catch (error) {
      console.error('Failed to load saved filters:', error);
    }
  };

  const handleSaveFilter = async () => {
    if (!filterName.trim()) return;

    try {
      const session = await getSession();
      if (!session) return;

      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('preferences')
        .eq('id', session.user.id)
        .single();

      if (fetchError) throw fetchError;

      const currentPreferences = userData?.preferences || {};
      const currentSavedFilters = currentPreferences.savedFilters || [];

      const newFilter = {
        id: Date.now().toString(),
        name: filterName,
        filters: activeFilters,
        createdAt: new Date().toISOString(),
      };

      const updatedFilters = [...currentSavedFilters, newFilter];

      const { error } = await supabase
        .from('users')
        .update({
          preferences: {
            ...currentPreferences,
            savedFilters: updatedFilters,
          },
        })
        .eq('id', session.user.id);

      if (error) throw error;

      setSavedFilters(updatedFilters);
      setShowSaveModal(false);
      setFilterName('');
    } catch (error) {
      console.error('Failed to save filter:', error);
    }
  };

  const handleDeleteFilter = async (filterId) => {
    try {
      const session = await getSession();
      if (!session) return;

      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('preferences')
        .eq('id', session.user.id)
        .single();

      if (fetchError) throw fetchError;

      const currentPreferences = userData?.preferences || {};
      const currentSavedFilters = currentPreferences.savedFilters || [];
      const updatedFilters = currentSavedFilters.filter(f => f.id !== filterId);

      const { error } = await supabase
        .from('users')
        .update({
          preferences: {
            ...currentPreferences,
            savedFilters: updatedFilters,
          },
        })
        .eq('id', session.user.id);

      if (error) throw error;

      setSavedFilters(updatedFilters);
    } catch (error) {
      console.error('Failed to delete filter:', error);
    }
  };

  const handleLoadFilter = (filter) => {
    onFilterChange(filter.filters);
  };

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'critical', label: 'Critical' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' }
  ];

  const assigneeOptions = [
    { value: 'all', label: 'All Assignees' },
    { value: 'sarah-mitchell', label: 'Sarah Mitchell' },
    { value: 'john-anderson', label: 'John Anderson' },
    { value: 'emily-chen', label: 'Emily Chen' },
    { value: 'michael-rodriguez', label: 'Michael Rodriguez' },
    { value: 'unassigned', label: 'Unassigned' }
  ];

  const savedFilters = [
    { value: 'my-tasks', label: 'My Tasks', icon: 'User' },
    { value: 'overdue', label: 'Overdue Tasks', icon: 'AlertCircle' },
    { value: 'high-priority', label: 'High Priority', icon: 'Flag' },
    { value: 'this-week', label: 'Due This Week', icon: 'Calendar' },
    { value: 'unassigned', label: 'Unassigned', icon: 'UserX' }
  ];

  const handleSavedFilterClick = (filterValue) => {
    onFilterChange({ savedFilter: filterValue });
  };

  const handleClearFilters = () => {
    onFilterChange({
      priority: 'all',
      status: 'all',
      assignee: 'all',
      search: '',
      dateRange: { start: '', end: '' }
    });
  };

  const activeFilterCount = Object.values(activeFilters)?.filter(v => 
    v && v !== 'all' && v !== ''
  )?.length;

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base md:text-lg font-heading font-semibold text-foreground">
            Filters
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-muted rounded-lg transition-colors duration-250"
            aria-label={isExpanded ? 'Collapse filters' : 'Expand filters'}
          >
            <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {savedFilters?.map((filter) => (
            <button
              key={filter?.value}
              onClick={() => handleSavedFilterClick(filter?.value)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                transition-all duration-250 ease-smooth
                ${activeFilters?.savedFilter === filter?.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground hover:bg-muted/80'
                }
              `}
            >
              <Icon name={filter?.icon} size={16} />
              <span className="hidden md:inline">{filter?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {isExpanded && (
        <div className="p-4 md:p-6 space-y-4">
          <Input
            type="search"
            placeholder="Search tasks by title or ID..."
            value={activeFilters?.search || ''}
            onChange={(e) => onFilterChange({ search: e?.target?.value })}
            className="mb-4"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="Priority"
              options={priorityOptions}
              value={activeFilters?.priority || 'all'}
              onChange={(value) => onFilterChange({ priority: value })}
            />

            <Select
              label="Status"
              options={statusOptions}
              value={activeFilters?.status || 'all'}
              onChange={(value) => onFilterChange({ status: value })}
            />

            <Select
              label="Assignee"
              options={assigneeOptions}
              value={activeFilters?.assignee || 'all'}
              onChange={(value) => onFilterChange({ assignee: value })}
              searchable
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="date"
              label="Start Date"
              value={activeFilters?.dateRange?.start || ''}
              onChange={(e) => onFilterChange({ 
                dateRange: { ...activeFilters?.dateRange, start: e?.target?.value }
              })}
            />

            <Input
              type="date"
              label="End Date"
              value={activeFilters?.dateRange?.end || ''}
              onChange={(e) => onFilterChange({ 
                dateRange: { ...activeFilters?.dateRange, end: e?.target?.value }
              })}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              {activeFilterCount > 0 ? (
                <span>{activeFilterCount} active filter{activeFilterCount !== 1 ? 's' : ''}</span>
              ) : (
                <span>No active filters</span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors duration-250"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskFilters;