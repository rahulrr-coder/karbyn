import React, { useState, useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import { Camera, CheckCircle, AlertCircle, RefreshCw, User } from 'lucide-react';

const BiometricRegistration = ({ onBiometricCaptured, walletAddress }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedDescriptor, setCapturedDescriptor] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState('setup'); // setup, capturing, captured, verified
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log('Loading face-api.js models for biometric registration...');
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.load('/models/tiny_face_detector_model-weights_manifest.json'),
          faceapi.nets.faceLandmark68Net.load('/models/face_landmark_68_model-weights_manifest.json'),
          faceapi.nets.faceRecognitionNet.load('/models/face_recognition_model-weights_manifest.json'),
          faceapi.nets.faceExpressionNet.load('/models/face_expression_model-weights_manifest.json')
        ]);
        
        console.log('All biometric registration models loaded successfully');
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

  // Start camera stream
  const startCamera = async () => {
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
        setStep('capturing');
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setError('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Capture face biometric
  const captureBiometric = async () => {
    if (!videoRef.current || !modelsLoaded) return;

    setIsCapturing(true);
    setError(null);

    try {
      // Detect face and extract descriptor
      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions({ scoreThreshold: 0.5 })
      )
      .withFaceLandmarks()
      .withFaceDescriptors();

      if (detections.length === 0) {
        throw new Error('No face detected. Please ensure your face is clearly visible and try again.');
      }

      if (detections.length > 1) {
        throw new Error('Multiple faces detected. Please ensure only your face is visible.');
      }

      const faceDescriptor = detections[0].descriptor;
      
      // Create biometric profile
      const biometricProfile = {
        walletAddress,
        faceDescriptor: Array.from(faceDescriptor),
        timestamp: new Date().toISOString(),
        captureQuality: detections[0].detection.score
      };

      setCapturedDescriptor(biometricProfile);
      setStep('captured');
      
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
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      }

    } catch (error) {
      console.error('Error capturing biometric:', error);
      setError(error.message);
    } finally {
      setIsCapturing(false);
    }
  };

  // Confirm and save biometric
  const confirmBiometric = () => {
    if (capturedDescriptor && onBiometricCaptured) {
      onBiometricCaptured(capturedDescriptor);
      setStep('verified');
      stopCamera();
    }
  };

  // Retry capture
  const retryCapture = () => {
    setCapturedDescriptor(null);
    setError(null);
    setStep('capturing');
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
        <p className="text-gray-600">Loading biometric registration system...</p>
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

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <div className="text-center mb-6">
        <User className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Biometric Registration</h2>
        <p className="text-gray-600">
          Secure your account by registering your facial biometrics. This will be used to verify your identity during activity submissions.
        </p>
      </div>

      {step === 'setup' && (
        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Before we start:</h3>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• Ensure you're in a well-lit environment</li>
              <li>• Position your face clearly in the camera view</li>
              <li>• Remove any face coverings or sunglasses</li>
              <li>• Make sure you're alone in the frame</li>
            </ul>
          </div>
          <button
            onClick={startCamera}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
          >
            <Camera className="h-5 w-5 mr-2" />
            Start Biometric Registration
          </button>
        </div>
      )}

      {step === 'capturing' && (
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
              onClick={captureBiometric}
              disabled={isCapturing}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center mx-auto"
            >
              {isCapturing ? (
                <>
                  <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                  Capturing...
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Capture Biometric
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {step === 'captured' && (
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-800">Biometric Captured Successfully!</h3>
          <p className="text-gray-600">
            Your facial biometric has been captured and is ready to be linked to your wallet address.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 text-left">
            <h4 className="font-semibold text-gray-800 mb-2">Capture Details:</h4>
            <p className="text-sm text-gray-600">Wallet: {walletAddress}</p>
            <p className="text-sm text-gray-600">Quality Score: {(capturedDescriptor?.captureQuality * 100).toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Timestamp: {new Date(capturedDescriptor?.timestamp).toLocaleString()}</p>
          </div>
          
          <div className="flex space-x-4 justify-center">
            <button
              onClick={retryCapture}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retry Capture
            </button>
            <button
              onClick={confirmBiometric}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Confirm & Save
            </button>
          </div>
        </div>
      )}

      {step === 'verified' && (
        <div className="text-center space-y-4">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-800">Registration Complete!</h3>
          <p className="text-gray-600">
            Your biometric profile has been successfully linked to your wallet. You can now use AI verification for activity submissions.
          </p>
        </div>
      )}
    </div>
  );
};

export default BiometricRegistration;
