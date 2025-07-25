import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ImpactMethodologyForm = ({ formData, updateFormData, errors }) => {
  const [uploadingFiles, setUploadingFiles] = useState(false);
  const methodologyStandards = [
    { value: 'vcs', label: 'Verified Carbon Standard (VCS)' },
    { value: 'gold-standard', label: 'Gold Standard' },
    { value: 'climate-action-reserve', label: 'Climate Action Reserve (CAR)' },
    { value: 'american-carbon-registry', label: 'American Carbon Registry (ACR)' },
    { value: 'plan-vivo', label: 'Plan Vivo' },
    { value: 'cdm', label: 'Clean Development Mechanism (CDM)' },
    { value: 'custom', label: 'Custom Methodology' }
  ];

  const measurementTools = [
    { value: 'satellite-monitoring', label: 'Satellite Monitoring & Remote Sensing' },
    { value: 'field-measurements', label: 'Field Measurements & Sampling' },
    { value: 'drone-surveys', label: 'Drone Surveys & Aerial Photography' },
    { value: 'iot-sensors', label: 'IoT Sensors & Automated Monitoring' },
    { value: 'biomass-calculations', label: 'Biomass Calculations & Allometric Equations' },
    { value: 'soil-analysis', label: 'Soil Carbon Analysis' },
    { value: 'energy-meters', label: 'Energy Consumption Meters' },
    { value: 'community-reporting', label: 'Community-Based Monitoring & Reporting' }
  ];

  const monitoringFrequencies = [
    { value: 'continuous', label: 'Continuous (Real-time)' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' },
    { value: 'biannually', label: 'Bi-annually' }
  ];

  const handleInputChange = (field, value) => {
    updateFormData('impact', { ...formData.impact, [field]: value });
  };

  const handleToolsChange = (toolValue, checked) => {
    const currentTools = formData.impact.measurementTools || [];
    const updatedTools = checked
      ? [...currentTools, toolValue]
      : currentTools.filter(tool => tool !== toolValue);
    handleInputChange('measurementTools', updatedTools);
  };
  
  const handleFileUpload = (type, files) => {
    if (!files || files.length === 0) {
      return; // No files selected
    }
    
    setUploadingFiles(true);
    console.log(`Uploading ${files.length} files for ${type}...`);
    
    // Simulate file upload process
    setTimeout(() => {
      try {
        const fileList = Array.from(files).map(file => ({
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        }));
        
        console.log(`Processed ${fileList.length} files:`, fileList);
        
        updateFormData('impact', {
          ...formData.impact,
          [type]: [...(formData.impact[type] || []), ...fileList]
        });
      } catch (error) {
        console.error('Error processing files:', error);
      } finally {
        setUploadingFiles(false);
      }
    }, 500); // Reduced delay for better UX
  };
  
  const removeFile = (type, fileId) => {
    const updatedFiles = (formData.impact[type] || []).filter(file => file.id !== fileId);
    updateFormData('impact', {
      ...formData.impact,
      [type]: updatedFiles
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Icon name="Calculator" size={16} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Impact Details</h2>
          <p className="text-sm text-muted-foreground">Define how you'll measure and document your carbon impact</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Select
          label="Carbon Standard"
          placeholder="Select methodology standard"
          options={methodologyStandards}
          value={formData.impact.standard || ''}
          onChange={(value) => handleInputChange('standard', value)}
          error={errors.standard}
          required
          description="Choose the carbon accounting standard you'll follow"
        />

        <Select
          label="Monitoring Frequency"
          placeholder="Select monitoring schedule"
          options={monitoringFrequencies}
          value={formData.impact.monitoringFrequency || ''}
          onChange={(value) => handleInputChange('monitoringFrequency', value)}
          error={errors.monitoringFrequency}
          required
          description="How often will you collect measurement data?"
        />

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-3">
            Measurement Tools & Methods <span className="text-error">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {measurementTools.map((tool) => (
              <Checkbox
                key={tool.value}
                label={tool.label}
                checked={(formData.impact.measurementTools || []).includes(tool.value)}
                onChange={(e) => handleToolsChange(tool.value, e.target.checked)}
              />
            ))}
          </div>
          {errors.measurementTools && (
            <p className="mt-2 text-sm text-error">{errors.measurementTools}</p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Select all measurement methods you plan to use for monitoring carbon impact
          </p>
        </div>
        
        {/* Project Photos Upload */}
        <div className="lg:col-span-2 mt-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Project Documentation</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Project Photos <span className="text-error">*</span>
              </label>
              <div className="border border-dashed border-border rounded-lg p-4 bg-muted/20">
                <div className="flex flex-col items-center justify-center py-4">
                  <Icon name="Image" size={32} className="text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Upload photos of your project site</p>
                  <input
                    type="file"
                    id="photos-upload"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload('photos', e.target.files)}
                    disabled={uploadingFiles}
                  />
                  <label htmlFor="photos-upload">
                    <div
                      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer ${uploadingFiles ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <Icon name="Upload" size={16} className="mr-2" />
                      {uploadingFiles ? 'Uploading...' : 'Select Files'}
                    </div>
                  </label>
                </div>
                
                {/* Display uploaded photos */}
                {formData.impact.photos && formData.impact.photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                    {formData.impact.photos.map((file) => (
                      <div key={file.id} className="relative group">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeFile('photos', file.id)}
                          className="absolute top-1 right-1 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon name="X" size={14} className="text-foreground" />
                        </button>
                        <p className="text-xs truncate mt-1">{file.name}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.photos && (
                  <p className="mt-2 text-sm text-error">{errors.photos}</p>
                )}
              </div>
            </div>
            
            {/* Certificates Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Certificates & Verifications
              </label>
              <div className="border border-dashed border-border rounded-lg p-4 bg-muted/20">
                <div className="flex flex-col items-center justify-center py-4">
                  <Icon name="FileCheck" size={32} className="text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">Upload any certification documents</p>
                  <input
                    type="file"
                    id="certificates-upload"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    className="hidden"
                    onChange={(e) => handleFileUpload('certificates', e.target.files)}
                    disabled={uploadingFiles}
                  />
                  <label htmlFor="certificates-upload">
                    <div
                      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 cursor-pointer ${uploadingFiles ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <Icon name="Upload" size={16} className="mr-2" />
                      {uploadingFiles ? 'Uploading...' : 'Select Files'}
                    </div>
                  </label>
                </div>
                
                {/* Display uploaded certificates */}
                {formData.impact.certificates && formData.impact.certificates.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.impact.certificates.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                        <div className="flex items-center space-x-2">
                          <Icon name="File" size={16} className="text-muted-foreground" />
                          <span className="text-sm truncate">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile('certificates', file.id)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <Icon name="X" size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Target" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Documentation Guidelines</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Include clear, high-quality photos of your project site and activities</li>
              <li>• Provide any existing certification documents or third-party verifications</li>
              <li>• Upload baseline data that supports your carbon impact claims</li>
              <li>• Ensure all documents are legible and properly labeled</li>
              <li>• Photos should show both the overall project area and specific activities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactMethodologyForm;