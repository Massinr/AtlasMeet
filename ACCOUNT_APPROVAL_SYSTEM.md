# Account Approval System

This document describes the account approval system implemented in AtlasMeet.

## Overview

The account approval system requires new user registrations to be approved by an administrator before they can access the platform. This adds an extra layer of security and control over who can join the platform.

## Features

### 1. Registration Flow
- When a user registers, their account is created with `approvalStatus: 'pending'`
- Users are redirected to a pending approval page after registration
- A Discord notification is sent with approval/denial buttons

### 2. Pending Approval Page
- Shows user information (name, email, role)
- Displays what happens next
- Allows users to sign out or return to home
- Prevents access to protected routes while pending

### 3. Discord Integration
- Sends approval requests to Discord with user information
- Includes Approve/Deny buttons (requires Discord bot with button permissions)
- Logs approval/denial actions

### 4. Admin Panel
- Accessible at `/admin` (dev users only)
- Shows all pending account approvals
- Allows admins to approve or deny accounts
- Optional reason field for denials

## User Flow

### For New Users:
1. User registers on `/register`
2. Account is created with `approvalStatus: 'pending'`
3. User is redirected to `/pending-approval`
4. Discord notification is sent to admin channel
5. User waits for approval

### For Admins:
1. Admin receives Discord notification
2. Admin can click Approve/Deny buttons in Discord
3. Or admin can visit `/admin` to manage approvals
4. Admin approves/denies account with optional reason
5. User status is updated accordingly

### After Approval:
- Approved users can access all features
- Denied users are redirected to home page
- All actions are logged to Discord

## Technical Implementation

### Database Schema
```typescript
interface User {
  // ... existing fields
  isApproved?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'denied';
}

interface CreatedAccount {
  // ... existing fields
  isApproved?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'denied';
  denialReason?: string;
}
```

### Discord Integration
- New activity types: `ACCOUNT_APPROVAL_REQUEST`, `ACCOUNT_APPROVED`, `ACCOUNT_DENIED`
- Discord buttons for approve/deny actions
- Rich embeds with user information

### Route Protection
- `ProtectedRoute` component checks approval status
- Pending users redirected to `/pending-approval`
- Denied users redirected to home page

## Setup Instructions

### 1. Discord Bot Setup
1. Create a Discord bot with button permissions
2. Set up webhook URL in environment variables
3. Configure bot to handle button interactions

### 2. Environment Variables
```env
REACT_APP_DISCORD_WEBHOOK_URL=your_webhook_url
REACT_APP_DISCORD_BOT_TOKEN=your_bot_token
REACT_APP_DISCORD_CHANNEL_ID=your_channel_id
```

### 3. Testing
1. Register a new account
2. Check Discord for approval request
3. Visit `/admin` as dev user to manage approvals
4. Test approve/deny functionality

## Security Considerations

- Only dev users can access admin panel
- All approval actions are logged
- Users cannot bypass approval by direct URL access
- Discord notifications provide audit trail

## Future Enhancements

- Email notifications for approval status changes
- Bulk approval/denial functionality
- Approval criteria configuration
- Integration with external identity providers
- Automated approval based on email domain

## Troubleshooting

### Discord Buttons Not Working
- Ensure bot has button permissions
- Check webhook URL is correct
- Verify bot is online and in the server

### Users Stuck on Pending Page
- Check if approval functions are working
- Verify user status in localStorage
- Check browser console for errors

### Admin Panel Not Accessible
- Ensure user has 'dev' role
- Check authentication state
- Verify route is properly configured 