// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import * as faceapi from 'face-api.js';
// import { emitStream, joinRoom, leaveRoom } from '../config/socket';
// import styles from './Streamer.module.css';

// const Streamer = () => {
//   const [showInstructions, setShowInstructions] = useState(true);
//   const [currentSection, setCurrentSection] = useState('instructions');
//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [timer, setTimer] = useState({ hours: 3, minutes: 0, seconds: 0 });
//   const [isTimerRunning, setIsTimerRunning] = useState(false);
//   const [cameraActive, setCameraActive] = useState(false);
//   const [isModelLoaded, setIsModelLoaded] = useState(false);
//   const [faceDetected, setFaceDetected] = useState(false);
//   const [multipleFaces, setMultipleFaces] = useState(false);
//   const [violations, setViolations] = useState([]);
//   const [faceDetectionError, setFaceDetectionError] = useState(null);

//   const { roomId } = useParams();
//   const navigate = useNavigate();
//   const videoRef = useRef(null);
//   const faceDetectionInterval = useRef(null);
//   const frameInterval = useRef(null);

//   const examData = {
//     instructions: {
//       title: "Exam Instructions",
//       content: [
//         "This is a secure examination for Clarke International University.",
//         "The exam consists of three sections: A, B, and C.",
//         "The exam must be taken in full-screen mode with camera monitoring.",
//         "Click 'Start Exam' when you are ready to begin. This will activate your camera."
//       ]
//     },
//     sections: {
//       A: {
//         title: "Section A",
//         description: "Multiple Choice Questions",
//         questions: [
//           { id: "A1", text: "What is 2 + 2?", options: ["3", "4", "5", "6"], type: "multiple-choice" }
//         ]
//       },
//       B: {
//         title: "Section B",
//         description: "Short Answer Questions",
//         questions: [
//           { id: "B1", text: "Define gravity.", type: "short-answer" }
//         ]
//       },
//       C: {
//         title: "Section C",
//         description: "Essay Question",
//         questions: [
//           { id: "C1", text: "Discuss global warming.", type: "essay" }
//         ]
//       }
//     }
//   };

//   const recordViolation = (msg) => {
//     const violation = { msg, time: new Date().toISOString() };
//     setViolations(prev => [...prev, violation]);
//   };

//   useEffect(() => {
//     const loadModels = async () => {
//       try {
//         await faceapi.nets.tinyFaceDetector.load('/models/tiny_face_detector_model-weights_manifest.json');
//         setIsModelLoaded(true);
//       } catch (err) {
//         setFaceDetectionError("Failed to load face detection model.");
//       }
//     };
//     loadModels();
//   }, []);

//   useEffect(() => {
//     return () => {
//       stopCamera();
//     };
//   }, []);

//   const initializeCamera = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         await videoRef.current.play();
//         setCameraActive(true);
//         joinRoom(roomId);

//         startFaceDetection();
//         startFrameStreaming();
//       }
//     } catch (err) {
//       setFaceDetectionError("Camera access denied.");
//     }
//   };

//   const startFaceDetection = () => {
//     faceDetectionInterval.current = setInterval(async () => {
//       if (!videoRef.current || !isModelLoaded) return;
//       const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions());

//       if (detections.length === 0) {
//         setFaceDetected(false);
//         setMultipleFaces(false);
//         recordViolation("No face detected");
//       } else if (detections.length === 1) {
//         setFaceDetected(true);
//         setMultipleFaces(false);
//       } else {
//         setFaceDetected(false);
//         setMultipleFaces(true);
//         recordViolation("Multiple faces detected");
//       }
//     }, 500);
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
//     }, 100);
//   };

//   const stopCamera = () => {
//     if (videoRef.current?.srcObject) {
//       videoRef.current.srcObject.getTracks().forEach(track => track.stop());
//     }
//     if (faceDetectionInterval.current) clearInterval(faceDetectionInterval.current);
//     if (frameInterval.current) clearInterval(frameInterval.current);
//     leaveRoom();
//   };

