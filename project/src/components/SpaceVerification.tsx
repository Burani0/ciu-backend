import React, { useEffect, useRef, useState } from 'react';
import { Camera, CheckCircle, AlertCircle, User, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import StudentLogin from '../pages/StudentLogin';
import Instructions from '../pages/Instructions';

const SpaceVerification: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [verified, setVerified] = useState(false);
  const [status, setStatus] = useState('Initializing camera...');
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionResults, setDetectionResults] = useState<string[]>([]);

  useEffect(() => {
    startVideo();
  }, []);

  const startVideo = async () => {
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
        setStatus('Camera ready. Click "Start Verification" to begin.');
      }
    } catch (err) {
      console.error('Camera error:', err);
      setStatus('Camera access denied. Please allow camera permissions.');
    }
  };

  const startDetection = () => {
    setIsDetecting(true);
    setStatus('Analyzing your exam space...');
    setDetectionResults([]);

    // Simulate detection process
    const detectionSteps = [
      'Checking for single person...',
      'Scanning for prohibited items...',
      'Verifying lighting conditions...',
      'Analyzing background...',
      'Final verification...'
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < detectionSteps.length) {
        setStatus(detectionSteps[stepIndex]);
        
        // Simulate detection results
        const results = [
          '✓ Single person detected',
          '✓ No mobile devices found',
          '✓ Adequate lighting',
          '✓ Clean background',
          '✓ All requirements met'
        ];
        
        setDetectionResults(prev => [...prev, results[stepIndex]]);
        stepIndex++;
      } else {
        clearInterval(interval);
        setStatus('Verification completed successfully!');
        setTimeout(() => {
          setVerified(true);
        }, 1500);
      }
    }, 2000);
  };

  if (verified) {
    return <Instructions />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Camera className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Exam Space Verification</h1>
          </div>
          <p className="text-gray-600">
            Please ensure you're in a quiet, well-lit space with no prohibited items visible
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-64 bg-gray-900 rounded-lg object-cover"
              />
              <canvas 
                ref={canvasRef} 
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
              />
              {!isDetecting && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                  <Button 
                    onClick={startDetection}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg"
                  >
                    Start Verification
                  </Button>
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
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                Requirements Checklist
              </h3>
              <div className="space-y-3">
                {[
                  'Only one person visible in frame',
                  'No mobile phones or electronic devices',
                  'No books or study materials',
                  'Well-lit environment',
                  'Quiet, distraction-free space',
                  'Clear view of your workspace'
                ].map((requirement, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 mr-3"></div>
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </div>

            {detectionResults.length > 0 && (
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  Detection Results
                </h3>
                <div className="space-y-2">
                  {detectionResults.map((result, index) => (
                    <div key={index} className="flex items-center text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt:', formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3 mr-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Verification Complete</h1>
              <p className="text-green-600 font-medium">Space approved for exam</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          <Button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
          >
            Login to Exam Portal
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact your exam administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpaceVerification;