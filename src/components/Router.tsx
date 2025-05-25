import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Public pages
import HomePage from '../pages/public/HomePage';
import CoursesPage from '../pages/public/CoursesPage';
import LoginPage from '../pages/public/LoginPage';
import SignupPage from '../pages/public/SignupPage';

// Student pages
import StudentDashboard from '../pages/student/DashboardPage';
import MyLearningPage from '../pages/student/MyLearningPage';
import WishlistPage from '../pages/student/WishlistPage';
import ProfilePage from '../pages/student/ProfilePage';

// Admin pages
import AdminDashboard from '../pages/admin/DashboardPage';

// Define protected route components
const ProtectedRoute: React.FC<{
  element: React.ReactNode;
  requiredRole?: 'student' | 'admin';
}> = ({ element, requiredRole }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{element}</>;
};

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Student routes */}
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<StudentDashboard />} requiredRole="student" />}
        />
        <Route
          path="/my-learning"
          element={<ProtectedRoute element={<MyLearningPage />} requiredRole="student" />}
        />
        <Route
          path="/wishlist"
          element={<ProtectedRoute element={<WishlistPage />} requiredRole="student" />}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute element={<ProfilePage />} />}
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />}
        />
        <Route
          path="/admin/dashboard"
          element={<ProtectedRoute element={<AdminDashboard />} requiredRole="admin" />}
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;