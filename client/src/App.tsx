
import { useEffect, lazy, Suspense } from "react";
import { Router, Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import { LoadingScreen } from "./components/LoadingScreen";
import { PWAInstallPrompt } from "./components/PWAInstallPrompt";
import { OrganizationStructuredData, WebAppStructuredData } from "./components/StructuredData";
import { analytics as firebaseAnalytics } from "./lib/firebase";
import { usePerformanceMonitor } from "./hooks/usePerformanceMonitor";
import { useSkipLink } from "./hooks/useSkipLink";
import { AISkateChat } from "./components/AISkateChat";
import { FeedbackButton } from "./components/FeedbackButton";

// Eager load critical pages
import UnifiedLanding from "./pages/unified-landing";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load non-critical pages for better performance
const Landing = lazy(() => import("./pages/landing"));
const NewLanding = lazy(() => import("./pages/new-landing"));
const Home = lazy(() => import("./pages/home"));
const Tutorial = lazy(() => import("./pages/tutorial"));
const Demo = lazy(() => import("./pages/demo"));
const DonationPage = lazy(() => import("./pages/donate"));
const AuthPage = lazy(() => import("./pages/auth"));
const SignupPage = lazy(() => import("./pages/signup"));
const SigninPage = lazy(() => import("./pages/signin"));
const VerifyPage = lazy(() => import("./pages/verify"));
const AuthVerifyPage = lazy(() => import("./pages/auth-verify"));
const VerifyEmailPage = lazy(() => import("./pages/verify-email"));
const VerifiedPage = lazy(() => import("./pages/verified"));
const ShopPage = lazy(() => import("./pages/shop"));
const CartPage = lazy(() => import("./pages/cart"));
const CheckoutPage = lazy(() => import("./pages/checkout"));
const OrderConfirmationPage = lazy(() => import("./pages/order-confirmation"));
const ClosetPage = lazy(() => import("./pages/closet"));
const MapPage = lazy(() => import("./pages/map"));
const SkateGamePage = lazy(() => import("./pages/skate-game"));
const LeaderboardPage = lazy(() => import("./pages/leaderboard"));

function AppRoutes() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Switch>
        {isLoading || !isAuthenticated ? (
          <>
          <Route path="/" component={UnifiedLanding} />
          <Route path="/old" component={Landing} />
          <Route path="/new" component={NewLanding} />
          <Route path="/home" component={Home} />
          <Route path="/demo" component={Demo} />
          <Route path="/donate" component={DonationPage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/order-confirmation" component={OrderConfirmationPage} />
          <Route path="/closet" component={ClosetPage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/signin" component={SigninPage} />
          <Route path="/verify" component={VerifyPage} />
          <Route path="/auth/verify" component={AuthVerifyPage} />
          <Route path="/verify-email" component={VerifyEmailPage} />
          <Route path="/verified" component={VerifiedPage} />
          <Route path="/tutorial" component={() => <AuthPage />} />
          {/* Protected routes with email verification */}
          <Route path="/map" component={() => <ProtectedRoute><MapPage /></ProtectedRoute>} />
          <Route path="/skate-game" component={() => <ProtectedRoute><SkateGamePage /></ProtectedRoute>} />
          <Route path="/leaderboard" component={() => <ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/home" component={Home} />
          <Route path="/donate" component={DonationPage} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/order-confirmation" component={OrderConfirmationPage} />
          <Route path="/closet" component={ClosetPage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/signin" component={SigninPage} />
          <Route path="/verify" component={VerifyPage} />
          <Route path="/auth/verify" component={AuthVerifyPage} />
          <Route path="/verify-email" component={VerifyEmailPage} />
          <Route path="/verified" component={VerifiedPage} />
          {/* Protected routes with email verification */}
          <Route path="/map" component={() => <ProtectedRoute><MapPage /></ProtectedRoute>} />
          <Route path="/skate-game" component={() => <ProtectedRoute><SkateGamePage /></ProtectedRoute>} />
          <Route path="/leaderboard" component={() => <ProtectedRoute><LeaderboardPage /></ProtectedRoute>} />
          <Route path="/tutorial" component={() => {
            return user ? <ProtectedRoute><Tutorial userId={user.uid} /></ProtectedRoute> : <Home />;
          }} />
        </>
      )}
      </Switch>
    </Suspense>
  );
}

export default function App() {
  // Monitor performance in development
  usePerformanceMonitor();
  
  // Enable skip link for accessibility
  useSkipLink();

  useEffect(() => {
    // Initialize Firebase Analytics on app start
    if (firebaseAnalytics) {
      console.log('Firebase Analytics initialized successfully');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <OrganizationStructuredData
          data={{
            name: "SkateHubba",
            url: "https://skatehubba.com",
            logo: "https://skatehubba.com/icon-512.png",
            description: "Remote SKATE battles, legendary spot check-ins, and live lobbies. Join the ultimate skateboarding social platform.",
            sameAs: [
              "https://twitter.com/skatehubba_app",
              "https://instagram.com/skatehubba",
            ],
          }}
        />
        <WebAppStructuredData
          data={{
            name: "SkateHubba",
            url: "https://skatehubba.com",
            description: "Stream. Connect. Skate. Your skateboarding social universe.",
            applicationCategory: "SportsApplication",
            operatingSystem: "Any",
            offers: {
              price: "0",
              priceCurrency: "USD",
            },
          }}
        />
        <Router>
          <AppRoutes />
        </Router>
        <Toaster />
        <PWAInstallPrompt />
        <AISkateChat />
        <FeedbackButton />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
