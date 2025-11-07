'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  usersWithProfiles: number;
  totalSaves: number;
  recentUsers: number;
  recentSaves: number;
}

interface User {
  email: string;
  name?: string;
  created_at: string;
  resume_path?: string;
}

interface Save {
  viewer_email: string;
  viewer_name?: string;
  viewed_email: string;
  viewed_name?: string;
  saved_at: string;
}

export default function QRAdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [recentSaves, setRecentSaves] = useState<Save[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('/api/hackers/admin', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setRecentUsers(data.recentUsers);
          setRecentSaves(data.recentSaves);
        }
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

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
              href="/hackers/dashboard"
              className="text-white hover:text-blue-300 transition-colors"
            >
              ← Back to User Dashboard
            </Link>
            <Link 
              href="/hackers/admin/users"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              All Users
            </Link>
            <Link 
              href="/hackers/admin/saves"
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all"
            >
              All Saves
            </Link>
            <Link 
              href="/hackers/admin/orders"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all"
            >
              Hardware Orders
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-white text-center mb-8 glow-text">Admin Dashboard</h1>

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-lg p-6 text-center">
              <h3 className="text-blue-200 text-sm font-medium mb-2">Total Users</h3>
              <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
            </div>
            
            <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-lg p-6 text-center">
              <h3 className="text-green-200 text-sm font-medium mb-2">Users with Profiles</h3>
              <div className="text-3xl font-bold text-white">{stats.usersWithProfiles}</div>
              <div className="text-green-200 text-xs mt-1">
                {Math.round((stats.usersWithProfiles / stats.totalUsers) * 100)}% completion
              </div>
            </div>
            
            <div className="bg-purple-500/20 backdrop-blur-md border border-purple-500/30 rounded-lg p-6 text-center">
              <h3 className="text-purple-200 text-sm font-medium mb-2">Total Saves</h3>
              <div className="text-3xl font-bold text-white">{stats.totalSaves}</div>
            </div>
            
            <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-lg p-6 text-center">
              <h3 className="text-yellow-200 text-sm font-medium mb-2">Recent Users (7 days)</h3>
              <div className="text-3xl font-bold text-white">{stats.recentUsers}</div>
            </div>
            
            <div className="bg-gray-500/20 backdrop-blur-md border border-gray-500/30 rounded-lg p-6 text-center">
              <h3 className="text-gray-200 text-sm font-medium mb-2">Recent Saves (7 days)</h3>
              <div className="text-3xl font-bold text-white">{stats.recentSaves}</div>
            </div>
          </div>
        )}

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            href="/hackers/admin/users"
            className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-lg p-6 hover:bg-blue-500/30 transition-all"
          >
            <h3 className="text-blue-200 text-lg font-semibold mb-2">👥 Manage Users</h3>
            <p className="text-white/60 text-sm">View and manage all registered users</p>
          </Link>
          
          <Link 
            href="/hackers/admin/saves"
            className="bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-lg p-6 hover:bg-green-500/30 transition-all"
          >
            <h3 className="text-green-200 text-lg font-semibold mb-2">💾 Profile Saves</h3>
            <p className="text-white/60 text-sm">View all profile save interactions</p>
          </Link>
          
          <Link 
            href="/hackers/admin/orders"
            className="bg-purple-500/20 backdrop-blur-md border border-purple-500/30 rounded-lg p-6 hover:bg-purple-500/30 transition-all"
          >
            <h3 className="text-purple-200 text-lg font-semibold mb-2">📦 Hardware Orders</h3>
            <p className="text-white/60 text-sm">Manage and fulfill team hardware orders</p>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Users */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-white">Recent Users</h3>
              <Link 
                href="/hackers/admin/users"
                className="text-blue-300 hover:text-blue-200 text-sm underline"
              >
                View All
              </Link>
            </div>
            
            {recentUsers.length === 0 ? (
              <p className="text-white/60">No users yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left text-white/80 pb-2">Email</th>
                      <th className="text-left text-white/80 pb-2">Name</th>
                      <th className="text-left text-white/80 pb-2">Created</th>
                      <th className="text-left text-white/80 pb-2">Profile</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-2 text-white">{user.email}</td>
                        <td className="py-2 text-white/80">{user.name || 'No name'}</td>
                        <td className="py-2 text-white/80">{new Date(user.created_at).toLocaleDateString()}</td>
                        <td className="py-2">
                          {user.name || user.resume_path ? (
                            <span className="bg-green-500/20 text-green-200 px-2 py-1 rounded text-xs">Complete</span>
                          ) : (
                            <span className="bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded text-xs">Incomplete</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recent Saves */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-white">Recent Profile Saves</h3>
              <Link 
                href="/hackers/admin/saves"
                className="text-blue-300 hover:text-blue-200 text-sm underline"
              >
                View All
              </Link>
            </div>
            
            {recentSaves.length === 0 ? (
              <p className="text-white/60">No saves yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left text-white/80 pb-2">Viewer</th>
                      <th className="text-left text-white/80 pb-2">Saved</th>
                      <th className="text-left text-white/80 pb-2">When</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSaves.map((save, index) => (
                      <tr key={index} className="border-b border-white/10">
                        <td className="py-2 text-white" title={save.viewer_email}>
                          {save.viewer_name || save.viewer_email}
                        </td>
                        <td className="py-2 text-white/80" title={save.viewed_email}>
                          {save.viewed_name || save.viewed_email}
                        </td>
                        <td className="py-2 text-white/80">{new Date(save.saved_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}