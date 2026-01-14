import { createClient } from '@supabase/supabase-js'

// Ensure you define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Non-fatal in build; will help catch misconfig in dev
  // eslint-disable-next-line no-console
  console.warn('[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  global: {
    headers: {
      'Accept': 'application/json',
    },
  },
})

// ========== Authentication Helpers ==========

/**
 * Sign in with OAuth provider (Google, GitHub, etc.)
 */
export async function signInWithOAuth(provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })
  if (error) throw error
  return data
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get the current user session
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession()
  if (error) throw error
  return session
}

/**
 * Get the current user profile with role information
 */
export async function getCurrentUserProfile() {
  const session = await getSession()
  if (!session) return null

  const { data, error } = await supabase
    .from('users')
    .select('*, project_members(role, project_id)')
    .eq('id', session.user.id)
    .maybeSingle()

  // maybeSingle() returns null if no rows found, which is fine
  if (error) throw error
  return data
}

/**
 * Create or update user profile on first login
 */
export async function upsertUserProfile(userId, profileData) {
  const { data, error } = await supabase
    .from('users')
    .upsert({
      id: userId,
      full_name: profileData.full_name,
      avatar_url: profileData.avatar_url,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'id'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get user's primary role (highest permission level across all projects)
 */
export async function getUserPrimaryRole(userId) {
  const { data, error } = await supabase
    .from('project_members')
    .select('role')
    .eq('user_id', userId)
    .order('role', { ascending: true })

  if (error) throw error
  
  if (!data || data.length === 0) return 'member'
  
  // Role hierarchy: owner > admin > manager > contributor > viewer
  const roleHierarchy = ['owner', 'admin', 'manager', 'contributor', 'viewer']
  const roles = data.map(m => m.role)
  
  for (const role of roleHierarchy) {
    if (roles.includes(role)) return role
  }
  
  return 'member'
}

// ========== Permission Helpers ==========

/**
 * Check if user has a specific role in a project
 */
export async function hasProjectRole(userId, projectId, requiredRoles) {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles]
  
  const { data, error } = await supabase
    .from('project_members')
    .select('role')
    .eq('user_id', userId)
    .eq('project_id', projectId)
    .single()

  if (error || !data) return false
  return roles.includes(data.role)
}

/**
 * Check if user can edit a task
 */
export async function canEditTask(userId, taskId) {
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('project_id, creator_id, assignee_id')
    .eq('id', taskId)
    .single()

  if (taskError || !task) return false

  // Creator and assignee can always edit
  if (task.creator_id === userId || task.assignee_id === userId) return true

  // Check project role
  return await hasProjectRole(userId, task.project_id, ['owner', 'admin', 'manager'])
}

/**
 * Check if user can delete a task
 */
export async function canDeleteTask(userId, taskId) {
  const { data: task, error: taskError } = await supabase
    .from('tasks')
    .select('project_id, creator_id')
    .eq('id', taskId)
    .single()

  if (taskError || !task) return false

  // Creator can delete or project admin/owner
  if (task.creator_id === userId) return true
  return await hasProjectRole(userId, task.project_id, ['owner', 'admin'])
}

/**
 * Check if user can manage project settings
 */
export async function canManageProject(userId, projectId) {
  return await hasProjectRole(userId, projectId, ['owner', 'admin', 'manager'])
}

/**
 * Check if user can manage team members
 */
export async function canManageTeam(userId, projectId) {
  return await hasProjectRole(userId, projectId, ['owner', 'admin'])
}

// ========== Session Management ==========

let lastActivityTime = Date.now()
let sessionCheckInterval = null
let sessionWarningCallback = null

/**
 * Update last activity timestamp
 */
export function updateLastActivity() {
  lastActivityTime = Date.now()
}

/**
 * Start session timeout monitoring
 */
export function startSessionMonitoring(timeoutMinutes = 30, warningMinutes = 5, onWarning, onTimeout) {
  sessionWarningCallback = onWarning
  
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval)
  }

  sessionCheckInterval = setInterval(() => {
    const now = Date.now()
    const timeSinceActivity = (now - lastActivityTime) / 1000 / 60 // minutes
    
    if (timeSinceActivity >= timeoutMinutes) {
      if (onTimeout) onTimeout()
      stopSessionMonitoring()
    } else if (timeSinceActivity >= (timeoutMinutes - warningMinutes)) {
      if (onWarning) onWarning(timeoutMinutes - timeSinceActivity)
    }
  }, 30000) // Check every 30 seconds
}

/**
 * Stop session timeout monitoring
 */
export function stopSessionMonitoring() {
  if (sessionCheckInterval) {
    clearInterval(sessionCheckInterval)
    sessionCheckInterval = null
  }
}

// ========== Storage Helpers ==========

export function storagePathForTaskAttachment({ projectId, taskId, fileName }) {
  if (!projectId || !taskId || !fileName) throw new Error('projectId, taskId, and fileName are required')
  return `projects/${projectId}/tasks/${taskId}/${fileName}`
}

export async function uploadTaskAttachment({ projectId, taskId, file, upsert = false }) {
  const path = storagePathForTaskAttachment({ projectId, taskId, fileName: file.name })
  const { data, error } = await supabase.storage.from('task-attachments').upload(path, file, { upsert })
  if (error) throw error
  return { path, data }
}

/**
 * Get signed URL for file download
 */
export async function getFileDownloadUrl(path, expiresIn = 3600) {
  const { data, error } = await supabase.storage
    .from('task-attachments')
    .createSignedUrl(path, expiresIn)
  
  if (error) throw error
  return data.signedUrl
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(userId, file) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}-${Date.now()}.${fileExt}`
  const filePath = `avatars/${fileName}`

  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath)

  return publicUrl
}

// ========== Activity Logging ==========

/**
 * Log activity to task_activity table
 */
export async function logTaskActivity({ taskId, activityType, userId, details }) {
  const { data, error } = await supabase
    .from('task_activity')
    .insert({
      task_id: taskId,
      activity_type: activityType,
      user_id: userId,
      details: details,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Log general audit event
 */
export async function logAuditEvent({ userId, action, resourceType, resourceId, details, ipAddress, deviceInfo }) {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert({
      user_id: userId,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      details,
      ip_address: ipAddress,
      device_info: deviceInfo,
      created_at: new Date().toISOString(),
    })

  if (error) throw error
  return data
}

// ========== Notification Helpers ==========

/**
 * Create notification for a user
 */
export async function createNotification({ userId, type, title, message, relatedTaskId, relatedProjectId }) {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      type,
      title,
      message,
      related_task_id: relatedTaskId,
      related_project_id: relatedProjectId,
      is_read: false,
      created_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error
  return data
}
