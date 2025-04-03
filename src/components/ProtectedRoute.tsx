
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // While checking authentication status, show nothing
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If not logged in, redirect to sign-in page, preserving the intended destination
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If logged in, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
