import React from 'react';
import { useSafeNavigate } from '../../../utils/safeRouterHooks';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ hasFilters, onClearFilters }) => {
  const navigate = useSafeNavigate();

  const handleSubmitProject = () => {
    navigate('/submit-project');
  };

  if (hasFilters) {
    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon name="Search" size={32} className="text-muted-foreground" />
          </div>
          
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No projects match your filters
          </h3>
          
          <p className="text-muted-foreground mb-6">
            Try adjusting your search criteria or clearing some filters to see more results.
          </p>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              iconName="RotateCcw"
              onClick={onClearFilters}
              fullWidth
            >
              Clear All Filters
            </Button>
            
            <Button
              variant="default"
              iconName="Plus"
              onClick={handleSubmitProject}
              fullWidth
            >
              Submit New Project
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-16 px-4">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Icon name="TreePine" size={32} className="text-primary" />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No climate projects yet
        </h3>
        
        <p className="text-muted-foreground mb-6">
          Be the first to contribute to our decentralized climate action platform. 
          Submit your carbon offset project and help build a sustainable future.
        </p>
        
        <div className="space-y-3">
          <Button
            variant="default"
            iconName="Plus"
            onClick={handleSubmitProject}
            fullWidth
          >
            Submit Your First Project
          </Button>
          
          <Button
            variant="ghost"
            iconName="Info"
            onClick={() => navigate('/how-it-works')}
            fullWidth
          >
            Learn How It Works
          </Button>
        </div>
        
        <div className="mt-8 p-4 bg-accent/10 rounded-lg border border-accent/20">
          <div className="flex items-start space-x-3">
            <Icon name="Lightbulb" size={20} className="text-accent mt-0.5" />
            <div className="text-left">
              <h4 className="text-sm font-medium text-foreground mb-1">
                Getting Started
              </h4>
              <p className="text-sm text-muted-foreground">
                Projects go through community verification before tokenization. 
                Start with clear documentation and measurable impact metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;