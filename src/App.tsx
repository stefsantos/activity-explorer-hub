
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/contexts/UserContext";
import Index from "./pages/Index";
import ActivityList from "./pages/ActivityList";
import ActivityDetail from "./pages/ActivityDetail";
import SavedActivities from "./pages/SavedActivities";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { toast } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      onError: (error) => {
        console.error("Query error:", error);
        toast.error("Error loading data. Please try again.");
      },
    },
    mutations: {
      onError: (error) => {
        console.error("Mutation error:", error);
        toast.error("Operation failed. Please try again.");
      },
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/activities" element={<ActivityList />} />
            <Route path="/activity/:id" element={<ActivityDetail />} />
            <Route path="/saved" element={<SavedActivities />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
