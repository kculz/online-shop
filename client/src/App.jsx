// ============================================
// App.jsx - UPDATED REDUX VERSION
// ============================================
import { Route, Routes } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkAuthThunk } from "./features/auth/authThunks";
import { selectIsLoading } from "./features/auth/authSelectors";

// Layouts
import UserLayout from "./components/layouts/UserLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";

// Auth Components (already updated to use Redux)
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import PublicRoute from "./components/auth/PublicRoute";

// Public Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
// import Register from "./pages/Register";
import AllProducts from "./pages/AllProducts";
import RentalProducts from "./pages/RentalProducts";
import ProductDetail from "./pages/ProductDetail";

// Protected Pages (User)
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
// import Profile from "./pages/Profile";

// Admin Pages
// import Dashboard from "./pages/admin/Dashboard";
// import Products from "./pages/admin/Products";
// import Categories from "./pages/admin/Categories";
// import Orders from "./pages/admin/Orders";
// import Rentals from "./pages/admin/Rentals";
// import Users from "./pages/admin/Users";
// import Payments from "./pages/admin/Payments";

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  
  
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    if (!hasCheckedAuth.current) {
      console.log('🔍 App mounted - checking authentication...');
      console.log('📝 Current token in localStorage:', localStorage.getItem('authToken'));
      
      dispatch(checkAuthThunk())
        .unwrap()
        .then((result) => {
          console.log('✅ Auth check successful:', result.user);
        })
        .catch((error) => {
          console.log('❌ Auth check failed:', error);
        })
        .finally(() => {
          hasCheckedAuth.current = true;
        });
    }
  }, [dispatch]);

  // Show loading state while checking initial authentication
  if (isLoading && !hasCheckedAuth.current) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* PUBLIC ROUTES - No authentication required */}
      <Route path="/" element={
        <UserLayout>
          <HomePage />
        </UserLayout>
      } />
      
      <Route path="/products" element={
        <UserLayout>
          <AllProducts />
        </UserLayout>
      } />
      
      <Route path="/rental" element={
        <UserLayout>
          <RentalProducts />
        </UserLayout>
      } />
      
      <Route path="/product/:id" element={
        <UserLayout>
          <ProductDetail />
        </UserLayout>
      } />

      {/* AUTH ROUTES - Redirect if already logged in */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      {/* <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } /> */}

      {/* PROTECTED USER ROUTES - Require authentication */}
      <Route path="/cart" element={
        <ProtectedRoute>
          <UserLayout>
            <Cart />
          </UserLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/checkout" element={
        <ProtectedRoute>
          <UserLayout>
            <Checkout />
          </UserLayout>
        </ProtectedRoute>
      } />
      
      {/* <Route path="/profile" element={
        <ProtectedRoute>
          <UserLayout>
            <Profile />
          </UserLayout>
        </ProtectedRoute>
      } /> */}

      {/* ADMIN ROUTES - Require admin role
      <Route path="/admin" element={
        <AdminRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </AdminRoute>
      } />

      <Route path="/admin/products" element={
        <AdminRoute>
          <DashboardLayout>
            <Products />
          </DashboardLayout>
        </AdminRoute>
      } />

      <Route path="/admin/categories" element={
        <AdminRoute>
          <DashboardLayout>
            <Categories />
          </DashboardLayout>
        </AdminRoute>
      } />

      <Route path="/admin/orders" element={
        <AdminRoute>
          <DashboardLayout>
            <Orders />
          </DashboardLayout>
        </AdminRoute>
      } />

      <Route path="/admin/rentals" element={
        <AdminRoute>
          <DashboardLayout>
            <Rentals />
          </DashboardLayout>
        </AdminRoute>
      } />

      <Route path="/admin/users" element={
        <AdminRoute>
          <DashboardLayout>
            <Users />
          </DashboardLayout>
        </AdminRoute>
      } />

      <Route path="/admin/payments" element={
        <AdminRoute>
          <DashboardLayout>
            <Payments />
          </DashboardLayout>
        </AdminRoute>
      } /> */}

      {/* 404 Route */}
      <Route path="*" element={
        <UserLayout>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page not found</p>
              <a href="/" className="text-blue-600 hover:text-blue-800">
                Return to homepage
              </a>
            </div>
          </div>
        </UserLayout>
      } />
    </Routes>
  );
}

export default App;