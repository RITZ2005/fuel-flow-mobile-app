
import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect when we know user is not authenticated
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "Please login to access this page.",
      });
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [user, loading, navigate, location, toast]);

  if (loading) {
    // Show loading spinner while checking authentication
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cng-primary"></div>
      </div>
    );
  }

  if (!user) {
    // This is for immediate redirect if we already know user is not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
