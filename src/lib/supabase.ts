// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── TYPE DEFINITIONS ──────────────────────────────────────────────────────────

export type Profile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  color: string
}

export type Workspace = {
  id: string
  name: string
  owner_id: string
  slug: string | null
  created_at: string
}

export type Project = {
  id: string
  workspace_id: string
  name: string
  description: string | null
  color: string
  icon: string
  created_by: string
  created_at: string
}

export type Sprint = {
  id: string
  project_id: string
  name: string
  start_date: string | null
  end_date: string | null
  status: 'planned' | 'active' | 'completed'
}

export type Label = {
  id: string
  project_id: string
  name: string
  color: string
}

export type Task = {
  id: string
  project_id: string
  sprint_id: string | null
  title: string
  description: string | null
  status: 'Backlog' | 'Todo' | 'In Progress' | 'In Review' | 'Done'
  priority: 'critical' | 'high' | 'medium' | 'low'
  assignee_id: string | null
  created_by: string | null
  due_date: string | null
  position: number
  created_at: string
  updated_at: string
  // joined fields
  assignee?: Profile
  labels?: Label[]
  comments?: Comment[]
  activity?: ActivityLog[]
}

export type Comment = {
  id: string
  task_id: string
  user_id: string
  content: string
  created_at: string
  profile?: Profile
}

export type ActivityLog = {
  id: string
  task_id: string
  user_id: string | null
  action: string
  created_at: string
}

export type Notification = {
  id: string
  user_id: string
  title: string
  body: string | null
  read: boolean
  created_at: string
}

// ── DATA FETCHING HELPERS ─────────────────────────────────────────────────────

export async function getWorkspace(userId: string) {
  const { data, error } = await supabase
    .from('workspace_members')
    .select('workspace:workspaces(*)')
    .eq('user_id', userId)
    .limit(1)
    .single()
  if (error) throw error
  return data?.workspace as unknown as Workspace
}

export async function getProjects(workspaceId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as Project[]
}

export async function getTasks(projectId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select(`
      *,
      assignee:profiles!tasks_assignee_id_fkey(*),
      task_labels(label:labels(*))
    `)
    .eq('project_id', projectId)
    .order('position', { ascending: true })
  if (error) throw error
  // flatten labels
  return (data || []).map((t: any) => ({
    ...t,
    labels: t.task_labels?.map((tl: any) => tl.label) || [],
    task_labels: undefined,
  })) as Task[]
}

export async function createTask(task: Partial<Task> & { project_id: string; title: string }) {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single()
  if (error) throw error

  // log activity
  await supabase.from('activity_log').insert({
    task_id: data.id,
    user_id: task.created_by,
    action: 'Task created',
  })

  return data as Task
}

export async function updateTask(taskId: string, updates: Partial<Task>, userId?: string) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId)
    .select()
    .single()
  if (error) throw error

  // log status change
  if (updates.status && userId) {
    await supabase.from('activity_log').insert({
      task_id: taskId,
      user_id: userId,
      action: `Status changed to ${updates.status}`,
    })
  }

  return data as Task
}

export async function deleteTask(taskId: string) {
  const { error } = await supabase.from('tasks').delete().eq('id', taskId)
  if (error) throw error
}

export async function addComment(taskId: string, userId: string, content: string) {
  const { data, error } = await supabase
    .from('comments')
    .insert({ task_id: taskId, user_id: userId, content })
    .select(`*, profile:profiles(*)`)
    .single()
  if (error) throw error

  await supabase.from('activity_log').insert({
    task_id: taskId,
    user_id: userId,
    action: 'Comment added',
  })

  return data as Comment
}

export async function getComments(taskId: string) {
  const { data, error } = await supabase
    .from('comments')
    .select('*, profile:profiles(*)')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as Comment[]
}

export async function getActivityLog(taskId: string) {
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as ActivityLog[]
}

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)
  if (error) throw error
  return data as Notification[]
}

export async function markNotificationsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
  if (error) throw error
}

export async function getWorkspaceMembers(workspaceId: string) {
  const { data, error } = await supabase
    .from('workspace_members')
    .select('*, profile:profiles(*)')
    .eq('workspace_id', workspaceId)
  if (error) throw error
  return data
}

export async function createProject(project: Partial<Project> & { workspace_id: string; name: string }) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()
  if (error) throw error
  return data as Project
}

export async function createWorkspace(name: string, userId: string) {
  const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).slice(2, 6)
  const { data: ws, error: wsError } = await supabase
    .from('workspaces')
    .insert({ name, owner_id: userId, slug })
    .select()
    .single()
  if (wsError) throw wsError

  // add creator as admin
  const { error: memberError } = await supabase
    .from('workspace_members')
    .insert({ workspace_id: ws.id, user_id: userId, role: 'admin' })
  if (memberError) throw memberError

  return ws as Workspace
}