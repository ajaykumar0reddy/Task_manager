'use client';

import { useState } from 'react';
import { Search, Calendar, CheckSquare, Clock } from 'lucide-react';

export default function TaskList({ tasks, onTaskClick, onToggleComplete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [sortBy, setSortBy] = useState('dueDateAsc');

  // Filtering Logic
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesAssignee = filterAssignee === 'all' || task.assignee === filterAssignee;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesStatus && matchesAssignee;
  });

  // Sorting Logic
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'dueDateAsc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'dueDateDesc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(b.dueDate) - new Date(a.dueDate);
    }
    if (sortBy === 'priority') {
      const weight = { high: 3, medium: 2, low: 1 };
      return weight[b.priority] - weight[a.priority];
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getSubtasksCompletedText = (task) => {
    if (!task.subtasks || task.subtasks.length === 0) return '';
    const completed = task.subtasks.filter((s) => s.completed).length;
    return `${completed}/${task.subtasks.length} subtasks`;
  };

  return (
    <div>
      {/* Filters Dashboard Header */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            title="Filter by Status"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>

          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            title="Filter by Category"
          >
            <option value="all">All Categories</option>
            <option value="project">Project</option>
            <option value="assignment">Assignment</option>
            <option value="exam">Exam</option>
            <option value="lab">Lab</option>
            <option value="personal">Personal</option>
          </select>

          <select
            className="filter-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            title="Filter by Priority"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            className="filter-select"
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            title="Filter by Assignee"
          >
            <option value="all">All Assignees</option>
            <option value="Alex">Alex</option>
            <option value="Jordan">Jordan</option>
            <option value="Taylor">Taylor</option>
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            title="Sort tasks"
          >
            <option value="dueDateAsc">Due Date (Soonest)</option>
            <option value="dueDateDesc">Due Date (Furthest)</option>
            <option value="priority">Priority (High to Low)</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Task List Rendering */}
      <div className="task-list">
        {sortedTasks.length === 0 ? (
          <div className="card text-center text-muted" style={{ padding: '3rem 1.5rem' }}>
            <p>No tasks match your filters. Try adjusting them or add a new task!</p>
          </div>
        ) : (
          sortedTasks.map((task) => {
            const subtaskProgress = getSubtasksCompletedText(task);
            const isCompleted = task.status === 'completed';
            
            return (
              <div 
                key={task.id} 
                className={`task-item ${isCompleted ? 'completed' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => onTaskClick(task)}
              >
                <div className="task-content">
                  {/* Complete checkbox */}
                  <input
                    type="checkbox"
                    className="subtask-checkbox"
                    checked={isCompleted}
                    onChange={(e) => {
                      e.stopPropagation(); // Avoid triggering details modal click
                      onToggleComplete(task);
                    }}
                    style={{ marginRight: '0.75rem', width: '20px', height: '20px' }}
                    title={isCompleted ? "Mark incomplete" : "Mark completed"}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className="task-title" style={{ fontSize: '1.05rem' }}>
                        {task.title}
                      </span>
                      <span className={`category-badge ${task.category}`} style={{ fontSize: '0.65rem' }}>
                        {task.category}
                      </span>
                      <span className={`priority-indicator ${task.priority}`} title={`Priority: ${task.priority}`} />
                    </div>
                    
                    {task.description && (
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                        {task.description}
                      </p>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Calendar size={12} />
                        {formatDate(task.dueDate)}
                      </span>
                      {subtaskProgress && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <CheckSquare size={12} />
                          {subtaskProgress}
                        </span>
                      )}
                      {task.timeSpent > 0 && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock size={12} />
                          {task.timeSpent} mins logged
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="task-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={(e) => e.stopPropagation()}>
                  <div className="assignee-avatar" title={`Assigned to ${task.assignee}`} style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}>
                    {task.assignee ? task.assignee.substring(0, 2).toUpperCase() : 'A'}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
