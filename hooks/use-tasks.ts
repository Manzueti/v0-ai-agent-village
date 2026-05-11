import { useState, useEffect, useCallback } from 'react';
import { Task, TASK_TEMPLATES } from '@/lib/tasks/types';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/agents/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (templateId: string, customizations: any = {}) => {
    try {
      const response = await fetch('/api/agents/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create_from_template', templateId, customizations }),
      });
      const newTask = await response.json();
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const autoAssign = async (taskId: string) => {
    try {
      const response = await fetch('/api/agents/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'auto_assign', taskId }),
      });
      const updatedTask = await response.json();
      setTasks(prev => prev.map(t => t.id === taskId ? updatedTask : t));
      return updatedTask;
    } catch (error) {
      console.error('Failed to auto-assign task:', error);
    }
  };

  const updateStatus = async (taskId: string, status: string) => {
    try {
      const response = await fetch('/api/agents/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_status', taskId, status }),
      });
      const updatedTask = await response.json();
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
