import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import TaskTableRow from './TaskTableRow';

const TasksOverviewTable = ({ tasks, onStatusChange, onPriorityChange, onTaskClick }) => {
  const [sortField, setSortField] = useState('deadline');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'backlog', label: 'Backlog' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'Review' },
    { value: 'done', label: 'Done' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ];

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSortedTasks = tasks?.filter((task) => {
      const matchesStatus = filterStatus === 'all' || task?.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || task?.priority === filterPriority;
      const matchesSearch =
        searchQuery === '' ||
        task?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        task?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    })?.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'title') {
        comparison = a?.title?.localeCompare(b?.title);
      } else if (sortField === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        comparison = priorityOrder?.[a?.priority] - priorityOrder?.[b?.priority];
      } else if (sortField === 'deadline') {
        comparison = new Date(a.deadline) - new Date(b.deadline);
      } else if (sortField === 'status') {
        comparison = a?.status?.localeCompare(b?.status);
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  return (
    <div className="h-full bg-card flex flex-col">
      <div className="p-4 md:p-5 lg:p-6 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg lg:text-xl font-heading font-semibold text-foreground">
            Assigned Tasks
          </h2>
          <span className="text-xs md:text-sm lg:text-base font-caption text-muted-foreground">
            {filteredAndSortedTasks?.length} tasks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-5">
          <Input
            type="search"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
          />
          <Select options={statusOptions} value={filterStatus} onChange={setFilterStatus} />
          <Select options={priorityOptions} value={filterPriority} onChange={setFilterPriority} />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-muted sticky top-0 z-10">
            <tr>
              <th className="p-3 md:p-4 lg:p-5 text-left">
                <button
                  onClick={() => handleSort('title')}
                  className="flex items-center space-x-1 md:space-x-1.5 lg:space-x-2 text-xs md:text-sm lg:text-base font-heading font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  <span>Task Title</span>
                  <Icon
                    name={sortField === 'title' && sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                    size={16}
                    color="currentColor"
                  />
                </button>
              </th>
              <th className="p-3 md:p-4 lg:p-5 text-left">
                <button
                  onClick={() => handleSort('priority')}
                  className="flex items-center space-x-1 md:space-x-1.5 lg:space-x-2 text-xs md:text-sm lg:text-base font-heading font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  <span>Priority</span>
                  <Icon
                    name={sortField === 'priority' && sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                    size={16}
                    color="currentColor"
                  />
                </button>
              </th>
              <th className="p-3 md:p-4 lg:p-5 text-left">
                <button
                  onClick={() => handleSort('deadline')}
                  className="flex items-center space-x-1 md:space-x-1.5 lg:space-x-2 text-xs md:text-sm lg:text-base font-heading font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  <span>Deadline</span>
                  <Icon
                    name={sortField === 'deadline' && sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                    size={16}
                    color="currentColor"
                  />
                </button>
              </th>
              <th className="p-3 md:p-4 lg:p-5 text-left">
                <button
                  onClick={() => handleSort('status')}
                  className="flex items-center space-x-1 md:space-x-1.5 lg:space-x-2 text-xs md:text-sm lg:text-base font-heading font-semibold text-foreground hover:text-primary transition-smooth"
                >
                  <span>Status</span>
                  <Icon
                    name={sortField === 'status' && sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown'}
                    size={16}
                    color="currentColor"
                  />
                </button>
              </th>
              <th className="p-3 md:p-4 lg:p-5 text-left">
                <span className="text-xs md:text-sm lg:text-base font-heading font-semibold text-foreground">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTasks?.map((task) => (
              <TaskTableRow
                key={task?.id}
                task={task}
                onStatusChange={onStatusChange}
                onPriorityChange={onPriorityChange}
                onTaskClick={onTaskClick}
              />
            ))}
          </tbody>
        </table>

        {filteredAndSortedTasks?.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 md:p-10 lg:p-12">
            <Icon name="Inbox" size={48} color="var(--color-muted-foreground)" />
            <p className="mt-4 text-sm md:text-base lg:text-lg text-muted-foreground">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksOverviewTable;