import React, { useState } from 'react';
import { Upload, FileText, X, Check } from 'lucide-react';
import './CVUpload.css';

interface CVUploadProps {
  onCVSubmit: (cvContent: string) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const CVUpload: React.FC<CVUploadProps> = ({ onCVSubmit, onCancel, isSubmitting = false }) => {
  const [cvContent, setCvContent] = useState('');
  const [isValid, setIsValid] = useState(false);

  const handleCVChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    setCvContent(content);
    setIsValid(content.trim().length >= 50); // Minimum 50 characters
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid && cvContent.trim()) {
      onCVSubmit(cvContent.trim());
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCvContent(content);
        setIsValid(content.trim().length >= 50);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="cv-upload-overlay">
      <div className="cv-upload-modal glass-card">
        <div className="cv-upload-header">
          <h2>Upload Your CV/Resume</h2>
          <button className="close-button" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="cv-upload-content">
          <p className="cv-description">
            Please provide your CV or resume to help the teacher evaluate your application. 
            Include your educational background, relevant experience, and skills.
          </p>

          <form onSubmit={handleSubmit} className="cv-form">
            <div className="cv-input-section">
              <label htmlFor="cv-content" className="cv-label">
                <FileText size={16} />
                CV/Resume Content
              </label>
              
              <div className="cv-input-wrapper">
                <textarea
                  id="cv-content"
                  value={cvContent}
                  onChange={handleCVChange}
                  placeholder="Describe your educational background, relevant experience, skills, and why you want to attend this event..."
                  className="cv-textarea"
                  rows={8}
                  required
                />
                <div className="cv-character-count">
                  {cvContent.length}/1000 characters
                  {cvContent.length >= 50 && <Check size={14} className="valid-icon" />}
                </div>
              </div>

              <div className="cv-file-upload">
                <label htmlFor="cv-file" className="file-upload-label">
                  <Upload size={16} />
                  Or upload a text file
                </label>
                <input
                  type="file"
                  id="cv-file"
                  accept=".txt,.md"
                  onChange={handleFileUpload}
                  className="file-input"
                />
              </div>
            </div>

            <div className="cv-requirements">
              <h4>Requirements:</h4>
              <ul>
                <li>Minimum 50 characters</li>
                <li>Include educational background</li>
                <li>Mention relevant experience</li>
                <li>List applicable skills</li>
                <li>Explain your interest in the event</li>
              </ul>
            </div>

            <div className="cv-actions">
              <button
                type="button"
                className="glass-button secondary"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="glass-button primary"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CVUpload; 