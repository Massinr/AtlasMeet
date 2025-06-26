import React, { useState, useRef, useCallback } from 'react';
import { Camera, Upload, X, User, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ProfilePictureUpload.css';

interface ProfilePictureUploadProps {
  onClose?: () => void;
  showModal?: boolean;
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ onClose, showModal = false }) => {
  const { user, updateProfilePicture, removeProfilePicture } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleSave = async () => {
    if (!preview) return;
    
    setIsUploading(true);
    setError(null);
    
    try {
      const success = await updateProfilePicture(preview);
      if (success) {
        setPreview(null);
        onClose?.();
      } else {
        setError('Failed to update profile picture. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while updating your profile picture.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = async () => {
    setIsUploading(true);
    setError(null);
    
    try {
      const success = await removeProfilePicture();
      if (success) {
        setPreview(null);
        onClose?.();
      } else {
        setError('Failed to remove profile picture. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while removing your profile picture.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setError(null);
    onClose?.();
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderCurrentPicture = () => {
    if (user?.profilePicture) {
      return (
        <img 
          src={user.profilePicture} 
          alt="Profile" 
          className="current-picture"
        />
      );
    }
    
    return (
      <div className="current-picture-placeholder">
        <User size={32} />
        <span className="initials">{getInitials(user?.name || '')}</span>
      </div>
    );
  };

  const renderUploadArea = () => {
    if (preview) {
      return (
        <div className="preview-container">
          <img src={preview} alt="Preview" className="preview-image" />
          <div className="preview-actions">
            <button 
              className="glass-button primary"
              onClick={handleSave}
              disabled={isUploading}
            >
              {isUploading ? 'Saving...' : (
                <>
                  <Check size={16} />
                  Save Picture
                </>
              )}
            </button>
            <button 
              className="glass-button"
              onClick={() => setPreview(null)}
              disabled={isUploading}
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <div 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        
        <div className="upload-content">
          <div className="upload-icon">
            <Upload size={48} />
          </div>
          <h3>Upload Profile Picture</h3>
          <p>Drag and drop an image here, or click to browse</p>
          <div className="upload-requirements">
            <span>• JPEG, PNG, or GIF</span>
            <span>• Max 5MB</span>
            <span>• Square images work best</span>
          </div>
        </div>
      </div>
    );
  };

  if (showModal) {
    return (
      <div className="profile-picture-modal-overlay">
        <div className="profile-picture-modal glass-card">
          <div className="modal-header">
            <h2>Profile Picture</h2>
            <button className="close-button" onClick={handleCancel}>
              <X size={20} />
            </button>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <div className="modal-content">
            <div className="current-picture-section">
              <h3>Current Picture</h3>
              <div className="current-picture-container">
                {renderCurrentPicture()}
                {user?.profilePicture && (
                  <button 
                    className="remove-button glass-button"
                    onClick={handleRemove}
                    disabled={isUploading}
                  >
                    <X size={16} />
                    Remove
                  </button>
                )}
              </div>
            </div>

            <div className="upload-section">
              <h3>Upload New Picture</h3>
              {renderUploadArea()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-picture-upload">
      <div className="current-picture-section">
        <h3>Profile Picture</h3>
        <div className="current-picture-container">
          {renderCurrentPicture()}
          <button 
            className="change-button glass-button"
            onClick={openFileDialog}
          >
            <Camera size={16} />
            Change Picture
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {preview && (
        <div className="preview-overlay">
          <div className="preview-modal glass-card">
            <div className="preview-header">
              <h3>Preview</h3>
              <button className="close-button" onClick={() => setPreview(null)}>
                <X size={20} />
              </button>
            </div>
            
            {error && (
              <div className="error-message">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="preview-content">
              <img src={preview} alt="Preview" className="preview-image" />
              <div className="preview-actions">
                <button 
                  className="glass-button primary"
                  onClick={handleSave}
                  disabled={isUploading}
                >
                  {isUploading ? 'Saving...' : (
                    <>
                      <Check size={16} />
                      Save Picture
                    </>
                  )}
                </button>
                <button 
                  className="glass-button"
                  onClick={() => setPreview(null)}
                  disabled={isUploading}
                >
                  <X size={16} />
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUpload; 