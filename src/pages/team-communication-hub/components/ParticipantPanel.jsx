import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ParticipantPanel = ({ participants, sharedFiles, onStartCall, userRole }) => {
  const [activeTab, setActiveTab] = useState('members');

  const getStatusColor = (status) => {
    const colors = {
      online: 'bg-success',
      away: 'bg-warning',
      offline: 'bg-muted-foreground'
    };
    return colors?.[status] || colors?.offline;
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('image')) return 'Image';
    if (fileType?.includes('pdf')) return 'FileText';
    if (fileType?.includes('video')) return 'Video';
    if (fileType?.includes('audio')) return 'Music';
    return 'File';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024)?.toFixed(1) + ' KB';
    return (bytes / (1024 * 1024))?.toFixed(1) + ' MB';
  };

  return (
    <div className="h-full flex flex-col bg-surface border-l border-border">
      <div className="p-4 border-b border-border">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('members')}
            className={`
              flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors
              ${activeTab === 'members' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:bg-muted'
              }
            `}
          >
            Members
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`
              flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors
              ${activeTab === 'files' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:bg-muted'
              }
            `}
          >
            Files
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'members' && (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
                {participants?.length} Members
              </span>
              {userRole === 'admin' && (
                <button className="p-1 hover:bg-muted rounded transition-colors">
                  <Icon name="UserPlus" size={16} className="text-muted-foreground" />
                </button>
              )}
            </div>

            {participants?.map(participant => (
              <div
                key={participant?.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={participant?.avatar}
                      alt={participant?.avatarAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(participant?.status)} rounded-full border-2 border-surface`} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {participant?.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {participant?.role}
                  </p>
                </div>

                <button
                  onClick={() => onStartCall(participant?.id)}
                  className="p-1.5 hover:bg-primary/10 rounded transition-colors"
                >
                  <Icon name="Phone" size={16} className="text-primary" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'files' && (
          <div className="p-4 space-y-2">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-caption text-muted-foreground uppercase tracking-wide">
                Shared Files
              </span>
              <button className="text-xs text-primary hover:text-primary/80 font-medium">
                View All
              </button>
            </div>

            {sharedFiles?.length === 0 ? (
              <div className="py-8 text-center">
                <Icon name="FolderOpen" size={32} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No files shared yet</p>
              </div>
            ) : (
              sharedFiles?.map(file => (
                <div
                  key={file?.id}
                  className="p-3 bg-background border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name={getFileIcon(file?.type)} size={20} className="text-muted-foreground" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file?.size)} • {file?.uploadedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(file.uploadedAt)?.toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>

                    <button className="p-1 hover:bg-muted rounded transition-colors">
                      <Icon name="Download" size={16} className="text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <div className="p-4 border-t border-border space-y-2">
        <button
          onClick={() => onStartCall('group')}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-success text-success-foreground rounded-lg hover:bg-success/90 transition-colors"
        >
          <Icon name="Video" size={18} />
          <span className="text-sm font-medium">Start Video Call</span>
        </button>

        <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
          <Icon name="Share2" size={18} />
          <span className="text-sm font-medium">Share Screen</span>
        </button>
      </div>
    </div>
  );
};

export default ParticipantPanel;