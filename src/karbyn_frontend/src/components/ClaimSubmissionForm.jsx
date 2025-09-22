import React, { useState } from 'react';

const ClaimSubmissionForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    species: '',
    quantity: '',
    location: '',
    image: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-lg border p-6" style={{ borderColor: '#EAEAEA' }}>
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E392A' }}>Submit Claim</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Tree Species</label>
          <input
            type="text"
            name="species"
            value={formData.species}
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
          <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
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
          <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>Image Upload</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="w-full p-3 border rounded-md focus:outline-none"
            style={{ 
              borderColor: '#1E392A',
              backgroundColor: 'transparent',
              color: '#1E392A'
            }}
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="text-white font-medium px-6 py-3 transition-all duration-200"
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
  );
};

export default ClaimSubmissionForm;
