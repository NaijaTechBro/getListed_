import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Startup, StartupFilter } from '../../types';
import { useStartup } from '../../context/StartupContext';

interface ExtendedStartupShowcaseProps {
  title?: string;
  subtitle?: string;
  category?: string;
  limit?: number;
  showViewAll?: boolean;
  featured?: boolean;
}

const StartupShowcase: React.FC<ExtendedStartupShowcaseProps> = ({
  title = "Featured Startups",
  subtitle = "Discover some of Africa's most innovative ventures",
  category = "",
  limit = 3,
  showViewAll = true,
  featured = true
}) => {
  const { startups, loading, error, getStartups } = useStartup();
  const [filteredStartups, setFilteredStartups] = useState<Startup[]>([]);

  useEffect(() => {
    // Construct filter based on props
    const filter: StartupFilter = {
      featured: featured,
      limit: limit
    };
    
    if (category) {
      filter.category = category;
    }
    
    // Fetch startups with the constructed filter
    const fetchStartups = async () => {
      try {
        await getStartups(filter);
      } catch (err) {
        // Error is already handled in the context
        console.error('Error fetching startups:', err);
      }
    };

    fetchStartups();
  }, [category, limit, featured, getStartups]);

  useEffect(() => {
    // No need to filter again if the API already filtered for us
    // Just use the startups from the context
    setFilteredStartups(startups.slice(0, limit));
  }, [startups, limit]);

  const formatFunding = (amount: number): string => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-center">
        <p className="text-red-700">{error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded-md"
          onClick={() => getStartups()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
          <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
        </div>

        {filteredStartups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No startups to display</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {filteredStartups.map((startup) => (
                <div
                  key={startup._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/startup-profile/${startup._id}`}>
                    <div className="h-48 bg-indigo-50 flex items-center justify-center p-4">
                      {startup.logo ? (
                        <img
                          src={startup.logo}
                          alt={startup.name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/assets/images/placeholder-logo.svg';
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full">
                          <div className="text-5xl font-bold text-indigo-300">{startup.name.charAt(0)}</div>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mr-2">
                          {startup.category}
                        </span>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          {startup.stage}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{startup.name}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{startup.tagline}</p>
                      
                      <div className="flex items-center text-gray-500 text-sm">
                        <span>{startup.city ? `${startup.city}, ` : ''}{startup.country}</span>
                        {startup.metrics?.fundingTotal > 0 && (
                          <>
                            <span className="mx-2">•</span>
                            <span>
                              {formatFunding(startup.metrics.fundingTotal)} raised
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            
            {showViewAll && (
              <div className="text-center mt-10">
                <Link
                  to={category ? `/directory?category=${encodeURIComponent(category.toLowerCase())}` : "/directory"}
                  className="inline-block bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  View All Startups
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StartupShowcase;