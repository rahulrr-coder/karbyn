import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load pages for better code splitting
const LandingPage = lazy(() => import("./pages/landing-page"));
const HowItWorks = lazy(() => import("./pages/how-it-works"));
const ImpactDashboard = lazy(() => import("./pages/impact-dashboard"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Simple placeholder components for missing pages
const ProjectsPage = () => <div className="p-8"><h1 className="text-2xl">Projects - Coming Soon</h1></div>;
const SubmitProjectPage = () => <div className="p-8"><h1 className="text-2xl">Submit Project - Coming Soon</h1></div>;

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
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/impact" element={<ImpactDashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/submit-project" element={<SubmitProjectPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;