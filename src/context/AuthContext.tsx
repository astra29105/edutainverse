import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { supabase } from '../utils/supabase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string, retryCount = 0) => {
    try {
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code === 'PGRST116' && retryCount < 3) {
          // Profile not found, retry after a delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          return fetchUserProfile(userId, retryCount + 1);
        }
        console.error('Error fetching user profile:', error);
        setUser(null);
        return;
      }

      setUser(profile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setUser(null);
    }
  };

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await fetchUserProfile(data.user.id);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // First try to sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        if (authError.message === 'User already registered') {
          throw new Error('This email is already registered. Please try logging in instead.');
        }
        throw authError;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create the user profile in our users table
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            name,
            email,
            role: 'student'
          }
        ]);

      if (profileError) {
        // If profile creation fails, we should clean up the auth user
        await supabase.auth.signOut();
        throw profileError;
      }

      // Fetch the newly created profile
      await fetchUserProfile(authData.user.id);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};