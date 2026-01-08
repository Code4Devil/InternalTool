import React from 'react';
import Icon from '../../../components/AppIcon';

const AuditTrailInfo = ({ ipAddress, deviceInfo }) => {
  return (
    <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
      <div className="flex items-center space-x-2">
        <Icon name="MapPin" size={14} color="var(--color-muted-foreground)" />
        <span className="text-xs text-muted-foreground font-data">
          IP: {ipAddress}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Icon name="Smartphone" size={14} color="var(--color-muted-foreground)" />
        <span className="text-xs text-muted-foreground font-data">
          {deviceInfo}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        All login attempts are logged for security purposes
      </p>
    </div>
  );
};

export default AuditTrailInfo;