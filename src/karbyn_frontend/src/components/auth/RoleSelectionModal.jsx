import React, { useState, useEffect } from 'react';
import { useSimpleNFIDAuth } from '../../contexts/SimpleNFIDAuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const RoleSelectionModal = ({ isOpen, onClose, onRoleSelected }) => {
  const { user, updateProfile, USER_ROLES } = useSimpleNFIDAuth();
  const [selectedRole, setSelectedRole] = useState(null);
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const roleOptions = [
    {
      id: USER_ROLES.INDIVIDUAL,
      name: 'Individual',
      icon: '👤',
      description: 'Track your personal eco-friendly activities and earn carbon credits',
      features: [
        'Track daily eco-activities',
        'Earn carbon credit NFTs',
        'Trade in marketplace',
        'View impact dashboard'
      ],
      color: 'blue'
    },
    {
      id: USER_ROLES.NGO,
      name: 'NGO',
      icon: '🌱',
      description: 'Large-scale environmental projects and community initiatives',
      features: [
        'List environmental projects',
        'Bulk carbon credit generation',
        'Community verification',
        'Impact reporting tools'
      ],
      color: 'green'
    },
    {
      id: USER_ROLES.CORPORATE,
      name: 'Corporate',
      icon: '🏢',
      description: 'Purchase verified carbon credits for corporate sustainability',
      features: [
        'Purchase carbon credits',
        'Sustainability reporting',
        'Corporate dashboard',
        'Compliance tracking'
      ],
      color: 'purple'
    }
  ];

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
    setStep(2);
  };

  const handleAdditionalInfoSubmit = async () => {
    if (!selectedRole) return;

    setIsSubmitting(true);
    try {
      const profileData = {
        name: additionalInfo.organizationName || additionalInfo.fullName || user.name,
        email: additionalInfo.email || user.email,
        role: { [selectedRole]: null },
        ...additionalInfo
      };

      await updateProfile(profileData);
      
      if (onRoleSelected) {
        onRoleSelected(selectedRole, additionalInfo);
      }

      onClose();
    } catch (error) {
      console.error('Failed to update role:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRoleSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Role</h2>
        <p className="text-gray-600">Help us customize your Karbyn experience</p>
      </div>

      <div className="grid gap-4">
        {roleOptions.map((role) => (
          <motion.button
            key={role.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRoleSelection(role.id)}
            className="p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-all text-left"
          >
            <div className="flex items-start space-x-4">
              <div className="text-3xl">{role.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{role.name}</h3>
                <p className="text-gray-600 mb-4">{role.description}</p>
                <div className="space-y-1">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm text-gray-500">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );

  const renderAdditionalInfo = () => {
    const selectedRoleData = roleOptions.find(r => r.id === selectedRole);
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-3xl mb-4">{selectedRoleData?.icon}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome, {selectedRoleData?.name}!
          </h2>
          <p className="text-gray-600">Tell us a bit more about yourself</p>
        </div>

        <div className="space-y-4">
          {selectedRole === USER_ROLES.INDIVIDUAL && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={additionalInfo.fullName || ''}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={additionalInfo.email || ''}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Interest (Optional)
                </label>
                <select
                  value={additionalInfo.interest || ''}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, interest: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select an area of interest</option>
                  <option value="recycling">Recycling & Waste Reduction</option>
                  <option value="transport">Sustainable Transport</option>
                  <option value="energy">Renewable Energy</option>
                  <option value="agriculture">Sustainable Agriculture</option>
                  <option value="conservation">Environmental Conservation</option>
                </select>
              </div>
            </>
          )}

          {selectedRole === USER_ROLES.NGO && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
                </label>
                <input
                  type="text"
                  value={additionalInfo.organizationName || ''}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, organizationName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your organization name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={additionalInfo.email || ''}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="organization@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Focus Area
                </label>
                <select
                  value={additionalInfo.focusArea || ''}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, focusArea: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select focus area</option>
                  <option value="reforestation">Reforestation & Afforestation</option>
                  <option value="conservation">Wildlife Conservation</option>
                  <option value="renewable-energy">Renewable Energy Projects</option>
                  <option value="waste-management">Waste Management</option>
                  <option value="water-conservation">Water Conservation</option>
                  <option value="community-education">Community Education</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number (Optional)
                </label>
                <input
                  type="text"
                  value={additionalInfo.registrationNumber || ''}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, registrationNumber: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="NGO registration number"
                />
              </div>
            </>
          )}

          {selectedRole === USER_ROLES.CORPORATE && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={additionalInfo.companyName || ''}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your company name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Email
                </label>
                <input
                  type="email"
                  value={additionalInfo.email || ''}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="business@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Industry
                </label>
                <select
                  value={additionalInfo.industry || ''}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, industry: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select industry</option>
                  <option value="technology">Technology</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="finance">Finance & Banking</option>
                  <option value="retail">Retail & E-commerce</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="logistics">Logistics & Transportation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Size
                </label>
                <select
                  value={additionalInfo.companySize || ''}
                  onChange={(e) => setAdditionalInfo(prev => ({ ...prev, companySize: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select company size</option>
                  <option value="startup">Startup (1-10 employees)</option>
                  <option value="small">Small (11-50 employees)</option>
                  <option value="medium">Medium (51-250 employees)</option>
                  <option value="large">Large (251-1000 employees)</option>
                  <option value="enterprise">Enterprise (1000+ employees)</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="flex space-x-4 pt-6">
          <button
            onClick={() => setStep(1)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleAdditionalInfoSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Setting up...</span>
              </div>
            ) : (
              'Complete Setup'
            )}
          </button>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-8">
            {step === 1 ? renderRoleSelection() : renderAdditionalInfo()}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RoleSelectionModal;
