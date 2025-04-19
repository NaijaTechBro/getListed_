import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStartup } from '../../context/StartupContext'; 

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { startups, loading, getStartups } = useStartup(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    // Use the getStartups method from context instead of direct API call
    getStartups();
  }, []);

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
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      {/* <div className="lg:hidden fixed top-0 left-0 z-20 p-4">
        <button 
          onClick={toggleSidebar}
          className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div> */}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky transition duration-200 ease-in-out z-10 bg-white shadow-lg w-64 flex flex-col`}
      >
        <div className="px-4 py-6 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-indigo-600">GetListed</Link>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
              {user?.firstName ? user.firstName.charAt(0) : 'U'}
            </div>
            <div>
              <p className="font-medium">{user?.firstName || 'User'}</p>
              <p className="text-sm text-gray-500">{user?.email || ''}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-4 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Dashboard</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/dashboard" 
                  className={`block px-4 py-2 rounded-lg ${isSidebarLinkActive('/dashboard') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Overview
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          <div className="px-4 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Startups</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/dashboard/add-startup" 
                  className={`block px-4 py-2 rounded-lg ${isSidebarLinkActive('/dashboard/add-startup') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Startup
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/my-startups" 
                  className={`block px-4 py-2 rounded-lg ${isSidebarLinkActive('/dashboard/my-startups') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    My Startups
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          <div className="px-4 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Account</h3>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/dashboard/profile" 
                  className={`block px-4 py-2 rounded-lg ${isSidebarLinkActive('/dashboard/profile') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </div>
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard/settings" 
                  className={`block px-4 py-2 rounded-lg ${isSidebarLinkActive('/dashboard/settings') ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </div>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </div>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          {/* Pass startups and loading from context instead of state, and getStartups instead of fetchUserStartups */}
          <Outlet context={{ userStartups: startups, fetchUserStartups: getStartups, loading }} />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;







