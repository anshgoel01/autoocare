import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import ServiceCentersPage from "./pages/ServiceCentersPage";
import ServiceHistoryPage from "./pages/ServiceHistoryPage";
import ProfilePage from "./pages/ProfilePage";
import ServiceCenterDashboard from "./pages/ServiceCenterDashboard";
import InventoryPage from "./pages/InventoryPage";
import BookingsPage from "./pages/BookingsPage";
import CustomersPage from "./pages/CustomersPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Auth Route */}
      <Route 
        path="/" 
        element={
          isAuthenticated 
            ? <Navigate to={user?.role === 'user' ? '/dashboard' : '/service-center-dashboard'} replace />
            : <Login />
        } 
      />

      {/* User Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/service-centers"
        element={
          <ProtectedRoute allowedRole="user">
            <ServiceCentersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/history"
        element={
          <ProtectedRoute allowedRole="user">
            <ServiceHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute allowedRole="user">
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Service Center Dashboard Routes */}
      <Route
        path="/service-center-dashboard"
        element={
          <ProtectedRoute allowedRole="service-center">
            <ServiceCenterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-center-dashboard/inventory"
        element={
          <ProtectedRoute allowedRole="service-center">
            <InventoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-center-dashboard/bookings"
        element={
          <ProtectedRoute allowedRole="service-center">
            <BookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-center-dashboard/customers"
        element={
          <ProtectedRoute allowedRole="service-center">
            <CustomersPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
