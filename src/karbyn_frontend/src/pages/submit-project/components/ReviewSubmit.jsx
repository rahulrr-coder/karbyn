import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ReviewSubmit = ({ formData, updateFormData, errors, onSubmit, isSubmitting }) => {
  const handleTermsChange = (checked) => {
    updateFormData('review', { ...formData.review, acceptedTerms: checked });
  };

  const handlePrivacyChange = (checked) => {
    updateFormData('review', { ...formData.review, acceptedPrivacy: checked });
  };

  // Removed community verification checkbox

  const formatFileCount = (files) => {
    if (!files || files.length === 0) return 'No files uploaded';
    return `${files.length} file${files.length > 1 ? 's' : ''} uploaded`;
  };

  const getProjectTypeLabel = (value) => {
    const types = {
      'reforestation': 'Reforestation & Afforestation',
      'renewable-energy': 'Renewable Energy',
      'soil-carbon': 'Soil Carbon Sequestration',
      'wetland-restoration': 'Wetland Restoration',
      'biogas': 'Biogas & Methane Capture',
      'energy-efficiency': 'Energy Efficiency',
      'sustainable-agriculture': 'Sustainable Agriculture',
      'ocean-conservation': 'Ocean & Marine Conservation'
    };
    return types[value] || value;
  };

  const getStandardLabel = (value) => {
    const standards = {
      'vcs': 'Verified Carbon Standard (VCS)',
      'gold-standard': 'Gold Standard',
      'climate-action-reserve': 'Climate Action Reserve (CAR)',
      'american-carbon-registry': 'American Carbon Registry (ACR)',
      'plan-vivo': 'Plan Vivo',
      'cdm': 'Clean Development Mechanism (CDM)',
      'custom': 'Custom Methodology'
    };
    return standards[value] || value;
  };

  const documentationSummary = [
    { id: 'certificates', title: 'Certificates & Permits', required: true },
    { id: 'baseline-data', title: 'Baseline Data & Reports', required: true },
    { id: 'photos', title: 'Project Photos', required: true },
    { id: 'methodology', title: 'Methodology Documents', required: true },
    { id: 'community', title: 'Community Engagement', required: false },
    { id: 'financial', title: 'Financial Documentation', required: false }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Icon name="CheckCircle" size={16} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Review & Submit</h2>
          <p className="text-sm text-muted-foreground">Review your project details before submission</p>
        </div>
      </div>

      {/* Project Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="FileText" size={20} />
          <span>Project Summary</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Project Name</label>
            <p className="text-foreground">{formData.basics.name || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Project Type</label>
            <p className="text-foreground">{getProjectTypeLabel(formData.basics.type) || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Location</label>
            <p className="text-foreground">{formData.basics.location || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Expected Carbon Impact</label>
            <p className="text-foreground">
              {formData.basics.carbonImpact ? `${formData.basics.carbonImpact} tCO2e/year` : 'Not specified'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Coordinates</label>
            <p className="text-foreground">
              {formData.basics.latitude && formData.basics.longitude ? 
                `${formData.basics.latitude}, ${formData.basics.longitude}` : 'Not specified'}
            </p>
          </div>
        </div>

        {formData.basics.description && (
          <div className="mt-4">
            <label className="text-sm font-medium text-muted-foreground">Description</label>
            <p className="text-foreground text-sm leading-relaxed mt-1">
              {formData.basics.description}
            </p>
          </div>
        )}
      </div>

      {/* Impact Details Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Calculator" size={20} />
          <span>Impact Details</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Carbon Standard</label>
            <p className="text-foreground">{getStandardLabel(formData.impact.standard) || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Monitoring Frequency</label>
            <p className="text-foreground capitalize">
              {formData.impact.monitoringFrequency?.replace('-', ' ') || 'Not specified'}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Measurement Tools</label>
            <p className="text-foreground">
              {formData.impact.measurementTools?.length > 0 
                ? `${formData.impact.measurementTools.length} tools selected`
                : 'Not specified'
              }
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Documentation</label>
            <p className="text-foreground">
              {(formData.impact.photos?.length || 0) + (formData.impact.certificates?.length || 0)} files uploaded
            </p>
          </div>
        </div>
      </div>

      {/* Documentation Summary */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Upload" size={20} />
          <span>Documentation Summary</span>
        </h3>
        
        <div className="space-y-3">
          {/* Project Photos */}
          <div className="flex items-center justify-between py-2 border-b border-border">
            <div className="flex items-center space-x-3">
              <Icon 
                name={(formData.impact.photos?.length > 0) ? "CheckCircle" : "Circle"} 
                size={16} 
                className={(formData.impact.photos?.length > 0) ? "text-success" : "text-muted-foreground"} 
              />
              <span className="text-foreground">
                Project Photos
                <span className="text-error ml-1">*</span>
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatFileCount(formData.impact.photos)}
            </span>
          </div>
          
          {/* Certificates */}
          <div className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
            <div className="flex items-center space-x-3">
              <Icon 
                name={(formData.impact.certificates?.length > 0) ? "CheckCircle" : "Circle"} 
                size={16} 
                className={(formData.impact.certificates?.length > 0) ? "text-success" : "text-muted-foreground"} 
              />
              <span className="text-foreground">
                Certificates & Verifications
              </span>
            </div>
            <span className="text-sm text-muted-foreground">
              {formatFileCount(formData.impact.certificates)}
            </span>
          </div>
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Shield" size={20} />
          <span>Terms & Agreements</span>
        </h3>
        
        <div className="space-y-4">
          <Checkbox
            label="I agree to the Karbyn Platform Terms of Service"
            description="By checking this box, you agree to our platform terms and conditions for project submission and verification."
            checked={formData.review.acceptedTerms || false}
            onChange={(e) => handleTermsChange(e.target.checked)}
            error={errors.acceptedTerms}
            required
          />
          
          <Checkbox
            label="I consent to the Privacy Policy and data processing"
            description="Your project data will be processed according to our privacy policy and used for verification purposes."
            checked={formData.review.acceptedPrivacy || false}
            onChange={(e) => handlePrivacyChange(e.target.checked)}
            error={errors.acceptedPrivacy}
            required
          />
        </div>
      </div>

      {/* Next Steps Information */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">What happens next?</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={12} />
                <span><strong>Initial Review (1-2 days):</strong> Platform team reviews submission for completeness</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Users" size={12} />
                <span><strong>Community Verification (2-3 weeks):</strong> Expert reviewers assess methodology and documentation</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Award" size={12} />
                <span><strong>Approval & Tokenization (1 week):</strong> Approved projects are tokenized and listed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="TrendingUp" size={12} />
                <span><strong>Ongoing Monitoring:</strong> Regular verification of project progress and impact</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          variant="default"
          size="lg"
          onClick={onSubmit}
          loading={isSubmitting}
          iconName="Send"
          iconPosition="right"
          disabled={!formData.review.acceptedTerms || !formData.review.acceptedPrivacy}
        >
          {isSubmitting ? 'Submitting Project...' : 'Submit Project for Review'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewSubmit;