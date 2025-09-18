export enum Tab {
  Dashboard = 'DASHBOARD',
  Tasks = 'TASKS',
  Projects = 'PROJECTS',
  Notes = 'NOTES',
  Calendar = 'CALENDAR',
  Habits = 'HABITS',
  Timer = 'TIMER',
  AiAssistant = 'AI_ASSISTANT',
}

export enum TaskCategory {
  Work = 'Work',
  Personal = 'Personal',
  Urgent = 'Urgent',
  None = 'None',
}

export enum TaskPriority {
  High = 'High',
  Medium = 'Medium',
  Low = 'Low',
  None = 'None',
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  projectId: string | null;
  dueDate?: string;
  category: TaskCategory;
  priority: TaskPriority;
  createdAt: string;
}

export interface Note {
  id:string;
  title: string;
  content: string;
  createdAt: string;
  projectId: string | null;
  folderId: string | null;
}

export interface Folder {
    id: string;
    name: string;
}

export interface Project {
    id: string;
    name: string;
}

export interface Habit {
  id: string;
  name: string;
  completions: { [date: string]: boolean }; // YYYY-MM-DD
  streak: number;
  createdAt: string;
}

export interface PomodoroSession {
  date: string; // YYYY-MM-DD
  duration: number; // in minutes
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
}