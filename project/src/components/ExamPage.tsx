import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
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
export type LogEntry = {
  eventType: string;
  details: { [key: string]: any };
  timestamp: string;
};

const ExamPage: React.FC = () => {
  const [timer, setTimer] = useState<Timer>({ hours: 0, minutes: 0, seconds: 0 });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [faceDetectionError, setFaceDetectionError] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [smoothedDetection, setSmoothedDetection] = useState<0 | 1 | 2>(1);
  const [noFaceTimer, setNoFaceTimer] = useState(0); // Kept for compatibility
  const [multiFaceTimer, setMultiFaceTimer] = useState(0); // Kept for compatibility
  const [violationCount, setViolationCount] = useState<number>(0);
  const [examEndTime, setExamEndTime] = useState<number>(0); // <-- newly added
  const [resumeMode, setResumeMode] = useState<boolean>(false);
  const [examData, setExamData] = useState({
    examLink: '',
    examNo: '',
    examName: '',
    courseId: '',
    studentRegNo: '',
  });
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentSection, setCurrentSection] = useState<string>('A');
  const [sections, setSections] = useState<string[]>(['A', 'B', 'C']);
  const [isSectioned, setIsSectioned] = useState<boolean>(true);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [logBuffer, setLogBuffer] = useState<LogEntry[]>([]);
  const [logSummary, setLogSummary] = useState<{ [key: string]: { start: string; end: string; count: number } }>({});

  const videoRef = useRef<HTMLVideoElement>(null);
  const faceDetectionInterval = useRef<NodeJS.Timeout | null>(null);
  const frameInterval = useRef<NodeJS.Timeout | null>(null);
  const detectionBufferRef = useRef<number[]>([]);
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();


  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentTime = Date.now();
      localStorage.setItem("lastSeen", currentTime.toString());
      localStorage.setItem("examEndTime", examEndTime.toString());
      localStorage.setItem("violationCount", violationCount.toString());
      localStorage.setItem("resumeMode", "true"); // Flag that the user had an ongoing exam
    };
  
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [examEndTime, violationCount]);
  

  useEffect(() => {
    const storedLastSeen = localStorage.getItem("lastSeen");
    const storedEndTime = localStorage.getItem("examEndTime");
    const now = Date.now();
  
    if (storedLastSeen && storedEndTime) {
      const lastSeen = parseInt(storedLastSeen, 10);
      const examEnd = parseInt(storedEndTime, 10);
      const gracePeriod = 10 * 60 * 1000;
  
      if (now - lastSeen <= gracePeriod) {
        // ✅ RESUME: within grace period
        const remainingTime = examEnd - now;
        const seconds = Math.max(0, Math.floor(remainingTime / 1000));
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
  
        setTimer({ hours: h, minutes: m, seconds: s });
        setExamEndTime(examEnd);
        setResumeMode(true);
        setIsTimerRunning(true);
  
        // Restore violations and sections
        const storedViolations = localStorage.getItem("violationCount");
        if (storedViolations) setViolationCount(parseInt(storedViolations));
  
        const savedSection = localStorage.getItem("currentSection");
        const savedIsSectioned = localStorage.getItem("isSectioned");
        if (savedSection) setCurrentSection(savedSection);
        if (savedIsSectioned) setIsSectioned(JSON.parse(savedIsSectioned));
      } else {
        // ❌ Past grace period: Submit if it was an ongoing exam
        const wasInExamBefore = localStorage.getItem("resumeMode");
        if (wasInExamBefore === "true") {
          console.log("Grace period expired. Auto-submitting...");
          submitExam('auto-submit');
          localStorage.removeItem("resumeMode");
        }
      }
    }
  }, []);
  

  // Aggregate logs into time ranges
  const aggregateLogs = (logs: LogEntry[]) => {
    const summary: { [key: string]: { start: string; end: string; count: number } } = {};
    let currentEvent: string | null = null;
    let startTime: string | null = null;

    logs.forEach((log, index) => {
      const eventKey = `${log.eventType}_${log.details.violationType || log.details.remainingTime || 'generic'}`;
      if (!currentEvent || currentEvent !== eventKey) {
        if (currentEvent && startTime) {
          summary[currentEvent] = {
            start: startTime,
            end: logs[index - 1].timestamp,
            count: (summary[currentEvent]?.count || 0) + 1,
          };
        }
        currentEvent = eventKey;
        startTime = log.timestamp;
      }
      if (index === logs.length - 1 && currentEvent && startTime) {
        summary[currentEvent] = {
          start: startTime,
          end: log.timestamp,
          count: (summary[currentEvent]?.count || 0) + 1,
        };
      }
    });

    return summary;
  };

  

  useEffect(() => {
    const fetchExamData = async () => {
      const examNo = localStorage.getItem('currentExamNo') || roomId || '';
      if (!examNo) {
        setPdfError('No exam number provided.');
        setIsLoading(false);
        console.error('Error: No exam number available');
        return;
      }

      const examLink = `https://examiner.ciu.ac.ug/api/exam-pdf?ExamNo=${examNo}`;
      console.log('Fetching exam data from:', examLink);

      try {
        const pdfResponse = await axios.get(examLink, {
          responseType: 'blob',
          withCredentials: true,
        });
        const url = window.URL.createObjectURL(new Blob([pdfResponse.data], { type: 'application/pdf' }));
        setPdfUrl(url);
        setPdfError(null);

        const sectionResponse = { hasSections: true, sections: ['A', 'B', 'C'] };
        setIsSectioned(sectionResponse.hasSections);
        setSections(sectionResponse.hasSections ? sectionResponse.sections : []);
        if (!sectionResponse.hasSections) {
          setCurrentSection('nonSectioned');
        }

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

        const duration = localStorage.getItem('currentExamDuration') || '0h 5m';
        console.log('Retrieved currentExamDuration:', duration);
        const match = duration.match(/(\d+)h\s*(\d+)m/);
        let hours = 0;
        let minutes = 0;
        if (match) {
          hours = parseInt(match[1], 10);
          minutes = parseInt(match[2], 10);
        } else {
          console.error('Invalid duration format:', duration);
        }

        if (!resumeMode) {
          setTimer({ hours, minutes, seconds: 0 });
          const endTimestamp = new Date().getTime() + hours * 3600000 + minutes * 60000;
          setExamEndTime(endTimestamp);
          setIsTimerRunning(true);
        }
        // setTimer({ hours, minutes, seconds: 0 });
        // setIsTimerRunning(true);
        // initializeCamera();

        try {
          await initializeCamera();
        } catch (cameraError) {
          console.warn("Camera initialization failed:", cameraError);
        }
        
      } catch (err) {
        console.error('Error fetching exam data:', err);
        setPdfError('Failed to load exam data. Please try again or contact support.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamData();
  }, [roomId]);

  useEffect(() => {
    if (resumeMode) {
      initializeCamera();
      setResumeMode(false);
    }
  }, [resumeMode]);

  useEffect(() => {
    localStorage.setItem("currentSection", currentSection);
    localStorage.setItem("isSectioned", JSON.stringify(isSectioned));
  }, [currentSection, isSectioned]);
  
  
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
              submitExam('auto-submit');
              return { hours: 0, minutes: 1, seconds: 0 };
            }
          }
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

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

  
  const DETECTION_BUFFER_SIZE = 3; // Reduced buffer size for faster response

  const detectFaces = async (video: HTMLVideoElement): Promise<void> => {
    if (!video || !isModelLoaded) return;
    try {
      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }) // Increased threshold for better accuracy
      );

  const detectionType: 0 | 1 | 2 = detections.length === 1 ? 1 : detections.length > 1 ? 2 : 0;

      // Immediately handle multiple faces
      if (detectionType === 2) {
        setFaceDetectionError('Multiple faces detected. Only one face is allowed.');
        setSmoothedDetection(2);
        logEvent('security_violation', { violationType: 'multiple_faces' });
        incrementViolation();
        return;
      }

      // Update detection buffer
      detectionBufferRef.current.push(detectionType);
      if (detectionBufferRef.current.length > DETECTION_BUFFER_SIZE) {
        detectionBufferRef.current.shift();
      }

      // Calculate smoothed detection
      const smoothedType = detectionBufferRef.current.every(val => val === 0)
        ? 0
        : detectionBufferRef.current.every(val => val === 1)
        ? 1
        : detectionBufferRef.current.some(val => val === 2)
        ? 2
        : 1; // Default to single face if mixed but no multiple faces

      setSmoothedDetection(smoothedType);
      setFaceDetectionError(null); // Clear error if detection is valid

      if (roomId) joinRoom(roomId);
    } catch (error) {
      setFaceDetectionError('Face detection failed. Please check your camera.');
      console.log('Face detection error:', error);
    }
  };

  useEffect(() => {
    if (!detectionBufferRef.current) detectionBufferRef.current = [];
    setNoFaceTimer(0); // Reset for compatibility
    setMultiFaceTimer(0); // Reset for compatibility
  }, [smoothedDetection]);

  useEffect(() => {
    if (cameraActive && videoRef.current) {
      detectionBufferRef.current = []; // Reset buffer on camera start
      faceDetectionInterval.current = setInterval(() => {
        if (videoRef.current) detectFaces(videoRef.current);
        if (smoothedDetection === 0) {
          logEvent('security_violation', { violationType: 'no_face' });
          incrementViolation();
        } else if (smoothedDetection === 2) {
          // Error is already set in detectFaces
        }
      }, 300); // Faster interval for quicker detection
      return () => {
        if (faceDetectionInterval.current) clearInterval(faceDetectionInterval.current);
      };
    }
  }, [cameraActive, isModelLoaded, smoothedDetection]);

  useEffect(() => {
    const reinitializeCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setCameraActive(true);
          setCameraError(null);
        }
      } catch (err: any) {
        setCameraError("Unable to access camera/microphone. Please check your permissions.");
      }
    };
  
    if (resumeMode) {
      reinitializeCamera();
    }
  }, [resumeMode]);
  

  const initializeCamera = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { min: 640, ideal: 1280 }, height: { min: 480, ideal: 720 }, facingMode: 'user', frameRate: { ideal: 30 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().then(resolve).catch((err) => {
                console.error('Video play error:', err);
                resolve();
              });
            };
          } else {
            resolve();
          }
        });
        setCameraActive(true);
        setCameraError(null);
        if (roomId) joinRoom(roomId);
        startFrameStreaming();
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
      if (roomId) joinRoom(roomId);
    }, 100);
  };

  const stopCamera = (): void => {
    if (videoRef.current && videoRef.current.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      setCameraActive(false);
    }
    if (faceDetectionInterval.current) clearInterval(faceDetectionInterval.current);
    if (frameInterval.current) clearInterval(frameInterval.current);
    leaveRoom();
  };

  const logEvent = (eventType: string, details: any) => {
    const filteredDetails = { ...details };
    delete filteredDetails.section;
    delete filteredDetails.answers;
    const logEntry = {
      eventType,
      details: filteredDetails,
      timestamp: new Date().toISOString(),
    };
    setLogBuffer((prev) => [...prev, logEntry]);
  };

  const incrementViolation = () => {
    setViolationCount((prev) => {
      const newCount = prev + 1;
      localStorage.setItem("violationCount", newCount.toString());
      return newCount;
    });
  };
  

  const submitAllLogs = async () => {
    if (isSubmitting || hasSubmitted) return;

    const summary = aggregateLogs(logBuffer);
    console.log('Submitting summarized logs:', JSON.stringify(summary, null, 2));

    try {
      const response = await axios.post('https://examiner.ciu.ac.ug/api/exams/exam_logs', {
        studentRegNo: examData.studentRegNo,
        examNo: examData.examNo,
        courseId: examData.courseId,
        submissionTime: new Date().toISOString(),
        logEntries: logBuffer.map(entry => ({
          eventType: entry.eventType,
          details: {
            violationType: entry.details.violationType,
            remainingTime: entry.details.remainingTime,
            timestamp: entry.timestamp,
          },
        })),
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      });

      if (response.status === 201) {
        setSubmissionStatus('Exam submitted successfully');
        setLogBuffer([]);
      } else {
        throw new Error(`Unexpected status: ${response.status}`);
      }
    } catch (error) {
      console.error('Log submission error:', error);
      setSubmissionStatus('Failed to submit logs. Please contact support.');
    } finally {
      setIsSubmitting(false);
    }
  };



