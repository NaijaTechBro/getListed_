import React, { useState, useEffect } from 'react';

// Mock data for demonstration
const user = {
  firstName: 'Sarah',
  email: 'sarah@example.com',
  _id: '123'
};

const mockStartups = [
  {
    _id: '1',
    name: 'TechInnovate',
    logo: null,
    category: 'SaaS',
    country: 'Kenya',
    isVerified: true,
    metrics: { views: 1240, connections: 58 },
    createdBy: '123'
  },
  {
    _id: '2',
    name: 'GreenEnergy',
    logo: null,
    category: 'CleanTech',
    country: 'Nigeria',
    isVerified: false,
    metrics: { views: 890, connections: 32 },
    createdBy: '123'
  },
  {
    _id: '3',
    name: 'FinanceApp',
    logo: null,
    category: 'FinTech',
    country: 'South Africa',
    isVerified: true,
    metrics: { views: 2100, connections: 124 },
    createdBy: '123'
  }
];

// Main Dashboard Component
const DashboardPage: React.FC =( ) => {
  // State for sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLink, setActiveLink] = useState('/dashboard');
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStartups: 0,
    pendingVerification: 0,
    views: 0,
    connections: 0
  });

  // Mock fetching data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStartups(mockStartups);
      setLoading(false);
      
      // Calculate stats
      setStats({
        totalStartups: mockStartups.length,
        pendingVerification: mockStartups.filter(s => !s.isVerified).length,
        views: mockStartups.reduce((sum, startup) => sum + (startup.metrics?.views || 0), 0),
        connections: mockStartups.reduce((sum, startup) => sum + (startup.metrics?.connections || 0), 0)
      });
    }, 1000);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleNavigation = (path: React.SetStateAction<string>) => {
    setActiveLink(path);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 z-20 p-4">
        <button 
          onClick={toggleSidebar}
          className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky transition duration-200 ease-in-out z-10 bg-white shadow-lg w-64 flex flex-col`}
      >
        <div className="px-4 py-6 flex items-center justify-between">
          <a href="#" className="text-2xl font-bold text-indigo-600" onClick={() => handleNavigation('/dashboard')}>GetListed</a>
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
                <a
                  href="#"
                  onClick={() => handleNavigation('/dashboard')}
                  className={`block px-4 py-2 rounded-lg ${activeLink === '/dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Overview
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div className="px-4 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Startups</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  onClick={() => handleNavigation('/dashboard/add-startup')}
                  className={`block px-4 py-2 rounded-lg ${activeLink === '/dashboard/add-startup' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Startup
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleNavigation('/dashboard/my-startups')}
                  className={`block px-4 py-2 rounded-lg ${activeLink === '/dashboard/my-startups' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    My Startups
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div className="px-4 mb-6">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Account</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  onClick={() => handleNavigation('/dashboard/profile')}
                  className={`block px-4 py-2 rounded-lg ${activeLink === '/dashboard/profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => handleNavigation('/dashboard/settings')}
                  className={`block px-4 py-2 rounded-lg ${activeLink === '/dashboard/settings' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={() => console.log('Logout')}
                  className="w-full text-left block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div>
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user?.firstName || 'Founder'}!</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total Startups</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">All</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold">{stats.totalStartups}</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Pending Verification</h3>
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Verification</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold">{stats.pendingVerification}</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Profile Views</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">30 Days</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold">{formatNumber(stats.views)}</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Connections</h3>
                    <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Total</span>
                  </div>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold">{formatNumber(stats.connections)}</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a
                    href="/dashboard/add-startup"
                    onClick={() => handleNavigation('/dashboard/add-startup')}
                    className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-2">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-900">Add Startup</p>
                      <p className="text-sm text-gray-500">List a new startup on GetListed</p>
                    </div>
                  </a>

                  <a
                    href="/dashboard/my-startups"
                    onClick={() => handleNavigation('/dashboard/my-startups')}
                    className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-2">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-900">Manage Startups</p>
                      <p className="text-sm text-gray-500">Update your startup listings</p>
                    </div>
                  </a>

                  <a
                    href="/directory"
                    onClick={() => handleNavigation('/directory')}
                    className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-center">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-2">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-900">Browse Directory</p>
                      <p className="text-sm text-gray-500">Discover other African startups</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Recent Startups */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Your Recent Startups</h2>
                
                {startups.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="h-20 w-20 mx-auto mb-4 text-gray-400">
                      <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No startups yet</h3>
                    <p className="text-gray-500 mb-4">You haven't added any startups to GetListed</p>
                    <a
                      href="#"
                      onClick={() => handleNavigation('/dashboard/add-startup')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add Your First Startup
                    </a>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {startups.map((startup) => (
                          <tr key={startup._id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                                  {startup.logo ? (
                                    <img src={startup.logo} alt={startup.name} className="h-10 w-10 rounded-full" />
                                  ) : (
                                    <span className="text-gray-500 font-medium">{startup.name.charAt(0)}</span>
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900">{startup.name}</div>
                                  <div className="text-sm text-gray-500">{startup.country}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
                                {startup.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {startup.isVerified ? (
                                <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
                                  Verified
                                </span>
                              ) : (
                                <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {startup.metrics?.views || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <a
                                  href={`#/startup/${startup._id}`}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  View
                                </a>
                                <a
                                  href={`#/dashboard/edit-startup/${startup._id}`}
                                  className="text-gray-600 hover:text-gray-900"
                                >
                                  Edit
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    
                    {startups.length > 5 && (
                      <div className="mt-4 text-right">
                        <a href="#" onClick={() => handleNavigation('/dashboard/my-startups')} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                          View all startups →
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;




// import React, { useState, useEffect } from 'react';
// import { useStartup } from '../../context/StartupContext';
// import { useAuth } from '../../context/AuthContext';
// import { Startup } from '../../types';

// const DashboardPage: React.FC = () => {
//   // Get startup context data and methods
//   const { 
//     startups, 
//     loading, 
//     error, 
//     getStartups 
//   } = useStartup();
  
//   const { user } = useAuth();
  
//   // State for sidebar
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeLink, setActiveLink] = useState('/dashboard');
//   const [stats, setStats] = useState({
//     totalStartups: 0,
//     pendingVerification: 0,
//     views: 0,
//     connections: 0
//   });

//   // Fetch startups on mount
//   useEffect(() => {
//     // Use the context method to fetch startups
//     const fetchStartups = async () => {
//       try {
//         // Filter startups by the current user
//         if (user?._id) {
//           await getStartups(`createdBy=${user._id}`);
//         }
//       } catch (err) {
//         console.error('Error fetching startups:', err);
//       }
//     };

//     fetchStartups();
//   }, [getStartups, user?._id]);

//   // Calculate stats whenever startups change
//   useEffect(() => {
//     if (startups.length > 0) {
//       setStats({
//         totalStartups: startups.length,
//         pendingVerification: startups.filter((s: { isVerified: any; }) => !s.isVerified).length,
//         views: startups.reduce((sum: any, startup: { metrics: { views: any; }; }) => sum + (startup.metrics?.views || 0), 0),
//         connections: startups.reduce((sum: any, startup: { metrics: { connections: any; }; }) => sum + (startup.metrics?.connections || 0), 0)
//       });
//     }
//   }, [startups]);

//   const toggleSidebar = () => {
//     setSidebarOpen(!sidebarOpen);
//   };

//   const handleNavigation = (path: React.SetStateAction<string>) => {
//     setActiveLink(path);
//   };

//   const formatNumber = (num: number) => {
//     if (num >= 1000) {
//       return (num / 1000).toFixed(1) + 'k';
//     }
//     return num.toString();
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Mobile sidebar toggle */}
//       <div className="lg:hidden fixed top-0 left-0 z-20 p-4">
//         <button 
//           onClick={toggleSidebar}
//           className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
//         >
//           <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
//           </svg>
//         </button>
//       </div>

//       {/* Sidebar */}
//       <div 
//         className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky transition duration-200 ease-in-out z-10 bg-white shadow-lg w-64 flex flex-col`}
//       >
//         <div className="px-4 py-6 flex items-center justify-between">
//           <a href="#" className="text-2xl font-bold text-indigo-600" onClick={() => handleNavigation('/dashboard')}>GetListed</a>
//           <button 
//             onClick={toggleSidebar}
//             className="lg:hidden text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md"
//           >
//             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="px-4 py-4 border-b border-gray-200">
//           <div className="flex items-center space-x-3">
//             <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
//               {user?.firstName ? user.firstName.charAt(0) : 'U'}
//             </div>
//             <div>
//               <p className="font-medium">{user?.firstName || 'User'}</p>
//               <p className="text-sm text-gray-500">{user?.email || ''}</p>
//             </div>
//           </div>
//         </div>

//         <nav className="flex-1 py-4 overflow-y-auto">
//           <div className="px-4 mb-6">
//             <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Dashboard</h3>
//             <ul className="space-y-1">
//               <li>
//                 <a
//                   href="#"
//                   onClick={() => handleNavigation('/dashboard')}
//                   className={`block px-4 py-2 rounded-lg ${activeLink === '/dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
//                 >
//                   <div className="flex items-center">
//                     <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//                     </svg>
//                     Overview
//                   </div>
//                 </a>
//               </li>
//             </ul>
//           </div>

//           <div className="px-4 mb-6">
//             <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Startups</h3>
//             <ul className="space-y-1">
//               <li>
//                 <a
//                   href="#"
//                   onClick={() => handleNavigation('/dashboard/add-startup')}
//                   className={`block px-4 py-2 rounded-lg ${activeLink === '/dashboard/add-startup' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
//                 >
//                   <div className="flex items-center">
//                     <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                     </svg>
//                     Add Startup
//                   </div>
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   onClick={() => handleNavigation('/dashboard/my-startups')}
//                   className={`block px-4 py-2 rounded-lg ${activeLink === '/dashboard/my-startups' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
//                 >
//                   <div className="flex items-center">
//                     <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                     </svg>
//                     My Startups
//                   </div>
//                 </a>
//               </li>
//             </ul>
//           </div>

//           <div className="px-4 mb-6">
//             <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Account</h3>
//             <ul className="space-y-1">
//               <li>
//                 <a
//                   href="#"
//                   onClick={() => handleNavigation('/dashboard/profile')}
//                   className={`block px-4 py-2 rounded-lg ${activeLink === '/dashboard/profile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
//                 >
//                   <div className="flex items-center">
//                     <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                     Profile
//                   </div>
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   onClick={() => handleNavigation('/dashboard/settings')}
//                   className={`block px-4 py-2 rounded-lg ${activeLink === '/dashboard/settings' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
//                 >
//                   <div className="flex items-center">
//                     <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                     </svg>
//                     Settings
//                   </div>
//                 </a>
//               </li>
//               <li>
//                 <a
//                   href="#"
//                   onClick={() => console.log('Logout')}
//                   className="w-full text-left block px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
//                 >
//                   <div className="flex items-center">
//                     <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//                     </svg>
//                     Logout
//                   </div>
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="container mx-auto px-4 py-6">
//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//             </div>
//           ) : error ? (
//             <div className="bg-red-50 p-4 rounded-md mb-6">
//               <div className="flex">
//                 <div className="flex-shrink-0">
//                   <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                 </div>
//                 <div className="ml-3">
//                   <h3 className="text-sm font-medium text-red-800">Error loading dashboard data</h3>
//                   <div className="mt-2 text-sm text-red-700">
//                     <p>{error}</p>
//                   </div>
//                   <div className="mt-4">
//                     <button
//                       type="button"
//                       onClick={() => getStartups()}
//                       className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                     >
//                       Try again
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div>
//               <div className="mb-6">
//                 <h1 className="text-2xl font-bold">Dashboard</h1>
//                 <p className="text-gray-600">Welcome back, {user?.firstName || 'Founder'}!</p>
//               </div>

//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 <div className="bg-white rounded-lg shadow-md p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-gray-500 text-sm font-medium">Total Startups</h3>
//                     <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">All</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="text-3xl font-bold">{stats.totalStartups}</div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow-md p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-gray-500 text-sm font-medium">Pending Verification</h3>
//                     <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Verification</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="text-3xl font-bold">{stats.pendingVerification}</div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow-md p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-gray-500 text-sm font-medium">Profile Views</h3>
//                     <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">30 Days</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="text-3xl font-bold">{formatNumber(stats.views)}</div>
//                   </div>
//                 </div>

//                 <div className="bg-white rounded-lg shadow-md p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-gray-500 text-sm font-medium">Connections</h3>
//                     <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Total</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="text-3xl font-bold">{formatNumber(stats.connections)}</div>
//                   </div>
//                 </div>
//               </div>

//               {/* Quick Actions */}
//               <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//                 <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <a
//                     href="#"
//                     onClick={() => handleNavigation('/dashboard/add-startup')}
//                     className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="text-center">
//                       <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-2">
//                         <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                         </svg>
//                       </div>
//                       <p className="font-medium text-gray-900">Add Startup</p>
//                       <p className="text-sm text-gray-500">List a new startup on GetListed</p>
//                     </div>
//                   </a>

//                   <a
//                     href="#"
//                     onClick={() => handleNavigation('/dashboard/my-startups')}
//                     className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="text-center">
//                       <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-2">
//                         <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                         </svg>
//                       </div>
//                       <p className="font-medium text-gray-900">Manage Startups</p>
//                       <p className="text-sm text-gray-500">Update your startup listings</p>
//                     </div>
//                   </a>

//                   <a
//                     href="#"
//                     onClick={() => handleNavigation('/directory')}
//                     className="flex items-center justify-center p-4 border border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//                   >
//                     <div className="text-center">
//                       <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mx-auto mb-2">
//                         <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                         </svg>
//                       </div>
//                       <p className="font-medium text-gray-900">Browse Directory</p>
//                       <p className="text-sm text-gray-500">Discover other African startups</p>
//                     </div>
//                   </a>
//                 </div>
//               </div>

//               {/* Recent Startups */}
//               <div className="bg-white rounded-lg shadow-md p-6">
//                 <h2 className="text-lg font-semibold mb-4">Your Recent Startups</h2>
                
//                 {startups.length === 0 ? (
//                   <div className="text-center py-10">
//                     <div className="h-20 w-20 mx-auto mb-4 text-gray-400">
//                       <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                       </svg>
//                     </div>
//                     <h3 className="text-lg font-medium text-gray-900 mb-1">No startups yet</h3>
//                     <p className="text-gray-500 mb-4">You haven't added any startups to GetListed</p>
//                     <a
//                       href="#"
//                       onClick={() => handleNavigation('/dashboard/add-startup')}
//                       className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                     >
//                       Add Your First Startup
//                     </a>
//                   </div>
//                 ) : (
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead className="bg-gray-50">
//                         <tr>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Startup</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
//                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {startups.map((startup: Startup) => (
//                           <tr key={startup._id}>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <div className="flex items-center">
//                                 <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
//                                   {startup.logo ? (
//                                     <img src={startup.logo} alt={startup.name} className="h-10 w-10 rounded-full" />
//                                   ) : (
//                                     <span className="text-gray-500 font-medium">{startup.name.charAt(0)}</span>
//                                   )}
//                                 </div>
//                                 <div>
//                                   <div className="font-medium text-gray-900">{startup.name}</div>
//                                   <div className="text-sm text-gray-500">{startup.country}</div>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">
//                                 {startup.category}
//                               </span>
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap">
//                               {startup.isVerified ? (
//                                 <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">
//                                   Verified
//                                 </span>
//                               ) : (
//                                 <span className="px-2 inline-flex text-xs leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">
//                                   Pending
//                                 </span>
//                               )}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                               {startup.metrics?.views || 0}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                               <div className="flex space-x-2">
//                                 <a
//                                   href={`#/startup/${startup._id}`}
//                                   className="text-indigo-600 hover:text-indigo-900"
//                                 >
//                                   View
//                                 </a>
//                                 <a
//                                   href={`#/dashboard/edit-startup/${startup._id}`}
//                                   className="text-gray-600 hover:text-gray-900"
//                                 >
//                                   Edit
//                                 </a>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
                    
//                     {startups.length > 5 && (
//                       <div className="mt-4 text-right">
//                         <a href="#" onClick={() => handleNavigation('/dashboard/my-startups')} className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
//                           View all startups →
//                         </a>
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;