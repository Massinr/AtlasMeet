import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Clock, User, Mail, Shield, ArrowLeft, LogOut, CheckCircle, XCircle } from 'lucide-react';
import './Auth.css';

const PendingApproval: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [status, setStatus] = useState<'pending' | 'approved' | 'denied'>('pending');
  const [isChecking, setIsChecking] = useState(false);

  // Check approval status periodically
  useEffect(() => {
    const checkApprovalStatus = () => {
      if (!user) return;

      try {
        // Check current user status
        const currentUserJson = localStorage.getItem('atlasmeet_user');
        if (currentUserJson) {
          const currentUser = JSON.parse(currentUserJson);
          if (currentUser.id === user.id) {
            const newStatus = currentUser.approvalStatus || 'pending';
            if (newStatus !== status) {
              setStatus(newStatus);
              
              // Redirect based on status
              if (newStatus === 'approved') {
                setTimeout(() => {
                  navigate('/dashboard/teacher');
                }, 2000);
              } else if (newStatus === 'denied') {
                setTimeout(() => {
                  logout();
                  navigate('/');
                }, 3000);
              }
            }
          }
        }

        // Also check in created accounts
        const createdAccountsJson = localStorage.getItem('atlasmeet_created_accounts');
        if (createdAccountsJson) {
          const createdAccounts = JSON.parse(createdAccountsJson);
          const account = createdAccounts.find((acc: any) => acc.id === user.id);
          if (account) {
            const newStatus = account.approvalStatus || 'pending';
            if (newStatus !== status) {
              setStatus(newStatus);
              
              // Update current user status
              if (currentUserJson) {
                const currentUser = JSON.parse(currentUserJson);
                currentUser.approvalStatus = newStatus;
                currentUser.isApproved = newStatus === 'approved';
                localStorage.setItem('atlasmeet_user', JSON.stringify(currentUser));
              }
              
              // Redirect based on status
              if (newStatus === 'approved') {
                setTimeout(() => {
                  navigate('/dashboard/teacher');
                }, 2000);
              } else if (newStatus === 'denied') {
                setTimeout(() => {
                  logout();
                  navigate('/');
                }, 3000);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error checking approval status:', error);
      }
    };

    // Check immediately
    checkApprovalStatus();

    // Check every 5 seconds
    const interval = setInterval(checkApprovalStatus, 5000);

    return () => clearInterval(interval);
  }, [user, status, navigate, logout]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    navigate('/');
    return null;
  }

  // Show different content based on status
  if (status === 'approved') {
    return (
      <div className="auth-page">
        <div className="auth-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="auth-container">
          <div className="auth-card glass-card">
            <div className="auth-header">
              <div className="approved-icon">
                <CheckCircle size={48} className="success-icon" />
              </div>
              <h1>Account Approved! 🎉</h1>
              <p>Your teacher account has been approved successfully!</p>
            </div>

            <div className="approved-message">
              <p>You can now access all teacher features. Redirecting you to your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'denied') {
    return (
      <div className="auth-page">
        <div className="auth-background">
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>

        <div className="auth-container">
          <div className="auth-card glass-card">
            <div className="auth-header">
              <div className="denied-icon">
                <XCircle size={48} className="error-icon" />
              </div>
              <h1>Account Denied</h1>
              <p>Your teacher account application has been denied.</p>
            </div>

            <div className="denied-message">
              <p>Unfortunately, your teacher account application could not be approved at this time. You will be redirected to the home page.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="auth-container">
        <div className="auth-card glass-card">
          <div className="auth-header">
            <div className="pending-icon">
              <Clock size={48} className="pending-spinner" />
            </div>
            <h1>Teacher Account Pending Approval</h1>
            <p>Your teacher account is currently under review by our administrators</p>
          </div>

          <div className="pending-info">
            <div className="user-details">
              <div className="detail-item">
                <User className="detail-icon" />
                <div className="detail-content">
                  <label>Name</label>
                  <span>{user.name}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <Mail className="detail-icon" />
                <div className="detail-content">
                  <label>Email</label>
                  <span>{user.email}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <Shield className="detail-icon" />
                <div className="detail-content">
                  <label>Role</label>
                  <span className="role-badge teacher">{user.role}</span>
                </div>
              </div>
            </div>

            <div className="pending-message">
              <h3>Why do teachers need approval?</h3>
              <p>As a teacher, you'll have the ability to create and manage educational events. To ensure quality and security, we review all teacher accounts before granting access.</p>
              
              <h3>What happens next?</h3>
              <ul>
                <li>An administrator will review your account information</li>
                <li>You'll receive a notification once approved or denied</li>
                <li>Once approved, you can create and manage events</li>
                <li>This process typically takes a few minutes to a few hours</li>
              </ul>
              
              <div className="status-check">
                <p>Checking for status updates automatically...</p>
              </div>
            </div>

            <div className="pending-actions">
              <button
                className="glass-button secondary"
                onClick={() => navigate('/')}
              >
                <ArrowLeft size={20} />
                Back to Home
              </button>
              
              <button
                className="glass-button"
                onClick={handleLogout}
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingApproval; 