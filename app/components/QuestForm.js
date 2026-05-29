'use client';

import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';

const REWARD_TIERS = {
  main: { xp: 50, gold: 30 },
  side: { xp: 25, gold: 15 },
  daily: { xp: 10, gold: 5 }
};

export default function QuestForm({ onQuestAdded }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questType, setQuestType] = useState('side'); // 'main' | 'side' | 'daily'
  const [attribute, setAttribute] = useState('intelligence'); // 'strength' | 'intelligence' | 'focus' | 'agility'
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const rewards = REWARD_TIERS[questType];

    const newQuest = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      questType,
      attribute,
      dueDate,
      xpReward: rewards.xp,
      goldReward: rewards.gold,
      completed: false
    };

    onQuestAdded(newQuest);

    // Reset Form
    setTitle('');
    setDescription('');
    setQuestType('side');
    setAttribute('intelligence');
    setDueDate('');
  };

  const currentRewards = REWARD_TIERS[questType];

  return (
    <div className="rpg-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
        ⚔️ Post a Quest at the Tavern
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Title */}
          <div className="form-field full-width">
            <label>Quest Objective (Title)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Conquer Chapter 3 OS Midterm Prep"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="form-field full-width">
            <label>Quest Log Details (Description)</label>
            <textarea 
              className="form-textarea" 
              placeholder="Describe the steps, links, or criteria to successfully complete this quest..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ minHeight: '80px' }}
            />
          </div>

          {/* Quest Type */}
          <div className="form-field">
            <label>Quest Classification</label>
            <select 
              className="form-select"
              value={questType}
              onChange={(e) => setQuestType(e.target.value)}
            >
              <option value="main">Main Quest (High Priority)</option>
              <option value="side">Side Quest (Med Priority)</option>
              <option value="daily">Daily Quest (Low Priority / Repeating)</option>
            </select>
          </div>

          {/* Attribute Target */}
          <div className="form-field">
            <label>Primary Skill Reward</label>
            <select 
              className="form-select"
              value={attribute}
              onChange={(e) => setAttribute(e.target.value)}
            >
              <option value="strength">Coding (+Strength)</option>
              <option value="intelligence">Studying (+Intelligence)</option>
              <option value="focus">Assignments & Labs (+Focus)</option>
              <option value="agility">Errands & Habits (+Agility)</option>
            </select>
          </div>

          {/* Due Date */}
          <div className="form-field full-width">
            <label>Time Limit (Optional Due Date)</label>
            <input 
              type="date" 
              className="form-input" 
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Quest Rewards Preview Banner */}
        <div style={{ marginTop: '1.5rem', backgroundColor: '#090714', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <AlertCircle size={16} />
            <span>Projected Loot Details</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontWeight: '800', fontSize: '0.9rem' }}>
            <span style={{ color: 'var(--xp-color)' }}>+{currentRewards.xp} XP</span>
            <span style={{ color: 'var(--gold-color)' }}>+{currentRewards.gold} Gold</span>
          </div>
        </div>

        {/* Actions */}
        <div className="btn-row" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            <Plus size={18} /> Post Quest
          </button>
        </div>
      </form>
    </div>
  );
}
