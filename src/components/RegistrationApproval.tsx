import React, { useState } from 'react';
import { Check, X, Clock, User, Mail, Calendar, FileText, MessageSquare } from 'lucide-react';
import { Registration } from '../context/EventContext';
import './RegistrationApproval.css';

interface RegistrationApprovalProps {
  registration: Registration;
  onApprove: (registrationId: string, notes?: string) => void;
  onReject: (registrationId: string, notes?: string) => void;
  isProcessing?: boolean;
}

const RegistrationApproval: React.FC<RegistrationApprovalProps> = ({
  registration,
  onApprove,
  onReject,
  isProcessing = false
}) => {
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleApprove = () => {
    onApprove(registration.id, notes.trim() || undefined);
  };

  const handleReject = () => {
    onReject(registration.id, notes.trim() || undefined);
  };

  const getStatusIcon = () => {
    switch (registration.status) {
      case 'approved':
        return <Check size={16} className="status-icon approved" />;
      case 'rejected':
        return <X size={16} className="status-icon rejected" />;
      default:
        return <Clock size={16} className="status-icon pending" />;
    }
  };

  const getStatusText = () => {
    switch (registration.status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Pending Review';
    }
  };

  const getStatusClass = () => {
    switch (registration.status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`registration-card glass-card ${getStatusClass()}`}>
      <div className="registration-header">
        <div className="student-info">
          <div className="student-avatar">
            <User size={20} />
          </div>
          <div className="student-details">
            <h3 className="student-name">{registration.studentName}</h3>
            <div className="student-email">
              <Mail size={14} />
              {registration.studentEmail}
            </div>
          </div>
        </div>
        
        <div className="registration-status">
          {getStatusIcon()}
          <span className="status-text">{getStatusText()}</span>
        </div>
      </div>

      <div className="registration-meta">
        <div className="meta-item">
          <Calendar size={14} />
          <span>Applied: {formatDate(registration.registeredAt)}</span>
        </div>
        {registration.reviewedAt && (
          <div className="meta-item">
            <Check size={14} />
            <span>Reviewed: {formatDate(registration.reviewedAt)}</span>
          </div>
        )}
      </div>

      <div className="cv-section">
        <div className="cv-header">
          <FileText size={16} />
          <h4>CV/Resume</h4>
        </div>
        <div className="cv-content">
          <p>{registration.cvContent}</p>
        </div>
      </div>

      {registration.teacherNotes && (
        <div className="teacher-notes">
          <div className="notes-header">
            <MessageSquare size={16} />
            <h4>Teacher Notes</h4>
          </div>
          <p>{registration.teacherNotes}</p>
        </div>
      )}

      {registration.status === 'pending' && (
        <div className="approval-actions">
          <div className="notes-toggle">
            <button
              type="button"
              className="notes-toggle-btn"
              onClick={() => setShowNotes(!showNotes)}
            >
              <MessageSquare size={14} />
              {showNotes ? 'Hide Notes' : 'Add Notes'}
            </button>
          </div>

          {showNotes && (
            <div className="notes-input">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add optional notes about your decision..."
                rows={3}
                className="notes-textarea"
              />
            </div>
          )}

          <div className="action-buttons">
            <button
              type="button"
              className="glass-button reject"
              onClick={handleReject}
              disabled={isProcessing}
            >
              <X size={16} />
              Reject
            </button>
            <button
              type="button"
              className="glass-button approve"
              onClick={handleApprove}
              disabled={isProcessing}
            >
              <Check size={16} />
              Approve
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationApproval; 