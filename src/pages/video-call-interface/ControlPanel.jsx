import React from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ControlPanel = ({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  isRecording,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleRecording,
  onToggleChat,
  onToggleParticipants,
  onEndCall,
  callDuration,
  userRole
}) => {
  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs?.toString()?.padStart(2, '0')}:${mins?.toString()?.padStart(2, '0')}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/95 to-transparent p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="px-3 py-1.5 md:px-4 md:py-2 bg-surface rounded-lg border border-border">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
                <span className="text-xs md:text-sm font-medium text-foreground data-text">
                  {formatDuration(callDuration)}
                </span>
              </div>
            </div>
            {isRecording && (
              <div className="px-3 py-1.5 md:px-4 md:py-2 bg-error/10 rounded-lg border border-error/20">
                <div className="flex items-center gap-2">
                  <Icon name="Circle" size={12} className="text-error fill-error" />
                  <span className="text-xs md:text-sm font-medium text-error">Recording</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant={isAudioEnabled ? 'default' : 'destructive'}
              size="lg"
              iconName={isAudioEnabled ? 'Mic' : 'MicOff'}
              onClick={onToggleAudio}
              className="w-12 h-12 md:w-14 md:h-14"
            >
              <span className="sr-only">{isAudioEnabled ? 'Mute' : 'Unmute'}</span>
            </Button>

            <Button
              variant={isVideoEnabled ? 'default' : 'destructive'}
              size="lg"
              iconName={isVideoEnabled ? 'Video' : 'VideoOff'}
              onClick={onToggleVideo}
              className="w-12 h-12 md:w-14 md:h-14"
            >
              <span className="sr-only">{isVideoEnabled ? 'Stop Video' : 'Start Video'}</span>
            </Button>

            <Button
              variant={isScreenSharing ? 'success' : 'outline'}
              size="lg"
              iconName="Monitor"
              onClick={onToggleScreenShare}
              className="w-12 h-12 md:w-14 md:h-14"
            >
              <span className="sr-only">{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
            </Button>

            {userRole === 'admin' && (
              <Button
                variant={isRecording ? 'destructive' : 'outline'}
                size="lg"
                iconName="Circle"
                onClick={onToggleRecording}
                className="w-12 h-12 md:w-14 md:h-14"
              >
                <span className="sr-only">{isRecording ? 'Stop Recording' : 'Start Recording'}</span>
              </Button>
            )}

            <div className="w-px h-8 md:h-10 bg-border mx-1" />

            <Button
              variant="outline"
              size="lg"
              iconName="MessageSquare"
              onClick={onToggleChat}
              className="w-12 h-12 md:w-14 md:h-14"
            >
              <span className="sr-only">Toggle Chat</span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              iconName="Users"
              onClick={onToggleParticipants}
              className="w-12 h-12 md:w-14 md:h-14"
            >
              <span className="sr-only">Toggle Participants</span>
            </Button>

            <div className="w-px h-8 md:h-10 bg-border mx-1" />

            <Button
              variant="destructive"
              size="lg"
              iconName="PhoneOff"
              onClick={onEndCall}
              className="w-12 h-12 md:w-14 md:h-14"
            >
              <span className="sr-only">End Call</span>
            </Button>
          </div>

          <div className="hidden lg:block w-32" />
        </div>

        <div className="mt-3 text-center">
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Space</kbd> for push-to-talk • 
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono ml-1">Ctrl+D</kbd> to mute
          </p>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;