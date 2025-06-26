// Discord Bot Configuration
export const DISCORD_CONFIG = {
  // Webhook URL for sending messages to Discord channel
  // This should be set in your environment variables
  WEBHOOK_URL: process.env.REACT_APP_DISCORD_WEBHOOK_URL || '',
  
  // Bot token (if needed for additional functionality)
  BOT_TOKEN: process.env.DISCORD_BOT_TOKEN || '',
  
  // Channel ID where logs will be sent
  CHANNEL_ID: process.env.REACT_APP_DISCORD_CHANNEL_ID || '',
  
  // Server ID where the bot is located
  SERVER_ID: process.env.REACT_APP_DISCORD_SERVER_ID || '',
  
  // Bot application ID from the OAuth2 URL
  CLIENT_ID: '1387600095234494614',
  
  // OAuth2 authorization URL
  OAUTH_URL: 'https://discord.com/oauth2/authorize?client_id=1387600095234494614&permissions=8&integration_type=0&scope=bot',
};

// Discord embed colors for different actions
export const DISCORD_COLORS = {
  SUCCESS: 0x00ff00,    // Green
  INFO: 0x0099ff,       // Blue
  WARNING: 0xffff00,    // Yellow
  ERROR: 0xff0000,      // Red
  NEUTRAL: 0x808080,    // Gray
  ORANGE: 0xff6600,     // Orange
  PENDING: 0xffa500,    // Orange for pending
};

// Discord emojis for different actions
export const DISCORD_EMOJIS = {
  ACCOUNT: '👤',
  EVENT: '📅',
  REGISTRATION: '📝',
  APPROVAL: '✅',
  REJECTION: '❌',
  DELETE: '🗑️',
  LOG: '📋',
  TEACHER: '👨‍🏫',
  STUDENT: '👨‍🎓',
  NOTES: '💬',
  SECURITY: '🔒',
  PENDING: '⏳',
  APPROVE: '👍',
  DENY: '👎',
};

// Activity types that will be logged
export const ACTIVITY_TYPES = {
  ACCOUNT_CREATED: 'account_created',
  ACCOUNT_APPROVAL_REQUEST: 'account_approval_request',
  ACCOUNT_APPROVED: 'account_approved',
  ACCOUNT_DENIED: 'account_denied',
  EVENT_CREATED: 'event_created',
  EVENT_DELETED: 'event_deleted',
  EVENT_REGISTRATION: 'event_registration',
  APPLICATION_APPROVED: 'application_approved',
  APPLICATION_REJECTED: 'application_rejected',
} as const;

export type ActivityType = typeof ACTIVITY_TYPES[keyof typeof ACTIVITY_TYPES]; 