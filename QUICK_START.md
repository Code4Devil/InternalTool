# Quick Start Guide

## What Has Been Implemented

### ✅ Phase 1: Authentication & Authorization (COMPLETE)
- OAuth login with Google and GitHub
- Protected routes with authentication checks
- Session management with automatic timeout
- Role-based access control
- User profile integration with logout

### ✅ Phase 2: Project Management (COMPLETE)
- Full CRUD operations for projects
- Project team management (add/remove members, assign roles)
- Project filtering and search
- Role-based project permissions

### 🚧 Phase 3: Task Management (STARTED)
- Task creation modal with full features
- Tag support, priority, status, assignments
- Activity logging and notifications

## Setup Instructions

### 1. Environment Configuration

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from: Supabase Dashboard → Settings → API

### 2. Supabase Configuration

#### Enable OAuth Providers
1. Go to Authentication → Providers in Supabase Dashboard
2. Enable Google OAuth:
   - Add Client ID and Secret from Google Cloud Console
   - Add redirect URL: `http://localhost:5173/auth/callback`
3. Enable GitHub OAuth:
   - Add Client ID and Secret from GitHub Settings
   - Add redirect URL: `http://localhost:5173/auth/callback`

#### Create Storage Buckets
```sql
-- In Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('task-attachments', 'task-attachments', false),
  ('avatars', 'avatars', true);
```

#### Run Database Migrations
Execute all SQL files in `/db/sql/` folder in order:
1. `01_schema.sql` - Core database schema
2. `02_policies.sql` - Row Level Security policies
3. `03_indexes.sql` - Performance indexes
4. `04_storage.sql` - Storage bucket policies

### 3. Install Dependencies

```bash
npm install
```

Required packages (already in package.json):
- `@supabase/supabase-js`
- `react-router-dom`
- `react-dnd` (for Kanban drag & drop)

### 4. Run Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:5173`

## Testing the Implementation

### Test OAuth Authentication
1. Navigate to `http://localhost:5173`
2. Click "Continue with Google" or "Continue with GitHub"
3. Complete OAuth flow
4. Should redirect to dashboard based on role

### Test Fallback Authentication (Mock)
Use these credentials for testing without OAuth:
- **Admin:** username: `admin`, password: `Admin@123`, OTP: `123456`
- **Member:** username: `member`, password: `Member@123`, OTP: `654321`

### Test Project Management
1. After login, navigate to `/projects`
2. Click "Create Project"
3. Fill in project details and submit
4. Click "Team" button to add members
5. Click "Settings" to edit project

### Test Task Creation
1. Navigate to `/task-management-center`
2. Click "Create Task" button
3. Fill in task details
4. Select project and assign to user
5. Add tags and set priority
6. Submit to create task

## File Structure

```
src/
├── lib/
│   └── supabase.js          # Supabase client & helper functions
├── components/
│   ├── ProtectedRoute.jsx   # Auth route wrapper
│   ├── CreateTaskModal.jsx  # Task creation component
│   └── ui/
│       ├── Sidebar.jsx      # Navigation with user profile
│       └── RoleBasedNavigation.jsx  # Dynamic nav based on role
├── pages/
│   ├── auth-callback/       # OAuth callback handler
│   ├── authentication-login-portal/  # Login page with OAuth
│   ├── project-management/  # Project CRUD & team management
│   │   └── components/
│   │       ├── CreateProjectModal.jsx
│   │       ├── ProjectCard.jsx
│   │       ├── ProjectSettingsModal.jsx
│   │       └── ProjectTeamPanel.jsx
│   ├── task-management-center/  # Task management (to be fully integrated)
│   ├── interactive-kanban-board/  # Kanban board (to be integrated)
│   └── ...other pages
└── Routes.jsx               # Main routing with protection
```

## Key Features Available

### Authentication
- ✅ OAuth login (Google, GitHub)
- ✅ Session persistence
- ✅ Automatic token refresh
- ✅ Session timeout with warnings
- ✅ Secure logout
- ✅ Role-based redirects

### Authorization
- ✅ Role-based navigation
- ✅ Protected routes
- ✅ Permission checking utilities
- ✅ Project-level roles (owner, admin, manager, contributor, viewer)

