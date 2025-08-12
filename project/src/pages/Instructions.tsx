
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { BiSolidInfoCircle } from "react-icons/bi";

// const Instructions: React.FC = () => {
//   const navigate = useNavigate();
//   const [isChrome, setIsChrome] = useState<boolean>(true);
//   const [otherTabsDetected, setOtherTabsDetected] = useState<boolean>(false);
//   const [acknowledged, setAcknowledged] = useState<boolean>(false);
//   const [errorMessage, setErrorMessage] = useState<string>("");

//   // Browser detection
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

//   // Robust multi-tab detection using BroadcastChannel
//   useEffect(() => {
//     const channel = new BroadcastChannel("exam_system_channel");
//     const myTabId = Date.now().toString() + Math.random().toString(); // unique ID per tab

//     const otherTabs = new Set<string>();

//     // Ping other tabs every 2 seconds
//     const pingInterval = setInterval(() => {
//       channel.postMessage({ type: "ping", tabId: myTabId });
//     }, 2000);

//     // Listen for messages from other tabs
//     channel.onmessage = (event: MessageEvent) => {
//       const { type, tabId } = event.data;

//       if (type === "ping" && tabId !== myTabId) {
//         otherTabs.add(tabId);
//         setOtherTabsDetected(true);
//         setErrorMessage(
//           "Multiple tabs detected. Please close all other tabs before proceeding."
//         );
//       }
//     };

//     // Detect tab switch or browser window out-of-focus
//     const handleBlur = () => {
//       setOtherTabsDetected(true);
//       setErrorMessage(
//         "You switched tabs or minimized the window. Please keep only this tab open for the exam."
//       );
//     };

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         setOtherTabsDetected(true);
//         setErrorMessage(
//           "Tab switch detected. Please keep only this tab open for the exam."
//         );
//       }
//     };

//     window.addEventListener("blur", handleBlur);
//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     return () => {
//       clearInterval(pingInterval);
//       window.removeEventListener("blur", handleBlur);
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       channel.close();
//     };
//   }, []);

//   const handleProceed = () => {
//     if (!acknowledged) {
//       setErrorMessage(
//         "Please acknowledge the instructions by checking the box."
//       );
//       return;
//     }
//     if (!isChrome || otherTabsDetected) {
//       setErrorMessage(
//         "Please use Google Chrome and ensure only one tab is open before proceeding."
//       );
//       return;
//     }
//     localStorage.setItem("instructionsViewed", "true");
//     navigate("/Studentlogin");
//   };

//   return (
//     <div className="font-['Roboto'] flex justify-center items-center min-h-screen bg-[#ebebeb] py-5">
//       <div className="relative w-[420px] bg-white text-[#106053] rounded-lg shadow-lg">
        

//         <div className="w-full p-10">
//           <div className="flex justify-center mb-6">
//             <div className="h-[40px] w-[40px] bg-white rounded-[10px] flex items-center justify-center">
//               <BiSolidInfoCircle className="text-[#106053]" size={42} />
//             </div>
//           </div>

//           <h2 className="text-2xl font-bold text-center mb-6">Exam Instructions</h2>
//           <ul className="list-disc pl-5 mb-6 text-[16px] text-[#4f4e4e]">
//             <li>
//               Ensure no other tabs or programs are running before logging into the system.
//             </li>
//             <li>
//               Ensure your browser has permission to access the microphone, webcam, and audio.
//             </li>
//             <li>Use only Google Chrome as the browser for the exam.</li>
//             <li>
//               Exiting full-screen mode during the exam will automatically submit the exam.
//             </li>
//             <li>
//               Complete the exam within the set duration; exceeding the time limit will result
//               in automatic submission.
//             </li>
//             <li>
//               Unauthorized materials or cheating will result in disconnection by the lecturer
//               or admin.
//             </li>
//             <li>Log in using valid credentials provided by the institution.</li>
//           </ul>

