import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStartup } from '../../context/StartupContext'; 

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { startups, loading, getStartups } = useStartup(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(window.innerWidth >= 1024);

  useEffect(() => {
    // Use the getStartups method from context instead of direct API call
    getStartups();
  }, [getStartups]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const largeScreen = window.innerWidth >= 1024;
      setIsLargeScreen(largeScreen);
      
      // Auto-open sidebar on large screens
      if (largeScreen && !sidebarOpen) {
        setSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sidebarOpen]);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (!isLargeScreen) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isLargeScreen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isSidebarLinkActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Header with toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white shadow-sm h-16 flex items-center px-4">
        <button 
          onClick={toggleSidebar}
          className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-2 hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
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
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && !isLargeScreen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden transition-opacity duration-300 ease-in-out"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-20 bg-white shadow-xl w-72 flex flex-col ${isLargeScreen ? 'lg:sticky' : 'lg:relative'}`}
      >
        <div className="px-6 py-6 flex items-center justify-between border-b border-gray-100">
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
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-1"
            aria-label="Close sidebar"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user?.firstName ? user.firstName.charAt(0) : 'U'}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.firstName || 'User'}</p>
              <p className="text-sm text-gray-500 truncate max-w-[180px]">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
          <div className="px-6 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 pl-2">Dashboard</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/dashboard" 
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isSidebarLinkActive('/dashboard') 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <svg className={`h-5 w-5 mr-3 ${isSidebarLinkActive('/dashboard') ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-medium">Overview</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="px-6 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 pl-2">Startups</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/dashboard/add-startup" 
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isSidebarLinkActive('/dashboard/add-startup') 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <svg className={`h-5 w-5 mr-3 ${isSidebarLinkActive('/dashboard/add-startup') ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="font-medium">Add Startup</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/my-startups" 
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isSidebarLinkActive('/dashboard/my-startups') 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <svg className={`h-5 w-5 mr-3 ${isSidebarLinkActive('/dashboard/my-startups') ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">My Startups</span>
                  {startups.length > 0 && (
                    <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {startups.length}
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </div>

          <div className="px-6 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3 pl-2">Account</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/dashboard/profile" 
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isSidebarLinkActive('/dashboard/profile') 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <svg className={`h-5 w-5 mr-3 ${isSidebarLinkActive('/dashboard/profile') ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">Profile</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/settings" 
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${isSidebarLinkActive('/dashboard/settings') 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <svg className={`h-5 w-5 mr-3 ${isSidebarLinkActive('/dashboard/settings') ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-medium">Settings</span>
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors duration-200"
          >
            <svg className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pt-0 lg:pt-0">
        {/* Mobile padding for fixed header */}
        <div className="lg:hidden h-16"></div>
        
        <div className="container mx-auto px-4 py-6">
          {/* Pass startups and loading from context instead of state, and getStartups instead of fetchUserStartups */}
          <Outlet context={{ userStartups: startups, fetchUserStartups: getStartups, loading }} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


