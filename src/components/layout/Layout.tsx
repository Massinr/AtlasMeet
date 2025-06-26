import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Calendar, 
  Users, 
  Plus, 
  LogOut, 
  Home,
  Menu,
  X,
  Settings
} from 'lucide-react';
import './Layout.css';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const getNavItems = () => {
    if (user?.role === 'teacher') {
      return [
        {
          label: 'Dashboard',
          icon: Home,
          path: '/dashboard/teacher',
          onClick: () => navigate('/dashboard/teacher')
        },
        {
          label: 'My Events',
          icon: Calendar,
          path: '/dashboard/teacher',
          onClick: () => navigate('/dashboard/teacher')
        },
        {
          label: 'Create Event',
          icon: Plus,
          path: '/dashboard/event/new',
          onClick: () => navigate('/dashboard/event/new')
        },
        {
          label: 'Settings',
          icon: Settings,
          path: '/dashboard/settings',
          onClick: () => navigate('/dashboard/settings')
        }
      ];
    } else {
      return [
        {
          label: 'Dashboard',
          icon: Home,
          path: '/dashboard/student',
          onClick: () => navigate('/dashboard/student')
        },
        {
          label: 'Browse Events',
          icon: Calendar,
          path: '/dashboard/student',
          onClick: () => navigate('/dashboard/student')
        },
        {
          label: 'My Registrations',
          icon: Users,
          path: '/dashboard/student',
          onClick: () => navigate('/dashboard/student')
        },
        {
          label: 'Settings',
          icon: Settings,
          path: '/dashboard/settings',
          onClick: () => navigate('/dashboard/settings')
        }
      ];
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="layout">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-menu-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar glass ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Calendar className="logo-icon" />
            <span className="logo-text">AtlasMeet</span>
          </div>
          <button
            className="mobile-menu-close"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role}</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {getNavItems().map((item) => (
            <button
              key={item.label}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => {
                item.onClick();
                setIsMobileMenuOpen(false);
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-button" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Top Bar */}
        <header className="top-bar glass">
          <div className="top-bar-left">
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="page-title">
              {location.pathname.includes('/event/new') && 'Create Event'}
              {location.pathname.includes('/event/edit') && 'Edit Event'}
              {location.pathname.includes('/event/') && !location.pathname.includes('/new') && !location.pathname.includes('/edit') && 'Event Details'}
              {location.pathname === '/dashboard/teacher' && 'Teacher Dashboard'}
              {location.pathname === '/dashboard/student' && 'Student Dashboard'}
              {location.pathname === '/dashboard/settings' && 'Settings'}
            </div>
          </div>
          
          <div className="top-bar-right">
            <div className="user-menu">
              <span className="user-greeting">Welcome, {user.name}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout; 