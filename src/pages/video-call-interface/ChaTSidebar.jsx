import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const ChatSidebar = ({ isOpen, onClose, messages, onSendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSend = () => {
    if (newMessage?.trim() || selectedFile) {
      onSendMessage({
        text: newMessage,
        file: selectedFile
      });
      setNewMessage('');
      setSelectedFile(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter' && !e?.shiftKey) {
      e?.preventDefault();
      handleSend();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-0 w-full md:w-96 lg:w-[400px] bg-card border-l border-border z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <Icon name="MessageSquare" size={24} className="text-primary" />
          <h3 className="text-lg md:text-xl font-heading font-semibold text-foreground">
            Meeting Chat
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          onClick={onClose}
        >
          <span className="sr-only">Close chat</span>
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 space-y-4">
        {messages?.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="MessageCircle" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start the conversation</p>
          </div>
        ) : (
          messages?.map((message) => (
            <div key={message?.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  <Image
                    src={message?.senderAvatar}
                    alt={message?.senderAvatarAlt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {message?.senderName}
                    </span>
                    <span className="text-xs text-muted-foreground data-text">
                      {formatTime(message?.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                    {message?.text}
                  </p>
                  {message?.file && (
                    <div className="mt-2 p-3 bg-muted rounded-lg border border-border">
                      <div className="flex items-center gap-2">
                        <Icon name="Paperclip" size={16} className="text-muted-foreground" />
                        <span className="text-xs text-foreground truncate">
                          {message?.file?.name}
                        </span>
                        <Button variant="ghost" size="xs" iconName="Download">
                          <span className="sr-only">Download file</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 md:p-6 border-t border-border space-y-3">
        {selectedFile && (
          <div className="p-3 bg-muted rounded-lg border border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <Icon name="File" size={16} className="text-muted-foreground flex-shrink-0" />
                <span className="text-xs text-foreground truncate">
                  {selectedFile?.name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="xs"
                iconName="X"
                onClick={() => setSelectedFile(null)}
              >
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          </div>
        )}

        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e?.target?.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <Button
            variant="ghost"
            size="default"
            iconName="Paperclip"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <span className="sr-only">Attach file</span>
          </Button>
          <input
            id="file-input"
            type="file"
            className="hidden"
            onChange={(e) => setSelectedFile(e?.target?.files?.[0])}
          />
          <Button
            variant="default"
            size="default"
            iconName="Send"
            onClick={handleSend}
            disabled={!newMessage?.trim() && !selectedFile}
          >
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;