# Quick Integration Reference

## Replace Mock Pages with Supabase Versions

### In src/Routes.jsx

Add these imports at the top:
```javascript
// Supabase-integrated pages
import ExecutiveDashboardSupabase from './pages/executive-dashboard/IndexSupabase';
import MemberPersonalDashboardSupabase from './pages/member-personal-dashboard/IndexSupabase';
import InteractiveKanbanBoardSupabase from './pages/interactive-kanban-board/IndexSupabase';
import TaskManagementCenterSupabase from './pages/task-management-center/IndexSupabase';
import AuditLogSupabase from './pages/audit-log-activity-tracking/IndexSupabase';
import UserManagementSupabase from './pages/user-management/IndexSupabase';
```

Replace these route components:
```javascript
// BEFORE (Mock versions)
<Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
<Route path="/member-personal-dashboard" element={<MemberPersonalDashboard />} />
<Route path="/interactive-kanban-board" element={<InteractiveKanbanBoard />} />
<Route path="/task-management-center" element={<TaskManagementCenter />} />
<Route path="/audit-log" element={<AuditLog />} />

// AFTER (Supabase versions)
<Route path="/executive-dashboard" element={<ExecutiveDashboardSupabase />} />
<Route path="/member-personal-dashboard" element={<MemberPersonalDashboardSupabase />} />
<Route path="/interactive-kanban-board" element={<InteractiveKanbanBoardSupabase />} />
<Route path="/task-management-center" element={<TaskManagementCenterSupabase />} />
<Route path="/audit-log" element={<AuditLogSupabase />} />

// ADD new route
<Route path="/user-management" element={<UserManagementSupabase />} />
```

## Component Usage Examples

### CreateTaskModal
```javascript
import CreateTaskModal from '../../components/CreateTaskModal';

const [showModal, setShowModal] = useState(false);

<Button onClick={() => setShowModal(true)}>New Task</Button>

{showModal && (
  <CreateTaskModal
    onClose={() => setShowModal(false)}
    onSuccess={() => {
      setShowModal(false);
      loadTasks(); // Refresh your task list
    }}
  />
)}
```

### EditTaskModal
```javascript
import EditTaskModal from '../../components/EditTaskModal';

const [editingTask, setEditingTask] = useState(null);

<Button onClick={() => setEditingTask(taskId)}>Edit</Button>

{editingTask && (
  <EditTaskModal
    taskId={editingTask}
    onClose={() => setEditingTask(null)}
    onSave={() => {
      setEditingTask(null);
      loadTasks();
    }}
  />
)}
```

### CommentsSection
```javascript
import CommentsSection from '../../components/CommentsSection';

<CommentsSection
  taskId={selectedTask.id}
  projectId={selectedTask.project_id}
/>
```

### FileUploadComponent
```javascript
import FileUploadComponent from '../../components/FileUploadComponent';

<FileUploadComponent
  taskId={task.id}
  projectId={task.project_id}
  onUploadComplete={() => loadTasks()}
/>
```

### TimeTrackingModal
```javascript
import TimeTrackingModal from '../../components/TimeTrackingModal';

const [showTimeModal, setShowTimeModal] = useState(false);

<Button onClick={() => setShowTimeModal(taskId)}>Log Time</Button>

{showTimeModal && (
  <TimeTrackingModal
    taskId={showTimeModal}
    onClose={() => setShowTimeModal(null)}
    onSave={() => {
      setShowTimeModal(null);
      loadTasks();
    }}
  />
)}
```

### BulkOperationsBar
```javascript
import BulkOperationsBarSupabase from '../../components/ui/BulkOperationsBarSupabase';

const [selectedTasks, setSelectedTasks] = useState([]);

{selectedTasks.length > 0 && (
  <BulkOperationsBarSupabase
    selectedCount={selectedTasks.length}
    onUpdate={async (updates) => {
      // Handle bulk update
      for (const taskId of selectedTasks) {
        await supabase.from('tasks').update(updates).eq('id', taskId);
      }
      setSelectedTasks([]);
      loadTasks();
    }}
    onDelete={async () => {
      await supabase.from('tasks').delete().in('id', selectedTasks);
      setSelectedTasks([]);
      loadTasks();
    }}
    onCancel={() => setSelectedTasks([])}
  />
)}
```

