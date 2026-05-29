'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function TaskForm({ onTaskAdded, currentUser }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('project');
  const [dueDate, setDueDate] = useState('');
  const [assignee, setAssignee] = useState('Alex');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError(null);

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate,
      assignee,
      status: 'todo',
      subtasks: [],
      comments: [],
      timeSpent: 0
    };

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const newTask = await response.json();
      onTaskAdded(newTask);
      
      // Reset form fields
      setTitle('');
      setDescription('');
      setPriority('medium');
      setCategory('project');
      setDueDate('');
      setAssignee(currentUser || 'Alex');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
        Create Task
      </h3>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-field full-width">
            <label>Task Title</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Prepare presentation slides"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-field full-width">
            <label>Description</label>
            <textarea
              className="form-textarea"
              placeholder="Add task notes or syllabus references..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              style={{ minHeight: '60px' }}
            />
          </div>

          <div className="form-field">
            <label>Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              <option value="project">Project</option>
              <option value="assignment">Assignment</option>
              <option value="exam">Exam</option>
              <option value="lab">Lab</option>
              <option value="personal">Personal</option>
            </select>
          </div>

          <div className="form-field">
            <label>Priority</label>
            <select
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-field">
            <label>Due Date</label>
            <input
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <label>Assign To</label>
            <select
              className="form-select"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              disabled={loading}
            >
              <option value="Alex">Alex</option>
              <option value="Jordan">Jordan</option>
              <option value="Taylor">Taylor</option>
            </select>
          </div>
        </div>

        <div className="btn-row" style={{ marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading || !title.trim()}>
            <Plus size={18} /> Create Task
          </button>
        </div>
      </form>
    </div>
  );
}
