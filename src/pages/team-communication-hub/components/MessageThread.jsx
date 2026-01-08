import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const MessageThread = ({ 
  messages, 
  currentUser, 
  onSendMessage, 
  onReaction,
  onDeleteMessage,
  channelName 
}) => {
  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const emojis = ['👍', '❤️', '😊', '🎉', '🚀', '👏', '🔥', '💯'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (messageText?.trim() || selectedFile) {
      onSendMessage({
        text: messageText,
        file: selectedFile,
        replyTo: replyingTo
      });
      setMessageText('');
      setSelectedFile(null);
      setReplyingTo(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      setSelectedFile({
        name: file?.name,
        size: (file?.size / 1024)?.toFixed(2) + ' KB',
        type: file?.type
      });
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date?.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('image')) return 'Image';
    if (fileType?.includes('pdf')) return 'FileText';
    if (fileType?.includes('video')) return 'Video';
    return 'File';
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border bg-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <Icon name="Hash" size={20} className="text-muted-foreground" />
            <h2 className="text-base md:text-lg font-heading font-semibold text-foreground">
              {channelName}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Icon name="Search" size={18} className="text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Icon name="MoreVertical" size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-4">
        {messages?.map((message, index) => {
          const isOwnMessage = message?.senderId === currentUser?.id;
          const showAvatar = index === 0 || messages?.[index - 1]?.senderId !== message?.senderId;

          return (
            <div
              key={message?.id}
              className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {showAvatar ? (
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={message?.senderAvatar}
                    alt={message?.senderAvatarAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 md:w-10 flex-shrink-0" />
              )}
              <div className={`flex-1 max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                {showAvatar && (
                  <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                    <span className="text-xs md:text-sm font-medium text-foreground">
                      {message?.senderName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message?.timestamp)}
                    </span>
                  </div>
                )}

                {message?.replyTo && (
                  <div className="mb-2 px-3 py-2 bg-muted/50 border-l-2 border-primary rounded text-xs md:text-sm">
                    <p className="text-muted-foreground">Replying to {message?.replyTo?.sender}</p>
                    <p className="text-foreground truncate">{message?.replyTo?.text}</p>
                  </div>
                )}

                <div
                  className={`
                    px-3 md:px-4 py-2 md:py-3 rounded-xl text-sm md:text-base
                    ${isOwnMessage 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-surface text-foreground border border-border'
                    }
                  `}
                >
                  <p className="whitespace-pre-wrap break-words">{message?.text}</p>

                  {message?.file && (
                    <div className="mt-2 p-2 md:p-3 bg-background/50 rounded-lg flex items-center gap-2 md:gap-3">
                      <Icon name={getFileIcon(message?.file?.type)} size={20} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs md:text-sm font-medium truncate">{message?.file?.name}</p>
                        <p className="text-xs text-muted-foreground">{message?.file?.size}</p>
                      </div>
                      <button className="p-1 hover:bg-muted rounded">
                        <Icon name="Download" size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {message?.reactions && message?.reactions?.length > 0 && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {message?.reactions?.map((reaction, idx) => (
                      <button
                        key={idx}
                        onClick={() => onReaction(message?.id, reaction?.emoji)}
                        className="px-2 py-0.5 bg-muted hover:bg-muted/80 rounded-full text-xs flex items-center gap-1 transition-colors"
                      >
                        <span>{reaction?.emoji}</span>
                        <span className="text-muted-foreground">{reaction?.count}</span>
                      </button>
                    ))}
                  </div>
                )}

                <div className={`flex items-center gap-2 mt-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                  <button
                    onClick={() => setReplyingTo(message)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Icon name="Reply" size={14} className="text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => setShowEmojiPicker(message?.id)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                  >
                    <Icon name="Smile" size={14} className="text-muted-foreground" />
                  </button>
                  {isOwnMessage && (
                    <button
                      onClick={() => onDeleteMessage(message?.id)}
                      className="p-1 hover:bg-destructive/10 rounded transition-colors"
                    >
                      <Icon name="Trash2" size={14} className="text-destructive" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 md:p-6 border-t border-border bg-surface">
        {replyingTo && (
          <div className="mb-3 px-3 md:px-4 py-2 bg-muted rounded-lg flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Replying to {replyingTo?.senderName}</p>
              <p className="text-sm text-foreground truncate">{replyingTo?.text}</p>
            </div>
            <button
              onClick={() => setReplyingTo(null)}
              className="p-1 hover:bg-background rounded transition-colors"
            >
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>
        )}

        {selectedFile && (
          <div className="mb-3 px-3 md:px-4 py-2 bg-muted rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <Icon name={getFileIcon(selectedFile?.type)} size={20} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{selectedFile?.name}</p>
                <p className="text-xs text-muted-foreground">{selectedFile?.size}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedFile(null)}
              className="p-1 hover:bg-background rounded transition-colors"
            >
              <Icon name="X" size={16} className="text-muted-foreground" />
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 md:gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef?.current?.click()}
            className="p-2 md:p-3 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
          >
            <Icon name="Paperclip" size={20} className="text-muted-foreground" />
          </button>

          <div className="flex-1 relative">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e?.target?.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-3 md:px-4 py-2 md:py-3 bg-background border border-border rounded-lg text-sm md:text-base resize-none focus:outline-none focus:ring-2 focus:ring-primary custom-scrollbar"
              style={{ minHeight: '44px', maxHeight: '120px' }}
            />
          </div>

          <button
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 md:p-3 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
          >
            <Icon name="Smile" size={20} className="text-muted-foreground" />
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!messageText?.trim() && !selectedFile}
            className="p-2 md:p-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Icon name="Send" size={20} />
          </button>
        </div>

        {showEmojiPicker && (
          <div className="mt-3 p-3 bg-muted rounded-lg flex gap-2 flex-wrap">
            {emojis?.map((emoji, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setMessageText(prev => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="text-2xl hover:scale-110 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageThread;