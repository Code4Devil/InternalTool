import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SessionWarning = ({ timeoutMinutes = 30 }) => {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWarning(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!showWarning) return null;

  return (
    <div className="flex items-start space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
      <Icon name="Clock" size={16} color="var(--color-warning)" />
      <p className="text-xs text-warning flex-1">
        Sessions expire after {timeoutMinutes} minutes of inactivity
      </p>
    </div>
  );
};

export default SessionWarning;