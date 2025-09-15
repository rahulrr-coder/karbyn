import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landing-page";
import HowItWorks from "./pages/how-it-works";
import ImpactDashboard from "./pages/impact-dashboard";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Simple placeholder components for missing pages
const ProjectsPage = () => <div className="p-8"><h1 className="text-2xl">Projects - Coming Soon</h1></div>;
const SubmitProjectPage = () => <div className="p-8"><h1 className="text-2xl">Submit Project - Coming Soon</h1></div>;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/impact" element={<ImpactDashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/submit-project" element={<SubmitProjectPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;