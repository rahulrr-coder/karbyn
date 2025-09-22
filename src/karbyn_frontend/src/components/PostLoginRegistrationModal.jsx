import React, { useState } from 'react';

const PostLoginRegistrationModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    location: '',
    organizationType: 'NGO',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg border max-w-md w-full p-6" style={{ 
        borderColor: '#EAEAEA',
        boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 className="text-xl font-bold mb-6" style={{ color: '#1E392A' }}>Register as NGO or Community</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:outline-none"
              style={{ 
                borderColor: '#EAEAEA',
                backgroundColor: '#FFFFFF'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1E392A'}
              onBlur={(e) => e.target.style.borderColor = '#EAEAEA'}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:outline-none"
              style={{ 
                borderColor: '#EAEAEA',
                backgroundColor: '#FFFFFF'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1E392A'}
              onBlur={(e) => e.target.style.borderColor = '#EAEAEA'}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:outline-none"
              style={{ 
                borderColor: '#EAEAEA',
                backgroundColor: '#FFFFFF'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1E392A'}
              onBlur={(e) => e.target.style.borderColor = '#EAEAEA'}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Organization Type</label>
            <select
              name="organizationType"
              value={formData.organizationType}
              onChange={handleInputChange}
              className="w-full p-3 border rounded-md focus:outline-none"
              style={{ 
                borderColor: '#EAEAEA',
                backgroundColor: '#FFFFFF'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1E392A'}
              onBlur={(e) => e.target.style.borderColor = '#EAEAEA'}
            >
              <option value="NGO">NGO</option>
              <option value="Tree Planting Community">Tree Planting Community</option>
              <option value="Individual Contributor">Individual Contributor</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md font-medium transition-colors"
              style={{ 
                borderColor: '#1E392A',
                backgroundColor: 'transparent',
                color: '#1E392A'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#F8F8F4'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white rounded-md font-medium transition-all duration-200"
              style={{ 
                backgroundColor: '#1E392A',
                borderRadius: '6px'
              }}
              onMouseOver={(e) => e.target.style.opacity = '0.9'}
              onMouseOut={(e) => e.target.style.opacity = '1'}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostLoginRegistrationModal;
