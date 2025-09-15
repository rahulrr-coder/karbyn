import React from 'react';
import { useSafeNavigate } from '../../../utils/safeRouterHooks';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CallToActionSection = () => {
  const navigate = useSafeNavigate();

  const actions = [
    {
      title: "Submit Your Project",
      description: "Ready to make an impact? Submit your climate project for community verification.",
      icon: "Upload",
      variant: "default",
      path: "/submit-project"
    },
    {
      title: "Join Community Verification",
      description: "Help verify climate projects and earn rewards for your contributions.",
      icon: "Users",
      variant: "outline",
      path: "/projects-listing"
    },
    {
      title: "View Impact Dashboard",
      description: "Explore verified projects and track global climate impact metrics.",
      icon: "BarChart3",
      variant: "secondary",
      path: "/impact-dashboard"
    }
  ];

  return (
    <div className="bg-surface rounded-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-3">
          Ready to Take Climate Action?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join thousands of climate activists using blockchain technology to create 
          transparent, verifiable environmental impact. Start your journey today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <div key={index} className="bg-card rounded-lg p-6 organic-shadow-subtle hover:organic-shadow-moderate organic-transition">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon name={action.icon} size={24} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{action.description}</p>
              <Button
                variant={action.variant}
                onClick={() => navigate(action.path)}
                iconName="ArrowRight"
                iconPosition="right"
                className="w-full"
              >
                Get Started
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Signup */}
      <div className="mt-8 pt-8 border-t border-border text-center">
        <h3 className="font-semibold text-foreground mb-2">Stay Updated</h3>
        <p className="text-muted-foreground text-sm mb-4">
          Get the latest updates on climate projects and platform developments.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
          <Button variant="default" iconName="Send" iconPosition="right">
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CallToActionSection;