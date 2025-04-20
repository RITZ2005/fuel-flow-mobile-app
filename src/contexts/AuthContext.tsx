import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.id);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('Initial session check:', currentSession?.user?.id);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error.message);
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: error.message || "Failed to sign in. Please check your credentials.",
        });
        return { error };
      }
      
      if (data.session) {
        console.log('Sign in successful:', data.user?.id);
        toast({
          title: "Welcome Back!",
          description: "You've successfully signed in.",
        });
        navigate('/dashboard');
      } 
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign in exception:', error);
      toast({
        variant: "destructive",
        title: "Sign In Failed",
        description: error.message || "An unexpected error occurred.",
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('Signing up with:', email, fullName);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        console.error('Sign up error:', error.message);
        toast({
          variant: "destructive",
          title: "Sign Up Failed",
          description: error.message || "Failed to create your account.",
        });
        return { error };
      }
      
      if (data.user) {
        console.log('Sign up successful:', data.user.id);
        toast({
          title: "Account Created",
          description: "Your account has been successfully created!",
        });
        // With email confirmation disabled, we can navigate to dashboard
        // Otherwise, show a message to confirm email
        navigate('/dashboard');
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Sign up exception:', error);
      toast({
        variant: "destructive",
        title: "Sign Up Failed",
        description: error.message || "An unexpected error occurred.",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error.message);
        toast({
          variant: "destructive",
          title: "Sign Out Failed",
          description: error.message || "Failed to sign out.",
        });
      } else {
        toast({
          title: "Signed Out",
          description: "You've been successfully signed out.",
        });
        navigate('/login');
      }
    } catch (error: any) {
      console.error("Sign out exception:", error);
      toast({
        variant: "destructive",
        title: "Sign Out Error",
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
