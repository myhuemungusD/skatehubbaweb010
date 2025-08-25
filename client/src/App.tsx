import { Router, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import Landing from "./pages/landing";
import NewLanding from "./pages/new-landing";
import Home from "./pages/home";
import UnifiedLanding from "./pages/unified-landing";
import NotFound from "./pages/not-found";
import Tutorial from "./pages/tutorial";
import Demo from "./pages/demo";
import DonationPage from "./pages/donate";
import AuthPage from "./pages/auth";
import VerifyEmailPage from "./pages/verify-email";
import { analytics as firebaseAnalytics } from "./lib/firebase";
import { useEffect } from "react";


function Router() {
  const { isAuthenticated, isLoading } = useAuth();


  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#181818] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={UnifiedLanding} />
          <Route path="/old" component={Landing} />
          <Route path="/new" component={NewLanding} />
          <Route path="/home" component={Home} />
          <Route path="/tutorial" component={Tutorial} />
          <Route path="/demo" component={Demo} />
          <Route path="/donate" component={DonationPage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/verify-email" component={VerifyEmailPage} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/donate" component={DonationPage} />
          <Route path="/tutorial" component={() => {
            const { user } = useAuth();
            return user ? <Tutorial userId={user.id} /> : <NotFound />;
          }} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/verify-email" component={VerifyEmailPage} />
          <Route component={NotFound} />
        </>
      )}
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Initialize Firebase Analytics on app start
    if (firebaseAnalytics) {
      console.log('Firebase Analytics initialized successfully');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;