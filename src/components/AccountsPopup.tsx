import React from 'react';
import { X, Copy, Eye, EyeOff, User, BookOpen, Trash2, Plus, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Account {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
  password: string;
  isCreated?: boolean;
}

interface AccountsPopupProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
}

const AccountsPopup: React.FC<AccountsPopupProps> = ({ isOpen, onClose, accounts }) => {
  const [showPasswords, setShowPasswords] = React.useState(false);
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);
  const [isLoggingIn, setIsLoggingIn] = React.useState<string | null>(null);
  const { deleteAccount, login } = useAuth();
  const navigate = useNavigate();

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const copyCredentials = async (account: Account, index: number) => {
    const credentials = `Email: ${account.email}\nPassword: ${account.password}\nRole: ${account.role}`;
    await copyToClipboard(credentials, index);
  };

  const handleDeleteAccount = (email: string) => {
    if (window.confirm('Are you sure you want to delete this account? This action cannot be undone.')) {
      deleteAccount(email);
    }
  };

  const handleQuickLogin = async (account: Account) => {
    setIsLoggingIn(account.id);
    try {
      const success = await login(account.email, account.password, account.role);
      if (success) {
        onClose();
        navigate(account.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student');
      }
    } catch (error) {
      console.error('Quick login failed:', error);
    } finally {
      setIsLoggingIn(null);
    }
  };

  const demoAccounts = accounts.filter(account => !account.isCreated);
  const createdAccounts = accounts.filter(account => account.isCreated);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content glass-card" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <h2>All Accounts</h2>
          <div className="popup-actions">
            <button
              className="popup-button"
              onClick={() => setShowPasswords(!showPasswords)}
              title={showPasswords ? 'Hide Passwords' : 'Show Passwords'}
            >
              {showPasswords ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button
              className="popup-button"
              onClick={onClose}
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="popup-body">
          <p className="popup-description">
            Use these accounts to test the application. Click the copy button to copy credentials to clipboard, or use quick login for demo accounts.
          </p>

          {/* Demo Accounts Section */}
          {demoAccounts.length > 0 && (
            <div className="accounts-section">
              <h3 className="section-title">
                <BookOpen size={16} />
                Demo Accounts
              </h3>
              <div className="accounts-list">
                {demoAccounts.map((account, index) => (
                  <div key={account.id} className="account-card demo-account">
                    <div className="account-header">
                      <div className="account-role">
                        {account.role === 'teacher' ? (
                          <User size={16} className="role-icon teacher" />
                        ) : (
                          <BookOpen size={16} className="role-icon student" />
                        )}
                        <span className="role-badge">{account.role}</span>
                        <span className="account-type">Demo</span>
                      </div>
                      <div className="account-actions">
                        <button
                          className="action-button login"
                          onClick={() => handleQuickLogin(account)}
                          title="Quick Login"
                          disabled={isLoggingIn === account.id}
                        >
                          <LogIn size={16} />
                          {isLoggingIn === account.id ? 'Logging in...' : 'Login'}
                        </button>
                        <button
                          className="action-button"
                          onClick={() => copyCredentials(account, index)}
                          title="Copy Credentials"
                        >
                          <Copy size={16} />
                          {copiedIndex === index && <span className="copied-indicator">Copied!</span>}
                        </button>
                      </div>
                    </div>

                    <div className="account-info">
                      <div className="info-row">
                        <label>Name:</label>
                        <span>{account.name}</span>
                      </div>
                      <div className="info-row">
                        <label>Email:</label>
                        <span className="email">{account.email}</span>
                      </div>
                      <div className="info-row">
                        <label>Password:</label>
                        <span className="password">
                          {showPasswords ? account.password : '••••••••'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Created Accounts Section */}
          {createdAccounts.length > 0 && (
            <div className="accounts-section">
              <h3 className="section-title">
                <Plus size={16} />
                Created Accounts
              </h3>
              <div className="accounts-list">
                {createdAccounts.map((account, index) => (
                  <div key={account.id} className="account-card created-account">
                    <div className="account-header">
                      <div className="account-role">
                        {account.role === 'teacher' ? (
                          <User size={16} className="role-icon teacher" />
                        ) : (
                          <BookOpen size={16} className="role-icon student" />
                        )}
                        <span className="role-badge">{account.role}</span>
                        <span className="account-type">Created</span>
                      </div>
                      <div className="account-actions">
                        <button
                          className="action-button login"
                          onClick={() => handleQuickLogin(account)}
                          title="Quick Login"
                          disabled={isLoggingIn === account.id}
                        >
                          <LogIn size={16} />
                          {isLoggingIn === account.id ? 'Logging in...' : 'Login'}
                        </button>
                        <button
                          className="action-button"
                          onClick={() => copyCredentials(account, index)}
                          title="Copy Credentials"
                        >
                          <Copy size={16} />
                          {copiedIndex === index && <span className="copied-indicator">Copied!</span>}
                        </button>
                        <button
                          className="action-button delete"
                          onClick={() => handleDeleteAccount(account.email)}
                          title="Delete Account"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="account-info">
                      <div className="info-row">
                        <label>Name:</label>
                        <span>{account.name}</span>
                      </div>
                      <div className="info-row">
                        <label>Email:</label>
                        <span className="email">{account.email}</span>
                      </div>
                      <div className="info-row">
                        <label>Password:</label>
                        <span className="password">
                          {showPasswords ? account.password : '••••••••'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {accounts.length === 0 && (
            <div className="no-accounts">
              <p>No accounts found. Create some accounts by registering!</p>
            </div>
          )}
        </div>

        <div className="popup-footer">
          <p className="popup-note">
            <strong>Note:</strong> Demo accounts are permanent, created accounts can be deleted. Use quick login for instant access!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountsPopup; 