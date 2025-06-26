import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { useAlertManager } from '../components/AlertManager';
import RegistrationApproval from '../components/RegistrationApproval';
import EventCard from '../components/EventCard';
import ProfilePicture from '../components/ProfilePicture';
import { Plus, Users, Calendar, MapPin, Clock, Edit, Trash2, Eye, LogOut, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import './Dashboard.css';

const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { 
    events, 
    getEventsByTeacherId, 
    getRegistrationsByEventId, 
    getPendingRegistrationsByEventId,
    getApprovedRegistrationsByEventId,
    approveRegistration,
    rejectRegistration,
    deleteEvent 
  } = useEvents();
  const { showConfirm, showSuccess, showError } = useAlertManager();
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const teacherEvents = getEventsByTeacherId(user?.id || '');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteEvent = async (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    showConfirm(
      'Delete Event',
      `Are you sure you want to delete "${event?.title}"? This action cannot be undone and will remove all associated applications.`,
      async () => {
        const success = await deleteEvent(eventId);
        if (success) {
          showSuccess('Event Deleted', 'The event has been successfully deleted.');
        } else {
          showError('Delete Failed', 'Failed to delete the event. Please try again.');
        }
      }
    );
  };

  const handleViewRegistrations = (eventId: string) => {
    setSelectedEvent(selectedEvent === eventId ? null : eventId);
  };

  const handleApproveRegistration = async (registrationId: string, notes?: string) => {
    setIsProcessing(true);
    const success = await approveRegistration(registrationId, notes);
    if (success) {
      showSuccess('Application Approved', 'The student application has been approved successfully.');
    } else {
      showError('Approval Failed', 'Failed to approve the application. Please try again.');
    }
    setIsProcessing(false);
  };

  const handleRejectRegistration = async (registrationId: string, notes?: string) => {
    setIsProcessing(true);
    const success = await rejectRegistration(registrationId, notes);
    if (success) {
      showSuccess('Application Rejected', 'The student application has been rejected.');
    } else {
      showError('Rejection Failed', 'Failed to reject the application. Please try again.');
    }
    setIsProcessing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <div className="dashboard-user-info">
            <ProfilePicture 
              src={user.profilePicture}
              name={user.name}
              size="lg"
            />
            <div>
              <h1>Teacher Dashboard</h1>
              <p>Welcome back, {user.name}!</p>
            </div>
          </div>
        </div>
        <div className="dashboard-actions">
          <button 
            className="glass-button primary"
            onClick={() => navigate('/dashboard/event/new')}
          >
            <Plus size={20} />
            Create Event
          </button>
          <button 
            className="glass-button secondary"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card glass-card">
          <div className="stat-icon">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <h3>{teacherEvents.length}</h3>
            <p>Total Events</p>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>
              {teacherEvents.reduce((total, event) => {
                const registrations = getRegistrationsByEventId(event.id);
                return total + registrations.length;
              }, 0)}
            </h3>
            <p>Total Applications</p>
          </div>
        </div>
        <div className="stat-card glass-card">
          <div className="stat-icon">
            <AlertCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>
              {teacherEvents.reduce((total, event) => {
                const pendingRegistrations = getPendingRegistrationsByEventId(event.id);
                return total + pendingRegistrations.length;
              }, 0)}
            </h3>
            <p>Pending Reviews</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="section-header">
          <h2>My Events</h2>
          <p>Manage your created events and review applications</p>
        </div>

        {teacherEvents.length === 0 ? (
          <div className="empty-state glass-card">
            <Calendar size={48} />
            <h3>No Events Yet</h3>
            <p>Create your first event to get started!</p>
            <button 
              className="glass-button primary"
              onClick={() => navigate('/dashboard/event/new')}
            >
              <Plus size={20} />
              Create Event
            </button>
          </div>
        ) : (
          <div className="events-grid">
            {teacherEvents.map((event) => {
              const registrations = getRegistrationsByEventId(event.id);
              const pendingRegistrations = getPendingRegistrationsByEventId(event.id);
              const approvedRegistrations = getApprovedRegistrationsByEventId(event.id);
              const isUpcoming = new Date(event.date) > new Date();
              
              return (
                <div key={event.id} className="event-card glass-card">
                  <div className="event-header">
                    <div className="event-category">
                      <span className={`category-badge ${event.category.toLowerCase()}`}>
                        {event.category}
                      </span>
                    </div>
                    <div className="event-actions">
                      <button
                        className="action-button"
                        onClick={() => navigate(`/dashboard/event/edit/${event.id}`)}
                        title="Edit Event"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-button"
                        onClick={() => handleDeleteEvent(event.id)}
                        title="Delete Event"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="event-content">
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
                        <span>{approvedRegistrations.length} / {event.capacity} approved</span>
                      </div>
                    </div>

                    <div className="event-status">
                      <div className={`status-badge ${isUpcoming ? 'upcoming' : 'past'}`}>
                        {isUpcoming ? 'Upcoming' : 'Past'}
                      </div>
                      <div className={`capacity-badge ${approvedRegistrations.length >= event.capacity ? 'full' : 'available'}`}>
                        {approvedRegistrations.length >= event.capacity ? 'Full' : 'Available'}
                      </div>
                      {pendingRegistrations.length > 0 && (
                        <div className="pending-badge">
                          <AlertCircle size={14} />
                          {pendingRegistrations.length} pending
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="event-footer">
                    <button
                      className="glass-button secondary"
                      onClick={() => handleViewRegistrations(event.id)}
                    >
                      <Eye size={16} />
                      View Applications ({registrations.length})
                    </button>
                  </div>

                  {selectedEvent === event.id && (
                    <div className="registrations-panel">
                      <div className="registrations-header">
                        <h4>Applications ({registrations.length})</h4>
                        <div className="registration-stats">
                          <span className="stat-item approved">
                            <CheckCircle size={14} />
                            {approvedRegistrations.length} approved
                          </span>
                          <span className="stat-item pending">
                            <AlertCircle size={14} />
                            {pendingRegistrations.length} pending
                          </span>
                        </div>
                      </div>
                      
                      {registrations.length === 0 ? (
                        <p className="no-registrations">No applications yet</p>
                      ) : (
                        <div className="registrations-list">
                          {registrations.map((registration) => (
                            <RegistrationApproval
                              key={registration.id}
                              registration={registration}
                              onApprove={handleApproveRegistration}
                              onReject={handleRejectRegistration}
                              isProcessing={isProcessing}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard; 