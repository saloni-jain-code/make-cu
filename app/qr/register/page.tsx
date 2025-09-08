'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function QRRegisterPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/qr/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
          name: formData.get('name'),
        }),
      });

      if (response.ok) {
        router.push('/qr/dashboard');
      } else {
        const data = await response.json();
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#01206a] to-white">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <Link href="/qr" className="text-white font-bold text-xl glow-text">
            ← Back to QR Home
          </Link>
        </div>
      </nav>

      {/* Register Form */}
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-white text-center mb-8 glow-text">
            Register
          </h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                placeholder="Enter your email"
              />
            </div>
            
            <div>
              <label className="block text-white mb-2 font-medium">
                Password
              </label>
              <input
                type="password"
                name="password"
                minLength={6}
                required
                className="w-full p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                placeholder="Enter your password (min 6 characters)"
              />
            </div>
            
            <div>
              <label className="block text-white mb-2 font-medium">
                Name (optional)
              </label>
              <input
                type="text"
                name="name"
                maxLength={200}
                className="w-full p-3 border border-white/30 rounded-lg bg-white/10 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                placeholder="Enter your name"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
          
          <p className="text-white/80 text-center mt-6">
            Already have an account?{' '}
            <Link href="/qr/login" className="text-blue-300 hover:text-blue-200 underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}