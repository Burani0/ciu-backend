
// // import React, { useState, useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { BiSolidInfoCircle } from "react-icons/bi";

// // const Instructions: React.FC = () => {
// //   const navigate = useNavigate();
// //   const [isChrome, setIsChrome] = useState<boolean>(true);
// //   const [otherTabsDetected, setOtherTabsDetected] = useState<boolean>(false);
// //   const [acknowledged, setAcknowledged] = useState<boolean>(false);
// //   const [errorMessage, setErrorMessage] = useState<string>("");

// //   // Browser detection
// //   useEffect(() => {
// //     const userAgent = navigator.userAgent.toLowerCase();
// //     const isChromeBrowser =
// //       /chrome/.test(userAgent) &&
// //       !/edg|opr|samsungbrowser|ucbrowser/.test(userAgent);
// //     setIsChrome(isChromeBrowser);
// //     if (!isChromeBrowser) {
// //       setErrorMessage("Please use Google Chrome to access the exam system.");
// //     }
// //   }, []);

// //   // Robust multi-tab detection using BroadcastChannel
// //   useEffect(() => {
// //     const channel = new BroadcastChannel("exam_system_channel");
// //     const myTabId = Date.now().toString() + Math.random().toString(); // unique ID per tab

// //     const otherTabs = new Set<string>();

// //     // Ping other tabs every 2 seconds
// //     const pingInterval = setInterval(() => {
// //       channel.postMessage({ type: "ping", tabId: myTabId });
// //     }, 2000);

// //     // Listen for messages from other tabs
// //     channel.onmessage = (event: MessageEvent) => {
// //       const { type, tabId } = event.data;

// //       if (type === "ping" && tabId !== myTabId) {
// //         otherTabs.add(tabId);
// //         setOtherTabsDetected(true);
// //         setErrorMessage(
// //           "Multiple tabs detected. Please close all other tabs before proceeding."
// //         );
// //       }
// //     };

// //     // Detect tab switch or browser window out-of-focus
// //     const handleBlur = () => {
// //       setOtherTabsDetected(true);
// //       setErrorMessage(
// //         "You switched tabs or minimized the window. Please keep only this tab open for the exam."
// //       );
// //     };

// //     const handleVisibilityChange = () => {
// //       if (document.hidden) {
// //         setOtherTabsDetected(true);
// //         setErrorMessage(
// //           "Tab switch detected. Please keep only this tab open for the exam."
// //         );
// //       }
// //     };

// //     window.addEventListener("blur", handleBlur);
// //     document.addEventListener("visibilitychange", handleVisibilityChange);

// //     return () => {
// //       clearInterval(pingInterval);
// //       window.removeEventListener("blur", handleBlur);
// //       document.removeEventListener("visibilitychange", handleVisibilityChange);
// //       channel.close();
// //     };
// //   }, []);

// //   const handleProceed = () => {
// //     if (!acknowledged) {
// //       setErrorMessage(
// //         "Please acknowledge the instructions by checking the box."
// //       );
// //       return;
// //     }
// //     if (!isChrome || otherTabsDetected) {
// //       setErrorMessage(
// //         "Please use Google Chrome and ensure only one tab is open before proceeding."
// //       );
// //       return;
// //     }
// //     localStorage.setItem("instructionsViewed", "true");
// //     navigate("/Studentlogin");
// //   };

// //   return (
// //     <div className="font-['Roboto'] flex justify-center items-center min-h-screen bg-[#ebebeb] py-5">
// //       <div className="relative w-[420px] bg-white text-[#106053] rounded-lg shadow-lg">
// //         <div className="grid place-items-center w-full h-[185px] bg-[#d6d6d6]">
// //           <img
// //             src="/public/CIU-exam-system-logo.png"
// //             alt="CIU Exam System Logo"
// //             className="max-h-[120px] object-contain"
// //           />
// //         </div>

// //         <div className="w-full p-10">
// //           <div className="flex justify-center mb-6">
// //             <div className="h-[40px] w-[40px] bg-white rounded-[10px] flex items-center justify-center">
// //               <BiSolidInfoCircle className="text-[#106053]" size={42} />
// //             </div>
// //           </div>

