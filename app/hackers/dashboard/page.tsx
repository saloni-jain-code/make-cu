'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface User {
  id: string;
  email: string;
  name?: string;
  uuid: string;
  resume_path?: string;
}

interface Save {
  saved_name?: string;
  saved_at: string;
  viewed_uuid: string;
  saved_resume_path?: string;
}

interface Team {
  id: number;
  name: string;
  created_at: string;
}

interface TeamMember {
  id: number;
  name?: string;
  email: string;
  joined_at: string;
}

interface Budget {
  maxBudget: number;
  totalSpent: number;
  remaining: number;
  memberCount: number;
}

interface Purchase {
  id: number;
  name: string;
  description: string;
  quantity: number;
  total_cost: number;
  purchased_at: string;
}

export default function QRDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [saves, setSaves] = useState<Save[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Team state
  const [team, setTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [showTeamForm, setShowTeamForm] = useState<'create' | 'join' | null>(null);
  const [teamFormData, setTeamFormData] = useState({ name: '', password: '' });
  const [teamError, setTeamError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/hackers/dashboard', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setSaves(data.saves);
          setQrDataUrl(data.qrDataUrl);
          setProfileUrl(data.profileUrl);
          setIsAdmin(data.isAdmin);
          
          // Redirect to role selection if no role is set
          if (!data.user.role) {
            window.location.href = '/hackers/select-role';
          }
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    const fetchTeamData = async () => {
      // Only fetch team data for hackers
      if (user?.role !== 'hacker') return;
      
      try {
        const response = await fetch('/api/hackers/teams/current', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched team data:', data.team);
          setTeam(data.team);
          setTeamMembers(data.members || []);
          setBudget(data.budget);
          setPurchases(data.purchases || []);
        }
      } catch (error) {
        console.error('Failed to fetch team data:', error);
      }
    };

    fetchTeamData();
  }, [user]);

  const handleProfileUpdate = async (formData: FormData) => {
    try {
      const response = await fetch('/api/hackers/profile', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (response.ok) {
        // Refresh the page data
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/hackers/logout', {
        method: 'POST',
        credentials: 'include'
      });
      window.location.href = '/hackers';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleTeamSubmit = async (action: 'create' | 'join') => {
    setTeamError('');
    try {
      const response = await fetch(`/api/hackers/teams/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(teamFormData)
      });

      if (response.ok) {
        window.location.reload();
      } else {
        const data = await response.json();
        setTeamError(data.error || `Failed to ${action} team`);
      }
    } catch (error) {
      setTeamError(`Failed to ${action} team`);
    }
  };

  const handleLeaveTeam = async () => {
    if (!confirm('Are you sure you want to leave this team?')) return;
    
    try {
      const response = await fetch('/api/hackers/teams/leave', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Failed to leave team:', error);
    }
  };

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
          <div className="flex gap-4 items-center">
            {user?.role && (
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.role === 'hacker' 
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400' 
                  : 'bg-purple-500/20 text-purple-300 border border-purple-400'
              }`}>
                {user.role === 'hacker' ? '🛠️ Hacker' : '🤝 Sponsor'}
              </span>
            )}
            {user?.role === 'hacker' && team && (
              <Link 
                href="/hackers/shop"
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all transform hover:-translate-y-0.5 shadow-lg"
              >
                🛒 Shop
              </Link>
            )}
            {isAdmin && (
              <Link 
                href="/hackers/admin"
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 shadow-lg"
              >
                🛠️ Admin Panel
              </Link>
            )}
            <button 
              onClick={handleLogout}
              className="text-white bg-white/20 border border-white/30 px-4 py-2 rounded-lg hover:bg-white/30 hover:border-white/40 transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white glow-text">Your Dashboard</h1>
            {user?.role && (
              <p className="text-white/60 mt-2">
                {user.role === 'hacker' 
                  ? 'Manage your profile, team, and hardware purchases' 
                  : 'Manage your sponsor profile and connect with hackers'}
              </p>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Profile Section */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-white mb-4">Your Profile</h3>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleProfileUpdate(formData);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-white mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={user?.name || ''}
                  maxLength={200}
                  className="w-full p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                />
              </div>
              
              <div>
                <label className="block text-white mb-2">Resume (PDF or DOCX)</label>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="w-full p-3 border border-white/30 rounded-lg bg-white/10 text-white backdrop-blur-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              
              {user?.resume_path && (
                <p className="text-white/80">
                  Current resume: <a href={`/api/hackers/resume/${user.uuid}`} target="_blank" rel="noopener" className="text-blue-300 hover:text-blue-200 underline">View/Download</a>
                </p>
              )}
              
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 shadow-lg"
              >
                Save Profile
              </button>
            </form>
          </div>

          {/* QR Code Section */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-white mb-4">Your Public Profile</h3>
            <p className="text-white/80 mb-4">Share this URL or QR code so others can view and save your details:</p>
            
            <div className="mb-4">
              <a 
                href={profileUrl} 
                target="_blank" 
                rel="noopener"
                className="text-blue-300 hover:text-blue-200 underline break-all"
              >
                {profileUrl}
              </a>
            </div>
            
            {qrDataUrl && (
              <div className="bg-white p-4 rounded-lg inline-block">
                <img src={qrDataUrl} alt="QR code linking to your profile" className="w-48 h-48" />
              </div>
            )}
          </div>
        </div>

        {/* Team Management Section - Only for Hackers */}
        {user?.role === 'hacker' && (
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-white mb-4">Team Management</h3>
            
            {team ? (
              <div className="space-y-4">
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-white">{team.name}</h4>
                      <p className="text-white/60 text-sm">Created {new Date(team.created_at).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={handleLeaveTeam}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-200 px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      Leave Team
                    </button>
                  </div>

                  {budget && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                      <h5 className="text-white font-semibold mb-2">Budget</h5>
                      <div className="space-y-1 text-sm">
                        <p className="text-white/80">Total Budget: <span className="text-white font-bold">${budget.maxBudget}</span></p>
                        <p className="text-white/80">Spent: <span className="text-red-300 font-bold">${budget.totalSpent}</span></p>
                        <p className="text-white/80">Remaining: <span className="text-green-300 font-bold">${budget.remaining}</span></p>
                        <p className="text-white/60 text-xs mt-2">Budget formula: $1000 × min(members, 4) = $1000 × {Math.min(budget.memberCount, 4)}</p>
                      </div>
                    </div>
                  )}

                  <div className="mb-4">
                    <h5 className="text-white font-semibold mb-2">Team Members ({teamMembers.length})</h5>
                    <div className="space-y-2">
                      {teamMembers.map((member) => (
                        <div key={member.id} className="bg-white/5 rounded p-2">
                          <p className="text-white">{member.name || 'Unnamed'}</p>
                          <p className="text-white/60 text-xs">{member.email}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    href="/hackers/shop"
                    className="inline-block bg-white/20 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/30 hover:border-white/40 hover:scale-105 hover:shadow-lg hover:shadow-white/20 transition-all duration-200"
                  >
                    Go to Hardware Shop
                  </Link>

                  {purchases.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-white font-semibold mb-2">Purchase History</h5>
                      <div className="space-y-2">
                        {purchases.map((purchase) => (
                          <div key={purchase.id} className="bg-white/5 rounded p-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white">{purchase.name}</p>
                                <p className="text-white/60 text-xs">Quantity: {purchase.quantity}</p>
                              </div>
                              <p className="text-green-300 font-bold">${purchase.total_cost}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-white/80">You are not in a team. Create or join one to access the hardware shop!</p>
                
                {teamError && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg">
                    {teamError}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => { setShowTeamForm('create'); setTeamError(''); setTeamFormData({ name: '', password: '' }); }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    Create Team
                  </button>
                  <button
                    onClick={() => { setShowTeamForm('join'); setTeamError(''); setTeamFormData({ name: '', password: '' }); }}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all"
                  >
                    Join Team
                  </button>
                </div>

                {showTeamForm && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <h4 className="text-white font-semibold mb-4">
                      {showTeamForm === 'create' ? 'Create New Team' : 'Join Existing Team'}
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-white mb-2">Team Name</label>
                        <input
                          type="text"
                          value={teamFormData.name}
                          onChange={(e) => setTeamFormData({ ...teamFormData, name: e.target.value })}
                          className="w-full p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:border-blue-400"
                          placeholder="Enter team name"
                        />
                      </div>
                      <div>
                        <label className="block text-white mb-2">Password</label>
                        <input
                          type="password"
                          value={teamFormData.password}
                          onChange={(e) => setTeamFormData({ ...teamFormData, password: e.target.value })}
                          className="w-full p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:border-blue-400"
                          placeholder="Enter password"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleTeamSubmit(showTeamForm)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
                        >
                          {showTeamForm === 'create' ? 'Create' : 'Join'}
                        </button>
                        <button
                          onClick={() => setShowTeamForm(null)}
                          className="bg-gray-500/20 hover:bg-gray-500/30 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        )}

        {/* Saved Profiles Section */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-white mb-4">Saved Profiles</h3>
            
            {!saves || saves.length === 0 ? (
              <p className="text-white/80">You haven't saved any profiles yet. Scan a QR code and click Save.</p>
            ) : (
              <div className="space-y-4">
                {saves.map((save, index) => (
                  <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-semibold">{save.saved_name || 'Unnamed'}</h4>
                        <p className="text-white/60 text-sm">Saved at: {new Date(save.saved_at).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <a 
                          href={`/hackers/u/${save.viewed_uuid}`} 
                          target="_blank"
                          className="text-blue-300 hover:text-blue-200 text-sm underline"
                        >
                          View profile
                        </a>
                        {save.saved_resume_path && (
                          <>
                            <span className="text-white/40">|</span>
                            <a 
                              href={`/api/hackers/resume/${save.viewed_uuid}`} 
                              target="_blank"
                              className="text-blue-300 hover:text-blue-200 text-sm underline"
                            >
                              Resume
                            </a>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}