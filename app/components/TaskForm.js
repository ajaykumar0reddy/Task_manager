'use client';

import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

export default function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      onTaskAdded(newTask);
      setTitle('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="form-group">
        <input
          type="text"
          className="input"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn btn-primary" disabled={loading || !title.trim()}>
          <PlusCircle size={20} />
          Add Task
        </button>
      </form>
    </div>
  );
}
