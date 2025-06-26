# Discord Bot Setup for AtlasMeet Approval System

This guide explains how to integrate your existing Discord bot with the AtlasMeet approval system.

## Environment Variables

Add your Discord webhook URL to your `.env` file:

```env
REACT_APP_DISCORD_WEBHOOK_URL=your_webhook_url_here
REACT_APP_DISCORD_CHANNEL_ID=your_channel_id_here
REACT_APP_DISCORD_SERVER_ID=your_server_id_here
```

**Optional**: If you want to use Discord bot interactions (buttons/slash commands), also add:
```env
DISCORD_BOT_TOKEN=your_bot_token_here
```

## Two Integration Approaches

### Approach 1: Webhook-Only (Simpler)
This approach only requires a webhook URL and sends notifications to Discord.

**Pros:**
- No bot setup required
- Simpler to implement
- Works immediately with just webhook URL

**Cons:**
- No interactive buttons or slash commands
- Manual approval process needed

### Approach 2: Full Bot Integration
This approach uses both webhook and bot token for interactive features.

**Pros:**
- Interactive Approve/Deny buttons
- Slash commands for approval management
- Real-time interaction

**Cons:**
- Requires bot setup and permissions
- More complex to implement

## Webhook-Only Setup (Recommended for Quick Start)

### 1. Create Discord Webhook
1. Go to your Discord channel
2. Right-click → Edit Channel → Integrations → Webhooks
3. Create a new webhook
4. Copy the webhook URL

### 2. Add to Environment
```env
REACT_APP_DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your_webhook_url
```

### 3. Manual Approval Process
When a teacher registers:
1. Check your Discord channel for the approval request
2. Use the admin panel in AtlasMeet to approve/deny users
3. Notifications will be sent to Discord automatically

### 4. Admin Panel Usage
```javascript
// In your admin panel or console
import { discordBot } from '../services/DiscordBot';

// Approve a user
await discordBot.approveUserViaWebhook('user-id-here');

// Deny a user
await discordBot.denyUserViaWebhook('user-id-here');
```

## Full Bot Integration Setup

### Required Bot Permissions
Your Discord bot needs the following permissions:
- Send Messages
- Use Slash Commands
- Embed Links
- Add Reactions
- Manage Messages (optional, for cleanup)

### Slash Commands to Register

Your bot needs to register these slash commands:

#### `/approve <userid>`
- **Description**: Approve a teacher account
- **Parameters**: 
  - `userid` (string, required): The user ID to approve

#### `/deny <userid>`
- **Description**: Deny a teacher account
- **Parameters**:
  - `userid` (string, required): The user ID to deny

#### `/list-pending`
- **Description**: List all pending teacher approvals

### Integration Points

#### 1. Button Interactions
When users click the Approve/Deny buttons in Discord messages, your bot should call:

```javascript
// For button interactions
await discordBot.handleButtonInteraction(interaction);
```

#### 2. Slash Commands
When users use slash commands, your bot should call:

```javascript
// For slash commands
await discordBot.handleSlashCommand(interaction);
```

## How It Works

1. **Teacher Registration**: When a teacher registers, the system sends an approval request to Discord
2. **Approval Process**: 
   - **Webhook-only**: Use admin panel or manual methods
   - **Full bot**: Click buttons or use slash commands
3. **Status Updates**: The system automatically updates the user's approval status
4. **User Experience**: Pending teachers see a "pending approval" page until approved
5. **Notifications**: Success notifications are sent to Discord when users are approved or denied

## Features

### Automatic Status Checking
- The pending approval page automatically checks for status changes every 5 seconds
- Users are automatically redirected when approved or denied
- No manual refresh required

### Discord Notifications
- When a user is approved: A success message is sent to Discord
- When a user is denied: A denial message is sent to Discord
- Both notifications include user details, status information, and timestamp

### Real-time Updates
- Users see immediate feedback when their status changes
- Approved users are redirected to their dashboard
- Denied users are logged out and redirected to home

## Example Bot Integration

Here's a basic example of how to integrate with your existing Discord bot:

```javascript
// In your Discord bot's interaction handler
client.on('interactionCreate', async interaction => {
  if (interaction.isButton()) {
    // Handle button clicks (Approve/Deny buttons)
    await discordBot.handleButtonInteraction(interaction);
  } else if (interaction.isCommand()) {
    // Handle slash commands
    await discordBot.handleSlashCommand(interaction);
  }
});
```

## Testing

1. Register a new teacher account
2. Check your Discord channel for the approval request message
3. **Webhook-only**: Use admin panel to approve/deny
4. **Full bot**: Click the Approve/Deny buttons or use slash commands
5. Verify the user's status changes in the application
6. Check for success notifications in Discord
7. Verify the user is automatically redirected

## Troubleshooting

- **No approval messages**: Check your webhook URL and permissions
- **Buttons not working**: Ensure your bot has the correct permissions and is handling interactions
- **Slash commands not working**: Verify the commands are registered with Discord
- **Status not updating**: Check that the webhook URL is working
- **No notifications**: Ensure the webhook URL is working and has permission to send messages

## Security Notes

- Keep your webhook URL secure
- Consider adding role-based permissions to restrict who can approve/deny accounts
- The system uses localStorage for demo purposes - in production, use a proper database
- All approval actions are logged to Discord for audit purposes 