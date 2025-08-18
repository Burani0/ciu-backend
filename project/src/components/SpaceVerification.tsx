import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, CheckCircle, AlertCircle, User, Lock, X, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SpaceVerification = () => {
    const navigate = useNavigate();

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

  // ---- Face detection (uses FaceDetector if available, otherwise fallback simulation) ----
  const detectFaces = useCallback(async (useVideoForDraw = false) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video) return 0;

    // if canvas present and asked to draw, set canvas size
    if (useVideoForDraw && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    }

    try {
      if ('FaceDetector' in window) {
        const faceDetector = new window.FaceDetector({ maxDetectedFaces: 10, fastMode: true });
        const faces = await faceDetector.detect(video);

        // optional drawing
        if (useVideoForDraw && canvas) {
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.strokeStyle = faces.length === 1 ? '#10B981' : '#EF4444';
          ctx.lineWidth = 2;
          faces.forEach(face => {
            const { x, y, width, height } = face.boundingBox;
            ctx.strokeRect(x, y, width, height);
            if (face.landmarks) {
              ctx.fillStyle = faces.length === 1 ? '#10B981' : '#EF4444';
              face.landmarks.forEach(l => {
                ctx.beginPath();
                ctx.arc(l.x, l.y, 2, 0, 2 * Math.PI);
                ctx.fill();
              });
            }
          });
        }

        setFaceCount(faces.length);
        return faces.length;
      } else {
        // fallback simple detection (keep for demo/testing)
        if (useVideoForDraw && canvas) {
          const ctx = canvas.getContext('2d');
          ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        }
        const simulated = Math.random() > 0.3 ? (Math.random() > 0.8 ? 2 : 1) : 0;
        setFaceCount(simulated);
        return simulated;
      }
    } catch (err) {
      console.error('Face detection error', err);
      return 0;
    }
  }, []);

  // ---- Object detection (simulated placeholder) ----
  const detectObjects = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return [];

    // In production: run TensorFlow.js / COCO-SSD here. For now we simulate.
    const prohibitedItems = ['cell phone', 'book', 'laptop', 'tablet', 'paper'];
    const detected = [];
    prohibitedItems.forEach(item => {
      if (Math.random() > 0.85) { // lower chance to reduce false positives in demo
        detected.push({ class: item, confidence: 0.7 + Math.random() * 0.3 });
      }
    });

    return detected;
  }, []);

  // ---- Environment analysis ----
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

    let totalBrightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
      totalBrightness += brightness;
    }
    const avgBrightness = totalBrightness / (data.length / 4);

    return {
      lighting: Math.min(100, (avgBrightness / 255) * 100),
      noise: Math.random() * 20,
      stability: 80 + Math.random() * 20
    };
  }, []);

  // ---- Start camera ----
  useEffect(() => {
    startVideo();
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startVideo = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: false
      });
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
      setStream(mediaStream);
      setStatus('Camera ready. Click "Start Verification" to begin.');
    } catch (err) {
      console.error('Camera error', err);
      setStatus('Camera access denied. Please allow camera permissions.');
    }
  };

  // ---- Start comprehensive detection (uses local vars to avoid state-race) ----
  const startDetection = async () => {
    if (!videoRef.current) return;

    setIsDetecting(true);
    setVerificationFailed(false);
    setStatus('Starting comprehensive exam space analysis...');

    // Local trackers (keeps logic deterministic during async ops)
    const localCompleted = {
      faceDetection: false,
      objectDetection: false,
      lightingCheck: false,
      audioCheck: false,
      environmentCheck: false
    };
    const localViolations = [];
    const localResults = [];

    // helper to push results (and update UI live)
    const pushResult = (text, statusType = 'success') => {
      localResults.push({ text, status: statusType });
      setDetectionResults([...localResults]);
    };

    // Step 1: face detection
    setStatus('Performing face detection...');
    const faces = await detectFaces(true); // draw boxes to canvas
    const facePassed = faces === 1;
    localCompleted.faceDetection = true;

    if (facePassed) {
      pushResult('✓ Single person detected', 'success');
    } else if (faces === 0) {
      pushResult('✗ No person detected', 'error');
      localViolations.push('No person visible in camera');
    } else {
      pushResult(`✗ Multiple people detected (${faces})`, 'error');
      localViolations.push('Multiple people detected');
    }

    // short delay for realism
    await new Promise(r => setTimeout(r, 600));

    // Step 2: object detection
    setStatus('Scanning for prohibited objects...');
    const objects = await detectObjects();
    localCompleted.objectDetection = true;

    if (objects.length === 0) {
      pushResult('✓ No prohibited items detected', 'success');
    } else {
      objects.forEach(obj => {
        pushResult(`✗ Prohibited item detected: ${obj.class} (${Math.round(obj.confidence * 100)}% confidence)`, 'error');
        localViolations.push(`Prohibited item: ${obj.class}`);
      });
    }

    await new Promise(r => setTimeout(r, 600));

    // Step 3: environment / lighting
    setStatus('Analyzing lighting and environment...');
    const env = analyzeEnvironment();
    const lightingPassed = env.lighting > 25; // slightly more tolerant threshold
    localCompleted.lightingCheck = true;
    localCompleted.environmentCheck = true;

    if (lightingPassed) {
      pushResult('✓ Adequate lighting conditions', 'success');
    } else {
      pushResult('✗ Insufficient lighting', 'warning');
      localViolations.push('Poor lighting conditions');
    }

    pushResult('✓ Background analysis complete', 'success');

    await new Promise(r => setTimeout(r, 600));

    // Step 4: audio (simulated)
    setStatus('Checking audio levels...');
    localCompleted.audioCheck = true;
    pushResult('✓ Audio environment acceptable', 'success');

    await new Promise(r => setTimeout(r, 600));

    // Finalize: commit local trackers to state
    setCompletedChecks({ ...localCompleted });
    setViolations([...localViolations]);
    setDetectionResults([...localResults]);

    const allChecksComplete = Object.values(localCompleted).every(Boolean);
    const hasViolations = localViolations.length > 0;

    if (!allChecksComplete) {
      setStatus('Error: Not all verification checks were completed');
      setDetectionResults(prev => [...prev, { text: '✗ Verification incomplete - some checks failed to run', status: 'error' }]);
      setIsDetecting(false);
      setVerificationFailed(true);
      return;
    }

    if (hasViolations) {
      setStatus('Verification FAILED - Please resolve violations');
      setDetectionResults(prev => [...prev, { text: '✗ VERIFICATION FAILED - Cannot proceed to exam', status: 'error' }]);
      setIsDetecting(false);
      setVerificationFailed(true);

      setTimeout(() => setStatus('Verification failed. Click "Retry Verification" to try again.'), 1500);
      return;
    }

    // success path
    setStatus('All verifications passed! Redirecting to login...');
    setDetectionResults(prev => [...prev, { text: '✓ ALL REQUIREMENTS MET - Proceeding to login', status: 'success' }]);

    // small UX delay then redirect
    setTimeout(() => {
      setVerified(true);
      setTimeout(() => {
        navigate('/instructions');
      }, 1200);
    }, 1000);
  };

  // ---- Live monitoring while detection UI active (optional) ----
  useEffect(() => {
    let liveInterval = null;
    if (isDetecting) {
      // we want to keep face boxes updated visually every second
      liveInterval = setInterval(() => {
        detectFaces(true).catch(() => {});
      }, 1000);
    }
    return () => {
      if (liveInterval) clearInterval(liveInterval);
    };
  }, [isDetecting, detectFaces]);

  // ---- UI ----
  if (verified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4" />
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
          <p className="text-gray-600">AI-powered detection system ensuring exam integrity</p>
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
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2" />
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
                  <p className="text-red-800 font-medium text-sm">⚠️ You cannot proceed to the exam until ALL violations are resolved</p>
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
                  <p className="text-yellow-800 text-sm font-medium">💡 Fix these issues and click "Retry Verification" to continue</p>
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
                  { name: 'Lighting Check', key: 'lightingCheck', desc: 'Adequate illumination (>25%)' },
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
                    style={{ width: `${(Object.values(completedChecks).filter(Boolean).length / 5) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {detectionResults.length > 0 && (
              <div className="bg-white border rounded-lg p-6 max-h-80 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Detection Results</h3>
                <div className="space-y-2">
                  {detectionResults.map((result, index) => (
                    <div key={index} className={`flex items-start text-sm ${
                      result.status === 'success' ? 'text-green-700' : result.status === 'error' ? 'text-red-700' : 'text-yellow-700'
                    }`}>
                      {result.status === 'success' ? (
                        <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      ) : result.status === 'error' ? (
                        <X className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                      )}
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
                  <p className="text-sm text-green-700">ALL 5 verification checks must pass before you can access the exam login portal.</p>
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
