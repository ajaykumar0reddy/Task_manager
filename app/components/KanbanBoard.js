'use client';

import { Calendar, CheckSquare, Clock, ArrowRight, ArrowLeft } from 'lucide-react';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: '#6366f1' },
  { id: 'in_progress', title: 'In Progress', color: '#06b6d4' },
  { id: 'review', title: 'Review', color: '#f59e0b' },
  { id: 'completed', title: 'Completed', color: '#10b981' }
];

export default function KanbanBoard({ tasks, onTaskClick, onUpdateTaskStatus }) {
  const getTasksByStatus = (status) => tasks.filter((t) => t.status === status);

  // Check if date is overdue (only if not completed)
  const isOverdue = (dateStr, status) => {
    if (!dateStr || status === 'completed') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateStr);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getSubtasksCompletedText = (task) => {
    if (!task.subtasks || task.subtasks.length === 0) return '';
    const completed = task.subtasks.filter((s) => s.completed).length;
    return `${completed}/${task.subtasks.length}`;
  };

  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const shiftStatus = (task, direction) => {
    const currentIndex = COLUMNS.findIndex(c => c.id === task.status);
    let nextIndex = currentIndex + direction;
    if (nextIndex >= 0 && nextIndex < COLUMNS.length) {
      onUpdateTaskStatus(task.id, COLUMNS[nextIndex].id);
    }
  };

  return (
    <div className="kanban-board">
      {COLUMNS.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        return (
          <div key={column.id} className="kanban-column">
            <div className="column-header">
              <span className="column-title" style={{ borderLeft: `3px solid ${column.color}`, paddingLeft: '8px' }}>
                {column.title}
              </span>
              <span className="column-count">{columnTasks.length}</span>
            </div>

            <div className="kanban-cards">
              {columnTasks.length === 0 ? (
                <div className="text-center text-muted" style={{ padding: '2rem 0', fontSize: '0.8rem', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
                  No tasks here
                </div>
              ) : (
                columnTasks.map((task) => {
                  const overdue = isOverdue(task.dueDate, task.status);
                  const subtaskProgress = getSubtasksCompletedText(task);
                  
                  return (
                    <div key={task.id} className="task-card">
                      <div className="task-card-header">
                        <span className={`category-badge ${task.category}`}>
                          {task.category}
                        </span>
                        <div className="flex" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className={`priority-indicator ${task.priority}`} title={`Priority: ${task.priority}`} />
                        </div>
                      </div>

                      {/* Card Content click opens detailed modal */}
                      <div onClick={() => onTaskClick(task)}>
                        <h3 className="task-card-title">{task.title}</h3>
                        {task.description && (
                          <p className="task-card-desc">{task.description}</p>
                        )}
                      </div>

                      {/* Task Quick Controls & Info */}
                      <div className="task-card-footer">
                        <div className="task-card-date-row" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                          {task.dueDate && (
                            <span className={`task-card-date ${overdue ? 'overdue' : ''}`}>
                              <Calendar size={12} />
                              {formatDate(task.dueDate)} {overdue ? '(Overdue)' : ''}
                            </span>
                          )}
                          
                          <div className="task-card-meta">
                            {subtaskProgress && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '2px', marginRight: '6px' }} title="Subtasks checklist progress">
                                <CheckSquare size={12} />
                                {subtaskProgress}
                              </span>
                            )}
                            {task.timeSpent > 0 && (
                              <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }} title="Time logged">
                                <Clock size={12} />
                                {task.timeSpent}m
                              </span>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {/* Column shifting buttons */}
                          <div style={{ display: 'flex', gap: '2px' }}>
                            {task.status !== 'todo' && (
                              <button 
                                className="timer-btn" 
                                style={{ width: '22px', height: '22px', border: 'none', background: 'rgba(255,255,255,0.05)' }} 
                                onClick={(e) => { e.stopPropagation(); shiftStatus(task, -1); }}
                                title="Move Left"
                              >
                                <ArrowLeft size={10} />
                              </button>
                            )}
                            {task.status !== 'completed' && (
                              <button 
                                className="timer-btn" 
                                style={{ width: '22px', height: '22px', border: 'none', background: 'rgba(255,255,255,0.05)' }} 
                                onClick={(e) => { e.stopPropagation(); shiftStatus(task, 1); }}
                                title="Move Right"
                              >
                                <ArrowRight size={10} />
                              </button>
                            )}
                          </div>
                          <div className="assignee-avatar" title={`Assigned to ${task.assignee}`}>
                            {getInitials(task.assignee)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
