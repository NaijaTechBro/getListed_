// // client/src/components/investor/InvestorForm.tsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { createInvestor, getInvestorById, updateInvestor } from '../../services/api';
// import { useAuth } from '../../context/AuthContext';
// import { Investor } from '../../types';

// interface InvestorFormProps {
//   isEditing?: boolean;
// }

// const InvestorForm: React.FC<InvestorFormProps> = ({ isEditing = false }) => {
//   const navigate = useNavigate();
//   const { id } = useParams<{ id: string }>();
//   const { user } = useAuth();
  
//   const initialState: Omit<Investor, '_id' | 'userId' | 'createdAt' | 'updatedAt'> = {
//     name: '',
//     position: '',
//     organization: '',
//     investmentFocus: [''],
//     preferredStages: [],
//     preferredSectors: [],
//     preferredCountries: [],
//     minInvestmentRange: 10000,
//     maxInvestmentRange: 100000,
//     bio: '',
//     portfolio: [],
//     profileImage: '',
//     contactDetails: {
//       email: user?.email || '',
//       phone: '',
//       website: ''
//     },
//     socialProfiles: {
//       linkedin: '',
//       twitter: ''
//     }
//   };

//   const [formData, setFormData] = useState(initialState);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>('');
//   const [success, setSuccess] = useState<boolean>(false);
//   const [newFocus, setNewFocus] = useState<string>('');
  
//   useEffect(() => {
//     if (isEditing && id) {
//       fetchInvestorData(id);
//     }
//   }, [isEditing, id]);

//   const fetchInvestorData = async (investorId: string) => {
//     try {
//       setLoading(true);
//       const response = await getInvestorById(investorId);
//       setFormData(response.data);
//     } catch (error) {
//       console.error('Error fetching investor:', error);
//       setError('Failed to load investor data.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
    
//     // Handle nested properties
//     if (name.includes('.')) {
//       const [parent, child] = name.split('.');
//       setFormData(prev => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent as keyof typeof prev],
//           [child]: value
//         }
//       }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleArrayInputChange = (e: React.ChangeEvent<HTMLSelectElement>, field: keyof typeof formData) => {
//     const options = e.target.options;
//     const values = [];
    
//     for (let i = 0; i < options.length; i++) {
//       if (options[i].selected) {
//         values.push(options[i].value);
//       }
//     }
    
//     setFormData(prev => ({ ...prev, [field]: values }));
//   };

