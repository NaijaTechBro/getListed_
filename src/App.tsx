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
import Sidebar from './pages/Dashboard/Sidebar';
import StartupForm from './components/startup/StartupForm';
// import ProfilePage from './pages/ProfilePage';
// import SettingsPage from './pages/SettingsPage';

// // Admin pages
// import AdminDashboardPage from './pages/admin/DashboardPage';
// import AdminUsersPage from './pages/admin/UsersPage';

// Protected route component
import ProtectedRoute from './components/ProtectedRoute';
import MyStartups from './pages/Startup/MyStartups';
import UnauthorizedPage from './pages/UnauthorizedPage';
import StartupDirectory from './pages/Startup/StartupDirectory';
import AddStartupWrapper from './pages/Startup/AddStartupWrapper';

import FAQPage from './components/company/FAQPage';
import AboutPage from './components/company/AboutPage';
import CareersPage from './components/company/CareerPage';
import ContactUsPage from './components/company/ContactPage';
import PrivacyPage from './components/company/PrivacyPage';
import TermsPage from './components/company/TermsPage';
import StartupProfile from './pages/Startup/StartupProfile';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <StartupProvider>
        <Router>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:resetToken" element={<ResetPasswordPage />} />
            <Route path="/verify/:token" element={<VerifyEmailPage />} />
            <Route path="/verification-sent" element={<VerificationSentPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Public Route */}
            <Route path="/directory" element={<StartupDirectory />} />
            <Route path="/startup-profile/:id" element={<StartupProfile />} />


            {/* CompanyPage Route */}
            <Route path="/faqs" element={<FAQPage/>} />
            <Route path="/about" element={<AboutPage/>} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/contact" element={<ContactUsPage/>}/>

            {/* Protected routes for all authenticated users */}
            <Route element={<ProtectedRoute allowedRoles={['founder']} />}>
              <Route path="/dashboard" element={<Sidebar />}>
                <Route index element={<DashboardPage />} />
                <Route path="add-startup" element={<AddStartupWrapper />} />
                <Route path="edit-startup/:id" element={<StartupForm isEditing={true} />} />
                <Route path="my-startups" element={<MyStartups />} />
              </Route>
            </Route>

            {/* Protected routes for admin users */}
            {/* <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
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