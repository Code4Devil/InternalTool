import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserProfileDropdown from '../../components/ui/UserProfileDropdown';
import NotificationCenter from '../../components/ui/NotificationCenter';
import Icon from '../../components/AppIcon';
import ChannelSidebar from './components/ChannelSideBar';
import MessageThread from './components/MessageThread';
import ParticipantPanel from './components/ParticipantPanel';
import QuickSwitcher from './components/QuickSwitcher';
import CreateChannelModal from './components/CreateChannelModal';

const TeamCommunicationHub = () => {
  const navigate = useNavigate();
  const [showQuickSwitcher, setShowQuickSwitcher] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);

  const currentUser = {
    id: 1,
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@teamsync.com',
    role: 'admin',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_18631bb95-1766828402540.png"
  };

  const [channels, setChannels] = useState([
  {
    id: 1,
    name: 'general',
    type: 'channel',
    category: 'projects',
    isPrivate: false,
    unreadCount: 3,
    lastMessage: 'Team meeting at 3 PM',
    lastMessageTime: new Date(Date.now() - 300000)
  },
  {
    id: 2,
    name: 'project-alpha',
    type: 'channel',
    category: 'projects',
    isPrivate: false,
    unreadCount: 12,
    lastMessage: 'Design review completed',
    lastMessageTime: new Date(Date.now() - 600000)
  },
  {
    id: 3,
    name: 'development',
    type: 'channel',
    category: 'projects',
    isPrivate: false,
    unreadCount: 0,
    lastMessage: 'API integration done',
    lastMessageTime: new Date(Date.now() - 3600000)
  },
  {
    id: 4,
    name: 'John Anderson',
    type: 'direct',
    category: 'direct',
    status: 'online',
    unreadCount: 2,
    lastMessage: 'Can we sync on the backend?',
    lastMessageTime: new Date(Date.now() - 900000)
  },
  {
    id: 5,
    name: 'Emily Chen',
    type: 'direct',
    category: 'direct',
    status: 'away',
    unreadCount: 0,
    lastMessage: 'Thanks for the update!',
    lastMessageTime: new Date(Date.now() - 7200000)
  },
  {
    id: 6,
    name: 'old-project',
    type: 'channel',
    category: 'archived',
    isPrivate: false,
    unreadCount: 0,
    lastMessage: 'Project completed',
    lastMessageTime: new Date(Date.now() - 86400000)
  }]
  );

  const [messages, setMessages] = useState([
  {
    id: 1,
    senderId: 2,
    senderName: 'John Anderson',
    senderAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_15d6b1d69-1763295300746.png",
    senderAvatarAlt: 'Professional headshot of Caucasian man with short brown hair wearing navy blue blazer and white shirt',
    text: 'Hey team! Just finished the backend API integration for the user authentication module.',
    timestamp: new Date(Date.now() - 3600000),
    reactions: [
    { emoji: '👍', count: 3 },
    { emoji: '🎉', count: 2 }]

  },
  {
    id: 2,
    senderId: 3,
    senderName: 'Emily Chen',
    senderAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cd3c8d74-1763295583676.png",
    senderAvatarAlt: 'Professional headshot of Asian woman with long black hair wearing gray business suit',
    text: 'Excellent work! Can you share the API documentation?',
    timestamp: new Date(Date.now() - 3300000),
    replyTo: {
      sender: 'John Anderson',
      text: 'Just finished the backend API integration'
    }
  },
  {
    id: 3,
    senderId: 2,
    senderName: 'John Anderson',
    senderAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_15d6b1d69-1763295300746.png",
    senderAvatarAlt: 'Professional headshot of Caucasian man with short brown hair wearing navy blue blazer and white shirt',
    text: 'Sure! I\'ll upload it to the shared drive.',
    timestamp: new Date(Date.now() - 3000000),
    file: {
      name: 'API_Documentation_v2.pdf',
      size: '2.4 MB',
      type: 'application/pdf'
    }
  },
  {
    id: 4,
    senderId: 1,
    senderName: 'Sarah Mitchell',
    senderAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b24a7c2e-1763296129552.png",
    senderAvatarAlt: 'Professional headshot of Caucasian woman with blonde hair in elegant black blazer',
    text: 'Great progress everyone! Let\'s schedule a demo for the stakeholders.',
    timestamp: new Date(Date.now() - 2700000),
    reactions: [
    { emoji: '🚀', count: 5 }]

  },
  {
    id: 5,
    senderId: 4,
    senderName: 'Michael Rodriguez',
    senderAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_138df7967-1763295321074.png",
    senderAvatarAlt: 'Professional headshot of Hispanic man with short black hair wearing charcoal suit',
    text: 'I\'ve updated the UI mockups based on the latest feedback. Check them out!',
    timestamp: new Date(Date.now() - 2400000),
    file: {
      name: 'UI_Mockups_Final.fig',
      size: '8.7 MB',
      type: 'application/figma'
    }
  },
  {
    id: 6,
    senderId: 5,
    senderName: 'Lisa Thompson',
    senderAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17faa8e7a-1763295754680.png",
    senderAvatarAlt: 'Professional headshot of African American woman with curly hair wearing burgundy blazer',
    text: 'The marketing campaign is ready to launch. Waiting for final approval.',
    timestamp: new Date(Date.now() - 1800000)
  },
  {
    id: 7,
    senderId: 1,
    senderName: 'Sarah Mitchell',
    senderAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b24a7c2e-1763296129552.png",
    senderAvatarAlt: 'Professional headshot of Caucasian woman with blonde hair in elegant black blazer',
    text: 'Approved! Let\'s coordinate the launch timing with the product release.',
    timestamp: new Date(Date.now() - 1200000),
    reactions: [
    { emoji: '✅', count: 4 }]

  }]
  );

  const participants = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Executive Director',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b24a7c2e-1763296129552.png",
    avatarAlt: 'Professional headshot of Caucasian woman with blonde hair in elegant black blazer',
    status: 'online'
  },
  {
    id: 2,
    name: 'John Anderson',
    role: 'Senior Developer',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_15d6b1d69-1763295300746.png",
    avatarAlt: 'Professional headshot of Caucasian man with short brown hair wearing navy blue blazer and white shirt',
    status: 'online'
  },
  {
    id: 3,
    name: 'Emily Chen',
    role: 'Product Manager',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1cd3c8d74-1763295583676.png",
    avatarAlt: 'Professional headshot of Asian woman with long black hair wearing gray business suit',
    status: 'away'
  },
  {
    id: 4,
    name: 'Michael Rodriguez',
    role: 'UX Designer',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_138df7967-1763295321074.png",
    avatarAlt: 'Professional headshot of Hispanic man with short black hair wearing charcoal suit',
    status: 'online'
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    role: 'Marketing Lead',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17faa8e7a-1763295754680.png",
    avatarAlt: 'Professional headshot of African American woman with curly hair wearing burgundy blazer',
    status: 'offline'
  },
  {
    id: 6,
    name: 'David Kim',
    role: 'Backend Developer',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1e6ddb210-1763294026338.png",
    avatarAlt: 'Professional headshot of Asian man with glasses wearing light blue shirt',
    status: 'online'
  },
  {
    id: 7,
    name: 'Rachel Green',
    role: 'QA Engineer',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_10f2ac275-1763297173925.png",
    avatarAlt: 'Professional headshot of Caucasian woman with red hair wearing green blouse',
    status: 'away'
  },
  {
    id: 8,
    name: 'James Wilson',
    role: 'DevOps Engineer',
    avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1faa738ad-1763294932464.png",
    avatarAlt: 'Professional headshot of African American man with short hair wearing black turtleneck',
    status: 'online'
  }];


  const sharedFiles = [
  {
    id: 1,
    name: 'API_Documentation_v2.pdf',
    type: 'application/pdf',
    size: 2457600,
    uploadedBy: 'John Anderson',
    uploadedAt: new Date(Date.now() - 3000000)
  },
  {
    id: 2,
    name: 'UI_Mockups_Final.fig',
    type: 'application/figma',
    size: 9175040,
    uploadedBy: 'Michael Rodriguez',
    uploadedAt: new Date(Date.now() - 2400000)
  },
  {
    id: 3,
    name: 'Sprint_Planning_Notes.docx',
    type: 'application/msword',
    size: 524288,
    uploadedBy: 'Emily Chen',
    uploadedAt: new Date(Date.now() - 86400000)
  },
  {
    id: 4,
    name: 'Team_Photo_2026.jpg',
    type: 'image/jpeg',
    size: 3145728,
    uploadedBy: 'Lisa Thompson',
    uploadedAt: new Date(Date.now() - 172800000)
  },
  {
    id: 5,
    name: 'Database_Schema.sql',
    type: 'application/sql',
    size: 102400,
    uploadedBy: 'David Kim',
    uploadedAt: new Date(Date.now() - 259200000)
  }];


  useEffect(() => {
    if (channels?.length > 0 && !activeChannel) {
      setActiveChannel(channels?.[0]);
    }
  }, [channels, activeChannel]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e?.ctrlKey || e?.metaKey) && e?.key === 'k') {
        e?.preventDefault();
        setShowQuickSwitcher(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSendMessage = (messageData) => {
    const newMessage = {
      id: messages?.length + 1,
      senderId: currentUser?.id,
      senderName: currentUser?.name,
      senderAvatar: currentUser?.avatar,
      senderAvatarAlt: 'Professional headshot of Caucasian woman with blonde hair in elegant black blazer',
      text: messageData?.text,
      timestamp: new Date(),
      file: messageData?.file,
      replyTo: messageData?.replyTo ? {
        sender: messageData?.replyTo?.senderName,
        text: messageData?.replyTo?.text
      } : null,
      reactions: []
    };

    setMessages([...messages, newMessage]);
  };

  const handleReaction = (messageId, emoji) => {
    setMessages(messages?.map((msg) => {
      if (msg?.id === messageId) {
        const existingReaction = msg?.reactions?.find((r) => r?.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg?.reactions?.map((r) =>
            r?.emoji === emoji ? { ...r, count: r?.count + 1 } : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...(msg?.reactions || []), { emoji, count: 1 }]
          };
        }
      }
      return msg;
    }));
  };

  const handleDeleteMessage = (messageId) => {
    setMessages(messages?.filter((msg) => msg?.id !== messageId));
  };

  const handleChannelSelect = (channel) => {
    setActiveChannel(channel);
    setChannels(channels?.map((ch) =>
    ch?.id === channel?.id ? { ...ch, unreadCount: 0 } : ch
    ));
  };

  const handleCreateChannel = (channelData) => {
    const newChannel = {
      id: channels?.length + 1,
      name: channelData?.name,
      type: 'channel',
      category: 'projects',
      isPrivate: channelData?.isPrivate,
      unreadCount: 0,
      lastMessage: 'Channel created',
      lastMessageTime: new Date()
    };
    setChannels([...channels, newChannel]);
  };

  const handleStartCall = (participantId) => {
    navigate('/video-call-interface');
  };

  return (
    <div className="flex h-screen bg-background">
      <div className={`flex-1 flex flex-col transition-all duration-250`}>
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3 md:gap-4">
            <h1 className="text-lg md:text-xl font-heading font-semibold text-foreground">
              Team Communication Hub
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={() => setShowQuickSwitcher(true)}
              className="hidden md:flex items-center gap-2 px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors">

              <Icon name="Search" size={16} className="text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Quick switch</span>
              <kbd className="px-1.5 py-0.5 text-xs bg-background border border-border rounded">
                Ctrl+K
              </kbd>
            </button>
            <NotificationCenter />
            <UserProfileDropdown />
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-full lg:w-1/5 min-w-[240px] max-w-[280px] hidden lg:block">
            <ChannelSidebar
              channels={channels}
              activeChannel={activeChannel}
              onChannelSelect={handleChannelSelect}
              userRole={currentUser?.role}
              onCreateChannel={() => setShowCreateModal(true)} />

          </div>

          <div className="flex-1 flex flex-col lg:w-3/5">
            {activeChannel ?
            <MessageThread
              messages={messages}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onReaction={handleReaction}
              onDeleteMessage={handleDeleteMessage}
              channelName={activeChannel?.name} /> :


            <div className="flex-1 flex items-center justify-center bg-background">
                <div className="text-center">
                  <Icon name="MessageSquare" size={64} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                    Select a channel to start messaging
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a channel from the sidebar or press Ctrl+K to quick switch
                  </p>
                </div>
              </div>
            }
          </div>

          <div className="w-full lg:w-1/5 min-w-[240px] max-w-[320px] hidden xl:block">
            <ParticipantPanel
              participants={participants}
              sharedFiles={sharedFiles}
              onStartCall={handleStartCall}
              userRole={currentUser?.role} />

          </div>
        </div>
      </div>
      <QuickSwitcher
        isOpen={showQuickSwitcher}
        onClose={() => setShowQuickSwitcher(false)}
        channels={channels}
        onChannelSelect={handleChannelSelect} />

      <CreateChannelModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateChannel={handleCreateChannel} />

    </div>);

};

export default TeamCommunicationHub;