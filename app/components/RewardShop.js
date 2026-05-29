'use client';

import { useState } from 'react';
import { ShoppingBag, Coins, Plus, Trash2 } from 'lucide-react';

const DEFAULT_SHOP_ITEMS = [
  { id: 1, title: 'Gaming Break', description: 'Play video games for 1 hour guilt-free.', cost: 50, icon: '🎮' },
  { id: 2, title: 'Fancy Coffee', description: 'Treat yourself to a specialty matcha or latte.', cost: 30, icon: '☕' },
  { id: 3, title: 'Cheat Meal', description: 'Indulge in a burger, pizza, or nice dessert.', cost: 100, icon: '🍔' },
  { id: 4, title: 'Lazy Day Pass', description: 'Take a day off from side/daily quests.', cost: 150, icon: '😴' },
  { id: 5, title: 'Movie Night', description: 'Watch a movie or binge your favorite show.', cost: 75, icon: '🍿' }
];

export default function RewardShop({ gold, customRewards, onBuyItem, onAddCustomReward, onDeleteCustomReward }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState(25);
  const [icon, setIcon] = useState('🎁');
  const [showAddForm, setShowAddForm] = useState(false);

  const allItems = [...DEFAULT_SHOP_ITEMS, ...customRewards];

  const handlePurchase = (item) => {
    if (gold < item.cost) {
      alert(`⚔️ Insufficient Gold! You need ${item.cost - gold} more Gold to purchase "${item.title}". Complete more quests!`);
      return;
    }
    onBuyItem(item);
  };

  const handleCreateReward = (e) => {
    e.preventDefault();
    if (!title.trim() || !cost || cost <= 0) return;

    const newReward = {
      id: Date.now(), // Unique ID
      title: title.trim(),
      description: description.trim(),
      cost: Number(cost),
      icon: icon || '🎁',
      isCustom: true
    };

    onAddCustomReward(newReward);

    // Reset Form
    setTitle('');
    setDescription('');
    setCost(25);
    setIcon('🎁');
    setShowAddForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Shop Info & Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--panel-bg)', padding: '1.25rem 2rem', borderRadius: 'var(--radius-lg)', border: '2px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShoppingBag size={24} color="var(--gold-color)" />
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: '800' }}>Tavern Merchant</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Spend your hard-earned gold on well-deserved breaks.</p>
          </div>
        </div>
        
        <div className="gold-counter" style={{ fontSize: '1.35rem' }}>
          <Coins size={24} />
          <span>{gold} Gold</span>
        </div>
      </div>

      {/* Grid of Items */}
      <div className="shop-grid">
        {allItems.map((item) => (
          <div key={item.id} className="shop-card">
            <div className="shop-card-icon">{item.icon}</div>
            <div>
              <h3 className="shop-card-title">{item.title}</h3>
              <p className="shop-card-desc" style={{ marginTop: '0.25rem' }}>{item.description}</p>
            </div>
            
            <div className="shop-price-row">
              <Coins size={16} />
              <span>{item.cost} Gold</span>
            </div>

            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button 
                className="btn btn-gold" 
                style={{ flex: 1, padding: '0.5rem', fontWeight: '800' }}
                onClick={() => handlePurchase(item)}
              >
                Buy Reward
              </button>
              {item.isCustom && (
                <button 
                  className="btn btn-danger" 
                  style={{ padding: '0.5rem' }}
                  onClick={() => onDeleteCustomReward(item.id)}
                  title="Delete Reward"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add custom reward card button */}
        {!showAddForm ? (
          <div 
            className="shop-card" 
            style={{ borderStyle: 'dashed', borderWidth: '2px', cursor: 'pointer', justifyContent: 'center', alignItems: 'center', minHeight: '220px' }}
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={36} color="var(--text-muted)" />
            <span style={{ fontWeight: '700', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Create Custom Reward</span>
          </div>
        ) : null}
      </div>

      {/* Add Custom Reward Modal/Form Overlay */}
      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <div className="modal-header">
              <h2>Create Custom Loot</h2>
              <button className="close-btn" onClick={() => setShowAddForm(false)}>x</button>
            </div>
            
            <form onSubmit={handleCreateReward}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-field">
                  <label>Reward Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. 30 mins Social Media" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                  />
                </div>

                <div className="form-field">
                  <label>Description</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Describe your reward break..." 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                  <div className="form-field">
                    <label>Gold Cost</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      value={cost} 
                      onChange={(e) => setCost(e.target.value)}
                      min="1"
                      required 
                    />
                  </div>
                  
                  <div className="form-field">
                    <label>Emoji Icon</label>
                    <select 
                      className="form-select"
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                    >
                      <option value="🎁">🎁 Gift</option>
                      <option value="🎮">🎮 Game</option>
                      <option value="🍩">🍩 Snack</option>
                      <option value="🍕">🍕 Pizza</option>
                      <option value="😴">😴 Sleep</option>
                      <option value="🍿">🍿 Movie</option>
                      <option value="📱">📱 Mobile</option>
                      <option value="📚">📚 Book</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="btn-row" style={{ marginTop: '1.5rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Post Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
