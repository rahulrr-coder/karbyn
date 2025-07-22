import React from 'react';
import Icon from '../../../components/AppIcon';

const ProcessFlow = ({ currentStep, onStepChange }) => {
  const steps = [
    {
      number: 1,
      title: "Onboard Project",
      description: "Submit your climate project",
      icon: "Upload"
    },
    {
      number: 2,
      title: "Community Verification",
      description: "Community validates impact",
      icon: "Users"
    },
    {
      number: 3,
      title: "Tokenization & Rewards",
      description: "Receive blockchain tokens",
      icon: "Coins"
    }
  ];

  return (
    <div className="bg-card rounded-lg organic-shadow-subtle p-6 mb-8">
      <h2 className="text-2xl font-semibold text-foreground text-center mb-8">
        Three-Step Climate Action Process
      </h2>
      
      {/* Desktop Horizontal Flow */}
      <div className="hidden md:flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div 
              className={`flex flex-col items-center cursor-pointer organic-transition ${
                currentStep === step.number ? 'scale-105' : 'hover:scale-102'
              }`}
              onClick={() => onStepChange(step.number)}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 organic-transition ${
                currentStep === step.number 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground hover:bg-primary/10'
              }`}>
                <Icon name={step.icon} size={28} />
              </div>
              <h3 className={`font-semibold text-center mb-1 organic-transition ${
                currentStep === step.number ? 'text-primary' : 'text-foreground'
              }`}>
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm text-center max-w-32">
                {step.description}
              </p>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className="h-0.5 bg-border relative">
                  <div className={`h-full bg-primary organic-transition ${
                    currentStep > step.number ? 'w-full' : 'w-0'
                  }`} />
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile Vertical Flow */}
      <div className="md:hidden space-y-4">
        {steps.map((step, index) => (
          <div key={step.number}>
            <div 
              className={`flex items-center space-x-4 p-4 rounded-lg cursor-pointer organic-transition ${
                currentStep === step.number 
                  ? 'bg-primary/10 border border-primary' :'bg-muted hover:bg-muted/80'
              }`}
              onClick={() => onStepChange(step.number)}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center organic-transition ${
                currentStep === step.number 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-background text-muted-foreground'
              }`}>
                <Icon name={step.icon} size={20} />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold organic-transition ${
                  currentStep === step.number ? 'text-primary' : 'text-foreground'
                }`}>
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
              <Icon 
                name="ChevronRight" 
                size={16} 
                className={`organic-transition ${
                  currentStep === step.number ? 'text-primary' : 'text-muted-foreground'
                }`} 
              />
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex justify-center py-2">
                <div className="w-0.5 h-8 bg-border relative">
                  <div className={`w-full bg-primary organic-transition ${
                    currentStep > step.number ? 'h-full' : 'h-0'
                  }`} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProcessFlow;