import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StartupCard from '../../components/startup/StartupCard';
import { Startup, StartupFilter } from '../../types';
import { useStartup } from '../../context/StartupContext';

const StartupDirectory: React.FC = () => {
  const location = useLocation();
  const { startups, loading, getStartups } = useStartup();
  
  const [filters, setFilters] = useState<StartupFilter>({
    category: '',
    country: '',
    stage: '',
    searchTerm: ''
  });

  useEffect(() => {
    // Parse query parameters
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get('category');
    
    if (categoryParam) {
      setFilters(prev => ({ ...prev, category: categoryParam }));
    }
    
    fetchStartups();
  }, [location.search]);

  const fetchStartups = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.country) queryParams.append('country', filters.country);
      if (filters.stage) queryParams.append('stage', filters.stage);
      if (filters.searchTerm) queryParams.append('search', filters.searchTerm);
      
      await getStartups(queryParams.toString());
    } catch (error) {
      console.error('Error fetching startups:', error);
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, searchTerm: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStartups();
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">African Startup Directory</h1>
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Search startups..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={filters.searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {['Fintech', 'Healthtech', 'Edtech', 'Agritech', 'E-commerce', 'Clean Energy', 'Logistics', 'AI & ML'].map(cat => (
                  <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                name="country"
                value={filters.country}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Countries</option>
                {['Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Ghana', 'Rwanda', 'Ethiopia', 'Senegal'].map(country => (
                  <option key={country} value={country.toLowerCase()}>{country}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                name="stage"
                value={filters.stage}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Stages</option>
                {['Idea', 'Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'Established'].map(stage => (
                  <option key={stage} value={stage.toLowerCase()}>{stage}</option>
                ))}
              </select>
            </div>
            
            <button
              type="submit"
              className="md:hidden mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Apply Filters
            </button>
          </form>
        </div>
        
        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-4 text-gray-600">
              {startups.length} {startups.length === 1 ? 'startup' : 'startups'} found
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {startups.map((startup) => (
                <StartupCard key={startup._id} startup={startup as unknown as Startup} />
              ))}
            </div>
            
            {startups.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-2xl font-medium text-gray-600 mb-2">No startups found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StartupDirectory;