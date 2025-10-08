import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
// import DashboardPage from "./pages/DashboardPage"; // Removed
import NotFound from "./pages/NotFound";

// Placeholder pages for now, will be filled in later
import CoursesPage from "./pages/CoursesPage";
import ResourcesPage from "./pages/ResourcesPage";
import LandingPage from "./pages/LandingPage";
import AIConfigPage from "./pages/AIConfigPage";
import PromptLibraryPage from "./pages/PromptLibraryPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<CoursesPage />} /> {/* CoursesPage is now the default */}
            {/* <Route index element={<DashboardPage />} /> */} {/* Removed Dashboard route */}
            <Route path="courses" element={<CoursesPage />} />
            <Route path="resources" element={<ResourcesPage />} />
            <Route path="landing-page" element={<LandingPage />} />
            <Route path="ai-config" element={<AIConfigPage />} />
            <Route path="prompts" element={<PromptLibraryPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;