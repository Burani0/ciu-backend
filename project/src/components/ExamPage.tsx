// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import styles from './Exam.module.css';
// import * as faceapi from 'face-api.js';
// import { emitStream, joinRoom, leaveRoom } from '../config/socket';

// export type Timer = { hours: number; minutes: number; seconds: number };
// export type SecurityChecks = {
//   fullscreen: boolean;
//   safeBrowser: boolean;
//   noScreenCapture: boolean;
//   noCopyPaste: boolean;
//   noDevTools: boolean;
//   noPrintScreen: boolean;
//   noMultipleWindows: boolean;
// };
// export type Violation = { type: string; timestamp: string };
// export type Answer = { section: string; content: string };

// const ExamPage: React.FC = () => {
//   const [timer, setTimer] = useState<Timer>({ hours: 3, minutes: 0, seconds: 0 });
//   const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
//   const [cameraActive, setCameraActive] = useState<boolean>(false);
//   const [cameraError, setCameraError] = useState<string | null>(null);
//   const [faceDetectionError, setFaceDetectionError] = useState<string | null>(null);
//   const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
//   const [smoothedDetection, setSmoothedDetection] = useState<0 | 1 | 2>(1);
//   const [noFaceTimer, setNoFaceTimer] = useState(0);
//   const [multiFaceTimer, setMultiFaceTimer] = useState(0);
//   const [examData, setExamData] = useState({
//     examLink: '',
//     examNo: '',
//     examName: '',
//     courseId: '',
//     studentRegNo: '',
//   });
//   const [answers, setAnswers] = useState<Answer[]>([]);
//   const [currentSection, setCurrentSection] = useState<string>('A');
//   const [sections, setSections] = useState<string[]>(['A', 'B', 'C']);
//   const [isSectioned, setIsSectioned] = useState<boolean>(true);
//   const [pdfUrl, setPdfUrl] = useState<string | null>(null);
//   const [pdfError, setPdfError] = useState<string | null>(null);
//   const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [debugInfo, setDebugInfo] = useState<string>('');

//   const videoRef = useRef<HTMLVideoElement>(null);
//   const faceDetectionInterval = useRef<NodeJS.Timeout | null>(null);
//   const frameInterval = useRef<NodeJS.Timeout | null>(null);
//   const detectionBufferRef = useRef<number[]>([]);
//   const navigate = useNavigate();
//   const { roomId } = useParams<{ roomId: string }>();

//   useEffect(() => {
//     const fetchExamData = async () => {
//       const examNo = localStorage.getItem('currentExamNo') || roomId || '';
//       if (!examNo) {
//         setPdfError('No exam number provided.');
//         setIsLoading(false);
//         console.error('Error: No exam number available');
//         return;
//       }

//       const examLink = `https://eadmin.ciu.ac.ug/API/doc_verification.aspx?doc=Exam&ExamNo=${examNo}`;
//       console.log('Fetching exam data from:', examLink);

//       try {
//         const pdfResponse = await axios.get(examLink, {
//           responseType: 'blob',
//           withCredentials: true,
//         });
//         const url = window.URL.createObjectURL(new Blob([pdfResponse.data], { type: 'application/pdf' }));
//         setPdfUrl(url);
//         setPdfError(null);

//         const sectionResponse = { hasSections: true, sections: ['A', 'B', 'C'] }; // Mock, replace with actual API
//         setIsSectioned(sectionResponse.hasSections);
//         setSections(sectionResponse.hasSections ? sectionResponse.sections : []);
//         if (!sectionResponse.hasSections) {
//           setCurrentSection('nonSectioned');
//         }

//         const examLinkData = localStorage.getItem('currentExamFullLink') || '';
//         const examName = localStorage.getItem('currentExamName') || '';
//         const courseId = localStorage.getItem('currentExamID') || '';
//         const studentRegNo = localStorage.getItem('studentRegNo') || '';
//         setExamData({ examLink: examLinkData, examNo, examName, courseId, studentRegNo });

