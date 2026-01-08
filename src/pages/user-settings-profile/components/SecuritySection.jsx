import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const SecuritySection = () => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const activeSessions = [
    {
      id: 1,
      device: 'MacBook Pro',
      location: 'San Francisco, CA',
      browser: 'Chrome 120',
      lastActive: '2 minutes ago',
      current: true
    },
    {
      id: 2,
      device: 'iPhone 15 Pro',
      location: 'San Francisco, CA',
      browser: 'Safari Mobile',
      lastActive: '1 hour ago',
      current: false
    },
    {
      id: 3,
      device: 'iPad Air',
      location: 'Oakland, CA',
      browser: 'Safari',
      lastActive: '2 days ago',
      current: false
    }
  ];

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password?.length >= 8) strength += 25;
    if (password?.length >= 12) strength += 25;
    if (/[a-z]/?.test(password) && /[A-Z]/?.test(password)) strength += 25;
    if (/[0-9]/?.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/?.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const handlePasswordChange = (field, value) => {
    const newData = { ...passwordData, [field]: value };
    setPasswordData(newData);
    if (field === 'newPassword') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const handleSavePassword = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordStrength(0);
  };

  const handleLogoutSession = (sessionId) => {
    console.log('Logging out session:', sessionId);
  };

  const getStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-destructive';
    if (passwordStrength < 70) return 'bg-warning';
    return 'bg-success';
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Security Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your password, two-factor authentication, and active sessions
        </p>
      </div>

      {/* Password Management */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Icon name="Lock" size={20} />
              Password
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {isChangingPassword ? 'Enter your current and new password' : 'Last changed 3 months ago'}
            </p>
          </div>
          {!isChangingPassword && (
            <Button
              onClick={() => setIsChangingPassword(true)}
              variant="outline"
              iconName="Key"
            >
              Change Password
            </Button>
          )}
        </div>

        {isChangingPassword && (
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="relative">
              <Input
                label="Current Password"
                type={showPasswords?.current ? 'text' : 'password'}
                value={passwordData?.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e?.target?.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords?.current })}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
              >
                <Icon name={showPasswords?.current ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>

            <div className="relative">
              <Input
                label="New Password"
                type={showPasswords?.new ? 'text' : 'password'}
                value={passwordData?.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e?.target?.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords?.new })}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
              >
                <Icon name={showPasswords?.new ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>

            {passwordData?.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Password Strength</span>
                  <span className={`font-medium ${
                    passwordStrength < 40 ? 'text-destructive' :
                    passwordStrength < 70 ? 'text-warning' : 'text-success'
                  }`}>
                    {getStrengthLabel()}
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <Input
                label="Confirm New Password"
                type={showPasswords?.confirm ? 'text' : 'password'}
                value={passwordData?.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e?.target?.value)}
                error={passwordData?.confirmPassword && passwordData?.newPassword !== passwordData?.confirmPassword ? 'Passwords do not match' : ''}
                required
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords?.confirm })}
                className="absolute right-3 top-9 text-muted-foreground hover:text-foreground"
              >
                <Icon name={showPasswords?.confirm ? 'EyeOff' : 'Eye'} size={16} />
              </button>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordStrength(0);
                }}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePassword}
                loading={isSaving}
                disabled={!passwordData?.currentPassword || !passwordData?.newPassword || passwordData?.newPassword !== passwordData?.confirmPassword}
                iconName="Save"
              >
                Update Password
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Icon name="Smartphone" size={20} />
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add an extra layer of security to your account
            </p>
            <div className="mt-4">
              <Checkbox
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e?.target?.checked)}
                label="Enable two-factor authentication"
                description="Require a verification code in addition to your password when signing in"
              />
            </div>
          </div>
          {twoFactorEnabled && (
            <Button variant="outline" size="sm" iconName="Settings">
              Configure
            </Button>
          )}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Icon name="Monitor" size={20} />
              Active Sessions
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Manage devices where you're currently signed in
            </p>
          </div>
          <Button variant="destructive" size="sm" iconName="LogOut">
            Logout All
          </Button>
        </div>

        <div className="space-y-3">
          {activeSessions?.map((session) => (
            <div
              key={session?.id}
              className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-background rounded-lg">
                  <Icon
                    name={session?.device?.includes('iPhone') || session?.device?.includes('iPad') ? 'Smartphone' : 'Monitor'}
                    size={20}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {session?.device}
                    </p>
                    {session?.current && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-success/10 text-success rounded">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {session?.browser} • {session?.location}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last active: {session?.lastActive}
                  </p>
                </div>
              </div>
              {!session?.current && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLogoutSession(session?.id)}
                  iconName="LogOut"
                >
                  Logout
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;