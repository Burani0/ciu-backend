import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";

const Instructions: React.FC = () => {
  const navigate = useNavigate();
  const [isChrome, setIsChrome] = useState<boolean>(true);
  const [acknowledged, setAcknowledged] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  const handleProceed = () => {
    if (!acknowledged) {
      setErrorMessage("Please acknowledge the instructions by checking the box.");
      return;
    }
    if (!isChrome) {
      setErrorMessage("Please use Google Chrome to access the exam system.");
      return;
    }
    localStorage.setItem("instructionsViewed", "true");
    navigate("/Studentlogin");
  };

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

          <ul className="list-disc pl-5 mb-6 text-base text-gray-600">
            <li>Ensure no other tabs or programs are running.</li>
            <li>Allow microphone, webcam, and audio access.</li>
            <li>Use only Google Chrome.</li>
            <li>Exiting full-screen submits the exam.</li>
            <li>Use of the Keyboard Shortcuts Autosubmits Exams.</li>
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
            disabled={!isChrome || !acknowledged}
            className="w-full h-[45px] bg-teal-800 text-white font-bold hover:bg-teal-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-[40px] transition-colors mb-3"
          >
            Proceed to Login
          </button>

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