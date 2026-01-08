import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ParticipantPanel = ({ isOpen, onClose, participants, userRole, onRemoveParticipant, onMuteParticipant }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredParticipants = participants?.filter(p =>
    p?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const getConnectionIcon = (quality) => {
    if (quality === 'excellent') return { name: 'Wifi', color: 'text-success' };
    if (quality === 'good') return { name: 'Wifi', color: 'text-warning' };
    return { name: 'WifiOff', color: 'text-error' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 lg:w-[400px] bg-card border-l border-border z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Icon name="Users" size={24} className="text-primary" />
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
            Participants ({participants?.length})
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          onClick={onClose}
        >
          <span className="sr-only">Close participants</span>
        </Button>
      </div>
      <div className="p-4 md:p-6 border-b border-border">
        <Input
          type="search"
          placeholder="Search participants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          iconName="Search"
        />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 md:p-6 space-y-3">
          {filteredParticipants?.map((participant) => {
            const connectionIcon = getConnectionIcon(participant?.connectionQuality);
            
            return (
              <div
                key={participant?.id}
                className="p-3 md:p-4 bg-surface rounded-xl border border-border hover:border-primary/50 transition-all duration-250"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden bg-muted">
                      <Image
                        src={participant?.avatar}
                        alt={participant?.avatarAlt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-surface ${
                      participant?.isActive ? 'bg-success' : 'bg-muted-foreground'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm md:text-base font-medium text-foreground truncate">
                        {participant?.name}
                        {participant?.isYou && ' (You)'}
                      </span>
                      {participant?.role === 'admin' && (
                        <span className="px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded flex-shrink-0">
                          Host
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon {...connectionIcon} size={14} />
                      <span className="text-xs text-muted-foreground capitalize">
                        {participant?.connectionQuality}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {participant?.audioEnabled ? (
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <Icon name="Mic" size={16} className="text-success" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
                        <Icon name="MicOff" size={16} className="text-error" />
                      </div>
                    )}
                    {participant?.videoEnabled ? (
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <Icon name="Video" size={16} className="text-success" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                        <Icon name="VideoOff" size={16} className="text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
                {participant?.isHandRaised && (
                  <div className="mt-3 p-2 bg-warning/10 rounded-lg border border-warning/20">
                    <div className="flex items-center gap-2">
                      <Icon name="Hand" size={14} className="text-warning" />
                      <span className="text-xs text-warning font-medium">Hand raised</span>
                    </div>
                  </div>
                )}
                {participant?.isScreenSharing && (
                  <div className="mt-3 p-2 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-center gap-2">
                      <Icon name="Monitor" size={14} className="text-success" />
                      <span className="text-xs text-success font-medium">Sharing screen</span>
                    </div>
                  </div>
                )}
                {userRole === 'admin' && !participant?.isYou && (
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="MicOff"
                      onClick={() => onMuteParticipant(participant?.id)}
                      fullWidth
                    >
                      Mute
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      iconName="UserX"
                      onClick={() => onRemoveParticipant(participant?.id)}
                      fullWidth
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {userRole === 'admin' && (
        <div className="p-4 md:p-6 border-t border-border">
          <Button
            variant="default"
            size="default"
            iconName="UserPlus"
            fullWidth
          >
            Invite Participants
          </Button>
        </div>
      )}
    </div>
  );
};

export default ParticipantPanel;