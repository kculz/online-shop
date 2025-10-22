// ============================================
// components/auth/ProtectedRoute.jsx - FIXED VERSION
// ============================================
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsLoading } from '../../features/auth/authSelectors'; // ✅ FIXED IMPORT

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading); // ✅ FIXED: selectIsLoading instead of selectAuthLoading

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // ✅ FIX: Save current location before redirecting
    sessionStorage.setItem('redirectAfterLogin', location.pathname + location.search);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;