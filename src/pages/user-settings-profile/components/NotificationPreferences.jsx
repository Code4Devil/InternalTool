import React, { useState, useEffect } from 'react';
import { supabase, getSession } from '../../../lib/supabase';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import ActivityIndicator from '../../../components/ui/ActivityIndicator';

const NotificationPreferences = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    email: {
      taskAssignments: true,
      projectUpdates: true,
      teamCommunications: true,
      mentions: true,
      deadlineReminders: true,
      weeklyDigest: false
    },
    inApp: {
      taskAssignments: true,
      projectUpdates: true,
      teamCommunications: true,
      mentions: true,
      deadlineReminders: true,
      statusChanges: true
    },
    push: {
      taskAssignments: true,
      projectUpdates: false,
      teamCommunications: true,
      mentions: true,
      deadlineReminders: true,
      urgentOnly: false
    }
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const session = await getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('users')
        .select('preferences')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      if (data?.preferences?.notifications) {
        setPreferences(data.preferences.notifications);
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (category, key) => {
    setPreferences({
      ...preferences,
      [category]: {
        ...preferences?.[category],
        [key]: !preferences?.[category]?.[key]
      }
    });
  };

  const handleToggleAll = (category, enabled) => {
    const updatedCategory = {};
    Object.keys(preferences?.[category])?.forEach(key => {
      updatedCategory[key] = enabled;
    });
    setPreferences({
      ...preferences,
      [category]: updatedCategory
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const session = await getSession();
      if (!session) return;

      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('preferences')
        .eq('id', session.user.id)
        .single();

      if (fetchError) throw fetchError;

      const currentPreferences = userData?.preferences || {};

      const { error } = await supabase
        .from('users')
        .update({
          preferences: {
            ...currentPreferences,
            notifications: preferences,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', session.user.id);

      if (error) throw error;

      alert('Notification preferences saved successfully');
    } catch (error) {
      console.error('Failed to save preferences:', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <ActivityIndicator size="lg" />
      </div>
    );
  }

  const notificationTypes = [
    { key: 'taskAssignments', label: 'Task Assignments', description: 'When you are assigned to a new task' },
    { key: 'projectUpdates', label: 'Project Updates', description: 'Updates on projects you are involved in' },
    { key: 'teamCommunications', label: 'Team Communications', description: 'Messages and announcements from your team' },
    { key: 'mentions', label: 'Mentions', description: 'When someone mentions you in a comment or message' },
    { key: 'deadlineReminders', label: 'Deadline Reminders', description: 'Reminders about upcoming task deadlines' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Notification Preferences
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Control how and when you receive notifications
        </p>
      </div>

      {/* Email Notifications */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Icon name="Mail" size={20} />
              Email Notifications
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Receive notifications via email
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleAll('email', true)}
            >
              Enable All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleAll('email', false)}
            >
              Disable All
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {notificationTypes?.map((type) => (
            <Checkbox
              key={type?.key}
              checked={preferences?.email?.[type?.key]}
              onChange={() => handleToggle('email', type?.key)}
              label={type?.label}
              description={type?.description}
            />
          ))}
          <div className="pt-3 border-t border-border">
            <Checkbox
              checked={preferences?.email?.weeklyDigest}
              onChange={() => handleToggle('email', 'weeklyDigest')}
              label="Weekly Digest"
              description="Receive a weekly summary of your activity and updates"
            />
          </div>
        </div>
      </div>

      {/* In-App Notifications */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Icon name="Bell" size={20} />
              In-App Notifications
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Show notifications within the application
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleAll('inApp', true)}
            >
              Enable All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleAll('inApp', false)}
            >
              Disable All
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {notificationTypes?.map((type) => (
            <Checkbox
              key={type?.key}
              checked={preferences?.inApp?.[type?.key]}
              onChange={() => handleToggle('inApp', type?.key)}
              label={type?.label}
              description={type?.description}
            />
          ))}
          <div className="pt-3 border-t border-border">
            <Checkbox
              checked={preferences?.inApp?.statusChanges}
              onChange={() => handleToggle('inApp', 'statusChanges')}
              label="Status Changes"
              description="When task or project status changes"
            />
          </div>
        </div>
      </div>

      {/* Push Notifications */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Icon name="Smartphone" size={20} />
              Mobile Push Notifications
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Receive push notifications on your mobile device
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleAll('push', true)}
            >
              Enable All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleAll('push', false)}
            >
              Disable All
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {notificationTypes?.map((type) => (
            <Checkbox
              key={type?.key}
              checked={preferences?.push?.[type?.key]}
              onChange={() => handleToggle('push', type?.key)}
              label={type?.label}
              description={type?.description}
            />
          ))}
          <div className="pt-3 border-t border-border">
            <Checkbox
              checked={preferences?.push?.urgentOnly}
              onChange={() => handleToggle('push', 'urgentOnly')}
              label="Urgent Only"
              description="Only receive push notifications for urgent items"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <Button
          onClick={handleSave}
          loading={isSaving}
          iconName="Save"
          size="lg"
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;