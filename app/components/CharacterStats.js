'use client';

import { Shield, Brain, Zap, Target, Coins } from 'lucide-react';

const CLASS_EMOJIS = {
  Scholar: '🧑‍🎓',
  Wizard: '🧙‍♂️',
  Paladin: '🛡️',
  Rogue: '🥷'
};

export default function CharacterStats({ character, onClassChange }) {
  const { name, level, xp, gold, stats, charClass } = character;

  const getEmoji = (cls) => CLASS_EMOJIS[cls] || '🧑‍🎓';

  return (
    <div className="char-panel-grid">
      {/* Left Avatar Card */}
      <div className="rpg-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
        <div className="hero-avatar-area">
          <div className="hero-avatar-big">
            {getEmoji(charClass)}
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>{name}</h2>
            <p className="char-widget-level" style={{ marginTop: '0.25rem' }}>Level {level} {charClass}</p>
          </div>
        </div>

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem' }}>
            <span style={{ color: 'var(--xp-color)' }}>EXP Progress</span>
            <span>{xp} / 100 XP</span>
          </div>
          <div className="bar-container">
            <div className="bar-fill xp" style={{ width: `${xp}%` }} />
          </div>
        </div>

        <div className="gold-counter" style={{ padding: '0.5rem 1rem', backgroundColor: '#090714', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', width: '100%', justifyContent: 'center' }}>
          <Coins size={20} />
          <span>{gold} Gold</span>
        </div>

        <div className="form-field" style={{ width: '100%' }}>
          <label style={{ fontSize: '0.75rem', textAlign: 'center' }}>Change Character Class</label>
          <select 
            className="class-picker" 
            value={charClass}
            onChange={(e) => onClassChange(e.target.value)}
            style={{ width: '100%', textAlignLast: 'center' }}
          >
            <option value="Scholar">Scholar</option>
            <option value="Wizard">Wizard</option>
            <option value="Paladin">Paladin</option>
            <option value="Rogue">Rogue</option>
          </select>
        </div>
      </div>

      {/* Right Stats Details Card */}
      <div className="rpg-card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          Attributes & Skill Trees
        </h2>
        
        <div className="attributes-list">
          {/* Strength / Coding */}
          <div className="attribute-item">
            <div className="attribute-meta">
              <span className="attribute-label" style={{ color: 'var(--strength-color)' }}>
                <Shield size={18} />
                <span>Coding (Strength)</span>
              </span>
              <span className="attribute-val" style={{ color: 'var(--strength-color)' }}>LVL {stats.strength}</span>
            </div>
            <div className="bar-container">
              <div 
                className="bar-fill attribute-bar strength" 
                style={{ width: `${Math.min(stats.strength * 10, 100)}%` }} 
              />
            </div>
          </div>

          {/* Intelligence / Studying */}
          <div className="attribute-item">
            <div className="attribute-meta">
              <span className="attribute-label" style={{ color: 'var(--intelligence-color)' }}>
                <Brain size={18} />
                <span>Studying (Intelligence)</span>
              </span>
              <span className="attribute-val" style={{ color: 'var(--intelligence-color)' }}>LVL {stats.intelligence}</span>
            </div>
            <div className="bar-container">
              <div 
                className="bar-fill attribute-bar intelligence" 
                style={{ width: `${Math.min(stats.intelligence * 10, 100)}%` }} 
              />
            </div>
          </div>

          {/* Focus / Lab Work */}
          <div className="attribute-item">
            <div className="attribute-meta">
              <span className="attribute-label" style={{ color: 'var(--focus-color)' }}>
                <Target size={18} />
                <span>Labs & Tasks (Focus)</span>
              </span>
              <span className="attribute-val" style={{ color: 'var(--focus-color)' }}>LVL {stats.focus}</span>
            </div>
            <div className="bar-container">
              <div 
                className="bar-fill attribute-bar focus" 
                style={{ width: `${Math.min(stats.focus * 10, 100)}%` }} 
              />
            </div>
          </div>

          {/* Agility / Personal */}
          <div className="attribute-item">
            <div className="attribute-meta">
              <span className="attribute-label" style={{ color: 'var(--agility-color)' }}>
                <Zap size={18} />
                <span>Errands & Habits (Agility)</span>
              </span>
              <span className="attribute-val" style={{ color: 'var(--agility-color)' }}>LVL {stats.agility}</span>
            </div>
            <div className="bar-container">
              <div 
                className="bar-fill attribute-bar agility" 
                style={{ width: `${Math.min(stats.agility * 10, 100)}%` }} 
              />
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem', backgroundColor: '#090714', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <p>💡 <strong>How to upgrade Stats:</strong> Completing different Quest categories levels up your attributes! Coding yields Strength, studying yields Intelligence, labs yield Focus, and personal tasks yield Agility.</p>
        </div>
      </div>
    </div>
  );
}
