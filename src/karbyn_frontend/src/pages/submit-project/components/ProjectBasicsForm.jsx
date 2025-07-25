import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

const ProjectBasicsForm = ({ formData, updateFormData, errors }) => {
  const projectTypes = [
    { value: 'reforestation', label: 'Reforestation & Afforestation' },
    { value: 'renewable-energy', label: 'Renewable Energy' },
    { value: 'soil-carbon', label: 'Soil Carbon Sequestration' },
    { value: 'wetland-restoration', label: 'Wetland Restoration' },
    { value: 'biogas', label: 'Biogas & Methane Capture' },
    { value: 'energy-efficiency', label: 'Energy Efficiency' },
    { value: 'sustainable-agriculture', label: 'Sustainable Agriculture' },
    { value: 'ocean-conservation', label: 'Ocean & Marine Conservation' }
  ];

  const regions = [
    { value: 'north-america', label: 'North America' },
    { value: 'south-america', label: 'South America' },
    { value: 'europe', label: 'Europe' },
    { value: 'africa', label: 'Africa' },
    { value: 'asia', label: 'Asia' },
    { value: 'oceania', label: 'Oceania' },
    { value: 'antarctica', label: 'Antarctica' }
  ];

  const handleInputChange = (field, value) => {
    updateFormData('basics', { ...formData.basics, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
          <Icon name="FileText" size={16} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Project Basics</h2>
          <p className="text-sm text-muted-foreground">Tell us about your carbon offset project</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <Input
            label="Project Name"
            type="text"
            placeholder="e.g., Amazon Rainforest Conservation Initiative"
            value={formData.basics.name || ''}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={errors.name}
            required
            description="Choose a clear, descriptive name for your project"
          />
        </div>

        <Select
          label="Project Type"
          placeholder="Select project category"
          options={projectTypes}
          value={formData.basics.type || ''}
          onChange={(value) => handleInputChange('type', value)}
          error={errors.type}
          required
          description="Choose the primary focus of your carbon offset project"
        />

        <Select
          label="Region"
          placeholder="Select geographic region"
          options={regions}
          value={formData.basics.region || ''}
          onChange={(value) => handleInputChange('region', value)}
          error={errors.region}
          required
          description="Primary geographic location of your project"
        />

        <Input
          label="Specific Location"
          type="text"
          placeholder="e.g., Acre State, Brazil"
          value={formData.basics.location || ''}
          onChange={(e) => handleInputChange('location', e.target.value)}
          error={errors.location}
          required
          description="City, state/province, or specific area"
        />

        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-foreground mb-2">
            Project Description <span className="text-error">*</span>
          </label>
          <textarea
            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
            rows={4}
            placeholder="Describe your project's goals, methodology, and expected environmental impact. Include details about community involvement, timeline, and unique aspects of your approach."
            value={formData.basics.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-error">{errors.description}</p>
          )}
          <p className="mt-1 text-xs text-muted-foreground">
            Minimum 50 characters. Be specific about your project's environmental and social impact.
          </p>
        </div>

        <Input
          label="Estimated Carbon Impact (tCO2e/year)"
          type="number"
          placeholder="e.g., 25000"
          value={formData.basics.carbonImpact || ''}
          onChange={(e) => handleInputChange('carbonImpact', e.target.value)}
          error={errors.carbonImpact}
          required
          description="Annual carbon dioxide equivalent reduction/sequestration"
        />
        
        {/* Coordinates are now handled by the LocationSelector component */}
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-1">Project Guidelines</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Ensure your project follows recognized carbon offset standards (VCS, Gold Standard, etc.)</li>
              <li>• Projects must demonstrate additionality - they wouldn't happen without carbon finance</li>
              <li>• Community engagement and social co-benefits are highly valued</li>
              <li>• Accurate baseline data and monitoring plans are essential for verification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBasicsForm;