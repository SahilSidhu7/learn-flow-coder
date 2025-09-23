import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Languages from "./pages/Languages";
import Topics from "./pages/Topics";
import Learning from "./pages/Learning";
import NotFound from "./pages/NotFound";
import PersonalCourses from "./pages/PersonalCourses";
import Perstopics from "./pages/Perstopics";
import Subtopics from "./pages/Subtopics";
import PersLearning from "./pages/PersLearning";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/languages" element={<Languages />} />
          <Route path="/topics/:languageId" element={<Topics />} />
          <Route path="/learn/:topicId" element={<Learning />} />
          <Route path="/personal-courses" element={<PersonalCourses />} />
          <Route path="/perstopics/:courseId" element={<Perstopics />} />
          <Route path="/subtopics/:topicId" element={<Subtopics />} />
          <Route path="/perslearn/:subtopicId" element={<PersLearning />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
