import React from 'react';
import Image from '../../components/AppImage';
import Icon from '../../components/AppIcon';

const VideoGrid = ({ participants, layout, localStream, remoteStreams }) => {
  const getGridClass = () => {
    const count = participants?.length;
    if (count === 1) return 'grid-cols-1';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 4) return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2';
    if (count <= 9) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };

  const getParticipantStatus = (participant) => {
    if (participant?.isSpeaking) return 'border-success';
    if (participant?.isHandRaised) return 'border-warning';
    return 'border-border';
  };

  return (
    <div className={`grid ${getGridClass()} gap-2 md:gap-3 lg:gap-4 h-full p-2 md:p-3 lg:p-4`}>
      {participants?.map((participant) => (
        <div
          key={participant?.id}
          className={`relative bg-surface rounded-xl overflow-hidden border-2 ${getParticipantStatus(participant)} transition-all duration-250`}
        >
          {participant?.videoEnabled ? (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <div className="text-center">
                <Icon name="Video" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-xs md:text-sm text-muted-foreground">Video Stream Active</p>
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-muted">
                <Image
                  src={participant?.avatar}
                  alt={participant?.avatarAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-2 md:p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs md:text-sm font-medium text-foreground truncate">
                  {participant?.name}
                  {participant?.isYou && ' (You)'}
                </span>
                {participant?.role === 'admin' && (
                  <span className="px-1.5 py-0.5 text-xs bg-primary/20 text-primary rounded">
                    Host
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {!participant?.audioEnabled && (
                  <div className="w-6 h-6 md:w-7 md:h-7 bg-error/20 rounded-full flex items-center justify-center">
                    <Icon name="MicOff" size={14} className="text-error" />
                  </div>
                )}
                {participant?.isHandRaised && (
                  <div className="w-6 h-6 md:w-7 md:h-7 bg-warning/20 rounded-full flex items-center justify-center">
                    <Icon name="Hand" size={14} className="text-warning" />
                  </div>
                )}
                {participant?.isScreenSharing && (
                  <div className="w-6 h-6 md:w-7 md:h-7 bg-success/20 rounded-full flex items-center justify-center">
                    <Icon name="Monitor" size={14} className="text-success" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {participant?.connectionQuality && (
            <div className="absolute top-2 right-2">
              <div className={`w-2 h-2 rounded-full ${
                participant?.connectionQuality === 'excellent' ? 'bg-success' :
                participant?.connectionQuality === 'good'? 'bg-warning' : 'bg-error'
              }`} />
            </div>
          )}

          {participant?.isSpeaking && (
            <div className="absolute inset-0 border-4 border-success rounded-xl pointer-events-none animate-pulse" />
          )}
        </div>
      ))}
    </div>
  );
};

export default VideoGrid;