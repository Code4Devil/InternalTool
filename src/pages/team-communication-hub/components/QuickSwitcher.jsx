import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const QuickSwitcher = ({ isOpen, onClose, channels, onChannelSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const filteredChannels = channels?.filter(channel =>
    channel?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      inputRef?.current?.focus();
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e?.key === 'Escape') {
        onClose();
      } else if (e?.key === 'ArrowDown') {
        e?.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredChannels?.length - 1 ? prev + 1 : prev
        );
      } else if (e?.key === 'ArrowUp') {
        e?.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
      } else if (e?.key === 'Enter' && filteredChannels?.[selectedIndex]) {
        e?.preventDefault();
        onChannelSelect(filteredChannels?.[selectedIndex]);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredChannels, selectedIndex, onChannelSelect, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-200 flex items-start justify-center pt-20">
      <div className="w-full max-w-2xl mx-4 bg-card border border-border rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search channels... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e?.target?.value);
                setSelectedIndex(0);
              }}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {filteredChannels?.length === 0 ? (
            <div className="p-8 text-center">
              <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No channels found</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredChannels?.map((channel, index) => (
                <button
                  key={channel?.id}
                  onClick={() => {
                    onChannelSelect(channel);
                    onClose();
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left
                    transition-colors
                    ${index === selectedIndex 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-muted'
                    }
                  `}
                >
                  <Icon 
                    name={channel?.type === 'direct' ? 'User' : 'Hash'} 
                    size={18}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{channel?.name}</p>
                    <p className="text-xs opacity-80 truncate">{channel?.category}</p>
                  </div>
                  {channel?.unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-error text-error-foreground rounded-full">
                      {channel?.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">Enter</kbd>
                Select
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickSwitcher;