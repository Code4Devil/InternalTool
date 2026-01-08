import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';

const SettingsModal = ({ isOpen, onClose, currentSettings, onSaveSettings }) => {
  const [settings, setSettings] = useState(currentSettings);

  const videoQualityOptions = [
    { value: 'auto', label: 'Auto (Recommended)' },
    { value: '1080p', label: '1080p HD' },
    { value: '720p', label: '720p HD' },
    { value: '480p', label: '480p SD' },
    { value: '360p', label: '360p Low' }
  ];

  const audioDeviceOptions = [
    { value: 'default', label: 'Default Microphone' },
    { value: 'device1', label: 'Built-in Microphone' },
    { value: 'device2', label: 'External USB Microphone' }
  ];

  const speakerOptions = [
    { value: 'default', label: 'Default Speaker' },
    { value: 'speaker1', label: 'Built-in Speakers' },
    { value: 'speaker2', label: 'Headphones' }
  ];

  const cameraOptions = [
    { value: 'default', label: 'Default Camera' },
    { value: 'camera1', label: 'Built-in Camera' },
    { value: 'camera2', label: 'External Webcam' }
  ];

  const handleSave = () => {
    onSaveSettings(settings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-100 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl border border-border shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="sticky top-0 bg-card border-b border-border p-4 md:p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Settings" size={24} className="text-primary" />
              <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
                Call Settings
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClose}
            >
              <span className="sr-only">Close settings</span>
            </Button>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-6">
          <div className="space-y-4">
            <h4 className="text-base font-heading font-semibold text-foreground">Video Settings</h4>
            
            <Select
              label="Video Quality"
              description="Higher quality requires more bandwidth"
              options={videoQualityOptions}
              value={settings?.videoQuality}
              onChange={(value) => setSettings({ ...settings, videoQuality: value })}
            />

            <Select
              label="Camera"
              options={cameraOptions}
              value={settings?.camera}
              onChange={(value) => setSettings({ ...settings, camera: value })}
            />

            <Checkbox
              label="Enable virtual background"
              description="Blur or replace your background"
              checked={settings?.virtualBackground}
              onChange={(e) => setSettings({ ...settings, virtualBackground: e?.target?.checked })}
            />

            <Checkbox
              label="Mirror my video"
              checked={settings?.mirrorVideo}
              onChange={(e) => setSettings({ ...settings, mirrorVideo: e?.target?.checked })}
            />
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <h4 className="text-base font-heading font-semibold text-foreground">Audio Settings</h4>
            
            <Select
              label="Microphone"
              options={audioDeviceOptions}
              value={settings?.microphone}
              onChange={(value) => setSettings({ ...settings, microphone: value })}
            />

            <Select
              label="Speaker"
              options={speakerOptions}
              value={settings?.speaker}
              onChange={(value) => setSettings({ ...settings, speaker: value })}
            />

            <Checkbox
              label="Noise cancellation"
              description="Reduce background noise"
              checked={settings?.noiseCancellation}
              onChange={(e) => setSettings({ ...settings, noiseCancellation: e?.target?.checked })}
            />

            <Checkbox
              label="Echo cancellation"
              checked={settings?.echoCancellation}
              onChange={(e) => setSettings({ ...settings, echoCancellation: e?.target?.checked })}
            />
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <h4 className="text-base font-heading font-semibold text-foreground">Advanced Settings</h4>
            
            <Checkbox
              label="Automatic bandwidth optimization"
              description="Adjust quality based on connection"
              checked={settings?.autoBandwidth}
              onChange={(e) => setSettings({ ...settings, autoBandwidth: e?.target?.checked })}
            />

            <Checkbox
              label="Show connection statistics"
              checked={settings?.showStats}
              onChange={(e) => setSettings({ ...settings, showStats: e?.target?.checked })}
            />

            <Checkbox
              label="Enable keyboard shortcuts"
              checked={settings?.keyboardShortcuts}
              onChange={(e) => setSettings({ ...settings, keyboardShortcuts: e?.target?.checked })}
            />
          </div>
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4 md:p-6 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;