//         const savedAnswers = Object.keys(localStorage)
//           .filter((key) => key.startsWith('answer_'))
//           .map((key) => ({
//             section: key.replace('answer_', ''),
//             content: localStorage.getItem(key) || '',
//           }))
//           .filter((ans) => ans.section && ans.content.trim());
//         setAnswers(savedAnswers);

//         setIsTimerRunning(true);
//         initializeCamera();
//       } catch (err) {
//         console.error('Error fetching exam data:', err);
//         setPdfError('Failed to load exam data. Check console for details.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchExamData();
//   }, [roomId]);

//   useEffect(() => {
//     if (!isTimerRunning) return;
//     const interval = setInterval(() => {
//       setTimer((prev) => {
//         let { hours, minutes, seconds } = prev;
//         seconds--;
//         if (seconds < 0) {
//           seconds = 59;
//           minutes--;
//           if (minutes < 0) {
//             minutes = 59;
//             hours--;
//             if (hours < 0) {
//               submitExam();
//               return prev;
//             }
//           }
//         }
//         return { hours, minutes, seconds };
//       });
//     }, 1000);
//     return () => clearInterval(interval);
//   }, [isTimerRunning]);

//   useEffect(() => {
//     const loadModels = async (): Promise<void> => {
//       try {
//         await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
//         setIsModelLoaded(true);
//         console.log('Face detection models loaded successfully');
//       } catch (error) {
//         setFaceDetectionError('Face detection model failed to load.');
//         console.log('Face detection model load error:', error);
//       }
//     };
//     loadModels();
//   }, []);

//   const DETECTION_BUFFER_SIZE = 6;
//   const NO_FACE_WARNING_SECONDS = 3;
//   const MULTIPLE_FACE_WARNING_SECONDS = 2;

//   const detectFaces = async (video: HTMLVideoElement): Promise<void> => {
//     if (!video || !isModelLoaded) return;
//     try {
//       const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 }));
//       let detectionType: 0 | 1 | 2 = detections.length === 1 ? 1 : detections.length > 1 ? 2 : 0;
//       detectionBufferRef.current.push(detectionType);
//       if (detectionBufferRef.current.length > DETECTION_BUFFER_SIZE) detectionBufferRef.current.shift();
//       const smoothedType = detectionBufferRef.current.reduce((acc, val) => acc + val, 0) >= DETECTION_BUFFER_SIZE ? 2 : detectionType;
//       setSmoothedDetection(smoothedType);
//       if (roomId) joinRoom(roomId);
//     } catch (error) {
//       setFaceDetectionError('Face detection failed. Please check your camera.');
//       console.log('Face detection error:', error);
//     }
//   };

//   useEffect(() => {
//     if (!detectionBufferRef.current) detectionBufferRef.current = [];
//     let noFaceInt: NodeJS.Timeout | undefined;
//     let multiFaceInt: NodeJS.Timeout | undefined;
//     if (smoothedDetection === 0) noFaceInt = setInterval(() => setNoFaceTimer((t) => t + 1), 1000);
//     else setNoFaceTimer(0);
//     const multiFaceBufferStable = detectionBufferRef.current.length === DETECTION_BUFFER_SIZE && detectionBufferRef.current.every((v) => v === 2);
//     if (multiFaceBufferStable) multiFaceInt = setInterval(() => setMultiFaceTimer((t) => t + 1), 1000);
//     else setMultiFaceTimer(0);
//     return () => { if (noFaceInt) clearInterval(noFaceInt); if (multiFaceInt) clearInterval(multiFaceInt); };
//   }, [smoothedDetection]);

//   const showNoFaceWarning = smoothedDetection === 0 && noFaceTimer >= NO_FACE_WARNING_SECONDS;
//   const showMultiFaceWarning = detectionBufferRef.current.length === DETECTION_BUFFER_SIZE && detectionBufferRef.current.every((v) => v === 2) && multiFaceTimer >= MULTIPLE_FACE_WARNING_SECONDS;
//   const showFaceDetected = smoothedDetection === 1;

