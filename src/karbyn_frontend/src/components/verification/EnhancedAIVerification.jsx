import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, Upload, CheckCircle, AlertCircle, RefreshCw, Shield, Video } from 'lucide-react';

const EnhancedAIVerification = ({ 
  userBiometric, 
  onVerificationComplete, 
  activityType = 'general',
  preferLiveVerification = true 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [verificationMode, setVerificationMode] = useState('live'); // live, upload
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('setup'); // setup, verifying, completed
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('Loading face-api.js models for enhanced verification...');
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.load('/models/tiny_face_detector_model-weights_manifest.json'),
          faceapi.nets.faceLandmark68Net.load('/models/face_landmark_68_model-weights_manifest.json'),
          faceapi.nets.faceRecognitionNet.load('/models/face_recognition_model-weights_manifest.json'),
          faceapi.nets.faceExpressionNet.load('/models/face_expression_model-weights_manifest.json')
        ]);
        
        console.log('All enhanced verification models loaded successfully');
        setModelsLoaded(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading face-api.js models:', error);
        setError('Failed to load face recognition models. Please refresh and try again.');
        setIsLoading(false);
      }
    };

    loadModels();
  }, []);

  // Calculate cosine similarity between two face descriptors
  const calculateSimilarity = (descriptor1, descriptor2) => {
    if (!descriptor1 || !descriptor2) return 0;
    
    const desc1 = Array.isArray(descriptor1) ? descriptor1 : Array.from(descriptor1);
    const desc2 = Array.isArray(descriptor2) ? descriptor2 : Array.from(descriptor2);
    
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < desc1.length; i++) {
      dotProduct += desc1[i] * desc2[i];
      norm1 += desc1[i] * desc1[i];
      norm2 += desc2[i] * desc2[i];
    }
    
    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    return Math.max(0, Math.min(1, similarity)); // Clamp between 0 and 1
  };

  // Start live video verification
  const startLiveVerification = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640, 
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setStep('verifying');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Unable to access camera. Please try uploading a photo instead.');
      setVerificationMode('upload');
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Perform live face verification
  const performLiveVerification = async () => {
    if (!videoRef.current || !modelsLoaded || !userBiometric) return;

    setIsVerifying(true);
    setError(null);

    try {
      // Detect face and extract descriptor
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
      )
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withFaceExpressions();

      if (detections.length === 0) {
        throw new Error('No face detected. Please ensure your face is clearly visible.');
      }

      if (detections.length > 1) {
        throw new Error('Multiple faces detected. Please ensure only your face is visible.');
      }

      const currentDescriptor = detections[0].descriptor;
      const registeredDescriptor = userBiometric.faceDescriptor;
      
      // Calculate similarity
      const similarity = calculateSimilarity(currentDescriptor, registeredDescriptor);
      const isMatch = similarity > 0.6; // Threshold for face match
      
      // Analyze expressions for liveness
      const expressions = detections[0].expressions;
      const dominantExpression = Object.keys(expressions).reduce((a, b) => 
        expressions[a] > expressions[b] ? a : b
      );
      
      const verificationData = {
        isMatch,
        similarity: similarity * 100,
        confidence: detections[0].detection.score * 100,
        dominantExpression,
        expressions,
        timestamp: new Date().toISOString(),
        verificationType: 'live_video',
        activityType
      };

      setVerificationResult(verificationData);
      setStep('completed');
      
      // Draw detection on canvas for visual feedback
      if (canvasRef.current) {
        const displaySize = { 
          width: videoRef.current.videoWidth, 
          height: videoRef.current.videoHeight 
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        // Draw with color based on match result
        ctx.strokeStyle = isMatch ? '#10B981' : '#EF4444';
        ctx.lineWidth = 3;
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      }

      stopCamera();

    } catch (error) {
      console.error('Error during live verification:', error);
      setError(error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle file upload verification
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !modelsLoaded || !userBiometric) return;

    setIsVerifying(true);
    setError(null);

    try {
      // Create image element
      const img = new Image();
      img.onload = async () => {
        try {
          // Detect face and extract descriptor
          const detections = await faceapi.detectAllFaces(
            img,
            new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
          )
          .withFaceLandmarks()
          .withFaceDescriptors()
          .withFaceExpressions();

          if (detections.length === 0) {
            throw new Error('No face detected in the uploaded image. Please upload a clear photo with your face visible.');
          }

          if (detections.length > 1) {
            throw new Error('Multiple faces detected. Please upload a photo with only your face visible.');
          }

          const uploadedDescriptor = detections[0].descriptor;
          const registeredDescriptor = userBiometric.faceDescriptor;
          
          // Calculate similarity
          const similarity = calculateSimilarity(uploadedDescriptor, registeredDescriptor);
          const isMatch = similarity > 0.6; // Threshold for face match
          
          // Analyze expressions
          const expressions = detections[0].expressions;
          const dominantExpression = Object.keys(expressions).reduce((a, b) => 
            expressions[a] > expressions[b] ? a : b
          );
          
          // Basic image analysis (placeholder for future uniqueness detection)
          const imageAnalysis = {
            dimensions: { width: img.width, height: img.height },
            fileSize: file.size,
            fileType: file.type,
            lastModified: file.lastModified
          };
          
          const verificationData = {
            isMatch,
            similarity: similarity * 100,
            confidence: detections[0].detection.score * 100,
            dominantExpression,
            expressions,
            imageAnalysis,
            timestamp: new Date().toISOString(),
            verificationType: 'uploaded_image',
            activityType
          };

          setVerificationResult(verificationData);
          setStep('completed');

        } catch (error) {
          console.error('Error analyzing uploaded image:', error);
          setError(error.message);
        } finally {
          setIsVerifying(false);
        }
      };

      img.onerror = () => {
        setError('Failed to load the uploaded image. Please try a different file.');
        setIsVerifying(false);
      };

      img.src = URL.createObjectURL(file);

    } catch (error) {
      console.error('Error handling file upload:', error);
      setError('Failed to process the uploaded file.');
      setIsVerifying(false);
    }
  };

  // Complete verification
  const completeVerification = () => {
    if (verificationResult && onVerificationComplete) {
      onVerificationComplete(verificationResult);
    }
  };

  // Retry verification
  const retryVerification = () => {
    setVerificationResult(null);
    setError(null);
    setStep('setup');
    stopCamera();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg">
        <RefreshCw className="h-8 w-8 text-green-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading enhanced verification system...</p>
      </div>
    );
  }

  if (error && !modelsLoaded) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg">
        <AlertCircle className="h-8 w-8 text-red-500 mb-4" />
        <p className="text-red-600 text-center mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  if (!userBiometric) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg">
        <Shield className="h-8 w-8 text-yellow-500 mb-4" />
        <p className="text-gray-600 text-center mb-4">
          No biometric profile found. Please complete biometric registration first.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Enhanced AI Verification</h2>
        <p className="text-gray-600">
          Verify your identity using facial recognition to ensure authentic activity submissions.
        </p>
      </div>

      {step === 'setup' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Choose Verification Method:</h3>
            <p className="text-sm text-blue-700 mb-4">
              Live video verification is recommended for the highest security and authenticity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => {
                setVerificationMode('live');
                startLiveVerification();
              }}
              className="p-6 border-2 border-green-200 rounded-lg hover:border-green-400 transition-colors text-center group"
            >
              <Video className="h-8 w-8 text-green-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-800 mb-2">Live Video Verification</h3>
              <p className="text-sm text-gray-600">Real-time face verification using your camera</p>
              <div className="mt-2 text-xs text-green-600 font-medium">Recommended</div>
            </button>

            <button
              onClick={() => {
                setVerificationMode('upload');
                fileInputRef.current?.click();
              }}
              className="p-6 border-2 border-gray-200 rounded-lg hover:border-gray-400 transition-colors text-center group"
            >
              <Upload className="h-8 w-8 text-gray-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-gray-800 mb-2">Upload Photo</h3>
              <p className="text-sm text-gray-600">Upload a clear photo for verification</p>
              <div className="mt-2 text-xs text-gray-500">Fallback option</div>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {step === 'verifying' && verificationMode === 'live' && (
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              muted
              className="w-full rounded-lg"
              onLoadedMetadata={() => {
                if (videoRef.current && canvasRef.current) {
                  canvasRef.current.width = videoRef.current.videoWidth;
                  canvasRef.current.height = videoRef.current.videoHeight;
                }
              }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <div className="text-center">
            <button
              onClick={performLiveVerification}
              disabled={isVerifying}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center mx-auto"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Verify Identity
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {isVerifying && verificationMode === 'upload' && (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Analyzing uploaded image...</p>
        </div>
      )}

      {step === 'completed' && verificationResult && (
        <div className="space-y-6">
          <div className="text-center">
            {verificationResult.isMatch ? (
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            ) : (
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            )}
            
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {verificationResult.isMatch ? 'Identity Verified!' : 'Verification Failed'}
            </h3>
            
            <p className="text-gray-600 mb-4">
              {verificationResult.isMatch 
                ? 'Your identity has been successfully verified using facial recognition.'
                : 'The face in the verification does not match your registered biometric profile.'
              }
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-800 mb-3">Verification Details:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Match Similarity:</span>
                <span className={`ml-2 font-medium ${verificationResult.isMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {verificationResult.similarity.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-600">Detection Confidence:</span>
                <span className="ml-2 font-medium text-blue-600">
                  {verificationResult.confidence.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-gray-600">Verification Type:</span>
                <span className="ml-2 font-medium text-gray-800">
                  {verificationResult.verificationType === 'live_video' ? 'Live Video' : 'Uploaded Image'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Expression:</span>
                <span className="ml-2 font-medium text-gray-800 capitalize">
                  {verificationResult.dominantExpression}
                </span>
              </div>
            </div>
          </div>

          <div className="flex space-x-4 justify-center">
            <button
              onClick={retryVerification}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={completeVerification}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              {verificationResult.isMatch ? 'Continue' : 'Proceed Anyway'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedAIVerification;
