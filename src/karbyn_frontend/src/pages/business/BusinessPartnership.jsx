import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/SimpleAuthContext';
import Icon from '../../components/AppIcon';

const BusinessPartnership = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    website: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    description: '',
    sustainabilityGoals: '',
    partnershipType: 'offset',
    additionalInfo: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sample partner businesses
  const partnerBusinesses = [
    {
      id: 1,
      name: 'EcoTech Solutions',
      logo: '🏢',
      industry: 'Technology',
      description: 'Providing sustainable technology solutions for businesses worldwide.',
      verified: true,
      partnershipType: 'Offset Provider',
      impactMetric: '12,450 kg CO₂ offset'
    },
    {
      id: 2,
      name: 'Green Transport Co.',
      logo: '🚌',
      industry: 'Transportation',
      description: 'Electric vehicle fleet offering sustainable transportation options.',
      verified: true,
      partnershipType: 'Service Provider',
      impactMetric: '8,320 kg CO₂ offset'
    },
    {
      id: 3,
      name: 'Sustainable Apparel',
      logo: '👕',
      industry: 'Fashion',
      description: 'Eco-friendly clothing made from recycled materials and sustainable practices.',
      verified: true,
      partnershipType: 'Product Partner',
      impactMetric: '5,780 kg CO₂ offset'
    },
    {
      id: 4,
      name: 'Clean Energy Partners',
      logo: '⚡',
      industry: 'Energy',
      description: 'Renewable energy solutions for residential and commercial applications.',
      verified: false,
      partnershipType: 'Offset Provider',
      impactMetric: 'Verification in progress'
    }
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    const requiredFields = ['businessName', 'industry', 'contactName', 'contactEmail', 'description'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitSuccess(true);
        
        // Reset form after successful submission
        setTimeout(() => {
          setFormData({
            businessName: '',
            industry: '',
            website: '',
            contactName: '',
            contactEmail: '',
            contactPhone: '',
            description: '',
            sustainabilityGoals: '',
            partnershipType: 'offset',
            additionalInfo: ''
          });
          setSubmitSuccess(false);
          setActiveTab('overview');
        }, 3000);
      }, 1500);
    }
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-card rounded-lg organic-shadow-subtle border border-border p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Business Partnership Program</h3>
              <p className="text-muted-foreground mb-4">
                Join our network of eco-conscious businesses committed to reducing carbon footprints and promoting sustainability. 
                Partner with Karbyn to offset your business's carbon emissions, showcase your commitment to sustainability, 
                and connect with environmentally conscious consumers.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    <Icon name="BadgeCheck" size={24} />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Verified Status</h4>
                  <p className="text-sm text-muted-foreground">
                    Gain a verified business status on our platform, building trust with environmentally conscious consumers.
                  </p>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    <Icon name="Leaf" size={24} />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Carbon Offsetting</h4>
                  <p className="text-sm text-muted-foreground">
                    Access our carbon credit marketplace to offset your business operations and achieve sustainability goals.
                  </p>
                </div>
                
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    <Icon name="Users" size={24} />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Community Access</h4>
                  <p className="text-sm text-muted-foreground">
                    Connect with our community of eco-conscious individuals and businesses for collaboration opportunities.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={() => setActiveTab('apply')}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 organic-transition"
                >
                  Apply for Partnership
                </button>
              </div>
            </div>
            
            <div className="bg-card rounded-lg organic-shadow-subtle border border-border p-6">
              <h3 className="text-xl font-semibold text-foreground mb-4">Partner Businesses</h3>
              <p className="text-muted-foreground mb-6">
                Meet our network of verified business partners committed to sustainability and carbon reduction.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {partnerBusinesses.map(business => (
                  <div 
                    key={business.id}
                    className="bg-muted/30 rounded-lg p-4 border border-border flex items-start"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-2xl mr-4">
                      {business.logo}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h4 className="font-medium text-foreground">{business.name}</h4>
                        {business.verified && (
                          <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Verified</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{business.industry} • {business.partnershipType}</p>
                      <p className="text-sm text-muted-foreground mt-2">{business.description}</p>
                      <div className="mt-2 text-xs font-medium text-primary">
                        {business.impactMetric}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  to="/business/directory"
                  className="text-sm text-accent hover:text-accent/80 organic-transition flex items-center justify-center"
                >
                  View all partners
                  <Icon name="ChevronRight" size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          </div>
        );
      
      case 'apply':
        return (
          <div className="bg-card rounded-lg organic-shadow-subtle border border-border p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Business Partnership Application</h3>
            <p className="text-muted-foreground mb-6">
              Complete the form below to apply for a business partnership with Karbyn. Our team will review your application 
              and contact you within 2-3 business days.
            </p>
            
            {submitSuccess ? (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Check" size={32} className="text-primary" />
                </div>
                <h4 className="text-lg font-medium text-foreground mb-2">Application Submitted!</h4>
                <p className="text-muted-foreground">
                  Thank you for your interest in partnering with Karbyn. Our team will review your application 
                  and contact you within 2-3 business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Business Information */}
                  <div>
                    <h4 className="font-medium text-foreground mb-4">Business Information</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Business Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 bg-muted/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                            formErrors.businessName ? 'border-red-500' : 'border-border'
                          }`}
                        />
                        {formErrors.businessName && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.businessName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Industry <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 bg-muted/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                            formErrors.industry ? 'border-red-500' : 'border-border'
                          }`}
                        >
                          <option value="">Select Industry</option>
                          <option value="Technology">Technology</option>
                          <option value="Energy">Energy</option>
                          <option value="Transportation">Transportation</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Retail">Retail</option>
                          <option value="Fashion">Fashion</option>
                          <option value="Food & Beverage">Food & Beverage</option>
                          <option value="Finance">Finance</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education">Education</option>
                          <option value="Other">Other</option>
                        </select>
                        {formErrors.industry && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.industry}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Website
                        </label>
                        <input
                          type="text"
                          name="website"
                          value={formData.website}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                          placeholder="https://"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Contact Information */}
                  <div>
                    <h4 className="font-medium text-foreground mb-4">Contact Information</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Contact Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="contactName"
                          value={formData.contactName}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 bg-muted/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                            formErrors.contactName ? 'border-red-500' : 'border-border'
                          }`}
                        />
                        {formErrors.contactName && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.contactName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="contactEmail"
                          value={formData.contactEmail}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 bg-muted/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                            formErrors.contactEmail ? 'border-red-500' : 'border-border'
                          }`}
                        />
                        {formErrors.contactEmail && (
                          <p className="mt-1 text-xs text-red-500">{formErrors.contactEmail}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Phone
                        </label>
                        <input
                          type="text"
                          name="contactPhone"
                          value={formData.contactPhone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Partnership Details */}
                <div>
                  <h4 className="font-medium text-foreground mb-4">Partnership Details</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Business Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className={`w-full px-4 py-2 bg-muted/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                          formErrors.description ? 'border-red-500' : 'border-border'
                        }`}
                        placeholder="Tell us about your business and its focus areas"
                      ></textarea>
                      {formErrors.description && (
                        <p className="mt-1 text-xs text-red-500">{formErrors.description}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Sustainability Goals
                      </label>
                      <textarea
                        name="sustainabilityGoals"
                        value={formData.sustainabilityGoals}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Describe your current sustainability initiatives and future goals"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Partnership Type
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
                        <label className="flex items-center p-3 bg-muted/30 border border-border rounded-lg cursor-pointer">
                          <input
                            type="radio"
                            name="partnershipType"
                            value="offset"
                            checked={formData.partnershipType === 'offset'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <div>
                            <div className="text-sm font-medium text-foreground">Carbon Offset</div>
                            <div className="text-xs text-muted-foreground">Purchase carbon credits</div>
                          </div>
                        </label>
                        
                        <label className="flex items-center p-3 bg-muted/30 border border-border rounded-lg cursor-pointer">
                          <input
                            type="radio"
                            name="partnershipType"
                            value="service"
                            checked={formData.partnershipType === 'service'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <div>
                            <div className="text-sm font-medium text-foreground">Service Provider</div>
                            <div className="text-xs text-muted-foreground">Offer eco-services</div>
                          </div>
                        </label>
                        
                        <label className="flex items-center p-3 bg-muted/30 border border-border rounded-lg cursor-pointer">
                          <input
                            type="radio"
                            name="partnershipType"
                            value="product"
                            checked={formData.partnershipType === 'product'}
                            onChange={handleChange}
                            className="mr-2"
                          />
                          <div>
                            <div className="text-sm font-medium text-foreground">Product Partner</div>
                            <div className="text-xs text-muted-foreground">Sustainable products</div>
                          </div>
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        Additional Information
                      </label>
                      <textarea
                        name="additionalInfo"
                        value={formData.additionalInfo}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-2 bg-muted/50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Any other information you'd like to share"
                      ></textarea>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-border">
                  <button
                    type="button"
                    onClick={() => setActiveTab('overview')}
                    className="px-6 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted organic-transition"
                  >
                    Back
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed organic-transition flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        );
      
      case 'verification':
        return (
          <div className="bg-card rounded-lg organic-shadow-subtle border border-border p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">Business Verification Process</h3>
            <p className="text-muted-foreground mb-6">
              Learn about our business verification process to ensure transparency and trust in our partnership program.
            </p>
            
            <div className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-6 border border-border">
                <h4 className="flex items-center text-lg font-medium text-foreground mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">1</div>
                  Application Review
                </h4>
                <p className="text-muted-foreground ml-11">
                  Our team reviews your business partnership application to ensure alignment with our sustainability values and goals.
                  This typically takes 2-3 business days.
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-6 border border-border">
                <h4 className="flex items-center text-lg font-medium text-foreground mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">2</div>
                  Documentation Submission
                </h4>
                <p className="text-muted-foreground ml-11">
                  After initial approval, we'll request supporting documentation such as business registration, sustainability policies,
                  and any relevant certifications.
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-6 border border-border">
                <h4 className="flex items-center text-lg font-medium text-foreground mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">3</div>
                  Sustainability Assessment
                </h4>
                <p className="text-muted-foreground ml-11">
                  Our sustainability experts will assess your current practices and carbon footprint to establish a baseline
                  and identify opportunities for improvement.
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-6 border border-border">
                <h4 className="flex items-center text-lg font-medium text-foreground mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">4</div>
                  Partnership Agreement
                </h4>
                <p className="text-muted-foreground ml-11">
                  Upon successful verification, we'll finalize a partnership agreement outlining mutual commitments,
                  carbon offset targets, and collaboration opportunities.
                </p>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-6 border border-border">
                <h4 className="flex items-center text-lg font-medium text-foreground mb-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-3">5</div>
                  Verified Partner Status
                </h4>
                <p className="text-muted-foreground ml-11">
                  Your business receives verified partner status on our platform, including a profile page, verification badge,
                  and access to our carbon marketplace.
                </p>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <button 
                onClick={() => setActiveTab('apply')}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 organic-transition"
              >
                Apply for Verification
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Business Partnerships</h1>
              <p className="text-muted-foreground mt-1">
                Join our network of eco-conscious businesses
              </p>
            </div>
            <Link
              to="/dashboard"
              className="text-muted-foreground hover:text-foreground organic-transition"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'overview'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            } organic-transition`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'apply'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            } organic-transition`}
          >
            Apply
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'verification'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            } organic-transition`}
          >
            Verification Process
          </button>
        </div>
        
        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default BusinessPartnership;
