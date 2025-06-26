import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import './CustomAlert.css';

export interface AlertProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  onClose: (id: string) => void;
  duration?: number; // Auto-close duration in milliseconds
  showCloseButton?: boolean;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
}

const CustomAlert: React.FC<AlertProps> = ({
  id,
  type,
  title,
  message,
  onClose,
  duration = 5000,
  showCloseButton = true,
  actions = []
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Auto-close if duration is set
    if (duration > 0) {
      const autoCloseTimer = setTimeout(() => handleClose(), duration);
      return () => {
        clearTimeout(timer);
        clearTimeout(autoCloseTimer);
      };
    }
    
    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => onClose(id), 300); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  const getTypeClass = () => {
    return `alert-${type}`;
  };

  return (
    <div className={`custom-alert ${getTypeClass()} ${isVisible ? 'visible' : ''} ${isClosing ? 'closing' : ''}`}>
      <div className="alert-icon">
        {getIcon()}
      </div>
      
      <div className="alert-content">
        <div className="alert-header">
          <h4 className="alert-title">{title}</h4>
          {showCloseButton && (
            <button className="alert-close" onClick={handleClose}>
              <X size={16} />
            </button>
          )}
        </div>
        
        <p className="alert-message">{message}</p>
        
        {actions.length > 0 && (
          <div className="alert-actions">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`alert-action ${action.variant || 'secondary'}`}
                onClick={action.onClick}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomAlert; 