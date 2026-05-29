'use client';

import { useState, useEffect } from 'react';
import { User, Compass, Flame, ShoppingBag, Coins } from 'lucide-react';
import CharacterStats from './components/CharacterStats';
import QuestBoard from './components/QuestBoard';
import QuestForm from './components/QuestForm';
import RewardShop from './components/RewardShop';

const INITIAL_CHARACTER = {
  name: 'Academic Hero',
  level: 1,
  xp: 0,
  gold: 50,
  charClass: 'Scholar',
  stats: { strength: 1, intelligence: 1, focus: 1, agility: 1 }
};

const INITIAL_QUESTS = [
  {
    id: 1,
    title: 'Design E-commerce Database Schema',
    description: 'Sketch out ERD and tables for users, orders, and products. Setup indexes for performance.',
    questType: 'main',
    attribute: 'strength',
    dueDate: '2026-06-05',
    xpReward: 50,
    goldReward: 30,
    completed: false
  },
  {
    id: 2,
    title: 'Study OS Thread Sync Mutexes',
    description: 'Read through Chapter 4 slides on semaphores, critical sections, and Banker\'s algorithm.',
    questType: 'side',
    attribute: 'intelligence',
    dueDate: '2026-05-30',
    xpReward: 25,
    goldReward: 15,
    completed: false
  },
  {
    id: 3,
    title: 'Complete Web Dev Flexbox Lab',
    description: 'Build a responsive navigation bar and layout using CSS Flexbox grid parameters.',
    questType: 'side',
    attribute: 'focus',
    dueDate: '2026-05-31',
    xpReward: 25,
    goldReward: 15,
    completed: false
  },
  {
    id: 4,
    title: 'Check Daily Goals & Restock Water',
    description: 'Drink 3L of water, review task calendar, and clean up workspace desk.',
    questType: 'daily',
    attribute: 'agility',
    dueDate: '',
    xpReward: 10,
    goldReward: 5,
    completed: false
  }
];

