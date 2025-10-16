// ============================================
// App.jsx
// ============================================
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./stores";

// Layouts
import UserLayout from "./components/layouts/UserLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";

// Auth Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import PublicRoute from "./components/auth/PublicRoute";

// Public Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AllProducts from "./pages/AllProducts";
import RentalProducts from "./pages/RentalProducts";
import ProductDetail from "./pages/ProductDetail";

// Protected Pages (User)
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Categories from "./pages/admin/Categories";
import Orders from "./pages/admin/Orders";
import Rentals from "./pages/admin/Rentals";
import Users from "./pages/admin/Users";
import Payments from "./pages/admin/Payments";

function App() {
  const { checkAuth } = useAuth();

  useEffect(() => {
    // Check authentication status on app load
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      {/* Public Routes with Header & Footer */}
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

      {/* Public Routes without Header & Footer (Auth Pages) */}
      <Route path="/login" element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      } />
      
      <Route path="/register" element={
        <PublicRoute>
          <Register />
        </PublicRoute>
      } />

      {/* Protected User Routes */}
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
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserLayout>
            <Profile />
          </UserLayout>
        </ProtectedRoute>
      } />

      {/* Admin Routes */}
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
      } />

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