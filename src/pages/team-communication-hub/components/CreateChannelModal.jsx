import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const CreateChannelModal = ({ isOpen, onClose, onCreateChannel }) => {
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [errors, setErrors] = useState({});

  const availableMembers = [
    { id: 1, name: 'Sarah Mitchell', role: 'Executive Director' },
    { id: 2, name: 'John Anderson', role: 'Senior Developer' },
    { id: 3, name: 'Emily Chen', role: 'Product Manager' },
    { id: 4, name: 'Michael Rodriguez', role: 'UX Designer' },
    { id: 5, name: 'Lisa Thompson', role: 'Marketing Lead' }
  ];

  const handleSubmit = (e) => {
    e?.preventDefault();
    const newErrors = {};

    if (!channelName?.trim()) {
      newErrors.channelName = 'Channel name is required';
    }

    if (Object.keys(newErrors)?.length > 0) {
      setErrors(newErrors);
      return;
    }

    onCreateChannel({
      name: channelName,
      description: channelDescription,
      isPrivate,
      members: selectedMembers
    });

    setChannelName('');
    setChannelDescription('');
    setIsPrivate(false);
    setSelectedMembers([]);
    setErrors({});
    onClose();
  };

  const toggleMember = (memberId) => {
    setSelectedMembers(prev =>
      prev?.includes(memberId)
        ? prev?.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-200 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card border border-border rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Create New Channel
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Icon name="X" size={20} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <Input
            label="Channel Name"
            type="text"
            placeholder="e.g., project-alpha"
            value={channelName}
            onChange={(e) => setChannelName(e?.target?.value)}
            error={errors?.channelName}
            required
          />

          <Input
            label="Description (Optional)"
            type="text"
            placeholder="What is this channel about?"
            value={channelDescription}
            onChange={(e) => setChannelDescription(e?.target?.value)}
          />

          <Checkbox
            label="Make this channel private"
            description="Only invited members can see and join this channel"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e?.target?.checked)}
          />

          {isPrivate && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Add Members
              </label>
              <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-2 p-3 bg-muted/30 rounded-lg">
                {availableMembers?.map(member => (
                  <div
                    key={member?.id}
                    className="flex items-center gap-3 p-2 hover:bg-background rounded-lg transition-colors cursor-pointer"
                    onClick={() => toggleMember(member?.id)}
                  >
                    <Checkbox
                      checked={selectedMembers?.includes(member?.id)}
                      onChange={() => toggleMember(member?.id)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{member?.name}</p>
                      <p className="text-xs text-muted-foreground">{member?.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-4">
            <Button
              type="submit"
              variant="default"
              iconName="Plus"
              iconPosition="left"
              fullWidth
            >
              Create Channel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              fullWidth
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateChannelModal;