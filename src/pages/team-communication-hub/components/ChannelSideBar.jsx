import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ChannelSidebar = ({ 
  channels, 
  activeChannel, 
  onChannelSelect, 
  userRole,
  onCreateChannel 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    projects: true,
    direct: true,
    archived: false
  });

  const filteredChannels = channels?.filter(channel =>
    channel?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev?.[category]
    }));
  };

  const getChannelsByCategory = (category) => {
    return filteredChannels?.filter(ch => ch?.category === category);
  };

  const getUnreadCount = (channelId) => {
    const channel = channels?.find(ch => ch?.id === channelId);
    return channel?.unreadCount || 0;
  };

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border">
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search channels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-2 space-y-1">
          {['projects', 'direct', 'archived']?.map(category => {
            const categoryChannels = getChannelsByCategory(category);
            if (categoryChannels?.length === 0) return null;

            return (
              <div key={category}>
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs font-caption text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                >
                  <span>{category}</span>
                  <Icon 
                    name={expandedCategories?.[category] ? 'ChevronDown' : 'ChevronRight'} 
                    size={14}
                  />
                </button>
                {expandedCategories?.[category] && (
                  <div className="space-y-0.5 mb-2">
                    {categoryChannels?.map(channel => {
                      const unreadCount = getUnreadCount(channel?.id);
                      const isActive = activeChannel?.id === channel?.id;

                      return (
                        <button
                          key={channel?.id}
                          onClick={() => onChannelSelect(channel)}
                          className={`
                            w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm
                            transition-all duration-250 ease-smooth
                            ${isActive 
                              ? 'bg-primary text-primary-foreground font-medium' 
                              : 'text-foreground hover:bg-muted'
                            }
                          `}
                        >
                          <Icon 
                            name={channel?.type === 'direct' ? 'User' : 'Hash'} 
                            size={16}
                          />
                          <span className="flex-1 text-left truncate">{channel?.name}</span>
                          {channel?.isPrivate && (
                            <Icon name="Lock" size={12} className="flex-shrink-0" />
                          )}
                          {unreadCount > 0 && (
                            <span className="flex-shrink-0 px-1.5 py-0.5 text-xs font-bold bg-error text-error-foreground rounded-full min-w-[20px] text-center">
                              {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                          )}
                          {channel?.status === 'online' && (
                            <span className="w-2 h-2 bg-success rounded-full flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {userRole === 'admin' && (
        <div className="p-4 border-t border-border">
          <button
            onClick={onCreateChannel}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Icon name="Plus" size={18} />
            <span className="text-sm font-medium">New Channel</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChannelSidebar;