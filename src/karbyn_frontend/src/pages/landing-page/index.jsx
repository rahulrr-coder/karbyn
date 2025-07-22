import React from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import HeroSection from './components/HeroSection';
import FeatureCards from './components/FeatureCards';
import ImpactMetrics from './components/ImpactMetrics';
import TestimonialsCarousel from './components/TestimonialsCarousel';
import NewsletterSignup from './components/NewsletterSignup';
import AnimatedSection from '../../components/ui/AnimatedSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero section with fade-in animation */}
        <AnimatedSection animation="fadeIn" duration={0.8}>
          <HeroSection />
        </AnimatedSection>
        
        {/* Feature cards with staggered slide-up animation */}
        <AnimatedSection animation="slideUp" delay={0.2}>
          <FeatureCards />
        </AnimatedSection>
        
        {/* Impact metrics with scale animation */}
        <AnimatedSection animation="scale" delay={0.3}>
          <ImpactMetrics />
        </AnimatedSection>
        
        {/* Testimonials with slide-in animation */}
        <AnimatedSection animation="slideLeft" delay={0.2}>
          <TestimonialsCarousel />
        </AnimatedSection>
        
        {/* Newsletter with slide-up animation */}
        <AnimatedSection animation="slideUp" delay={0.4}>
          <NewsletterSignup />
        </AnimatedSection>
      </main>
      
      <Footer />
    </div>
  );
};

export default LandingPage;