export default function Home() {
  const [character, setCharacter] = useState(INITIAL_CHARACTER);
  const [quests, setQuests] = useState([]);
  const [customRewards, setCustomRewards] = useState([]);
  const [activeTab, setActiveTab] = useState('character'); // 'character' | 'board' | 'tavern' | 'shop'
  const [levelUpToast, setLevelUpToast] = useState({ visible: false, level: 0 });
  const [mounted, setMounted] = useState(false);

  // Load from localstorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedChar = localStorage.getItem('rpg_char');
      const storedQuests = localStorage.getItem('rpg_quests');
      const storedRewards = localStorage.getItem('rpg_custom_rewards');

      if (storedChar) setCharacter(JSON.parse(storedChar));
      
      if (storedQuests) {
        setQuests(JSON.parse(storedQuests));
      } else {
        setQuests(INITIAL_QUESTS);
        localStorage.setItem('rpg_quests', JSON.stringify(INITIAL_QUESTS));
      }

      if (storedRewards) {
        setCustomRewards(JSON.parse(storedRewards));
      } else {
        setCustomRewards([]);
      }

      setMounted(true);
    }
  }, []);

  // Save character changes
  const saveCharacter = (newChar) => {
    setCharacter(newChar);
    localStorage.setItem('rpg_char', JSON.stringify(newChar));
  };

  // Save quests changes
  const saveQuests = (newQuests) => {
    setQuests(newQuests);
    localStorage.setItem('rpg_quests', JSON.stringify(newQuests));
  };

  // Save custom rewards changes
  const saveCustomRewards = (newRewards) => {
    setCustomRewards(newRewards);
    localStorage.setItem('rpg_custom_rewards', JSON.stringify(newRewards));
  };

  // Toggle class selection
  const handleClassChange = (newClass) => {
    const updated = { ...character, charClass: newClass };
    saveCharacter(updated);
  };

  // Quest Creation Callback
  const handleQuestAdded = (newQuest) => {
    const updatedQuests = [newQuest, ...quests];
    saveQuests(updatedQuests);
    setActiveTab('board'); // Redirect to board
  };

  // Quest Deletion Callback
  const handleQuestDeleted = (id) => {
    if (confirm('Are you sure you want to abandon this quest?')) {
      const updated = quests.filter(q => q.id !== id);
      saveQuests(updated);
    }
  };

  // Quest Completion logic
  const handleCompleteQuest = (quest) => {
    // 1. Mark completed
    const updatedQuests = quests.map(q => q.id === quest.id ? { ...q, completed: true } : q);
    saveQuests(updatedQuests);

    // 2. Add XP and Gold
    let newXp = character.xp + quest.xpReward;
    let newGold = character.gold + quest.goldReward;
    let newLevel = character.level;
    let leveledUp = false;

    // Level up calculation
    if (newXp >= 100) {
      newLevel += 1;
      newXp = newXp - 100;
      leveledUp = true;
    }

    // 3. Upgrade attribute stat
    const newStats = { ...character.stats };
    if (quest.attribute && newStats[quest.attribute] !== undefined) {
      newStats[quest.attribute] += 1;
    }

    const updatedChar = {
      ...character,
      level: newLevel,
      xp: newXp,
      gold: newGold,
      stats: newStats
    };

    saveCharacter(updatedChar);

    // Trigger toast levelup
    if (leveledUp) {
      setLevelUpToast({ visible: true, level: newLevel });
      setTimeout(() => {
        setLevelUpToast({ visible: false, level: 0 });
      }, 4000);
    }
  };

  // Buy Shop Reward Item
  const handleBuyItem = (item) => {
    const updated = {
      ...character,
      gold: character.gold - item.cost
    };
    saveCharacter(updated);
    alert(`🎉 Purchased! You unlocked: "${item.title}" ${item.icon}. Enjoy your break!`);
  };

  // Custom Reward actions
  const handleAddCustomReward = (newReward) => {
    const updated = [...customRewards, newReward];
    saveCustomRewards(updated);
  };

  const handleDeleteCustomReward = (id) => {
    if (confirm('Delete this custom reward option?')) {
      const updated = customRewards.filter(r => r.id !== id);
      saveCustomRewards(updated);
    }
  };

  if (!mounted) {
    return (
      <div style={{ backgroundColor: 'var(--background)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p style={{ fontFamily: 'Press Start 2P', fontSize: '0.8rem' }}>Loading Quest Board...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-row">
          <Flame size={20} color="var(--gold-color)" />
          <h2>QuestBoard</h2>
        </div>

        {/* Character Widget in Sidebar */}
        <div className="char-widget">
          <div className="char-widget-header">
            <div className="char-widget-avatar">
              {character.charClass === 'Scholar' && '🧑‍🎓'}
              {character.charClass === 'Wizard' && '🧙‍♂️'}
              {character.charClass === 'Paladin' && '🛡️'}
              {character.charClass === 'Rogue' && '🥷'}
            </div>
            <div>
              <span className="char-widget-class">{character.charClass}</span>
              <p className="char-widget-level">LVL {character.level}</p>
            </div>
          </div>
          
          <div className="bar-container">
            <div className="bar-fill xp" style={{ width: `${character.xp}%` }} />
          </div>
          
          <div className="gold-counter">
            <Coins size={16} />
            <span>{character.gold}g</span>
          </div>
        </div>

        {/* Menu Buttons */}
        <ul className="nav-menu">
          <li>
            <button 
              className={`nav-item ${activeTab === 'character' ? 'active' : ''}`}
              onClick={() => setActiveTab('character')}
            >
              <User size={18} />
              <span>Character Profile</span>
            </button>
          </li>
          <li>
            <button 
              className={`nav-item ${activeTab === 'board' ? 'active' : ''}`}
              onClick={() => setActiveTab('board')}
            >
              <Compass size={18} />
              <span>Quest Board</span>
            </button>
          </li>
          <li>
            <button 
              className={`nav-item ${activeTab === 'tavern' ? 'active' : ''}`}
              onClick={() => setActiveTab('tavern')}
            >
              <Flame size={18} />
              <span>Tavern (New Quest)</span>
            </button>
          </li>
          <li>
            <button 
              className={`nav-item ${activeTab === 'shop' ? 'active' : ''}`}
              onClick={() => setActiveTab('shop')}
            >
              <ShoppingBag size={18} />
              <span>Merchant (Shop)</span>
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Panel View */}
      <main className="main-content">
        <header className="section-header">
          <div>
            <h1>
              {activeTab === 'character' && 'Hero Profile'}
              {activeTab === 'board' && 'Active Quest Board'}
              {activeTab === 'tavern' && 'Quest Master'}
              {activeTab === 'shop' && 'Merchant Vendor'}
            </h1>
            <p>
              {activeTab === 'character' && 'Inspect your adventurer attributes, class ranks, and experience levels.'}
              {activeTab === 'board' && 'Review current assignments and conquer pending tasks to gain gold.'}
              {activeTab === 'tavern' && 'Post a new academic quest to earn gold and level up.'}
              {activeTab === 'shop' && 'Trade your gold coins for rewards and guilt-free breaks.'}
            </p>
          </div>
        </header>

        <div>
          {activeTab === 'character' && (
            <CharacterStats character={character} onClassChange={handleClassChange} />
          )}

          {activeTab === 'board' && (
            <QuestBoard 
              quests={quests} 
              onCompleteQuest={handleCompleteQuest} 
              onDeleteQuest={handleQuestDeleted} 
            />
          )}

          {activeTab === 'tavern' && (
            <QuestForm onQuestAdded={handleQuestAdded} />
          )}

          {activeTab === 'shop' && (
            <RewardShop 
              gold={character.gold} 
              customRewards={customRewards} 
              onBuyItem={handleBuyItem} 
              onAddCustomReward={handleAddCustomReward}
              onDeleteCustomReward={handleDeleteCustomReward}
            />
          )}
        </div>
      </main>

      {/* Flashing RPG Level Up Toast */}
      {levelUpToast.visible && (
        <div className="toast-levelup">
          <span>🔔 LEVEL UP! 🔔</span>
          <p style={{ marginTop: '0.25rem', fontSize: '0.55rem' }}>You have reached Level {levelUpToast.level}!</p>
        </div>
      )}
    </div>
  );
}
