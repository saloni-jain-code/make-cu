'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<'hacker' | 'sponsor' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError('Please select a role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/hackers/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role: selectedRole })
      });

      if (response.ok) {
        router.push('/hackers/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to set role');
        setLoading(false);
      }
    } catch (error) {
      setError('Failed to set role. Please try again.');
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 glow-text">
            Welcome to MakeCU!
          </h1>
          <p className="text-xl text-white/80">
            Please select your role to continue
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Hacker Card */}
          <button
            onClick={() => setSelectedRole('hacker')}
            className={`p-8 rounded-xl border-2 transition-all transform hover:scale-105 ${
              selectedRole === 'hacker'
                ? 'bg-blue-500/30 border-blue-400 shadow-lg shadow-blue-500/50'
                : 'bg-white/10 border-white/20 hover:bg-white/15'
            }`}
          >
            <div className="text-6xl mb-4">🛠️</div>
            <h2 className="text-3xl font-bold text-white mb-4">Hacker</h2>
            <p className="text-white/80 text-left space-y-2">
              <span className="block">✓ Form or join teams</span>
              <span className="block">✓ Shop for hardware with team budget</span>
              <span className="block">✓ Build amazing projects</span>
              <span className="block">✓ Share your profile & resume</span>
              <span className="block">✓ Connect with sponsors</span>
            </p>
          </button>

          {/* Sponsor Card */}
          <button
            onClick={() => setSelectedRole('sponsor')}
            className={`p-8 rounded-xl border-2 transition-all transform hover:scale-105 ${
              selectedRole === 'sponsor'
                ? 'bg-purple-500/30 border-purple-400 shadow-lg shadow-purple-500/50'
                : 'bg-white/10 border-white/20 hover:bg-white/15'
            }`}
          >
            <div className="text-6xl mb-4">🤝</div>
            <h2 className="text-3xl font-bold text-white mb-4">Sponsor</h2>
            <p className="text-white/80 text-left space-y-2">
              <span className="block">✓ Share your company profile</span>
              <span className="block">✓ Connect with talented hackers</span>
              <span className="block">✓ View hacker profiles & resumes</span>
              <span className="block">✓ Network and recruit</span>
              <span className="block">✓ Support the hackathon community</span>
            </p>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={handleSubmit}
            disabled={!selectedRole || loading}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all transform hover:-translate-y-1 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Setting up...' : 'Continue'}
          </button>
          <p className="text-white/60 text-sm mt-4">
            You can't change your role after selecting
          </p>
        </div>
      </div>
    </main>
  );
}

