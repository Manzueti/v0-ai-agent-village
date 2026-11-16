import { useState, useEffect, useCallback } from 'react';
import { Task, TASK_TEMPLATES } from '@/lib/tasks/types';

/** POST to the tasks API; throws on an error response instead of returning the error body as a task. */
async function postTasks(body: Record<string, unknown>): Promise<Task> {
  const response = await fetch('/api/agents/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data?.error ?? `Request failed (${response.status})`);
  return data as Task;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents/tasks');
      const data = await response.json();
      if (Array.isArray(data)) setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (templateId: string, customizations: Partial<Task> = {}) => {
    try {
      const newTask = await postTasks({ action: 'create_from_template', templateId, customizations });
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const autoAssign = async (taskId: string) => {
    try {
      const updatedTask = await postTasks({ action: 'auto_assign', taskId });
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      return updatedTask;
    } catch (error) {
      console.error('Failed to auto-assign task:', error);
    }
  };

  const updateStatus = async (taskId: string, status: string) => {
    try {
      const updatedTask = await postTasks({ action: 'update_status', taskId, status });
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const executeTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || !task.assignedTo) return null;

    try {
      const response = await fetch('/api/agents/tasks/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          taskId, 
          taskTitle: task.title, 
          taskDescription: task.description,
          agentId: task.assignedTo
        }),
      });
      return response; // Stream response
    } catch (error) {
      console.error('Failed to execute task:', error);
    }
  };

  return {
    tasks,
    templates: TASK_TEMPLATES,
    loading,
    refresh: fetchTasks,
    createTask,
    autoAssign,
    updateStatus,
    executeTask
  };
}
