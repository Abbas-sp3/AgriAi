import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { LanguageProvider } from "@/contexts/language-context";
import { VoiceAgent } from "@/components/voice-agent";
import NotFound from "@/pages/not-found";

import Dashboard from "@/pages/dashboard";
import Predict from "@/pages/predict";
import Advisor from "@/pages/advisor";
import Weather from "@/pages/weather";
import News from "@/pages/news";
import Calendar from "@/pages/calendar";
import Disease from "@/pages/disease";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  }
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/predict" component={Predict} />
        <Route path="/advisor" component={Advisor} />
        <Route path="/weather" component={Weather} />
        <Route path="/news" component={News} />
        <Route path="/calendar" component={Calendar} />
        <Route path="/disease" component={Disease} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
            <VoiceAgent />
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
