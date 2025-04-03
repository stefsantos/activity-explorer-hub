
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ActivityList from "./pages/ActivityList";
import ActivityDetail from "./pages/ActivityDetail";
import SavedActivities from "./pages/SavedActivities";
import NotFound from "./pages/NotFound";
import AuthLayout from "./pages/auth/AuthLayout";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Auth routes */}
            <Route path="/auth" element={<AuthLayout />}>
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<SignUp />} />
            </Route>
            
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/activities" element={<ActivityList />} />
            <Route path="/activity/:id" element={<ActivityDetail />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/saved" element={<SavedActivities />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            
            {/* Catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
