import React, { useState, useEffect, useCallback } from 'react';
import { Tab, Task, Note, Project, Habit, PomodoroSession, TaskCategory, TaskPriority, CalendarEvent, Folder } from './types';
import { ToDoList } from './components/TodoList';
import { Notes } from './components/Notes';
import { PomodoroTimer } from './components/PomodoroTimer';
import { AiAssistant } from './components/AiAssistant';
import { Calendar } from './components/Calendar';
import { Dashboard } from './components/Dashboard';
import { HabitTracker } from './components/HabitTracker';
import { QuickAction } from './components/QuickAction';
import { ProjectsView } from './components/ProjectsView';
import { 
  ClipboardCheckIcon, PencilIcon, ClockIcon, SparklesIcon, CalendarIcon, LayoutDashboardIcon, TargetIcon, EyeOffIcon, SearchIcon, ProjectIcon
} from './components/Icons';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Dashboard);
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem('projects');
    return savedProjects ? JSON.parse(savedProjects) : [];
  });
  
  const [folders, setFolders] = useState<Folder[]>(() => {
    const savedFolders = localStorage.getItem('folders');
    return savedFolders ? JSON.parse(savedFolders) : [];
  });
  
  const [habits, setHabits] = useState<Habit[]>(() => {
    const savedHabits = localStorage.getItem('habits');
    return savedHabits ? JSON.parse(savedHabits) : [];
  });

  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>(() => {
    const savedSessions = localStorage.getItem('pomodoroSessions');
    return savedSessions ? JSON.parse(savedSessions) : [];
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    return savedEvents ? JSON.parse(savedEvents) : [];
  });

  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);

  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('notes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem('projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { localStorage.setItem('folders', JSON.stringify(folders)); }, [folders]);
  useEffect(() => { localStorage.setItem('habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('pomodoroSessions', JSON.stringify(pomodoroSessions)); }, [pomodoroSessions]);
  useEffect(() => { localStorage.setItem('calendarEvents', JSON.stringify(calendarEvents)); }, [calendarEvents]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickActionOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsQuickActionOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addTask = useCallback((text: string, projectId: string | null, dueDate?: string, category: TaskCategory = TaskCategory.None, priority: TaskPriority = TaskPriority.None) => {
    if (text.trim() === '') return;
    const newTask: Task = { 
      id: crypto.randomUUID(), 
      text, 
      completed: false, 
      projectId, 
      dueDate, 
      category, 
      priority, 
      createdAt: new Date().toISOString() 
    };
    setTasks(prev => [...prev, newTask]);
  }, []);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addNote = useCallback((title: string, content: string, projectId: string | null, folderId: string | null) => {
    if (title.trim() === '' || content.trim() === '') return;
    const newNote: Note = { id: crypto.randomUUID(), title, content, createdAt: new Date().toISOString(), projectId, folderId };
    setNotes(prev => [newNote, ...prev]);
  }, []);

  const updateNote = (id: string, title: string, content: string) => {
    setNotes(notes.map(note => note.id === id ? { ...note, title, content } : note));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };
  
  const addFolder = (name: string) => {
    if (name.trim() === '') return;
    const newFolder: Folder = { id: crypto.randomUUID(), name };
    setFolders(prev => [...prev, newFolder]);
  };

  const addProject = (name: string) => {
    if (name.trim() === '') return;
    const newProject: Project = { id: crypto.randomUUID(), name };
    setProjects(prev => [...prev, newProject]);
  };
  
  const addHabit = (name: string) => {
    if(name.trim() === '') return;
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name,
      completions: {},
      streak: 0,
      createdAt: new Date().toISOString()
    };
    setHabits(prev => [...prev, newHabit]);
  };
  
  const toggleHabit = (habitId: string, date: string) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const newCompletions = { ...h.completions, [date]: !h.completions[date] };
        // Simple streak calculation: check consecutive days from today backwards
        let streak = 0;
        let d = new Date(date);
        while(newCompletions[d.toISOString().split('T')[0]]){
            streak++;
            d.setDate(d.getDate() - 1);
        }
        return { ...h, completions: newCompletions, streak };
      }
      return h;
    }));
  };
  
  const logPomodoroSession = (session: PomodoroSession) => {
    setPomodoroSessions(prev => [...prev, session]);
  };

  const addCalendarEvent = (title: string, date: string) => {
    if (title.trim() === '') return;
    const newEvent: CalendarEvent = { id: crypto.randomUUID(), title, date };
    setCalendarEvents(prev => [...prev, newEvent]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.Dashboard:
        return <Dashboard tasks={tasks} pomodoroSessions={pomodoroSessions} habits={habits} projects={projects} />;
      case Tab.Tasks:
        return <ToDoList 
            tasks={tasks}
            projects={projects}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
        />;
      case Tab.Projects:
        return <ProjectsView
            tasks={tasks}
            projects={projects}
            onAddProject={addProject}
        />;
      case Tab.Notes:
        return <Notes 
            notes={notes} 
            projects={projects} 
            folders={folders}
            onAddFolder={addFolder}
            onAddNote={({title, content, folderId}) => addNote(title, content, null, folderId)} 
            onUpdateNote={updateNote} 
            onDeleteNote={deleteNote} 
            onAddTasks={tasks => tasks.forEach(t => addTask(t, null))}
            enableFolders={true}
        />;
      case Tab.Calendar:
        return <Calendar tasks={tasks} events={calendarEvents} onAddEvent={addCalendarEvent} />;
      case Tab.Habits:
        return <HabitTracker habits={habits} onAddHabit={addHabit} onToggleHabit={toggleHabit} />;
      case Tab.Timer:
        return <PomodoroTimer onSessionComplete={logPomodoroSession} />;
      case Tab.AiAssistant:
        return <AiAssistant />;
      default:
        return null;
    }
  };
  
  const TabButton = ({ tab, label, icon }: { tab: Tab; label: string; icon: JSX.Element }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-in-out w-full
        ${activeTab === tab ? 'bg-primary text-black' : 'text-medium hover:bg-gray-900 hover:text-dark'}`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-light text-dark font-sans">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-8">
            <div className="flex justify-between items-center">
                <div></div>
                <h1 className="text-4xl md:text-5xl font-bold text-dark tracking-tight">Productivity Hub</h1>
                <div className="flex gap-2">
                    <button onClick={() => setIsQuickActionOpen(true)} className="p-2 rounded-lg hover:bg-gray-800 transition" aria-label="Open command bar">
                        <SearchIcon />
                    </button>
                    <button onClick={() => setIsFocusMode(!isFocusMode)} className="p-2 rounded-lg hover:bg-gray-800 transition" aria-label="Toggle focus mode">
                        <EyeOffIcon />
                    </button>
                </div>
            </div>
            {!isFocusMode && <p className="text-medium mt-2 text-lg">Your all-in-one space to focus and create.</p>}
        </header>

        <main className="flex flex-col md:flex-row gap-8">
          {!isFocusMode && (
            <aside className="md:w-1/4 lg:w-1/5">
              <nav className="p-4 bg-light rounded-xl border border-gray-800">
                <ul className="flex flex-row md:flex-col gap-2">
                  <li className="flex-1 md:flex-auto"><TabButton tab={Tab.Dashboard} label="Dashboard" icon={<LayoutDashboardIcon />} /></li>
                  <li className="flex-1 md:flex-auto"><TabButton tab={Tab.Tasks} label="Tasks" icon={<ClipboardCheckIcon />} /></li>
                  <li className="flex-1 md:flex-auto"><TabButton tab={Tab.Projects} label="Projects" icon={<ProjectIcon />} /></li>
                  <li className="flex-1 md:flex-auto"><TabButton tab={Tab.Notes} label="Notes" icon={<PencilIcon />} /></li>
                  <li className="flex-1 md:flex-auto"><TabButton tab={Tab.Calendar} label="Calendar" icon={<CalendarIcon />} /></li>
                  <li className="flex-1 md:flex-auto"><TabButton tab={Tab.Habits} label="Habits" icon={<TargetIcon />} /></li>
                  <li className="flex-1 md:flex-auto"><TabButton tab={Tab.Timer} label="Pomodoro" icon={<ClockIcon />} /></li>
                  <li className="flex-1 md:flex-auto"><TabButton tab={Tab.AiAssistant} label="AI Assistant" icon={<SparklesIcon />} /></li>
                </ul>
              </nav>
            </aside>
          )}
          
          <div className="flex-1 bg-light rounded-xl border border-gray-800 p-6 md:p-8 min-h-[60vh]">
            {renderContent()}
          </div>
        </main>
      </div>
      <QuickAction 
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        tasks={tasks}
        notes={notes}
        onAddTask={(text) => addTask(text, null)}
      />
    </div>
  );
};

export default App;