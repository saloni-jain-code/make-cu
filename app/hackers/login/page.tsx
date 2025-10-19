'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function QRLoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/hackers/dashboard';

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:3001/api/hackers/auth/google${next ? `?state=${encodeURIComponent(next)}` : ''}`;
  };

  const handleGitHubLogin = () => {
    window.location.href = `http://localhost:3001/api/hackers/auth/github${next ? `?state=${encodeURIComponent(next)}` : ''}`;
  };

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <Link href="/hackers" className="text-white font-bold text-xl glow-text">
            ← Back to Hackers Home
          </Link>
        </div>
      </nav>

      {/* Login Form */}
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-8 w-full max-w-md">
          <h2 className="text-3xl font-bold text-white text-center mb-2 glow-text">
            Welcome Back
          </h2>
          
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 p-3 rounded-lg mb-4 backdrop-blur-sm">
              {error}
            </div>
          )}
          
          <p className="text-white/80 text-center mb-8">
            Sign in to access your profile
          </p>
          
          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <img 
                src="https://developers.google.com/identity/images/g-logo.png" 
                alt="Google logo"
                className="w-5 h-5"
              />
              Continue with Google
            </button>
            
            <button
              onClick={handleGitHubLogin}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>
          
          <p className="text-white/70 text-center text-sm mt-6 leading-relaxed">
            New here? No worries! Just sign in with Google or GitHub to create your profile.
          </p>
        </div>
      </div>
    </main>
  );
}