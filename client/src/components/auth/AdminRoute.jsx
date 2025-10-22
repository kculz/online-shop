// ============================================
// File: client/src/components/auth/AdminRoute.jsx
// ============================================
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsLoading } from '../../features/auth/authSelectors'; // ✅ FIXED IMPORT

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);

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

  // ✅ FIX: Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;