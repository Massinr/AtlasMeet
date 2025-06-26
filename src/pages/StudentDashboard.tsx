import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationPanel from '../components/NotificationPanel';
import ProfilePicture from '../components/ProfilePicture';
import { 
  Calendar, 
  Users, 
  Search, 
  Filter,
  Clock,
  MapPin,
  User,
  BookOpen,
  CheckCircle,
  XCircle,
  Eye,
  AlertCircle,
  Clock as ClockIcon,
  Bell
} from 'lucide-react';
import './Dashboard.css';

const StudentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { events, getRegistrationsByStudentId, registerForEvent, unregisterFromEvent, searchEvents } = useEvents();
  const { getUnreadCountByUserId } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState<'events' | 'teachers' | 'locations'>('events');
  const [activeTab, setActiveTab] = useState<'browse' | 'my-events'>('browse');
  const [showNotifications, setShowNotifications] = useState(false);

  const myRegistrations = user ? getRegistrationsByStudentId(user.id) : [];
  const myEventIds = myRegistrations.map(reg => reg.eventId);
  const myEvents = events.filter(event => myEventIds.includes(event.id));
  const availableEvents = events.filter(event => !myEventIds.includes(event.id));
  const unreadNotifications = user ? getUnreadCountByUserId(user.id) : 0;

  const categories = ['all', ...Array.from(new Set(events.map(event => event.category)))];

  // Enhanced search functionality
  const filteredEvents = (() => {
    const eventsToFilter = activeTab === 'browse' ? availableEvents : myEvents;
    
    if (!searchTerm.trim()) {
      return eventsToFilter.filter(event => 
        selectedCategory === 'all' || event.category === selectedCategory
      );
    }

    // Use the searchEvents function from context with appropriate filters
    const searchResults = searchEvents(searchTerm, {
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      teacherName: searchFilter === 'teachers' ? searchTerm : undefined,
      location: searchFilter === 'locations' ? searchTerm : undefined
    });

    // Filter based on active tab
    return searchResults.filter(event => 
      activeTab === 'browse' ? !myEventIds.includes(event.id) : myEventIds.includes(event.id)
    );
  })();

  const handleRegister = async (eventId: string) => {
    if (user) {
      // Navigate to event details page where CV upload will be handled
      navigate(`/dashboard/event/${eventId}`);
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (user) {
      await unregisterFromEvent(eventId, user.id);
    }
  };

  const getApplicationStatus = (eventId: string) => {
    const registration = myRegistrations.find(reg => reg.eventId === eventId);
    return registration?.status || 'none';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={16} className="status-icon approved" />;
      case 'rejected':
        return <XCircle size={16} className="status-icon rejected" />;
      case 'pending':
        return <ClockIcon size={16} className="status-icon pending" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
        return 'Pending Review';
      default:
        return 'Not Applied';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isEventFull = (event: any) => {
    return event.registeredCount >= event.capacity;
  };

  const isRegistrationDeadlinePassed = (event: any) => {
    return new Date(event.registrationDeadline) < new Date();
  };

  return (
    <div className="dashboard">
      {/* Header with Notifications */}
      <div className="dashboard-header-with-notifications">
        <div className="dashboard-header-content">
          <div className="dashboard-user-info">
            <ProfilePicture 
              src={user?.profilePicture}
              name={user?.name || ''}
              size="lg"
            />
            <div>
              <h1>Student Dashboard</h1>
              <p>Welcome back, {user?.name}!</p>
            </div>
          </div>
        </div>
        <div className="dashboard-header-actions">
          <button
            className="notification-bell glass-button"
            onClick={() => setShowNotifications(true)}
            title="View Notifications"
          >
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span className="notification-badge">{unreadNotifications}</span>
            )}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview grid grid-3">
        <div className="stat-card glass-card">
          <div className="stat-icon">
            <Calendar className="icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{availableEvents.length}</div>
            <div className="stat-label">Available Events</div>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon">
            <BookOpen className="icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">{myEvents.length}</div>
            <div className="stat-label">My Applications</div>
          </div>
        </div>

        <div className="stat-card glass-card">
          <div className="stat-icon">
            <AlertCircle className="icon" />
          </div>
          <div className="stat-content">
            <div className="stat-number">
              {myRegistrations.filter(reg => reg.status === 'pending').length}
            </div>
            <div className="stat-label">Pending Reviews</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`tab-button ${activeTab === 'browse' ? 'active' : ''}`}
          onClick={() => setActiveTab('browse')}
        >
          <Search size={20} />
          Browse Events
        </button>
        <button
          className={`tab-button ${activeTab === 'my-events' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-events')}
        >
          <BookOpen size={20} />
          My Applications
        </button>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder={
              searchFilter === 'events' ? 'Search events by title or description...' :
              searchFilter === 'teachers' ? 'Search by teacher name...' :
              'Search by location...'
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass-input"
          />
          <div className="search-placeholder">
            {searchFilter === 'events' && 'Search for events, workshops, lectures...'}
            {searchFilter === 'teachers' && 'Find events by specific teachers...'}
            {searchFilter === 'locations' && 'Find events in specific locations...'}
          </div>
        </div>
        
        <div className="filter-box">
          <Filter className="filter-icon" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="glass-input"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Filter Options */}
      <div className="search-filter-options">
        <div className="search-filter-tabs">
          <button
            className={`search-filter-tab ${searchFilter === 'events' ? 'active' : ''}`}
            onClick={() => setSearchFilter('events')}
          >
            Events
          </button>
          <button
            className={`search-filter-tab ${searchFilter === 'teachers' ? 'active' : ''}`}
            onClick={() => setSearchFilter('teachers')}
          >
            Teachers
          </button>
          <button
            className={`search-filter-tab ${searchFilter === 'locations' ? 'active' : ''}`}
            onClick={() => setSearchFilter('locations')}
          >
            Locations
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="dashboard-section">
        <h2>{activeTab === 'browse' ? 'Available Events' : 'My Applications'}</h2>
        
        {filteredEvents.length === 0 ? (
          <div className="empty-state glass-card">
            <Calendar className="empty-icon" />
            <h3>
              {activeTab === 'browse' 
                ? 'No Events Available' 
                : 'No Applications Yet'}
            </h3>
            <p>
              {activeTab === 'browse' 
                ? 'Check back later for new events or try adjusting your search filters'
                : 'Browse available events to start your learning journey'}
            </p>
            {activeTab === 'my-events' && (
              <button 
                className="glass-button primary"
                onClick={() => setActiveTab('browse')}
              >
                <Search size={20} />
                Browse Events
              </button>
            )}
          </div>
        ) : (
          <div className="events-grid grid grid-2">
            {filteredEvents.map((event) => {
              const applicationStatus = getApplicationStatus(event.id);
              const isRegistered = myEventIds.includes(event.id);
              const isFull = isEventFull(event);
              const isDeadlinePassed = isRegistrationDeadlinePassed(event);
              
              return (
                <div key={event.id} className="event-card glass-card">
                  <div className="event-header">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-actions">
                      <button
                        className="action-button"
                        onClick={() => navigate(`/dashboard/event/${event.id}`)}
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="event-details">
                    <div className="event-info">
                      <div className="info-item">
                        <Clock size={16} />
                        <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
                      </div>
                      <div className="info-item">
                        <MapPin size={16} />
                        <span>{event.location}</span>
                      </div>
                      <div className="info-item">
                        <Users size={16} />
                        <span>{event.registeredCount}/{event.capacity} registered</span>
                      </div>
                    </div>

                    <div className="event-category">
                      <span className="category-tag">{event.category}</span>
                      {event.isVirtual && <span className="virtual-tag">Virtual</span>}
                      {isFull && <span className="full-tag">Full</span>}
                      {isDeadlinePassed && <span className="deadline-tag">Registration Closed</span>}
                    </div>

                    <p className="event-description">{event.description}</p>

                    {/* Teacher Info with Profile Picture */}
                    <div className="event-teacher-info">
                      <ProfilePicture 
                        src={event.teacherProfilePicture}
                        name={event.teacherName}
                        size="sm"
                      />
                      <div className="teacher-info">
                        <div className="teacher-name">{event.teacherName}</div>
                        <div className="teacher-role">Event Organizer</div>
                      </div>
                    </div>

                    <div className="event-footer">
                      {activeTab === 'browse' ? (
                        <button
                          className={`glass-button ${isRegistered ? 'secondary' : 'primary'}`}
                          onClick={() => isRegistered 
                            ? handleUnregister(event.id) 
                            : handleRegister(event.id)
                          }
                          disabled={isFull || isDeadlinePassed}
                        >
                          {isRegistered ? (
                            <>
                              <XCircle size={16} />
                              Withdraw Application
                            </>
                          ) : (
                            <>
                              <CheckCircle size={16} />
                              Apply Now
                            </>
                          )}
                        </button>
                      ) : (
                        <div className={`application-status ${getStatusClass(applicationStatus)}`}>
                          {getStatusIcon(applicationStatus)}
                          <span>{getStatusText(applicationStatus)}</span>
                          {applicationStatus !== 'none' && (
                            <span className="application-date">
                              Applied on {formatDate(myRegistrations.find(r => r.eventId === event.id)?.registeredAt || '')}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};

export default StudentDashboard; 