import { DISCORD_CONFIG, DISCORD_COLORS, DISCORD_EMOJIS } from '../config/discord';

interface ApprovalRequest {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  websiteId: string;
  timestamp: number;
}

interface PendingApproval {
  userId: string;
  userName: string;
  userEmail: string;
  userRole: string;
  websiteId: string;
  timestamp: number;
}

class DiscordBot {
  private botToken: string;
  private webhookUrl: string;
  private channelId: string;
  private pendingApprovals: Map<string, ApprovalRequest> = new Map();

  constructor() {
    this.botToken = DISCORD_CONFIG.BOT_TOKEN;
    this.webhookUrl = DISCORD_CONFIG.WEBHOOK_URL;
    this.channelId = DISCORD_CONFIG.CHANNEL_ID;
  }

  async sendApprovalRequest(userId: string, userName: string, userEmail: string, userRole: string, websiteId: string): Promise<boolean> {
    try {
      const approvalRequest: ApprovalRequest = {
        userId,
        userName,
        userEmail,
        userRole,
        websiteId,
        timestamp: Date.now()
      };

      this.pendingApprovals.set(userId, approvalRequest);

      const embed = {
        title: `${DISCORD_EMOJIS.PENDING} New Teacher Approval Request`,
        description: `A new teacher account requires approval.`,
        color: DISCORD_COLORS.PENDING,
        fields: [
          {
            name: 'User Information',
            value: `**Name:** ${userName}\n**Email:** ${userEmail}\n**Role:** ${userRole}\n**Website ID:** ${websiteId}`,
            inline: false
          },
          {
            name: 'Actions',
            value: `Use \`/approve ${userId}\` to approve\nUse \`/deny ${userId}\` to deny`,
            inline: false
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'Teacher Approval System'
        }
      };

      const payload = {
        embeds: [embed],
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 3,
                label: 'Approve',
                custom_id: `approve_${userId}`,
                emoji: {
                  name: '✅'
                }
              },
              {
                type: 2,
                style: 4,
                label: 'Deny',
                custom_id: `deny_${userId}`,
                emoji: {
                  name: '❌'
                }
              }
            ]
          }
        ]
      };

      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending approval request to Discord:', error);
      return false;
    }
  }

  async handleButtonInteraction(interaction: any): Promise<void> {
    const { custom_id } = interaction.data;
    
    if (custom_id.startsWith('approve_')) {
      const userId = custom_id.replace('approve_', '');
      await this.approveUser(userId, interaction);
    } else if (custom_id.startsWith('deny_')) {
      const userId = custom_id.replace('deny_', '');
      await this.denyUser(userId, interaction);
    }
  }

  async handleSlashCommand(interaction: any): Promise<void> {
    const { name, options } = interaction.data;
    
    switch (name) {
      case 'approve':
        const approveUserId = options?.find((opt: any) => opt.name === 'userid')?.value;
        if (approveUserId) {
          await this.approveUser(approveUserId, interaction);
        }
        break;
        
      case 'deny':
        const denyUserId = options?.find((opt: any) => opt.name === 'userid')?.value;
        if (denyUserId) {
          await this.denyUser(denyUserId, interaction);
        }
        break;
        
      case 'list-pending':
        await this.listPendingApprovals(interaction);
        break;
    }
  }

  private async approveUser(userId: string, interaction: any): Promise<void> {
    const approvalRequest = this.pendingApprovals.get(userId);
    
    if (!approvalRequest) {
      await this.replyToInteraction(interaction, 'User not found in pending approvals.', false);
      return;
    }

    this.pendingApprovals.delete(userId);

    this.updateUserApprovalStatus(userId, 'approved');

    await this.sendApprovalNotification(approvalRequest, 'approved');

    const embed = {
      title: `${DISCORD_EMOJIS.APPROVAL} Teacher Approved Successfully`,
      description: `The teacher account has been approved and the user has been notified.`,
      color: DISCORD_COLORS.SUCCESS,
      fields: [
        {
          name: 'User Information',
          value: `**Name:** ${approvalRequest.userName}\n**Email:** ${approvalRequest.userEmail}\n**Role:** ${approvalRequest.userRole}`,
          inline: false
        },
        {
          name: 'Status',
          value: '✅ **APPROVED** - User can now login to their account',
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Teacher Approval System'
      }
    };

    await this.replyToInteraction(interaction, embed, true);
  }

  private async denyUser(userId: string, interaction: any): Promise<void> {
    const approvalRequest = this.pendingApprovals.get(userId);
    
    if (!approvalRequest) {
      await this.replyToInteraction(interaction, 'User not found in pending approvals.', false);
      return;
    }

    this.pendingApprovals.delete(userId);

    this.updateUserApprovalStatus(userId, 'denied');

    await this.sendApprovalNotification(approvalRequest, 'denied');

    const embed = {
      title: `${DISCORD_EMOJIS.REJECTION} Teacher Denied Successfully`,
      description: `The teacher account has been denied and the user has been notified.`,
      color: DISCORD_COLORS.ERROR,
      fields: [
        {
          name: 'User Information',
          value: `**Name:** ${approvalRequest.userName}\n**Email:** ${approvalRequest.userEmail}\n**Role:** ${approvalRequest.userRole}`,
          inline: false
        },
        {
          name: 'Status',
          value: '❌ **DENIED** - User cannot access their account',
          inline: false
        }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Teacher Approval System'
      }
    };

    await this.replyToInteraction(interaction, embed, true);
  }

  private async sendApprovalNotification(approvalRequest: ApprovalRequest, status: 'approved' | 'denied'): Promise<void> {
    try {
      const embed = {
        title: status === 'approved' 
          ? `${DISCORD_EMOJIS.APPROVAL} Account Approved Successfully`
          : `${DISCORD_EMOJIS.REJECTION} Account Denied Successfully`,
        description: status === 'approved'
          ? `**${approvalRequest.userName}**'s teacher account has been approved! They can now login to AtlasMeet.`
          : `**${approvalRequest.userName}**'s teacher account has been denied. They cannot access AtlasMeet.`,
        color: status === 'approved' ? DISCORD_COLORS.SUCCESS : DISCORD_COLORS.ERROR,
        fields: [
          {
            name: 'User Details',
            value: `**Name:** ${approvalRequest.userName}\n**Email:** ${approvalRequest.userEmail}\n**Website ID:** ${approvalRequest.websiteId}`,
            inline: false
          },
          {
            name: 'Action',
            value: status === 'approved' ? '✅ **APPROVED**' : '❌ **DENIED**',
            inline: false
          },
          {
            name: 'Timestamp',
            value: new Date().toLocaleString(),
            inline: false
          }
        ],
        timestamp: new Date().toISOString(),
        footer: {
          text: 'AtlasMeet Approval System'
        }
      };

      const payload = {
        embeds: [embed]
      };

      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error('Error sending approval notification to Discord:', error);
    }
  }

  private async listPendingApprovals(interaction: any): Promise<void> {
    if (this.pendingApprovals.size === 0) {
      await this.replyToInteraction(interaction, 'No pending approvals.', false);
      return;
    }

    const pendingList = Array.from(this.pendingApprovals.values())
      .map((req, index) => `${index + 1}. **${req.userName}** (${req.userEmail}) - ID: \`${req.userId}\``)
      .join('\n');

    const embed = {
      title: `${DISCORD_EMOJIS.PENDING} Pending Approvals`,
      description: pendingList,
      color: DISCORD_COLORS.WARNING,
      timestamp: new Date().toISOString(),
      footer: {
        text: `Total: ${this.pendingApprovals.size} pending`
      }
    };

    await this.replyToInteraction(interaction, embed, true);
  }

  private async replyToInteraction(interaction: any, content: any, isEmbed: boolean): Promise<void> {
    try {
      const response = {
        type: 4,
        data: isEmbed ? { embeds: [content] } : { content }
      };

      await fetch(`https://discord.com/api/v10/interactions/${interaction.id}/${interaction.token}/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bot ${this.botToken}`
        },
        body: JSON.stringify(response)
      });
    } catch (error) {
      console.error('Error replying to Discord interaction:', error);
    }
  }

  private updateUserApprovalStatus(userId: string, status: 'approved' | 'denied'): void {
    try {
      const createdAccountsJson = localStorage.getItem('atlasmeet_created_accounts');
      if (createdAccountsJson) {
        const createdAccounts = JSON.parse(createdAccountsJson);
        const accountIndex = createdAccounts.findIndex((account: any) => account.id === userId);
        
        if (accountIndex !== -1) {
          createdAccounts[accountIndex].isApproved = status === 'approved';
          createdAccounts[accountIndex].approvalStatus = status;
          localStorage.setItem('atlasmeet_created_accounts', JSON.stringify(createdAccounts));
        }
      }

      const currentUserJson = localStorage.getItem('atlasmeet_user');
      if (currentUserJson) {
        const currentUser = JSON.parse(currentUserJson);
        if (currentUser.id === userId) {
          currentUser.isApproved = status === 'approved';
          currentUser.approvalStatus = status;
          localStorage.setItem('atlasmeet_user', JSON.stringify(currentUser));
        }
      }
    } catch (error) {
      console.error('Error updating user approval status:', error);
    }
  }

  getPendingApprovalsCount(): number {
    return this.pendingApprovals.size;
  }

  getPendingApprovals(): PendingApproval[] {
    return Array.from(this.pendingApprovals.values());
  }

  async approveUserViaWebhook(userId: string): Promise<boolean> {
    const approvalRequest = this.pendingApprovals.get(userId);
    
    if (!approvalRequest) {
      console.error('User not found in pending approvals:', userId);
      return false;
    }

    this.pendingApprovals.delete(userId);

    this.updateUserApprovalStatus(userId, 'approved');

    await this.sendApprovalNotification(approvalRequest, 'approved');

    return true;
  }

  async denyUserViaWebhook(userId: string): Promise<boolean> {
    const approvalRequest = this.pendingApprovals.get(userId);
    
    if (!approvalRequest) {
      console.error('User not found in pending approvals:', userId);
      return false;
    }

    this.pendingApprovals.delete(userId);

    this.updateUserApprovalStatus(userId, 'denied');

    await this.sendApprovalNotification(approvalRequest, 'denied');

    return true;
  }
}

export const discordBot = new DiscordBot(); 