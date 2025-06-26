import { DISCORD_CONFIG, DISCORD_COLORS, DISCORD_EMOJIS, ACTIVITY_TYPES, ActivityType } from '../config/discord';

interface DiscordLogData {
  action: ActivityType;
  userId: string;
  userName: string;
  userEmail: string;
  userRole: 'teacher' | 'student';
  websiteId: string;
  details: {
    eventId?: string;
    eventTitle?: string;
    studentId?: string;
    studentName?: string;
    teacherNotes?: string;
    approvedBy?: string;
    deniedBy?: string;
    reason?: string;
    timestamp: string;
  };
}

class DiscordLogger {
  private webhookUrl: string;
  private botToken: string;
  private channelId: string;
  private isEnabled: boolean;

  constructor() {
    this.webhookUrl = DISCORD_CONFIG.WEBHOOK_URL;
    this.botToken = DISCORD_CONFIG.BOT_TOKEN;
    this.channelId = DISCORD_CONFIG.CHANNEL_ID;
    this.isEnabled = this.validateWebhookUrl();
    
    if (!this.isEnabled) {
      console.warn('Discord logging is disabled. Please check your webhook configuration.');
    }
  }

  private validateWebhookUrl(): boolean {
    if (!this.webhookUrl || this.webhookUrl === '') {
      console.warn('Discord webhook URL not configured. Please set REACT_APP_DISCORD_WEBHOOK_URL environment variable.');
      return false;
    }

    if (!this.webhookUrl.startsWith('https://discord.com/api/webhooks/')) {
      console.error('Invalid Discord webhook URL format. URL should start with https://discord.com/api/webhooks/');
      return false;
    }

    return true;
  }

