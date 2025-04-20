import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff, Check, X } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('founder'); // Changed initial state to 'founder' to match dropdown
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  
  const { register, isAuthenticated, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Clear auth errors when component unmounts
    return () => {
      clearError();
    };
  }, [isAuthenticated, navigate, clearError]);

  // Set form error if auth error exists
  useEffect(() => {
    if (error) {
      setFormError(error);
    }
  }, [error]);
  
  // Check if passwords match
  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    }
  }, [password, confirmPassword]);

  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(Math.min(strength, 5));
  }, [password]);
  
  const getPasswordStrengthText = () => {
    if (!password) return '';
    if (passwordStrength <= 1) return 'Very weak';
    if (passwordStrength === 2) return 'Weak';
    if (passwordStrength === 3) return 'Moderate';
    if (passwordStrength === 4) return 'Strong';
    return 'Very strong';
  };
  
  const getPasswordStrengthColor = () => {
    if (!password) return 'bg-gray-200';
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength === 2) return 'bg-orange-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-green-400';
    return 'bg-green-600';
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Validate form
    if (password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }
    
    if (passwordStrength < 3) {
      setFormError('Please choose a stronger password');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (!termsAccepted) {
      setFormError('You must accept the Terms and Privacy Policy');
      return;
    }
    
    try {
      // Pass the role parameter to the register function
      await register(firstName, lastName, email, password, role);
      // Show success message and redirect to login
      navigate('/verification-sent', { state: { email } });
    } catch (err) {
      // Error is handled in AuthContext
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="flex items-center justify-center mb-6">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="11" fill="black" />
          <circle cx="12" cy="12" r="8" fill="white" />
          <circle cx="12" cy="12" r="4" fill="black" />
        </svg>
        <Link to="/"><span className="ml-2 font-bold text-xl">GetListed</span></Link>
      </div>
      <div className="bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-8">Create your account</h2>
        
        {formError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm animate-bounce">
            {formError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            
            <div className="w-1/2">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <button 
                type="button" 
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {(password || passwordFocused) && (
              <div className="mt-2 transition-all duration-300 ease-in-out">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{getPasswordStrengthText()}</span>
                  <span className="text-xs text-gray-500">Min. 8 characters</span>
                </div>
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${getPasswordStrengthColor()} transition-all duration-500 ease-out`}
                    style={{ width: `${(passwordStrength / 5) * 100}%` }}
                  ></div>
                </div>
                
                <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
                  <div className="flex items-center text-xs">
                    <span className={`mr-1 ${password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>
                      {password.length >= 8 ? <Check size={14} /> : <X size={14} />}
                    </span>
                    8+ characters
                  </div>
                  <div className="flex items-center text-xs">
                    <span className={`mr-1 ${/[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
                      {/[A-Z]/.test(password) ? <Check size={14} /> : <X size={14} />}
                    </span>
                    Uppercase letter
                  </div>
                  <div className="flex items-center text-xs">
                    <span className={`mr-1 ${/[a-z]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
                      {/[a-z]/.test(password) ? <Check size={14} /> : <X size={14} />}
                    </span>
                    Lowercase letter
                  </div>
                  <div className="flex items-center text-xs">
                    <span className={`mr-1 ${/[0-9]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
                      {/[0-9]/.test(password) ? <Check size={14} /> : <X size={14} />}
                    </span>
                    Number
                  </div>
                  <div className="flex items-center text-xs">
                    <span className={`mr-1 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
                      {/[^A-Za-z0-9]/.test(password) ? <Check size={14} /> : <X size={14} />}
                    </span>
                    Special character
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-2 border ${
                  confirmPassword 
                    ? (passwordsMatch ? 'border-green-500' : 'border-red-500') 
                    : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300`}
                required
              />
              <button 
                type="button" 
                className="absolute right-3 top-2.5 text-gray-500"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
              
              {confirmPassword && (
                <span className={`absolute right-10 top-2.5 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
                  {passwordsMatch ? <Check size={18} /> : <X size={18} />}
                </span>
              )}
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-xs text-red-500 animate-pulse">Passwords do not match</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Account Type
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="user">User</option>
              <option value="founder">Founder</option>
              <option value="investor">Investor</option>
            </select>
          </div>
          
          <div className="mb-6">
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 mt-1 text-black border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-500">
                I agree to the{' '}
                <Link to="/terms" className="text-black hover:text-gray-800">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-black hover:text-gray-800">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            className={`w-full py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-300 ${
              passwordStrength >= 3 && password === confirmPassword && termsAccepted
                ? "bg-black text-white hover:bg-gray-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={loading || passwordStrength < 3 || password !== confirmPassword || !termsAccepted}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </span>
            ) : (
              'Create account'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-black hover:text-gray-800">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;





// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { Eye, EyeOff, Check, X } from 'lucide-react';

// const RegisterPage: React.FC = () => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [role, setRole] = useState('user');
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [formError, setFormError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState(0);
//   const [passwordFocused, setPasswordFocused] = useState(false);
//   const [passwordsMatch, setPasswordsMatch] = useState(false);
  
//   const { register, isAuthenticated, loading, error, clearError } = useAuth();
//   const navigate = useNavigate();

//   // Redirect if already authenticated
//   useEffect(() => {
//     if (isAuthenticated) {
//       navigate('/dashboard');
//     }
    
//     // Clear auth errors when component unmounts
//     return () => {
//       clearError();
//     };
//   }, [isAuthenticated, navigate, clearError]);

//   // Set form error if auth error exists
//   useEffect(() => {
//     if (error) {
//       setFormError(error);
//     }
//   }, [error]);
  
//   // Check if passwords match
//   useEffect(() => {
//     if (confirmPassword) {
//       setPasswordsMatch(password === confirmPassword);
//     }
//   }, [password, confirmPassword]);

//   // Calculate password strength
//   useEffect(() => {
//     if (!password) {
//       setPasswordStrength(0);
//       return;
//     }

//     let strength = 0;
    
//     // Length check
//     if (password.length >= 8) strength += 1;
//     if (password.length >= 12) strength += 1;
    
//     // Character variety checks
//     if (/[A-Z]/.test(password)) strength += 1;
//     if (/[a-z]/.test(password)) strength += 1;
//     if (/[0-9]/.test(password)) strength += 1;
//     if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
//     setPasswordStrength(Math.min(strength, 5));
//   }, [password]);
  
//   const getPasswordStrengthText = () => {
//     if (!password) return '';
//     if (passwordStrength <= 1) return 'Very weak';
//     if (passwordStrength === 2) return 'Weak';
//     if (passwordStrength === 3) return 'Moderate';
//     if (passwordStrength === 4) return 'Strong';
//     return 'Very strong';
//   };
  
//   const getPasswordStrengthColor = () => {
//     if (!password) return 'bg-gray-200';
//     if (passwordStrength <= 1) return 'bg-red-500';
//     if (passwordStrength === 2) return 'bg-orange-500';
//     if (passwordStrength === 3) return 'bg-yellow-500';
//     if (passwordStrength === 4) return 'bg-green-400';
//     return 'bg-green-600';
//   };
  
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const toggleConfirmPasswordVisibility = () => {
//     setShowConfirmPassword(!showConfirmPassword);
//   };
  
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setFormError('');
    
//     // Validate form
//     if (password.length < 8) {
//       setFormError('Password must be at least 8 characters');
//       return;
//     }
    
//     if (passwordStrength < 3) {
//       setFormError('Please choose a stronger password');
//       return;
//     }
    
//     if (password !== confirmPassword) {
//       setFormError('Passwords do not match');
//       return;
//     }
    
//     if (!termsAccepted) {
//       setFormError('You must accept the Terms and Privacy Policy');
//       return;
//     }
    
//     try {
//       await register(firstName, lastName, email, password);
//       // Show success message and redirect to login
//       navigate('/verification-sent', { state: { email } });
//     } catch (err) {
//       // Error is handled in AuthContext
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto my-16 px-4">
//       <div className="flex items-center justify-center mb-6">
//         <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
//           <circle cx="12" cy="12" r="11" fill="black" />
//           <circle cx="12" cy="12" r="8" fill="white" />
//           <circle cx="12" cy="12" r="4" fill="black" />
//         </svg>
//         <Link to="/"><span className="ml-2 font-bold text-xl">GetListed</span></Link>
//       </div>
//       <div className="bg-white p-8 shadow-md rounded-lg">
//         <h2 className="text-3xl font-bold text-center mb-8">Create your account</h2>
        
//         {formError && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm animate-bounce">
//             {formError}
//           </div>
//         )}
        
//         <form onSubmit={handleSubmit}>
//           <div className="flex gap-4 mb-4">
//             <div className="w-1/2">
//               <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
//                 First Name
//               </label>
//               <input
//                 id="firstName"
//                 type="text"
//                 value={firstName}
//                 onChange={(e) => setFirstName(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
            
//             <div className="w-1/2">
//               <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
//                 Last Name
//               </label>
//               <input
//                 id="lastName"
//                 type="text"
//                 value={lastName}
//                 onChange={(e) => setLastName(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//             </div>
//           </div>
          
//           <div className="mb-4">
//             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//               Email address
//             </label>
//             <input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//               required
//             />
//           </div>
          
//           <div className="mb-4">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 onFocus={() => setPasswordFocused(true)}
//                 onBlur={() => setPasswordFocused(false)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//                 required
//               />
//               <button 
//                 type="button" 
//                 className="absolute right-3 top-2.5 text-gray-500"
//                 onClick={togglePasswordVisibility}
//               >
//                 {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
//             </div>
            
//             {(password || passwordFocused) && (
//               <div className="mt-2 transition-all duration-300 ease-in-out">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="text-xs font-medium">{getPasswordStrengthText()}</span>
//                   <span className="text-xs text-gray-500">Min. 8 characters</span>
//                 </div>
//                 <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
//                   <div 
//                     className={`h-full ${getPasswordStrengthColor()} transition-all duration-500 ease-out`}
//                     style={{ width: `${(passwordStrength / 5) * 100}%` }}
//                   ></div>
//                 </div>
                
//                 <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
//                   <div className="flex items-center text-xs">
//                     <span className={`mr-1 ${password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`}>
//                       {password.length >= 8 ? <Check size={14} /> : <X size={14} />}
//                     </span>
//                     8+ characters
//                   </div>
//                   <div className="flex items-center text-xs">
//                     <span className={`mr-1 ${/[A-Z]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
//                       {/[A-Z]/.test(password) ? <Check size={14} /> : <X size={14} />}
//                     </span>
//                     Uppercase letter
//                   </div>
//                   <div className="flex items-center text-xs">
//                     <span className={`mr-1 ${/[a-z]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
//                       {/[a-z]/.test(password) ? <Check size={14} /> : <X size={14} />}
//                     </span>
//                     Lowercase letter
//                   </div>
//                   <div className="flex items-center text-xs">
//                     <span className={`mr-1 ${/[0-9]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
//                       {/[0-9]/.test(password) ? <Check size={14} /> : <X size={14} />}
//                     </span>
//                     Number
//                   </div>
//                   <div className="flex items-center text-xs">
//                     <span className={`mr-1 ${/[^A-Za-z0-9]/.test(password) ? 'text-green-500' : 'text-gray-400'}`}>
//                       {/[^A-Za-z0-9]/.test(password) ? <Check size={14} /> : <X size={14} />}
//                     </span>
//                     Special character
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="mb-4">
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <input
//                 id="confirmPassword"
//                 type={showConfirmPassword ? "text" : "password"}
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className={`w-full px-3 py-2 border ${
//                   confirmPassword 
//                     ? (passwordsMatch ? 'border-green-500' : 'border-red-500') 
//                     : 'border-gray-300'
//                 } rounded-md focus:outline-none focus:ring-2 focus:ring-black transition-colors duration-300`}
//                 required
//               />
//               <button 
//                 type="button" 
//                 className="absolute right-3 top-2.5 text-gray-500"
//                 onClick={toggleConfirmPasswordVisibility}
//               >
//                 {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//               </button>
              
//               {confirmPassword && (
//                 <span className={`absolute right-10 top-2.5 ${passwordsMatch ? 'text-green-500' : 'text-red-500'}`}>
//                   {passwordsMatch ? <Check size={18} /> : <X size={18} />}
//                 </span>
//               )}
//             </div>
//             {confirmPassword && !passwordsMatch && (
//               <p className="mt-1 text-xs text-red-500 animate-pulse">Passwords do not match</p>
//             )}
//           </div>

//           <div className="mb-4">
//             <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
//               Account Type
//             </label>
//             <select
//               id="role"
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
//             >
//               <option value="founder">Founder</option>
//               <option value="investor">Investor</option>
//             </select>
//           </div>
          
//           <div className="mb-6">
//             <div className="flex items-start">
//               <input
//                 id="terms"
//                 type="checkbox"
//                 checked={termsAccepted}
//                 onChange={(e) => setTermsAccepted(e.target.checked)}
//                 className="h-4 w-4 mt-1 text-black border-gray-300 rounded"
//                 required
//               />
//               <label htmlFor="terms" className="ml-2 text-sm text-gray-500">
//                 I agree to the{' '}
//                 <Link to="/terms" className="text-black hover:text-gray-800">
//                   Terms of Service
//                 </Link>{' '}
//                 and{' '}
//                 <Link to="/privacy" className="text-black hover:text-gray-800">
//                   Privacy Policy
//                 </Link>
//               </label>
//             </div>
//           </div>
          
//           <button
//             type="submit"
//             className={`w-full py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-300 ${
//               passwordStrength >= 3 && password === confirmPassword && termsAccepted
//                 ? "bg-black text-white hover:bg-gray-700"
//                 : "bg-gray-300 text-gray-500 cursor-not-allowed"
//             }`}
//             disabled={loading || passwordStrength < 3 || password !== confirmPassword || !termsAccepted}
//           >
//             {loading ? (
//               <span className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Creating account...
//               </span>
//             ) : (
//               'Create account'
//             )}
//           </button>
//         </form>
        
//         <div className="mt-6 text-center">
//           <p className="text-gray-600">
//             Already have an account?{' '}
//             <Link to="/login" className="text-black hover:text-gray-800">
//               Log in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;