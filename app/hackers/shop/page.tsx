'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import HardwareItemCard from './HardwareItemCard';
import CartSummary from './CartSummary';

interface HardwareItem {
  id: number;
  name: string;
  description: string;
  cost: number;
  stock: number;
  category: string;
  compatibility: string;
  image_url: string;
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

interface CartItem {
  item: HardwareItem;
  quantity: number;
}

export default function HardwareShopPage() {
  const [items, setItems] = useState<HardwareItem[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCompatibility, setSelectedCompatibility] = useState('All');
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const response = await fetch('/api/hackers/shop', { credentials: 'include' });
        if (response.ok) {
          const data = await response.json();
          setItems(data.items);
          setBudget(data.budget);
          setTeam(data.team);
        } else {
          // Redirect to dashboard if not authorized (sponsors or no team)
          window.location.href = '/hackers/dashboard';
        }
      } catch (error) {
        console.error('Failed to fetch shop data:', error);
        window.location.href = '/hackers/dashboard';
      } finally {
        setLoading(false);
      }
    };
    fetchShopData();
  }, []);

  const addToCart = (item: HardwareItem, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(ci => ci.item.id === item.id);
      if (existing) {
        return prev.map(ci =>
          ci.item.id === item.id
            ? { ...ci, quantity: Math.min(ci.quantity + quantity, item.stock) }
            : ci
        );
      }
      return [...prev, { item, quantity }];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart(prev => prev.filter(ci => ci.item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQty: number) => {
    setCart(prev =>
      prev.map(ci =>
        ci.item.id === itemId ? { ...ci, quantity: newQty } : ci
      )
    );
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    const totalCost = cart.reduce((sum, ci) => sum + ci.item.cost * ci.quantity, 0);
    // print out item id and quantity for each thing in cart to console
    console.log('Purchasing items:', cart.map(ci => ({ itemId: ci.item.id, quantity: ci.quantity })));

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
        body: JSON.stringify({
          purchases: cart.map(ci => ({ itemId: ci.item.id, quantity: ci.quantity }))
        })
      });

      if (response.ok) {
        setPurchaseMessage('Purchase successful!');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        const data = await response.json();
        setPurchaseMessage(data.error || 'Purchase failed');
        setTimeout(() => setPurchaseMessage(''), 3000);
      }
    } catch (error) {
      setPurchaseMessage('Failed to purchase items');
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
  const compatibilities = ['All', 'Raspberry Pi', 'Arduino', 'Both'];

  let filteredItems = items;
  if (selectedCategory !== 'All') {
    filteredItems = filteredItems.filter(item => item.category === selectedCategory);
  }
  if (selectedCompatibility !== 'All') {
    filteredItems = filteredItems.filter(item => item.compatibility === selectedCompatibility || item.compatibility === 'Both');
  }

  return (
    <main className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/hackers/dashboard" className="text-white font-bold text-xl glow-text">
            ← Back to Dashboard
          </Link>
          {team && budget && (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-white/60 text-sm">Team: {team.name}</p>
                <p className="text-white font-bold">
                  Budget: ${budget.remaining} / ${budget.maxBudget}
                </p>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main content with sidebar */}
      <div className="flex flex-col lg:flex-row container mx-auto px-4 py-8 gap-8">
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-white glow-text mb-4">Hardware Shop</h1>
          <p className="text-white/80 mb-8">Add items to your cart and purchase when ready!</p>

          {purchaseMessage && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                purchaseMessage.includes('successful')
                  ? 'bg-green-500/20 border border-green-500/30 text-green-200'
                  : 'bg-red-500/20 border border-red-500/30 text-red-200'
              }`}
            >
              {purchaseMessage}
            </div>
          )}

          {/* Filters */}
          <p className='text-xs text-white/80 mb-2'>Filter by category.</p>
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
          
          <p className='text-xs text-white/80 mb-2'>Filter by compatibility to your microcontroller.</p>
          <div className="mb-6 flex flex-wrap gap-2">
            {compatibilities.map(comp => (
              <button
                key={comp}
                onClick={() => setSelectedCompatibility(comp)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCompatibility === comp
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {comp}
              </button>
            ))}
          </div>

          {/* Item Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredItems.map(item => (
              <HardwareItemCard
                key={item.id}
                item={item}
                addToCart={addToCart}
              />
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">No items found</p>
            </div>
          )}
        </div>

        {/* Cart Sidebar */}
        <aside className="sticky top-8 self-start w-96 h-fit">
            <CartSummary
              cart={cart}
              budget={budget}
              removeFromCart={removeFromCart}
              updateQuantity={updateQuantity}
              handleCheckout={handleCheckout}
            />
        </aside>


      </div>
    </main>
  );
}
