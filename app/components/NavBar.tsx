"use client";
import React, { useState, useEffect } from 'react';

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setIsOpen(false); // Close mobile menu after clicking
  };

  // Track active section for highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'schedule', 'training', 'hardware', 'team', 'faq'];
      const scrollPosition = window.scrollY + 100; // Offset for navbar height

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'about', label: 'About' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'training', label: 'Training'},
    { id: 'hardware', label: 'Hardware'},
    { id: 'team', label: "Team"},
    { id: 'faq', label: 'FAQ' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-md border-b border-white/20">
    <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">

      <div className="flex items-center justify-end h-16 pr-4 sm:pr-6 lg:pr-8">
        <div className="flex-shrink-0 mr-auto">
            <div className="flex items-center space-x-2">
                <span className="text-2xl sm:text-lg font-bold text-white">🛠️</span>
                <span onClick={() => scrollToSection('header')} className="text-2xl sm:text-lg font-mono font-bold text-white glow-text">MakeCU</span>
            </div>
        </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
          <div className="flex items-baseline space-x-4 sm:space-x-6 lg:space-x-8 flex-nowrap overflow-hidden">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-white/20 hover:text-white ${
                    activeSection === item.id
                      ? 'text-[white] bg-white/20'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Apply Button */}
              <button 
                onClick={() => window.open('https://forms.gle/sCMs2GZJ2LzeW3Wu7')}
                className="whitespace-nowrap bg-[#01206a] hover:bg-[#01206a] text-white px-6 py-2 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-[#01206a]/50 glow-text"
                style={{
                  textShadow: 'none',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textShadow = '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textShadow = 'none';
                }}
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              <div className="w-6 h-6 flex flex-col items-center justify-center">
                <span
                  className={`block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    isOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                    isOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    isOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'
                  }`}
                />
              </div>
            </button>
          </div>
          {/* Ghost div for MLH trust badge */}
          <div 
            className="hidden md:block" 
            style={{
              display: 'block',
              minWidth: '60px',
              maxWidth: '100px',
              width: '10%',
            }}
          />
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-white/20 backdrop-blur-md`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-white/20 hover:text-white ${
                activeSection === item.id
                  ? 'text-black bg-white/20'
                  : 'text-black hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          {/* Mobile Apply Button */}
          <button 
            onClick={() => window.open('https://forms.gle/sCMs2GZJ2LzeW3Wu7')}
            className="mt-4 bg-[#01206a] hover:bg-[#01206a] text-white px-6 py-3 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-[#01206a]/50 glow-text"
            style={{
              textShadow: 'none',
              transition: 'all 0.2s ease-in-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow = '0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6), 0 0 30px rgba(255,255,255,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = 'none';
            }}
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
    </nav>
  );
};

export default NavBar;