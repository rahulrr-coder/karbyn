import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const FeatureCards = () => {
  const features = [
    {
      id: 1,
      icon: "Upload",
      title: "Onboard Project",
      description: "Submit your carbon offset project with detailed documentation, location data, and impact projections for community review.",
      color: "primary",
      link: "/submit-project"
    },
    {
      id: 2,
      icon: "Users",
      title: "Community Verification",
      description: "Decentralized community validates project authenticity through transparent voting and on-ground verification processes.",
      color: "secondary",
      link: "/how-it-works"
    },
    {
      id: 3,
      icon: "Coins",
      title: "Tokenization & Rewards",
      description: "Verified projects receive tokenized carbon credits, enabling transparent trading and financial incentives for climate action.",
      color: "accent",
      link: "/impact-dashboard"
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return {
          bg: 'bg-primary/10',
          icon: 'text-primary',
          border: 'border-primary/20'
        };
      case 'secondary':
        return {
          bg: 'bg-secondary/10',
          icon: 'text-secondary',
          border: 'border-secondary/20'
        };
      case 'accent':
        return {
          bg: 'bg-accent/10',
          icon: 'text-accent',
          border: 'border-accent/20'
        };
      default:
        return {
          bg: 'bg-muted',
          icon: 'text-muted-foreground',
          border: 'border-border'
        };
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How Karbyn Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your environmental impact into verified, tradeable carbon credits through community-driven validation.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            
            return (
              <div 
                key={feature.id}
                className="feature-card-animation"
                style={{ animationDelay: `${0.2 + (index * 0.15)}s` }}
              >
                <Link
                  to={feature.link}
                  className="group relative bg-card rounded-2xl p-8 organic-shadow-subtle hover:organic-shadow-moderate organic-transition border border-border hover:border-primary/20 block"
                >
                {/* Step Number */}
                <div className="absolute -top-4 left-8">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 organic-transition`}>
                  <Icon name={feature.icon} size={32} className={colors.icon} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-primary organic-transition">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Arrow */}
                <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 organic-transition">
                  <span className="text-sm font-medium mr-2">Learn more</span>
                  <Icon name="ArrowRight" size={16} />
                </div>

                {/* Connecting Line (except last card) */}
                {index < features.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                    </div>
                  </div>
                )}
                </Link>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <Link
            to="/how-it-works"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 font-medium organic-transition"
          >
            <span>View detailed process</span>
            <Icon name="ExternalLink" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;