//   const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
//     const value = parseInt(e.target.value) || 0;
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleFocusAdd = () => {
//     if (newFocus.trim() && !formData.investmentFocus.includes(newFocus.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         investmentFocus: [...prev.investmentFocus, newFocus.trim()]
//       }));
//       setNewFocus('');
//     }
//   };

//   const removeFocus = (focus: string) => {
//     setFormData(prev => ({
//       ...prev,
//       investmentFocus: prev.investmentFocus.filter(f => f !== focus)
//     }));
//   };

//   const handlePortfolioChange = (index: number, field: string, value: string) => {
//     const updatedPortfolio = [...formData.portfolio];
//     updatedPortfolio[index] = {
//       ...updatedPortfolio[index],
//       [field]: value
//     };
    
//     setFormData(prev => ({
//       ...prev,
//       portfolio: updatedPortfolio
//     }));
//   };

//   const addPortfolioCompany = () => {
//     setFormData(prev => ({
//       ...prev,
//       portfolio: [
//         ...prev.portfolio,
//         {
//           startupId: '',
//           startupName: '',
//           investmentDate: new Date().toISOString().split('T')[0],
//           investmentStage: 'Seed',
//           description: ''
//         }
//       ]
//     }));
//   };

//   const removePortfolioCompany = (index: number) => {
//     setFormData(prev => ({
//       ...prev,
//       portfolio: prev.portfolio.filter((_, i) => i !== index)
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
    
//     try {
//       if (isEditing && id) {
//         await updateInvestor(id, formData);
//       } else {
//         await createInvestor(formData);
//       }
      
//       setSuccess(true);
//       setTimeout(() => {
//         if (isEditing && id) {
//           navigate(`/investor/${id}`);
//         } else {
//           navigate('/investors');
//         }
//       }, 2000);
//     } catch (error) {
//       console.error('Error saving investor profile:', error);
//       setError('Failed to save investor profile. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sectors = ['Fintech', 'Healthtech', 'Edtech', 'Agritech', 'E-commerce', 'Clean Energy', 'Logistics', 'AI & ML', 'SaaS', 'Hardware', 'Consumer Tech', 'Biotech'];
//   const countries = ['Nigeria', 'Kenya', 'South Africa', 'Egypt', 'Ghana', 'Rwanda', 'Ethiopia', 'Senegal', 'United States', 'United Kingdom', 'UAE'];
//   const stages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C', 'Later Stage', 'All Stages'];

//   if (loading && isEditing) {
//     return (
//       <div className="flex justify-center py-20">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-12">
//       <div className="container mx-auto px-4 max-w-4xl">
//         <h1 className="text-3xl font-bold mb-8">
//           {isEditing ? 'Edit Investor Profile' : 'Create Investor Profile'}
//         </h1>

//         {error && (
//           <div className="bg-red-50 p-4 rounded-lg mb-6 text-red-700 border border-red-200">
//             {error}
//           </div>
//         )}

//         {success && (
//           <div className="bg-green-50 p-4 rounded-lg mb-6 text-green-700 border border-green-200">
//             Profile {isEditing ? 'updated' : 'created'} successfully! Redirecting...
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
//           {/* Basic Information */}
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name*
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Your full name"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Position/Title*
//                 </label>
//                 <input
//                   type="text"
//                   name="position"
//                   value={formData.position}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="e.g. Managing Partner"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Organization/Firm*
//                 </label>
//                 <input
//                   type="text"
//                   name="organization"
//                   value={formData.organization}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="e.g. Venture Capital Partners"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Profile Image URL
//                 </label>
//                 <input
//                   type="url"
//                   name="profileImage"
//                   value={formData.profileImage}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="https://example.com/image.jpg"
//                 />
//               </div>
              
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Bio/About*
//                 </label>
//                 <textarea
//                   name="bio"
//                   value={formData.bio}
//                   onChange={handleChange}
//                   required
//                   rows={4}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="Brief description about your investment philosophy and background"
//                 />
//               </div>
//             </div>
//           </div>
          
//           {/* Investment Preferences */}
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-xl font-semibold mb-6">Investment Preferences</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Preferred Sectors*
//                 </label>
//                 <select
//                   multiple
//                   name="preferredSectors"
//                   value={formData.preferredSectors}
//                   onChange={(e) => handleArrayInputChange(e, 'preferredSectors')}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   {sectors.map(sector => (
//                     <option key={sector} value={sector}>{sector}</option>
//                   ))}
//                 </select>
//                 <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Preferred Investment Stages*
//                 </label>
//                 <select
//                   multiple
//                   name="preferredStages"
//                   value={formData.preferredStages}
//                   onChange={(e) => handleArrayInputChange(e, 'preferredStages')}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   {stages.map(stage => (
//                     <option key={stage} value={stage}>{stage}</option>
//                   ))}
//                 </select>
//                 <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Preferred Countries/Regions*
//                 </label>
//                 <select
//                   multiple
//                   name="preferredCountries"
//                   value={formData.preferredCountries}
//                   onChange={(e) => handleArrayInputChange(e, 'preferredCountries')}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 >
//                   {countries.map(country => (
//                     <option key={country} value={country}>{country}</option>
//                   ))}
//                 </select>
//                 <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Investment Focus
//                 </label>
//                 <div className="flex items-center mb-2">
//                   <input
//                     type="text"
//                     value={newFocus}
//                     onChange={(e) => setNewFocus(e.target.value)}
//                     className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                     placeholder="e.g. Climate Tech"
//                   />
//                   <button
//                     type="button"
//                     onClick={handleFocusAdd}
//                     className="bg-indigo-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700"
//                   >
//                     Add
//                   </button>
//                 </div>
//                 <div className="flex flex-wrap gap-2 mt-2">
//                   {formData.investmentFocus.filter(f => f.trim() !== '').map((focus, index) => (
//                     <div key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-md text-sm font-medium flex items-center">
//                       {focus}
//                       <button
//                         type="button"
//                         onClick={() => removeFocus(focus)}
//                         className="ml-2 text-indigo-600 hover:text-indigo-800"
//                       >
//                         &times;
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Minimum Investment Amount ($)
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.minInvestmentRange}
//                   onChange={(e) => handleNumberChange(e, 'minInvestmentRange')}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   min="0"
//                   step="1000"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Maximum Investment Amount ($)
//                 </label>
//                 <input
//                   type="number"
//                   value={formData.maxInvestmentRange}
//                   onChange={(e) => handleNumberChange(e, 'maxInvestmentRange')}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   min="0"
//                   step="1000"
//                 />
//               </div>
//             </div>
//           </div>
          
