import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import ProfilePicture from './ProfilePicture';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Eye, 
  Edit, 
  Trash2,
  Monitor,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import './EventCard.css';

interface EventCardProps {
  event: any;
  showActions?: boolean;
  showTeacherInfo?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  showActions = true, 
  showTeacherInfo = true,
  variant = 'default'
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getRegistrationsByEventId, registerForEvent, unregisterFromEvent, deleteEvent } = useEvents();

  const registrations = getRegistrationsByEventId(event.id);
  const isRegistered = user ? registrations.some(reg => reg.studentId === user.id) : false;
  const isOwner = user && event.teacherId === user.id;
  const isEventFull = event.registeredCount >= event.capacity;
  const isRegistrationDeadlinePassed = new Date(event.registrationDeadline) < new Date();
  const isUpcoming = new Date(event.date) > new Date();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Workshop': 'var(--success)',
      'Lecture': 'var(--accent-cyan)',
      'Seminar': 'var(--accent-purple)',
      'Training': 'var(--warning)',
      'Conference': 'var(--error)',
      'Study Group': 'var(--info)',
      'Other': 'var(--text-muted)'
    };
    return colors[category] || colors['Other'];
  };

  const handleViewDetails = () => {
    navigate(`/dashboard/event/${event.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/dashboard/event/edit/${event.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEvent(event.id);
    }
  };

  const handleRegister = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    
    if (isRegistered) {
      await unregisterFromEvent(event.id, user.id);
    } else {
      navigate(`/dashboard/event/${event.id}`);
    }
  };

  return (
    <div className={`event-card event-card-${variant}`} onClick={handleViewDetails}>
      {/* Header */}
      <div className="event-card-header">
        <div className="event-category">
          <Tag size={14} />
          <span 
            className="category-badge"
            style={{ backgroundColor: `${getCategoryColor(event.category)}20`, color: getCategoryColor(event.category) }}
          >
            {event.category}
          </span>
        </div>
        
        {showActions && (
          <div className="event-actions" onClick={(e) => e.stopPropagation()}>
            {isOwner ? (
              <>
                <button className="action-btn edit" onClick={handleEdit} title="Edit Event">
                  <Edit size={16} />
                </button>
                <button className="action-btn delete" onClick={handleDelete} title="Delete Event">
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <button className="action-btn view" onClick={handleViewDetails} title="View Details">
                <Eye size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="event-card-content">
        <h3 className="event-title">{event.title}</h3>
        <p className="event-description">{event.description}</p>
        
        <div className="event-details">
          <div className="detail-item">
            <Calendar size={16} />
            <span>{formatDate(event.date)}</span>
          </div>
          <div className="detail-item">
            <Clock size={16} />
            <span>{formatTime(event.time)}</span>
          </div>
          <div className="detail-item">
            <MapPin size={16} />
            <span>{event.isVirtual ? 'Virtual Event' : event.location}</span>
          </div>
          <div className="detail-item">
            <Users size={16} />
            <span>{event.registeredCount}/{event.capacity} registered</span>
          </div>
        </div>

        {/* Status Badges */}
        <div className="event-status">
          <div className={`status-badge ${isUpcoming ? 'upcoming' : 'past'}`}>
            {isUpcoming ? <CheckCircle size={14} /> : <XCircle size={14} />}
            {isUpcoming ? 'Upcoming' : 'Past'}
          </div>
          
          {isEventFull && (
            <div className="status-badge full">
              <AlertCircle size={14} />
              Full
            </div>
          )}
          
          {isRegistrationDeadlinePassed && (
            <div className="status-badge deadline">
              <AlertCircle size={14} />
              Registration Closed
            </div>
          )}
          
          {event.isVirtual && (
            <div className="status-badge virtual">
              <Monitor size={14} />
              Virtual
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="event-card-footer">
        {showTeacherInfo && (
          <div className="teacher-info">
            <ProfilePicture 
              src={event.teacherProfilePicture}
              name={event.teacherName}
              size="sm"
            />
            <div className="teacher-details">
              <span className="teacher-name">{event.teacherName}</span>
              <span className="teacher-role">Organizer</span>
            </div>
          </div>
        )}
        
        {!isOwner && user && (
          <button 
            className={`register-btn ${isRegistered ? 'registered' : ''}`}
            onClick={handleRegister}
            disabled={isEventFull || isRegistrationDeadlinePassed}
          >
            {isRegistered ? 'Registered' : 'Register'}
          </button>
        )}
      </div>

      {/* Virtual Meeting Link */}
      {event.isVirtual && event.meetingLink && (
        <div className="meeting-link-section">
          <a 
            href={event.meetingLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="meeting-link"
            onClick={(e) => e.stopPropagation()}
          >
            <ExternalLink size={16} />
            Join Meeting
          </a>
        </div>
      )}
    </div>
  );
};

export default EventCard; 