// // client/src/components/startup/StartupShowcase.tsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { getStartups } from '../../services/api';
// import { Startup } from '../../types';

// interface StartupShowcaseProps {
//   title?: string;
//   subtitle?: string;
//   category?: string;
//   limit?: number;
//   showViewAll?: boolean;
//   featured?: boolean;
// }

// const StartupShowcase: React.FC<StartupShowcaseProps> = ({
//   title = "Featured Startups",
//   subtitle = "Discover some of Africa's most innovative ventures",
//   category = "",
//   limit = 3,
//   showViewAll = true,
//   featured = true
// }) => {
//   const [startups, setStartups] = useState<Startup[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>("");

//   useEffect(() => {
//     fetchStartups();
//   }, [category, limit, featured]);

//   const fetchStartups = async () => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams();
//       if (category) queryParams.append('category', category);
//       if (featured) queryParams.append('featured', 'true');
//       queryParams.append('limit', limit.toString());
      
//       const response = await getStartups(queryParams.toString());
//       setStartups(response.data);
//     } catch (error) {
//       console.error('Error fetching startups:', error);
//       setError('Failed to load featured startups.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 p-4 rounded-lg text-center">
//         <p className="text-red-700">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="py-12">
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-10">
//           <h2 className="text-3xl font-bold text-gray-900">{title}</h2>
//           <p className="mt-2 text-lg text-gray-600">{subtitle}</p>
//         </div>

//         {startups.length === 0 ? (
//           <div className="text-center py-8">
//             <p className="text-gray-500">No startups to display</p>
//           </div>
//         ) : (
//           <>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               {startups.map((startup) => (
//                 <div
//                   key={startup._id}
//                   className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
//                 >
//                   <Link to={`/startup/${startup._id}`}>
//                     <div className="h-48 bg-indigo-50 flex items-center justify-center p-4">
//                       {startup.logo ? (
//                         <img
//                           src={startup.logo}
//                           alt={startup.name}
//                           className="max-h-full max-w-full object-contain"
//                           onError={(e) => {
//                             (e.target as HTMLImageElement).src = '/assets/images/placeholder-logo.svg';
//                           }}
//                         />
//                       ) : (
//                         <div className="text-2xl font-bold text-indigo-300">{startup.name.charAt(0)}</div>
//                       )}
//                     </div>
                    
//                     <div className="p-6">
//                       <div className="flex items-center mb-2">
//                         <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mr-2">
//                           {startup.category}
//                         </span>
//                         <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
//                           {startup.stage}
//                         </span>
//                       </div>
                      
//                       <h3 className="text-xl font-bold text-gray-900 mb-2">{startup.name}</h3>
//                       <p className="text-gray-600 mb-4 line-clamp-2">{startup.tagline}</p>
                      
//                       <div className="flex items-center text-gray-500 text-sm">
//                         <span>{startup.city ? `${startup.city}, ` : ''}{startup.country}</span>
//                         {startup.metrics.fundingTotal > 0 && (
//                           <>
//                             <span className="mx-2">•</span>
//                             <span>
//                               ${startup.metrics.fundingTotal >= 1000000
//                                 ? (startup.metrics.fundingTotal / 1000000).toFixed(1) + 'M'
//                                 : (startup.metrics.fundingTotal / 1000).toFixed(0) + 'K'} raised
//                             </span>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   </Link>
//                 </div>
//               ))}
//             </div>
            
//             {showViewAll && (
//               <div className="text-center mt-10">
//                 <Link
//                   to={category ? `/directory?category=${category.toLowerCase()}` : "/directory"}
//                   className="inline-block bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-50 transition-colors"
//                 >
//                   View All Startups
//                 </Link>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default StartupShowcase;



// client/src/components/startup/StartupShowcase.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Startup } from '../../types';

interface StartupShowcaseProps {
  title?: string;
  subtitle?: string;
  category?: string;
  limit?: number;
  showViewAll?: boolean;
  featured?: boolean;
}

