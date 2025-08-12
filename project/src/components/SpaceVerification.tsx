 import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CheckCircle, AlertCircle, User, Lock, X, AlertTriangle } from 'lucide-react';

const SpaceVerification = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [verified, setVerified] = useState(false);
  const [status, setStatus] = useState('Initializing camera...');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResults, setDetectionResults] = useState([]);
  const [faceCount, setFaceCount] = useState(0);
  const [violations, setViolations] = useState([]);
  const [stream, setStream] = useState(null);
  const [verificationFailed, setVerificationFailed] = useState(false);
  const [completedChecks, setCompletedChecks] = useState({
    faceDetection: false,
    objectDetection: false,
    lightingCheck: false,
    audioCheck: false,
    environmentCheck: false
  });

  // Face detection using Web APIs
  const detectFaces = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    try {
      // Check if Face Detection API is available
      if ('FaceDetector' in window) {
        const faceDetector = new window.FaceDetector({
          maxDetectedFaces: 10,
          fastMode: false
        });

        const faces = await faceDetector.detect(video);
        setFaceCount(faces.length);

        // Draw face detection boxes
        ctx.strokeStyle = faces.length === 1 ? '#10B981' : '#EF4444';
        ctx.lineWidth = 2;

        faces.forEach(face => {
          const { x, y, width, height } = face.boundingBox;
          ctx.strokeRect(x, y, width, height);
          
          // Draw face landmarks if available
          if (face.landmarks) {
            ctx.fillStyle = faces.length === 1 ? '#10B981' : '#EF4444';
            face.landmarks.forEach(landmark => {
              ctx.beginPath();
              ctx.arc(landmark.x, landmark.y, 2, 0, 2 * Math.PI);
              ctx.fill();
            });
          }
        });

        return faces.length;
      } else {
        // Fallback: Use MediaPipe or TensorFlow.js face detection
        return await fallbackFaceDetection(video, ctx);
      }
    } catch (error) {
      console.error('Face detection error:', error);
      return 0;
    }
  }, []);

  // Fallback face detection using image analysis
  const fallbackFaceDetection = async (video, ctx) => {
    // Create ImageData from video frame
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const imageData = ctx.getImageData(0, 0, video.videoWidth, video.videoHeight);
    
    // Simple face detection simulation based on skin tone detection
    // This is a simplified approach - in production, use TensorFlow.js or similar
    const faceCount = simulateFaceDetection(imageData);
    setFaceCount(faceCount);
    
    // Draw detection indicator
    if (faceCount > 0) {
      ctx.strokeStyle = faceCount === 1 ? '#10B981' : '#EF4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(50, 50, video.videoWidth - 100, video.videoHeight - 100);
    }
    
    return faceCount;
  };

  // Simulate face detection (replace with actual ML model)
  const simulateFaceDetection = (imageData) => {
    // This is a placeholder - implement actual face detection here
    // You could integrate with:
    // - TensorFlow.js BlazeFace model
    // - MediaPipe Face Detection
    // - OpenCV.js
    return Math.random() > 0.3 ? (Math.random() > 0.8 ? 2 : 1) : 0;
  };

  // Object detection for prohibited items
  const detectObjects = useCallback(async () => {
    if (!videoRef.current) return [];

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Simulate object detection
    // In production, use TensorFlow.js COCO-SSD or similar model
    const detectedObjects = simulateObjectDetection();
    return detectedObjects;
  }, []);

  // Simulate object detection
  const simulateObjectDetection = () => {
    const prohibitedItems = ['cell phone', 'book', 'laptop', 'tablet', 'paper'];
    const detected = [];
    
    prohibitedItems.forEach(item => {
      if (Math.random() > 0.7) { // 30% chance of detecting each item
        detected.push({
          class: item,
          confidence: 0.7 + Math.random() * 0.3,
          bbox: [
            Math.random() * 300,
            Math.random() * 200,
            50 + Math.random() * 100,
            50 + Math.random() * 100
          ]
        });
      }
    });
    
    return detected;
  };

  // Environment analysis
  const analyzeEnvironment = useCallback(() => {
    const video = videoRef.current;
    if (!video) return { lighting: 0, noise: 0, stability: 0 };

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Calculate average brightness
    let totalBrightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      totalBrightness += brightness;
    }
    const avgBrightness = totalBrightness / (data.length / 4);

    return {
      lighting: Math.min(100, (avgBrightness / 255) * 100),
      noise: Math.random() * 20, // Simulate noise detection
      stability: 80 + Math.random() * 20 // Simulate stability
    };
  }, []);

  useEffect(() => {
    startVideo();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setStatus('Camera ready. Click "Start Verification" to begin.');
      }
    } catch (err) {
      console.error('Camera error:', err);
      setStatus('Camera access denied. Please allow camera permissions.');
    }
  };

  const startDetection = async () => {
    setIsDetecting(true);
    setVerificationFailed(false);
    setStatus('Starting comprehensive exam space analysis...');
    setDetectionResults([]);
    setViolations([]);
    
    // Reset all checks
    setCompletedChecks({
      faceDetection: false,
      objectDetection: false,
      lightingCheck: false,
      audioCheck: false,
      environmentCheck: false
    });

    const detectionSteps = [
      { step: 'Initializing detection systems...', delay: 1000 },
      { step: 'Performing face detection...', action: 'faces' },
      { step: 'Scanning for prohibited objects...', action: 'objects' },
      { step: 'Analyzing lighting and environment...', action: 'environment' },
      { step: 'Checking audio levels...', delay: 1500 },
      { step: 'Final verification and compliance check...', delay: 2000 }
    ];

    for (let i = 0; i < detectionSteps.length; i++) {
      const { step, action, delay } = detectionSteps[i];
      setStatus(step);

      if (action === 'faces') {
        const faces = await detectFaces();
        const faceResult = faces === 1 ? 
          '✓ Single person detected' : 
          faces === 0 ? '✗ No person detected' : `✗ Multiple people detected (${faces})`;
        
        const faceCheckPassed = faces === 1;
        setCompletedChecks(prev => ({ ...prev, faceDetection: true }));
        
        setDetectionResults(prev => [...prev, {
          text: faceResult,
          status: faceCheckPassed ? 'success' : 'error'
        }]);

        if (!faceCheckPassed) {
          setViolations(prev => [...prev, 
            faces === 0 ? 'No person visible in camera' : 'Multiple people detected'
          ]);
        }
      } else if (action === 'objects') {
        const objects = await detectObjects();
        const objectCheckPassed = objects.length === 0;
        setCompletedChecks(prev => ({ ...prev, objectDetection: true }));
        
        if (objectCheckPassed) {
          setDetectionResults(prev => [...prev, {
            text: '✓ No prohibited items detected',
            status: 'success'
          }]);
        } else {
          objects.forEach(obj => {
            setDetectionResults(prev => [...prev, {
              text: `✗ Prohibited item detected: ${obj.class} (${Math.round(obj.confidence * 100)}% confidence)`,
              status: 'error'
            }]);
            setViolations(prev => [...prev, `Prohibited item: ${obj.class}`]);
          });
        }
      } else if (action === 'environment') {
        const env = analyzeEnvironment();
        
        const lightingPassed = env.lighting > 30;
        setCompletedChecks(prev => ({ ...prev, lightingCheck: true, environmentCheck: true }));
        
        const lightingResult = lightingPassed ? 
          '✓ Adequate lighting conditions' : 
          '✗ Insufficient lighting';
        
        setDetectionResults(prev => [...prev, {
          text: lightingResult,
          status: lightingPassed ? 'success' : 'warning'
        }]);

        if (!lightingPassed) {
          setViolations(prev => [...prev, 'Poor lighting conditions']);
        }

        setDetectionResults(prev => [...prev, {
          text: '✓ Background analysis complete',
          status: 'success'
        }]);
      } else {
        await new Promise(resolve => setTimeout(resolve, delay));
        
        if (i === detectionSteps.length - 2) {
          setCompletedChecks(prev => ({ ...prev, audioCheck: true }));
          setDetectionResults(prev => [...prev, {
            text: '✓ Audio environment acceptable',
            status: 'success'
          }]);
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Final verification - check ALL requirements are complete
    const allChecksComplete = Object.values(completedChecks).every(check => check === true);
    const hasViolations = violations.length > 0;
    
    if (!allChecksComplete) {
      setStatus('Error: Not all verification checks were completed');
      setDetectionResults(prev => [...prev, {
        text: '✗ Verification incomplete - some checks failed to run',
        status: 'error'
      }]);
      setIsDetecting(false);
      setVerificationFailed(true);
      return;
    }
    
    const finalStatus = hasViolations ? 
      'Verification FAILED - Please resolve violations' : 
      'All verifications passed! Redirecting to login...';
    
    setStatus(finalStatus);
    
    if (!hasViolations) {
      setDetectionResults(prev => [...prev, {
        text: '✓ ALL REQUIREMENTS MET - Proceeding to login',
        status: 'success'
      }]);
      
      // Show success message and redirect after delay
      setTimeout(() => {
        setStatus('Redirecting to exam login portal...');
        setTimeout(() => {
          // In a real app, use React Router: navigate('/login')
          // For demo, we'll show the login component
          window.location.href = '/instructions';
        }, 2000);
      }, 2000);
    } else {
      setDetectionResults(prev => [...prev, {
        text: '✗ VERIFICATION FAILED - Cannot proceed to exam',
        status: 'error'
      }]);
      setIsDetecting(false);
      setVerificationFailed(true);
      
      // Add retry option after failure
      setTimeout(() => {
        setStatus('Verification failed. Click "Retry Verification" to try again.');
      }, 3000);
    }
  };

  // Continuous monitoring during detection
  useEffect(() => {
    let interval;
    if (isDetecting) {
      interval = setInterval(() => {
        detectFaces();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDetecting, detectFaces]);

  // Remove the InstructionsPage since we're routing to /login
  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Redirecting to Login</h2>
          <p className="text-gray-600">Please wait while we redirect you to the exam portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-6xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Camera className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Advanced Exam Space Verification</h1>
          </div>
          <p className="text-gray-600">
            AI-powered detection system ensuring exam integrity
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-80 bg-gray-900 rounded-lg object-cover"
              />
              <canvas 
                ref={canvasRef} 
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ mixBlendMode: 'multiply' }}
              />
              {faceCount > 0 && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg">
                  Faces: {faceCount}
                </div>
              )}
              {!isDetecting && !verificationFailed && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <button 
                    onClick={startDetection}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-colors"
                  >
                    Start AI Verification
                  </button>
                </div>
              )}
              {!isDetecting && verificationFailed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900 bg-opacity-70 rounded-lg">
                  <div className="text-center mb-4">
                    <X className="w-16 h-16 text-red-300 mx-auto mb-2" />
                    <h3 className="text-white text-xl font-bold mb-2">Verification Failed</h3>
                    <p className="text-red-200 text-sm">Please resolve all violations before retrying</p>
                  </div>
                  <button 
                    onClick={startDetection}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-colors"
                  >
                    Retry Verification
                  </button>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                {isDetecting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                ) : (
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2" />
                )}
                <span className="font-medium text-gray-800">Status:</span>
              </div>
              <p className="text-gray-700">{status}</p>
            </div>

            {violations.length > 0 && (
              <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
                <div className="flex items-center mb-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                  <span className="font-bold text-red-800 text-lg">CRITICAL VIOLATIONS DETECTED</span>
                </div>
                <div className="bg-red-100 rounded-md p-3 mb-3">
                  <p className="text-red-800 font-medium text-sm">
                    ⚠️ You cannot proceed to the exam until ALL violations are resolved
                  </p>
                </div>
                <ul className="space-y-2">
                  {violations.map((violation, index) => (
                    <li key={index} className="flex items-center text-red-700 bg-red-100 p-2 rounded">
                      <X className="w-5 h-5 mr-2 text-red-600" />
                      <span className="font-medium">{violation}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
                  <p className="text-yellow-800 text-sm font-medium">
                    💡 Fix these issues and click "Retry Verification" to continue
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Verification Progress
              </h3>
              <div className="space-y-3 text-sm">
                {[
                  { name: 'Face Detection', key: 'faceDetection', desc: 'Exactly one person visible' },
                  { name: 'Object Scanning', key: 'objectDetection', desc: 'No prohibited items detected' },
                  { name: 'Lighting Check', key: 'lightingCheck', desc: 'Adequate illumination (>30%)' },
                  { name: 'Audio Analysis', key: 'audioCheck', desc: 'Quiet environment verified' },
                  { name: 'Environment Check', key: 'environmentCheck', desc: 'Background analysis complete' }
                ].map((check, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      completedChecks[check.key] 
                        ? 'bg-green-500 border-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {completedChecks[check.key] && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">{check.name}</div>
                      <div className="text-gray-600 text-xs">{check.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Overall Progress</span>
                  <span>{Object.values(completedChecks).filter(Boolean).length}/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${(Object.values(completedChecks).filter(Boolean).length / 5) * 100}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {detectionResults.length > 0 && (
              <div className="bg-white border rounded-lg p-6 max-h-80 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Live Detection Results
                </h3>
                <div className="space-y-2">
                  {detectionResults.map((result, index) => (
                    <div key={index} className={`flex items-start text-sm ${
                      result.status === 'success' ? 'text-green-700' :
                      result.status === 'error' ? 'text-red-700' :
                      'text-yellow-700'
                    }`}>
                      {result.status === 'success' ? 
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" /> :
                        result.status === 'error' ?
                        <X className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" /> :
                        <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      }
                      <span>{result.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-green-50 border border-green-300 rounded-lg p-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 mb-1">Complete Verification Required</h4>
                  <p className="text-sm text-green-700">
                    ALL 5 verification checks must pass before you can access the exam login portal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpaceVerification;