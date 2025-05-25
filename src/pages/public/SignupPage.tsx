import React from 'react';
import { Navigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import SignupForm from '../../components/auth/SignupForm';
import { useAuth } from '../../context/AuthContext';

const SignupPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto">
            <SignupForm />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;