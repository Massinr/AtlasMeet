import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, XCircle, User, Mail, Shield, Clock } from 'lucide-react';
import './AdminPanel.css';

const AdminPanel: React.FC = () => {
  const { getCreatedAccounts } = useAuth();
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [denialReason, setDenialReason] = useState('');

  const pendingAccounts = getCreatedAccounts().filter(
    account => account.approvalStatus === 'pending'
  );

  const handleApprove = async (userId: string) => {
    // This would call the approveAccount function
    console.log('Approving account:', userId);
    // In a real implementation, you would call the approveAccount function here
  };

  const handleDeny = async (userId: string) => {
    // This would call the denyAccount function
    console.log('Denying account:', userId, 'Reason:', denialReason);
    setDenialReason('');
    setSelectedAccount(null);
    // In a real implementation, you would call the denyAccount function here
  };

  if (pendingAccounts.length === 0) {
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>Admin Panel</h2>
          <p>No pending account approvals</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h2>Admin Panel</h2>
        <p>{pendingAccounts.length} account(s) pending approval</p>
      </div>

      <div className="pending-accounts">
        {pendingAccounts.map((account) => (
          <div key={account.id} className="account-card">
            <div className="account-info">
              <div className="account-header">
                <User className="account-icon" />
                <div className="account-details">
                  <h3>{account.name}</h3>
                  <div className="account-meta">
                    <span className="email">
                      <Mail size={16} />
                      {account.email}
                    </span>
                    <span className="role">
                      <Shield size={16} />
                      {account.role}
                    </span>
                    <span className="created">
                      <Clock size={16} />
                      {new Date(account.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="account-actions">
              <button
                className="approve-btn"
                onClick={() => handleApprove(account.id)}
              >
                <CheckCircle size={20} />
                Approve
              </button>
              
              <button
                className="deny-btn"
                onClick={() => setSelectedAccount(account.id)}
              >
                <XCircle size={20} />
                Deny
              </button>
            </div>

            {selectedAccount === account.id && (
              <div className="denial-form">
                <textarea
                  placeholder="Enter reason for denial (optional)"
                  value={denialReason}
                  onChange={(e) => setDenialReason(e.target.value)}
                  rows={3}
                />
                <div className="denial-actions">
                  <button
                    className="confirm-deny-btn"
                    onClick={() => handleDeny(account.id)}
                  >
                    Confirm Denial
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setSelectedAccount(null);
                      setDenialReason('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel; 