const questionStartRegex = /^\s*(?:[*\-]?\s*)?(?:(?:Question|Qn|Q|No)[\.:)]?\s*)?(\d+[a-z]|\d+[ivxlcdm]+|\d+|[ivxlcdm]+|[a-z])(?:[\)\.\:\,\-\s→]\s*)(?!\d+[a-z](?:\s|$))(.+)$/i;

const parseQuestionsFromContent = (content: string) => {
  content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  const lines = content.split('\n').map(line => line.trimEnd());

  const questions = [];
  let currentQuestion = { questionNumber: '', answer: '' };

  for (const line of lines) {
    const match = line.match(questionStartRegex);

    if (match) {
      console.log("Matched question number:", match[1]);
      console.log("Matched answer start:", match[2]?.slice(0, 30));

      
      if (currentQuestion.questionNumber) {
        questions.push({ ...currentQuestion });
      }

      // Extract and clean question number and answer text
      const rawNum = match[1]?.trim().replace(/[).:\-→]*$/, '');
      const rawAnswer = match[2]?.trim() || '';
      const cleanedAnswer = rawAnswer.replace(/^[\s\)\-:.,→•*]+/, '');

      currentQuestion = {
        questionNumber: rawNum ? `${rawNum})` : '',
        answer: cleanedAnswer,
      };
    } else {
      console.log("No match for line:", line);

      
      if (currentQuestion.questionNumber) {
        currentQuestion.answer += '\n' + line;
      }
    }
  }

  
  if (currentQuestion.questionNumber) {
    questions.push({ ...currentQuestion });
  }

  console.log("Parsed questions:", questions);
  return questions;
};

  
  
  const submitExam = async (submissionType: string = 'manual'): Promise<void> => {
    if (isSubmitting || hasSubmitted) {
      console.log('Submission already in progress or completed, ignoring duplicate submission attempt');
      return;
    }

    console.log('=== STARTING EXAM SUBMISSION ===');
    setIsSubmitting(true);
    setIsTimerRunning(false);
    stopCamera();
    setSubmissionStatus('Submitting your exam...');

    const currentAnswers = [...answers];
    const localStorageAnswers = Object.keys(localStorage)
      .filter((key) => key.startsWith('answer_'))
      .map((key) => ({
        section: key.replace('answer_', ''),
        content: localStorage.getItem(key) || '',
      }))
      .filter((ans) => ans.section && ans.content.trim());

    const mergedAnswers = [...currentAnswers];
    localStorageAnswers.forEach(localAnswer => {
      const existingIndex = mergedAnswers.findIndex(ans => ans.section === localAnswer.section);
      if (existingIndex >= 0) {
        mergedAnswers[existingIndex] = localAnswer;
      } else {
        mergedAnswers.push(localAnswer);
      }
    });

    const validAnswers = mergedAnswers.filter((ans) => ans.section && ans.content.trim());
    console.log('Valid answers found:', validAnswers.length);
    console.log('Valid answers:', validAnswers);

    const finalAnswers = validAnswers.length === 0 && submissionType === 'auto-submit'
      ? []
      : validAnswers.map(({ section, content }) => ({
          section,
          questions: parseQuestionsFromContent(content),

        }));

    
        

    const submissionData = {
      studentRegNo: examData.studentRegNo,
      examNo: examData.examNo,
      examName: examData.examName,
      courseId: examData.courseId,
      answers: finalAnswers,
      submissionTime: new Date().toISOString(),
      submissionType: submissionType,
    };

    console.log('Submission data prepared:', JSON.stringify(submissionData, null, 2));

    const submitURL = 'https://examiner.ciu.ac.ug/api/exams/submit_exam';
    console.log('Submitting to URL:', submitURL);

    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      attempt++;
      console.log(`=== SUBMISSION ATTEMPT ${attempt} of ${maxAttempts} ===`);

      try {
        const response = await axios.post(submitURL, submissionData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        });

        console.log('Response received:', response.status, response.data);

        if (response.status === 200) {
          setSubmissionStatus('Exam submitted successfully');
          setHasSubmitted(true);
          setIsSubmitting(false);
          setAnswers([]);

          localStorage.removeItem("resumeMode");

          Object.keys(localStorage)
            .filter((key) => key.startsWith('answer_'))
            .forEach((key) => {
              console.log('Removing from localStorage:', key);
              localStorage.removeItem(key);
            });


      await submitAllLogs();
          setTimeout(() => {
            console.log('Navigating to exam-complete page...');
            navigate('/');
          }, 2000);
          return;
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (err: any) {
        console.error(`=== ATTEMPT ${attempt} FAILED ===`, err);
        if (err.response) {
          console.error('Response status:', err.response.status, err.response.data);
          if (err.response.status === 400 && err.response.data.error === 'Submission already exists for this exam and student') {
            setSubmissionStatus('Exam already submitted');
            setHasSubmitted(true);
            setIsSubmitting(false);

            localStorage.removeItem("resumeMode");

            await submitAllLogs();
            setTimeout(() => navigate('/'), 2000);
            return;
          } else {
            setSubmissionStatus(`Failed to submit exam. ${attempt < maxAttempts ? 'Retrying...' : 'Please try again or contact support.'}`);
          }
        } else if (err.request) {
          console.error('No response received');
          setSubmissionStatus(`Network error. ${attempt < maxAttempts ? 'Retrying...' : 'Please check your connection and try again.'}`);
        } else {
          console.error('Request setup error:', err.message);
          setSubmissionStatus(`Submission error. ${attempt < maxAttempts ? 'Retrying...' : 'Please contact support.'}`);
        }

        if (attempt === maxAttempts) {
          console.error('=== ALL ATTEMPTS FAILED ===');
          setSubmissionStatus('Failed to submit exam. Please contact support.');
          setIsSubmitting(false);
          return;
        }
        const delayMs = 1000 * attempt;
        console.log(`Waiting ${delayMs}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('Key pressed:', e.key);
      if (e.key === 'Escape' && !isSubmitting && !hasSubmitted) {
        console.log('Escape key detected, initiating auto-submit');
        e.preventDefault();
        submitExam('auto-submit');
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isSubmitting, hasSubmitted, examData, answers]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      console.log('Fullscreen change detected, fullscreenElement:', document.fullscreenElement);
      if (!document.fullscreenElement && !isSubmitting && !hasSubmitted) {
        console.log('Fullscreen exited, initiating auto-submit');
        submitExam('auto-submit');
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isSubmitting, hasSubmitted, examData, answers]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log('Window/tab about to close, initiating auto-submit');
      if (!isSubmitting && !hasSubmitted) {
        submitExam('auto-submit');
      }
      e.returnValue = '';
      return '';
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitting, hasSubmitted, examData, answers]);

  const renderCameraContainer = (): JSX.Element => (
    <div className="fixed bottom-5 right-5 w-[250px] bg-white border border-gray-200 rounded-lg p-4 shadow-lg z-[1000]">
      <h4 className="mb-2 text-sm font-semibold text-gray-800">Proctoring Camera</h4>
      <div className="relative">
        <video ref={videoRef} autoPlay playsInline muted className="w-full rounded bg-black" />
        <div className="absolute left-2 bottom-2 text-sm">
          {!isModelLoaded ? (
            <div className="text-teal-600 italic">⌛ Loading face detection...</div>
          ) : faceDetectionError ? (
            <div className="text-red-500 font-medium">⚠️ {faceDetectionError}</div>
          ) : smoothedDetection === 0 ? (
            <div className="text-red-500 font-medium">⚠️ No Face Detected</div>
          ) : smoothedDetection === 1 ? (
            <div className="text-green-600 font-medium">✓ Face Detected</div>
          ) : (
            <div className="text-red-500 font-medium">⚠️ Multiple Faces Detected</div>
          )}
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (!document.fullscreenElement && !isSubmitting && !hasSubmitted) {
      logEvent('security_violation', { violationType: 'fullscreen_exit' });
      incrementViolation();

    }
  }, [document.fullscreenElement, isSubmitting, hasSubmitted]);

  useEffect(() => {
    if (isTimerRunning && timer.seconds === 0) {
      const remainingTime = `${String(timer.hours).padStart(2, '0')}:${String(timer.minutes).padStart(2, '0')}:${String(timer.seconds).padStart(2, '0')}`;
      logEvent('timer_update', { remainingTime });
      incrementViolation();

    }
  }, [timer, isTimerRunning]);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>, section: string) => {
    const newAnswer = e.target.value;
    setAnswers((prev) => {
      const updatedAnswers = prev.filter((ans) => ans.section !== section);
      if (newAnswer.trim()) {
        updatedAnswers.push({ section, content: newAnswer });
      }
      localStorage.setItem(`answer_${section}`, newAnswer);
      logEvent('answer_update', {});
      incrementViolation();

      return updatedAnswers;
    });
    if (submissionStatus) setSubmissionStatus(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'v')) {
      e.preventDefault();
      alert('Copy and paste are disabled during the exam.');
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
  };

  const switchSection = (section: string) => {
    setCurrentSection(section);
    if (submissionStatus) setSubmissionStatus(null);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl font-semibold text-teal-800">Loading Exam... Please wait.</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100 font-sans" tabIndex={0}>
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shadow">
        <div className="flex items-center gap-3">
          <img
            src="../public/CIU-exam-system-logo.png"
            alt="System Logo"
            className="h-12 w-auto"
          />
        </div>
        <div className="text-sm font-bold bg-teal-800 text-white px-4 py-1 rounded">
          Time Remaining: {String(timer.hours).padStart(2, '0')}:{String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto">
          {renderCameraContainer()}
          <div className="grid grid-cols-2 gap-4 h-full">
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
            <div className="flex">
              <div className="bg-white p-4 rounded-lg shadow flex-1">
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
                  onKeyDown={handleKeyDown}
                  onContextMenu={handleContextMenu}
                  className="w-full h-[calc(100vh-300px)] p-2 border rounded resize-none"
                  placeholder={`Example:\n1) [Your descriptive answer here]\n1) a: [Your objective answer here]\n2) b: [Your objective answer here]`}
                  disabled={isSubmitting || hasSubmitted}
                />
              </div>
              <div className="w-48 bg-white border-l border-gray-200 shadow-lg overflow-y-auto ml-4">
                <div className="p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Sections</h4>
                  <div className="space-y-2">
                    {isSectioned && sections.map((section) => (
                      <button
                        key={section}
                        className={`w-full py-1 text-sm rounded ${currentSection === section ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
                        onClick={() => switchSection(section)}
                        disabled={!isSectioned || isSubmitting || hasSubmitted}
                      >
                        Click here to answer Section {section} {answers.find((ans) => ans.section === section)?.content ? '✓' : ''}
                      </button>
                    ))}
                    <button
                      className={`w-full py-1 text-sm rounded ${currentSection === 'nonSectioned' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
                      onClick={() => switchSection('nonSectioned')}
                      disabled={isSubmitting || hasSubmitted}
                    >
                      Click here to answer exams without sections {answers.find((ans) => ans.section === 'nonSectioned')?.content ? '✓' : ''}
                    </button>
                  </div>
                  <button
                    className={`mt-4 w-full py-2 rounded-lg font-semibold ${
                      isSubmitting || hasSubmitted
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                    onClick={() => submitExam('manual')}
                    disabled={isSubmitting || hasSubmitted}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                  </button>
                  {submissionStatus && (
                    <div className={`mt-2 text-sm ${submissionStatus.includes('successfully') || submissionStatus.includes('already submitted') ? 'text-green-600' : 'text-red-500'}`}>
                      {submissionStatus}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;