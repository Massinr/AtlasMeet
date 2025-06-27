import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, BookOpen, Sparkles, Clock, MapPin, ArrowRight, ArrowLeft, CheckCircle, XCircle, Info, Heart, ExternalLink, Globe, Menu, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import KeyboardShortcuts from '../components/KeyboardShortcuts';
import AccountsPopup from '../components/AccountsPopup';
import { useAuth } from '../context/AuthContext';
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
  const { t, language, setLanguage } = useLanguage();
  const { getAllAccounts } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showUpdates, setShowUpdates] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAccountsPopup, setShowAccountsPopup] = useState(false);

  const handleQuickLogin = () => {
    setShowAccountsPopup(true);
  };

  // Auto-rotate past events slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % mockPastEvents.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSelect = (role: 'teacher' | 'student') => {
    navigate('/register', { state: { role } });
    setIsMobileMenuOpen(false);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mockPastEvents.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mockPastEvents.length) % mockPastEvents.length);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'fr' : 'en');
    setShowLanguageMenu(false);
  };

  // Close language menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showLanguageMenu && !target.closest('.language-switcher')) {
        setShowLanguageMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageMenu]);

  const handleMobileMenuAction = (action: string) => {
    setIsMobileMenuOpen(false);
    switch (action) {
      case 'updates':
        setShowUpdates(true);
        break;
      case 'credits':
        setShowCredits(true);
        break;
      case 'signin':
        handleQuickLogin();
        break;
      case 'teacher':
        handleRoleSelect('teacher');
        break;
      case 'student':
        handleRoleSelect('student');
        break;
    }
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
            
            {/* Desktop Navigation */}
            <div className="nav-actions desktop-only">
              <div className="language-switcher">
                <button 
                  className="glass-button secondary language-button"
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                >
                  <Globe size={16} />
                  {language === 'en' ? 'EN' : 'FR'}
                </button>
                {showLanguageMenu && (
                  <div className="language-menu glass-card">
                    <button 
                      className={`language-option ${language === 'en' ? 'active' : ''}`}
                      onClick={() => setLanguage('en')}
                    >
                      🇺🇸 English
                    </button>
                    <button 
                      className={`language-option ${language === 'fr' ? 'active' : ''}`}
                      onClick={() => setLanguage('fr')}
                    >
                      🇫🇷 Français
                    </button>
                  </div>
                )}
              </div>
              <button 
                className="glass-button secondary"
                onClick={() => setShowUpdates(true)}
              >
                <Info size={16} />
                {t('nav.updates')}
              </button>
              <button 
                className="glass-button secondary"
                onClick={() => setShowCredits(true)}
              >
                <Heart size={16} />
                {t('nav.credits')}
              </button>
              <button 
                className="glass-button"
                onClick={handleQuickLogin}
              >
                {t('nav.signIn')}
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-toggle mobile-only"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`mobile-menu glass ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="mobile-menu-logo">
            <Sparkles className="logo-icon" />
            <span className="logo-text">AtlasMeet</span>
          </div>
          <button
            className="mobile-menu-close"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="mobile-menu-content">
          <div className="mobile-menu-section">
            <h3>Language</h3>
            <div className="mobile-language-options">
              <button 
                className={`mobile-language-option ${language === 'en' ? 'active' : ''}`}
                onClick={() => {
                  setLanguage('en');
                  setIsMobileMenuOpen(false);
                }}
              >
                🇺🇸 English
              </button>
              <button 
                className={`mobile-language-option ${language === 'fr' ? 'active' : ''}`}
                onClick={() => {
                  setLanguage('fr');
                  setIsMobileMenuOpen(false);
                }}
              >
                🇫🇷 Français
              </button>
            </div>
          </div>

          <div className="mobile-menu-section">
            <h3>Actions</h3>
            <button 
              className="mobile-menu-item"
              onClick={() => handleMobileMenuAction('updates')}
            >
              <Info size={20} />
              <span>{t('nav.updates')}</span>
            </button>
            <button 
              className="mobile-menu-item"
              onClick={() => handleMobileMenuAction('credits')}
            >
              <Heart size={20} />
              <span>{t('nav.credits')}</span>
            </button>
            <button 
              className="mobile-menu-item quick-login"
              onClick={handleQuickLogin}
            >
              <Users size={20} />
              <span>Quick Login (Ctrl+H)</span>
            </button>
          </div>

          <div className="mobile-menu-section">
            <h3>Join AtlasMeet</h3>
            <button 
              className="mobile-menu-item primary"
              onClick={() => handleMobileMenuAction('teacher')}
            >
              <BookOpen size={20} />
              <span>{t('hero.teacherButton')}</span>
            </button>
            <button 
              className="mobile-menu-item primary"
              onClick={() => handleMobileMenuAction('student')}
            >
              <Users size={20} />
              <span>{t('hero.studentButton')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Accounts Popup (Quick Login) */}
      <AccountsPopup isOpen={showAccountsPopup} onClose={() => setShowAccountsPopup(false)} accounts={getAllAccounts()} />

      {/* Hero Content */}
      <div className="hero-content">
        <div className="container">
          <div className="hero-text fade-in">
            <h1 className="hero-title">
              {t('hero.title')}
              <span className="hero-subtitle">{t('hero.subtitle')}</span>
            </h1>
            <p className="hero-description">
              {t('hero.description')}
            </p>
            
            <div className="hero-actions">
              <button 
                className="glass-button primary"
                onClick={() => handleRoleSelect('teacher')}
              >
                <BookOpen size={20} />
                {t('hero.teacherButton')}
              </button>
              <button 
                className="glass-button"
                onClick={() => handleRoleSelect('student')}
              >
                <Users size={20} />
                {t('hero.studentButton')}
              </button>
            </div>
          </div>

          {/* Current Events Showcase */}
          <div className="current-events-section fade-in" style={{ animationDelay: '0.3s' }}>
            <h2 className="section-title">
              <Calendar className="section-icon" />
              {t('events.upcoming')}
            </h2>
            <div className="events-grid">
              {mockCurrentEvents.map((event) => (
                <div key={event.id} className="event-card glass-card" onClick={() => navigate('/register', { state: { role: 'student' } })}>
                  <div className="event-header">
                    <span className="event-category">{event.category}</span>
                    <span className="event-status active">{t('events.active')}</span>
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
                      <span>{event.isVirtual ? t('events.virtual') : event.location}</span>
                    </div>
                    <div className="event-info">
                      <Users size={16} />
                      <span>{event.registeredCount}/{event.capacity} {t('events.registered')}</span>
                    </div>
                  </div>
                  <div className="event-teacher">
                    <span>{t('events.by')} {event.teacherName}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="view-all-container">
              <button 
                className="glass-button"
                onClick={() => navigate('/register', { state: { role: 'student' } })}
              >
                {t('events.viewAll')}
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Past Events Slideshow */}
          <div className="past-events-section fade-in" style={{ animationDelay: '0.5s' }}>
            <h2 className="section-title">
              <CheckCircle className="section-icon" />
              {t('events.recentlyCompleted')}
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
                          {t('events.completed')}
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
                          <span>{event.isVirtual ? t('events.virtual') : event.location}</span>
                        </div>
                        <div className="event-info">
                          <Users size={16} />
                          <span>{event.registeredCount}/{event.capacity} {t('events.participants')}</span>
                        </div>
                      </div>
                      <div className="event-teacher">
                        <span>{t('events.by')} {event.teacherName}</span>
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

      {/* Updates Modal */}
      {showUpdates && (
        <div className="modal-overlay" onClick={() => setShowUpdates(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('modal.recentUpdates')}</h2>
              <button className="modal-close" onClick={() => setShowUpdates(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="updates-list">
                <div className="update-item">
                  <div className="update-content">
                    <h3>🎉 {t('updates.v1Released')}</h3>
                    <p>{t('updates.v1Description')}</p>
                  </div>
                </div>
                <div className="update-item">
                  <div className="update-content">
                    <h3>✨ {t('updates.newFeatures')}</h3>
                    <ul>
                      <li>Dark/Light mode toggle</li>
                      <li>Profile picture upload</li>
                      <li>Event search and filtering</li>
                      <li>CV upload for applications</li>
                      <li>Real-time notifications</li>
                      <li>Mobile responsive design</li>
                      <li>Beautiful intro animations</li>
                      <li>Enhanced mobile menu</li>
                      <li>Quick login (Ctrl+H)</li>
                      <li>Website visit logging</li>
                      <li>Improved search inputs</li>
                    </ul>
                  </div>
                </div>
                <div className="update-item">
                  <div className="update-content">
                    <h3>🎨 {t('updates.uiImprovements')}</h3>
                    <ul>
                      <li>Staggered intro animations</li>
                      <li>Mobile menu with quick access</li>
                      <li>Better touch targets for mobile</li>
                      <li>Improved search input styling</li>
                      <li>Enhanced mobile responsiveness</li>
                      <li>Professional loading sequences</li>
                    </ul>
                  </div>
                </div>
                <div className="update-item">
                  <div className="update-content">
                    <h3>🔧 {t('updates.performance')}</h3>
                    <p>{t('updates.performanceDescription')}</p>
                  </div>
                </div>
                <div className="update-item">
                  <div className="update-content">
                    <h3>🌐 {t('updates.languageSupport')}</h3>
                    <p>{t('updates.languageDescription')}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <a 
                  href="https://www.instagram.com/massine.x_x/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="glass-button primary"
                >
                  <ExternalLink size={16} />
                  {t('modal.followUpdates')}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Credits Modal */}
      {showCredits && (
        <div className="modal-overlay" onClick={() => setShowCredits(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{t('modal.credits')}</h2>
              <button className="modal-close" onClick={() => setShowCredits(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="credits-content">
                <div className="credit-section">
                  <h3>👨‍💻 {t('credits.developer')}</h3>
                  <p><strong>Massine</strong> - {t('credits.developerDescription')}</p>
                  <a 
                    href="https://www.instagram.com/massine.x_x/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="social-link"
                  >
                    <ExternalLink size={16} />
                    @massine.x_x on Instagram
                  </a>
                </div>
                
                <div className="credit-section">
                  <h3>🛠️ {t('credits.technologies')}</h3>
                  <ul>
                    <li><strong>Frontend:</strong> React, TypeScript, CSS3</li>
                    <li><strong>Icons:</strong> Lucide React</li>
                    <li><strong>Styling:</strong> Custom CSS with Glass Morphism</li>
                    <li><strong>Deployment:</strong> GitHub Pages</li>
                  </ul>
                </div>
                
                <div className="credit-section">
                  <h3>🎨 {t('credits.design')}</h3>
                  <p>{t('credits.designDescription')}</p>
                </div>
                
                <div className="credit-section">
                  <h3>📱 {t('credits.connect')}</h3>
                  <p>{t('credits.connectDescription')}</p>
                  <a 
                    href="https://www.instagram.com/massine.x_x/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="glass-button primary"
                  >
                    <ExternalLink size={16} />
                    {t('modal.visitProfile')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts onShowAccounts={handleQuickLogin} />
    </div>
  );
};

export default Hero; 