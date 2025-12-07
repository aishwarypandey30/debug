import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layout
import DashboardLayout from './layout/DashboardLayout.jsx';

// Pages
import HomePage from './pages/homepage.jsx'; 
import LoginPage from './pages/loginpage.jsx';
import SignupPage from './pages/signuppage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import MentorDashboard from './pages/admin/MentorDashboard.jsx';
import AdminTaskPage from './pages/admin/AdminTaskPage.jsx';
import AdminTeamsPage from './pages/admin/AdminTeamsPage.jsx';

// Components
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/password/reset/:token" element={<ResetPasswordPage />} />

        {/* --- Protected Routes wrapped in DashboardLayout --- */}
        <Route element={<DashboardLayout />}>
          
          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Student', 'Mentor', 'Admin', 'Alumni']} />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            {/* Add other student routes here like /team, /missions */}
          </Route>

          {/* Mentor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['Mentor', 'Admin', 'Alumni']} />}>
            <Route path="/mentor/dashboard" element={<MentorDashboard />} />
            <Route path="/mentor/tasks" element={<AdminTaskPage />} />
            <Route path="/mentor/teams" element={<AdminTeamsPage />} />
          </Route>

        </Route>

        {/* --- 404 Route --- */}
        <Route path="*" element={<div className="text-white text-center mt-20">404 Not Found</div>} />
      </Routes>
    </div>
  );
}

export default App;