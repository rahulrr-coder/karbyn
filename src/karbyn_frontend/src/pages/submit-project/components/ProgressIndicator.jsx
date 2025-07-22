import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, totalSteps, steps }) => {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="mb-8">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="w-full bg-border rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full organic-transition"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="absolute top-0 left-0 w-full h-2 flex justify-between">
          {steps.map((_, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div
                key={index}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center -mt-2 bg-background organic-transition ${
                  isCompleted
                    ? 'border-primary bg-primary text-primary-foreground'
                    : isCurrent
                    ? 'border-primary bg-background text-primary' :'border-border bg-background text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Icon name="Check" size={12} />
                ) : (
                  <span className="text-xs font-medium">{stepNumber}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Labels */}
      <div className="grid grid-cols-4 gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={index} className="text-center">
              <div className={`text-xs font-medium ${
                isCompleted || isCurrent ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {step.title}
              </div>
              <div className="text-xs text-muted-foreground mt-1 hidden sm:block">
                {step.subtitle}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;