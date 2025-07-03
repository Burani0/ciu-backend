import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SuccessPopup.css';

interface SuccessPopupProps {
  show: boolean;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ show }) => {
  const navigate = useNavigate();

  if (!show) return null;

  const handleOkay = () => {
    navigate('/');
  };

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>Exam Submitted Successfully</h2>
        <button onClick={handleOkay}>Okay</button>
      </div>
    </div>
  );
};

export default SuccessPopup;
