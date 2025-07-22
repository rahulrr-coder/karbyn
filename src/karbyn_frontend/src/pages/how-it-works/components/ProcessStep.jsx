import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProcessStep = ({ step, isActive, onStepClick }) => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const getStepIcon = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return 'Upload';
      case 2:
        return 'Users';
      case 3:
        return 'Coins';
      default:
        return 'Circle';
    }
  };

  const getStepColor = (stepNumber) => {
    switch (stepNumber) {
      case 1:
        return 'text-blue-600 bg-blue-100';
      case 2:
        return 'text-green-600 bg-green-100';
      case 3:
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className={`bg-card rounded-lg organic-shadow-subtle p-6 organic-transition ${
      isActive ? 'ring-2 ring-primary' : 'hover:organic-shadow-moderate'
    }`}>
      {/* Step Header */}
      <div 
        className="flex items-center space-x-4 cursor-pointer mb-6"
        onClick={() => onStepClick(step.number)}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStepColor(step.number)}`}>
          <Icon name={getStepIcon(step.number)} size={24} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-foreground mb-1">{step.title}</h3>
          <p className="text-muted-foreground text-sm">{step.subtitle}</p>
        </div>
        <Icon 
          name={isActive ? 'ChevronUp' : 'ChevronDown'} 
          size={20} 
          className="text-muted-foreground" 
        />
      </div>

      {/* Step Content */}
      {isActive && (
        <div className="space-y-6">
          {/* Description */}
          <p className="text-foreground leading-relaxed">{step.description}</p>

          {/* Visual Content */}
          <div className="bg-surface rounded-lg p-4">
            <Image
              src={step.image}
              alt={step.title}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {step.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="Check" size={14} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">{feature.title}</h4>
                    <p className="text-muted-foreground text-xs">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Frequently Asked Questions</h4>
            {step.faqs.map((faq, index) => (
              <div key={index} className="border border-border rounded-lg">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-muted organic-transition"
                >
                  <span className="font-medium text-foreground text-sm">{faq.question}</span>
                  <Icon 
                    name={expandedFaq === index ? 'Minus' : 'Plus'} 
                    size={16} 
                    className="text-muted-foreground" 
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-3 border-t border-border">
                    <p className="text-muted-foreground text-sm mt-2">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Button
              variant="default"
              iconName={step.actionIcon}
              iconPosition="right"
              className="w-full md:w-auto"
            >
              {step.actionText}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessStep;