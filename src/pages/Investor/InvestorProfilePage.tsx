// // client/src/pages/InvestorProfile.tsx
// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { getInvestorById } from '../services/api';
// import { useAuth } from '../context/AuthContext';
// import { Investor } from '../types';
// import { formatDate } from '../utils/helpers';

// const InvestorProfile: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const { user } = useAuth();
//   const [investor, setInvestor] = useState<Investor | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');

//   useEffect(() => {
//     if (id) {
//       fetchInvestorData(id);
//     }
//   }, [id]);

//   const fetchInvestorData = async (investorId: string) => {
//     try {
//       setLoading(true);
//       const response = await getInvestorById(investorId);
//       setInvestor(response.data);
//     } catch (error) {
//       console.error('Error fetching investor:', error);
//       setError('Failed to load investor data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isOwnProfile = user && investor && user._id === investor.userId;

//   if (loading) {
//     return (
//       <div className="flex justify-center py-20">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   if (error || !investor) {
//     return (
//       <div className="container mx-auto px-4 py-16">
//         <div className="bg-red-50 p-6 rounded-lg text-center">
//           <h2 className="text-2xl font-bold text-red-800 mb-2">Oops!</h2>
//           <p className="text-red-700">{error || 'Investor not found'}</p>
//           <Link to="/investors" className="mt-4 inline-block text-indigo-600 hover:underline">
//             Back to Investors Directory
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-12">
//       <div className="container mx-auto px-4">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
//           <div className="p-6 md:p-8">
//             <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
//               <div className="flex items-center mb-4 md:mb-0">
//                 <div className="w-20 h-20 bg-indigo-100 rounded-full overflow-hidden flex-shrink-0 mr-4">
//                   <img 
//                     src={investor.profileImage || '/assets/images/placeholder-avatar.svg'} 
//                     alt={investor.name} 
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).src = '/assets/images/placeholder-avatar.svg';
//                     }}
//                   />
//                 </div>
//                 <div>
//                   <h1 className="text-3xl font-bold text-gray-900">{investor.name}</h1>
//                   <div className="text-gray-600 mt-1">
//                     {investor.position} at {investor.organization}
//                   </div>
//                 </div>
//               </div>
              
//               {isOwnProfile && (
//                 <Link 
//                   to={`/investor/edit/${investor._id}`} 
//                   className="bg-white text-indigo-600 border border-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
//                 >
//                   Edit Profile
//                 </Link>
//               )}
//             </div>
            
//             <div className="flex flex-wrap gap-2 mb-6">
//               {investor.investmentFocus.map((focus, index) => (
//                 <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md text-sm font-medium">
//                   {focus}
//                 </span>
//               ))}
//               {investor.preferredStages.map((stage, index) => (
//                 <span key={index} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-md text-sm font-medium">
//                   {stage}
//                 </span>
//               ))}
//             </div>
            
//             <p className="text-xl text-gray-700 mb-8">{investor.bio}</p>
            
//             <div className="flex flex-wrap items-center gap-6">
//               {investor.contactDetails.website && (
//                 <a 
//                   href={investor.contactDetails.website} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="flex items-center text-indigo-600 hover:text-indigo-800"
//                 >
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                     <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
//                   </svg>
//                   Website
//                 </a>
//               )}
              
//               {investor.socialProfiles.linkedin && (
//                 <a 
//                   href={investor.socialProfiles.linkedin} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="flex items-center text-indigo-600 hover:text-indigo-800"
//                 >
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                     <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
//                   </svg>
//                   LinkedIn
//                 </a>
//               )}
              
//               {investor.socialProfiles.twitter && (
//                 <a 
//                   href={investor.socialProfiles.twitter} 
//                   target="_blank" 
//                   rel="noopener noreferrer"
//                   className="flex items-center text-indigo-600 hover:text-indigo-800"
//                 >
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
//                   </svg>
//                   Twitter
//                 </a>
//               )}
              
//               {investor.contactDetails.email && (
//                 <a 
//                   href={`mailto:${investor.contactDetails.email}`}
//                   className="flex items-center text-indigo-600 hover:text-indigo-800"
//                 >
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
//                     <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                     <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                   </svg>
//                   Email
//                 </a>
//               )}
//             </div>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Main content */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Investment Focus */}
//             <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
//               <h2 className="text-2xl font-bold mb-6">Investment Focus</h2>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <h3 className="text-lg font-semibold mb-3">Sectors</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {investor.preferredSectors.map((sector, index) => (
//                       <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm font-medium">
//                         {sector}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold mb-3">Regions</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {investor.preferredCountries.map((country, index) => (
//                       <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-md text-sm font-medium">
//                         {country}
//                       </span>
//                     ))}
//                   </div>
//                 </div>
                
//                 <div>
//                   <h3 className="text-lg font-semibold mb-3">Investment Range</h3>
//                   <p className="text-gray-800">
//                     ${(investor.minInvestmentRange / 1000).toFixed(0)}K - ${(investor.maxInvestmentRange / 1000).toFixed(0)}K
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             {/* Portfolio */}
//             {investor.portfolio.length > 0 && (
//               <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
//                 <h2 className="text-2xl font-bold mb-6">Portfolio Companies</h2>
//                 <div className="space-y-6">
//                   {investor.portfolio.map((item, index) => (
//                     <div key={index} className="border-l-4 border-indigo-500 pl-4">
//                       <div className="flex justify-between items-start">
//                         <h3 className="text-lg font-semibold">
//                           {item.startupId ? (
//                             <Link to={`/startup/${item.startupId}`} className="text-indigo-600 hover:underline">
//                               {item.startupName}
//                             </Link>
//                           ) : (
//                             item.startupName
//                           )}
//                         </h3>
//                         <span className="text-gray-500 text-sm">{formatDate(item.investmentDate)}</span>
//                       </div>
//                       <p className="text-gray-700 my-1">{item.investmentStage} Stage</p>
//                       {item.description && (
//                         <p className="text-gray-600 text-sm mt-2">{item.description}</p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
          
//           {/* Sidebar */}
//           <div className="space-y-6">
//             {/* Contact */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-lg font-bold mb-4">Contact</h2>
//               <p className="text-gray-700 mb-4">
//                 Interested in connecting with {investor.name}?
//               </p>
//               <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
//                 Request Introduction
//               </button>
//             </div>
            
//             {/* Recommended Startups */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-lg font-bold mb-4">Recommended Startups</h2>
//               <p className="text-gray-500 text-sm">Coming soon...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InvestorProfile;