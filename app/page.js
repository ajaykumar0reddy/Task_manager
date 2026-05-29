'use client';

import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const demoVariable = "ESLint Demo";

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      if (!response.ok) throw new Error('Failed to fetch tasks');
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTaskAdded = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleComplete = async (task) => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      
      const updatedTask = await response.json();
      setTasks((prev) => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete task');
      
      setTasks((prev) => prev.filter(t => t.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Student Task Management Simple</h1>
        <p>Manage your daily assignments and lab tasks</p>
      </div>
      
      <TaskForm onTaskAdded={handleTaskAdded} />
      
      {loading ? (
        <div className="loader">Loading tasks...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <TaskList 
          tasks={tasks} 
          onToggleComplete={handleToggleComplete} 
          onDeleteTask={handleDeleteTask} 
        />
      )}
    </div>
  );
}
