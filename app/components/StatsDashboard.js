'use client';

import { CheckSquare, Clock, AlertTriangle, Calendar } from 'lucide-react';

export default function StatsDashboard({ tasks, activities }) {
  // Compute Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'completed').length;
  
  const totalTimeLogged = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
  
  // Tasks due today
  const todayStr = new Date().toISOString().split('T')[0];
  const dueTodayTasks = tasks.filter(t => t.dueDate === todayStr && t.status !== 'completed').length;

  // Compute Categories count
  const categories = ['project', 'assignment', 'exam', 'lab', 'personal'];
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = tasks.filter(t => t.category === cat).length;
    return acc;
  }, {});

  // Find max category count to compute percentage width for bars
  const maxCategoryCount = Math.max(...Object.values(categoryCounts), 1);

  // Format logged time
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
  };

  // Helper for displaying time relative to now or simple clean format
  const formatActivityTime = (isoString) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div>
      {/* Stats Cards Strip */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon success">
            <CheckSquare size={24} />
          </div>
          <div className="stat-info">
            <h3>Completion Rate</h3>
            <p>{completionRate}%</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <h3>High Priority Remaining</h3>
            <p>{highPriorityTasks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <h3>Total Time Logged</h3>
            <p>{formatTime(totalTimeLogged)}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon primary">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <h3>Due Today</h3>
            <p>{dueTodayTasks}</p>
          </div>
        </div>
      </div>

      {/* Main Dashboard Visual Grid */}
      <div className="dashboard-grid">
        {/* Category Breakdown Chart Card */}
        <div className="chart-card">
          <h2>Task Breakdown by Category</h2>
          <div className="category-progress-list">
            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const fillPct = (count / maxCategoryCount) * 100;
              return (
                <div key={cat} className="category-progress-item">
                  <div className="category-label-row">
                    <span className="category-name">{cat}</span>
                    <span className="category-count">{count} {count === 1 ? 'task' : 'tasks'}</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className={`progress-bar-fill ${cat}`} 
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Activity Feed Card */}
        <div className="chart-card">
          <h2>Recent Activity Feed</h2>
          {activities.length === 0 ? (
            <p className="text-muted text-center" style={{ padding: '2rem 0' }}>No recent activities logged.</p>
          ) : (
            <div className="activity-feed-list">
              {activities.slice(0, 5).map((act, index) => (
                <div key={act.id || index} className={`activity-feed-item ${index === 0 ? 'active' : ''}`}>
                  <span className="activity-user">{act.user}</span>
                  <span className="activity-action">{act.action}</span>
                  <span className="activity-task">&quot;{act.taskTitle}&quot;</span>
                  <span className="activity-time">{formatActivityTime(act.timestamp)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
