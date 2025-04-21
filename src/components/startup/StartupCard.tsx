import React from 'react';
import { Link } from 'react-router-dom';
import { Startup } from '../../types';

interface StartupCardProps {
  startup: Startup;
}

const StartupCard: React.FC<StartupCardProps> = ({ startup }) => {
  const {
    _id,
    name,
    logo,
    tagline,
    category,
    country,
    stage,
    metrics,
    foundingDate,
  } = startup;

  // Format founding date
  const formattedDate = foundingDate ? new Date(foundingDate).getFullYear() : 'N/A';
  
  // Placeholder logo if none is provided
  const logoSrc = logo || '/assets/images/placeholder-logo.svg';

  return (
    <Link 
      to={`/startup-profile/${_id}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
    >
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mr-3">
            <img 
              src={logoSrc} 
              alt={name} 
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/placeholder-logo.svg';
              }}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <span>{country}</span>
              <span className="mx-2">•</span>
              <span>Est. {formattedDate}</span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4 flex-grow">{tagline}</p>
        
        <div className="mt-auto">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-md text-xs font-medium">
              {category}
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-md text-xs font-medium">
              {stage}
            </span>
          </div>
          
          <div className="border-t border-gray-100 pt-3 mt-2">
            <div className="flex justify-between text-sm">
              <div className="text-gray-500">
                <span className="font-medium text-gray-900">{metrics.employees || '0'}</span> employees
              </div>
              <div className="text-gray-500">
                {metrics.fundingTotal ? (
                  <span className="font-medium text-gray-900">${(metrics.fundingTotal / 1000).toFixed(0)}K</span>
                ) : (
                  <span>No funding data</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StartupCard;