import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SuccessModal = ({ isOpen, onClose, projectId }) => {
  if (!isOpen) return null;

  const handleViewDashboard = () => {
    onClose();
    // Navigate to main dashboard
    window.location.href = '/dashboard';
  };

  const handleViewProjects = () => {
    onClose();
    // Navigate to projects listing - in a real app, this would use router
    window.location.href = '/projects-listing';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg organic-shadow-prominent max-w-md w-full p-6">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="CheckCircle" size={32} className="text-success" />
          </div>

          {/* Title */}
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Project Submitted Successfully!
          </h2>

          {/* Description */}
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Your carbon offset project has been submitted for community review. 
            You'll receive updates on the verification process via email.
          </p>

          {/* Project ID */}
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Project ID:</span>
              <span className="text-sm font-mono text-primary">{projectId}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="text-left mb-6">
            <h3 className="text-sm font-medium text-foreground mb-3">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <Icon name="Clock" size={12} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Initial Review</p>
                  <p className="text-xs text-muted-foreground">1-2 business days</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <Icon name="Users" size={12} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Community Verification</p>
                  <p className="text-xs text-muted-foreground">2-3 weeks</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <Icon name="Award" size={12} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Tokenization & Launch</p>
                  <p className="text-xs text-muted-foreground">1 week after approval</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={handleViewProjects}
              iconName="TreePine"
              iconPosition="left"
              fullWidth
            >
              View All Projects
            </Button>
            <Button
              variant="default"
              onClick={handleViewDashboard}
              iconName="BarChart3"
              iconPosition="left"
              fullWidth
            >
              Go to Dashboard
            </Button>
          </div>

          {/* Contact Info */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Questions about the review process? Contact us at{' '}
              <a href="mailto:support@karbyn.io" className="text-primary hover:underline">
                support@karbyn.io
              </a>
            </p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted organic-transition"
          aria-label="Close modal"
        >
          <Icon name="X" size={16} />
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;