//   const initializeCamera = async (): Promise<void> => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: { width: { min: 640, ideal: 1280 }, height: { min: 480, ideal: 720 }, facingMode: 'user', frameRate: { ideal: 30 } } });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         await new Promise((resolve) => { if (videoRef.current) videoRef.current.onloadedmetadata = () => videoRef.current?.play().then(resolve); });
//         setCameraActive(true);
//         setCameraError(null);
//         if (roomId) joinRoom(roomId);
//         startFrameStreaming();
//       }
//     } catch (err) {
//       setCameraError('Camera access denied or not available');
//       console.log('Camera initialization error:', err);
//     }
//   };

//   const startFrameStreaming = () => {
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     frameInterval.current = setInterval(() => {
//       if (videoRef.current && ctx) {
//         canvas.width = videoRef.current.videoWidth;
//         canvas.height = videoRef.current.videoHeight;
//         ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
//         const frame = canvas.toDataURL('image/jpeg');
//         emitStream(frame);
//       }
//       if (roomId) joinRoom(roomId);
//     }, 100);
//   };

//   const stopCamera = (): void => {
//     if (videoRef.current && videoRef.current.srcObject) {
//       (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
//       setCameraActive(false);
//     }
//     if (faceDetectionInterval.current) clearInterval(faceDetectionInterval.current);
//     if (frameInterval.current) clearInterval(frameInterval.current);
//     leaveRoom();
//   };

//   const submitExam = async (): Promise<void> => {
//     if (isSubmitting) {
//       console.log('Submission already in progress, ignoring duplicate submission attempt');
//       return;
//     }

//     console.log('=== STARTING EXAM SUBMISSION ===');
//     setIsSubmitting(true);
//     setIsTimerRunning(false);
//     stopCamera();
//     setSubmissionStatus('Submitting...');
//     setDebugInfo('');

//     // Get current answers from state AND localStorage to ensure we capture any unsaved changes
//     const currentAnswers = [...answers];
    
//     // Also check localStorage for any additional answers that might not be in state
//     const localStorageAnswers = Object.keys(localStorage)
//       .filter((key) => key.startsWith('answer_'))
//       .map((key) => ({
//         section: key.replace('answer_', ''),
//         content: localStorage.getItem(key) || '',
//       }))
//       .filter((ans) => ans.section && ans.content.trim());

//     // Merge state answers with localStorage answers (localStorage takes precedence)
//     const mergedAnswers = [...currentAnswers];
//     localStorageAnswers.forEach(localAnswer => {
//       const existingIndex = mergedAnswers.findIndex(ans => ans.section === localAnswer.section);
//       if (existingIndex >= 0) {
//         mergedAnswers[existingIndex] = localAnswer; // Update with localStorage version
//       } else {
//         mergedAnswers.push(localAnswer); // Add new answer from localStorage
//       }
//     });

//     const validAnswers = mergedAnswers.filter((ans) => ans.section && ans.content.trim());
//     console.log('Valid answers found:', validAnswers.length);
//     console.log('Valid answers:', validAnswers);

//     // Modified: Allow submission even if no answers (auto-submit scenario)
//     const submissionData = {
//       studentRegNo: examData.studentRegNo,
//       examNo: examData.examNo,
//       examName: examData.examName,
//       courseId: examData.courseId,
//       answers: validAnswers.map(({ section, content }) => ({ section, answer: content.trim() })),
//       submissionTime: new Date().toISOString(),
//       submissionType: validAnswers.length === 0 ? 'auto-submit' : 'manual', // Track submission type
//     };

//     console.log('Submission data prepared:', JSON.stringify(submissionData, null, 2));

//     const submitURL = 'http://localhost:3001/api/exams/submit_exam';
//     console.log('Submitting to URL:', submitURL);

//     let attempt = 0;
//     const maxAttempts = 3;

//     while (attempt < maxAttempts) {
//       attempt++;
//       console.log(`=== SUBMISSION ATTEMPT ${attempt} of ${maxAttempts} ===`);
      
//       try {
//         console.log('Making axios request...');
        
//         const response = await axios.post(submitURL, submissionData, {
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           timeout: 30000,
//         });

//         setDebugInfo(`Response: ${JSON.stringify(response.data, null, 2)}`);

//         console.log('Response received:');
//         console.log('Status:', response.status);
//         console.log('Headers:', response.headers);
//         console.log('Data:', response.data);

//         if (response.status === 200) {
//           setSubmissionStatus(response.data.message || 'Exam submitted successfully!');
//           setIsSubmitting(false);
//           setDebugInfo('');
          
//           // Clean up localStorage
//           Object.keys(localStorage)
//             .filter((key) => key.startsWith('answer_'))
//             .forEach((key) => {
//               console.log('Removing from localStorage:', key);
//               localStorage.removeItem(key);
//             });
            
//           setTimeout(() => {
//             console.log('Navigating to exam-complete page...');
//             navigate('/exam-complete');
//           }, 2000);
//           return;
//         } else {
//           throw new Error(`Unexpected response status: ${response.status}`);
//         }
//       } catch (err: any) {
//         setDebugInfo(`Error: ${err.message}\n${err.response ? JSON.stringify(err.response.data, null, 2) : ''}`);
//         console.error(`=== ATTEMPT ${attempt} FAILED ===`);
//         console.error('Error type:', err.constructor.name);
//         console.error('Error message:', err.message);
        
//         if (err.response) {
//           console.error('Response status:', err.response.status);
//           console.error('Response headers:', err.response.headers);
//           console.error('Response data:', err.response.data);
//           setSubmissionStatus(`Server error (${err.response.status}): ${err.response.data?.error || err.response.data?.message || 'Unknown server error'}`);
//         } else if (err.request) {
//           console.error('No response received');
//           console.error('Request details:', err.request);
//           setSubmissionStatus(`Network error: No response from server. Attempt ${attempt} of ${maxAttempts}`);
//         } else {
//           console.error('Request setup error:', err.message);
//           setSubmissionStatus(`Configuration error: ${err.message}`);
//         }
        
//         if (attempt === maxAttempts) {
//           console.error('=== ALL ATTEMPTS FAILED ===');
//           setSubmissionStatus(`Failed after ${maxAttempts} attempts. Please contact support.`);
//           setIsSubmitting(false);
//           return;
//         }
//         const delayMs = 1000 * attempt;
//         console.log(`Waiting ${delayMs}ms before retry...`);
//         await new Promise((resolve) => setTimeout(resolve, delayMs));
//       }
//     }
//   };

//   // Handle Escape key press to auto-submit exam
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       console.log('Key pressed:', e.key); // Debug log
//       if (e.key === 'Escape' && !isSubmitting) {
//         console.log('Escape key detected, initiating auto-submit');
//         e.preventDefault(); // Prevent default browser behavior (e.g., exiting fullscreen)
//         submitExam();
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown, { capture: true }); // Use capture phase
//     return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
//   }, [isSubmitting, examData, answers]); // Include necessary dependencies

//   // Handle fullscreen exit attempt
//   useEffect(() => {
//     const handleFullscreenChange = () => {
//       console.log('Fullscreen change detected, fullscreenElement:', document.fullscreenElement); // Debug log
//       if (!document.fullscreenElement && !isSubmitting) {
//         console.log('Fullscreen exited, initiating auto-submit');
//         submitExam();
//       }
//     };
//     document.addEventListener('fullscreenchange', handleFullscreenChange);
//     return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
//   }, [isSubmitting, examData, answers]); // Include necessary dependencies

//   // Handle tab/window close attempt
//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       console.log('Window/tab about to close, initiating auto-submit');
//       // Note: submitExam is async but beforeunload handlers should be synchronous
//       // We'll attempt to submit but can't guarantee completion
//       submitExam();
      
//       // Standard way to show confirmation dialog
//       e.preventDefault();
//       e.returnValue = '';
//       return '';
//     };
    
//     window.addEventListener('beforeunload', handleBeforeUnload);
//     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
//   }, [examData, answers]); // Include necessary dependencies

//   const renderCameraContainer = (): JSX.Element => (
//     <div className="fixed top-5 right-5 w-[250px] bg-white border border-gray-200 rounded-lg p-4 shadow-lg z-[1000]">
//       <h4 className="mb-2 text-sm font-semibold text-gray-800">Proctoring Camera</h4>
//       <div className="relative">
//         <video ref={videoRef} autoPlay playsInline muted className="w-full rounded bg-black" />
//         <div className="absolute left-2 bottom-2 text-sm">
//           {!isModelLoaded ? (
//             <div className="text-teal-600 italic">⌛ Loading face detection...</div>
//           ) : faceDetectionError ? (
//             <div className="text-red-500 font-medium">⚠️ {faceDetectionError}</div>
//           ) : showNoFaceWarning ? (
//             <div className="text-red-500 font-medium">⚠️ No Face Detected for {noFaceTimer}s</div>
//           ) : showMultiFaceWarning ? (
//             <div className="text-red-500 font-medium">⚠️ Multiple Faces Detected for {multiFaceTimer}s</div>
//           ) : showFaceDetected ? (
//             <div className="text-green-600 font-medium">✓ Face Detected</div>
//           ) : (
//             <div className="text-red-500 font-medium">⚠️ Detecting...</div>
//           )}
//         </div>
//       </div>
//     </div>
//   );

//   useEffect(() => {
//     if (cameraActive && videoRef.current) {
//       faceDetectionInterval.current = setInterval(() => {
//         if (videoRef.current) detectFaces(videoRef.current);
//       }, 500);
//     }
//     return () => { if (faceDetectionInterval.current) clearInterval(faceDetectionInterval.current); };
//   }, [cameraActive, isModelLoaded]);

//   const handleAnswerChange = (e: React.ChangeEvent<HTMLTextAreaElement>, section: string) => {
//     const newAnswer = e.target.value;
//     setAnswers((prev) => {
//       const updatedAnswers = prev.filter((ans) => ans.section !== section);
//       if (newAnswer.trim()) {
//         updatedAnswers.push({ section, content: newAnswer });
//       }
//       localStorage.setItem(`answer_${section}`, newAnswer);
//       return updatedAnswers;
//     });
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
//     // Prevent Ctrl+C and Ctrl+V
//     if (e.ctrlKey && (e.key === 'c' || e.key === 'v')) {
//       e.preventDefault();
//       alert('Copy and paste are disabled during the exam.');
//     }
//   };

//   const handleContextMenu = (e: React.MouseEvent<HTMLTextAreaElement>) => {
//     // Prevent right-click context menu
//     e.preventDefault();
//   };

//   const switchSection = (section: string) => {
//     setCurrentSection(section);
//   };

//   if (isLoading) {
//     return (
//       <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
//         <div className="text-xl font-semibold text-teal-800">Loading Exam... Please wait.</div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen w-screen flex flex-col bg-gray-100 font-sans" tabIndex={0}>
//       <div className="flex justify-between items-center px-6 py-3 bg-teal-800 text-white shadow">
//         <div className="text-lg font-semibold">
//           Clarke International University
//         </div>
//         <div className="text-sm font-bold bg-white/20 px-4 py-1 rounded">
//           Time Remaining: {String(timer.hours).padStart(2, '0')}:{String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
//         </div>
//       </div>
//       <div className="flex flex-1 overflow-hidden">
//         <div className="flex-1 p-6 overflow-y-auto">
//           {renderCameraContainer()}
//           <div className="grid grid-cols-2 gap-4 h-full">
//             <div className="bg-white p-4 rounded-lg shadow">
//               <h4 className="font-semibold text-gray-800 mb-2">Exam PDF</h4>
//               <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
//                 {pdfError ? (
//                   <div className="text-red-500">{pdfError}</div>
//                 ) : pdfUrl ? (
//                   <object data={pdfUrl} type="application/pdf" width="100%" height="600px" style={{ border: 'none' }}>
//                     <p>PDF not supported. <a href={pdfUrl}>Download instead</a>.</p>
//                   </object>
//                 ) : (
//                   <p>Loading...</p>
//                 )}
//               </div>
//             </div>
//             <div className="flex">
//               <div className="bg-white p-4 rounded-lg shadow flex-1">
//                 <h4 className="font-semibold text-gray-800 mb-2">Your Answer</h4>
//                 <div className="text-sm text-gray-700 mb-4">
//                   <div>Reg No: {examData.studentRegNo}</div>
//                   <div>Exam: {examData.examName}</div>
//                   <div>Course ID: {examData.courseId}</div>
//                   <div>Exam No: {examData.examNo}</div>
//                 </div>
//                 <div className="mb-2">
//                   <label className="text-sm font-medium text-gray-700">
//                     {currentSection === 'nonSectioned' ? 'Exam Answers' : `Answers for Section ${currentSection}`}
//                   </label>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Type your answers in the format: 1) [answer] for descriptive questions, or 1) a: [answer], 2) b: [answer], 10) c: [answer], etc., for objective questions, matching the exam PDF.
//                   </p>
//                 </div>
//                 <textarea
//                   value={answers.find((ans) => ans.section === currentSection)?.content || ''}
//                   onChange={(e) => {
//                     handleAnswerChange(e, currentSection);
//                     if (submissionStatus) setSubmissionStatus(null);
//                   }}
//                   onKeyDown={handleKeyDown}
//                   onContextMenu={handleContextMenu}
//                   className="w-full h-[calc(100vh-300px)] p-2 border rounded resize-none"
//                   placeholder={`Example:\n1) [Your descriptive answer here]\n1) a: [Your objective answer here]\n2) b: [Your objective answer here]`}
//                   disabled={isSubmitting}
//                 />
//               </div>
//               <div className="w-48 bg-white border-l border-gray-200 shadow-lg overflow-y-auto ml-4">
//                 <div className="p-4">
//                   <h4 className="font-semibold text-gray-800 mb-2">Sections</h4>
//                   <div className="space-y-2">
//                     {isSectioned && sections.map((section) => (
//                       <button
//                         key={section}
//                         className={`w-full py-1 text-sm rounded ${currentSection === section ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
//                         onClick={() => switchSection(section)}
//                         disabled={!isSectioned || isSubmitting}
//                       >
//                         Click here to answer Section {section} {answers.find((ans) => ans.section === section)?.content ? '✓' : ''}
//                       </button>
//                     ))}
//                     <button
//                       className={`w-full py-1 text-sm rounded ${currentSection === 'nonSectioned' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
//                       onClick={() => switchSection('nonSectioned')}
//                       disabled={isSubmitting}
//                     >
//                       Click here to answer exams without sections {answers.find((ans) => ans.section === 'nonSectioned')?.content ? '✓' : ''}
//                     </button>
//                   </div>
//                   <button 
//                     className={`mt-4 w-full py-2 rounded-lg font-semibold ${
//                       isSubmitting 
//                         ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
//                         : 'bg-teal-600 text-white hover:bg-teal-700'
//                     }`} 
//                     onClick={submitExam}
//                     disabled={isSubmitting}
//                   >
//                     {isSubmitting ? 'Submitting...' : 'Submit Exam'}
//                   </button>
//                   {submissionStatus && (
//                     <div className={`mt-2 text-sm ${submissionStatus.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
//                       {submissionStatus}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExamPage;




















import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import * as faceapi from 'face-api.js';
import { emitStream, joinRoom, leaveRoom } from '../config/socket';
import SuccessPopup from './SuccessPopup';

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
  const [timer, setTimer] = useState<Timer>({ hours: 0, minutes: 0, seconds: 0 });
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [faceDetectionError, setFaceDetectionError] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState<boolean>(false);
  const [smoothedDetection, setSmoothedDetection] = useState<0 | 1 | 2>(1);
  const [noFaceTimer, setNoFaceTimer] = useState(0);
  const [multiFaceTimer, setMultiFaceTimer] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
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
  const [debugInfo, setDebugInfo] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const faceDetectionInterval = useRef<NodeJS.Timeout | null>(null);
  const frameInterval = useRef<NodeJS.Timeout | null>(null);
  const detectionBufferRef = useRef<number[]>([]);
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();

  // Initialize timer from localStorage's currentExamDuration
  useEffect(() => {
    const fetchExamData = async () => {
      const examNo = localStorage.getItem('currentExamNo') || roomId || '';
      if (!examNo) {
        setPdfError('No exam number provided.');
        setIsLoading(false);
        console.error('Error: No exam number available');
        return;
      }

     const examLink = `https://ciu-backend.onrender.com/api/exam-pdf?ExamNo=${examNo}`;

      console.log('Fetching exam data from:', examLink);

      try {
        const pdfResponse = await axios.get(examLink, {
          responseType: 'blob',
          // withCredentials: true,
        });
        const url = window.URL.createObjectURL(new Blob([pdfResponse.data], { type: 'application/pdf' }));
        setPdfUrl(url);
        setPdfError(null);

        const sectionResponse = { hasSections: true, sections: ['A', 'B', 'C'] }; // Mock, replace with actual API
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

        // Initialize timer from currentExamDuration
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
        setTimer({ hours, minutes, seconds: 0 });
        setIsTimerRunning(true);
        initializeCamera();
      } catch (err) {
        console.error('Error fetching exam data:', err);
        setPdfError('Failed to load exam data. Check console for details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamData();
  }, [roomId]);

  // Timer countdown logic
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
              // Auto-submit when timer reaches 00:00:00
              submitExam('auto-submit');
              return { hours: 0, minutes: 0, seconds: 0 };
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
      if (roomId) joinRoom(roomId);
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

  const submitExam = async (submissionType: string = 'manual'): Promise<void> => {
    if (isSubmitting) {
      console.log('Submission already in progress, ignoring duplicate submission attempt');
      return;
    }

    console.log('=== STARTING EXAM SUBMISSION ===');
    setIsSubmitting(true);
    setIsTimerRunning(false);
    stopCamera();
    setSubmissionStatus('Submitting...');
    setDebugInfo('');

    // Get current answers from state AND localStorage
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

    // For auto-submit with no answers, send empty array (handled by backend)
    const finalAnswers = validAnswers.length === 0 && submissionType === 'auto-submit' 
      ? [] // Send empty array, backend will handle it
      : validAnswers.map(({ section, content }) => ({ section, answer: content.trim() }));

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
    
    const submitURL = 'https://ciu-backend.onrender.com/api/exams/submit_exam';
    console.log('Submitting to URL:', submitURL);

    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      attempt++;
      console.log(`=== SUBMISSION ATTEMPT ${attempt} of ${maxAttempts} ===`);
      
      try {
        console.log('Making axios request...');
        
        const response = await axios.post(submitURL, submissionData, {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 30000,
        });

        setDebugInfo(`Response: ${JSON.stringify(response.data, null, 2)}`);

        console.log('Response received:');
        console.log('Status:', response.status);
        console.log('Headers:', response.headers);
        console.log('Data:', response.data);

        if (response.status === 200) {
          setSubmissionStatus(response.data.message || 'Exam submitted successfully!');
          setIsSubmitting(false);
          setDebugInfo('');
          
          // Clean up localStorage
          Object.keys(localStorage)
            .filter((key) => key.startsWith('answer_'))
            .forEach((key) => {
              console.log('Removing from localStorage:', key);
              localStorage.removeItem(key);
            });
            
            setShowPopup(true);
    return;
  } else {
    throw new Error(`Unexpected response status: ${response.status}`);
  }
      } catch (err: any) {
        setDebugInfo(`Error: ${err.message}\n${err.response ? JSON.stringify(err.response.data, null, 2) : ''}`);
        console.error(`=== ATTEMPT ${attempt} FAILED ===`);
        console.error('Error type:', err.constructor.name);
        console.error('Error message:', err.message);
        
        if (err.response) {
          console.error('Response status:', err.response.status);
          console.error('Response headers:', err.response.headers);
          console.error('Response data:', err.response.data);
          setSubmissionStatus(`Server error (${err.response.status}): ${err.response.data?.error || err.response.data?.message || 'Unknown server error'}`);
        } else if (err.request) {
          console.error('No response received');
          console.error('Request details:', err.request);
          setSubmissionStatus(`Network error: No response from server. Attempt ${attempt} of ${maxAttempts}`);
        } else {
          console.error('Request setup error:', err.message);
          setSubmissionStatus(`Configuration error: ${err.message}`);
        }
        
        if (attempt === maxAttempts) {
          console.error('=== ALL ATTEMPTS FAILED ===');
          setSubmissionStatus(`Failed after ${maxAttempts} attempts. Please contact support.`);
          setIsSubmitting(false);
          return;
        }
        const delayMs = 1000 * attempt;
        console.log(`Waiting ${delayMs}ms before retry...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  };

  // Handle Escape key press to auto-submit exam
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log('Key pressed:', e.key); // Debug log
      if (e.key === 'Escape' && !isSubmitting) {
        console.log('Escape key detected, initiating auto-submit');
        e.preventDefault(); // Prevent default browser behavior (e.g., exiting fullscreen)
        submitExam('auto-submit'); // Pass auto-submit type
      }
    };
    window.addEventListener('keydown', handleKeyDown, { capture: true }); // Use capture phase
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [isSubmitting, examData, answers]);

  // Handle fullscreen exit attempt
  useEffect(() => {
    const handleFullscreenChange = () => {
      console.log('Fullscreen change detected, fullscreenElement:', document.fullscreenElement); // Debug log
      if (!document.fullscreenElement && !isSubmitting) {
        console.log('Fullscreen exited, initiating auto-submit');
        submitExam('auto-submit'); // Pass auto-submit type
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isSubmitting, examData, answers]);

  // Handle tab/window close attempt
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log('Window/tab about to close, initiating auto-submit');
      // Note: submitExam is async but beforeunload handlers should be synchronous
      // We'll attempt to submit but can't guarantee completion
      submitExam('auto-submit');
      
      // Standard way to show confirmation dialog
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [examData, answers]);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Prevent Ctrl+C and Ctrl+V
    if (e.ctrlKey && (e.key === 'c' || e.key === 'v')) {
      e.preventDefault();
      alert('Copy and paste are disabled during the exam.');
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    // Prevent right-click context menu
    e.preventDefault();
  };

  const switchSection = (section: string) => {
    setCurrentSection(section);
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
      <div className="flex items-center justify-center px-6 py-3 bg-teal-800 text-white shadow">
        <div className="text-lg font-semibold">
          Clarke International University
        </div>
        <div className="text-sm font-bold bg-white/20 px-4 py-1 rounded">
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
                  onChange={(e) => {
                    handleAnswerChange(e, currentSection);
                    if (submissionStatus) setSubmissionStatus(null);
                  }}
                  onKeyDown={handleKeyDown}
                  onContextMenu={handleContextMenu}
                  className="w-full h-[calc(100vh-300px)] p-2 border rounded resize-none"
                  placeholder={`Example:\n1) [Your descriptive answer here]\n1) a: [Your objective answer here]\n2) b: [Your objective answer here]`}
                  disabled={isSubmitting}
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
                        disabled={!isSectioned || isSubmitting}
                      >
                        Click here to answer Section {section} {answers.find((ans) => ans.section === section)?.content ? '✓' : ''}
                      </button>
                    ))}
                    <button
                      className={`w-full py-1 text-sm rounded ${currentSection === 'nonSectioned' ? 'bg-teal-600 text-white' : 'bg-gray-200'}`}
                      onClick={() => switchSection('nonSectioned')}
                      disabled={isSubmitting}
                    >
                      Click here to answer exams without sections {answers.find((ans) => ans.section === 'nonSectioned')?.content ? '✓' : ''}
                    </button>
                  </div>
                  <button 
                    className={`mt-4 w-full py-2 rounded-lg font-semibold ${
                      isSubmitting 
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                        : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`} 
                    onClick={() => submitExam('manual')}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                  </button>
                  
                  {submissionStatus && (
                    <div className={`mt-2 text-sm ${submissionStatus.includes('successfully') ? 'text-green-600' : 'text-red-500'}`}>
                      {submissionStatus}
                      
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <SuccessPopup show={showPopup} />

      </div>
      
    </div>
    
  );
};

export default ExamPage;