import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole?: 'user' | 'service-center';
}

export default function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    // Redirect to the correct dashboard based on role
    const redirectPath = user?.role === 'user' ? '/dashboard' : '/service-center-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}
