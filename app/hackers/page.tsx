'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function QRHomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in (this would be replaced with actual auth logic)
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/hackers/auth/check', {
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
      await fetch('/api/hackers/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      window.location.href = '/hackers';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  // <button
  //   key="dashboard"
  //   onClick={() => handleNavClick(item.id, item.type)}
  //   className={`px-3 py-2 rounded-md text-lg font-medium transition-all duration-200 hover:bg-white/20 hover:text-white ${
  //     activeSection === item.id
  //       ? "text-[white] bg-white/20"
  //       : "text-gray-300 hover:text-white"
  //   }`}
  //   >
  //   {item.label}
  // </button>
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
                <Link href="/hackers/dashboard" className="text-white px-3 py-2 rounded-md text-lg font-medium transition-all duration-200 hover:bg-white/20 hover:text-white">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-white px-3 py-2 rounded-md text-lg font-medium transition-all duration-200 hover:bg-white/20 hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/hackers/login" className="text-white text-lg font-medium bg-white/10 border border-white/30 px-4 py-2 rounded-md hover:bg-white/20 hover:border-white/40 transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-6 glow-text">
            Hacker Portal
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
            Create your profile with a QR code, join a team, and shop for hardware.
          </p>
          
          <div className="flex gap-4 justify-center">
            {user ? (
              <Link 
                href="/hackers/dashboard"
                className="bg-white text-[#01206a] px-8 py-3 rounded-lg font-semibold hover:scale-105 hover:shadow-lg hover:shadow-blue-400/60 transition-all duration-200"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/hackers/login"
                  className="bg-white/20 text-lg font-medium backdrop-blur-md border border-white/30 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/30 hover:scale-105 transition-all duration-200"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}