//   const handleReady = async () => {
//     try {
//       await document.documentElement.requestFullscreen();
//       setShowInstructions(false);
//       setCurrentSection('A');
//       setCurrentQuestion(examData.sections['A'].questions[0]);
//       setIsTimerRunning(true);
//       initializeCamera();
//     } catch (err) {
//       alert("Failed to enter fullscreen.");
//     }
//   };

//   const handleAnswerChange = (e) => {
//     const value = e.target.value;
//     if (e.nativeEvent.inputType === 'insertFromPaste') {
//       e.preventDefault();
//       recordViolation("Paste attempt detected");
//       return;
//     }
//     setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
//   };

//   const handleMultipleChoiceAnswer = (option) => {
//     setAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
//   };

//   const handleSaveAnswer = () => {
//     localStorage.setItem('examAnswers', JSON.stringify(answers));
//   };

//   const submitExam = () => {
//     localStorage.setItem('examAnswers', JSON.stringify(answers));
//     stopCamera();
//     setIsTimerRunning(false);
//     navigate('/exam-complete');
//   };

//   const currentSectionQuestions = examData.sections[currentSection]?.questions || [];
//   const currentQuestionIndex = currentSectionQuestions.findIndex(q => q.id === currentQuestion?.id);
//   const hasPrev = currentQuestionIndex > 0;
//   const hasNext = currentQuestionIndex < currentSectionQuestions.length - 1;

//   if (showInstructions) {
//     return (
//       <div className={styles.examContainer}>
//         <h2>{examData.instructions.title}</h2>
//         <ul>
//           {examData.instructions.content.map((rule, idx) => (
//             <li key={idx}>{rule}</li>
//           ))}
//         </ul>
//         <button onClick={handleReady}>Start Exam</button>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.examContainer}>
//       <div className={styles.examHeader}>
//         <h3>Clarke International University</h3>
//         <p>Violations: {violations.length}</p>
//       </div>

//       <div className={styles.examContent}>
//         <aside className={styles.sidebar}>
//           {Object.keys(examData.sections).map(sec => (
//             <div key={sec}>
//               <h4 onClick={() => {
//                 setCurrentSection(sec);
//                 setCurrentQuestion(examData.sections[sec].questions[0]);
//               }}>
//                 {examData.sections[sec].title}
//               </h4>
//             </div>
//           ))}
//         </aside>

//         <main className={styles.questionPanel}>
//           {currentQuestion && (
//             <>
//               <p><strong>{currentQuestion.text}</strong></p>
//               {currentQuestion.type === 'multiple-choice' && (
//                 <div>
//                   {currentQuestion.options.map((opt, idx) => (
//                     <div key={idx} onClick={() => handleMultipleChoiceAnswer(opt)}>
//                       <input
//                         type="radio"
//                         name={currentQuestion.id}
//                         checked={answers[currentQuestion.id] === opt}
//                         readOnly
//                       />
//                       <label>{opt}</label>
//                     </div>
//                   ))}
//                 </div>
//               )}
//               {(currentQuestion.type === 'short-answer' || currentQuestion.type === 'essay') && (
//                 <textarea
//                   value={answers[currentQuestion.id] || ''}
//                   onChange={handleAnswerChange}
//                 />
//               )}
//               <div>
//                 {hasPrev && (
//                   <button onClick={() => setCurrentQuestion(currentSectionQuestions[currentQuestionIndex - 1])}>
//                     Previous
//                   </button>
//                 )}
//                 <button onClick={handleSaveAnswer}>Save</button>
//                 {hasNext && (
//                   <button onClick={() => setCurrentQuestion(currentSectionQuestions[currentQuestionIndex + 1])}>
//                     Next
//                   </button>
//                 )}
//               </div>
//             </>
//           )}
//         </main>

//         <div className={styles.cameraStatus}>
//           <video ref={videoRef} autoPlay muted playsInline style={{ width: '300px', transform: 'scaleX(-1)' }} />
//           <p>{faceDetected ? 'Face Detected' : multipleFaces ? 'Multiple Faces' : 'No Face'}</p>
//         </div>
//       </div>

//       <button onClick={submitExam}>Submit Exam</button>
//     </div>
//   );
// };

// export default Streamer;
