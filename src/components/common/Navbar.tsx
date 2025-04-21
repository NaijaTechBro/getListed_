import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  
  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navbarClasses = `
    ${isScrolled ? 'shadow-md bg-white/95 backdrop-blur-sm' : 'bg-white'}
    fixed top-0 left-0 right-0 z-50 py-4 px-4 sm:px-8 flex items-center justify-between transition-all duration-300
  `;

  return (
    <>
      {/* Spacer to prevent content from jumping when navbar becomes fixed */}
      <div className="h-16"></div>
      
      <nav className={navbarClasses}>
        <div className="flex items-center">
          <div className="mr-4 sm:mr-8 flex items-center">
            <svg className="w-7 h-7 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="11" fill="black" />
              <circle cx="12" cy="12" r="8" fill="white" />
              <circle cx="12" cy="12" r="4" fill="black" />
            </svg>
            <Link to="/">
              <span className="ml-2 font-bold text-lg sm:text-xl">GetListed</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4 lg:space-x-6">
            <div className="relative group">
              <Link to="/directory" className="font-medium hover:text-indigo-600 transition-colors">Startups</Link>
            </div>
            <div className="relative group">
              <Link to="/investors" className="font-medium hover:text-indigo-600 transition-colors">For Investors</Link>
            </div>
            <div className="relative group">
              <Link to="/pitch-deck" className="font-medium hover:text-indigo-600 transition-colors">Pitch Deck Builder</Link>
            </div>
            <Link to="/about" className="font-medium hover:text-indigo-600 transition-colors">About</Link>
          </div>
        </div>
        
        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
          {isAuthenticated ? (
            <Link to="/dashboard" className="bg-black text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-md hover:bg-gray-800 transition-colors">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="border border-black px-3 py-1.5 lg:px-4 lg:py-2 rounded-md hover:bg-gray-100 transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-black text-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-md hover:bg-gray-800 transition-colors">
                Register
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-50 border-t border-gray-100">
            <div className="flex flex-col py-4 px-8">
              <Link 
                to="/directory" 
                className="py-2 font-medium hover:text-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Startups
              </Link>
              <Link 
                to="/investors" 
                className="py-2 font-medium hover:text-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                For Investors
              </Link>
              <Link 
                to="/pitch-deck" 
                className="py-2 font-medium hover:text-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Pitch Deck Builder
              </Link>
              <Link 
                to="/about" 
                className="py-2 font-medium hover:text-indigo-600"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="flex flex-col space-y-2 mt-4">
                {isAuthenticated ? (
                  <Link 
                    to="/dashboard" 
                    className="bg-black text-white px-4 py-2 rounded-md text-center hover:bg-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/login" 
                      className="border border-black px-4 py-2 rounded-md text-center hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      className="bg-black text-white px-4 py-2 rounded-md text-center hover:bg-gray-800"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;