  private async sendDiscordMessage(embed: any) {
    if (!this.isEnabled) {
      console.log('Discord logging disabled - would have sent:', embed);
      return;
    }

    try {
      console.log('Attempting to send Discord message...');
      console.log('Webhook URL:', this.webhookUrl ? 'Configured' : 'Not configured');
      
      const payload = {
        embeds: [embed],
        username: 'AtlasMeet Logger',
        avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      };

      console.log('Sending payload:', JSON.stringify(payload, null, 2));

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Discord response status:', response.status);
      console.log('Discord response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to send Discord message:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: this.webhookUrl,
        });
        
        try {
          const errorJson = JSON.parse(errorText);
          console.error('Discord API error details:', errorJson);
        } catch (e) {
          console.error('Could not parse Discord error response');
        }
      } else {
        console.log('Discord log sent successfully');
      }
    } catch (error) {
      console.error('Error sending Discord message:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        webhookUrl: this.webhookUrl ? 'Configured' : 'Not configured',
      });
    }
  }

  private getEmbedColor(action: ActivityType): number {
    switch (action) {
      case ACTIVITY_TYPES.ACCOUNT_CREATED:
        return DISCORD_COLORS.SUCCESS;
      case ACTIVITY_TYPES.ACCOUNT_APPROVAL_REQUEST:
        return DISCORD_COLORS.PENDING;
      case ACTIVITY_TYPES.ACCOUNT_APPROVED:
        return DISCORD_COLORS.SUCCESS;
      case ACTIVITY_TYPES.ACCOUNT_DENIED:
        return DISCORD_COLORS.ERROR;
      case ACTIVITY_TYPES.EVENT_REGISTRATION:
        return DISCORD_COLORS.INFO;
      case ACTIVITY_TYPES.APPLICATION_APPROVED:
        return DISCORD_COLORS.SUCCESS;
      case ACTIVITY_TYPES.APPLICATION_REJECTED:
        return DISCORD_COLORS.ERROR;
      case ACTIVITY_TYPES.EVENT_CREATED:
        return DISCORD_COLORS.WARNING;
      case ACTIVITY_TYPES.EVENT_DELETED:
        return DISCORD_COLORS.ORANGE;
      default:
        return DISCORD_COLORS.NEUTRAL;
    }
  }

  private getActionEmoji(action: ActivityType): string {
    switch (action) {
      case ACTIVITY_TYPES.ACCOUNT_CREATED:
        return DISCORD_EMOJIS.ACCOUNT;
      case ACTIVITY_TYPES.ACCOUNT_APPROVAL_REQUEST:
        return DISCORD_EMOJIS.PENDING;
      case ACTIVITY_TYPES.ACCOUNT_APPROVED:
        return DISCORD_EMOJIS.APPROVAL;
      case ACTIVITY_TYPES.ACCOUNT_DENIED:
        return DISCORD_EMOJIS.REJECTION;
      case ACTIVITY_TYPES.EVENT_REGISTRATION:
        return DISCORD_EMOJIS.REGISTRATION;
      case ACTIVITY_TYPES.APPLICATION_APPROVED:
        return DISCORD_EMOJIS.APPROVAL;
      case ACTIVITY_TYPES.APPLICATION_REJECTED:
        return DISCORD_EMOJIS.REJECTION;
      case ACTIVITY_TYPES.EVENT_CREATED:
        return DISCORD_EMOJIS.EVENT;
      case ACTIVITY_TYPES.EVENT_DELETED:
        return DISCORD_EMOJIS.DELETE;
      default:
        return DISCORD_EMOJIS.LOG;
    }
  }

  private getActionTitle(action: ActivityType): string {
    switch (action) {
      case ACTIVITY_TYPES.ACCOUNT_CREATED:
        return 'Account Created';
      case ACTIVITY_TYPES.ACCOUNT_APPROVAL_REQUEST:
        return 'Account Approval Request';
      case ACTIVITY_TYPES.ACCOUNT_APPROVED:
        return 'Account Approved';
      case ACTIVITY_TYPES.ACCOUNT_DENIED:
        return 'Account Denied';
      case ACTIVITY_TYPES.EVENT_REGISTRATION:
        return 'Event Registration';
      case ACTIVITY_TYPES.APPLICATION_APPROVED:
        return 'Application Approved';
      case ACTIVITY_TYPES.APPLICATION_REJECTED:
        return 'Application Rejected';
      case ACTIVITY_TYPES.EVENT_CREATED:
        return 'Event Created';
      case ACTIVITY_TYPES.EVENT_DELETED:
        return 'Event Deleted';
      default:
        return 'Activity Log';
    }
  }

  async logActivity(data: DiscordLogData) {
    const embed = {
      title: `${this.getActionEmoji(data.action)} ${this.getActionTitle(data.action)}`,
      color: this.getEmbedColor(data.action),
      timestamp: data.details.timestamp,
      fields: [
        {
          name: `${DISCORD_EMOJIS.ACCOUNT} User Information`,
          value: `**Name:** ${data.userName}\n**Email:** ${data.userEmail}\n**Role:** ${data.userRole}\n**Website ID:** ${data.websiteId}`,
          inline: true,
        },
      ],
      footer: {
        text: 'AtlasMeet Security Log',
        icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      },
    };

    switch (data.action) {
      case ACTIVITY_TYPES.ACCOUNT_CREATED:
        embed.fields.push({
          name: `${DISCORD_EMOJIS.LOG} Details`,
          value: `New ${data.userRole} account created`,
          inline: false,
        });
        break;

      case ACTIVITY_TYPES.ACCOUNT_APPROVED:
        embed.fields.push(
          {
            name: `${DISCORD_EMOJIS.APPROVAL} Approval Details`,
            value: `**Approved by:** ${data.details.approvedBy}\n**Status:** Account approved`,
            inline: true,
          }
        );
        break;

      case ACTIVITY_TYPES.ACCOUNT_DENIED:
        embed.fields.push(
          {
            name: `${DISCORD_EMOJIS.REJECTION} Denial Details`,
            value: `**Denied by:** ${data.details.deniedBy}\n**Reason:** ${data.details.reason}`,
            inline: true,
          }
        );
        break;

      case ACTIVITY_TYPES.EVENT_REGISTRATION:
        embed.fields.push(
          {
            name: `${DISCORD_EMOJIS.EVENT} Event`,
            value: `**Title:** ${data.details.eventTitle}\n**Event ID:** ${data.details.eventId}`,
            inline: true,
          },
          {
            name: `${DISCORD_EMOJIS.REGISTRATION} Application`,
            value: 'CV submitted for review',
            inline: true,
          }
        );
        break;

      case ACTIVITY_TYPES.APPLICATION_APPROVED:
        embed.fields.push(
          {
            name: `${DISCORD_EMOJIS.EVENT} Event`,
            value: `**Title:** ${data.details.eventTitle}\n**Event ID:** ${data.details.eventId}`,
            inline: true,
          },
          {
            name: `${DISCORD_EMOJIS.STUDENT} Student`,
            value: `**Name:** ${data.details.studentName}\n**Student ID:** ${data.details.studentId}`,
            inline: true,
          },
          {
            name: `${DISCORD_EMOJIS.NOTES} Teacher Notes`,
            value: data.details.teacherNotes || 'No notes provided',
            inline: false,
          }
        );
        break;

      case ACTIVITY_TYPES.APPLICATION_REJECTED:
        embed.fields.push(
          {
            name: `${DISCORD_EMOJIS.EVENT} Event`,
            value: `**Title:** ${data.details.eventTitle}\n**Event ID:** ${data.details.eventId}`,
            inline: true,
          },
          {
            name: `${DISCORD_EMOJIS.STUDENT} Student`,
            value: `**Name:** ${data.details.studentName}\n**Student ID:** ${data.details.studentId}`,
            inline: true,
          },
          {
            name: `${DISCORD_EMOJIS.NOTES} Teacher Notes`,
            value: data.details.teacherNotes || 'No notes provided',
            inline: false,
          }
        );
        break;

      case ACTIVITY_TYPES.EVENT_CREATED:
        embed.fields.push(
          {
            name: `${DISCORD_EMOJIS.EVENT} Event`,
            value: `**Title:** ${data.details.eventTitle}\n**Event ID:** ${data.details.eventId}`,
            inline: true,
          },
          {
            name: `${DISCORD_EMOJIS.TEACHER} Teacher`,
            value: `**Name:** ${data.userName}\n**Teacher ID:** ${data.userId}`,
            inline: true,
          }
        );
        break;

      case ACTIVITY_TYPES.EVENT_DELETED:
        embed.fields.push(
          {
            name: `${DISCORD_EMOJIS.EVENT} Event`,
            value: `**Title:** ${data.details.eventTitle}\n**Event ID:** ${data.details.eventId}`,
            inline: true,
          },
          {
            name: `${DISCORD_EMOJIS.TEACHER} Teacher`,
            value: `**Name:** ${data.userName}\n**Teacher ID:** ${data.userId}`,
            inline: true,
          }
        );
        break;
    }

    await this.sendDiscordMessage(embed);
  }

  async logAccountCreation(data: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: 'teacher' | 'student';
    websiteId: string;
  }) {
    await this.logActivity({
      action: ACTIVITY_TYPES.ACCOUNT_CREATED,
      ...data,
      details: {
        timestamp: new Date().toISOString(),
      },
    });
  }

  async logAccountApprovalRequest(data: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: 'teacher' | 'student';
    websiteId: string;
  }) {
    const embed = {
      title: `${DISCORD_EMOJIS.PENDING} Account Approval Request`,
      color: DISCORD_COLORS.PENDING,
      timestamp: new Date().toISOString(),
      fields: [
        {
          name: `${DISCORD_EMOJIS.ACCOUNT} User Information`,
          value: `**Name:** ${data.userName}\n**Email:** ${data.userEmail}\n**Role:** ${data.userRole}\n**Website ID:** ${data.websiteId}`,
          inline: true,
        },
        {
          name: `${DISCORD_EMOJIS.LOG} Details`,
          value: `New ${data.userRole} account requires approval`,
          inline: false,
        }
      ],
      footer: {
        text: 'AtlasMeet Account Approval',
        icon_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      },
    };

    const payload = {
      embeds: [embed],
      username: 'AtlasMeet Approval Bot',
      avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              style: 3,
              label: 'Approve',
              custom_id: `approve_${data.userId}`,
              emoji: {
                name: '👍'
              }
            },
            {
              type: 2,
              style: 4,
              label: 'Deny',
              custom_id: `deny_${data.userId}`,
              emoji: {
                name: '👎'
              }
            }
          ]
        }
      ]
    };

    await this.sendDiscordMessage(payload);
  }

  async logAccountApproval(data: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: 'teacher' | 'student';
    websiteId: string;
    approvedBy?: string;
  }) {
    await this.logActivity({
      action: ACTIVITY_TYPES.ACCOUNT_APPROVED,
      ...data,
      details: {
        approvedBy: data.approvedBy || 'Admin',
        timestamp: new Date().toISOString(),
      },
    });
  }

  async logAccountDenial(data: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: 'teacher' | 'student';
    websiteId: string;
    deniedBy?: string;
    reason?: string;
  }) {
    await this.logActivity({
      action: ACTIVITY_TYPES.ACCOUNT_DENIED,
      ...data,
      details: {
        deniedBy: data.deniedBy || 'Admin',
        reason: data.reason || 'No reason provided',
        timestamp: new Date().toISOString(),
      },
    });
  }

  async logEventRegistration(data: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: 'teacher' | 'student';
    websiteId: string;
    eventId: string;
    eventTitle: string;
  }) {
    await this.logActivity({
      action: ACTIVITY_TYPES.EVENT_REGISTRATION,
      ...data,
      details: {
        eventId: data.eventId,
        eventTitle: data.eventTitle,
        timestamp: new Date().toISOString(),
      },
    });
  }

  async logApplicationApproval(data: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: 'teacher' | 'student';
    websiteId: string;
    eventId: string;
    eventTitle: string;
    studentId: string;
    studentName: string;
    teacherNotes?: string;
  }) {
    await this.logActivity({
      action: ACTIVITY_TYPES.APPLICATION_APPROVED,
      ...data,
      details: {
        eventId: data.eventId,
        eventTitle: data.eventTitle,
        studentId: data.studentId,
        studentName: data.studentName,
        teacherNotes: data.teacherNotes,
        timestamp: new Date().toISOString(),
      },
    });
  }

  async logApplicationRejection(data: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: 'teacher' | 'student';
    websiteId: string;
    eventId: string;
    eventTitle: string;
    studentId: string;
    studentName: string;
    teacherNotes?: string;
  }) {
    await this.logActivity({
      action: ACTIVITY_TYPES.APPLICATION_REJECTED,
      ...data,
      details: {
        eventId: data.eventId,
        eventTitle: data.eventTitle,
        studentId: data.studentId,
        studentName: data.studentName,
        teacherNotes: data.teacherNotes,
        timestamp: new Date().toISOString(),
      },
    });
  }

  async logEventCreation(data: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: 'teacher' | 'student';
    websiteId: string;
    eventId: string;
    eventTitle: string;
  }) {
    await this.logActivity({
      action: ACTIVITY_TYPES.EVENT_CREATED,
      ...data,
      details: {
        eventId: data.eventId,
        eventTitle: data.eventTitle,
        timestamp: new Date().toISOString(),
      },
    });
  }

  async logEventDeletion(data: {
    userId: string;
    userName: string;
    userEmail: string;
    userRole: 'teacher' | 'student';
    websiteId: string;
    eventId: string;
    eventTitle: string;
  }) {
    await this.logActivity({
      action: ACTIVITY_TYPES.EVENT_DELETED,
      ...data,
      details: {
        eventId: data.eventId,
        eventTitle: data.eventTitle,
        timestamp: new Date().toISOString(),
      },
    });
  }
}

export const discordLogger = new DiscordLogger();
export default DiscordLogger; 