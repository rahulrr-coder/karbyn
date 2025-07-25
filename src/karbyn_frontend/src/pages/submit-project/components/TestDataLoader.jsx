import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { fillFormWithSampleData } from '../../../utils/mockProjectData';

/**
 * Component for loading test data into the form
 * This component is for development/testing only
 */
const TestDataLoader = ({ updateFormData }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  
  // Auto-fill the form on component mount
  useEffect(() => {
    // Check if auto-fill should happen
    const shouldAutoFill = new URLSearchParams(window.location.search).get('autofill') === 'true';
    
    if (shouldAutoFill && !autoFilled) {
      // Delay to ensure form is fully loaded
      const timer = setTimeout(() => {
        handleLoadTestData(0, true);
        setAutoFilled(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [updateFormData, autoFilled]);
  
  const handleLoadTestData = (projectIndex = 0, silent = false) => {
    fillFormWithSampleData(updateFormData, true, projectIndex);
    setShowOptions(false);
    if (!silent) {
      alert(`Test data loaded successfully! (Project ${projectIndex + 1})`);
    }
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      {showOptions ? (
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg space-y-2">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium">Select Test Data</h4>
            <button 
              onClick={() => setShowOptions(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLoadTestData(0)}
            iconName="Tree"
            iconPosition="left"
            className="w-full justify-start"
          >
            Rainforest Conservation
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLoadTestData(1)}
            iconName="Sun"
            iconPosition="left"
            className="w-full justify-start"
          >
            Solar Microgrid Project
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleLoadTestData(2)}
            iconName="Droplets"
            iconPosition="left"
            className="w-full justify-start"
          >
            Mangrove Restoration
          </Button>
          
          <div className="pt-2 text-xs text-muted-foreground">
            <p>Add <code>?autofill=true</code> to URL for auto-fill</p>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowOptions(true)}
          iconName="Database"
          iconPosition="left"
          className="bg-background/80 backdrop-blur-sm border-accent text-accent hover:bg-accent/10"
        >
          Load Test Data
        </Button>
      )}
    </div>
  );
};

export default TestDataLoader;
