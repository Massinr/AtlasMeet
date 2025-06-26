import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, User, BookOpen, Plus } from 'lucide-react';
import './Auth.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'teacher' | 'student'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, getCreatedAccounts } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        navigate(role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student');
      } else {
        setError('Invalid email, password, or role. Please check your credentials and try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoRole: 'teacher' | 'student') => {
    setRole(demoRole);
    if (demoRole === 'teacher') {
      setEmail('sarah.johnson@university.edu');
      setPassword('demo123');
    } else {
      setEmail('alex.chen@student.edu');
      setPassword('demo123');
    }
  };

  const handleCreatedAccountLogin = (account: any) => {
    setRole(account.role);
    setEmail(account.email);
    setPassword(account.password);
  };

  const createdAccounts = getCreatedAccounts();

  return (
    <div className="auth-container">
      <div className="auth-card glass-card">
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your AtlasMeet account</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="role">I am a:</label>
            <div className="role-selector">
              <button
                type="button"
                className={`role-option ${role === 'student' ? 'active' : ''}`}
                onClick={() => setRole('student')}
              >
                <BookOpen size={20} />
                Student
              </button>
              <button
                type="button"
                className={`role-option ${role === 'teacher' ? 'active' : ''}`}
                onClick={() => setRole('teacher')}
              >
                <User size={20} />
                Teacher
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail size={20} className="input-icon" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="glass-input"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="glass-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="glass-button primary auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="demo-credentials">
          <h3>Quick Login</h3>
          
          {/* Demo Accounts */}
          <div className="credentials-section">
            <h4>Demo Accounts</h4>
            <div className="demo-buttons">
              <button
                type="button"
                className="glass-button secondary demo-button"
                onClick={() => handleDemoLogin('teacher')}
              >
                <User size={16} />
                Login as Teacher
              </button>
              <button
                type="button"
                className="glass-button secondary demo-button"
                onClick={() => handleDemoLogin('student')}
              >
                <BookOpen size={16} />
                Login as Student
              </button>
            </div>
            <div className="demo-info">
              <p><strong>Teacher:</strong> sarah.johnson@university.edu</p>
              <p><strong>Student:</strong> alex.chen@student.edu</p>
              <p><strong>Password:</strong> demo123 (for both)</p>
            </div>
          </div>

          {/* Created Accounts */}
          {createdAccounts.length > 0 && (
            <div className="credentials-section">
              <h4>Created Accounts</h4>
              <div className="created-accounts-list">
                {createdAccounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    className="created-account-button"
                    onClick={() => handleCreatedAccountLogin(account)}
                  >
                    <div className="account-info">
                      <span className="account-name">{account.name}</span>
                      <span className="account-email">{account.email}</span>
                      <span className="account-role">{account.role}</span>
                    </div>
                    <Plus size={16} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 