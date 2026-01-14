import React, { useState, useEffect } from 'react';
import { supabase, getSession, createNotification } from '../lib/supabase';
import Icon from './AppIcon';
import Button from './ui/Button';
import ActivityIndicator from './ui/ActivityIndicator';

const CommentsSection = ({ taskId, projectId }) => {
  const [comments, setComments] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');

  useEffect(() => {
    loadComments();
    loadProjectMembers();
    subscribeToComments();

    return () => {
      // Cleanup subscription
    };
  }, [taskId]);

  const loadComments = async () => {
    try {
      const session = await getSession();
      if (!session) return;
      
      setCurrentUserId(session.user.id);

      const { data, error } = await supabase
        .from('task_comments')
        .select(`
          *,
          users(id, full_name, email, avatar_url)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('project_members')
        .select(`
          user_id,
          users(id, full_name, email)
        `)
        .eq('project_id', projectId);

      if (error) throw error;
      setProjectMembers(data?.map(m => m.users).filter(Boolean) || []);
    } catch (error) {
      console.error('Failed to load members:', error);
    }
  };

  const subscribeToComments = () => {
    const channel = supabase
      .channel(`comments:${taskId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'task_comments',
        filter: `task_id=eq.${taskId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          loadComments();
        } else if (payload.eventType === 'UPDATE') {
          setComments(prev => prev.map(c => 
            c.id === payload.new.id ? { ...c, ...payload.new } : c
          ));
        } else if (payload.eventType === 'DELETE') {
          setComments(prev => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const parseMentions = (content) => {
    const mentionRegex = /@(\w+)/g;
    const mentions = [];
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      const mentionedUser = projectMembers.find(m => 
        m.full_name?.toLowerCase().includes(match[1].toLowerCase()) ||
        m.email?.toLowerCase().includes(match[1].toLowerCase())
      );
      if (mentionedUser) {
        mentions.push(mentionedUser.id);
      }
    }

    return mentions;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);

      const { data: comment, error } = await supabase
        .from('task_comments')
        .insert({
          task_id: taskId,
          user_id: currentUserId,
          content: newComment,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Send notifications for mentions
      const mentions = parseMentions(newComment);
      for (const userId of mentions) {
        if (userId !== currentUserId) {
          await createNotification({
            userId,
            type: 'mentioned',
            title: 'You were mentioned',
            message: `You were mentioned in a comment on task`,
            relatedTaskId: taskId,
            relatedProjectId: projectId,
          });
        }
      }

      setNewComment('');
      setShowMentions(false);
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId) => {
    try {
      const { error } = await supabase
        .from('task_comments')
        .update({
          content: editContent,
          updated_at: new Date().toISOString(),
        })
        .eq('id', commentId);

      if (error) throw error;

      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm('Delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('task_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleMention = (user) => {
    const mention = `@${user.full_name || user.email.split('@')[0]} `;
    setNewComment(prev => prev + mention);
    setShowMentions(false);
    setMentionSearch('');
  };

  const filteredMembers = projectMembers.filter(m =>
    m.full_name?.toLowerCase().includes(mentionSearch.toLowerCase()) ||
    m.email?.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <ActivityIndicator size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                {comment.users?.avatar_url ? (
                  <img
                    src={comment.users.avatar_url}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={16} color="var(--color-primary)" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">
                    {comment.users?.full_name || 'Unknown User'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.created_at).toLocaleString()}
                  </span>
                </div>
                {editingId === comment.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(comment.id)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-foreground whitespace-pre-wrap">
                      {comment.content}
                    </p>
                    {comment.user_id === currentUserId && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            setEditingId(comment.id);
                            setEditContent(comment.content);
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(comment.id)}
                          className="text-xs text-error hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <textarea
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              if (e.target.value.endsWith('@')) {
                setShowMentions(true);
              }
            }}
            placeholder="Add a comment... (Use @ to mention someone)"
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={3}
          />
          {showMentions && (
            <div className="absolute bottom-full mb-2 left-0 right-0 bg-card border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto">
              <div className="p-2">
                <input
                  type="text"
                  placeholder="Search members..."
                  value={mentionSearch}
                  onChange={(e) => setMentionSearch(e.target.value)}
                  className="w-full px-2 py-1 bg-background border border-border rounded text-sm mb-2"
                />
                {filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleMention(member)}
                    className="w-full text-left px-2 py-1.5 hover:bg-muted rounded text-sm"
                  >
                    {member.full_name || member.email}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-between items-center mt-2">
          <button
            type="button"
            onClick={() => setShowMentions(!showMentions)}
            className="text-sm text-primary hover:underline"
          >
            @ Mention
          </button>
          <Button
            type="submit"
            size="sm"
            loading={submitting}
            disabled={!newComment.trim()}
          >
            Post Comment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CommentsSection;
