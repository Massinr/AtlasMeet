import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { useAlertManager } from '../components/AlertManager';
import CVUpload from '../components/CVUpload';
import ProfilePicture from '../components/ProfilePicture';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  User, 
  Tag, 
  Link, 
  ArrowLeft,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Monitor,
  ExternalLink
} from 'lucide-react';
import './EventDetails.css';

const EventDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getEventById, getRegistrationsByEventId, registerForEvent, unregisterFromEvent, deleteEvent } = useEvents();
  const { showConfirm, showSuccess, showError } = useAlertManager();
  const [isLoading, setIsLoading] = useState(false);
  const [showCVUpload, setShowCVUpload] = useState(false);

  const event = id ? getEventById(id) : null;
  const registrations = event ? getRegistrationsByEventId(event.id) : [];
  const isRegistered = user ? registrations.some(reg => reg.studentId === user.id) : false;
  const isOwner = user && event ? event.teacherId === user.id : false;

  if (!event) {
    return (
      <div className="event-details-page">
        <div className="not-found glass-card">
          <h2>Event Not Found</h2>
          <p>The event you're looking for doesn't exist or has been removed.</p>
          <button 
            className="glass-button primary"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleRegister = () => {
    if (!user) return;
    setShowCVUpload(true);
  };

  const handleCVSubmit = async (cvContent: string) => {
    if (!user) return;
    setIsLoading(true);
    setShowCVUpload(false);
    
    const success = await registerForEvent(
      event.id, 
      user.id, 
      user.name, 
      user.email || 'student@example.com', 
      cvContent
    );
    
    if (success) {
      showSuccess('Application Submitted!', 'Your application has been submitted and is pending teacher approval. You\'ll be notified once it\'s reviewed.');
    } else {
      showError('Application Failed', 'Failed to submit your application. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleUnregister = async () => {
    if (!user) return;
    
    showConfirm(
      'Withdraw Application',
      'Are you sure you want to withdraw your application? This action cannot be undone.',
      async () => {
        setIsLoading(true);
        const success = await unregisterFromEvent(event.id, user.id);
        if (success) {
          showSuccess('Application Withdrawn', 'Your application has been withdrawn successfully.');
        } else {
          showError('Withdrawal Failed', 'Failed to withdraw your application. Please try again.');
        }
        setIsLoading(false);
      }
    );
  };

  const handleDelete = async () => {
    showConfirm(
      'Delete Event',
      `Are you sure you want to delete "${event.title}"? This action cannot be undone and will remove all associated applications.`,
      async () => {
        const success = await deleteEvent(event.id);
        if (success) {
          showSuccess('Event Deleted', 'The event has been successfully deleted.');
          navigate('/dashboard/teacher');
        } else {
          showError('Delete Failed', 'Failed to delete the event. Please try again.');
        }
      }
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventFull = event.registeredCount >= event.capacity;
  const isRegistrationDeadlinePassed = new Date(event.registrationDeadline) < new Date();

  return (
    <div className="event-details-page">
      <div className="details-container">
        {/* Header */}
        <div className="details-header">
          <button 
            className="back-button glass-button"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            Back
          </button>
          
          {isOwner && (
            <div className="owner-actions">
              <button
                className="glass-button"
                onClick={() => navigate(`/dashboard/event/edit/${event.id}`)}
              >
                <Edit size={20} />
                Edit
              </button>
              <button
                className="glass-button delete"
                onClick={handleDelete}
              >
                <Trash2 size={20} />
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Event Card */}
        <div className="event-details-card glass-card">
          <div className="event-header">
            <div className="event-title-section">
              <h1>{event.title}</h1>
              <div className="event-meta">
                <span className="event-category">{event.category}</span>
                {event.isVirtual && <span className="virtual-badge">Virtual</span>}
                {isEventFull && <span className="full-badge">Full</span>}
                {isRegistrationDeadlinePassed && <span className="deadline-badge">Registration Closed</span>}
              </div>
            </div>
          </div>

          <div className="event-content">
            <div className="event-info-grid">
              <div className="info-item">
                <Calendar className="info-icon" />
                <div className="info-content">
                  <label>Date</label>
                  <span>{formatDate(event.date)}</span>
                </div>
              </div>

              <div className="info-item">
                <Clock className="info-icon" />
                <div className="info-content">
                  <label>Time</label>
                  <span>{formatTime(event.time)}</span>
                </div>
              </div>

              <div className="info-item">
                <MapPin className="info-icon" />
                <div className="info-content">
                  <label>Location</label>
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="info-item">
                <Users className="info-icon" />
                <div className="info-content">
                  <label>Capacity</label>
                  <span>{event.registeredCount}/{event.capacity} registered</span>
                </div>
              </div>

              <div className="info-item">
                <User className="info-icon" />
                <div className="info-content">
                  <label>Organizer</label>
                  <div className="teacher-info">
                    <ProfilePicture 
                      src={event.teacherProfilePicture}
                      name={event.teacherName}
                      size="sm"
                    />
                    <span>{event.teacherName}</span>
                  </div>
                </div>
              </div>

              <div className="info-item">
                <Calendar className="info-icon" />
                <div className="info-content">
                  <label>Registration Deadline</label>
                  <span>{formatDate(event.registrationDeadline)}</span>
                </div>
              </div>
            </div>

            {event.isVirtual && event.meetingLink && (
              <div className="meeting-link-section">
                <div className="meeting-link-header">
                  <Monitor className="meeting-icon" />
                  <h3>Virtual Meeting</h3>
                </div>
                <a 
                  href={event.meetingLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="meeting-link glass-button"
                >
                  <ExternalLink size={20} />
                  Join Meeting
                </a>
              </div>
            )}

            <div className="event-description-section">
              <h3>Description</h3>
              <p>{event.description}</p>
            </div>

            {/* Registration Section */}
            {user?.role === 'student' && (
              <div className="registration-section">
                {isRegistered ? (
                  <div className="registration-status registered">
                    <CheckCircle size={24} />
                    <div>
                      <h4>Application Submitted!</h4>
                      <p>Your application has been submitted and is pending teacher approval. You'll be notified once it's reviewed.</p>
                    </div>
                    <button
                      className="glass-button secondary"
                      onClick={handleUnregister}
                      disabled={isLoading}
                    >
                      <XCircle size={20} />
                      Withdraw Application
                    </button>
                  </div>
                ) : (
                  <div className="registration-status available">
                    <div>
                      <h4>Apply for This Event</h4>
                      <p>Submit your CV/resume to apply for this event. The teacher will review your application.</p>
                    </div>
                    <button
                      className="glass-button primary"
                      onClick={handleRegister}
                      disabled={isLoading || isEventFull || isRegistrationDeadlinePassed}
                    >
                      <CheckCircle size={20} />
                      {isLoading ? 'Processing...' : 'Apply Now'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Registrations List (for teachers) */}
            {isOwner && (
              <div className="registrations-section">
                <h3>Applications ({registrations.length})</h3>
                {registrations.length === 0 ? (
                  <p className="no-registrations">No applications yet</p>
                ) : (
                  <div className="registrations-list">
                    {registrations.map((registration) => (
                      <div key={registration.id} className="registration-item">
                        <div className="registration-info">
                          <span className="student-name">{registration.studentName}</span>
                          <span className="student-email">{registration.studentEmail}</span>
                          <span className="registration-status-badge">
                            {registration.status === 'pending' && 'Pending Review'}
                            {registration.status === 'approved' && 'Approved'}
                            {registration.status === 'rejected' && 'Rejected'}
                          </span>
                          <span className="registration-date">
                            Applied on {formatDate(registration.registeredAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CV Upload Modal */}
      {showCVUpload && (
        <CVUpload
          onCVSubmit={handleCVSubmit}
          onCancel={() => setShowCVUpload(false)}
          isSubmitting={isLoading}
        />
      )}
    </div>
  );
};

export default EventDetails; 