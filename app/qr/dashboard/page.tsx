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

export default function QRDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [saves, setSaves] = useState<Save[]>([]);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/qr/dashboard', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setSaves(data.saves);
          setQrDataUrl(data.qrDataUrl);
          setProfileUrl(data.profileUrl);
          setIsAdmin(data.isAdmin);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleProfileUpdate = async (formData: FormData) => {
    try {
      const response = await fetch('http://localhost:3001/api/qr/profile', {
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#01206a] to-white flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#01206a] to-white">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/qr" className="text-white font-bold text-xl glow-text">
            QR Profile
          </Link>
          <div className="flex gap-4 items-center">
            {isAdmin && (
              <Link 
                href="/qr/admin"
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all transform hover:-translate-y-0.5 shadow-lg"
              >
                🛠️ Admin Panel
              </Link>
            )}
            <button className="text-white hover:text-blue-300 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white glow-text">Your Dashboard</h1>
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
                  Current resume: <a href={`http://localhost:3001/api/qr/resume/${user.uuid}`} target="_blank" rel="noopener" className="text-blue-300 hover:text-blue-200 underline">View/Download</a>
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

        {/* Saved Profiles Section */}
        <div className="mt-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-white mb-4">Saved Profiles</h3>
            
            {saves.length === 0 ? (
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
                          href={`/qr/u/${save.viewed_uuid}`} 
                          target="_blank"
                          className="text-blue-300 hover:text-blue-200 text-sm underline"
                        >
                          View profile
                        </a>
                        {save.saved_resume_path && (
                          <>
                            <span className="text-white/40">|</span>
                            <a 
                              href={`http://localhost:3001/api/qr/resume/${save.viewed_uuid}`} 
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