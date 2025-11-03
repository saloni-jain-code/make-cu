'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface HardwareItem {
  id: number;
  name: string;
  description: string;
  cost: number;
  stock: number;
  category: string;
}

interface Budget {
  maxBudget: number;
  totalSpent: number;
  remaining: number;
  memberCount: number;
}

interface Team {
  id: number;
  name: string;
}

export default function HardwareShopPage() {
  const [items, setItems] = useState<HardwareItem[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [quantities, setQuantities] = useState<{[key: number]: number}>({});

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await fetch('/api/hackers/shop', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setItems(data.items);
          setBudget(data.budget);
          setTeam(data.team);
          // Initialize quantities to 1 for each item
          const initialQuantities: {[key: number]: number} = {};
          data.items.forEach((item: HardwareItem) => {
            initialQuantities[item.id] = 1;
          });
          setQuantities(initialQuantities);
        } else {
          window.location.href = '/hackers/dashboard';
        }
      } catch (error) {
        console.error('Failed to fetch shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  const handlePurchase = async (itemId: number, itemCost: number) => {
    const quantity = quantities[itemId] || 1;
    const totalCost = itemCost * quantity;

    if (budget && totalCost > budget.remaining) {
      setPurchaseMessage('Insufficient budget!');
      setTimeout(() => setPurchaseMessage(''), 3000);
      return;
    }

    try {
      const response = await fetch('/api/hackers/shop/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ itemId, quantity })
      });

      if (response.ok) {
        setPurchaseMessage('Purchase successful!');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const data = await response.json();
        setPurchaseMessage(data.error || 'Purchase failed');
        setTimeout(() => setPurchaseMessage(''), 3000);
      }
    } catch (error) {
      setPurchaseMessage('Failed to purchase item');
      setTimeout(() => setPurchaseMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  const categories = ['All', ...new Set(items.map(item => item.category))];
  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/hackers/dashboard" className="text-white font-bold text-xl glow-text">
            ← Back to Dashboard
          </Link>
          {team && budget && (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-white/60 text-sm">Team: {team.name}</p>
                <p className="text-white font-bold">Budget: ${budget.remaining} / ${budget.maxBudget}</p>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white glow-text mb-4">Hardware Shop</h1>
          <p className="text-white/80">Purchase hardware for your hackathon project!</p>
        </div>

        {purchaseMessage && (
          <div className={`mb-6 p-4 rounded-lg ${
            purchaseMessage.includes('successful') 
              ? 'bg-green-500/20 border border-green-500/30 text-green-200' 
              : 'bg-red-500/20 border border-red-500/30 text-red-200'
          }`}>
            {purchaseMessage}
          </div>
        )}

        {/* Budget Display */}
        {budget && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-8">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-white/60 text-sm">Total Budget</p>
                <p className="text-2xl font-bold text-white">${budget.maxBudget}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Spent</p>
                <p className="text-2xl font-bold text-red-300">${budget.totalSpent}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Remaining</p>
                <p className="text-2xl font-bold text-green-300">${budget.remaining}</p>
              </div>
            </div>
            <div className="mt-4 bg-white/10 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-full transition-all"
                style={{ width: `${(budget.remaining / budget.maxBudget) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div 
              key={item.id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 hover:bg-white/15 transition-all"
            >
              <div className="mb-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white">{item.name}</h3>
                  <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs font-bold">
                    ${item.cost}
                  </span>
                </div>
                <p className="text-white/60 text-sm mb-2">{item.description}</p>
                <p className="text-white/80 text-sm">
                  Stock: <span className={item.stock > 10 ? 'text-green-300' : 'text-orange-300'}>{item.stock}</span>
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="text-white text-sm">Qty:</label>
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={quantities[item.id] || 1}
                    onChange={(e) => setQuantities({
                      ...quantities,
                      [item.id]: Math.min(Math.max(1, parseInt(e.target.value) || 1), item.stock)
                    })}
                    className="w-20 p-2 border border-white/30 rounded bg-white/10 text-white text-center focus:outline-none focus:border-blue-400"
                  />
                  <span className="text-white/60 text-sm">
                    = ${item.cost * (quantities[item.id] || 1)}
                  </span>
                </div>

                <button
                  onClick={() => handlePurchase(item.id, item.cost)}
                  disabled={item.stock === 0 || (budget && item.cost * (quantities[item.id] || 1) > budget.remaining)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-500 disabled:hover:to-green-600"
                >
                  {item.stock === 0 ? 'Out of Stock' : 'Purchase'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/60 text-lg">No items found in this category</p>
          </div>
        )}
      </div>
    </main>
  );
}

