// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AutoProvider, useAuth } from './context/AuthContext';
// import HomePage from './pages/Home';
// import LoginPage from './pages/Auth/LoginPage';
// import RegisterPage from './pages/Auth/RegisterPage';
// import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
// import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
// import StartupDirectory from './pages/Startup/StartupDirectory';
// import NotFoundPage from './pages/NotFoundPage';
// import Layout from './components/layout/Layout';
// import './index.css';

// // const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
// //   const { user, loading } = useAuth();
  
// //   if (loading) {
// //     return <div className="flex items-center justify-center h-screen">Loading...</div>;
// //   }
  
// //   if (!user) {
// //     return <Navigate to="/login" />;
// //   };
  
// //   return <>{children}</>;
// // };

// // const CreatorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
// //   const { user, loading } = useAuth();
  
// //   if (loading) {
// //     return <div className="flex items-center justify-center h-screen">Loading...</div>;
// //   }
  
// //   if (!user || !user.isCreator) {
// //     return <Navigate to="/" />;
// //   }
  
// //   return <>{children}</>;
// // };

// const App: React.FC = () => {
//   return (
//       <Router>
//         <Layout>
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/register" element={<RegisterPage />} />
//             <Route path="/forgot-password" element={<ForgotPasswordPage />} />
//             <Route path="/reset-password" element={<ResetPasswordPage />} /> 
//             <Route 
//               path="/directory" 
//               element={
//                   <StartupDirectory />
//               } 
//             />
// {/* 
//             <Route 
//               path="/dashboard" 
//               element={
//                 <CreatorRoute>
//                   <CreatorDashboard />
//                 </CreatorRoute>
//               } 
//             />
//             <Route 
//               path="/content/:contentId" 
//               element={
//                 <ProtectedRoute>
//                   <ContentPage />
//                 </ProtectedRoute>
//               } 
//               /> */}
//             <Route path="*" element={<NotFoundPage />} />
//           </Routes>
//         </Layout>
//       </Router>
//   );
// };

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { StartupProvider } from './context/StartupContext';

// Public pages
import HomePage from './pages/Home';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import VerifyEmailPage from './pages/Auth/VerifyEmailPage';
import VerificationSentPage from './pages/Auth/VerificationSentPage';
// import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// // Protected pages
// import DashboardPage from './pages/DashboardPage';
// import ProfilePage from './pages/ProfilePage';
// import SettingsPage from './pages/SettingsPage';

// // Admin pages
// import AdminDashboardPage from './pages/admin/DashboardPage';
// import AdminUsersPage from './pages/admin/UsersPage';

// Protected route component
// import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StartupProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
          <Route path="/verify/:token" element={<VerifyEmailPage />} />
          <Route path="/verification-sent" element={<VerificationSentPage />} />
          {/* <Route path="/unauthorized" element={<UnauthorizedPage />} /> */}
          
          {/* Protected routes for all authenticated users */}
          {/* <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route> */}
          
          {/* Admin-only routes */}
          {/* <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Route> */}
          
          
          {/* 404 route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
      </StartupProvider>
    </AuthProvider>
  );
};

export default App;