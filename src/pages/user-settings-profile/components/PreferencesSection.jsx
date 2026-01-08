import React, { useState } from 'react';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const PreferencesSection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    keyboardShortcuts: true,
    compactView: false,
    showAvatars: true
  });

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto (System)' }
  ];

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' },
    { value: 'ja', label: 'Japanese' },
    { value: 'zh', label: 'Chinese' }
  ];

  const timezoneOptions = [
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'Europe/London', label: 'London (GMT)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)' }
  ];

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (01/15/2026)' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (15/01/2026)' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (2026-01-15)' }
  ];

  const timeFormatOptions = [
    { value: '12h', label: '12-hour (2:30 PM)' },
    { value: '24h', label: '24-hour (14:30)' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const keyboardShortcuts = [
    { keys: ['Cmd', 'K'], description: 'Quick search' },
    { keys: ['Cmd', 'N'], description: 'New task' },
    { keys: ['Cmd', 'Shift', 'N'], description: 'New project' },
    { keys: ['Cmd', '/'], description: 'Show keyboard shortcuts' },
    { keys: ['Esc'], description: 'Close modal/panel' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Preferences
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Customize your TeamSync Pro experience
        </p>
      </div>
      {/* Appearance */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Palette" size={20} />
            Appearance
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Customize the look and feel of the application
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Theme"
            options={themeOptions}
            value={preferences?.theme}
            onChange={(value) => setPreferences({ ...preferences, theme: value })}
          />
          <Select
            label="Language"
            options={languageOptions}
            value={preferences?.language}
            onChange={(value) => setPreferences({ ...preferences, language: value })}
          />
        </div>

        <div className="space-y-3 pt-2">
          <Checkbox
            checked={preferences?.compactView}
            onChange={(e) => setPreferences({ ...preferences, compactView: e?.target?.checked })}
            label="Compact View"
            description="Use a more condensed layout to show more content"
          />
          <Checkbox
            checked={preferences?.showAvatars}
            onChange={(e) => setPreferences({ ...preferences, showAvatars: e?.target?.checked })}
            label="Show Avatars"
            description="Display user profile pictures throughout the application"
          />
        </div>
      </div>
      {/* Regional Settings */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Icon name="Globe" size={20} />
            Regional Settings
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configure date, time, and timezone preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Select
            label="Timezone"
            options={timezoneOptions}
            value={preferences?.timezone}
            onChange={(value) => setPreferences({ ...preferences, timezone: value })}
            searchable
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Date Format"
              options={dateFormatOptions}
              value={preferences?.dateFormat}
              onChange={(value) => setPreferences({ ...preferences, dateFormat: value })}
            />
            <Select
              label="Time Format"
              options={timeFormatOptions}
              value={preferences?.timeFormat}
              onChange={(value) => setPreferences({ ...preferences, timeFormat: value })}
            />
          </div>
        </div>
      </div>
      {/* Keyboard Shortcuts */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Icon name="Keyboard" size={20} />
              Keyboard Shortcuts
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Enable keyboard shortcuts for faster navigation
            </p>
          </div>
          <Checkbox
            checked={preferences?.keyboardShortcuts}
            onChange={(e) => setPreferences({ ...preferences, keyboardShortcuts: e?.target?.checked })}
          />
        </div>

        {preferences?.keyboardShortcuts && (
          <div className="pt-4 border-t border-border">
            <p className="text-sm font-medium text-foreground mb-3">Available Shortcuts</p>
            <div className="space-y-2">
              {keyboardShortcuts?.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <span className="text-sm text-muted-foreground">
                    {shortcut?.description}
                  </span>
                  <div className="flex items-center gap-1">
                    {shortcut?.keys?.map((key, keyIndex) => (
                      <React.Fragment key={keyIndex}>
                        <kbd className="px-2 py-1 text-xs font-semibold bg-background border border-border rounded">
                          {key}
                        </kbd>
                        {keyIndex < shortcut?.keys?.length - 1 && (
                          <span className="text-muted-foreground">+</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
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

export default PreferencesSection;