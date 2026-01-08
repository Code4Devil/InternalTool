import React from 'react';
import SecurityIndicator from './SecurityIndicator';

const SystemHealthPanel = () => {
  const systemServices = [
    {
      type: 'ssl',
      status: 'active',
      message: 'SSL Certificate Valid'
    },
    {
      type: 'chat',
      status: 'active',
      message: 'Chat Services Online'
    },
    {
      type: 'video',
      status: 'active',
      message: 'Video Calling Ready'
    },
    {
      type: 'database',
      status: 'active',
      message: 'Database Connected'
    }
  ];

  return (
    <div className="space-y-3 md:space-y-4">
      <h4 className="text-sm md:text-base font-heading font-semibold text-foreground">
        System Status
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
        {systemServices?.map((service, index) => (
          <SecurityIndicator
            key={index}
            type={service?.type}
            status={service?.status}
            message={service?.message}
          />
        ))}
      </div>
    </div>
  );
};

export default SystemHealthPanel;