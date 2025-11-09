'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  id: number;
  team_id: number;
  team_name: string;
  item_id: number;
  item_name: string;
  item_description: string;
  quantity: number;
  total_cost: number;
  purchased_at: string;
  fulfilled: boolean;
  fulfilled_at: string | null;
  source: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set());
  const [filterStatus, setFilterStatus] = useState<'all' | 'fulfilled' | 'unfulfilled'>('all');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, filterStatus]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/hackers/admin/orders', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search term (team name or item name)
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.item_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by fulfillment status
    if (filterStatus === 'fulfilled') {
      filtered = filtered.filter(order => order.fulfilled);
    } else if (filterStatus === 'unfulfilled') {
      filtered = filtered.filter(order => !order.fulfilled);
    }

    setFilteredOrders(filtered);
  };

  const toggleOrderSelection = (orderId: number) => {
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
    }
  };

  const markAsFulfilled = async (orderIds: number[], fulfilled: boolean) => {
    try {
      const response = await fetch('/api/hackers/admin/orders/fulfill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ purchaseIds: orderIds, fulfilled })
      });

      if (response.ok) {
        setMessage(fulfilled ? 'Orders marked as fulfilled!' : 'Orders marked as unfulfilled!');
        setTimeout(() => setMessage(''), 3000);
        setSelectedOrders(new Set());
        await fetchOrders();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to update orders');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Failed to update orders');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSingleOrderToggle = async (orderId: number, currentStatus: boolean) => {
    await markAsFulfilled([orderId], !currentStatus);
  };

  const handleUndoPurchase = async (orderId: number) => {
    if (!confirm('Are you sure you want to undo this purchase? This will restore the item stock and return the money to the team.')) {
      return;
    }

    try {
      const response = await fetch('/api/hackers/admin/orders/undo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ purchaseId: orderId })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message || 'Purchase undone successfully!');
        setTimeout(() => setMessage(''), 3000);
        await fetchOrders();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to undo purchase');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Failed to undo purchase');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  const stats = {
    total: orders.length,
    fulfilled: orders.filter(o => o.fulfilled).length,
    unfulfilled: orders.filter(o => !o.fulfilled).length,
    totalCost: orders.reduce((sum, o) => sum + o.total_cost, 0),
  };

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/hackers" className="text-white font-bold text-xl glow-text">
            Hacker Profile
          </Link>
          <div className="flex gap-4">
            <Link 
              href="/hackers/admin"
              className="text-white hover:text-blue-300 transition-colors"
            >
              ← Back to Admin Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-white text-center mb-8 glow-text">
          Hardware Orders Management
        </h1>

        {/* Message */}
        {message && (
          <div className="mb-4 bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
            <p className="text-blue-200">{message}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-lg p-6 text-center">
            <h3 className="text-blue-200 text-sm font-medium mb-2">Total Orders</h3>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          
          <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-lg p-6 text-center">
            <h3 className="text-green-200 text-sm font-medium mb-2">Fulfilled</h3>
            <div className="text-3xl font-bold text-white">{stats.fulfilled}</div>
          </div>
          
          <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-lg p-6 text-center">
            <h3 className="text-yellow-200 text-sm font-medium mb-2">Unfulfilled</h3>
            <div className="text-3xl font-bold text-white">{stats.unfulfilled}</div>
          </div>
          
          <div className="bg-purple-500/20 backdrop-blur-md border border-purple-500/30 rounded-lg p-6 text-center">
            <h3 className="text-purple-200 text-sm font-medium mb-2">Total Value</h3>
            <div className="text-3xl font-bold text-white">${stats.totalCost}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Search */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Search by Team or Item Name</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter team or item name..."
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-blue-400"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="block text-white/80 text-sm mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
              >
                <option value="all">All Orders</option>
                <option value="unfulfilled">Unfulfilled Only</option>
                <option value="fulfilled">Fulfilled Only</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedOrders.size > 0 && (
            <div className="flex items-center gap-4 pt-4 border-t border-white/20">
              <span className="text-white/80">{selectedOrders.size} order(s) selected</span>
              <button
                onClick={() => markAsFulfilled(Array.from(selectedOrders), true)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Mark as Fulfilled
              </button>
              <button
                onClick={() => markAsFulfilled(Array.from(selectedOrders), false)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Mark as Unfulfilled
              </button>
              <button
                onClick={() => setSelectedOrders(new Set())}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Clear Selection
              </button>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              No orders found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20 bg-white/5">
                    <th className="text-left text-white/80 p-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="text-left text-white/80 p-4">Order ID</th>
                    <th className="text-left text-white/80 p-4">Team</th>
                    <th className="text-left text-white/80 p-4">Item</th>
                    <th className='text-left text-white/80 p-4'>Source</th>
                    <th className="text-left text-white/80 p-4">Qty</th>
                    <th className="text-left text-white/80 p-4">Cost</th>
                    <th className="text-left text-white/80 p-4">Ordered</th>
                    <th className="text-left text-white/80 p-4">Status</th>
                    <th className="text-left text-white/80 p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.has(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                          className="w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="p-4 text-white font-mono">#{order.id}</td>
                      <td className="p-4 text-white font-semibold">{order.team_name}</td>
                      <td className="p-4 text-white/90">
                        <div className="font-medium">{order.item_name}</div>
                        <div className="text-xs text-white/60">{order.item_description}</div>
                      </td>
                      <td className='p-4 text-white'>{order.source}</td>
                      <td className="p-4 text-white">{order.quantity}</td>
                      <td className="p-4 text-white">${order.total_cost}</td>
                      <td className="p-4 text-white/80 text-sm">
                        {new Date(order.purchased_at).toLocaleString()}
                      </td>
                      <td className="p-4">
                        {order.fulfilled ? (
                          <div>
                            <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-xs font-medium">
                              Fulfilled
                            </span>
                            {order.fulfilled_at && (
                              <div className="text-xs text-white/50 mt-1">
                                {new Date(order.fulfilled_at).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="bg-yellow-500/20 text-yellow-200 px-3 py-1 rounded-full text-xs font-medium">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSingleOrderToggle(order.id, order.fulfilled)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                              order.fulfilled
                                ? 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30'
                                : 'bg-green-500/20 text-green-200 hover:bg-green-500/30'
                            }`}
                          >
                            {order.fulfilled ? 'Mark Unfulfilled' : 'Mark Fulfilled'}
                          </button>
                          <button
                            onClick={() => handleUndoPurchase(order.id)}
                            className="px-3 py-1 rounded-lg text-xs font-medium transition-colors bg-red-500/20 text-red-200 hover:bg-red-500/30"
                            title="Undo this purchase (restore stock and return money)"
                          >
                            Undo
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="mt-4 text-center text-white/60 text-sm">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>
    </main>
  );
}

