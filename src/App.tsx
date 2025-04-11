
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { App as CapApp } from '@capacitor/app';

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Stations from "./pages/Stations";
import BookSlot from "./pages/BookSlot";
import Bookings from "./pages/Bookings";
import BookingDetails from "./pages/BookingDetails";
import Vehicles from "./pages/Vehicles";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  // Handle hardware back button in mobile apps
  useEffect(() => {
    // Only run in mobile app environments
    if (window.Capacitor) {
      const handleBackButton = CapApp.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          // Ask the user if they want to exit the app
          // In a real app, you would show a confirmation dialog
          CapApp.exitApp();
        }
      });
      
      return () => {
        handleBackButton.remove();
      };
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* App Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/stations" element={<Stations />} />
            <Route path="/book-slot/:stationId" element={<BookSlot />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/booking-details/:id" element={<BookingDetails />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
