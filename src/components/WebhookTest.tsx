import React, { useState } from 'react';
import { Send, CheckCircle, XCircle, AlertCircle, Info, Copy } from 'lucide-react';
import { discordLogger } from '../services/DiscordLogger';
import { DISCORD_CONFIG } from '../config/discord';
import './WebhookTest.css';

const WebhookTest: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | 'warning' | null>(null);
  const [testMessage, setTestMessage] = useState('');
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const testWebhook = async () => {
    setIsTesting(true);
    setTestResult(null);
    setTestMessage('');

    try {
      console.log('Starting webhook test...');
      console.log('Webhook URL:', DISCORD_CONFIG.WEBHOOK_URL ? 'Configured' : 'Not configured');
      
      // Test with a simple account creation log
      await discordLogger.logAccountCreation({
        userId: 'test-user-123',
        userName: 'Test User',
        userEmail: 'test@example.com',
        userRole: 'student',
        websiteId: 'TEST-WEB-123',
      });

      setTestResult('success');
      setTestMessage('Webhook test successful! Check your Discord channel for the test message.');
    } catch (error) {
      console.error('Webhook test error:', error);
      setTestResult('error');
      setTestMessage(`Webhook test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const getWebhookStatus = () => {
    const webhookUrl = DISCORD_CONFIG.WEBHOOK_URL;
    
    if (!webhookUrl || webhookUrl === '') {
      return {
        status: 'warning' as const,
        message: 'Webhook URL not configured. Please set REACT_APP_DISCORD_WEBHOOK_URL in your .env file.'
      };
    }

    if (!webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      return {
        status: 'error' as const,
        message: 'Invalid webhook URL format. URL should start with https://discord.com/api/webhooks/'
      };
    }

    return {
      status: 'success' as const,
      message: 'Webhook URL is configured correctly.'
    };
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const webhookStatus = getWebhookStatus();

  return (
    <div className="webhook-test glass-card">
      <div className="webhook-test-header">
        <h3>Discord Webhook Test</h3>
        <p>Test your Discord webhook configuration</p>
      </div>

      <div className="webhook-status">
        <div className={`status-indicator ${webhookStatus.status}`}>
          {webhookStatus.status === 'success' && <CheckCircle size={16} />}
          {webhookStatus.status === 'warning' && <AlertCircle size={16} />}
          {webhookStatus.status === 'error' && <XCircle size={16} />}
          <span>{webhookStatus.message}</span>
        </div>
      </div>

      <div className="webhook-actions">
        <button
          className="glass-button primary"
          onClick={testWebhook}
          disabled={isTesting || webhookStatus.status === 'error'}
        >
          {isTesting ? (
            <>
              <div className="spinner"></div>
              Testing...
            </>
          ) : (
            <>
              <Send size={16} />
              Test Webhook
            </>
          )}
        </button>
        
        <button
          className="glass-button secondary"
          onClick={() => setShowDebugInfo(!showDebugInfo)}
        >
          <Info size={16} />
          {showDebugInfo ? 'Hide' : 'Show'} Debug Info
        </button>
      </div>

      {showDebugInfo && (
        <div className="debug-info">
          <h4>Debug Information:</h4>
          <div className="debug-item">
            <label>Webhook URL:</label>
            <div className="debug-value">
              <span className={DISCORD_CONFIG.WEBHOOK_URL ? 'configured' : 'not-configured'}>
                {DISCORD_CONFIG.WEBHOOK_URL || 'Not configured'}
              </span>
              {DISCORD_CONFIG.WEBHOOK_URL && (
                <button
                  className="copy-button"
                  onClick={() => copyToClipboard(DISCORD_CONFIG.WEBHOOK_URL)}
                  title="Copy to clipboard"
                >
                  <Copy size={12} />
                </button>
              )}
            </div>
          </div>
          
          <div className="debug-item">
            <label>Bot Token:</label>
            <div className="debug-value">
              <span className={DISCORD_CONFIG.BOT_TOKEN ? 'configured' : 'not-configured'}>
                {DISCORD_CONFIG.BOT_TOKEN ? 'Configured' : 'Not configured'}
              </span>
            </div>
          </div>
          
          <div className="debug-item">
            <label>Channel ID:</label>
            <div className="debug-value">
              <span className={DISCORD_CONFIG.CHANNEL_ID ? 'configured' : 'not-configured'}>
                {DISCORD_CONFIG.CHANNEL_ID || 'Not configured'}
              </span>
            </div>
          </div>
          
          <div className="debug-item">
            <label>Environment:</label>
            <div className="debug-value">
              <span>{process.env.NODE_ENV}</span>
            </div>
          </div>
          
          <div className="debug-item">
            <label>Console Logs:</label>
            <div className="debug-value">
              <span>Check browser console for detailed logs</span>
            </div>
          </div>
        </div>
      )}

      {testResult && (
        <div className={`test-result ${testResult}`}>
          {testResult === 'success' && <CheckCircle size={16} />}
          {testResult === 'error' && <XCircle size={16} />}
          {testResult === 'warning' && <AlertCircle size={16} />}
          <span>{testMessage}</span>
        </div>
      )}

      <div className="webhook-instructions">
        <h4>Setup Instructions:</h4>
        <ol>
          <li>Create a Discord server or use an existing one</li>
          <li>Create a webhook in your Discord channel:
            <ul>
              <li>Right-click on the channel → Edit Channel</li>
              <li>Go to Integrations → Webhooks</li>
              <li>Click "New Webhook"</li>
              <li>Copy the webhook URL</li>
            </ul>
          </li>
          <li>Create a <code>.env</code> file in your project root</li>
          <li>Add your webhook URL: <code>REACT_APP_DISCORD_WEBHOOK_URL=your_webhook_url_here</code></li>
          <li>Restart your development server</li>
          <li>Test the webhook using the button above</li>
        </ol>
        
        <div className="troubleshooting">
          <h4>Troubleshooting:</h4>
          <ul>
            <li>Make sure your webhook URL is correct and starts with <code>https://discord.com/api/webhooks/</code></li>
            <li>Check that the Discord channel still exists and the webhook is active</li>
            <li>Verify your internet connection</li>
            <li>Check the browser console for detailed error messages</li>
            <li>Try creating a new webhook if the current one doesn't work</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WebhookTest; 