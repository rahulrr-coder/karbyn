import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load pages for better code splitting
const LandingPage = lazy(() => import("./pages/landing-page"));
const HowItWorks = lazy(() => import("./pages/how-it-works"));
const ImpactDashboard = lazy(() => import("./pages/impact-dashboard"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SubmitProject = lazy(() => import("./pages/submit-project"));
const ProjectsListing = lazy(() => import("./pages/projects-listing"));
const ProjectDetails = lazy(() => import("./pages/project-details"));
const Marketplace = lazy(() => import("./pages/marketplace/EnhancedMarketplace"));

// Simple placeholder for admin panel (can be enhanced later)
const AdminPanel = () => <div className="p-8"><h1 className="text-2xl">Admin Panel - Coming Soon</h1></div>;

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/projects" element={<ProjectsListing />} />
        <Route path="/projects-listing" element={<ProjectsListing />} />
        <Route path="/project-details" element={<ProjectDetails />} />
        <Route path="/impact" element={<ImpactDashboard />} />
        <Route path="/impact-dashboard" element={<ImpactDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit-project" element={<SubmitProject />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;