// //           <h2 className="text-2xl font-bold text-center mb-6">Exam Instructions</h2>
// //           <ul className="list-disc pl-5 mb-6 text-[16px] text-[#4f4e4e]">
// //             <li>
// //               Ensure no other tabs or programs are running before logging into the system.
// //             </li>
// //             <li>
// //               Ensure your browser has permission to access the microphone, webcam, and audio.
// //             </li>
// //             <li>Use only Google Chrome as the browser for the exam.</li>
// //             <li>
// //               Exiting full-screen mode during the exam will automatically submit the exam.
// //             </li>
// //             <li>
// //               Complete the exam within the set duration; exceeding the time limit will result
// //               in automatic submission.
// //             </li>
// //             <li>
// //               Unauthorized materials or cheating will result in disconnection by the lecturer
// //               or admin.
// //             </li>
// //             <li>Log in using valid credentials provided by the institution.</li>
// //           </ul>

// //           <div className="mb-6">
// //             <label className="flex items-center text-[16px] text-[#4f4e4e]">
// //               <input
// //                 type="checkbox"
// //                 checked={acknowledged}
// //                 onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
// //                   setAcknowledged(e.target.checked)
// //                 }
// //                 className="mr-2"
// //               />
// //               I have read and understood the instructions.
// //             </label>
// //           </div>

// //           <button
// //             onClick={handleProceed}
// //             disabled={!isChrome || otherTabsDetected || !acknowledged}
// //             className="w-full h-[45px] bg-[#106053] text-white font-bold hover:bg-[#0b3f37] disabled:opacity-50 flex items-center justify-center rounded-[40px]"
// //           >
// //             Proceed to Login
// //           </button>

// //           {errorMessage && (
// //             <p className="text-red-600 font-bold mt-2 text-center text-sm">
// //               {errorMessage}
// //             </p>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Instructions;









// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { BiSolidInfoCircle } from "react-icons/bi";

// const Instructions: React.FC = () => {
//   const navigate = useNavigate();
//   const [isChrome, setIsChrome] = useState<boolean>(true);
//   const [otherTabsDetected, setOtherTabsDetected] = useState<boolean>(false);
//   const [acknowledged, setAcknowledged] = useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string>("");

//   // ✅ 1. Detect browser (only allow Chrome)
//   useEffect(() => {
//     const userAgent = navigator.userAgent.toLowerCase();
//     const isChromeBrowser =
//       /chrome/.test(userAgent) &&
//       !/edg|opr|samsungbrowser|ucbrowser/.test(userAgent);
//     setIsChrome(isChromeBrowser);

//     if (!isChromeBrowser) {
//       setErrorMessage("Please use Google Chrome to access the exam system.");
//     }
//   }, []);

//   // ✅ 2. Robust multi-tab detection
//   useEffect(() => {
//     const channel = new BroadcastChannel("exam_system_channel");
//     const myTabId = Date.now().toString() + Math.random().toString();
//     const hasDetected = sessionStorage.getItem("multiple_tabs_detected") === "true";

//     if (hasDetected) {
//       setOtherTabsDetected(true);
//       setErrorMessage("Multiple tabs detected. Please close all other tabs.");
//     }

//     const notifyOthers = () => {
//       channel.postMessage({ type: "ping", tabId: myTabId });
//     };

//     const handleMessage = (event: MessageEvent) => {
//       const { type, tabId } = event.data || {};

//       if (!tabId || tabId === myTabId) return;

//       if (type === "ping") {
//         // Reply to pings
//         channel.postMessage({ type: "pong", tabId: myTabId });
//         triggerBlock();
//       }

//       if (type === "pong") {
//         triggerBlock();
//       }
//     };

//     const triggerBlock = () => {
//       if (!sessionStorage.getItem("multiple_tabs_detected")) {
//         sessionStorage.setItem("multiple_tabs_detected", "true");
//       }
//       setOtherTabsDetected(true);
//       setErrorMessage("Multiple tabs detected. Please close all other tabs.");
//     };

//     // Ping on load and every 2s
//     notifyOthers();
//     const pingInterval = setInterval(notifyOthers, 2000);

//     channel.onmessage = handleMessage;

//     const handleUnload = () => {
//       sessionStorage.removeItem("multiple_tabs_detected");
//     };

