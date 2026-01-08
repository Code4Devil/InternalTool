import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import ActivityFeedItem from './ActivityFeedItem';

const RecentActivityFeed = ({ activities }) => {
  const [filter, setFilter] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All Activity' },
    { value: 'task-assigned', label: 'Assigned' },
    { value: 'task-completed', label: 'Completed' },
    { value: 'task-updated', label: 'Updated' },
    { value: 'comment-added', label: 'Comments' },
    { value: 'file-uploaded', label: 'Files' },
    { value: 'deadline-changed', label: 'Deadlines' }
  ];

  const filteredActivities = filter === 'all' ? activities : activities?.filter((a) => a?.type === filter);

  return (
    <div className="h-full bg-card border-l border-border flex flex-col">
      <div className="p-4 md:p-5 lg:p-6 border-b border-border space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg lg:text-xl font-heading font-semibold text-foreground">
            Recent Activity
          </h2>
          <button className="p-2 rounded-lg hover:bg-muted transition-smooth" aria-label="Refresh activity feed">
            <Icon name="RefreshCw" size={16} color="var(--color-foreground)" />
          </button>
        </div>

        <Select options={filterOptions} value={filter} onChange={setFilter} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1">
          {filteredActivities?.map((activity) => (
            <ActivityFeedItem key={activity?.id} activity={activity} />
          ))}
        </div>

        {filteredActivities?.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 md:p-10 lg:p-12">
            <Icon name="Activity" size={48} color="var(--color-muted-foreground)" />
            <p className="mt-4 text-sm md:text-base lg:text-lg text-muted-foreground">No activity found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityFeed;