import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { Chatbot } from "@/components/chatbot/Chatbot";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import UserDashboard from "./pages/UserDashboard";
import MLPredictionsPage from "./pages/MLPredictionsPage";
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
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route 
        path="/" 
        element={
          isAuthenticated 
            ? <Navigate to={user?.role === 'vehicle_owner' ? '/dashboard' : '/service-center-dashboard'} replace />
            : <Login />
        } 
      />
      <Route 
        path="/signup" 
        element={
          isAuthenticated 
            ? <Navigate to={user?.role === 'vehicle_owner' ? '/dashboard' : '/service-center-dashboard'} replace />
            : <SignUp />
        } 
      />

      {/* User Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="vehicle_owner">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/ai-predictions"
        element={
          <ProtectedRoute allowedRole="vehicle_owner">
            <MLPredictionsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/service-centers"
        element={
          <ProtectedRoute allowedRole="vehicle_owner">
            <ServiceCentersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/history"
        element={
          <ProtectedRoute allowedRole="vehicle_owner">
            <ServiceHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute allowedRole="vehicle_owner">
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Service Center Dashboard Routes */}
      <Route
        path="/service-center-dashboard"
        element={
          <ProtectedRoute allowedRole="service_center">
            <ServiceCenterDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-center-dashboard/inventory"
        element={
          <ProtectedRoute allowedRole="service_center">
            <InventoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-center-dashboard/bookings"
        element={
          <ProtectedRoute allowedRole="service_center">
            <BookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/service-center-dashboard/customers"
        element={
          <ProtectedRoute allowedRole="service_center">
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
          <Chatbot />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
