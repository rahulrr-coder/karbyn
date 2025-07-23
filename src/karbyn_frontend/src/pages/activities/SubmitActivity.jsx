import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useActivity } from '../../contexts/ActivityContext';
import EnhancedAIVerification from '../../components/verification/EnhancedAIVerification';
import biometricService from '../../services/biometricService';
import ActivityShare from '../../components/social/ActivityShare';
import ImpactCertificate from '../../components/social/ImpactCertificate';

const SubmitActivity = () => {
  const { submitActivity, activityTypes, loading } = useActivity();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Get user's biometric profile
  const userBiometric = user?.walletAddress ? biometricService.getBiometricProfile(user.walletAddress) : null;
  
  const [formData, setFormData] = useState({
    type: 'transport',
    subtype: '',
    description: '',
    distance: '',
    quantity: '',
    duration: '',
    location: '',
    proofType: '',
    proofFiles: [],
    liveTracking: false
  });

  const [proofPreview, setProofPreview] = useState([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [locationData, setLocationData] = useState(null);

  const [step, setStep] = useState(1);
  const [aiVerificationResult, setAiVerificationResult] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Some files were rejected. Please upload only images/videos under 10MB.');
    }

    setFormData(prev => ({
      ...prev,
      proofFiles: [...prev.proofFiles, ...validFiles]
    }));

    // Create preview URLs
    const newPreviews = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'video'
    }));
    setProofPreview(prev => [...prev, ...newPreviews]);
  };

  const removeProofFile = (index) => {
    setFormData(prev => ({
      ...prev,
      proofFiles: prev.proofFiles.filter((_, i) => i !== index)
    }));
    
    // Revoke URL to prevent memory leaks
    URL.revokeObjectURL(proofPreview[index].url);
    setProofPreview(prev => prev.filter((_, i) => i !== index));
  };

  const startLiveCapture = async () => {
    try {
      setIsCapturing(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      // Create video element for capture
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Capture photo after 3 seconds
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          const file = new File([blob], `live-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setFormData(prev => ({
            ...prev,
            proofFiles: [...prev.proofFiles, file]
          }));
          
          setProofPreview(prev => [...prev, {
            file,
            url: URL.createObjectURL(file),
            type: 'image'
          }]);
        }, 'image/jpeg', 0.8);
        
        // Stop camera
        stream.getTracks().forEach(track => track.stop());
        setIsCapturing(false);
      }, 3000);
      
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Camera access denied or not available');
      setIsCapturing(false);
    }
  };

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        setLocationData(locationData);
        setFormData(prev => ({ ...prev, liveTracking: true }));
      },
      (error) => {
        console.error('Location error:', error);
        alert('Location access denied or not available');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      alert('Please login to submit activities');
      return;
    }

    const result = await submitActivity({
      ...formData,
      distance: formData.distance ? parseFloat(formData.distance) : null,
      quantity: formData.quantity ? parseInt(formData.quantity) : null,
      duration: formData.duration ? parseFloat(formData.duration) : null,
      aiVerified: aiVerificationResult ? aiVerificationResult.success : false,
      aiVerificationData: aiVerificationResult
    });

    if (result.success) {
      setSubmissionResult({
        ...result.activity,
        aiVerified: aiVerificationResult ? aiVerificationResult.success : false
      });
      setStep(4);
    } else {
      alert('Failed to submit activity: ' + result.error);
    }
  };

  const currentActivityConfig = activityTypes[formData.type]?.[formData.subtype];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please login to submit activities</p>
          <Link
            to="/auth/login"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Submit Activity</h1>
              <p className="text-muted-foreground mt-1">
                Log your eco-friendly actions and earn Micro-Carbon NFTs
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step >= stepNum 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-16 h-1 ml-4 ${
                    step > stepNum ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-4">
            <div className="text-sm text-muted-foreground">
              {step === 1 && 'Select Activity Type'}
              {step === 2 && 'Activity Details'}
              {step === 3 && 'Proof Verification'}
              {step === 4 && 'Submission Complete'}
            </div>
          </div>
        </div>

        {step === 1 && (
          <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-6">Choose Activity Type</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(activityTypes).map(([typeKey, typeData]) => (
                <div key={typeKey} className="space-y-3">
                  <h3 className="font-medium text-foreground capitalize">{typeKey}</h3>
                  <div className="grid gap-2">
                    {Object.entries(typeData).map(([subtypeKey, subtypeData]) => (
                      <button
                        key={subtypeKey}
                        onClick={() => {
                          setFormData(prev => ({ ...prev, type: typeKey, subtype: subtypeKey }));
                          setStep(2);
                        }}
                        className="flex items-center p-4 border border-border rounded-lg hover:border-primary hover:bg-primary/5 organic-transition text-left"
                      >
                        <span className="text-2xl mr-3">{subtypeData.icon}</span>
                        <div>
                          <div className="font-medium text-foreground">{subtypeData.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {subtypeData.carbonPerKm && `${subtypeData.carbonPerKm} kg CO2/km`}
                            {subtypeData.carbonPerItem && `${subtypeData.carbonPerItem} kg CO2/item`}
                            {subtypeData.carbonPerHour && `${subtypeData.carbonPerHour} kg CO2/hour`}
                            {subtypeData.carbonSaved && `${subtypeData.carbonSaved} kg CO2 saved`}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Activity Details</h2>
              <button
                onClick={() => setStep(1)}
                className="text-muted-foreground hover:text-foreground organic-transition"
              >
                ← Change Activity
              </button>
            </div>

            {currentActivityConfig && (
              <div className="flex items-center mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <span className="text-3xl mr-4">{currentActivityConfig.icon}</span>
                <div>
                  <h3 className="font-medium text-foreground">{currentActivityConfig.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {currentActivityConfig.carbonPerKm && `${currentActivityConfig.carbonPerKm} kg CO2 saved per km`}
                    {currentActivityConfig.carbonPerItem && `${currentActivityConfig.carbonPerItem} kg CO2 saved per item`}
                    {currentActivityConfig.carbonPerHour && `${currentActivityConfig.carbonPerHour} kg CO2 saved per hour`}
                    {currentActivityConfig.carbonSaved && `${currentActivityConfig.carbonSaved} kg CO2 saved`}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary organic-transition"
                  placeholder="Describe your activity"
                  rows="3"
                />
              </div>

              {currentActivityConfig?.carbonPerKm && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Distance (km) *
                  </label>
                  <input
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleInputChange}
                    required
                    step="0.1"
                    min="0"
                    className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary organic-transition"
                    placeholder="Enter distance in km"
                  />
                </div>
              )}

              {currentActivityConfig?.carbonPerItem && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary organic-transition"
                    placeholder="Enter number of items"
                  />
                </div>
              )}

              {currentActivityConfig?.carbonPerHour && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Duration (hours) *
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                    step="0.1"
                    min="0"
                    className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary organic-transition"
                    placeholder="Enter duration in hours"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary organic-transition"
                  placeholder="Where did this activity take place?"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted organic-transition"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed organic-transition"
                >
                  Next: Add Proof
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3.5 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">AI Verification</h2>
              <button
                onClick={() => setStep(3)}
                className="text-muted-foreground hover:text-foreground organic-transition"
              >
                ← Back to Proof Submission
              </button>
            </div>
            
            <EnhancedAIVerification 
              userBiometric={userBiometric}
              onVerificationComplete={(result) => {
                // Save verification result to history
                if (user?.walletAddress) {
                  biometricService.saveVerificationResult(user.walletAddress, result);
                }
                setAiVerificationResult(result);
                setStep(3);
              }}
              activityType={formData.type}
              preferLiveVerification={true}
            />
          </div>
        )}

        {step === 3 && (
          <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Proof Verification</h2>
              <button
                onClick={() => setStep(2)}
                className="text-muted-foreground hover:text-foreground organic-transition"
              >
                ← Back to Details
              </button>
            </div>

            <div className="mb-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <h3 className="font-medium text-foreground mb-2">Why we need proof</h3>
              <p className="text-sm text-muted-foreground">
                To ensure the integrity of carbon credits, we need to verify your eco-friendly activities.
                Your proof will be reviewed by our AI system to validate your carbon offset claims.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Proof Type *
                </label>
                <select
                  name="proofType"
                  value={formData.proofType}
                  onChange={handleInputChange}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary organic-transition"
                  required
                >
                  <option value="">Select proof type</option>
                  <option value="photo">Photo Evidence</option>
                  <option value="screenshot">App Screenshot</option>
                  <option value="location">Location Tracking</option>
                  <option value="combined">Combined Proof</option>
                </select>
              </div>

              {(formData.proofType === 'photo' || formData.proofType === 'screenshot' || formData.proofType === 'combined') && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Upload Images/Videos
                  </label>
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-background hover:bg-muted organic-transition">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg className="w-8 h-8 mb-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mb-2 text-sm text-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, or MP4 (max 10MB)</p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*,video/*" 
                          multiple 
                          onChange={handleFileUpload} 
                        />
                      </label>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button
                        type="button"
                        onClick={startLiveCapture}
                        disabled={isCapturing}
                        className="flex items-center px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed organic-transition"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {isCapturing ? "Capturing..." : "Take Photo"}
                      </button>
                    </div>

                    {/* Preview uploaded files */}
                    {proofPreview.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-foreground mb-2">Uploaded Proof</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {proofPreview.map((item, index) => (
                            <div key={index} className="relative group">
                              {item.type === 'image' ? (
                                <img 
                                  src={item.url} 
                                  alt={`Proof ${index + 1}`} 
                                  className="w-full h-24 object-cover rounded-lg border border-border" 
                                />
                              ) : (
                                <video 
                                  src={item.url} 
                                  className="w-full h-24 object-cover rounded-lg border border-border" 
                                  controls 
                                />
                              )}
                              <button
                                type="button"
                                onClick={() => removeProofFile(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 organic-transition"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {(formData.proofType === 'location' || formData.proofType === 'combined') && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Location Verification
                  </label>
                  <div className="p-4 border border-border rounded-lg bg-background">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-foreground">
                          {locationData ? 'Location captured successfully' : 'Share your location to verify your activity'}
                        </p>
                        {locationData && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Coordinates: {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={startLocationTracking}
                        disabled={formData.liveTracking}
                        className={`px-4 py-2 rounded-lg organic-transition ${formData.liveTracking 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'}`}
                      >
                        {formData.liveTracking ? 'Location Shared' : 'Share Location'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6 p-4 bg-accent/5 rounded-lg border border-accent/10">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                    <svg className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  {aiVerificationResult ? (
                    <div className="ml-4 flex-grow">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-foreground">AI Verification Complete</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${aiVerificationResult.isMatch ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                          {aiVerificationResult.isMatch ? 'Identity Verified' : 'Identity Mismatch'}
                        </span>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Face Match:</span>
                          <span className="ml-1 font-medium">{aiVerificationResult.similarity?.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Confidence:</span>
                          <span className="ml-1 font-medium">{aiVerificationResult.confidence?.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Method:</span>
                          <span className="ml-1 font-medium">{aiVerificationResult.verificationType === 'live_video' ? 'Live Video' : 'Upload'}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expression:</span>
                          <span className="ml-1 font-medium capitalize">{aiVerificationResult.dominantExpression}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-foreground">Enhance verification with AI</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Complete an AI verification step to speed up approval and increase your trust score.
                      </p>
                    </div>
                  )}
                  <div className="ml-auto">
                    <button
                      type="button"
                      onClick={() => setStep(3.5)}
                      className={`px-4 py-2 ${aiVerificationResult ? 'bg-muted text-muted-foreground' : 'bg-accent text-accent-foreground hover:bg-accent/90'} rounded-lg text-sm organic-transition`}
                    >
                      {aiVerificationResult ? 'Redo Verification' : 'Start AI Verification'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted organic-transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.proofType || (formData.proofType !== 'location' && formData.proofFiles.length === 0)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed organic-transition"
                >
                  {loading ? 'Submitting...' : 'Submit Activity'}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 5 && submissionResult && (
          <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Your Impact Certificate</h2>
              <button
                onClick={() => setStep(4)}
                className="text-muted-foreground hover:text-foreground organic-transition"
              >
                ← Back
              </button>
            </div>
            
            <ImpactCertificate 
              carbonOffset={submissionResult.carbonOffset || 0}
              activityCount={1}
              badges={submissionResult.badges || []}
              timeframe="activity"
              showShare={true}
            />
            
            <div className="mt-6 flex justify-center">
              <Link
                to="/dashboard"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 organic-transition"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        )}
        
        {step === 4 && submissionResult && (
          <div className="bg-card rounded-lg organic-shadow-subtle p-6 border border-border">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Activity Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Your activity has been submitted for AI verification. You'll receive a Micro-Carbon NFT once verified.
              </p>

              <div className="bg-muted rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-foreground mb-4">Activity Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Activity:</span>
                    <span className="font-medium text-foreground">{currentActivityConfig?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbon Offset:</span>
                    <span className="font-medium text-primary">{submissionResult.carbonOffset} kg CO2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="text-accent">Pending Verification</span>
                  </div>
                  {formData.proofFiles.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proof Submitted:</span>
                      <span className="font-medium text-foreground">{formData.proofFiles.length} file(s)</span>
                    </div>
                  )}
                  {formData.liveTracking && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location Verified:</span>
                      <span className="font-medium text-foreground">Yes</span>
                    </div>
                  )}
                  
                  {/* AI Verification Status */}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">AI Verification:</span>
                    {submissionResult.aiVerified ? (
                      <span className="font-medium text-primary">Verified</span>
                    ) : (
                      <span className="font-medium text-muted-foreground">Not Completed</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Sharing */}
              <div className="mt-6 mb-6">
                <ActivityShare activity={submissionResult} expanded={true} />
              </div>
              
              {/* Generate Certificate Button */}
              <div className="mb-6">
                <button
                  onClick={() => setStep(5)} // Show certificate in step 5
                  className="w-full py-3 px-4 bg-accent text-accent-foreground text-center rounded-lg hover:bg-accent/90 organic-transition flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Generate Impact Certificate
                </button>
              </div>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      type: 'transport',
                      subtype: '',
                      description: '',
                      distance: '',
                      quantity: '',
                      duration: '',
                      location: '',
                      proofType: '',
                      proofFiles: [],
                      liveTracking: false
                    });
                    setProofPreview([]);
                    setLocationData(null);
                    setSubmissionResult(null);
                  }}
                  className="px-6 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted organic-transition"
                >
                  Submit Another Activity
                </button>
              </div>
              
              <div className="mt-6 flex justify-between">
                <Link
                  to="/activities/history"
                  className="px-6 py-2 border border-border rounded-lg text-muted-foreground hover:bg-muted organic-transition"
                >
                  View History
                </Link>
                <Link
                  to="/dashboard"
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 organic-transition"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmitActivity;
