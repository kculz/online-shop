import { Navigate, Outlet } from "react-router-dom";
import { useAuth, useAuthSelectors } from "../stores";
import { useEffect, useState } from "react";

const ProtectedRoutes = ({ requiredRole, redirectPath = '/login', children }) => {
  const { isAuthenticated, isLoading, user } = useAuthSelectors();
  const { checkAuth } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      // Only check auth if we're not already authenticated and not loading
      if (!isAuthenticated && !isLoading) {
        await checkAuth();
      }
      setIsChecking(false);
    };

    verifyAuth();
  }, [isAuthenticated, isLoading, checkAuth]);

  // Show loading state while checking authentication
  if (isChecking || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check if specific role is required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children or outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoutes;