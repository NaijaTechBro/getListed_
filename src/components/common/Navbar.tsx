import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white py-4 px-8 flex items-center justify-between shadow-md relative">
      <div className="flex items-center">
        <div className="mr-8 flex items-center">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="11" fill="black" />
            <circle cx="12" cy="12" r="8" fill="white" />
            <circle cx="12" cy="12" r="4" fill="black" />
          </svg>
          <Link to="/"><span className="ml-2 font-bold text-xl">GetListed</span></Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          <div className="relative group">
            <Link to="/directory" className="font-medium hover:text-indigo-600">Startups</Link>
          </div>
          <div className="relative group">
            <Link to="/investors" className="font-medium hover:text-indigo-600">For Investors</Link>
          </div>
          <div className="relative group">
            <Link to="/resources" className="font-medium hover:text-indigo-600">Resources</Link>
          </div>
          <Link to="/pricing" className="font-medium hover:text-indigo-600">Pricing</Link>
        </div>
      </div>
      
      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        <Link to="/login" className="border border-black px-4 py-2 rounded-md hover:bg-gray-100">Login</Link>
        <Link to="/register" className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800">Register</Link>
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-md z-10">
          <div className="flex flex-col py-4 px-8">
            <Link to="/directory" className="py-2 font-medium hover:text-indigo-600">Startups</Link>
            <Link to="/investors" className="py-2 font-medium hover:text-indigo-600">For Investors</Link>
            <Link to="/resources" className="py-2 font-medium hover:text-indigo-600">Resources</Link>
            <Link to="/pricing" className="py-2 font-medium hover:text-indigo-600">Pricing</Link>
            <div className="flex flex-col space-y-2 mt-4">
              <Link to="/login" className="border border-black px-4 py-2 rounded-md text-center hover:bg-gray-100">Login</Link>
              <Link to="/register" className="bg-black text-white px-4 py-2 rounded-md text-center hover:bg-gray-800">Register</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;