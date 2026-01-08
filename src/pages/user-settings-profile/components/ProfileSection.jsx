import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@teamsync.com',
    department: 'Engineering',
    role: 'Executive Director',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    avatar: '/assets/images/avatar-placeholder.png'
  });

  const roleOptions = [
    { value: 'executive', label: 'Executive Director' },
    { value: 'manager', label: 'Manager' },
    { value: 'team-member', label: 'Team Member' }
  ];

  const departmentOptions = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'Human Resources' }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
  };

  const handleImageUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader?.result });
      };
      reader?.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Profile Information
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Update your personal information and profile photo
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            iconName="Edit"
            variant="outline"
          >
            Edit Profile
          </Button>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        {/* Profile Photo */}
        <div className="flex items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted">
              <Image
                src={profileData?.avatar}
                alt={profileData?.name}
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors"
              >
                <Icon name="Camera" size={16} />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleImageUpload}
                />
              </label>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">
              {profileData?.name}
            </h3>
            <p className="text-sm text-muted-foreground">{profileData?.email}</p>
            {isEditing && (
              <p className="text-xs text-muted-foreground mt-2">
                Click the camera icon to upload a new profile photo. JPG, PNG or GIF (max 5MB)
              </p>
            )}
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={profileData?.name}
            onChange={(e) => setProfileData({ ...profileData, name: e?.target?.value })}
            disabled={!isEditing}
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={profileData?.email}
            onChange={(e) => setProfileData({ ...profileData, email: e?.target?.value })}
            disabled={!isEditing}
            required
          />
          <Select
            label="Department"
            options={departmentOptions}
            value={profileData?.department?.toLowerCase()}
            onChange={(value) => setProfileData({ ...profileData, department: value })}
            disabled={!isEditing}
          />
          <Input
            label="Phone Number"
            type="tel"
            value={profileData?.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e?.target?.value })}
            disabled={!isEditing}
          />
          <Input
            label="Location"
            value={profileData?.location}
            onChange={(e) => setProfileData({ ...profileData, location: e?.target?.value })}
            disabled={!isEditing}
          />
        </div>

        {/* Role Display */}
        <div className="border-t border-border pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-foreground">
                Current Role
              </label>
              <div className="mt-2 flex items-center gap-3">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium">
                  <Icon name="Shield" size={16} />
                  {profileData?.role}
                </span>
                <span className="text-sm text-muted-foreground">
                  Read-only access level
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your role determines your access permissions across TeamSync Pro
              </p>
            </div>
            <Button variant="outline" size="sm" iconName="ArrowUpRight">
              Request Change
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={isSaving}
              iconName="Save"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      {/* Export Data */}
      <div className="bg-muted/50 border border-border rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Icon name="Download" size={16} />
              Export Personal Data
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Download a copy of your personal data for compliance requirements
            </p>
          </div>
          <Button variant="outline" size="sm" iconName="Download">
            Export Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;