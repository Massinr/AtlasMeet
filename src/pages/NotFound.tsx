import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content glass-card">
        <div className="not-found-icon">
          <Search size={80} />
        </div>
        
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        
        <div className="not-found-actions">
          <Link to="/" className="glass-button primary">
            <Home size={20} />
            Go Home
          </Link>
          <button 
            className="glass-button secondary"
            onClick={() => window.history.back()}
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>
        
        <div className="not-found-suggestions">
          <h3>You might be looking for:</h3>
          <ul>
            <li><Link to="/">Home Page</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 