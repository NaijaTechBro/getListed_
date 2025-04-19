import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import NotFoundPage from './pages/NotFoundPage';

// Protected pages
import DashboardPage from './pages/Dashboard/DashboardPage';
// import ProfilePage from './pages/ProfilePage';
// import SettingsPage from './pages/SettingsPage';

// // Admin pages
// import AdminDashboardPage from './pages/admin/DashboardPage';
// import AdminUsersPage from './pages/admin/UsersPage';

// Protected route component
import ProtectedRoute from './components/ProtectedRoute';
import MyStartups from './pages/Startup/MyStartups';
// import DashboardOverview from './pages/Dashboard/DashboardOverview';
import AddStartupWrapper from './pages/Startup/AddStartupWrapper';
import UnauthorizedPage from './pages/UnauthorizedPage';
import StartupDirectory from './pages/Startup/StartupDirectory';

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
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/directory" element={<StartupDirectory />} />
          
          {/* Protected routes for all authenticated users */}
          <Route element={<ProtectedRoute allowedRoles={['founder']} />}>
            <Route path="/dashboard" element={<DashboardPage/>} />
            <Route path="/dashboard/my-startups" element={<MyStartups />} />
            {/* <Route path="/dashboard/analytics" element={<DashboardOverview />} /> */}
            <Route path="/dashboard/add-startup" element={<AddStartupWrapper />} />
            {/* <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} /> */}
          </Route>
          
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