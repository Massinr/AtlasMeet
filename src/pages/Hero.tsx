import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, BookOpen, Sparkles, Clock, MapPin, ArrowRight, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import './Hero.css';

// Mock events for landing page (no real data for security)
const mockCurrentEvents = [
  {
    id: 'mock-1',
    title: 'Advanced React Development Workshop',
    description: 'Learn advanced React patterns, hooks, and state management techniques. Perfect for developers looking to level up their React skills.',
    category: 'Workshop',
    date: '2024-02-15',
    time: '14:00',
    location: 'Tech Hub Downtown',
    isVirtual: false,
    registeredCount: 28,
    capacity: 30,
    teacherName: 'Dr. Sarah Chen',
    status: 'active'
  },
  {
    id: 'mock-2',
    title: 'Machine Learning Fundamentals',
    description: 'Introduction to machine learning concepts, algorithms, and practical applications. No prior ML experience required.',
    category: 'Lecture',
    date: '2024-02-18',
    time: '10:00',
    location: 'Virtual Event',
    isVirtual: true,
    registeredCount: 45,
    capacity: 50,
    teacherName: 'Prof. Michael Rodriguez',
    status: 'active'
  },
  {
    id: 'mock-3',
    title: 'Creative Writing Masterclass',
    description: 'Explore creative writing techniques, storytelling, and narrative development. Bring your imagination and writing tools.',
    category: 'Seminar',
    date: '2024-02-20',
    time: '16:00',
    location: 'Community Arts Center',
    isVirtual: false,
    registeredCount: 15,
    capacity: 25,
    teacherName: 'Emma Thompson',
    status: 'active'
  }
];

const mockPastEvents = [
  {
    id: 'mock-past-1',
    title: 'Web Development Bootcamp',
    description: 'Intensive 3-day bootcamp covering HTML, CSS, JavaScript, and modern web development practices. Students built complete web applications.',
    category: 'Workshop',
    date: '2024-01-25',
    time: '09:00',
    location: 'Digital Innovation Lab',
    isVirtual: false,
    registeredCount: 35,
    capacity: 35,
    teacherName: 'Alex Johnson',
    status: 'completed'
  },
  {
    id: 'mock-past-2',
    title: 'Data Science Essentials',
    description: 'Comprehensive introduction to data science, including Python, pandas, and statistical analysis. Real-world projects included.',
    category: 'Course',
    date: '2024-01-20',
    time: '13:00',
    location: 'Virtual Event',
    isVirtual: true,
    registeredCount: 60,
    capacity: 60,
    teacherName: 'Dr. Lisa Park',
    status: 'completed'
  },
  {
    id: 'mock-past-3',
    title: 'Public Speaking Confidence',
    description: 'Build confidence in public speaking through practical exercises, feedback, and presentation techniques.',
    category: 'Seminar',
    date: '2024-01-15',
    time: '15:00',
    location: 'Conference Center',
    isVirtual: false,
    registeredCount: 22,
    capacity: 25,
    teacherName: 'James Wilson',
    status: 'completed'
  },
  {
    id: 'mock-past-4',
    title: 'Digital Marketing Strategy',
    description: 'Learn modern digital marketing strategies, social media management, and campaign optimization techniques.',
    category: 'Workshop',
    date: '2024-01-10',
    time: '11:00',
    location: 'Business Innovation Hub',
    isVirtual: false,
    registeredCount: 30,
    capacity: 30,
    teacherName: 'Maria Garcia',
    status: 'completed'
  }
];

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-rotate past events slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockPastEvents.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    navigate('/register', { state: { role } });
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mockPastEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mockPastEvents.length) % mockPastEvents.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="hero">
      {/* Animated Background */}
      <div className="hero-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
          <div className="shape shape-6"></div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="hero-nav glass">
        <div className="container">
          <div className="nav-content">
            <div className="nav-logo">
              <Sparkles className="logo-icon" />
              <span className="logo-text">AtlasMeet</span>
            </div>
            <div className="nav-actions">
              <button 
                className="glass-button"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="container">
          <div className="hero-text fade-in">
            <h1 className="hero-title">
              AtlasMeet
              <span className="hero-subtitle">Where Learning Meets Opportunity</span>
            </h1>
            <p className="hero-description">
              Connect teachers with students through seamless event management. 
              Create, discover, and join educational events that inspire growth and learning.
            </p>
            
            <div className="hero-actions">
              <button 
                className="glass-button primary"
                onClick={() => handleRoleSelect('teacher')}
              >
                <BookOpen size={20} />
                I'm a Teacher
              </button>
              <button 
                className="glass-button"
                onClick={() => handleRoleSelect('student')}
              >
                <Users size={20} />
                I'm a Student
              </button>
            </div>
          </div>

          {/* Current Events Showcase */}
          <div className="current-events-section fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="section-title">
              <Calendar className="section-icon" />
              Upcoming Events
            </h2>
            <div className="events-grid">
              {mockCurrentEvents.map((event) => (
                <div key={event.id} className="event-card glass-card" onClick={() => navigate('/register', { state: { role: 'student' } })}>
                  <div className="event-header">
                    <span className="event-category">{event.category}</span>
                    <span className="event-status active">Active</span>
                  </div>
                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description.substring(0, 100)}...</p>
                  <div className="event-meta">
                    <div className="event-info">
                      <Clock size={16} />
                      <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
                    </div>
                    <div className="event-info">
                      <MapPin size={16} />
                      <span>{event.isVirtual ? 'Virtual Event' : event.location}</span>
                    </div>
                    <div className="event-info">
                      <Users size={16} />
                      <span>{event.registeredCount}/{event.capacity} registered</span>
                    </div>
                  </div>
                  <div className="event-teacher">
                    <span>by {event.teacherName}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="view-all-container">
              <button 
                className="glass-button"
                onClick={() => navigate('/register', { state: { role: 'student' } })}
              >
                Join AtlasMeet to View All Events
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Past Events Slideshow */}
          <div className="past-events-section fade-in" style={{ animationDelay: '0.5s' }}>
            <h2 className="section-title">
              <CheckCircle className="section-icon" />
              Recently Completed Events
            </h2>
            <div className="slideshow-container">
              <button className="slideshow-nav prev" onClick={prevSlide}>
                <ArrowLeft size={20} />
              </button>
              
              <div className="slideshow-content">
                {mockPastEvents.map((event, index) => (
                  <div 
                    key={event.id} 
                    className={`slideshow-slide ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => navigate('/register', { state: { role: 'student' } })}
                  >
                    <div className="event-card glass-card completed">
                      <div className="event-header">
                        <span className="event-category">{event.category}</span>
                        <span className="event-status completed">
                          <CheckCircle size={16} />
                          Completed
                        </span>
                      </div>
                      <h3 className="event-title">{event.title}</h3>
                      <p className="event-description">{event.description.substring(0, 120)}...</p>
                      <div className="event-meta">
                        <div className="event-info">
                          <Clock size={16} />
                          <span>{formatDate(event.date)} at {formatTime(event.time)}</span>
                        </div>
                        <div className="event-info">
                          <MapPin size={16} />
                          <span>{event.isVirtual ? 'Virtual Event' : event.location}</span>
                        </div>
                        <div className="event-info">
                          <Users size={16} />
                          <span>{event.registeredCount}/{event.capacity} participants</span>
                        </div>
                      </div>
                      <div className="event-teacher">
                        <span>by {event.teacherName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="slideshow-nav next" onClick={nextSlide}>
                <ArrowRight size={20} />
              </button>
            </div>
            
            <div className="slideshow-indicators">
              {mockPastEvents.map((_, index) => (
                <button
                  key={index}
                  className={`indicator ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 