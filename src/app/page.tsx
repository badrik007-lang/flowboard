"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import type { CSSProperties, DragEvent, KeyboardEvent, MouseEvent, SVGProps } from "react";

// ─── ICONS ───────────────────────────────────────────────────────────────────
type IconProps = {
  d: string;
  size?: number;
  className?: string;
} & Omit<SVGProps<SVGSVGElement>, "width" | "height">;

const Icon = ({ d, size = 16, className = "", ...rest }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...rest}>
    <path d={d} />
  </svg>
);
const Icons = {
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  plus: "M12 5v14M5 12h14",
  x: "M18 6L6 18M6 6l12 12",
  chevronDown: "M6 9l6 6 6-6",
  chevronRight: "M9 18l6-6-6-6",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
  settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
  user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
  flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7",
  clock: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6l4 2",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82zM7 7h.01",
  message: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",
  folder: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
  zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  check: "M20 6L9 17l-5-5",
  arrowUp: "M12 19V5M5 12l7-7 7 7",
  arrowDown: "M12 5v14M19 12l-7 7-7-7",
  layers: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  home: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  sprint: "M5 3l14 9-14 9V3z",
  roadmap: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
type Status = (typeof STATUSES)[number];

const PRIORITIES = {
  critical: { label: "Critical", color: "#ef4444", bg: "#ef444420" },
  high: { label: "High", color: "#f97316", bg: "#f9731620" },
  medium: { label: "Medium", color: "#eab308", bg: "#eab30820" },
  low: { label: "Low", color: "#6b7280", bg: "#6b728020" },
} as const;

type Priority = keyof typeof PRIORITIES;

const STATUSES = ["Backlog", "Todo", "In Progress", "In Review", "Done"] as const;

const STATUS_COLORS = {
  Backlog: "#6b7280",
  Todo: "#3b82f6",
  "In Progress": "#8b5cf6",
  "In Review": "#f59e0b",
  Done: "#10b981",
} as const satisfies Record<Status, string>;

type Member = { id: string; name: string; initials: string; color: string };
type Label = { id: string; name: string; color: string };
type Project = { id: string; name: string; color: string; description: string; icon: string };
type TaskComment = { id: string; userId: Member["id"]; text: string; time: string };
type Task = {
  id: string;
  projectId: Project["id"];
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: Member["id"] | "";
  dueDate: string;
  labels: Label["id"][];
  comments: TaskComment[];
  activity: string[];
  createdAt: string;
};
type Notification = { id: string; text: string; time: string; read: boolean };
type DragState = { taskId: Task["id"]; fromStatus: Status };

type ViewKey = "board" | "list" | "roadmap" | "sprints";
type NavKey = "projects" | "dashboard" | "settings";
type CreateTaskInput = Omit<Task, "id" | "projectId" | "comments" | "activity" | "createdAt">;

const MEMBERS = [
  { id: "u1", name: "Badri Koushik", initials: "BK", color: "#6366f1" },
  { id: "u2", name: "Priya R", initials: "PR", color: "#ec4899" },
  { id: "u3", name: "Karthik M", initials: "KM", color: "#10b981" },
  { id: "u4", name: "Divya S", initials: "DS", color: "#f59e0b" },
] satisfies Member[];

const LABELS = [
  { id: "l1", name: "Bug", color: "#ef4444" },
  { id: "l2", name: "Feature", color: "#6366f1" },
  { id: "l3", name: "Design", color: "#ec4899" },
  { id: "l4", name: "Backend", color: "#10b981" },
  { id: "l5", name: "Frontend", color: "#3b82f6" },
  { id: "l6", name: "Urgent", color: "#f97316" },
] satisfies Label[];

const initProjects = [
  { id: "22222222-2222-2222-2222-222222222222", name: "VulnRadar", color: "#6366f1", description: "Cybersecurity vulnerability management", icon: "🛡️" },
  { id: "33333333-3333-3333-3333-333333333333", name: "Auditra", color: "#10b981", description: "GRC audit management tool", icon: "📋" },
  { id: "44444444-4444-4444-4444-444444444444", name: "Sentra", color: "#f59e0b", description: "Security posture management", icon: "🔒" },
];

const initTasks = [
  { id: "t1", projectId: "p1", title: "Design vulnerability dashboard", description: "Create the main dashboard showing all active vulnerabilities with severity breakdown and trend charts.", status: "Done", priority: "high", assignee: "u1", dueDate: "2025-05-10", labels: ["l3", "l5"], comments: [{ id: "c1", userId: "u2", text: "Looks great, approved!", time: "2 days ago" }], activity: ["Created by Badri Koushik · 5 days ago", "Status changed to Done · 2 days ago"], createdAt: "2025-05-01" },
  { id: "t2", projectId: "p1", title: "Implement CVE scoring API", description: "Integrate NVD API for real-time CVE scores and automate severity classification.", status: "In Progress", priority: "critical", assignee: "u3", dueDate: "2025-05-15", labels: ["l4", "l6"], comments: [], activity: ["Created by Badri Koushik · 4 days ago", "Assigned to Karthik M · 3 days ago"], createdAt: "2025-05-02" },
  { id: "t3", projectId: "p1", title: "User authentication flow", description: "Set up Supabase auth with email/password and magic link.", status: "Done", priority: "high", assignee: "u3", dueDate: "2025-05-08", labels: ["l4"], comments: [], activity: ["Created by Karthik M · 6 days ago"], createdAt: "2025-04-30" },
  { id: "t4", projectId: "p1", title: "Export reports to PDF", description: "Allow users to export vulnerability reports as PDF with branding.", status: "Todo", priority: "medium", assignee: "u1", dueDate: "2025-05-20", labels: ["l2", "l5"], comments: [], activity: ["Created by Badri Koushik · 2 days ago"], createdAt: "2025-05-04" },
  { id: "t5", projectId: "p1", title: "Fix pagination bug on asset list", description: "Page 2 onwards shows duplicate entries. Needs query fix.", status: "In Review", priority: "high", assignee: "u2", dueDate: "2025-05-12", labels: ["l1"], comments: [{ id: "c2", userId: "u3", text: "Reproduced the bug. It's in the offset logic.", time: "1 day ago" }], activity: ["Created by Priya R · 3 days ago", "Moved to In Review · 1 day ago"], createdAt: "2025-05-03" },
  { id: "t6", projectId: "p1", title: "Onboarding walkthrough", description: "Create first-time user onboarding with guided tooltips.", status: "Backlog", priority: "low", assignee: "u4", dueDate: "2025-06-01", labels: ["l2", "l3"], comments: [], activity: ["Created by Divya S · 1 day ago"], createdAt: "2025-05-05" },
  { id: "t7", projectId: "p2", title: "Node-based audit module", description: "Build the single-page node graph audit flow with drag connections.", status: "In Progress", priority: "critical", assignee: "u1", dueDate: "2025-05-18", labels: ["l2", "l3", "l5"], comments: [{ id: "c3", userId: "u2", text: "Internal auditors loved the demo!", time: "3 days ago" }], activity: ["Created by Badri Koushik · 7 days ago"], createdAt: "2025-04-28" },
  { id: "t8", projectId: "p2", title: "Monochrome design system", description: "Document and implement the full monochrome component library.", status: "Done", priority: "high", assignee: "u1", dueDate: "2025-05-05", labels: ["l3"], comments: [], activity: ["Created by Badri Koushik · 10 days ago", "Status changed to Done · 4 days ago"], createdAt: "2025-04-25" },
  { id: "t9", projectId: "p3", title: "Risk scoring engine", description: "Build automated risk scoring based on asset exposure and threat intelligence.", status: "Todo", priority: "critical", assignee: "u3", dueDate: "2025-05-25", labels: ["l4", "l2"], comments: [], activity: ["Created by Karthik M · 2 days ago"], createdAt: "2025-05-04" },
] satisfies Task[];

// ─── UTILS ───────────────────────────────────────────────────────────────────
const getMember = (id: Member["id"] | "") => MEMBERS.find((m) => m.id === id);
const getLabel = (id: Label["id"]) => LABELS.find((l) => l.id === id);
const uid = () => Math.random().toString(36).slice(2, 9);
const formatDate = (d: string | null | undefined) => {
  if (!d) return null;
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};
const isOverdue = (d: string | null | undefined) => Boolean(d && new Date(d) < new Date());

// ─── AVATAR ──────────────────────────────────────────────────────────────────
const Avatar = ({ userId, size = 24 }: { userId: Member["id"] | ""; size?: number }) => {
  const m = getMember(userId);
  if (!m) return null;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.38, fontWeight: 700, color: "#fff", flexShrink: 0, fontFamily: "inherit" }}>
      {m.initials}
    </div>
  );
};