### CollaborationCursors
```javascript
import CollaborationCursorsSupabase from '../../components/CollaborationCursorsSupabase';

<CollaborationCursorsSupabase projectId={currentProjectId} />
```

## Helper Function Usage

### Authentication
```javascript
import { getSession, signOut, getCurrentUserProfile } from '../../lib/supabase';

// Get current session
const session = await getSession();
if (!session) {
  // Redirect to login
}

// Get user profile
const profile = await getCurrentUserProfile();

// Logout
await signOut();
```

### Permissions
```javascript
import { canEditTask, canDeleteTask, hasProjectRole } from '../../lib/supabase';

// Check task permissions
const canEdit = await canEditTask(userId, taskId);
const canDelete = await canDeleteTask(userId, taskId);

// Check project role
const isAdmin = await hasProjectRole(userId, projectId, 'admin');
```

### Activity Logging
```javascript
import { logTaskActivity, createNotification } from '../../lib/supabase';

// Log activity
await logTaskActivity({
  taskId,
  activityType: 'updated',
  userId,
  details: { field: 'status', from: 'todo', to: 'done' }
});

// Create notification
await createNotification({
  userId: assigneeId,
  type: 'task_assigned',
  title: 'Task Assigned',
  message: `You have been assigned to: ${taskTitle}`,
  relatedTaskId: taskId,
  relatedProjectId: projectId,
});
```

### File Upload
```javascript
import { uploadTaskAttachment, getFileDownloadUrl } from '../../lib/supabase';

// Upload file
const { path } = await uploadTaskAttachment({
  projectId,
  taskId,
  file, // File object from input
  upsert: false
});

// Save metadata
await supabase.from('task_attachments').insert({
  task_id: taskId,
  file_name: file.name,
  file_path: path,
  file_size: file.size,
  file_type: file.type,
  uploaded_by: userId,
});

// Get download URL
const url = await getFileDownloadUrl(path);
```

## Real-time Subscriptions

### Subscribe to Task Changes
```javascript
useEffect(() => {
  const channel = supabase
    .channel('task-updates')
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'tasks',
    }, (payload) => {
      if (payload.eventType === 'INSERT') {
        // Add new task
      } else if (payload.eventType === 'UPDATE') {
        // Update existing task
      } else if (payload.eventType === 'DELETE') {
        // Remove task
      }
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### Subscribe to Comments
```javascript
const channel = supabase
  .channel(`comments:${taskId}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'task_comments',
    filter: `task_id=eq.${taskId}`
  }, (payload) => {
    loadComments();
  })
  .subscribe();
```

### Presence Channel
```javascript
const presenceChannel = supabase.channel(`presence:project:${projectId}`)
  .on('presence', { event: 'sync' }, () => {
    const state = presenceChannel.presenceState();
    setActiveUsers(Object.values(state).flat());
  })
  .subscribe(async (status) => {
    if (status === 'SUBSCRIBED') {
      await presenceChannel.track({
        user_id: userId,
        full_name: userName,
        online_at: new Date().toISOString(),
      });
    }
  });
```

## Quick Troubleshooting

### Issue: "Session not found"
**Solution**: User needs to log in. Redirect to `/authentication-login-portal`

### Issue: "Permission denied"
**Solution**: Check RLS policies in Supabase dashboard. User may not have access.

### Issue: "Real-time not working"
**Solution**: 
1. Check Realtime is enabled in Supabase project settings
2. Verify table has Realtime enabled
3. Check subscription filters match your data

### Issue: "File upload fails"
**Solution**:
1. Check storage bucket exists and is public
2. Verify file size < 10MB
3. Check file type is in allowed list

### Issue: "Notifications not appearing"
**Solution**:
1. Check notification was created in database
2. Verify NotificationCenter has real-time subscription
3. Check user_id matches in notification table

## Environment Variables Required

```bash
# .env file
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Database Tables Required

1. users
2. projects
3. project_members
4. tasks
5. task_tags
6. task_comments
7. task_attachments
8. task_activity
9. time_entries
10. notifications
11. user_invitations

See `db/sql/01_schema.sql` for complete schema.

---

**Quick Start**: 
1. Set up `.env` with Supabase credentials
2. Run database migrations from `db/sql/`
3. Update `Routes.jsx` with Supabase imports
4. Configure OAuth in Supabase dashboard
5. Start development server: `npm run dev`
