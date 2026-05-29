'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, Plus, Trash2, MessageSquare, Clock, CheckSquare } from 'lucide-react';

export default function TaskDetailModal({ task, currentUser, onClose, onSave, onDelete }) {
  // Task state
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [category, setCategory] = useState(task.category || 'personal');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [status, setStatus] = useState(task.status || 'todo');
  const [assignee, setAssignee] = useState(task.assignee || 'Alex');
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [comments, setComments] = useState(task.comments || []);
  const [timeSpent, setTimeSpent] = useState(task.timeSpent || 0);

  // Subtask UI state
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  // Comment UI state
  const [newCommentText, setNewCommentText] = useState('');

  // Timer states
  const [timerRunning, setTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [manualTimeToAdd, setManualTimeToAdd] = useState('');
  const timerRef = useRef(null);

  // Manage timer interval
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning]);

  // Format stopwatch readout (MM:SS)
  const formatStopwatch = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Stopwatch log action
  const handleLogStopwatchTime = () => {
    if (elapsedSeconds > 0) {
      const minutesToLog = Math.ceil(elapsedSeconds / 60);
      setTimeSpent((prev) => prev + minutesToLog);
      setElapsedSeconds(0);
      setTimerRunning(false);
      alert(`Logged ${minutesToLog} minutes from stopwatch timer.`);
    }
  };

  // Manual time log action
  const handleAddManualTime = () => {
    const mins = parseInt(manualTimeToAdd, 10);
    if (!isNaN(mins) && mins > 0) {
      setTimeSpent((prev) => prev + mins);
      setManualTimeToAdd('');
      alert(`Manually added ${mins} minutes to logged time.`);
    }
  };

  // Subtasks actions
  const handleToggleSubtask = (subtaskId) => {
    setSubtasks((prev) =>
      prev.map((s) => (s.id === subtaskId ? { ...s, completed: !s.completed } : s))
    );
  };

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSub = {
      id: Date.now(),
      title: newSubtaskTitle.trim(),
      completed: false,
    };
    setSubtasks((prev) => [...prev, newSub]);
    setNewSubtaskTitle('');
  };

  const handleDeleteSubtask = (subtaskId) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== subtaskId));
  };

  // Comments actions
  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment = {
      id: Date.now(),
      user: currentUser || 'Alex',
      text: newCommentText.trim(),
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
    setNewCommentText('');
  };

  // Submit/Save the whole task details
  const handleSaveAll = () => {
    if (!title.trim()) {
      alert('Title is required');
      return;
    }

    const updatedTask = {
      id: task.id,
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      dueDate,
      status,
      assignee,
      subtasks,
      comments,
      timeSpent,
    };

    onSave(updatedTask);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Task Workspace</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {/* Main Title Input */}
          <div className="form-field" style={{ marginBottom: '1.5rem' }}>
            <label>Task Title</label>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design system database schema"
              style={{ fontSize: '1.1rem', fontWeight: '600' }}
            />
          </div>

          {/* Grid fields: Status, Assignee, Category, Priority, Due Date */}
          <div className="form-grid">
            <div className="form-field">
              <label>Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-field">
              <label>Assignee</label>
              <select
                className="form-select"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
              >
                <option value="Alex">Alex</option>
                <option value="Jordan">Jordan</option>
                <option value="Taylor">Taylor</option>
              </select>
            </div>

            <div className="form-field">
              <label>Category</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-field" style={{ gridColumn: 'span 2' }}>
              <label>Due Date</label>
              <input
                type="date"
                className="form-input"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Description Textarea */}
          <div className="form-field" style={{ marginBottom: '1.5rem' }}>
            <label>Detailed Description</label>
            <textarea
              className="form-textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, resources, or links about this assignment/task..."
            />
          </div>

          <hr style={{ borderColor: 'var(--border)', margin: '1.5rem 0' }} />

          {/* Subtasks Checklist */}
          <div className="detail-section">
            <h3 className="detail-section-title">
              <CheckSquare size={16} /> Subtasks Checklist
            </h3>
            <div className="subtasks-checklist">
              {subtasks.map((sub) => (
                <div key={sub.id} className="subtask-item">
                  <input
                    type="checkbox"
                    className="subtask-checkbox"
                    checked={sub.completed}
                    onChange={() => handleToggleSubtask(sub.id)}
                  />
                  <span className={`subtask-text ${sub.completed ? 'completed' : ''}`}>
                    {sub.title}
                  </span>
                  <button
                    type="button"
                    style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    onClick={() => handleDeleteSubtask(sub.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              
              <form onSubmit={handleAddSubtask} className="subtask-add-row">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add a subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', display: 'flex', gap: '0.25rem' }}>
                  <Plus size={14} /> Add
                </button>
              </form>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border)', margin: '1.5rem 0' }} />

          {/* Time Tracking Widget */}
          <div className="detail-section">
            <h3 className="detail-section-title">
              <Clock size={16} /> Work Timer & Logs
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="time-tracker-widget">
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Session Timer</span>
                  <span className="timer-digits">{formatStopwatch(elapsedSeconds)}</span>
                </div>
                <div className="timer-controls">
                  <button
                    type="button"
                    className={`timer-btn ${timerRunning ? 'active' : ''}`}
                    onClick={() => setTimerRunning(!timerRunning)}
                    title={timerRunning ? 'Pause Timer' : 'Start Timer'}
                  >
                    {timerRunning ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  {elapsedSeconds > 0 && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                      onClick={handleLogStopwatchTime}
                    >
                      Log Time
                    </button>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  Total Logged: <strong style={{ color: 'var(--foreground)' }}>{timeSpent} minutes</strong>
                </span>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Mins"
                    value={manualTimeToAdd}
                    onChange={(e) => setManualTimeToAdd(e.target.value)}
                    style={{ width: '80px', padding: '0.4rem 0.5rem', fontSize: '0.85rem' }}
                    min="1"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleAddManualTime}
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
                  >
                    Add Mins
                  </button>
                </div>
              </div>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border)', margin: '1.5rem 0' }} />

          {/* Comments Section */}
          <div className="detail-section">
            <h3 className="detail-section-title">
              <MessageSquare size={16} /> Discussion Thread
            </h3>
            <div className="comments-list">
              {comments.length === 0 ? (
                <p className="text-muted" style={{ fontSize: '0.85rem', padding: '0.5rem 0' }}>No comments yet. Write one below!</p>
              ) : (
                comments.map((comm) => (
                  <div key={comm.id} className="comment-item">
                    <div className="comment-header">
                      <span className="comment-user">{comm.user}</span>
                      <span className="comment-date">
                        {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {' '}
                        {new Date(comm.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="comment-text">{comm.text}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="comment-input-row">
              <input
                type="text"
                className="form-input"
                placeholder="Post a note or question..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                style={{ fontSize: '0.88rem' }}
              />
              <button type="submit" className="btn btn-secondary" style={{ fontSize: '0.88rem' }}>
                Post
              </button>
            </form>
          </div>

          <hr style={{ borderColor: 'var(--border)', margin: '2rem 0 1rem 0' }} />

          {/* Action Row */}
          <div className="btn-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                if (confirm('Delete this task forever?')) {
                  onDelete(task.id);
                }
              }}
            >
              <Trash2 size={16} /> Delete Task
            </button>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveAll}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
