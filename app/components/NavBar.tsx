"use client";
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from "next/navigation";

const NavBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // home dropdown
  const pathname = usePathname();
  const router = useRouter();

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

  const handleNavClick = (sectionId: string, type: string) => {
    if (type === 'link') {
      router.push(sectionId);
    } else {
      if (pathname === "/") {
        scrollToSection(sectionId);
      } else {
        router.push(`/#${sectionId}`); // go back home and jump to section
      }
    }
    setActiveSection(sectionId);
    setIsOpen(false);
  };

  // Track active section for highlighting
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'schedule', 'training', 'hardware', 'judges', 'tracks', 'sponsors', 'faq', 'team'];
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
    { id: 'header', label: 'Home', type: 'scroll' },
    { id: 'schedule', label: 'Schedule', type: 'link' },
    { id: 'hardware', label: 'Hardware', type: 'link' },
    { id: 'team', label: "Contact Us", type: 'scroll' },
  ];

  const homeDropdownItems = [
    { id: 'about', label: 'About', type: 'scroll' },
    { id: 'training', label: 'Training', type: 'scroll' },
    { id: 'judges', label: 'Judges', type: 'scroll' },
    { id: 'tracks', label: 'Tracks', type: 'scroll' },
    { id: 'sponsors', label: 'Sponsors', type: 'scroll' },
    { id: 'faq', label: 'FAQ', type: 'scroll' },
  ]

return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/7 backdrop-blur-md border-b border-white/20">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-16 pr-4 sm:pr-6 lg:pr-8">
          <div className="flex-shrink-0 mr-auto">
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-lg font-bold text-white">🛠️</span>
              <span
                onClick={() => handleNavClick("header", "scroll")}
                className="text-2xl sm:text-lg font-mono font-bold text-white cursor-pointer glow-text"
              >
                MakeCU
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-4 sm:space-x-6 lg:space-x-8 flex-nowrap">
              {navItems.map((item) =>
                item.label === "Home" ? (
                  <div
                    key={item.id}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                    style={{ position: 'relative', display: 'inline-block' }}
                  >
                    <button
                      onClick={() => handleNavClick(item.id, item.type)}
                      className={`px-3 py-2 rounded-md text-lg font-medium transition-all duration-200 hover:bg-white/20 hover:text-white ${
                        activeSection === item.id
                          ? "text-[white] bg-white/20"
                          : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </button>
                    {/* Dropdown */}
                    {isDropdownOpen && (
                      <div 
                        style={{ 
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                        }}
                        className="w-40 rounded-md shadow-lg bg-[#000d3a]/90 backdrop-blur-md border border-white/20 z-[60]"
                      >
                        {homeDropdownItems.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() =>
                              handleNavClick(subItem.id, subItem.type)
                            }
                            className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-white/30 first:rounded-t-md last:rounded-b-md"
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>


                ) : (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.type)}
                    className={`px-3 py-2 rounded-md text-lg font-medium transition-all duration-200 hover:bg-white/20 hover:text-white ${
                      activeSection === item.id
                        ? "text-[white] bg-white/20"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                )
              )}
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
                    isOpen ? "rotate-45 translate-y-1" : "-translate-y-1"
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                    isOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block w-5 h-0.5 bg-current transform transition-all duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-1" : "translate-y-1"
                  }`}
                />
              </div>
            </button>
          </div>

          <div
            className="hidden md:block"
            style={{
              display: "block",
              minWidth: "60px",
              maxWidth: "100px",
              width: "10%",
            }}
          />
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden bg-white/20 backdrop-blur-md`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) =>
              item.label === "Home" ? (
                <div key={item.id}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-black hover:bg-white/20 hover:text-white flex justify-between items-center"
                  >
                    Home
                    <span>{isDropdownOpen ? "▲" : "▼"}</span>
                  </button>
                  {isDropdownOpen && (
                    <div className="ml-4">
                      {homeDropdownItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() =>
                            handleNavClick(subItem.id, subItem.type)
                          }
                          className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-black hover:bg-white/20 hover:text-white"
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.type)}
                  className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-all duration-200 hover:bg-white/20 hover:text-white ${
                    activeSection === item.id
                      ? "text-black bg-white/20"
                      : "text-black hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;