import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, LogOut, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Navigation links based on user role
  const getNavLinks = () => {
    if (!isAuthenticated) {
      return (
        <div className="flex space-x-4 items-center">
          <Link
            to="/login"
            className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Sign Up
          </Link>
        </div>
      );
    }

    if (user?.role === 'admin') {
      return (
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-4">
            <NavLink to="/admin/dashboard" active={isActive('/admin/dashboard')}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/courses" active={isActive('/admin/courses')}>
              Courses
            </NavLink>
            <NavLink to="/admin/analytics" active={isActive('/admin/analytics')}>
              Analytics
            </NavLink>
          </div>
          <UserMenu userName={user.name} onLogout={logout} />
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex space-x-4">
          <NavLink to="/courses" active={isActive('/courses')}>
            Courses
          </NavLink>
          <NavLink to="/my-learning" active={isActive('/my-learning')}>
            My Learning
          </NavLink>
          <NavLink to="/wishlist" active={isActive('/wishlist')}>
            Wishlist
          </NavLink>
        </div>
        <UserMenu userName={user.name} onLogout={logout} />
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">LearnHub</span>
            </Link>
          </div>
          {getNavLinks()}
        </div>
      </div>
    </nav>
  );
};

// Helper components
const NavLink: React.FC<{ to: string; active: boolean; children: React.ReactNode }> = ({
  to,
  active,
  children,
}) => {
  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      {children}
    </Link>
  );
};

const UserMenu: React.FC<{ userName: string; onLogout: () => void }> = ({ userName, onLogout }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative ml-3">
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
            <User className="h-5 w-5" />
          </div>
          <span className="ml-2 text-gray-700">{userName}</span>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
        >
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Your Profile
          </Link>
          <button
            onClick={() => {
              onLogout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            role="menuitem"
          >
            <div className="flex items-center">
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;