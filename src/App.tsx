import React from 'react';
import Router from './components/Router';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';

function App() {
  return (
    <AuthProvider>
      <CourseProvider>
        <Router />
      </CourseProvider>
    </AuthProvider>
  );
}

export default App;