//           <div className="mb-6">
//             <label className="flex items-center text-[16px] text-[#4f4e4e]">
//               <input
//                 type="checkbox"
//                 checked={acknowledged}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                   setAcknowledged(e.target.checked)
//                 }
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























import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";

const BACKEND_BASE = 'http://localhost:3001/api/tabs';

interface StatusDisplay {
  className: string;
  icon: string;
  title: string;
  subtitle: string;
}

const Instructions: React.FC = () => {
  const navigate = useNavigate();
  const [isChrome, setIsChrome] = useState<boolean>(true);
  const [tabCount, setTabCount] = useState<number | null>(null);
  const [isCheckingTabs, setIsCheckingTabs] = useState<boolean>(true);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [tabSwitchAttempted, setTabSwitchAttempted] = useState<boolean>(false);
  const backendTabIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string>("");
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const tabActivityRef = useRef<Map<string, number>>(new Map());

  // Share sessionId across tabs with expiry
  const SESSION_EXPIRY = 60 * 60 * 1000; // 1 hour
  useEffect(() => {
    let storedSession = localStorage.getItem('ciu_exam_session_id');
    if (storedSession) {
      try {
        const { id, timestamp } = JSON.parse(storedSession);
        if (Date.now() - timestamp < SESSION_EXPIRY) {
          sessionIdRef.current = id;
          return;
        }
      } catch {
        // Invalid, regenerate
      }
    }
    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('ciu_exam_session_id', JSON.stringify({ id: newId, timestamp: Date.now() }));
    sessionIdRef.current = newId;
  }, []);

  // Check browser
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

  // Define unregisterFromBackend outside useEffect
  const unregisterFromBackend = useCallback((id?: string) => {
    try {
      const tabIdToSend = id || backendTabIdRef.current;
      if (!tabIdToSend || !sessionIdRef.current) return;
      const url = `${BACKEND_BASE}/unregister`;
      const body = JSON.stringify({ tabId: tabIdToSend, sessionId: sessionIdRef.current });
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }).catch(() => {});
      }
      console.log(`[Frontend] Unregistered tab ${tabIdToSend} from backend`);
    } catch (err) {
      console.error("[Backend] Unregister error:", err);
    }
  }, []);

  useEffect(() => {
    if (!sessionIdRef.current) return;

    const TAB_REGISTRY = "ciu_active_tabs";
    const HEARTBEAT_KEY = "ciu_heartbeat";
    const BROADCAST_CHANNEL_NAME = "ciu_tab_communication";
    const GLOBAL_ACTIVE_FLAG = "ciu_any_active";
    const TAB_TIMEOUT = 10000; // Match with backend if used
    const HEARTBEAT_INTERVAL = 1000;
    const BACKEND_POLL_INTERVAL = 500;
    const PONG_TIMEOUT = 10500;
    const TAB_SWITCH_THRESHOLD = 1000;

    const myTabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    let heartbeatInterval: NodeJS.Timeout | undefined;
    let backendHeartbeatInterval: NodeJS.Timeout | undefined;
    let backendPollInterval: NodeJS.Timeout | undefined;
    let detectedTabs: Set<string> = new Set([myTabId]);
    let lastActiveTime = Date.now();

    const updateTabStatus = (
      tabCount: number,
      tabIds: string[] = [],
      isTabSwitch: boolean = false,
      source: string = ""
    ) => {
      console.log(`[TabStatus] Source: ${source}, Tab Count: ${tabCount}, Tab IDs: ${tabIds.join(', ')}, Is Switch: ${isTabSwitch}`);
      setTabCount(tabCount);
      setIsCheckingTabs(false);

      if (isTabSwitch) {
        setTabSwitchAttempted(true);
        setErrorMessage("TAB SWITCH DETECTED! Login is blocked.");
        document.title = "⚠️ TAB SWITCH BLOCKED!";
      } else if (tabCount > 1) {
        setErrorMessage("Multiple tabs detected, you can't login.");
        document.title = "⚠️ MULTIPLE TABS DETECTED!";
      } else {
        setErrorMessage("");
        setTabSwitchAttempted(false);
        document.title = "CIU Exam System";
        if (tabCount === 1 && acknowledged && !isCheckingTabs) {
          localStorage.setItem("instructionsViewed", "true");
          navigate("/Studentlogin");
        }
      }
    };

    interface RegistryEntry {
      lastSeen: number;
      startTime: number;
      origin: string;
      sessionId: string;
    }

    const updateRegistry = (): { count: number; ids: string[] } => {
      try {
        const registry: { [key: string]: RegistryEntry } = JSON.parse(localStorage.getItem(TAB_REGISTRY) || "{}");
        const now = Date.now();
        Object.keys(registry).forEach(tabId => {
          if (now - registry[tabId].lastSeen > TAB_TIMEOUT || registry[tabId].sessionId !== sessionIdRef.current) {
            delete registry[tabId];
            detectedTabs.delete(tabId);
            tabActivityRef.current.delete(tabId);
          }
        });
        registry[myTabId] = {
          lastSeen: now,
          startTime,
          origin: window.location.origin,
          sessionId: sessionIdRef.current,
        };
        localStorage.setItem(TAB_REGISTRY, JSON.stringify(registry));
        localStorage.setItem(GLOBAL_ACTIVE_FLAG, "true");

        const activeTabIds = Object.keys(registry);
        detectedTabs = new Set(activeTabIds.filter(tabId => {
          const lastPong = tabActivityRef.current.get(tabId);
          return !lastPong || (now - lastPong < PONG_TIMEOUT);
        }));

        console.log(`[Registry] Updated. Local count: ${detectedTabs.size}, Session: ${sessionIdRef.current}`);
        return { count: detectedTabs.size, ids: Array.from(detectedTabs) };
      } catch (e) {
        console.error("[Registry] Error updating registry:", e);
        return { count: 1, ids: [myTabId] };
      }
    };

    const sendLocalHeartbeat = () => {
      try {
        localStorage.setItem(HEARTBEAT_KEY, JSON.stringify({
          tabId: myTabId,
          timestamp: Date.now(),
          sessionId: sessionIdRef.current,
        }));
      } catch (e) {
        console.error("[Heartbeat] Error sending local heartbeat:", e);
      }
    };

    const initBroadcastChannel = () => {
      try {
        if (typeof BroadcastChannel !== 'undefined' && !broadcastChannelRef.current) {
          broadcastChannelRef.current = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
          broadcastChannelRef.current.onmessage = (event: MessageEvent) => {
            const { type, tabId, sessionId } = event.data || {};
            if (!tabId || !sessionId) return;
            if (tabId !== myTabId && sessionId === sessionIdRef.current) {
              if (type === 'ping') {
                broadcastChannelRef.current?.postMessage({ type: 'pong', tabId: myTabId, sessionId: sessionIdRef.current });
              } else if (type === 'pong') {
                tabActivityRef.current.set(tabId, Date.now());
                if (!detectedTabs.has(tabId)) {
                  detectedTabs.add(tabId);
                }
              }
              const { count, ids } = updateRegistry();
              updateTabStatus(count, ids, false, "BroadcastChannel");
            }
          };

          const sendPing = () => {
            if (broadcastChannelRef.current) {
              broadcastChannelRef.current.postMessage({ type: 'ping', tabId: myTabId, sessionId: sessionIdRef.current });
              const now = Date.now();
              tabActivityRef.current.forEach((lastPong, tabId) => {
                if (now - lastPong > PONG_TIMEOUT && tabId !== myTabId) {
                  detectedTabs.delete(tabId);
                  tabActivityRef.current.delete(tabId);
                }
              });
              const { count, ids } = updateRegistry();
              updateTabStatus(count, ids, false, "BroadcastChannel cleanup");
            }
          };
          sendPing();
          pingIntervalRef.current = setInterval(sendPing, HEARTBEAT_INTERVAL);
        }
      } catch (e) {
        console.error("[Broadcast] Initialization failed:", e);
        const { count, ids } = updateRegistry();
        updateTabStatus(count, ids, false, "BroadcastChannel fallback");
      }
    };

    const registerWithBackend = async (retries: number = 5): Promise<boolean> => {
      try {
        const res = await fetch(`${BACKEND_BASE}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: sessionIdRef.current }),
        });
        if (res.ok) {
          const data = await res.json();
          backendTabIdRef.current = data.tabId;
          console.log(`[Frontend] Registered with backend count: ${data.count}`);
          return true;
        }
        if (retries > 0) {
          console.warn(`[Frontend] Register retry for session ${sessionIdRef.current}, retries left: ${retries}`);
          await new Promise(resolve => setTimeout(resolve, 500));
          return registerWithBackend(retries - 1);
        }
        console.warn("[Backend] Register failed, ignoring backend");
        return false;
      } catch (err) {
        console.error("[Backend] Register error:", err);
        if (retries > 0) {
          console.warn(`[Frontend] Register retry after error for session ${sessionIdRef.current}, retries left: ${retries}`);
          await new Promise(resolve => setTimeout(resolve, 500));
          return registerWithBackend(retries - 1);
        }
        console.warn("[Backend] Register failed, ignoring backend");
        return false;
      }
    };

    const sendBackendHeartbeat = async () => {
      try {
        const id = backendTabIdRef.current;
        if (!id) return;
        await fetch(`${BACKEND_BASE}/heartbeat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tabId: id, sessionId: sessionIdRef.current }),
        });
      } catch (err) {
        console.error("[Backend] Heartbeat error:", err);
      }
    };

    const fetchBackendCount = async (retries: number = 5): Promise<number | null> => {
      try {
        const res = await fetch(`${BACKEND_BASE}/count?sessionId=${sessionIdRef.current}`);
        if (res.ok) {
          const data = await res.json();
          console.log(`[Frontend] Fetched backend count: ${data.count} for session ${sessionIdRef.current}`);
          return data.count || 0;
        }
        if (retries > 0) {
          console.warn(`[Frontend] Retrying count fetch for session ${sessionIdRef.current}, retries left: ${retries}`);
          await new Promise(resolve => setTimeout(resolve, 500));
          return fetchBackendCount(retries - 1);
        }
        console.warn("[Backend] Count fetch failed, using local count");
        return null;
      } catch (err) {
        console.error("[Backend] Count fetch error:", err);
        if (retries > 0) {
          console.warn(`[Frontend] Retrying count fetch after error for session ${sessionIdRef.current}, retries left: ${retries}`);
          await new Promise(resolve => setTimeout(resolve, 500));
          return fetchBackendCount(retries - 1);
        }
        console.warn("[Backend] Count fetch failed, using local count");
        return null;
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === TAB_REGISTRY || e.key === HEARTBEAT_KEY) {
        const { count, ids } = updateRegistry();
        updateTabStatus(count, ids, false, "storage change");
      }
    };

    const handleVisibilityChange = () => {
      const now = Date.now();
      if (document.hidden && now - lastActiveTime > TAB_SWITCH_THRESHOLD) {
        const { count, ids } = updateRegistry();
        updateTabStatus(count, ids, true, "visibility change");
      } else {
        lastActiveTime = now;
        const { count, ids } = updateRegistry();
        updateTabStatus(count, ids, false, "focus refresh");
      }
    };

    const handleFocus = () => {
      lastActiveTime = Date.now();
      const { count, ids } = updateRegistry();
      updateTabStatus(count, ids, false, "focus refresh");
    };

    const handleBlur = () => {
      const now = Date.now();
      if (now - lastActiveTime > TAB_SWITCH_THRESHOLD) {
        const { count, ids } = updateRegistry();
        updateTabStatus(count, ids, true, "blur-based-switch");
      }
      lastActiveTime = now;
    };

    (async () => {
      let registry: { [key: string]: RegistryEntry } = JSON.parse(localStorage.getItem(TAB_REGISTRY) || "{}");
      Object.keys(registry).forEach(tabId => {
        if (registry[tabId].sessionId !== sessionIdRef.current || Date.now() - registry[tabId].lastSeen > TAB_TIMEOUT) {
          delete registry[tabId];
        }
      });
      localStorage.setItem(TAB_REGISTRY, JSON.stringify(registry));

      detectedTabs.add(myTabId);
      tabActivityRef.current.set(myTabId, Date.now());
      sendLocalHeartbeat();
      initBroadcastChannel();

      const { count, ids } = updateRegistry(); // Initial local count
      updateTabStatus(count, ids, false, 'initial-local');

      await registerWithBackend(); // Attempt backend registration, but don’t rely on it
      heartbeatInterval = setInterval(() => {
        sendLocalHeartbeat();
        const { count, ids } = updateRegistry();
        updateTabStatus(count, ids, false, "continuous heartbeat");
      }, HEARTBEAT_INTERVAL);

      backendHeartbeatInterval = setInterval(() => {
        sendBackendHeartbeat();
      }, 1000);

      backendPollInterval = setInterval(async () => {
        const backendCount = await fetchBackendCount();
        if (backendCount !== null && backendCount > detectedTabs.size) {
          updateTabStatus(backendCount, [], false, 'backend-count-override');
        } else {
          const { count, ids } = updateRegistry();
          updateTabStatus(count, ids, false, 'local-count');
        }
      }, BACKEND_POLL_INTERVAL);
    })();

    const cleanup = () => {
      try {
        const registry: { [key: string]: RegistryEntry } = JSON.parse(localStorage.getItem(TAB_REGISTRY) || "{}");
        delete registry[myTabId];
        localStorage.setItem(TAB_REGISTRY, JSON.stringify(registry));
        if (Object.keys(registry).length === 0) {
          localStorage.removeItem(GLOBAL_ACTIVE_FLAG);
          localStorage.removeItem('ciu_exam_session_id');
        }
        unregisterFromBackend();
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.close();
          broadcastChannelRef.current = null;
        }
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
        tabActivityRef.current.delete(myTabId);
        console.log(`[Cleanup] Cleaned up tab ${myTabId}`);
      } catch (e) {
        console.error("[Cleanup] Error:", e);
      }
    };

    window.addEventListener('storage', handleStorageEvent);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('unload', cleanup);

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      if (backendHeartbeatInterval) clearInterval(backendHeartbeatInterval);
      if (backendPollInterval) clearInterval(backendPollInterval);
      window.removeEventListener('storage', handleStorageEvent);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('beforeunload', cleanup);
      window.removeEventListener('unload', cleanup);
      cleanup();
    };
  }, [acknowledged, navigate, unregisterFromBackend]);

  const handleProceed = async () => {
    if (!acknowledged) {
      setErrorMessage("Please acknowledge the instructions by checking the box.");
      return;
    }
    if (!isChrome) {
      setErrorMessage("Please use Google Chrome to access the exam system.");
      return;
    }
    if (tabCount !== null && tabCount > 1) {
      setErrorMessage("Multiple tabs detected, you can't login.");
      return;
    }
    if (tabCount !== null && tabCount === 1 && !isCheckingTabs) {
      localStorage.setItem("instructionsViewed", "true");
      navigate("/Studentlogin");
    }
    if (tabSwitchAttempted) {
      setErrorMessage("Cannot login after tab switching. Please refresh and try again.");
      return;
    }
  };

  const handleForceReset = () => {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('ciu_')) {
        localStorage.removeItem(key);
      }
    });
    sessionStorage.clear();
    setTabSwitchAttempted(false);
    setTabCount(null);
    setErrorMessage("");
    unregisterFromBackend();
    window.location.reload();
  };

  const getStatusDisplay = (): StatusDisplay => {
    if (isCheckingTabs || tabCount === null) {
      return {
        className: 'bg-yellow-100 text-yellow-800 border-2 border-yellow-300',
        icon: '🔍',
        title: 'Scanning for tabs...',
        subtitle: 'Checking local status'
      };
    }
    if (tabSwitchAttempted) {
      return {
        className: 'bg-red-100 text-red-800 border-2 border-red-300',
        icon: '🚫',
        title: 'TAB SWITCH DETECTED!',
        subtitle: 'Reset or refresh to continue'
      };
    }
    if (tabCount > 1) {
      return {
        className: 'bg-red-100 text-red-800 border-2 border-red-300',
        icon: '🚨',
        title: 'Multiple tabs detected, you can\'t login',
        subtitle: 'Close other tabs to proceed'
      };
    }
    return {
      className: 'bg-green-100 text-green-800 border-2 border-green-300',
      icon: '✅',
      title: 'Single tab detected, you can login',
      subtitle: 'Redirecting to login...'
    };
  };

  const status = getStatusDisplay();

  return (
    <div className="font-sans flex justify-center items-center min-h-screen bg-gray-100 py-5">
      <div className="relative w-[420px] bg-white text-teal-800 rounded-lg shadow-lg">
        <div className="grid place-items-center w-full h-[185px] bg-gray-300">
          <div className="grid place-items-center w-full h-[185px] bg-[#d6d6d6]">
          <img
            src="/public/CIU-exam-system-logo.png"
            alt="CIU Exam System Logo"
            className="max-h-[120px] object-contain"
          />
        </div>
        </div>

        <div className="w-full p-10">
          <div className="flex justify-center mb-6">
            <div className="h-[40px] w-[40px] bg-white rounded-[10px] flex items-center justify-center shadow-md">
              <Info className="text-teal-800" size={32} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-6">Exam Instructions</h2>

          <div className={`mb-4 p-3 rounded-lg text-center font-bold ${status.className}`}>
            <div>
              {status.icon} {status.title}
              <div className="text-sm mt-1 font-normal">{status.subtitle}</div>
            </div>
          </div>

          <ul className="list-disc pl-5 mb-6 text-base text-gray-600">
            <li>Ensure no other tabs or programs are running.</li>
            <li>Allow microphone, webcam, and audio access.</li>
            <li>Use only Google Chrome.</li>
            <li><strong>Do not switch tabs - this blocks login.</strong></li>
            <li>Exiting full-screen submits the exam.</li>
            <li>Complete within time or it auto-submits.</li>
            <li>Cheating leads to disconnection.</li>
            <li>Use valid institution credentials.</li>
          </ul>

          <div className="mb-6">
            <label className="flex items-center text-base text-gray-600">
              <input
                type="checkbox"
                checked={acknowledged}
                onChange={(e) => setAcknowledged(e.target.checked)}
                className="mr-2"
              />
              I have read and understood the instructions.
            </label>
          </div>

          <button
            onClick={handleProceed}
            disabled={!isChrome || (tabCount !== null && tabCount > 1) || !acknowledged || isCheckingTabs || tabSwitchAttempted}
            className="w-full h-[45px] bg-teal-800 text-white font-bold hover:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-[40px] transition-colors mb-3"
          >
            Proceed to Login
          </button>

          {(tabCount !== null && (tabCount > 1 || tabSwitchAttempted)) && (
            <div className="space-y-2">
              <button
                onClick={handleForceReset}
                className="w-full h-[35px] bg-red-600 text-white font-bold hover:bg-red-700 rounded-[40px] transition-colors text-sm"
              >
                🔄 Force Reset
              </button>
              <div className="text-xs text-center text-red-600 font-medium">
                {tabSwitchAttempted ? "⚠️ Reset to clear switch detection" : "⚠️ Close all tabs, then reset"}
              </div>
            </div>
          )}

          {errorMessage && (
            <p className="text-red-600 font-bold mt-3 text-center text-sm bg-red-50 p-2 rounded">
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Instructions;