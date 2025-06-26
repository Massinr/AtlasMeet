import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEvents } from '../context/EventContext';
import { useNotifications } from '../context/NotificationContext';
import { usePrompts } from '../components/PromptManager';
import { useAlertManager } from '../components/AlertManager';
import ProfilePicture from '../components/ProfilePicture';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import WebhookTest from '../components/WebhookTest';
import { 
  User, 
  Calendar, 
  Settings as SettingsIcon, 
  LogOut, 
  Trash2, 
  Save,
  Edit,
  X,
  Camera,
  Bot,
  Bell,
  Edit3,
  Shield,
  Database,
  TestTube,
  Sun,
  Moon
} from 'lucide-react';
import './Settings.css';

const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { events, registrations } = useEvents();
  const { notifications, clearAllNotifications } = useNotifications();
  const { showConfirm, showInput, showPrompt } = usePrompts();
  const { showSuccess, showError, showInfo } = useAlertManager();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'events' | 'security' | 'discord' | 'notifications' | 'testing'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleLogout = async () => {
    const confirmed = await showConfirm(
      'Confirm Logout',
      'Are you sure you want to logout?'
    );
    
    if (confirmed) {
      logout();
      showSuccess('Success', 'Logged out successfully');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = await showConfirm(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.'
    );
    
    if (confirmed) {
      const reason = await showInput(
        'Reason for Deletion',
        'Please provide a reason for deleting your account (optional):'
      );
      
      showInfo('Info', `Account deletion requested. Reason: ${reason || 'None provided'}`);
    }
  };

  const handleSaveProfile = async () => {
    if (!editForm.name.trim() || !editForm.email.trim()) {
      showError('Error', 'Name and email are required');
      return;
    }

    // In a real app, you'd update the user profile here
    setIsEditing(false);
    showSuccess('Success', 'Profile updated successfully');
  };

  const handleCancelEdit = async () => {
    if (editForm.name !== user?.name || editForm.email !== user?.email) {
      const confirmed = await showConfirm(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?'
      );
      
      if (confirmed) {
        setEditForm({
          name: user?.name || '',
          email: user?.email || '',
        });
        setIsEditing(false);
      }
    } else {
      setIsEditing(false);
    }
  };

  const testCustomPrompt = async () => {
    const result = await showPrompt({
      title: 'Test Custom Prompt',
      message: 'This is a test of the custom prompt system with an input field.',
      type: 'info',
      showInput: true,
      inputPlaceholder: 'Enter some text...',
      inputRequired: true,
      confirmText: 'Submit',
      cancelText: 'Cancel'
    });
    
    if (result) {
      showSuccess('Success', `You entered: ${result}`);
    }
  };

  // Get user's events or registrations
  const userEvents = user?.role === 'teacher' 
    ? events.filter(event => event.teacherId === user.id)
    : registrations.filter(reg => reg.studentId === user?.id).map(reg => 
        events.find(event => event.id === reg.eventId)
      ).filter(Boolean);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'discord', label: 'Discord Integration', icon: Database },
    { id: 'testing', label: 'Testing', icon: TestTube },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="user-info glass-card">
            <ProfilePicture 
              src={user?.profilePicture}
              name={user?.name || 'User'}
              size="lg"
            />
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <span className="role-badge">{user?.role}</span>
          </div>

          <nav className="settings-nav">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <Icon size={20} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="settings-main">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Profile Settings</h2>
              </div>

              <div className="profile-section glass-card">
                <div className="profile-header">
                  <ProfilePictureUpload />
                  <div className="profile-info">
                    <h3>{user?.name}</h3>
                    <p>{user?.email}</p>
                    <span className="role-badge">{user?.role}</span>
                  </div>
                </div>

                <div className="profile-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      disabled={!isEditing}
                      className="glass-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      disabled={!isEditing}
                      className="glass-input"
                    />
                  </div>

                  <div className="form-actions">
                    {isEditing ? (
                      <>
                        <button className="glass-button primary" onClick={handleSaveProfile}>
                          <Save size={16} />
                          Save Changes
                        </button>
                        <button className="glass-button secondary" onClick={handleCancelEdit}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button className="glass-button primary" onClick={() => setIsEditing(true)}>
                        <Edit size={16} />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>

                {/* Theme Settings */}
                <div className="theme-section glass-card">
                  <h3>Appearance</h3>
                  <div className="theme-toggle">
                    <div className="theme-info">
                      <h4>Theme</h4>
                      <p>Switch between dark and light mode</p>
                    </div>
                    <button 
                      className="glass-button primary theme-toggle-btn"
                      onClick={toggleTheme}
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun size={16} />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <Moon size={16} />
                          Dark Mode
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="danger-zone glass-card">
                  <h3>Danger Zone</h3>
                  <div className="danger-actions">
                    <button className="glass-button danger" onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout
                    </button>
                    <button className="glass-button danger" onClick={handleDeleteAccount}>
                      <Trash2 size={16} />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Notification Settings</h2>
              </div>

              <div className="notifications-section glass-card">
                <div className="notifications-header">
                  <h3>Recent Notifications</h3>
                  {notifications.length > 0 && (
                    <button 
                      className="glass-button secondary"
                      onClick={clearAllNotifications}
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="empty-notifications">
                    <Bell size={48} />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="notifications-list">
                    {notifications.map((notification, index) => (
                      <div key={index} className="notification-item">
                        <div className="notification-content">
                          <h4>{notification.title}</h4>
                          <p>{notification.message}</p>
                          <span className="notification-time">
                            {new Date().toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Discord Integration Tab */}
          {activeTab === 'discord' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Discord Integration</h2>
              </div>
              <WebhookTest />
            </div>
          )}

          {/* Testing Tab */}
          {activeTab === 'testing' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Testing Tools</h2>
              </div>
              
              <div className="testing-section glass-card">
                <h3>Custom Prompts Test</h3>
                <p>Test the new custom prompt system</p>
                
                <div className="testing-actions">
                  <button 
                    className="glass-button primary"
                    onClick={testCustomPrompt}
                  >
                    Test Input Prompt
                  </button>
                  
                  <button 
                    className="glass-button warning"
                    onClick={() => showConfirm('Test Warning', 'This is a warning prompt test')}
                  >
                    Test Warning Prompt
                  </button>
                  
                  <button 
                    className="glass-button danger"
                    onClick={() => showConfirm('Test Danger', 'This is a danger prompt test')}
                  >
                    Test Danger Prompt
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Security Settings</h2>
              </div>

              <div className="security-section glass-card">
                <h3>Account Security</h3>
                <p>Manage your account security settings</p>
                
                <div className="security-options">
                  <div className="security-option">
                    <div className="security-info">
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <button className="glass-button secondary">
                      Enable
                    </button>
                  </div>
                  
                  <div className="security-option">
                    <div className="security-info">
                      <h4>Session Management</h4>
                      <p>View and manage your active sessions</p>
                    </div>
                    <button className="glass-button secondary">
                      Manage
                    </button>
                  </div>
                  
                  <div className="security-option">
                    <div className="security-info">
                      <h4>Delete Account</h4>
                      <p>Permanently delete your account and all associated data</p>
                    </div>
                    <button className="glass-button danger" onClick={handleDeleteAccount}>
                      <Trash2 size={16} />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings; 