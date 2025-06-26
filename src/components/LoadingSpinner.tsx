import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Loading...',
  fullScreen = false 
}) => {
  const sizeMap = {
    small: 20,
    medium: 32,
    large: 48
  };

  const spinnerSize = sizeMap[size];

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className="loading-content glass-card">
          <Loader2 size={spinnerSize} className="loading-spinner" />
          {text && <p className="loading-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <Loader2 size={spinnerSize} className="loading-spinner" />
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
};

export default LoadingSpinner; 