// Mock data for startups
const MOCK_STARTUPS: Startup[] = [
  {
    _id: '1',
    name: 'GreenEnergy Africa',
    tagline: 'Renewable energy solutions for rural communities',
    description: 'Providing sustainable energy solutions across rural Africa',
    category: 'CleanTech',
    stage: 'Series A',
    foundingDate: '2019',
    logo: '/assets/images/mock/greenenergy-logo.svg',
    city: 'Nairobi',
    country: 'Kenya',
    website: 'https://greenenergy.africa',
    metrics: {
      fundingTotal: 3500000,
      employees: 42,
      revenue: 15000000
    },
    subCategory: '',
    socialProfiles: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    founders: [],
    createdBy: '',
    isVerified: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    _id: '2',
    name: 'FinPlus',
    tagline: 'Digital banking for the unbanked',
    description: 'Bringing financial services to underserved communities',
    category: 'FinTech',
    stage: 'Seed',
    logo: '/assets/images/mock/finplus-logo.svg',
    city: 'Lagos',
    country: 'Nigeria',
    website: 'https://finplus.app',
    foundingDate: '2021',
    metrics: {
      fundingTotal: 750000,
      employees: 15,
      revenue: 4000000
    },
    subCategory: '',
    socialProfiles: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    founders: [],
    createdBy: '',
    isVerified: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    _id: '3',
    name: 'HealthConnect',
    tagline: 'Telemedicine for everyone',
    description: 'Connecting patients with healthcare professionals remotely',
    category: 'HealthTech',
    stage: 'Series B',
    foundingDate: '2018',
    logo: '',
    city: 'Cape Town',
    country: 'South Africa',
    website: 'https://healthconnect.co.za',
    metrics: {
      fundingTotal: 12000000,
      employees: 78,
      revenue: 50000000
    },
    subCategory: '',
    socialProfiles: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    founders: [],
    createdBy: '',
    isVerified: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    _id: '4',
    name: 'EduTech',
    tagline: 'Making quality education accessible',
    description: 'Online learning platform for students across Africa',
    category: 'EdTech',
    stage: 'Pre-seed',
    foundingDate: '2022',
    logo: '/assets/images/mock/edutech-logo.svg',
    city: 'Accra',
    country: 'Ghana',
    website: 'https://edutech.africa',
    metrics: {
      fundingTotal: 250000,
      employees: 8,
      revenue: 1200000
    },
    subCategory: '',
    socialProfiles: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    founders: [],
    createdBy: '',
    isVerified: false,
    createdAt: '',
    updatedAt: ''
  },
  {
    _id: '5',
    name: 'AgriSmart',
    tagline: 'Smart farming solutions for Africa',
    description: 'IoT-enabled farming solutions for small-scale farmers',
    category: 'AgriTech',
    stage: 'Seed',
    foundingDate: '2020',
    logo: '/assets/images/mock/agrismart-logo.svg',
    city: 'Addis Ababa',
    country: 'Ethiopia',
    website: 'https://agrismart.et',
    metrics: {
      fundingTotal: 500000,
      employees: 12,
      revenue: 2500000
    },
    subCategory: '',
    socialProfiles: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    },
    founders: [],
    createdBy: '',
    isVerified: false,
    createdAt: '',
    updatedAt: ''
  }
];

const StartupShowcase: React.FC<StartupShowcaseProps> = ({
  title = "Featured Startups",
  subtitle = "Discover some of Africa's most innovative ventures",
  category = "",
  limit = 3,
  showViewAll = true,
  featured = true
}) => {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Simulate API fetch delay
    const fetchTimer = setTimeout(() => {
      try {
        // Filter mock data based on props
        let filteredStartups = [...MOCK_STARTUPS];
        
        if (category) {
          filteredStartups = filteredStartups.filter(startup => 
            startup.category.toLowerCase() === category.toLowerCase()
          );
        }

        if (featured) {
          // For mockup, assume the first 3 startups are "featured"
          filteredStartups = filteredStartups.slice(0, Math.min(5, filteredStartups.length));
        }

        // Apply limit
        filteredStartups = filteredStartups.slice(0, limit);
        
        setStartups(filteredStartups);
        setLoading(false);
      } catch (error) {
        console.error('Error with mockup data:', error);
        setError('Failed to load featured startups.');
        setLoading(false);
      }
    }, 800); // Simulate network delay of 800ms

    return () => clearTimeout(fetchTimer);
  }, [category, limit, featured]);

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

        {startups.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No startups to display</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {startups.map((startup) => (
                <div
                  key={startup._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/startup/${startup._id}`}>
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
                        <div className="text-2xl font-bold text-indigo-300">{startup.name.charAt(0)}</div>
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
                        {startup.metrics.fundingTotal > 0 && (
                          <>
                            <span className="mx-2">•</span>
                            <span>
                              ${startup.metrics.fundingTotal >= 1000000
                                ? (startup.metrics.fundingTotal / 1000000).toFixed(1) + 'M'
                                : (startup.metrics.fundingTotal / 1000).toFixed(0) + 'K'} raised
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
                  to={category ? `/directory?category=${category.toLowerCase()}` : "/directory"}
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