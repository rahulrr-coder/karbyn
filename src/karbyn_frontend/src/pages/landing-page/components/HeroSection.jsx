import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import CarbonVisualization from './CarbonVisualization';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-background via-surface to-muted min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/20"></div>
        <div className="absolute bottom-32 right-16 w-24 h-24 rounded-full bg-accent/20"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-secondary/20"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Icon name="Zap" size={16} />
              <span>Powered by Web3 & Community</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Decentralize
              <span className="block text-primary">Climate Action</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Empower communities to verify, track, and tokenize environmental impact through blockchain-based transparency. Build trust and financial incentives in climate action.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/submit-project">
                <Button 
                  variant="default" 
                  size="lg" 
                  iconName="Plus" 
                  iconPosition="left"
                  className="w-full sm:w-auto"
                >
                  Submit Project
                </Button>
              </Link>
              
              <Link to="/projects-listing">
                <Button 
                  variant="outline" 
                  size="lg" 
                  iconName="TreePine" 
                  iconPosition="left"
                  className="w-full sm:w-auto"
                >
                  Explore Projects
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start space-x-8 mt-12 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-primary" />
                <span>Blockchain Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={16} className="text-primary" />
                <span>Community Driven</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Globe" size={16} className="text-primary" />
                <span>Global Impact</span>
              </div>
            </div>
          </div>
          
          {/* Visual - Interactive Carbon Cycle */}
          <div className="relative">
            <CarbonVisualization />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;