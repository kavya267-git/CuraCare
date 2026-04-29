import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { I18nProvider } from "@/lib/i18n";
import Index from "./pages/Index.tsx";
import Chat from "./pages/Chat.tsx";
import Energy from "./pages/Energy.tsx";
import Support from "./pages/Support.tsx";
import Circle from "./pages/Circle.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Helplines from "./pages/Helplines.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/energy" element={<Energy />} />
            <Route path="/support" element={<Support />} />
            <Route path="/circle" element={<Circle />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/helplines" element={<Helplines />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