//     window.addEventListener("beforeunload", handleUnload);

//     return () => {
//       clearInterval(pingInterval);
//       channel.close();
//       window.removeEventListener("beforeunload", handleUnload);
//     };
//   }, []);

//   // ✅ 3. Tab switch or window minimized detection
//   useEffect(() => {
//     const handleBlur = () => {
//       setOtherTabsDetected(true);
//       setErrorMessage("You switched or minimized the window. Please return to the exam.");
//     };

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setOtherTabsDetected(true);
//         setErrorMessage("Tab switch detected. Only one tab allowed during the exam.");
//       }
//     };

//     window.addEventListener("blur", handleBlur);
//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     return () => {
//       window.removeEventListener("blur", handleBlur);
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);

//   const handleProceed = () => {
//     if (!acknowledged) {
//       setErrorMessage("Please acknowledge the instructions by checking the box.");
//       return;
//     }
//     if (!isChrome || otherTabsDetected) {
//       setErrorMessage("Only one Chrome tab is allowed. Please fix this to proceed.");
//       return;
//     }

//     localStorage.setItem("instructionsViewed", "true");
//     navigate("/Studentlogin");
//   };

//   return (
//     <div className="font-['Roboto'] flex justify-center items-center min-h-screen bg-[#ebebeb] py-5">
//       <div className="relative w-[420px] bg-white text-[#106053] rounded-lg shadow-lg">
//         <div className="grid place-items-center w-full h-[185px] bg-[#d6d6d6]">
//           <img
//             src="/public/CIU-exam-system-logo.png"
//             alt="CIU Exam System Logo"
//             className="max-h-[120px] object-contain"
//           />
//         </div>

//         <div className="w-full p-10">
//           <div className="flex justify-center mb-6">
//             <div className="h-[40px] w-[40px] bg-white rounded-[10px] flex items-center justify-center">
//               <BiSolidInfoCircle className="text-[#106053]" size={42} />
//             </div>
//           </div>

//           <h2 className="text-2xl font-bold text-center mb-6">Exam Instructions</h2>
//           <ul className="list-disc pl-5 mb-6 text-[16px] text-[#4f4e4e]">
//             <li>Ensure no other tabs or programs are running before logging into the system.</li>
//             <li>Use only Google Chrome as the browser for the exam.</li>
//             <li>Browser permissions are required for microphone, webcam, and audio.</li>
//             <li>Exiting full-screen or switching tabs will auto-submit the exam.</li>
//             <li>Finish within the set time; over-time will auto-submit your exam.</li>
//             <li>Cheating results in disconnection by the lecturer or admin.</li>
//             <li>Use valid login credentials issued by the institution.</li>
//           </ul>

//           <div className="mb-6">
//             <label className="flex items-center text-[16px] text-[#4f4e4e]">
//               <input
//                 type="checkbox"
//                 checked={acknowledged}
//                 onChange={(e) => setAcknowledged(e.target.checked)}
//                 className="mr-2"
//               />
//               I have read and understood the instructions.
//             </label>
//           </div>

//           <button
//             onClick={handleProceed}
//             disabled={!isChrome || otherTabsDetected || !acknowledged}
//             className="w-full h-[45px] bg-[#106053] text-white font-bold hover:bg-[#0b3f37] disabled:opacity-50 flex items-center justify-center rounded-[40px]"
//           >
//             Proceed to Login
//           </button>

//           {errorMessage && (
//             <p className="text-red-600 font-bold mt-2 text-center text-sm">
//               {errorMessage}
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Instructions;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSolidInfoCircle } from "react-icons/bi";

