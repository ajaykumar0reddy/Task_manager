'use client';

import { useState } from 'react';
import { Trash2, CheckCircle, Calendar } from 'lucide-react';

export default function QuestBoard({ quests, onCompleteQuest, onDeleteQuest }) {
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'completed'

  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  const getAttributeBonusText = (attribute) => {
    switch (attribute) {
      case 'strength': return '+Strength XP (Coding)';
      case 'intelligence': return '+Intelligence XP (Studying)';
      case 'focus': return '+Focus XP (Lab Work)';
      case 'agility': return '+Agility XP (Errands)';
      default: return '';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const renderQuestCard = (quest) => {
    const isCompleted = quest.completed;
    
    return (
      <div 
        key={quest.id} 
        className={`quest-card ${quest.questType} ${quest.attribute}-bonus ${isCompleted ? 'completed' : ''}`}
      >
        <div className="quest-meta">
          <span className="quest-type-badge">{quest.questType} Quest</span>
          <span className="quest-stat-bonus">
            {getAttributeBonusText(quest.attribute)}
          </span>
        </div>

        <div>
          <h3 className="quest-title">{quest.title}</h3>
          {quest.description && (
            <p className="quest-desc" style={{ marginTop: '0.4rem' }}>{quest.description}</p>
          )}
        </div>

        {quest.dueDate && !isCompleted && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Calendar size={12} />
            <span>Expires: {formatDate(quest.dueDate)}</span>
          </div>
        )}

        <div className="quest-rewards-box">
          <span className="reward-item xp">+{quest.xpReward} XP</span>
          <span className="reward-item gold">+{quest.goldReward} Gold</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          {!isCompleted ? (
            <>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1, padding: '0.5rem' }}
                onClick={() => onCompleteQuest(quest)}
              >
                <CheckCircle size={16} /> Complete
              </button>
              <button 
                className="btn btn-danger" 
                style={{ padding: '0.5rem' }}
                onClick={() => onDeleteQuest(quest.id)}
                title="Abandon Quest"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <button 
              className="btn btn-danger" 
              style={{ width: '100%', padding: '0.5rem' }}
              onClick={() => onDeleteQuest(quest.id)}
            >
              <Trash2 size={16} /> Remove Record
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Board Tabs */}
      <div className="quest-layout-tabs">
        <button 
          className={`quest-tab-btn ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Quests ({activeQuests.length})
        </button>
        <button 
          className={`quest-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed Log ({completedQuests.length})
        </button>
      </div>

      {/* Grid of Quest Cards */}
      <div className="quest-grid">
        {activeTab === 'active' ? (
          activeQuests.length === 0 ? (
            <div className="rpg-card text-center text-muted" style={{ gridColumn: 'span 3', padding: '3rem 1.5rem' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>⚔️ All Quests Completed! ⚔️</p>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Visit the Tavern to post a new Quest or rest up in the Inn.</p>
            </div>
          ) : (
            activeQuests.map(renderQuestCard)
          )
        ) : (
          completedQuests.length === 0 ? (
            <div className="rpg-card text-center text-muted" style={{ gridColumn: 'span 3', padding: '3rem 1.5rem' }}>
              <p style={{ fontSize: '0.9rem' }}>No completed quests in this adventure log yet.</p>
            </div>
          ) : (
            completedQuests.map(renderQuestCard)
          )
        )}
      </div>
    </div>
  );
}
