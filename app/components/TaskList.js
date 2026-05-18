'use client';

import { CheckCircle, Circle, Trash2 } from 'lucide-react';

export default function TaskList({ tasks, onToggleComplete, onDeleteTask }) {
  if (tasks.length === 0) {
    return (
      <div className="card text-center text-muted">
        <p>No tasks yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <div className="task-content">
            <button 
              className={`btn ${task.completed ? 'btn-success' : 'btn-danger'}`}
              onClick={() => onToggleComplete(task)}
              title={task.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {task.completed ? <CheckCircle size={24} /> : <Circle size={24} color="var(--text-muted)" />}
            </button>
            <span className="task-title">{task.title}</span>
          </div>
          
          <div className="task-actions">
            <button 
              className="btn btn-danger"
              onClick={() => onDeleteTask(task.id)}
              title="Delete task"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
