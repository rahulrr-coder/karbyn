import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
// Add your imports here
import LandingPage from "./pages/landing-page";
import HowItWorks from "./pages/how-it-works";
import ImpactDashboard from "./pages/impact-dashboard";
import ProjectsListing from "./pages/projects-listing";
import SubmitProject from "./pages/submit-project";
import ProjectDetails from "./pages/project-details";
import NotFound from "./pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/impact-dashboard" element={<ImpactDashboard />} />
        <Route path="/projects-listing" element={<ProjectsListing />} />
        <Route path="/submit-project" element={<SubmitProject />} />
        <Route path="/project-details" element={<ProjectDetails />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;