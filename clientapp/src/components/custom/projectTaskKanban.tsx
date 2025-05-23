"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/context/authProvider';

type Task = {
  _links: { project: string; self: string };
  assignee_id: string;
  created_by: string;
  deadline: string | null;
  description: string | null;
  priority: number;
  project_id: string;
  status: "pending" | "in_progress" | "completed";
  task_id: string;
  title: string;
  updated_by: string;
};

type Project = {
  _links: { self: string; tasks: string };
  category_id: string | null;
  deadline: string | null;
  description: string;
  project_id: string;
  status: "planning" | "active" | "completed" | "on_hold" | "cancelled";
  team_id: string;
  title: string;
};

interface ProjectTaskKanbanProps {
  projectId: string;
}

const dummyProject: Project = {
  _links: { self: "/projects/50c8d6d6", tasks: "/tasks?project_id=50c8d6d6" },
  category_id: null,
  deadline: null,
  description: "This is a sample project 1012.",
  project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
  status: "active",
  team_id: "team-id-placeholder",
  title: "Dummy Project"
};

const dummyTasks: Task[] = [
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/88e11c9d" },
    assignee_id: "user-1",
    created_by: "user-1",
    deadline: "2023-12-31T23:59:59",
    description: "Create the landing page for the app.",
    priority: 2,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "in_progress",
    task_id: "88e11c9d-cc5a-42c9-bf09-f4d489075ce9",
    title: "Design Homepage",
    updated_by: "user-1",
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/804cd908" },
    assignee_id: "user-2",
    created_by: "user-1",
    deadline: null,
    description: "Define color palette and fonts.",
    priority: 1,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "pending",
    task_id: "804cd908-db68-4034-8ec2-a78abf4b72ff",
    title: "Define UI Style Guide",
    updated_by: "user-2",
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/67a1bcd0" },
    assignee_id: "user-3",
    created_by: "user-1",
    deadline: null,
    description: "Finalize the prototype for review.",
    priority: 3,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "completed",
    task_id: "67a1bcd0-e45a-4e87-b1ef-c6c54d8f1c1f",
    title: "Finish Prototype",
    updated_by: "user-3",
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/dda64a8e" },
    assignee_id: "user-7",
    created_by: "user-1",
    deadline: "2025-06-03T14:00:00.000Z",
    description: "Integrate CI/CD pipelines for automated deployments.",
    priority: 3,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "pending",
    task_id: "dda64a8e-e46b-4a6e-96f7-631f41a1b9be",
    title: "Set Up CI/CD",
    updated_by: "user-7"
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/e733e06d" },
    assignee_id: "user-2",
    created_by: "user-1",
    deadline: null,
    description: "Add detailed project documentation for onboarding.",
    priority: 2,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "in_progress",
    task_id: "e733e06d-9f7a-4891-9f94-b0f7e70e5eaa",
    title: "Write Project Docs",
    updated_by: "user-2"
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/3021b578" },
    assignee_id: "user-4",
    created_by: "user-1",
    deadline: "2025-06-05T10:00:00.000Z",
    description: "Conduct usability testing with test users.",
    priority: 3,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "pending",
    task_id: "3021b578-cb6c-4232-84f6-c13c7f5b7503",
    title: "User Testing",
    updated_by: "user-4"
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/1f66d235" },
    assignee_id: "user-1",
    created_by: "user-1",
    deadline: "2025-06-06T17:00:00.000Z",
    description: "Prepare demo slides for stakeholder meeting.",
    priority: 1,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "in_progress",
    task_id: "1f66d235-ff1d-40f9-8ec7-1a1f985cd0a2",
    title: "Create Demo Slides",
    updated_by: "user-1"
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/8b37f411" },
    assignee_id: "user-5",
    created_by: "user-1",
    deadline: null,
    description: "Optimize database queries for performance.",
    priority: 2,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "pending",
    task_id: "8b37f411-d36a-4091-803f-0f5d9bdca983",
    title: "Optimize DB Queries",
    updated_by: "user-5"
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/f29ac07a" },
    assignee_id: "user-4",
    created_by: "user-1",
    deadline: "2025-06-02T15:30:00.000Z",
    description: "Set up basic routing and error handling.",
    priority: 3,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "in_progress",
    task_id: "f29ac07a-6f7a-45cf-93a1-0954b5f727d9",
    title: "Implement Frontend Routing",
    updated_by: "user-4"
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/ab8e762e" },
    assignee_id: "user-5",
    created_by: "user-1",
    deadline: null,
    description: "Research and integrate third-party auth provider.",
    priority: 1,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "pending",
    task_id: "ab8e762e-ff87-4de2-9112-e4c78a149962",
    title: "Add Authentication Module",
    updated_by: "user-5"
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/cf75fa58" },
    assignee_id: "user-2",
    created_by: "user-1",
    deadline: "2025-06-10T12:00:00.000Z",
    description: "Set up database schemas and initial seed data.",
    priority: 2,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "in_progress",
    task_id: "cf75fa58-1fa9-4c12-a9e1-8355c62e9370",
    title: "Database Setup",
    updated_by: "user-3"
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/4ed21a30" },
    assignee_id: "user-6",
    created_by: "user-1",
    deadline: "2025-06-01T09:00:00.000Z",
    description: "Create reusable button, card, and modal components.",
    priority: 2,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "pending",
    task_id: "4ed21a30-83de-4fd6-a9c0-fb2ed24bbec2",
    title: "Develop UI Components",
    updated_by: "user-6"
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/b713a9dc" },
    assignee_id: "user-3",
    created_by: "user-1",
    deadline: null,
    description: "Deploy the prototype to staging environment.",
    priority: 4,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "completed",
    task_id: "b713a9dc-0d77-4ee1-8f63-70b28c8c67bb",
    title: "Deploy to Staging",
    updated_by: "user-3"
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/a48191c0" },
    assignee_id: "user-3",
    created_by: "user-1",
    deadline: null,
    description: "Discuss with team before starting.",
    priority: 4,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "completed",
    task_id: "a48191c0-230d-4f96-9bb8-731feebd23fb",
    title: "Design Homepage",
    updated_by: "user-6"
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/994d9daa" },
    assignee_id: "user-2",
    created_by: "user-1",
    deadline: "2025-06-04T08:54:58.719123",
    description: "Requires design and frontend work.",
    priority: 2,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "pending",
    task_id: "994d9daa-a0c6-46d2-86f3-4db9b27f34d0",
    title: "Define UI Style Guide",
    updated_by: "user-2"
  },
  {
    _links: { project: "/projects/50c8d6d6", self: "/tasks/0d2abb15" },
    assignee_id: "user-6",
    created_by: "user-1",
    deadline: null,
    description: "Follow style guide.",
    priority: 2,
    project_id: "50c8d6d6-1b7e-4d63-9b6c-c0264a136c21",
    status: "completed",
    task_id: "0d2abb15-cd8c-46c5-83bc-53f69ae8dd58",
    title: "Finish Prototype",
    updated_by: "user-4"
  }
];

