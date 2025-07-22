import React from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import HeroSection from './components/HeroSection';
import FeatureCards from './components/FeatureCards';
import ImpactMetrics from './components/ImpactMetrics';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import NewsletterSignup from './components/NewsletterSignup';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <HeroSection />
        <FeatureCards />
        <ImpactMetrics />
        <TestimonialsCarousel />
        <NewsletterSignup />
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;