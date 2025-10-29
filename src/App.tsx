import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Index from "./pages/Index";
import LearningManagement from "./pages/LearningManagement";
import DigitalNoticeBoard from "./pages/DigitalNoticeBoard";
import Placements from "./pages/Placements";
import Profile from "./pages/Profile";
import Schedule from "./pages/Schedule";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  // Function to restart app (show splash screen again)
  const restartApp = () => {
    setShowSplash(true);
  };

  // Make restart function available globally
  if (typeof window !== 'undefined') {
    (window as any).restartApp = restartApp;
  }

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/learning" element={<LearningManagement />} />
            <Route path="/notice-board" element={<DigitalNoticeBoard />} />
            <Route path="/placements" element={<Placements />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/schedule" element={<Schedule />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
