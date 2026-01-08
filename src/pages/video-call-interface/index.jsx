import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/ui/Sidebar';
import UserProfileDropdown from "../../components/ui/UserProfileDropdown";
import NotificationCenter from '../../components/ui/NotificationCenter';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import VideoGrid from './VideoGrid';
import ControlPanel from './ControlPanel';
import ChatSidebar from './ChaTSidebar';
import ParticipantPanel from './ParticipantPanel';
import CallQualityIndicator from './CallQualityIndicator';
import SettingsModal from './SettingsModal';

const VideoCallInterface = () => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [layout, setLayout] = useState('grid');

  const currentUser = {
    id: 'user-1',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@teamsync.com',
    role: 'admin',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a9e8814c-1763296696290.png",
    avatarAlt: 'Professional woman with brown hair in business attire smiling at camera'
  };

  const [participants, setParticipants] = useState([
  {
    id: 'user-1',
    name: 'Sarah Mitchell',
    role: 'admin',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1a9e8814c-1763296696290.png",
    avatarAlt: 'Professional woman with brown hair in business attire smiling at camera',
    videoEnabled: true,
    audioEnabled: true,
    isScreenSharing: false,
    isHandRaised: false,
    isSpeaking: false,
    isYou: true,
    isActive: true,
    connectionQuality: 'excellent'
  },
  {
    id: 'user-2',
    name: 'Michael Chen',
    role: 'member',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_143131080-1763294458375.png",
    avatarAlt: 'Asian man with glasses wearing blue shirt in professional setting',
    videoEnabled: true,
    audioEnabled: true,
    isScreenSharing: false,
    isHandRaised: false,
    isSpeaking: true,
    isYou: false,
    isActive: true,
    connectionQuality: 'excellent'
  },
  {
    id: 'user-3',
    name: 'Emily Rodriguez',
    role: 'member',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_121250ec0-1763296348257.png",
    avatarAlt: 'Hispanic woman with long dark hair in casual business attire',
    videoEnabled: false,
    audioEnabled: true,
    isScreenSharing: false,
    isHandRaised: true,
    isSpeaking: false,
    isYou: false,
    isActive: true,
    connectionQuality: 'good'
  },
  {
    id: 'user-4',
    name: 'David Thompson',
    role: 'member',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1689d21ce-1763294361483.png",
    avatarAlt: 'Caucasian man with beard wearing gray sweater in home office',
    videoEnabled: true,
    audioEnabled: false,
    isScreenSharing: true,
    isHandRaised: false,
    isSpeaking: false,
    isYou: false,
    isActive: true,
    connectionQuality: 'excellent'
  },
  {
    id: 'user-5',
    name: 'Priya Sharma',
    role: 'member',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17279b41a-1763297986012.png",
    avatarAlt: 'Indian woman with black hair wearing professional blazer',
    videoEnabled: true,
    audioEnabled: true,
    isScreenSharing: false,
    isHandRaised: false,
    isSpeaking: false,
    isYou: false,
    isActive: true,
    connectionQuality: 'good'
  },
  {
    id: 'user-6',
    name: 'James Wilson',
    role: 'member',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_131b58687-1763291716240.png",
    avatarAlt: 'African American man with short hair in business casual attire',
    videoEnabled: false,
    audioEnabled: true,
    isScreenSharing: false,
    isHandRaised: false,
    isSpeaking: false,
    isYou: false,
    isActive: true,
    connectionQuality: 'poor'
  }]
  );

  const [chatMessages, setChatMessages] = useState([
  {
    id: 1,
    senderName: 'Michael Chen',
    senderAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_143131080-1763294458375.png",
    senderAvatarAlt: 'Asian man with glasses wearing blue shirt in professional setting',
    text: 'Thanks everyone for joining! Let\'s start with the Q4 roadmap discussion.',
    timestamp: new Date(Date.now() - 600000),
    file: null
  },
  {
    id: 2,
    senderName: 'Emily Rodriguez',
    senderAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_121250ec0-1763296348257.png",
    senderAvatarAlt: 'Hispanic woman with long dark hair in casual business attire',
    text: 'I have the latest analytics report ready to share.',
    timestamp: new Date(Date.now() - 300000),
    file: {
      name: 'Q4_Analytics_Report.pdf',
      size: '2.4 MB'
    }
  },
  {
    id: 3,
    senderName: 'David Thompson',
    senderAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1689d21ce-1763294361483.png",
    senderAvatarAlt: 'Caucasian man with beard wearing gray sweater in home office',
    text: 'Great! I\'ll share my screen to walk through the technical architecture.',
    timestamp: new Date(Date.now() - 120000),
    file: null
  }]
  );

  const [callQuality, setCallQuality] = useState({
    quality: 'excellent',
    bandwidth: 5.2,
    latency: 45,
    packetLoss: 0.1
  });

  const [settings, setSettings] = useState({
    videoQuality: 'auto',
    camera: 'default',
    microphone: 'default',
    speaker: 'default',
    virtualBackground: false,
    mirrorVideo: true,
    noiseCancellation: true,
    echoCancellation: true,
    autoBandwidth: true,
    showStats: true,
    keyboardShortcuts: true
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!settings?.keyboardShortcuts) return;

      if (e?.code === 'Space' && e?.target?.tagName !== 'INPUT' && e?.target?.tagName !== 'TEXTAREA') {
        e?.preventDefault();
        setIsAudioEnabled((prev) => !prev);
      }

      if (e?.ctrlKey && e?.key === 'd') {
        e?.preventDefault();
        setIsAudioEnabled((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [settings?.keyboardShortcuts]);

  const handleToggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    setParticipants(participants?.map((p) =>
    p?.isYou ? { ...p, audioEnabled: !isAudioEnabled } : p
    ));
  };

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    setParticipants(participants?.map((p) =>
    p?.isYou ? { ...p, videoEnabled: !isVideoEnabled } : p
    ));
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    setParticipants(participants?.map((p) =>
    p?.isYou ? { ...p, isScreenSharing: !isScreenSharing } : p
    ));
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleSendMessage = (message) => {
    const newMessage = {
      id: chatMessages?.length + 1,
      senderName: currentUser?.name,
      senderAvatar: currentUser?.avatar,
      senderAvatarAlt: currentUser?.avatarAlt,
      text: message?.text,
      timestamp: new Date(),
      file: message?.file
    };
    setChatMessages([...chatMessages, newMessage]);
  };

  const handleRemoveParticipant = (participantId) => {
    setParticipants(participants?.filter((p) => p?.id !== participantId));
  };

  const handleMuteParticipant = (participantId) => {
    setParticipants(participants?.map((p) =>
    p?.id === participantId ? { ...p, audioEnabled: false } : p
    ));
  };

  const handleEndCall = () => {
    if (window.confirm('Are you sure you want to end this call?')) {
      window.location.href = '/executive-dashboard';
    }
  };

  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className={`transition-all duration-250`}>
        <header className="sticky top-0 z-50 bg-card border-b border-border">
          <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-3 md:py-4">
            <div className="flex items-center gap-3 md:gap-4">
              <div>
                <h1 className="text-lg md:text-xl lg:text-2xl font-heading font-bold text-foreground">
                  Q4 Strategy Meeting
                </h1>
                <p className="text-xs md:text-sm text-muted-foreground">
                  {participants?.length} participants • Meeting ID: 123-456-789
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <Button
                variant="outline"
                size="sm"
                iconName="Settings"
                onClick={() => setIsSettingsOpen(true)}
                className="hidden md:flex">

                Settings
              </Button>
              <NotificationCenter />
              <UserProfileDropdown />
            </div>
          </div>
        </header>

        <main className="relative h-[calc(100vh-73px)] md:h-[calc(100vh-81px)] bg-background overflow-hidden">
          {settings?.showStats &&
          <CallQualityIndicator
            quality={callQuality?.quality}
            bandwidth={callQuality?.bandwidth}
            latency={callQuality?.latency}
            packetLoss={callQuality?.packetLoss} />

          }

          <VideoGrid
            participants={participants}
            layout={layout}
            localStream={null}
            remoteStreams={[]} />


          <ControlPanel
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
            isScreenSharing={isScreenSharing}
            isRecording={isRecording}
            onToggleAudio={handleToggleAudio}
            onToggleVideo={handleToggleVideo}
            onToggleScreenShare={handleToggleScreenShare}
            onToggleRecording={handleToggleRecording}
            onToggleChat={() => setIsChatOpen(!isChatOpen)}
            onToggleParticipants={() => setIsParticipantsOpen(!isParticipantsOpen)}
            onEndCall={handleEndCall}
            callDuration={callDuration}
            userRole={currentUser?.role} />


          <ChatSidebar
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            messages={chatMessages}
            onSendMessage={handleSendMessage} />


          <ParticipantPanel
            isOpen={isParticipantsOpen}
            onClose={() => setIsParticipantsOpen(false)}
            participants={participants}
            userRole={currentUser?.role}
            onRemoveParticipant={handleRemoveParticipant}
            onMuteParticipant={handleMuteParticipant} />


          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            currentSettings={settings}
            onSaveSettings={handleSaveSettings} />

        </main>
      </div>
    </div>);

};

export default VideoCallInterface;