export default function ProjectTaskKanban({ projectId }: ProjectTaskKanbanProps) {
  const { token } = useAuth();
  const [project, setProject] = useState<Project | null>(dummyProject);
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [updatingTask, setUpdatingTask] = useState<string | null>(null);

  const statusColumns = [
    { key: 'pending', title: 'Pending', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' },
    { key: 'in_progress', title: 'In Progress', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800' },
    { key: 'completed', title: 'Completed', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800' },
  ] as const;

  useEffect(() => {
    if (!token || !projectId) {
      setLoading(false); // skip fetch, already using dummy data
      return;
    }

    fetchProjectAndTasks();
  }, [token, projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const [projectRes, tasksRes] = await Promise.all([
        fetch(`http://127.0.0.1:8080/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://127.0.0.1:8080/tasks?project_id=${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!projectRes.ok || !tasksRes.ok) {
        throw new Error(`HTTP error: ${projectRes.status} / ${tasksRes.status}`);
      }

      const projectData: Project = await projectRes.json();
      const taskData: { tasks: Task[] } = await tasksRes.json();

      setProject(projectData);
      setTasks(taskData.tasks);
    } catch (err) {
    //   console.error(err);
    //   setError("API unreachable – using local dummy data.");
      setProject(dummyProject);
      setTasks(dummyTasks);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task["status"]) => {
    if (!token) return;

    try {
      setUpdatingTask(taskId);

      const res = await fetch(`http://127.0.0.1:8080/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Update failed");

      setTasks(prev => prev.map(t =>
        t.task_id === taskId ? { ...t, status: newStatus } : t
      ));
    } catch (err) {
    //   console.error("Update error:", err);
      fetchProjectAndTasks(); // fallback refresh
    } finally {
      setUpdatingTask(null);
    }
  };

  const getPriorityLabel = (priority: number) =>
    ['Critical', 'High', 'Medium', 'Low', 'Lowest'][priority - 1] || 'Unknown';

  const getPriorityColor = (priority: number) =>
    ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-blue-500', 'text-green-500'][priority - 1] || 'text-gray-500';

  const formatDate = (date: string | null) =>
    date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null;

  if (loading) return <p className="text-center p-6">Loading...</p>;
  if (error) console.warn(error); // just a warning instead of UI error

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-1">{project?.title}</h1>
      <p className="text-gray-600 mb-6">{project?.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statusColumns.map(col => {
          const columnTasks = tasks.filter(t => t.status === col.key);
          return (
            <div
              key={col.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (draggedTask && draggedTask.status !== col.key) {
                  updateTaskStatus(draggedTask.task_id, col.key);
                }
                setDraggedTask(null);
              }}
              className={`p-4 rounded border ${col.bg} ${col.border}`}
            >
              <h2 className="text-xl font-semibold mb-4">{col.title}</h2>
              {columnTasks.length > 0 ? columnTasks.map(task => (
                <div
                  key={task.task_id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = 'move';
                    setDraggedTask(task);
                  }}
                  className={`bg-white dark:bg-gray-800 p-3 rounded border shadow cursor-move ${updatingTask === task.task_id ? 'opacity-50' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{task.title}</h4>
                    <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                  </div>
                  {task.description && <p className="text-sm mt-1 text-gray-600">{task.description}</p>}
                  {task.deadline && (
                    <p className="text-xs mt-2 text-gray-500">Due: {formatDate(task.deadline)}</p>
                  )}
                </div>
              )) : (
                <p className="text-sm text-center text-gray-400">No tasks</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
