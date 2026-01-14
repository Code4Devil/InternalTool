import React, { useState, useEffect } from 'react';
import { startSessionMonitoring, stopSessionMonitoring, signOut } from '../../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SessionWarning = ({ timeoutMinutes = 30, enabled = false }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [minutesRemaining, setMinutesRemaining] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (enabled) {
      startSessionMonitoring(
        timeoutMinutes,
        5, // Show warning 5 minutes before timeout
        (remaining) => {
          setMinutesRemaining(Math.ceil(remaining));
          setShowWarning(true);
        },
        () => handleSessionTimeout()
      );
    }

    return () => {
      if (enabled) {
        stopSessionMonitoring();
      }
    };
  }, [enabled, timeoutMinutes]);

  const handleSessionTimeout = async () => {
    try {
      await signOut();
      navigate('/', { state: { message: 'Session expired due to inactivity' } });
    } catch (error) {
      console.error('Sign out error:', error);
      navigate('/');
    }
  };

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    // Activity is automatically tracked, warning will disappear
  };

  if (!enabled) {
    // Show static warning on login page
    return (
      <div className="flex items-start space-x-2 p-3 bg-warning/10 border border-warning/20 rounded-lg">
        <Icon name="Clock" size={16} color="var(--color-warning)" />
        <p className="text-xs text-warning flex-1">
          Sessions expire after {timeoutMinutes} minutes of inactivity
        </p>
      </div>
    );
  }

  if (!showWarning) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className="bg-card border-2 border-warning rounded-xl shadow-elevation-3 p-4 space-y-3">
        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-foreground mb-1">
              Session Expiring Soon
            </h4>
            <p className="text-xs text-muted-foreground">
              Your session will expire in {minutesRemaining} minute{minutesRemaining !== 1 ? 's' : ''} due to inactivity.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={handleStayLoggedIn}
            className="flex-1"
          >
            Stay Logged In
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSessionTimeout}
          >
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionWarning;