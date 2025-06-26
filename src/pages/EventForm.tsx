import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { discordLogger } from '../services/DiscordLogger';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Link, 
  Save, 
  ArrowLeft,
  Monitor
} from 'lucide-react';
import './EventForm.css';

const EventForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { createEvent, updateEvent, getEventById } = useEvents();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    capacity: 10,
    category: '',
    registrationDeadline: '',
    isVirtual: false,
    meetingLink: ''
  });

  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing && id) {
      const event = getEventById(id);
      if (event) {
        setFormData({
          title: event.title,
          description: event.description,
          date: event.date,
          time: event.time,
          location: event.location,
          capacity: event.capacity,
          category: event.category,
          registrationDeadline: event.registrationDeadline,
          isVirtual: event.isVirtual,
          meetingLink: event.meetingLink || ''
        });
      }
    }
  }, [isEditing, id, getEventById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validation
      if (!formData.title || !formData.description || !formData.date || 
          !formData.time || !formData.location || !formData.category || 
          !formData.registrationDeadline) {
        setError('Please fill in all required fields');
        setIsLoading(false);
        return;
      }

      if (formData.isVirtual && !formData.meetingLink) {
        setError('Meeting link is required for virtual events');
        setIsLoading(false);
        return;
      }

      if (formData.capacity < 1) {
        setError('Capacity must be at least 1');
        setIsLoading(false);
        return;
      }

      const eventData = {
        ...formData,
        teacherId: user!.id,
        teacherName: user!.name,
        teacherProfilePicture: user!.profilePicture,
      };

      let success;
      if (isEditing && id) {
        success = await updateEvent(id, eventData);
      } else {
        success = await createEvent(eventData);
        
        // Log event creation to Discord
        if (success && user) {
          await discordLogger.logEventCreation({
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            userRole: user.role === 'dev' ? 'teacher' : user.role,
            websiteId: user.websiteId,
            eventId: `event-${Date.now()}`,
            eventTitle: formData.title,
          });
        }
      }

      if (success) {
        navigate('/dashboard/teacher');
      } else {
        setError('Failed to save event. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }

    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.checked
    }));
  };

  return (
    <div className="event-form-page">
      <div className="form-container">
        <div className="form-header">
          <button 
            className="back-button glass-button"
            onClick={() => navigate('/dashboard/teacher')}
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1>{isEditing ? 'Edit Event' : 'Create New Event'}</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="event-form glass-card">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section">
              <h3>Basic Information</h3>
              
              <div className="form-group">
                <label htmlFor="title">Event Title *</label>
                <div className="input-wrapper">
                  <Calendar className="input-icon" />
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="glass-input"
                    placeholder="Enter event title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  className="glass-input"
                  placeholder="Describe your event..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <div className="input-wrapper">
                  <Tag className="input-icon" />
                  <select
                    id="category"
                    name="category"
                    className="glass-input"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Lecture">Lecture</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Training">Training</option>
                    <option value="Conference">Conference</option>
                    <option value="Study Group">Study Group</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="form-section">
              <h3>Date and Time</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Date *</label>
                  <div className="input-wrapper">
                    <Calendar className="input-icon" />
                    <input
                      type="date"
                      id="date"
                      name="date"
                      className="glass-input"
                      value={formData.date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="time">Time *</label>
                  <div className="input-wrapper">
                    <Clock className="input-icon" />
                    <input
                      type="time"
                      id="time"
                      name="time"
                      className="glass-input"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="registrationDeadline">Registration Deadline *</label>
                <div className="input-wrapper">
                  <Calendar className="input-icon" />
                  <input
                    type="datetime-local"
                    id="registrationDeadline"
                    name="registrationDeadline"
                    className="glass-input"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Location and Capacity */}
            <div className="form-section">
              <h3>Location and Capacity</h3>
              
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <div className="input-wrapper">
                  <MapPin className="input-icon" />
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="glass-input"
                    placeholder="Enter location or meeting link"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Capacity *</label>
                <div className="input-wrapper">
                  <Users className="input-icon" />
                  <input
                    type="number"
                    id="capacity"
                    name="capacity"
                    className="glass-input"
                    min="1"
                    max="1000"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isVirtual"
                    checked={formData.isVirtual}
                    onChange={handleCheckboxChange}
                    className="checkbox-input"
                  />
                  <Monitor className="checkbox-icon" />
                  <span>This is a virtual event</span>
                </label>
              </div>

              {formData.isVirtual && (
                <div className="form-group">
                  <label htmlFor="meetingLink">Meeting Link *</label>
                  <div className="input-wrapper">
                    <Link className="input-icon" />
                    <input
                      type="url"
                      id="meetingLink"
                      name="meetingLink"
                      className="glass-input"
                      placeholder="https://meet.google.com/..."
                      value={formData.meetingLink}
                      onChange={handleInputChange}
                      required={formData.isVirtual}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="glass-button"
              onClick={() => navigate('/dashboard/teacher')}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glass-button primary"
              disabled={isLoading}
            >
              <Save size={20} />
              {isLoading ? 'Saving...' : (isEditing ? 'Update Event' : 'Create Event')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm; 