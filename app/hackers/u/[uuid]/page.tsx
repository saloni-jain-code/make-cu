'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Profile {
  name?: string;
  uuid: string;
  resume_path?: string;
}

export default function QRProfilePage() {
  const params = useParams();
  const uuid = params.uuid as string;
  
  const [profile, setProfile] = useState<Profile | null>(null);
  const [canSave, setCanSave] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/hackers/u/${uuid}`, {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setProfile(data.profile);
          setCanSave(data.canSave);
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (uuid) {
      fetchProfile();
    }
  }, [uuid]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:3001/api/hackers/save/${uuid}`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setSaveMessage('Profile saved successfully!');
        setCanSave(false);
      } else {
        setSaveMessage('Failed to save profile. Please try again.');
      }
    } catch (error) {
      setSaveMessage('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen">
        <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="container mx-auto px-4 py-4">
            <Link href="/hackers" className="text-white font-bold text-xl glow-text">
              Hacker Profile
            </Link>
          </div>
        </nav>
        
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-white mb-4 glow-text">Profile Not Found</h1>
          <p className="text-white/80 mb-8">The profile you're looking for doesn't exist.</p>
          <Link 
            href="/hackers"
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 shadow-lg"
          >
            Back to Home
          </Link>
        </div>
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
            {user && (
              <Link 
                href="/hackers/dashboard"
                className="text-white hover:text-blue-300 transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4 glow-text">
              {profile.name || 'Profile'}
            </h1>
          </div>

          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">Shareable ID:</label>
                <code className="bg-white/10 text-white px-3 py-2 rounded border border-white/20 font-mono text-sm">
                  {profile.uuid}
                </code>
              </div>

              {profile.resume_path ? (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Resume:</label>
                  <a 
                    href={`http://localhost:3001/api/hackers/resume/${profile.uuid}`} 
                    target="_blank" 
                    rel="noopener"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all transform hover:-translate-y-0.5 shadow-lg"
                  >
                    📄 View/Download Resume
                  </a>
                </div>
              ) : (
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">Resume:</label>
                  <p className="text-white/60">No resume uploaded.</p>
                </div>
              )}

              {/* Save Actions */}
              <div className="pt-4 border-t border-white/20">
                {saveMessage && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    saveMessage.includes('successfully') 
                      ? 'bg-green-500/20 border border-green-500/30 text-green-200' 
                      : 'bg-red-500/20 border border-red-500/30 text-red-200'
                  }`}>
                    {saveMessage}
                  </div>
                )}

                {canSave ? (
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {saving ? 'Saving...' : 'Save this profile'}
                  </button>
                ) : !user ? (
                  <Link 
                    href={`/hackers/login?next=${encodeURIComponent(`/hackers/u/${profile.uuid}`)}`}
                    className="inline-block bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 shadow-lg"
                  >
                    Login to save this profile
                  </Link>
                ) : (
                  <p className="text-white/60">This is your profile.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}