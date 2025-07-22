import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

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
          
          {/* Visual */}
          <div className="relative">
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden organic-shadow-prominent">
                <Image
                  src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Forest landscape representing climate action"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-card rounded-lg organic-shadow-moderate p-4 border border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Leaf" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Carbon Offset</p>
                    <p className="text-xs text-muted-foreground">1,247 tons CO₂</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-card rounded-lg organic-shadow-moderate p-4 border border-border">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Coins" size={20} className="text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Tokens Minted</p>
                    <p className="text-xs text-muted-foreground">24,891 KRB</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;