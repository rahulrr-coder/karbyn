import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ImpactMethodologyForm = ({ formData, updateFormData, errors }) => {
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
    updateFormData('methodology', { ...formData.methodology, [field]: value });
  };

  const handleToolsChange = (toolValue, checked) => {
    const currentTools = formData.methodology.measurementTools || [];
    const updatedTools = checked
      ? [...currentTools, toolValue]
      : currentTools.filter(tool => tool !== toolValue);
    handleInputChange('measurementTools', updatedTools);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Icon name="Calculator" size={16} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Impact Methodology</h2>
          <p className="text-sm text-muted-foreground">Define how you'll measure and verify carbon impact</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Select
          label="Carbon Standard"
          placeholder="Select methodology standard"
          options={methodologyStandards}
          value={formData.methodology.standard || ''}
          onChange={(value) => handleInputChange('standard', value)}
          error={errors.standard}
          required
          description="Choose the carbon accounting standard you'll follow"
        />

        <Select
          label="Monitoring Frequency"
          placeholder="Select monitoring schedule"
          options={monitoringFrequencies}
          value={formData.methodology.monitoringFrequency || ''}
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
                checked={(formData.methodology.measurementTools || []).includes(tool.value)}
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

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Baseline Methodology <span className="text-error">*</span>
          </label>
          <textarea
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            rows={4}
            placeholder="Describe how you established the baseline carbon levels before project implementation. Include data sources, measurement periods, and calculation methods used to determine the reference scenario."
            value={formData.methodology.baseline || ''}
            onChange={(e) => handleInputChange('baseline', e.target.value)}
          />
          {errors.baseline && (
            <p className="mt-1 text-sm text-error">{errors.baseline}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Explain your approach to establishing pre-project carbon levels
          </p>
        </div>

        <Input
          label="Baseline Carbon Level (tCO2e)"
          type="number"
          placeholder="e.g., 150000"
          value={formData.methodology.baselineCarbon || ''}
          onChange={(e) => handleInputChange('baselineCarbon', e.target.value)}
          error={errors.baselineCarbon}
          required
          description="Total carbon emissions/storage before project start"
        />

        <Input
          label="Measurement Start Date"
          type="date"
          value={formData.methodology.measurementStartDate || ''}
          onChange={(e) => handleInputChange('measurementStartDate', e.target.value)}
          error={errors.measurementStartDate}
          required
          description="When did baseline measurements begin?"
        />

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Additionality Justification <span className="text-error">*</span>
          </label>
          <textarea
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            rows={4}
            placeholder="Explain why this project would not happen without carbon finance. Describe barriers (financial, technological, institutional) that carbon credits help overcome, and provide evidence that the project is additional to business-as-usual scenarios."
            value={formData.methodology.additionality || ''}
            onChange={(e) => handleInputChange('additionality', e.target.value)}
          />
          {errors.additionality && (
            <p className="mt-1 text-sm text-error">{errors.additionality}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Demonstrate that your project wouldn't happen without carbon credit revenue
          </p>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Quality Assurance Plan
          </label>
          <textarea
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            rows={3}
            placeholder="Describe your quality control measures, data validation processes, and third-party verification plans to ensure measurement accuracy and prevent over-crediting."
            value={formData.methodology.qualityAssurance || ''}
            onChange={(e) => handleInputChange('qualityAssurance', e.target.value)}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Optional: Outline measures to ensure data quality and prevent errors
          </p>
        </div>
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Target" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Methodology Best Practices</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Use conservative estimates to avoid over-crediting carbon benefits</li>
              <li>• Implement robust monitoring systems with regular calibration</li>
              <li>• Account for leakage - emissions that may occur outside project boundaries</li>
              <li>• Plan for permanence - ensure carbon benefits are maintained long-term</li>
              <li>• Consider co-benefits like biodiversity, water quality, and social impact</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactMethodologyForm;