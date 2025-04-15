import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { AutoProvider, useAuth } from './context/AuthContext';
import HomePage from './pages/Home';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/Auth/ResetPasswordPage';
import StartupDirectory from './pages/Startup/StartupDirectory';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout';
import './index.css';

// const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return <div className="flex items-center justify-center h-screen">Loading...</div>;
//   }
  
//   if (!user) {
//     return <Navigate to="/login" />;
//   };
  
//   return <>{children}</>;
// };

// const CreatorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { user, loading } = useAuth();
  
//   if (loading) {
//     return <div className="flex items-center justify-center h-screen">Loading...</div>;
//   }
  
//   if (!user || !user.isCreator) {
//     return <Navigate to="/" />;
//   }
  
//   return <>{children}</>;
// };

const App: React.FC = () => {
  return (
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} /> 
            <Route 
              path="/directory" 
              element={
                  <StartupDirectory />
              } 
            />
{/* 
            <Route 
              path="/dashboard" 
              element={
                <CreatorRoute>
                  <CreatorDashboard />
                </CreatorRoute>
              } 
            />
            <Route 
              path="/content/:contentId" 
              element={
                <ProtectedRoute>
                  <ContentPage />
                </ProtectedRoute>
              } 
              /> */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </Router>
  );
};

export default App;