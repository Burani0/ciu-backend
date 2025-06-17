import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styles from './Exam.module.css';
import * as faceapi from 'face-api.js';
import { emitStream, joinRoom, leaveRoom } from '../config/socket';

export type Timer = { hours: number; minutes: number; seconds: number };
export type SecurityChecks = {
  fullscreen: boolean;
  safeBrowser: boolean;
  noScreenCapture: boolean;
  noCopyPaste: boolean;
  noDevTools: boolean;
  noPrintScreen: boolean;
  noMultipleWindows: boolean;
};
export type Violation = { type: string; timestamp: string };
export type Answer = { section: string; content: string };

const ExamPage: React.FC = () => {
  const [timer, setTimer] = useState<Timer>({ hours: 3, minutes: 0, seconds: 0 });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [screenCaptureAttempts, setScreenCaptureAttempts] = useState<number>(0);
  const [securityChecks, setSecurityChecks] = useState<SecurityChecks>({
    fullscreen: false,
    safeBrowser: false,
    noScreenCapture: false,
    noCopyPaste: true,
    noDevTools: false,
    noPrintScreen: false,
    noMultipleWindows: false,
  });
  const [violations, setViolations] = useState<Violation[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [faceDetectionError, setFaceDetectionError] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [smoothedDetection, setSmoothedDetection] = useState<0 | 1 | 2>(1);
  const [noFaceTimer, setNoFaceTimer] = useState(0);
  const [multiFaceTimer, setMultiFaceTimer] = useState(0);
  const [examData, setExamData] = useState({
    examLink: '',
    examNo: '',
    examName: '',
    courseId: '',
    studentRegNo: '',
  });
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentSection, setCurrentSection] = useState<string>('A');
  const [sections, setSections] = useState<string[]>(['A', 'B', 'C']); // Default, updated by API
  const [isSectioned, setIsSectioned] = useState<boolean>(true); // Determines if exam has sections
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // New loading state

  const videoRef = useRef<HTMLVideoElement>(null);
  const faceDetectionInterval = useRef<NodeJS.Timeout | null>(null);
  const fullscreenCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const fullscreenLockInterval = useRef<NodeJS.Timeout | null>(null);
  const securityCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const devToolsCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const frameInterval = useRef<NodeJS.Timeout | null>(null);
  const detectionBufferRef = useRef<number[]>([]);
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  const isSupportedBrowser = () => {
    const ua = window.navigator.userAgent;
    return /Chrome\/|Edg\/|Safari\//.test(ua) && !/OPR\//.test(ua);
  };

  // Fetch exam data and PDF before rendering
  useEffect(() => {
    const fetchExamData = async () => {
      const examNo = localStorage.getItem('currentExamNo') || roomId || '';
      if (!examNo) {
        setPdfError('No exam number provided.');
        setIsLoading(false);
        console.error('Error: No exam number available');
        return;
      }

      const examLink = `https://eadmin.ciu.ac.ug/API/doc_verification.aspx?doc=Exam&ExamNo=${examNo}`;
      console.log('Fetching exam data from:', examLink);

      try {
        // Fetch PDF
        const pdfResponse = await axios.get(examLink, {
          responseType: 'blob',
          withCredentials: true,
        });
        const url = window.URL.createObjectURL(new Blob([pdfResponse.data], { type: 'application/pdf' }));
        setPdfUrl(url);
        setPdfError(null);

        // Fetch section configuration (mocked for now, replace with actual API)
        const sectionResponse = { hasSections: true, sections: ['A', 'B', 'C'] }; // Mock
        setIsSectioned(sectionResponse.hasSections);
        setSections(sectionResponse.hasSections ? sectionResponse.sections : []);
        if (!sectionResponse.hasSections) {
          setCurrentSection('nonSectioned');
        }

        // Set exam data from localStorage
        const examLinkData = localStorage.getItem('currentExamFullLink') || '';
        const examName = localStorage.getItem('currentExamName') || '';
        const courseId = localStorage.getItem('currentExamID') || '';
        const studentRegNo = localStorage.getItem('studentRegNo') || '';
        setExamData({ examLink: examLinkData, examNo, examName, courseId, studentRegNo });

        const savedAnswers = Object.keys(localStorage)
          .filter((key) => key.startsWith('answer_'))
          .map((key) => ({
            section: key.replace('answer_', ''),
            content: localStorage.getItem(key) || '',
          }))
          .filter((ans) => ans.section && ans.content.trim());
        setAnswers(savedAnswers);

        setIsTimerRunning(true);
        initializeCamera();
      } catch (err) {
        console.error('Error fetching exam data:', err);
        setPdfError('Failed to load exam data. Check console for details.');
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched or an error occurs
      }
    };

    fetchExamData();
  }, [roomId]);

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) {
          seconds = 59;
          minutes--;
          if (minutes < 0) {
            minutes = 59;
            hours--;
            if (hours < 0) {
              submitExam();
              return prev;
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const recordViolation = (type: string): void => {
    const violation: Violation = { type, timestamp: new Date().toISOString() };
    setViolations((prev) => [...prev, violation]);
    console.log('Violation recorded:', violation);
  };

  useEffect(() => {
    const loadModels = async (): Promise<void> => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
        setIsModelLoaded(true);
        console.log('Face detection models loaded successfully');
      } catch (error) {
        setFaceDetectionError('Face detection model failed to load.');
        console.log('Face detection model load error:', error);
      }
    };
    loadModels();
  }, []);

  const DETECTION_BUFFER_SIZE = 6;
  const NO_FACE_WARNING_SECONDS = 3;
  const MULTIPLE_FACE_WARNING_SECONDS = 2;

  const detectFaces = async (video: HTMLVideoElement): Promise<void> => {
    if (!video || !isModelLoaded) return;
    try {
      const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }));
      let detectionType: 0 | 1 | 2 = detections.length === 1 ? 1 : detections.length > 1 ? 2 : 0;
      detectionBufferRef.current.push(detectionType);
      if (detectionBufferRef.current.length > DETECTION_BUFFER_SIZE) detectionBufferRef.current.shift();
      const smoothedType = detectionBufferRef.current.reduce((acc, val) => acc + val, 0) >= DETECTION_BUFFER_SIZE ? 2 : detectionType;
      setSmoothedDetection(smoothedType);
      console.log('Face detection:', { detections: detections.length, smoothedType });
    } catch (error) {
      setFaceDetectionError('Face detection failed. Please check your camera.');
      console.log('Face detection error:', error);
    }
  };

  useEffect(() => {
    if (!detectionBufferRef.current) detectionBufferRef.current = [];
    let noFaceInt: NodeJS.Timeout | undefined;
    let multiFaceInt: NodeJS.Timeout | undefined;
    if (smoothedDetection === 0) noFaceInt = setInterval(() => setNoFaceTimer((t) => t + 1), 1000);
    else setNoFaceTimer(0);
    const multiFaceBufferStable = detectionBufferRef.current.length === DETECTION_BUFFER_SIZE && detectionBufferRef.current.every((v) => v === 2);
    if (multiFaceBufferStable) multiFaceInt = setInterval(() => setMultiFaceTimer((t) => t + 1), 1000);
    else setMultiFaceTimer(0);
    return () => { if (noFaceInt) clearInterval(noFaceInt); if (multiFaceInt) clearInterval(multiFaceInt); };
  }, [smoothedDetection]);

  const showNoFaceWarning = smoothedDetection === 0 && noFaceTimer >= NO_FACE_WARNING_SECONDS;
  const showMultiFaceWarning = detectionBufferRef.current.length === DETECTION_BUFFER_SIZE && detectionBufferRef.current.every((v) => v === 2) && multiFaceTimer >= MULTIPLE_FACE_WARNING_SECONDS;
  const showFaceDetected = smoothedDetection === 1;

  const initializeCamera = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { min: 640, ideal: 1280 }, height: { min: 480, ideal: 720 }, facingMode: 'user', frameRate: { ideal: 30 } } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise((resolve) => { if (videoRef.current) videoRef.current.onloadedmetadata = () => videoRef.current?.play().then(resolve); });
        setCameraActive(true);
        setCameraError(null);
        if (roomId) joinRoom(roomId);
        startFrameStreaming();
        console.log('Camera initialized successfully');
      }
    } catch (err) {
      setCameraError('Camera access denied or not available');
      console.log('Camera initialization error:', err);
    }
  };

  const startFrameStreaming = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    frameInterval.current = setInterval(() => {
      if (videoRef.current && ctx) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const frame = canvas.toDataURL('image/jpeg');
        emitStream(frame);
      }
    }, 100);
    console.log('Started frame streaming');
  };

  const stopCamera = (): void => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
    if (faceDetectionInterval.current) clearInterval(faceDetectionInterval.current);
    if (frameInterval.current) clearInterval(frameInterval.current);
    leaveRoom();
    console.log('Camera stopped');
  };

  const preventScreenCapture = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: { displaySurface: 'monitor' } });
      stream.getTracks().forEach((track) => {
        track.stop();
        setScreenCaptureAttempts((prev) => prev + 1);
        recordViolation('Screen capture attempt detected');
        if (screenCaptureAttempts >= 1) {
          alert('Screen capture detected. Your exam will be submitted automatically.');
          submitExam();
        }
      });
    } catch (err) {
      console.log('Screen capture prevention active');
    }
  };

  const isDevToolsOpen = (): boolean => {
    if (process.env.NODE_ENV === 'development') return false;
    const threshold = 160;
    return window.outerHeight - window.innerHeight > threshold || window.outerWidth - window.innerWidth > threshold;
  };

  const performSecurityCheck = (): void => {
    if (!isTimerRunning) return;
    const checks: SecurityChecks = {
      fullscreen: Boolean(document.fullscreenElement),
      safeBrowser: isSupportedBrowser(),
      noScreenCapture: screenCaptureAttempts === 0,
      noCopyPaste: true,
      noDevTools: !isDevToolsOpen(),
      noPrintScreen: !window.matchMedia('print').matches,
      noMultipleWindows: window.outerHeight === window.innerHeight && window.outerWidth === window.innerWidth,
    };
    setSecurityChecks(checks);
    console.log('Security checks:', checks);
    if (!checks.noScreenCapture || !checks.noDevTools || !checks.noMultipleWindows) {
      recordViolation('Security check failed');
      submitExam();
    }
  };

  const startSecurityMonitoring = (): void => {
    if (securityCheckInterval.current) clearInterval(securityCheckInterval.current);
    if (!isTimerRunning) return;
    securityCheckInterval.current = setInterval(() => {
      performSecurityCheck();
      preventScreenCapture();
      if (isDevToolsOpen()) {
        recordViolation('Developer tools detected');
        alert('Developer tools detected. Your exam will be submitted automatically.');
        submitExam();
      }
      if (window.matchMedia('print').matches) {
        recordViolation('Print screen attempt detected');
        alert('Print screen detected. Your exam will be submitted automatically.');
        submitExam();
      }
      if (window.outerHeight !== window.innerHeight || window.outerWidth !== window.innerWidth) {
        recordViolation('Multiple windows detected');
        alert('Multiple windows detected. Your exam will be submitted automatically.');
        submitExam();
      }
    }, 500);
    console.log('Started security monitoring');
  };

  const submitExam = async (): Promise<void> => {
    setIsTimerRunning(false);
    stopCamera();
    setSubmissionStatus('Submitting...');

    // Filter out invalid answers (empty section or content)
    const validAnswers = answers.filter((ans) => ans.section && ans.content.trim());
    if (validAnswers.length === 0) {
      setSubmissionStatus('No valid answers to submit. Please enter your answers.');
      return;
    }

    const submissionData = {
      studentRegNo: examData.studentRegNo,
      examNo: examData.examNo,
      examName: examData.examName,
      courseId: examData.courseId,
      answers: validAnswers.map(({ section, content }) => ({ section, answer: content.trim() })),
      violations,
      submissionTime: new Date().toISOString(),
      proctoringStatus: {
        securityChecks,
        cameraActive,
        screenCaptureAttempts,
      },
    };

    try {
      const response = await axios.post('http://localhost:3001/API/submit_exam', submissionData, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setSubmissionStatus('Exam submitted successfully!');
        Object.keys(localStorage)
          .filter((key) => key.startsWith('answer_'))
          .forEach((key) => localStorage.removeItem(key));
        setTimeout(() => navigate('/exam-complete'), 2000);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error('Error submitting exam:', err);
      setSubmissionStatus(`Failed to submit exam: ${err.response?.data?.error || 'Please try again.'}`);
    }
  };

  const renderCameraContainer = (): JSX.Element => (
    <div className="fixed top-5 right-5 w-[250px] bg-white border border-gray-200 rounded-lg p-4 shadow-lg z-[1000]">
      <h4 className="mb-2 text-sm font-semibold text-gray-800">Proctoring Camera</h4>
      <div className="relative">
        <video ref={videoRef} autoPlay playsInline muted className="w-full rounded bg-black" />
        <div className="absolute left-2 bottom-2 text-sm">
          {!isModelLoaded ? (
            <div className="text-teal-600 italic">⌛ Loading face detection...</div>
          ) : faceDetectionError ? (
            <div className="text-red-500 font-medium">⚠️ {faceDetectionError}</div>
          ) : showNoFaceWarning ? (
            <div className="text-red-500 font-medium">⚠️ No Face Detected for {noFaceTimer}s</div>
          ) : showMultiFaceWarning ? (
            <div className="text-red-500 font-medium">⚠️ Multiple Faces Detected for {multiFaceTimer}s</div>
          ) : showFaceDetected ? (
            <div className="text-green-600 font-medium">✓ Face Detected</div>
          ) : (
            <div className="text-red-500 font-medium">⚠️ Detecting...</div>
          )}
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      faceDetectionInterval.current = setInterval(() => {
        if (videoRef.current) detectFaces(videoRef.current);
      }, 500);
    }
    return () => { if (faceDetectionInterval.current) clearInterval(faceDetectionInterval.current); };
  }, [cameraActive, isModelLoaded]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>, section: string) => {
    const newAnswer = e.target.value;
    setAnswers((prev) => {
      const updatedAnswers = prev.filter((ans) => ans.section !== section);
      if (newAnswer.trim()) {
        updatedAnswers.push({ section, content: newAnswer });
      }
      localStorage.setItem(`answer_${section}`, newAnswer);
      return updatedAnswers;
    });
  };

  const switchSection = (section: string) => {
    setCurrentSection(section);
  };

  // Render loading state until data is ready
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-teal-800">Loading Exam... Please wait.</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 font-sans">
      <div className="flex justify-between items-center px-6 py-3 bg-teal-800 text-white shadow">
        <div className="text-lg font-semibold">
          Clarke International University
        </div>
        <div className="text-sm font-bold bg-white/20 px-4 py-1 rounded">
          Time Remaining: {String(timer.hours).padStart(2, '0')}:{String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Proctoring Status Sidebar */}
        <div className="w-48 bg-white border-r border-gray-200 shadow-lg overflow-y-auto">
          <div className="p-4">
            <h4 className="font-semibold text-gray-800 mb-2">Proctoring Status</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Security:</span><span className={Object.values(securityChecks).every((check) => check) ? 'text-green-600' : 'text-red-500'}>{Object.values(securityChecks).every((check) => check) ? 'Secure' : 'Compromised'}</span></div>
              <div className="flex justify-between"><span>Browser:</span><span className={isSupportedBrowser() ? 'text-green-600' : 'text-red-500'}>{isSupportedBrowser() ? 'Supported' : 'Unsupported'}</span></div>
              <div className="flex justify-between"><span>Camera:</span><span className={cameraActive ? 'text-green-600' : 'text-red-500'}>{cameraActive ? 'Active' : 'Inactive'}</span></div>
              <div className="flex justify-between"><span>Screen Capture:</span><span className={screenCaptureAttempts === 0 ? 'text-green-600' : 'text-red-500'}>{screenCaptureAttempts === 0 ? 'Blocked' : 'Attempted'}</span></div>
              <div className="flex justify-between"><span>Dev Tools:</span><span className={!isDevToolsOpen() ? 'text-green-600' : 'text-red-500'}>{!isDevToolsOpen() ? 'Blocked' : 'Detected'}</span></div>
              <div className="flex justify-between"><span>Windows:</span><span className={window.outerHeight === window.innerHeight && window.outerWidth === window.innerWidth ? 'text-green-600' : 'text-red-500'}>{window.outerHeight === window.innerHeight && window.outerWidth === window.innerWidth ? 'Single' : 'Multiple'}</span></div>
              <div className="flex justify-between"><span>Violations:</span><span className={violations.length > 0 ? 'text-red-500' : 'text-green-600'}>{violations.length}</span></div>
            </div>
            <h4 className="font-semibold text-gray-800 mt-4 mb-2">Sections</h4>
            <div className="space-y-2">
              {isSectioned && sections.map((section) => (
                <button
                  key={section}
                  className={`w-full py-1 text-sm rounded ${currentSection === section ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => switchSection(section)}
                  disabled={!isSectioned}
                >
                  Section {section} {answers.find((ans) => ans.section === section)?.content ? '✓' : ''}
                </button>
              ))}
              <button
                className={`w-full py-1 text-sm rounded ${currentSection === 'nonSectioned' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
                onClick={() => switchSection('nonSectioned')}
              >
                Exam Answers {answers.find((ans) => ans.section === 'nonSectioned')?.content ? '✓' : ''}
              </button>
            </div>
            <button className="mt-4 w-full bg-teal-600 text-white py-2 rounded-lg font-semibold hover:bg-teal-700" onClick={submitExam}>Submit Exam</button>
            {submissionStatus && (
              <div className={`mt-2 text-sm ${submissionStatus.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
                {submissionStatus}
              </div>
            )}
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {renderCameraContainer()}
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Exam PDF (Left) */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-800 mb-2">Exam PDF</h4>
              <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
                {pdfError ? (
                  <div className="text-red-500">{pdfError}</div>
                ) : pdfUrl ? (
                  <object data={pdfUrl} type="application/pdf" width="100%" height="600px" style={{ border: 'none' }}>
                    <p>PDF not supported. <a href={pdfUrl}>Download instead</a>.</p>
                  </object>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
            {/* Your Answer (Right) */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="font-semibold text-gray-800 mb-2">Your Answer</h4>
              <div className="text-sm text-gray-700 mb-4">
                <div>Reg No: {examData.studentRegNo}</div>
                <div>Exam: {examData.examName}</div>
                <div>Course ID: {examData.courseId}</div>
                <div>Exam No: {examData.examNo}</div>
              </div>
              <div className="mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {currentSection === 'nonSectioned' ? 'Exam Answers' : `Answers for Section ${currentSection}`}
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Type your answers in the format: 1) [answer] for descriptive questions, or 1) a: [answer], 2) b: [answer], 10) c: [answer], etc., for objective questions, matching the exam PDF.
                </p>
              </div>
              <textarea
                value={answers.find((ans) => ans.section === currentSection)?.content || ''}
                onChange={(e) => handleAnswerChange(e, currentSection)}
                className="w-full h-[calc(100vh-300px)] p-2 border rounded resize-none"
                placeholder={`Example:\n1) [Your descriptive answer here]\n1) a: [Your objective answer here]\n2) b: [Your objective answer here]`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;