const Instructions: React.FC = () => {
  const navigate = useNavigate();

  const [isChrome, setIsChrome] = useState<boolean>(true);
  const [otherTabsDetected, setOtherTabsDetected] = useState<boolean>(false);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Chrome detection
  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isChromeBrowser =
      /chrome/.test(userAgent) &&
      !/edg|opr|samsungbrowser|ucbrowser|brave/.test(userAgent);
    setIsChrome(isChromeBrowser);

    if (!isChromeBrowser) {
      setErrorMessage("Please use Google Chrome to access the exam system.");
    }
  }, []);

  // Robust multi-tab detection + refresh persistence
  useEffect(() => {
    const channel = new BroadcastChannel("exam_system_channel");
    const myTabId = Date.now().toString() + Math.random().toString();

    const hasDetected = sessionStorage.getItem("multiple_tabs_detected") === "true";

    if (hasDetected) {
      setOtherTabsDetected(true);
      setErrorMessage("Multiple tabs detected. Please close all other tabs.");
    }

    let pongReceived = false;

    const sendPing = () => {
      pongReceived = false;
      channel.postMessage({ type: "ping", tabId: myTabId });

      setTimeout(() => {
        if (pongReceived) {
          triggerBlock();
        }
      }, 300);
    };

    const handleMessage = (event: MessageEvent) => {
      const { type, tabId } = event.data || {};

      if (!tabId || tabId === myTabId) return;

      if (type === "ping") {
        channel.postMessage({ type: "pong", tabId: myTabId });
        triggerBlock();
      }

      if (type === "pong") {
        pongReceived = true;
        triggerBlock();
      }
    };

    const triggerBlock = () => {
      if (!sessionStorage.getItem("multiple_tabs_detected")) {
        sessionStorage.setItem("multiple_tabs_detected", "true");
      }
      setOtherTabsDetected(true);
      setErrorMessage("Multiple tabs detected. Please close all other tabs.");
    };

    sendPing();
    const pingInterval = setInterval(sendPing, 1000);

    channel.onmessage = handleMessage;

    const handleUnload = () => {
      sessionStorage.removeItem("multiple_tabs_detected");
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(pingInterval);
      channel.close();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  // Tab switch detection
  useEffect(() => {
    const handleBlur = () => {
      setOtherTabsDetected(true);
      setErrorMessage("Please close all other tabs or programs before proceeding.");
    };

    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  const handleProceed = () => {
    if (!acknowledged) {
      setErrorMessage("Please acknowledge the instructions by checking the box.");
      return;
    }
    if (!isChrome || otherTabsDetected) {
      setErrorMessage("Please use Google Chrome and close all other tabs before proceeding.");
      return;
    }

    localStorage.setItem("instructionsViewed", "true");
    navigate("/Studentlogin");
  };

  return (
    <div className="font-['Roboto'] flex justify-center items-center min-h-screen bg-[#ebebeb] py-5">
      <div className="relative w-[420px] bg-white text-[#106053] rounded-lg shadow-lg">
        <div className="grid place-items-center w-full h-[185px] bg-[#d6d6d6]">
          <img
            src="/public/CIU-exam-system-logo.png"
            alt="CIU Exam System Logo"
            className="max-h-[120px] object-contain"
          />
        </div>

        <div className="w-full p-10">
          <div className="flex justify-center mb-6">
            <div className="h-[40px] w-[40px] bg-white rounded-[10px] flex items-center justify-center">
              <BiSolidInfoCircle className="text-[#106053]" size={42} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">Exam Instructions</h2>
          <ul className="list-disc pl-5 mb-6 text-[16px] text-[#4f4e4e]">
            <li>Ensure no other tabs or programs are running before logging into the system.</li>
            <li>Ensure your browser has permission to access the microphone, webcam, and audio.</li>
            <li>Use only Google Chrome as the browser for the exam.</li>
            <li>Exiting full-screen mode during the exam will automatically submit the exam.</li>
            <li>Complete the exam within the set duration; exceeding the time limit will result in automatic submission.</li>
            <li>Unauthorized materials or cheating will result in disconnection by the lecturer or admin.</li>
            <li>Log in using valid credentials provided by the institution.</li>
          </ul>

          <div className="mb-6">
            <label className="flex items-center text-[16px] text-[#4f4e4e]">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAcknowledged(e.target.checked)}
                className="mr-2"
              />
              I have read and understood the instructions.
            </label>
          </div>

          <button
            onClick={handleProceed}
            disabled={!isChrome || otherTabsDetected || !acknowledged}
            className="w-full h-[45px] bg-[#106053] text-white font-bold hover:bg-[#0b3f37] disabled:opacity-50 flex items-center justify-center rounded-[40px]"
          >
            Proceed to Login
          </button>

          {errorMessage && (
            <p className="text-red-600 font-bold mt-2 text-center text-sm">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Instructions;
