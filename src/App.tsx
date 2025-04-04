
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import ActivityList from "./pages/ActivityList";
import ActivityDetail from "./pages/ActivityDetail";
import SavedActivities from "./pages/SavedActivities";
import OrganizerDetail from "./pages/OrganizerDetail";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <UserProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/activities" element={<ActivityList />} />
              <Route path="/activity/:id" element={<ActivityDetail />} />
              <Route path="/activities/:id" element={<ActivityDetail />} />
              <Route path="/organizer/:id" element={<OrganizerDetail />} />
              <Route path="/saved" element={<SavedActivities />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </UserProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
