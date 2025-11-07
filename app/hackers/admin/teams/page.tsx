'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Team {
  id: number;
  name: string;
  created_at: string;
  approved: boolean;
  member_count: number;
}

export default function AdminTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all');

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/hackers/admin/teams', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setTeams(data.teams);
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (teamId: number, approved: boolean) => {
    try {
      const response = await fetch('/api/hackers/admin/teams/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ teamId, approved })
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setTimeout(() => setMessage(''), 3000);
        await fetchTeams();
      } else {
        const data = await response.json();
        setMessage(data.error || 'Failed to update team');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('Failed to update team');
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

  const filteredTeams = teams.filter(team => {
    if (filterStatus === 'approved') return team.approved;
    if (filterStatus === 'pending') return !team.approved;
    return true;
  });

  const stats = {
    total: teams.length,
    approved: teams.filter(t => t.approved).length,
    pending: teams.filter(t => !t.approved).length,
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
          Team Management
        </h1>

        {/* Message */}
        {message && (
          <div className="mb-4 bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-center">
            <p className="text-blue-200">{message}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 rounded-lg p-6 text-center">
            <h3 className="text-blue-200 text-sm font-medium mb-2">Total Teams</h3>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
          </div>
          
          <div className="bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-lg p-6 text-center">
            <h3 className="text-green-200 text-sm font-medium mb-2">Approved</h3>
            <div className="text-3xl font-bold text-white">{stats.approved}</div>
          </div>
          
          <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-lg p-6 text-center">
            <h3 className="text-yellow-200 text-sm font-medium mb-2">Pending Approval</h3>
            <div className="text-3xl font-bold text-white">{stats.pending}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 mb-6">
          <div>
            <label className="block text-white/80 text-sm mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="w-full md:w-64 px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:border-blue-400"
            >
              <option value="all">All Teams</option>
              <option value="pending">Pending Approval</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>

        {/* Teams Table */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg overflow-hidden">
          {filteredTeams.length === 0 ? (
            <div className="p-8 text-center text-white/60">
              No teams found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20 bg-white/5">
                    <th className="text-left text-white/80 p-4">Team ID</th>
                    <th className="text-left text-white/80 p-4">Team Name</th>
                    <th className="text-left text-white/80 p-4">Members</th>
                    <th className="text-left text-white/80 p-4">Created</th>
                    <th className="text-left text-white/80 p-4">Status</th>
                    <th className="text-left text-white/80 p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.map((team) => (
                    <tr key={team.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="p-4 text-white font-mono">#{team.id}</td>
                      <td className="p-4 text-white font-semibold">{team.name}</td>
                      <td className="p-4 text-white">{team.member_count} {team.member_count === 1 ? 'member' : 'members'}</td>
                      <td className="p-4 text-white/80 text-sm">
                        {new Date(team.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        {team.approved ? (
                          <span className="bg-green-500/20 text-green-200 px-3 py-1 rounded-full text-xs font-medium">
                            Approved
                          </span>
                        ) : (
                          <span className="bg-yellow-500/20 text-yellow-200 px-3 py-1 rounded-full text-xs font-medium">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {team.approved ? (
                          <button
                            onClick={() => handleApprove(team.id, false)}
                            className="px-3 py-1 rounded-lg text-xs font-medium transition-colors bg-red-500/20 text-red-200 hover:bg-red-500/30"
                          >
                            Revoke Approval
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove(team.id, true)}
                            className="px-3 py-1 rounded-lg text-xs font-medium transition-colors bg-green-500/20 text-green-200 hover:bg-green-500/30"
                          >
                            Approve Team
                          </button>
                        )}
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
          Showing {filteredTeams.length} of {teams.length} teams
        </div>
      </div>
    </main>
  );
}

