'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function QRHomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (this would be replaced with actual auth logic)
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/hackers/auth/check', {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.log('Not authenticated');
      }
    };
    
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3001/api/hackers/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      window.location.href = '/hackers';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-white font-bold text-xl glow-text">
            ← Back to MakeCU
          </Link>
          <div className="flex gap-4">
            {user ? (
              <>
                <Link href="/hackers/dashboard" className="text-white hover:text-blue-300 transition-colors">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-white hover:text-blue-300 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/hackers/login" className="text-white hover:text-blue-300 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-white mb-6 glow-text">
          QR Profile System
        </h1>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Create and share your profile with a QR code. Upload your resume and generate a QR code that links to your profile. Others can scan and save your info.
        </p>
        
        <div className="flex gap-4 justify-center">
          {user ? (
            <Link 
              href="/hackers/dashboard"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/hackers/register"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:-translate-y-1 shadow-lg mr-4"
              >
                Get Started
              </Link>
              <Link 
                href="/hackers/login"
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all transform hover:-translate-y-1 shadow-lg"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-white mb-2">QR Code Generation</h3>
            <p className="text-white/80">Generate unique QR codes that link directly to your profile</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-white mb-2">Resume Upload</h3>
            <p className="text-white/80">Upload and share your resume with potential connections</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-semibold text-white mb-2">Save Profiles</h3>
            <p className="text-white/80">Scan and save other people's profiles for easy access</p>
          </div>
        </div>
      </section>
    </main>
  );
}