### Project Management
- ✅ Create projects
- ✅ Edit project settings
- ✅ Delete projects
- ✅ Add/remove team members
- ✅ Assign member roles
- ✅ Search and filter projects
- ✅ Project status management

### Task Management (Partial)
- ✅ Create tasks with full details
- ✅ Assign to project members
- ✅ Set priority, status, due date
- ✅ Add tags
- ✅ Track estimated hours
- ✅ Automatic activity logging
- ✅ Assignee notifications
- ⏳ Edit tasks (not yet implemented)
- ⏳ Drag & drop status changes (not yet implemented)
- ⏳ Bulk operations (not yet implemented)

## Helper Functions Available

### Authentication (`src/lib/supabase.js`)
```javascript
import { 
  signInWithOAuth,
  signOut,
  getSession,
  getCurrentUserProfile,
  getUserPrimaryRole 
} from './lib/supabase';
```

### Permissions
```javascript
import { 
  hasProjectRole,
  canEditTask,
  canDeleteTask,
  canManageProject,
  canManageTeam 
} from './lib/supabase';

// Example usage
const canEdit = await canEditTask(userId, taskId);
const isManager = await hasProjectRole(userId, projectId, ['owner', 'admin', 'manager']);
```

### Activity & Notifications
```javascript
import { 
  logTaskActivity,
  logAuditEvent,
  createNotification 
} from './lib/supabase';

// Log task change
await logTaskActivity({
  taskId: task.id,
  activityType: 'status_changed',
  userId: currentUserId,
  details: { from: 'todo', to: 'in_progress' }
});

// Create notification
await createNotification({
  userId: assigneeId,
  type: 'task_assigned',
  title: 'New Assignment',
  message: `You've been assigned to: ${taskTitle}`,
  relatedTaskId: taskId
});
```

### File Management
```javascript
import { 
  uploadTaskAttachment,
  getFileDownloadUrl,
  uploadAvatar 
} from './lib/supabase';

// Upload task file
const { path } = await uploadTaskAttachment({
  projectId,
  taskId,
  file: fileObject
});

// Get download URL
const url = await getFileDownloadUrl(path);
```

## Troubleshooting

### OAuth Not Working
- Verify redirect URLs match exactly in OAuth provider settings
- Check Supabase project URL and anon key in `.env`
- Ensure OAuth providers are enabled in Supabase Dashboard

### Database Errors
- Run all migration files in `/db/sql/` folder
- Check that RLS policies are enabled
- Verify tables exist with correct schema

### Permission Denied Errors
- Ensure user is member of the project
- Check RLS policies allow the operation
- Verify user has correct role for the action

### Real-time Not Working
- Check Supabase Realtime is enabled for tables
- Verify network connection
- Check browser console for subscription errors

## Next Development Steps

See `IMPLEMENTATION_STATUS.md` for detailed remaining implementation tasks.

### Priority 1: Complete Task Management
1. Create EditTaskModal component
2. Integrate Kanban drag & drop with Supabase
3. Implement bulk operations
4. Add real-time task updates

### Priority 2: Team Collaboration
1. Comments with @mentions
2. Real-time presence tracking  
3. Notification center
4. Typing indicators

### Priority 3: Advanced Features
1. File uploads and management
2. Time tracking
3. Advanced filters
4. Audit logging
5. Dashboard analytics

## Support & Resources

- **Supabase Docs:** https://supabase.com/docs
- **React Router:** https://reactrouter.com/
- **Tailwind CSS:** https://tailwindcss.com/
- **React DnD:** https://react-dnd.github.io/react-dnd/

## Database Schema Reference

Key tables and their purposes:

- `users` - User accounts and profiles
- `projects` - Project information
- `project_members` - User-project associations with roles
- `tasks` - Task details and metadata
- `task_tags` - Task categorization
- `task_comments` - Task discussions
- `task_activity` - Change history
- `task_attachments` - File references
- `notifications` - User notifications
- `time_entries` - Time tracking
- `user_invitations` - Invite system
- `audit_logs` - System audit trail

All tables should have RLS policies defined in `02_policies.sql`.

---

**Happy Coding!** 🚀

For questions or issues, refer to `IMPLEMENTATION_STATUS.md` for detailed implementation notes.