//           {/* Contact Information */}
//           <div className="p-6 border-b border-gray-200">
//             <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Email*
//                 </label>
//                 <input
//                   type="email"
//                   name="contactDetails.email"
//                   value={formData.contactDetails.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone
//                 </label>
//                 <input
//                   type="tel"
//                   name="contactDetails.phone"
//                   value={formData.contactDetails.phone}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Website
//                 </label>
//                 <input
//                   type="url"
//                   name="contactDetails.website"
//                   value={formData.contactDetails.website}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="https://example.com"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   LinkedIn Profile
//                 </label>
//                 <input
//                   type="url"
//                   name="socialProfiles.linkedin"
//                   value={formData.socialProfiles.linkedin}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="https://linkedin.com/in/yourprofile"
//                 />
//               </div>
              
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Twitter Profile
//                 </label>
//                 <input
//                   type="url"
//                   name="socialProfiles.twitter"
//                   value={formData.socialProfiles.twitter}
//                   onChange={handleChange}
//                   className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                   placeholder="https://twitter.com/yourhandle"
//                 />
//               </div>
//             </div>
//           </div>
          
//           {/* Portfolio Companies */}
//           <div className="p-6 border-b border-gray-200">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold">Portfolio Companies</h2>
//               <button
//                 type="button"
//                 onClick={addPortfolioCompany}
//                 className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
//               >
//                 Add Company
//               </button>
//             </div>
            
//             {formData.portfolio.length === 0 ? (
//               <p className="text-gray-500 italic">No portfolio companies added yet.</p>
//             ) : (
//               <div className="space-y-6">
//                 {formData.portfolio.map((company, index) => (
//                   <div key={index} className="border border-gray-200 rounded-lg p-4">
//                     <div className="flex justify-between mb-4">
//                       <h3 className="font-medium">Portfolio Company #{index + 1}</h3>
//                       <button
//                         type="button"
//                         onClick={() => removePortfolioCompany(index)}
//                         className="text-red-600 hover:text-red-800"
//                       >
//                         Remove
//                       </button>
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Company Name*
//                         </label>
//                         <input
//                           type="text"
//                           value={company.startupName}
//                           onChange={(e) => handlePortfolioChange(index, 'startupName', e.target.value)}
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Investment Date
//                         </label>
//                         <input
//                           type="date"
//                           value={company.investmentDate?.split('T')[0] || ''}
//                           onChange={(e) => handlePortfolioChange(index, 'investmentDate', e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         />
//                       </div>
                      
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Investment Stage
//                         </label>
//                         <select
//                           value={company.investmentStage}
//                           onChange={(e) => handlePortfolioChange(index, 'investmentStage', e.target.value)}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                         >
//                           {stages.map(stage => (
//                             <option key={stage} value={stage}>{stage}</option>
//                           ))}
//                         </select>
//                       </div>
                      
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           Brief Description
//                         </label>
//                         <textarea
//                           value={company.description}
//                           onChange={(e) => handlePortfolioChange(index, 'description', e.target.value)}
//                           rows={2}
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
//                           placeholder="Brief description about your investment"
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
          
//           {/* Form Actions */}
//           <div className="p-6 flex justify-end">
//             <button
//               type="button"
//               onClick={() => navigate(isEditing && id ? `/investor/${id}` : '/investors')}
//               className="mr-4 bg-white text-gray-600 border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading || success}
//               className={`bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors ${
//                 (loading || success) ? 'opacity-70 cursor-not-allowed' : ''
//               }`}
//             >
//               {loading ? 'Saving...' : (isEditing ? 'Update Profile' : 'Create Profile')}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default InvestorForm;