import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./contexts/SimpleAuthContext";

// Immediate load for critical pages
import LandingPage from "./pages/landing-page";
import SimpleLogin from "./components/SimpleLogin";
import NotFound from "./pages/NotFound";

// Lazy load non-critical pages for better performance
const HowItWorks = lazy(() => import("./pages/how-it-works"));
const ImpactDashboard = lazy(() => import("./pages/impact-dashboard"));
const ProjectsListing = lazy(() => import("./pages/projects-listing"));
const SubmitProject = lazy(() => import("./pages/submit-project"));
const ProjectDetails = lazy(() => import("./pages/project-details"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Marketplace = lazy(() => import("./pages/marketplace/Marketplace"));
const MyNFTs = lazy(() => import("./pages/marketplace/MyNFTs"));
const SubmitActivity = lazy(() => import("./pages/activities/SubmitActivity"));
const ActivityHistory = lazy(() => import("./pages/activities/ActivityHistory"));
const CommunityDashboard = lazy(() => import("./pages/community/CommunityDashboard"));
const FullLeaderboard = lazy(() => import("./pages/community/FullLeaderboard"));
const BusinessPartnership = lazy(() => import("./pages/business/BusinessPartnership"));
const BusinessDirectory = lazy(() => import("./pages/business/BusinessDirectory"));

// Loading component for lazy routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const Routes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <RouterRoutes>
            {/* Landing and Info Pages - Available to all users */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/impact-dashboard" element={<ImpactDashboard />} />
            
            {/* Authentication */}
            <Route path="/login" element={<SimpleLogin />} />
            
            {/* Protected Routes - Only for authenticated users */}
            {isAuthenticated ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                
                {/* Activities */}
                <Route path="/activities/submit" element={<SubmitActivity />} />
                <Route path="/activities/history" element={<ActivityHistory />} />
                
                {/* Marketplace */}
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/marketplace/my-nfts" element={<MyNFTs />} />
                
                {/* Community */}
                <Route path="/community" element={<CommunityDashboard />} />
                <Route path="/community/leaderboard" element={<FullLeaderboard />} />
                
                {/* Business */}
                <Route path="/business/partnership" element={<BusinessPartnership />} />
                <Route path="/business/directory" element={<BusinessDirectory />} />
                
                {/* Projects */}
                <Route path="/projects-listing" element={<ProjectsListing />} />
                <Route path="/submit-project" element={<SubmitProject />} />
                <Route path="/project-details" element={<ProjectDetails />} />
              </>
            ) : (
              // Redirect unauthenticated users trying to access protected routes to login
              <>
                <Route path="/dashboard" element={<SimpleLogin />} />
                <Route path="/activities/*" element={<SimpleLogin />} />
                <Route path="/marketplace/*" element={<SimpleLogin />} />
                <Route path="/community/*" element={<SimpleLogin />} />
                <Route path="/business/*" element={<SimpleLogin />} />
                <Route path="/submit-project" element={<SimpleLogin />} />
                <Route path="/project-details" element={<SimpleLogin />} />
              </>
            )}
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </RouterRoutes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;