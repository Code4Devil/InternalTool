import React, { useState } from 'react';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Icon from '../../components/AppIcon';
import ProfileSection from './components/ProfileSection';
import SecuritySection from './components/SecuritySection';
import NotificationPreferences from './components/NotificationPreferences';
import PreferencesSection from './components/PreferencesSection';

const UserSettingsProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'User' },
    { id: 'security', label: 'Security', icon: 'Lock' },
    { id: 'notifications', label: 'Notifications', icon: 'Bell' },
    { id: 'preferences', label: 'Preferences', icon: 'Settings' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSection />;
      case 'security':
        return <SecuritySection />;
      case 'notifications':
        return <NotificationPreferences />;
      case 'preferences':
        return <PreferencesSection />;
      default:
        return <ProfileSection />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      
      <div className={`flex-1 flex flex-col transition-all duration-250`}>
        <header className="sticky top-0 z-50 bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                User Settings
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your account settings and preferences
              </p>
            </div>
            <div className="flex items-center gap-4">
              <NotificationCenter />
              <UserProfileDropdown />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Sidebar Navigation */}
          <aside className="w-64 bg-card border-r border-border overflow-y-auto">
            <nav className="p-4 space-y-1">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-250 ease-smooth
                    ${
                      activeTab === tab?.id
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'text-foreground hover:bg-muted'
                    }
                  `}
                >
                  <Icon name={tab?.icon} size={20} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsProfile;