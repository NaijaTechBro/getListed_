// client/src/pages/DashboardOverview.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStartup } from '../../context/StartupContext';
import { Startup } from '../../types/index';

const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const { loading, getStartups } = useStartup();
  const [userStartups] = useState<Startup[]>([]);
  const [stats, setStats] = useState({
    totalStartups: 0,
    pendingVerification: 0,
    views: 0,
    connections: 0
  });

  // Fetch user's startups when component mounts
  useEffect(() => {
    const fetchUserStartups = async () => {
      if (user?._id) {
        try {
          // Using the context's getStartups with a query param to filter by user
          await getStartups(`createdBy=${user._id}`);
        } catch (error) {
          console.error('Error fetching user startups:', error);
        }
      }
    };

    fetchUserStartups();
  }, [user, getStartups]);

  // // Update userStartups when startups from context change
  // useEffect(() => {
  //   if (!loading && startups.length > 0) {
  //     // Filter startups that belong to the current user if needed
  //     // This might be redundant if the API already filters by user
  //     const filteredStartups = startups.filter(
  //       startup => startup.createdBy === user?._id
  //     );
  //     setUserStartups(filteredStartups);
  //   }
  // }, [startups, loading, user]);

  // Update stats based on user startups
  useEffect(() => {
    if (userStartups.length > 0) {
      setStats({
        totalStartups: userStartups.length,
        pendingVerification: userStartups.filter(s => !s.isVerified).length,
        views: userStartups.reduce((sum, startup) => sum + (startup.metrics?.views || 0), 0),
        connections: userStartups.reduce((sum, startup) => sum + (startup.metrics?.connections || 0), 0)
      });
    }
  }, [userStartups]);

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
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
          <Link
            to="/dashboard/add-startup"
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
          </Link>

          <Link
            to="/dashboard/my-startups"
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
          </Link>

          <Link
            to="/directory"
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
          </Link>
        </div>
      </div>

      {/* Recent Startups */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Your Recent Startups</h2>
        
        {userStartups.length === 0 ? (
          <div className="text-center py-10">
            <div className="h-20 w-20 mx-auto mb-4 text-gray-400">
              <svg className="h-full w-full" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No startups yet</h3>
            <p className="text-gray-500 mb-4">You haven't added any startups to GetListed</p>
            <Link
              to="/dashboard/add-startup"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Your First Startup
            </Link>
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
                {userStartups.slice(0, 5).map((startup) => (
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
                        <Link
                          to={`/startup/${startup._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </Link>
                        <Link
                          to={`/dashboard/edit-startup/${startup._id}`}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {userStartups.length > 5 && (
              <div className="mt-4 text-right">
                <Link to="/dashboard/my-startups" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                  View all startups →
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardOverview;