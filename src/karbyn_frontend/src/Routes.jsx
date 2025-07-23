import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
// Existing pages
import LandingPage from "./pages/landing-page";
import HowItWorks from "./pages/how-it-works";
import ImpactDashboard from "./pages/impact-dashboard";
import ProjectsListing from "./pages/projects-listing";
import SubmitProject from "./pages/submit-project";
import ProjectDetails from "./pages/project-details";
import NotFound from "./pages/NotFound";
// New pages
import Login from "./pages/auth/Login";
import SignupWithBiometric from "./components/auth/SignupWithBiometric";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/marketplace/Marketplace";
import MyNFTs from "./pages/marketplace/MyNFTs";
import SubmitActivity from "./pages/activities/SubmitActivity";
import ActivityHistory from "./pages/activities/ActivityHistory";
// Community pages
import CommunityDashboard from "./pages/community/CommunityDashboard";
import FullLeaderboard from "./pages/community/FullLeaderboard";
// Business pages
import BusinessPartnership from "./pages/business/BusinessPartnership";
import BusinessDirectory from "./pages/business/BusinessDirectory";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
        {/* Landing and Info Pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/impact-dashboard" element={<ImpactDashboard />} />
        
        {/* Authentication */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<SignupWithBiometric />} />
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
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;