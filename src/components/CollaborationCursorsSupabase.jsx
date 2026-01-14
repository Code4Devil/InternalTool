import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const CollaborationCursorsSupabase = ({ projectId }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    if (!projectId) return;

    const presenceChannel = supabase.channel(`presence:project:${projectId}`, {
      config: {
        presence: {
          key: 'user',
        },
      },
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const users = Object.values(state).flat();
        setActiveUsers(users);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        console.log('New users joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        console.log('Users left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          const session = await supabase.auth.getSession();
          if (session.data.session) {
            const { data: userData } = await supabase
              .from('users')
              .select('id, full_name, avatar_url')
              .eq('id', session.data.session.user.id)
              .single();

            await presenceChannel.track({
              user_id: session.data.session.user.id,
              full_name: userData?.full_name || 'Anonymous',
              avatar_url: userData?.avatar_url,
              online_at: new Date().toISOString(),
            });
          }
        }
      });

    setChannel(presenceChannel);

    return () => {
      if (presenceChannel) {
        presenceChannel.unsubscribe();
      }
    };
  }, [projectId]);

  if (!projectId || activeUsers.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg shadow-lg p-3 z-50">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-medium text-foreground">
          {activeUsers.length} online
        </span>
      </div>
      <div className="flex -space-x-2">
        {activeUsers.slice(0, 5).map((user, index) => (
          <div
            key={index}
            className="relative group"
            title={user.full_name}
          >
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="w-8 h-8 rounded-full border-2 border-card"
              />
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-card bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                {user.full_name?.charAt(0) || '?'}
              </div>
            )}
          </div>
        ))}
        {activeUsers.length > 5 && (
          <div className="w-8 h-8 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
            +{activeUsers.length - 5}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationCursorsSupabase;