// ─── PRIORITY BADGE ───────────────────────────────────────────────────────────
const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const p = PRIORITIES[priority];
  if (!p) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 7px", borderRadius: 4, background: p.bg, color: p.color, fontSize: 11, fontWeight: 600, letterSpacing: "0.03em" }}>
      <Icon d={Icons.flag} size={10} />
      {p.label}
    </span>
  );
};

// ─── STATUS DOT ──────────────────────────────────────────────────────────────
const StatusDot = ({ status, size = 8 }: { status: Status; size?: number }) => (
  <div style={{ width: size, height: size, borderRadius: "50%", background: STATUS_COLORS[status] || "#6b7280", flexShrink: 0 }} />
);

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function FlowBoard() {
  const [currentUser, setCurrentUser] = useState({
    id: '',
    name: 'Loading...',
    email: '',
    initials: '...',
    color: '#6366f1'
  })
  const [projects, setProjects] = useState<Project[]>(initProjects);
  const [tasks, setTasks] = useState<Task[]>(initTasks);
  const [activeProject, setActiveProject] = useState<Project["id"]>("22222222-2222-2222-2222-222222222222");
  const [view, setView] = useState<ViewKey>("board"); // board | list | roadmap | sprints
  const [selectedTask, setSelectedTask] = useState<Task["id"] | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<Status>("Todo");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<"all" | Priority>("all");
  const [filterAssignee, setFilterAssignee] = useState<"all" | Member["id"]>("all");
  const [activeNav, setActiveNav] = useState<NavKey>("projects"); // projects | dashboard | settings
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState([
    { id: "n1", text: "Priya moved 'Fix pagination bug' to In Review", time: "1h ago", read: false },
    { id: "n2", text: "Karthik commented on 'CVE scoring API'", time: "3h ago", read: false },
    { id: "n3", text: "New member Divya S joined the workspace", time: "1d ago", read: true },
  ] satisfies Notification[]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);

  useEffect(() => {
    import('@/lib/supabase').then(({ supabase }) => {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user) window.location.href = '/auth'
        else setCurrentUser({
          id: user.id,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          initials: (user.user_metadata?.full_name || user.email || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2),
          color: '#6366f1'
        })
      })
    })
  }, [])

  useEffect(() => {
    if (!activeProject) return
    import('@/lib/supabase').then(({ supabase }) => {
      supabase
        .from('tasks')
        .select('*')
        .eq('project_id', activeProject, currentUser])
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data && data.length > 0) {
            setTasks(prev => {
              const realIds = data.map((t: any) => t.id)
              const mockTasks = prev.filter(t => !realIds.includes(t.id) && t.projectId !== activeProject)
              const realTasks = data.map((t: any) => ({
                id: t.id,
                projectId: t.project_id,
                title: t.title,
                description: t.description,
                status: t.status,
                priority: t.priority,
                assignee: t.assignee_id,
                dueDate: t.due_date,
                labels: [],
                comments: [],
                activity: [],
                createdAt: t.created_at,
              }))
              return [...mockTasks, ...realTasks]
            })
          }
        })
    })
  }, [activeProject])

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase')
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  const projectTasks = tasks.filter((t) => t.projectId === activeProject);
  const filteredTasks = projectTasks.filter((t) => {
    const matchSearch = !searchQuery || t.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPriority = filterPriority === "all" || t.priority === filterPriority;
    const matchAssignee = filterAssignee === "all" || t.assignee === filterAssignee;
    return matchSearch && matchPriority && matchAssignee;
  });

  const currentProject = projects.find((p) => p.id === activeProject);

  const updateTask = useCallback((taskId: Task["id"], updates: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => t.id === taskId ? { ...t, ...updates } : t));
  }, []);

  const createTask = useCallback(async (taskData: any) => {
    const { supabase } = await import('@/lib/supabase')
    
    // Save to Supabase
    const { data, error } = await supabase.from('tasks').insert({
      title: taskData.title,
      description: taskData.description || null,
      status: taskData.status,
      priority: taskData.priority,
      assignee_id: taskData.assignee || null,
      due_date: taskData.dueDate || null,
      project_id: activeProject,
      created_by: currentUser?.id || null,
    }).select().single()
  
    if (error) {
      // Fallback to local if Supabase fails
      const newTask = { id: uid(), projectId: activeProject, comments: [], activity: [`Created · just now`], createdAt: new Date().toISOString().split("T")[0], ...taskData }
      setTasks(prev => [...prev, newTask])
      return
    }
  
    // Add locally with Supabase id
    const newTask = {
      id: data.id,
      projectId: data.project_id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignee: data.assignee_id,
      dueDate: data.due_date,
      labels: taskData.labels || [],
      comments: [],
      activity: [`Created · just now`],
      createdAt: data.created_at,
    }
    setTasks(prev => [...prev, newTask])
  
    // Notify assignee
    if (data.assignee_id && data.assignee_id !== currentUser?.id) {
      await supabase.from('notifications').insert({
        user_id: data.assignee_id,
        title: 'New task assigned to you',
        body: data.title,
      })
    }
  }, [activeProject, currentUser])

  const deleteTask = useCallback((taskId: Task["id"]) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setSelectedTask(null);
  }, []);

  // Drag handlers
  const handleDragStart = (taskId: Task["id"], fromStatus: Status) => setDragState({ taskId, fromStatus });
  const handleDragOver = (e: DragEvent<HTMLElement>) => e.preventDefault();
  const handleDrop = (toStatus: Status) => {
    if (!dragState) return;
    const { taskId, fromStatus } = dragState;
    if (fromStatus !== toStatus) {
      updateTask(taskId, { status: toStatus, activity: [...(tasks.find(t => t.id === taskId)?.activity || []), `Status changed to ${toStatus} · just now`] });
    }
    setDragState(null);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0a0a0f", color: "#e2e8f0", fontFamily: "'DM Sans', 'Segoe UI', sans-serif", overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2a3a; border-radius: 4px; }
        input, textarea, select { font-family: inherit; }
        .task-card { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .task-card:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,0,0,0.4) !important; }
        .nav-item { transition: background 0.1s ease, color 0.1s ease; }
        .nav-item:hover { background: #16162a !important; }
        .btn-primary { transition: opacity 0.15s ease, transform 0.1s ease; }
        .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
        .column-drop-active { background: #1a1a2e !important; border-color: #6366f1 !important; }
        .fade-in { animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .slide-in { animation: slideIn 0.25s ease; }
        @keyframes slideIn { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
        .stagger-1 { animation-delay: 0.05s; animation-fill-mode: both; }
        .stagger-2 { animation-delay: 0.1s; animation-fill-mode: both; }
        .stagger-3 { animation-delay: 0.15s; animation-fill-mode: both; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: sidebarCollapsed ? 56 : 220, background: "#08080e", borderRight: "1px solid #1a1a2a", display: "flex", flexDirection: "column", flexShrink: 0, transition: "width 0.2s ease", overflow: "hidden" }}>
        {/* Logo */}
        <div style={{ padding: "16px 12px", borderBottom: "1px solid #1a1a2a", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon d={Icons.layers} size={16} className="" style={{ color: "#fff" }} />
          </div>
          {!sidebarCollapsed && <span style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9", letterSpacing: "-0.02em" }}>FlowBoard</span>}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#4b5563", cursor: "pointer", padding: 4, flexShrink: 0 }}>
            <Icon d={sidebarCollapsed ? Icons.chevronRight : "M15 18l-6-6 6-6"} size={14} />
          </button>
        </div>

        {/* Nav */}
        <nav style={{ padding: "8px 6px", borderBottom: "1px solid #1a1a2a" }}>
          {([
            { key: "dashboard", icon: Icons.home, label: "Dashboard" },
            { key: "projects", icon: Icons.folder, label: "Projects" },
          ] as const).map(({ key, icon, label }) => (
            <button key={key} className="nav-item" onClick={() => setActiveNav(key)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, background: activeNav === key ? "#16162a" : "transparent", border: "none", color: activeNav === key ? "#6366f1" : "#6b7280", cursor: "pointer", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap" }}>
              <Icon d={icon} size={15} />
              {!sidebarCollapsed && label}
            </button>
          ))}
        </nav>

        {/* Projects */}
        {!sidebarCollapsed && (
          <div style={{ flex: 1, overflow: "auto", padding: "8px 6px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 8px 8px", color: "#4b5563", fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              <span>Projects</span>
              <button onClick={() => setShowNewProject(true)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", padding: 2 }}>
                <Icon d={Icons.plus} size={13} />
              </button>
            </div>
            {projects.map((p) => (
              <button key={p.id} className="nav-item" onClick={() => { setActiveProject(p.id); setActiveNav("projects"); }} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "7px 8px", borderRadius: 6, background: activeProject === p.id && activeNav === "projects" ? "#16162a" : "transparent", border: "none", color: activeProject === p.id && activeNav === "projects" ? "#e2e8f0" : "#6b7280", cursor: "pointer", fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", textAlign: "left" }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, background: p.color + "30", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>{p.icon}</div>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#374151", background: "#1a1a2a", padding: "1px 6px", borderRadius: 10 }}>
                {tasks.filter((t) => t.projectId === p.id).length}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Bottom user */}
        <div style={{ padding: "10px 12px", borderTop: "1px solid #1a1a2a", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: currentUser.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 * 0.38, fontWeight: 700, color: "#fff", flexShrink: 0, fontFamily: "inherit" }}>
            {currentUser.initials}
          </div>
          {!sidebarCollapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser.name}</div>
                <div style={{ fontSize: 10, color: "#4b5563", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser.email}</div>
              </div>
              <button onClick={handleLogout} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", padding: 2 }}>
                <Icon d={Icons.logout} size={14} />
              </button>
            </>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <header style={{ height: 52, borderBottom: "1px solid #1a1a2a", display: "flex", alignItems: "center", padding: "0 20px", gap: 12, background: "#08080e", flexShrink: 0 }}>
          {activeNav === "projects" && currentProject && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 4 }}>
                <span style={{ fontSize: 18 }}>{currentProject.icon}</span>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9", letterSpacing: "-0.02em" }}>{currentProject.name}</span>
              </div>
              {/* View toggle */}
              <div style={{ display: "flex", background: "#111118", borderRadius: 6, padding: 2, border: "1px solid #1e1e2e", gap: 1 }}>
                {([
                  { key: "board", icon: Icons.grid, label: "Board" },
                  { key: "list", icon: Icons.list, label: "List" },
                  { key: "sprints", icon: Icons.sprint, label: "Sprints" },
                  { key: "roadmap", icon: Icons.roadmap, label: "Roadmap" },
                ] as const).map(({ key, icon, label }) => (
                  <button key={key} onClick={() => setView(key)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 5, background: view === key ? "#1e1e2e" : "transparent", border: "none", color: view === key ? "#e2e8f0" : "#4b5563", cursor: "pointer", fontSize: 12, fontWeight: 500 }}>
                    <Icon d={icon} size={12} />
                    {label}
                  </button>
                ))}
              </div>
              {/* Search */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#111118", border: "1px solid #1e1e2e", borderRadius: 6, padding: "4px 10px", flex: 1, maxWidth: 240 }}>
                <Icon d={Icons.search} size={13} style={{ color: "#4b5563" }} />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search tasks…" style={{ background: "none", border: "none", outline: "none", color: "#e2e8f0", fontSize: 12, width: "100%" }} />
              </div>
              {/* Filters */}
              <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value as "all" | Priority)} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 6, padding: "4px 8px", color: filterPriority !== "all" ? "#6366f1" : "#6b7280", fontSize: 12, cursor: "pointer", outline: "none" }}>
                <option value="all">Priority</option>
                {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value as "all" | Member["id"])} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 6, padding: "4px 8px", color: filterAssignee !== "all" ? "#6366f1" : "#6b7280", fontSize: 12, cursor: "pointer", outline: "none" }}>
                <option value="all">Assignee</option>
                {MEMBERS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </>
          )}
          {activeNav === "dashboard" && <span style={{ fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>Dashboard</span>}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            {activeNav === "projects" && (
              <button className="btn-primary" onClick={() => { setNewTaskStatus("Todo"); setShowNewTask(true); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#6366f1", border: "none", borderRadius: 6, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                <Icon d={Icons.plus} size={13} />
                New Task
              </button>
            )}
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowNotifications(!showNotifications)} style={{ position: "relative", background: "none", border: "1px solid #1e1e2e", borderRadius: 6, padding: "5px 8px", color: "#6b7280", cursor: "pointer" }}>
                <Icon d={Icons.bell} size={15} />
                {unreadCount > 0 && <span style={{ position: "absolute", top: 3, right: 3, width: 6, height: 6, background: "#ef4444", borderRadius: "50%", border: "1px solid #08080e" }} />}
              </button>
              {showNotifications && (
                <div className="fade-in" style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", width: 280, background: "#111118", border: "1px solid #1e1e2e", borderRadius: 10, overflow: "hidden", zIndex: 100, boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}>
                  <div style={{ padding: "10px 14px", borderBottom: "1px solid #1e1e2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>Notifications</span>
                    <span style={{ fontSize: 10, color: "#6366f1", cursor: "pointer" }}>Mark all read</span>
                  </div>
                  {notifications.map((n) => (
                    <div key={n.id} style={{ padding: "10px 14px", borderBottom: "1px solid #1a1a2a", display: "flex", gap: 8, alignItems: "flex-start", background: n.read ? "transparent" : "#16162a" }}>
                      {!n.read && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", marginTop: 5, flexShrink: 0 }} />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: "#e2e8f0", lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: 10, color: "#4b5563", marginTop: 3 }}>{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", position: "relative" }}>
          {activeNav === "dashboard" ? (
            <DashboardView tasks={tasks} projects={projects} members={MEMBERS} onTaskClick={setSelectedTask} />
          ) : view === "board" ? (
            <BoardView tasks={filteredTasks} onTaskClick={setSelectedTask} onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} dragState={dragState} onAddTask={(status) => { setNewTaskStatus(status); setShowNewTask(true); }} />
          ) : view === "list" ? (
            <ListView tasks={filteredTasks} onTaskClick={setSelectedTask} />
          ) : view === "sprints" ? (
            <SprintsView tasks={filteredTasks} onTaskClick={setSelectedTask} />
          ) : (
            <RoadmapView tasks={filteredTasks} onTaskClick={setSelectedTask} />
          )}
        </div>
      </main>

      {/* ── TASK DETAIL PANEL ── */}
      {selectedTask && (
        <TaskDetailPanel task={tasks.find((t) => t.id === selectedTask)} onClose={() => setSelectedTask(null)} onUpdate={updateTask} onDelete={deleteTask} members={MEMBERS} labels={LABELS} />
      )}

      {/* ── NEW TASK MODAL ── */}
      {showNewTask && (
        <NewTaskModal initialStatus={newTaskStatus} onClose={() => setShowNewTask(false)} onCreate={createTask} members={MEMBERS} labels={LABELS} />
      )}

      {/* ── NEW PROJECT MODAL ── */}
      {showNewProject && (
        <NewProjectModal onClose={() => setShowNewProject(false)} onCreate={(p) => { setProjects(prev => [...prev, { id: uid(), ...p }]); setShowNewProject(false); }} />
      )}
    </div>
  );
}

// ─── BOARD VIEW ──────────────────────────────────────────────────────────────
function BoardView({
  tasks,
  onTaskClick,
  onDragStart,
  onDragOver,
  onDrop,
  dragState,
  onAddTask,
}: {
  tasks: Task[];
  onTaskClick: (taskId: Task["id"]) => void;
  onDragStart: (taskId: Task["id"], fromStatus: Status) => void;
  onDragOver: (e: DragEvent<HTMLElement>) => void;
  onDrop: (toStatus: Status) => void;
  dragState: DragState | null;
  onAddTask: (status: Status) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 12, padding: 20, height: "100%", overflow: "auto", alignItems: "flex-start" }}>
      {STATUSES.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        const isDragOver = dragState && dragState.fromStatus !== status;
        return (
          <div key={status} onDragOver={onDragOver} onDrop={() => onDrop(status)} style={{ width: 272, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0 }}>
            {/* Column header */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 4px 10px", marginBottom: 2 }}>
              <StatusDot status={status} size={8} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", letterSpacing: "0.02em" }}>{status}</span>
              <span style={{ marginLeft: 2, fontSize: 11, color: "#374151", background: "#1a1a2a", padding: "1px 6px", borderRadius: 10 }}>{columnTasks.length}</span>
              <button onClick={() => onAddTask(status)} style={{ marginLeft: "auto", background: "none", border: "none", color: "#374151", cursor: "pointer", padding: 2, display: "flex" }}>
                <Icon d={Icons.plus} size={14} />
              </button>
            </div>
            {/* Column body */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, minHeight: 80, padding: "4px 0", borderRadius: 8, transition: "background 0.15s, border 0.15s", border: "2px dashed transparent" }} className={isDragOver ? "column-drop-active" : ""}>
              {columnTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task.id)} onDragStart={() => onDragStart(task.id, task.status)} />
              ))}
              {columnTasks.length === 0 && (
                <div style={{ padding: "16px 8px", textAlign: "center", color: "#2a2a3a", fontSize: 12 }}>Drop tasks here</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── TASK CARD ───────────────────────────────────────────────────────────────
function TaskCard({ task, onClick, onDragStart }: { task: Task; onClick: () => void; onDragStart: (e: DragEvent<HTMLDivElement>) => void }) {
  const overdue = isOverdue(task.dueDate) && task.status !== "Done";
  return (
    <div className="task-card fade-in" draggable onDragStart={onDragStart} onClick={onClick} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "12px", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
      {/* Labels */}
      {task.labels?.length > 0 && (
        <div style={{ display: "flex", gap: 4, marginBottom: 8, flexWrap: "wrap" }}>
          {task.labels.slice(0, 3).map((lid) => {
            const l = getLabel(lid);
            return l ? <span key={lid} style={{ padding: "2px 6px", borderRadius: 4, background: l.color + "25", color: l.color, fontSize: 10, fontWeight: 600 }}>{l.name}</span> : null;
          })}
        </div>
      )}
      <div style={{ fontSize: 13, fontWeight: 500, color: "#e2e8f0", lineHeight: 1.4, marginBottom: 10 }}>{task.title}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: overdue ? "#ef4444" : "#6b7280" }}>
            <Icon d={Icons.clock} size={10} />
            {formatDate(task.dueDate)}
          </span>
        )}
        {task.comments?.length > 0 && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 11, color: "#6b7280" }}>
            <Icon d={Icons.message} size={10} />
            {task.comments.length}
          </span>
        )}
        {task.assignee && <div style={{ marginLeft: "auto" }}><Avatar userId={task.assignee} size={20} /></div>}
      </div>
    </div>
  );
}

// ─── LIST VIEW ───────────────────────────────────────────────────────────────
function ListView({ tasks, onTaskClick }: { tasks: Task[]; onTaskClick: (taskId: Task["id"]) => void }) {
  return (
    <div style={{ padding: 20 }}>
      <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 10, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #1e1e2e" }}>
              {["Task", "Status", "Priority", "Assignee", "Due Date", "Labels"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#4b5563", letterSpacing: "0.05em", textTransform: "uppercase" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => {
              const overdue = isOverdue(task.dueDate) && task.status !== "Done";
              return (
                <tr key={task.id} onClick={() => onTaskClick(task.id)} className="fade-in" style={{ borderBottom: "1px solid #1a1a2a", cursor: "pointer", transition: "background 0.1s", animationDelay: `${i * 0.04}s`, animationFillMode: "both" }}
                  onMouseEnter={(e: MouseEvent<HTMLTableRowElement>) => { e.currentTarget.style.background = "#16162a"; }}
                  onMouseLeave={(e: MouseEvent<HTMLTableRowElement>) => { e.currentTarget.style.background = "transparent"; }}>
                  <td style={{ padding: "11px 16px", fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{task.title}</td>
                  <td style={{ padding: "11px 16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600, color: STATUS_COLORS[task.status] }}>
                      <StatusDot status={task.status} size={6} />{task.status}
                    </span>
                  </td>
                  <td style={{ padding: "11px 16px" }}><PriorityBadge priority={task.priority} /></td>
                  <td style={{ padding: "11px 16px" }}>
                    {task.assignee ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Avatar userId={task.assignee} size={22} />
                        <span style={{ fontSize: 12, color: "#9ca3af" }}>{getMember(task.assignee)?.name.split(" ")[0]}</span>
                      </div>
                    ) : <span style={{ color: "#374151", fontSize: 12 }}>—</span>}
                  </td>
                  <td style={{ padding: "11px 16px", fontSize: 12, color: overdue ? "#ef4444" : "#6b7280" }}>
                    {task.dueDate ? formatDate(task.dueDate) : "—"}
                  </td>
                  <td style={{ padding: "11px 16px" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                      {task.labels?.slice(0, 2).map((lid) => {
                        const l = getLabel(lid);
                        return l ? <span key={lid} style={{ padding: "2px 6px", borderRadius: 4, background: l.color + "25", color: l.color, fontSize: 10, fontWeight: 600 }}>{l.name}</span> : null;
                      })}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {tasks.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "#374151", fontSize: 13 }}>No tasks found</div>}
      </div>
    </div>
  );
}

// ─── SPRINTS VIEW ─────────────────────────────────────────────────────────────
function SprintsView({ tasks, onTaskClick }: { tasks: Task[]; onTaskClick: (taskId: Task["id"]) => void }) {
  const sprints = [
    { id: "s1", name: "Sprint 1", start: "2025-04-28", end: "2025-05-09", status: "completed" },
    { id: "s2", name: "Sprint 2 (Active)", start: "2025-05-10", end: "2025-05-23", status: "active" },
    { id: "s3", name: "Sprint 3", start: "2025-05-24", end: "2025-06-06", status: "planned" },
  ] as const;
  const sprintTaskMap = {
    s1: tasks.filter(t => ["Done"].includes(t.status)),
    s2: tasks.filter(t => ["In Progress", "In Review", "Todo"].includes(t.status)),
    s3: tasks.filter(t => t.status === "Backlog"),
  };
  return (
    <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      {sprints.map((sprint) => {
        const sprintTasks = sprintTaskMap[sprint.id] || [];
        const done = sprintTasks.filter(t => t.status === "Done").length;
        const progress = sprintTasks.length > 0 ? (done / sprintTasks.length) * 100 : 0;
        return (
          <div key={sprint.id} className="fade-in" style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 12 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "#e2e8f0" }}>{sprint.name}</span>
                  <span style={{ padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600, background: sprint.status === "active" ? "#6366f120" : sprint.status === "completed" ? "#10b98120" : "#1e1e2e", color: sprint.status === "active" ? "#6366f1" : sprint.status === "completed" ? "#10b981" : "#6b7280" }}>{sprint.status.toUpperCase()}</span>
                </div>
                <div style={{ fontSize: 11, color: "#4b5563", marginTop: 3 }}>{formatDate(sprint.start)} — {formatDate(sprint.end)}</div>
              </div>
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>{done}/{sprintTasks.length} tasks</div>
                  <div style={{ width: 120, height: 4, background: "#1e1e2e", borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${progress}%`, background: "#6366f1", borderRadius: 2, transition: "width 0.5s ease" }} />
                  </div>
                </div>
              </div>
            </div>
            {sprintTasks.length > 0 ? (
              <div style={{ padding: "8px 8px" }}>
                {sprintTasks.map((task) => (
                  <div key={task.id} onClick={() => onTaskClick(task.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, cursor: "pointer", transition: "background 0.1s" }}
                    onMouseEnter={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.background = "#16162a"; }}
                    onMouseLeave={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.background = "transparent"; }}>
                    <StatusDot status={task.status} />
                    <span style={{ fontSize: 13, color: "#e2e8f0", flex: 1 }}>{task.title}</span>
                    <PriorityBadge priority={task.priority} />
                    {task.assignee && <Avatar userId={task.assignee} size={20} />}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 20, textAlign: "center", color: "#374151", fontSize: 12 }}>No tasks in this sprint</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── ROADMAP VIEW ─────────────────────────────────────────────────────────────
function RoadmapView({ tasks, onTaskClick }: { tasks: Task[]; onTaskClick: (taskId: Task["id"]) => void }) {
  const weeks = ["Apr 28", "May 5", "May 12", "May 19", "May 26", "Jun 2"];
  const startDate = new Date("2025-04-28");
  const getPos = (date: string | null | undefined) => {
    if (!date) return null;
    const d = new Date(date);
    const diff = (d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    return Math.min(Math.max((diff / 42) * 100, 0), 95);
  };
  return (
    <div style={{ padding: 20 }}>
      <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 10, overflow: "hidden" }}>
        {/* Timeline header */}
        <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", borderBottom: "1px solid #1e1e2e" }}>
          <div style={{ padding: "10px 16px", fontSize: 11, fontWeight: 600, color: "#4b5563", letterSpacing: "0.05em", textTransform: "uppercase" }}>Task</div>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${weeks.length}, 1fr)`, borderLeft: "1px solid #1e1e2e" }}>
            {weeks.map((w) => <div key={w} style={{ padding: "10px 8px", fontSize: 11, color: "#4b5563", fontWeight: 600, borderRight: "1px solid #1a1a2a" }}>{w}</div>)}
          </div>
        </div>
        {/* Tasks */}
        {tasks.filter(t => t.dueDate).map((task) => {
          const pos = getPos(task.dueDate);
          const color = STATUS_COLORS[task.status];
          return (
            <div key={task.id} style={{ display: "grid", gridTemplateColumns: "220px 1fr", borderBottom: "1px solid #1a1a2a" }}>
              <div onClick={() => onTaskClick(task.id)} style={{ padding: "10px 16px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.background = "#16162a"; }}
                onMouseLeave={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.background = "transparent"; }}>
                <StatusDot status={task.status} />
                <span style={{ fontSize: 12, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</span>
              </div>
              <div style={{ position: "relative", borderLeft: "1px solid #1e1e2e", height: 40 }}>
                {weeks.map((_, i) => <div key={i} style={{ position: "absolute", left: `${(i / weeks.length) * 100}%`, top: 0, bottom: 0, borderLeft: "1px solid #1a1a2a" }} />)}
                {pos !== null && (
                  <div style={{ position: "absolute", left: `${pos}%`, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}80` }} />
                    <span style={{ fontSize: 10, color: "#6b7280", whiteSpace: "nowrap" }}>{formatDate(task.dueDate)}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── DASHBOARD VIEW ───────────────────────────────────────────────────────────
function DashboardView({
  tasks,
  projects,
  members,
  onTaskClick,
}: {
  tasks: Task[];
  projects: Project[];
  members: Member[];
  onTaskClick: (taskId: Task["id"]) => void;
}) {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === "Done").length;
  const inProgress = tasks.filter(t => t.status === "In Progress").length;
  const overdue = tasks.filter(t => isOverdue(t.dueDate) && t.status !== "Done").length;
  const recent = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const statCards = [
    { label: "Total Tasks", value: total, icon: Icons.layers, color: "#6366f1" },
    { label: "Completed", value: done, icon: Icons.check, color: "#10b981" },
    { label: "In Progress", value: inProgress, icon: Icons.zap, color: "#8b5cf6" },
    { label: "Overdue", value: overdue, icon: Icons.clock, color: "#ef4444" },
  ];

  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {statCards.map((s, i) => (
          <div key={s.label} className="fade-in" style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 10, padding: 18, animationDelay: `${i * 0.07}s`, animationFillMode: "both" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>{s.label}</span>
              <div style={{ padding: 6, borderRadius: 6, background: s.color + "20" }}>
                <Icon d={s.icon} size={14} style={{ color: s.color }} />
              </div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.03em" }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {/* Project overview */}
        <div className="fade-in stagger-1" style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>Project Progress</div>
          {projects.map((p) => {
            const pTasks = tasks.filter(t => t.projectId === p.id);
            const pDone = pTasks.filter(t => t.status === "Done").length;
            const pct = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;
            return (
              <div key={p.id} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 14 }}>{p.icon}</span>
                    <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 500 }}>{p.name}</span>
                  </div>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{pDone}/{pTasks.length}</span>
                </div>
                <div style={{ height: 6, background: "#1e1e2e", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: p.color, borderRadius: 3, transition: "width 0.8s ease" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Team workload */}
        <div className="fade-in stagger-2" style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>Team Workload</div>
          {members.map((m) => {
            const assigned = tasks.filter(t => t.assignee === m.id);
            const inProg = assigned.filter(t => t.status === "In Progress").length;
            return (
              <div key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <Avatar userId={m.id} size={28} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 500 }}>{m.name}</span>
                    <span style={{ fontSize: 11, color: "#6b7280" }}>{assigned.length} tasks · {inProg} active</span>
                  </div>
                  <div style={{ height: 4, background: "#1e1e2e", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min((assigned.length / 6) * 100, 100)}%`, background: m.color, borderRadius: 2 }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="fade-in stagger-3" style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 10, padding: 18 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginBottom: 14 }}>Recent Tasks</div>
        {recent.map((task) => (
          <div key={task.id} onClick={() => onTaskClick(task.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1a1a2a", cursor: "pointer" }}
            onMouseEnter={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.opacity = "0.8"; }}
            onMouseLeave={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.opacity = "1"; }}>
            <StatusDot status={task.status} />
            <span style={{ fontSize: 13, color: "#e2e8f0", flex: 1 }}>{task.title}</span>
            <PriorityBadge priority={task.priority} />
            {task.assignee && <Avatar userId={task.assignee} size={20} />}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TASK DETAIL PANEL ────────────────────────────────────────────────────────
function TaskDetailPanel({
  task,
  onClose,
  onUpdate,
  onDelete,
  members,
  labels,
}: {
  task: Task | undefined;
  onClose: () => void;
  onUpdate: (taskId: Task["id"], updates: Partial<Task>) => void;
  onDelete: (taskId: Task["id"]) => void;
  members: Member[];
  labels: Label[];
}) {
  const [comment, setComment] = useState("");
  const [editing, setEditing] = useState<keyof Pick<Task, "title" | "description"> | null>(null);
  const [editVal, setEditVal] = useState("");

  if (!task) return null;

  const addComment = () => {
    if (!comment.trim()) return;
    const newComment = { id: uid(), userId: "u1", text: comment, time: "just now" };
    onUpdate(task.id, { comments: [...(task.comments || []), newComment], activity: [...(task.activity || []), `Badri Koushik commented · just now`] });
    setComment("");
  };

  const startEdit = (field: keyof Pick<Task, "title" | "description">, val: string) => { setEditing(field); setEditVal(val || ""); };
  const saveEdit = (field: keyof Pick<Task, "title" | "description">) => {
    const updates = { [field]: editVal } as Partial<Task>;
    onUpdate(task.id, { ...updates, activity: [...(task.activity || []), `${field} updated · just now`] });
    setEditing(null);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200, display: "flex", justifyContent: "flex-end" }} onClick={(e: MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="slide-in" style={{ width: 480, height: "100%", background: "#0d0d16", borderLeft: "1px solid #1e1e2e", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "14px 18px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", gap: 8 }}>
          <StatusDot status={task.status} size={8} />
          <span style={{ fontSize: 11, color: STATUS_COLORS[task.status], fontWeight: 600 }}>{task.status}</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            <button onClick={() => onDelete(task.id)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", padding: "4px 6px", borderRadius: 4, display: "flex" }}
              onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
              onMouseLeave={e => e.currentTarget.style.color = "#4b5563"}>
              <Icon d={Icons.trash} size={14} />
            </button>
            <button onClick={onClose} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", padding: "4px 6px", borderRadius: 4, display: "flex" }}>
              <Icon d={Icons.x} size={14} />
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: "auto", padding: 18 }}>
          {/* Title */}
          {editing === "title" ? (
            <input value={editVal} onChange={(e) => setEditVal(e.target.value)} onBlur={() => saveEdit("title")} onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && saveEdit("title")} autoFocus style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", background: "#111118", border: "1px solid #6366f1", borderRadius: 6, padding: "6px 8px", width: "100%", outline: "none", marginBottom: 14 }} />
          ) : (
            <h2 onClick={() => startEdit("title", task.title)} style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 14, lineHeight: 1.4, cursor: "text", borderRadius: 4, padding: "2px 4px" }}
              onMouseEnter={(e: MouseEvent<HTMLHeadingElement>) => { e.currentTarget.style.background = "#16162a"; }}
              onMouseLeave={(e: MouseEvent<HTMLHeadingElement>) => { e.currentTarget.style.background = "transparent"; }}>
              {task.title}
            </h2>
          )}

          {/* Meta grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
            {/* Status */}
            <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Status</div>
              <select value={task.status} onChange={(e) => onUpdate(task.id, { status: e.target.value as Status, activity: [...(task.activity || []), `Status changed to ${e.target.value} · just now`] })} style={{ background: "transparent", border: "none", color: STATUS_COLORS[task.status], fontSize: 13, fontWeight: 600, cursor: "pointer", outline: "none", width: "100%" }}>
                {STATUSES.map(s => <option key={s} value={s} style={{ background: "#0d0d16", color: "#e2e8f0" }}>{s}</option>)}
              </select>
            </div>
            {/* Priority */}
            <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Priority</div>
              <select value={task.priority} onChange={(e) => onUpdate(task.id, { priority: e.target.value as Priority })} style={{ background: "transparent", border: "none", color: PRIORITIES[task.priority]?.color, fontSize: 13, fontWeight: 600, cursor: "pointer", outline: "none", width: "100%" }}>
                {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k} style={{ background: "#0d0d16", color: "#e2e8f0" }}>{v.label}</option>)}
              </select>
            </div>
            {/* Assignee */}
            <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Assignee</div>
              <select value={task.assignee || ""} onChange={(e) => onUpdate(task.id, { assignee: e.target.value as Task["assignee"] })} style={{ background: "transparent", border: "none", color: "#e2e8f0", fontSize: 13, fontWeight: 500, cursor: "pointer", outline: "none", width: "100%" }}>
                <option value="" style={{ background: "#0d0d16" }}>Unassigned</option>
                {members.map(m => <option key={m.id} value={m.id} style={{ background: "#0d0d16" }}>{m.name}</option>)}
              </select>
            </div>
            {/* Due Date */}
            <div style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "10px 12px" }}>
              <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>Due Date</div>
              <input type="date" value={task.dueDate || ""} onChange={(e) => onUpdate(task.id, { dueDate: e.target.value })} style={{ background: "transparent", border: "none", color: isOverdue(task.dueDate) && task.status !== "Done" ? "#ef4444" : "#e2e8f0", fontSize: 13, cursor: "pointer", outline: "none", width: "100%", colorScheme: "dark" }} />
            </div>
          </div>

          {/* Labels */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Labels</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {labels.map((l) => {
                const active = task.labels?.includes(l.id);
                return (
                  <button key={l.id} onClick={() => {
                    const current = task.labels || [];
                    onUpdate(task.id, { labels: active ? current.filter((id) => id !== l.id) : [...current, l.id] });
                  }} style={{ padding: "3px 10px", borderRadius: 4, background: active ? l.color + "30" : "#111118", border: `1px solid ${active ? l.color + "60" : "#1e1e2e"}`, color: active ? l.color : "#4b5563", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                    {l.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8 }}>Description</div>
            {editing === "description" ? (
              <textarea value={editVal} onChange={(e) => setEditVal(e.target.value)} onBlur={() => saveEdit("description")} autoFocus rows={4} style={{ width: "100%", background: "#111118", border: "1px solid #6366f1", borderRadius: 8, padding: "10px 12px", color: "#e2e8f0", fontSize: 13, lineHeight: 1.6, resize: "vertical", outline: "none" }} />
            ) : (
              <div onClick={() => startEdit("description", task.description)} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: task.description ? "#9ca3af" : "#374151", lineHeight: 1.6, cursor: "text", minHeight: 60 }}
                onMouseEnter={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = "#2e2e3e"; }}
                onMouseLeave={(e: MouseEvent<HTMLDivElement>) => { e.currentTarget.style.borderColor = "#1e1e2e"; }}>
                {task.description || "Add a description…"}
              </div>
            )}
          </div>

          {/* Comments */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Comments ({task.comments?.length || 0})</div>
            {task.comments?.map((c) => (
              <div key={c.id} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <Avatar userId={c.userId} size={24} />
                <div style={{ flex: 1, background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "8px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af" }}>{getMember(c.userId)?.name}</span>
                    <span style={{ fontSize: 10, color: "#4b5563" }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#e2e8f0", lineHeight: 1.5 }}>{c.text}</div>
                </div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              <Avatar userId="u1" size={24} />
              <div style={{ flex: 1, display: "flex", gap: 8 }}>
                <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addComment()} placeholder="Add a comment…" style={{ flex: 1, background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "8px 12px", color: "#e2e8f0", fontSize: 13, outline: "none" }}
                  onFocus={(e) => { e.target.style.borderColor = "#6366f1"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#1e1e2e"; }} />
                <button onClick={addComment} style={{ padding: "8px 12px", background: "#6366f1", border: "none", borderRadius: 8, color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Post</button>
              </div>
            </div>
          </div>

          {/* Activity */}
          <div>
            <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Activity</div>
            {[...(task.activity || [])].reverse().map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2a2a3a", marginTop: 5, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.5 }}>{a}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NEW TASK MODAL ───────────────────────────────────────────────────────────
type NewTaskForm = {
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: Task["assignee"];
  dueDate: string;
  labels: Label["id"][];
};

function NewTaskModal({
  initialStatus,
  onClose,
  onCreate,
  members,
  labels,
}: {
  initialStatus: Status;
  onClose: () => void;
  onCreate: (task: CreateTaskInput) => void;
  members: Member[];
  labels: Label[];
}) {
  const [form, setForm] = useState<NewTaskForm>({ title: "", description: "", status: initialStatus, priority: "medium", assignee: "", dueDate: "", labels: [] });
  const set = <K extends keyof NewTaskForm>(k: K, v: NewTaskForm[K]) => setForm((f) => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.title.trim()) return;
    onCreate(form);
    onClose();
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={(e: MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="fade-in" style={{ width: 500, background: "#0d0d16", border: "1px solid #1e1e2e", borderRadius: 14, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>New Task</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer" }}><Icon d={Icons.x} size={16} /></button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Task title *" autoFocus style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, fontWeight: 600, outline: "none", width: "100%" }}
            onFocus={(e) => { e.target.style.borderColor = "#6366f1"; }}
            onBlur={(e) => { e.target.style.borderColor = "#1e1e2e"; }} />
          <textarea value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Description (optional)" rows={3} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none", resize: "vertical", width: "100%" }}
            onFocus={(e) => { e.target.style.borderColor = "#6366f1"; }}
            onBlur={(e) => { e.target.style.borderColor = "#1e1e2e"; }} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: "#4b5563", fontWeight: 600, marginBottom: 5, letterSpacing: "0.05em", textTransform: "uppercase" }}>Status</div>
              <select value={form.status} onChange={(e) => set("status", e.target.value as Status)} style={{ width: "100%", background: "#111118", border: "1px solid #1e1e2e", borderRadius: 6, padding: "7px 10px", color: "#e2e8f0", fontSize: 12, outline: "none" }}>
                {STATUSES.map(s => <option key={s} value={s} style={{ background: "#0d0d16" }}>{s}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#4b5563", fontWeight: 600, marginBottom: 5, letterSpacing: "0.05em", textTransform: "uppercase" }}>Priority</div>
              <select value={form.priority} onChange={(e) => set("priority", e.target.value as Priority)} style={{ width: "100%", background: "#111118", border: "1px solid #1e1e2e", borderRadius: 6, padding: "7px 10px", color: PRIORITIES[form.priority]?.color, fontSize: 12, fontWeight: 600, outline: "none" }}>
                {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k} style={{ background: "#0d0d16", color: "#e2e8f0" }}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <div style={{ fontSize: 11, color: "#4b5563", fontWeight: 600, marginBottom: 5, letterSpacing: "0.05em", textTransform: "uppercase" }}>Assignee</div>
              <select value={form.assignee} onChange={(e) => set("assignee", e.target.value as Task["assignee"])} style={{ width: "100%", background: "#111118", border: "1px solid #1e1e2e", borderRadius: 6, padding: "7px 10px", color: "#e2e8f0", fontSize: 12, outline: "none" }}>
                <option value="" style={{ background: "#0d0d16" }}>Unassigned</option>
                {members.map(m => <option key={m.id} value={m.id} style={{ background: "#0d0d16" }}>{m.name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#4b5563", fontWeight: 600, marginBottom: 5, letterSpacing: "0.05em", textTransform: "uppercase" }}>Due Date</div>
            <input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 6, padding: "7px 10px", color: "#e2e8f0", fontSize: 12, outline: "none", colorScheme: "dark" }} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#4b5563", fontWeight: 600, marginBottom: 8, letterSpacing: "0.05em", textTransform: "uppercase" }}>Labels</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {labels.map((l) => {
                const active = form.labels.includes(l.id);
                return (
                  <button key={l.id} onClick={() => set("labels", active ? form.labels.filter((id) => id !== l.id) : [...form.labels, l.id])} style={{ padding: "3px 10px", borderRadius: 4, background: active ? l.color + "30" : "#111118", border: `1px solid ${active ? l.color + "60" : "#1e1e2e"}`, color: active ? l.color : "#4b5563", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                    {l.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 20px", borderTop: "1px solid #1e1e2e", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #1e1e2e", borderRadius: 6, color: "#6b7280", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button onClick={submit} className="btn-primary" style={{ padding: "8px 20px", background: "#6366f1", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Create Task</button>
        </div>
      </div>
    </div>
  );
}

// ─── NEW PROJECT MODAL ────────────────────────────────────────────────────────
type NewProjectForm = Omit<Project, "id">;

function NewProjectModal({ onClose, onCreate }: { onClose: () => void; onCreate: (project: NewProjectForm) => void }) {
  const [form, setForm] = useState<NewProjectForm>({ name: "", description: "", color: "#6366f1", icon: "📁" });
  const colors = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#ec4899", "#8b5cf6", "#3b82f6"];
  const icons = ["📁", "🛡️", "📋", "🔒", "🚀", "⚡", "🎯", "💡"];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={(e: MouseEvent<HTMLDivElement>) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="fade-in" style={{ width: 400, background: "#0d0d16", border: "1px solid #1e1e2e", borderRadius: 14, overflow: "hidden", boxShadow: "0 24px 64px rgba(0,0,0,0.7)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #1e1e2e", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "#f1f5f9" }}>New Project</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer" }}><Icon d={Icons.x} size={16} /></button>
        </div>
        <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <input value={form.name} onChange={(e) => setForm((f) => ({...f, name: e.target.value}))} placeholder="Project name *" autoFocus style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "10px 14px", color: "#f1f5f9", fontSize: 14, fontWeight: 600, outline: "none", width: "100%" }} />
          <textarea value={form.description} onChange={(e) => setForm((f) => ({...f, description: e.target.value}))} placeholder="Description" rows={2} style={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none", resize: "none", width: "100%" }} />
          <div>
            <div style={{ fontSize: 11, color: "#4b5563", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Color</div>
            <div style={{ display: "flex", gap: 8 }}>
              {colors.map((c) => <button key={c} onClick={() => setForm((f) => ({...f, color: c}))} style={{ width: 24, height: 24, borderRadius: "50%", background: c, border: form.color === c ? `3px solid #fff` : "3px solid transparent", cursor: "pointer" }} />)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: "#4b5563", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Icon</div>
            <div style={{ display: "flex", gap: 8 }}>
              {icons.map((ic) => <button key={ic} onClick={() => setForm((f) => ({...f, icon: ic}))} style={{ width: 32, height: 32, borderRadius: 6, background: form.icon === ic ? "#1e1e2e" : "#111118", border: `1px solid ${form.icon === ic ? "#6366f1" : "#1e1e2e"}`, fontSize: 16, cursor: "pointer" }}>{ic}</button>)}
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 20px", borderTop: "1px solid #1e1e2e", display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button onClick={onClose} style={{ padding: "8px 16px", background: "transparent", border: "1px solid #1e1e2e", borderRadius: 6, color: "#6b7280", fontSize: 13, cursor: "pointer" }}>Cancel</button>
          <button onClick={() => form.name.trim() && onCreate(form)} className="btn-primary" style={{ padding: "8px 20px", background: "#6366f1", border: "none", borderRadius: 6, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Create</button>
        </div>
      </div>
    </div>
  );
}
