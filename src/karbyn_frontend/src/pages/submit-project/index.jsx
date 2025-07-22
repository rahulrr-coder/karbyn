import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Breadcrumb from '../../components/ui/Breadcrumb';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProjectBasicsForm from './components/ProjectBasicsForm';
import ImpactMethodologyForm from './components/ImpactMethodologyForm';
import DocumentationUpload from './components/DocumentationUpload';
import ReviewSubmit from './components/ReviewSubmit';
import ProgressIndicator from './components/ProgressIndicator';
import LocationSelector from './components/LocationSelector';
import SuccessModal from './components/SuccessModal';

const SubmitProject = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedProjectId, setSubmittedProjectId] = useState('');
  const [errors, setErrors] = useState({});
  const [lastSaved, setLastSaved] = useState(null);

  const steps = [
    { title: 'Project Basics', subtitle: 'Core information' },
    { title: 'Methodology', subtitle: 'Impact measurement' },
    { title: 'Documentation', subtitle: 'Supporting files' },
    { title: 'Review & Submit', subtitle: 'Final confirmation' }
  ];

  const [formData, setFormData] = useState({
    basics: {
      name: '',
      type: '',
      region: '',
      location: '',
      area: '',
      description: '',
      duration: '',
      carbonImpact: '',
      latitude: '',
      longitude: ''
    },
    methodology: {
      standard: '',
      monitoringFrequency: '',
      measurementTools: [],
      baseline: '',
      baselineCarbon: '',
      measurementStartDate: '',
      additionality: '',
      qualityAssurance: ''
    },
    documentation: {
      certificates: [],
      'baseline-data': [],
      photos: [],
      methodology: [],
      community: [],
      financial: []
    },
    review: {
      acceptedTerms: false,
      acceptedPrivacy: false,
      acceptedCommunity: false
    }
  });

  // Auto-save functionality
  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem('karbyn-project-draft', JSON.stringify(formData));
      setLastSaved(new Date());
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [formData]);

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('karbyn-project-draft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(parsedDraft);
      } catch (error) {
        console.error('Error loading saved draft:', error);
      }
    }
  }, []);

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: data
    }));
    
    // Clear errors for this section
    setErrors(prev => {
      const newErrors = { ...prev };
      Object.keys(data).forEach(key => {
        delete newErrors[key];
      });
      return newErrors;
    });
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // Project Basics
        if (!formData.basics.name?.trim()) newErrors.name = 'Project name is required';
        if (!formData.basics.type) newErrors.type = 'Project type is required';
        if (!formData.basics.region) newErrors.region = 'Region is required';
        if (!formData.basics.location?.trim()) newErrors.location = 'Specific location is required';
        if (!formData.basics.area) newErrors.area = 'Project area is required';
        if (!formData.basics.description?.trim() || formData.basics.description.length < 100) {
          newErrors.description = 'Description must be at least 100 characters';
        }
        if (!formData.basics.duration) newErrors.duration = 'Project duration is required';
        if (!formData.basics.carbonImpact) newErrors.carbonImpact = 'Carbon impact estimate is required';
        break;

      case 2: // Methodology
        if (!formData.methodology.standard) newErrors.standard = 'Carbon standard is required';
        if (!formData.methodology.monitoringFrequency) newErrors.monitoringFrequency = 'Monitoring frequency is required';
        if (!formData.methodology.measurementTools?.length) newErrors.measurementTools = 'At least one measurement tool is required';
        if (!formData.methodology.baseline?.trim()) newErrors.baseline = 'Baseline methodology is required';
        if (!formData.methodology.baselineCarbon) newErrors.baselineCarbon = 'Baseline carbon level is required';
        if (!formData.methodology.measurementStartDate) newErrors.measurementStartDate = 'Measurement start date is required';
        if (!formData.methodology.additionality?.trim()) newErrors.additionality = 'Additionality justification is required';
        break;

      case 3: // Documentation
        const requiredDocs = ['certificates', 'baseline-data', 'photos', 'methodology'];
        requiredDocs.forEach(docType => {
          if (!formData.documentation[docType]?.length) {
            newErrors[docType] = `${docType.replace('-', ' ')} documentation is required`;
          }
        });
        break;

      case 4: // Review & Submit
        if (!formData.review.acceptedTerms) newErrors.acceptedTerms = 'You must accept the terms of service';
        if (!formData.review.acceptedPrivacy) newErrors.acceptedPrivacy = 'You must accept the privacy policy';
        if (!formData.review.acceptedCommunity) newErrors.acceptedCommunity = 'You must accept the community verification process';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock project ID
      const projectId = `KARBYN-${Date.now().toString().slice(-6)}`;
      setSubmittedProjectId(projectId);
      
      // Clear saved draft
      localStorage.removeItem('karbyn-project-draft');
      
      // Show success modal
      setShowSuccessModal(true);
      
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({ submit: 'Failed to submit project. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <ProjectBasicsForm
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
            <LocationSelector
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          </div>
        );
      case 2:
        return (
          <ImpactMethodologyForm
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 3:
        return (
          <DocumentationUpload
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
          />
        );
      case 4:
        return (
          <ReviewSubmit
            formData={formData}
            updateFormData={updateFormData}
            errors={errors}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 lg:px-6 py-8">
        <Breadcrumb />
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Plus" size={24} color="white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Submit New Project</h1>
              <p className="text-muted-foreground">
                Onboard your carbon offset project to the Karbyn platform
              </p>
            </div>
          </div>
          
          {/* Auto-save indicator */}
          {lastSaved && (
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Icon name="Save" size={12} />
              <span>Draft saved at {lastSaved.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        {/* Progress Indicator */}
        <ProgressIndicator
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
        />

        {/* Form Content */}
        <div className="bg-card border border-border rounded-lg p-6 lg:p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <div>
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                iconName="ChevronLeft"
                iconPosition="left"
              >
                Previous
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Save Draft Button */}
            <Button
              variant="ghost"
              onClick={() => {
                localStorage.setItem('karbyn-project-draft', JSON.stringify(formData));
                setLastSaved(new Date());
              }}
              iconName="Save"
              iconPosition="left"
            >
              Save Draft
            </Button>
            
            {currentStep < steps.length && (
              <Button
                variant="default"
                onClick={handleNext}
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next Step
              </Button>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-accent/10 border border-accent/20 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <Icon name="HelpCircle" size={20} className="text-accent mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Our team is here to help you successfully submit your carbon offset project.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm" iconName="Book" iconPosition="left">
                  View Guidelines
                </Button>
                <Button variant="outline" size="sm" iconName="MessageCircle" iconPosition="left">
                  Contact Support
                </Button>
                <Button variant="outline" size="sm" iconName="Video" iconPosition="left">
                  Watch Tutorial
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        projectId={submittedProjectId}
      />
    </div>
  );
};

export default SubmitProject;