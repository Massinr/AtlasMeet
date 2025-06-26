import React, { useState, useEffect, useRef } from 'react';
import './CustomPrompt.css';

export interface PromptOptions {
  title: string;
  message: string;
  type?: 'confirm' | 'warning' | 'danger' | 'info';
  confirmText?: string;
  cancelText?: string;
  showInput?: boolean;
  inputPlaceholder?: string;
  inputType?: 'text' | 'password' | 'email';
  inputValue?: string;
  inputRequired?: boolean;
  onConfirm?: (inputValue?: string) => void;
  onCancel?: () => void;
}

interface CustomPromptProps {
  isOpen: boolean;
  options: PromptOptions;
  onClose: () => void;
}

const CustomPrompt: React.FC<CustomPromptProps> = ({ isOpen, options, onClose }) => {
  const [inputValue, setInputValue] = useState(options.inputValue || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && options.showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, options.showInput]);

  useEffect(() => {
    setInputValue(options.inputValue || '');
  }, [options.inputValue]);

  const handleConfirm = () => {
    if (options.showInput && options.inputRequired && !inputValue.trim()) {
      return; // Don't close if input is required but empty
    }
    
    if (options.onConfirm) {
      options.onConfirm(options.showInput ? inputValue : undefined);
    }
    onClose();
  };

  const handleCancel = () => {
    if (options.onCancel) {
      options.onCancel();
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleConfirm();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const getIcon = () => {
    switch (options.type) {
      case 'confirm':
        return '✓';
      case 'warning':
        return '⚠';
      case 'danger':
        return '✕';
      case 'info':
        return 'ℹ';
      default:
        return '?';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="prompt-overlay" onClick={onClose}>
      <div className="prompt-container" onClick={(e) => e.stopPropagation()}>
        <div className="prompt-header">
          <div className={`prompt-icon ${options.type || 'confirm'}`}>
            {getIcon()}
          </div>
          <h3 className="prompt-title">{options.title}</h3>
        </div>
        
        <div className="prompt-body">
          <p className="prompt-message">{options.message}</p>
          
          {options.showInput && (
            <div className="prompt-input">
              <input
                ref={inputRef}
                type={options.inputType || 'text'}
                placeholder={options.inputPlaceholder || ''}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                required={options.inputRequired}
              />
            </div>
          )}
        </div>
        
        <div className="prompt-actions">
          <button
            className="prompt-button cancel"
            onClick={handleCancel}
          >
            {options.cancelText || 'Cancel'}
          </button>
          
          <button
            className={`prompt-button ${options.type || 'confirm'}`}
            onClick={handleConfirm}
            disabled={options.showInput && options.inputRequired && !inputValue.trim()}
          >
            {options.confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomPrompt; 