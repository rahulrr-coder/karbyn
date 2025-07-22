import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Submit New Project",
      description: "Add your climate action project for community verification",
      icon: "Plus",
      variant: "default",
      onClick: () => navigate('/submit-project')
    },
    {
      title: "Join Verification",
      description: "Help verify community projects and earn rewards",
      icon: "Shield",
      variant: "outline",
      onClick: () => navigate('/projects-listing')
    },
    {
      title: "View All Projects",
      description: "Browse and support active climate projects",
      icon: "TreePine",
      variant: "ghost",
      onClick: () => navigate('/projects-listing')
    }
  ];

  return (
    <div className="bg-card rounded-lg p-6 organic-shadow-subtle border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
      
      <div className="space-y-3">
        {actions.map((action, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 organic-transition">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground mb-1">
                {action.title}
              </h4>
              <p className="text-xs text-muted-foreground">
                {action.description}
              </p>
            </div>
            
            <Button
              variant={action.variant}
              size="sm"
              iconName={action.icon}
              iconPosition="left"
              onClick={action.onClick}
              className="ml-3"
            >
              {action.title.split(' ')[0]}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;