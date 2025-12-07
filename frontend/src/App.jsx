



import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public Pages
import HomePage from './pages/homepage.jsx'; 
import LoginPage from './pages/loginpage.jsx';
import SignupPage from './pages/signuppage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import AdminTaskPage from './pages/admin/AdminTaskPage.jsx';
// Protected Pages
import StudentDashboard from './pages/StudentDashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Import the guard

// ... imports
import MentorDashboard from './pages/admin/MentorDashboard.jsx'; // Import the new page
import AdminTeamsPage from './pages/admin/AdminTeamsPage.jsx'; // Ensure this is imported

function App() {
  return (
    <div className="App">
      <Routes>
        {/* ... Public Routes (Home, Login, etc.) ... */}

        {/* STUDENT ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['Student', 'Mentor', 'Admin']} />}>
          <Route path="/dashboard" element={<StudentDashboard />} />
        </Route>

        {/* MENTOR / ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['Mentor', 'Admin', 'Alumni']} />}>
          <Route path="/mentor/dashboard" element={<MentorDashboard />} />
          <Route path="/mentor/tasks" element={<AdminTaskPage />} />
          <Route path="/mentor/teams" element={<AdminTeamsPage />} />
        </Route>

      </Routes>
    </div>
  );
}
export default App;