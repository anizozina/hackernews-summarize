import { IncomingWebhook } from '@slack/webhook';

export class SlackClient {
  private webhook: IncomingWebhook;
  constructor(webhookUrl: string) {
    this.webhook = new IncomingWebhook(webhookUrl);
  }
  async sendMessage(meta: string, summary: string) {
    if (!summary) return;
    await this.webhook.send({
      blocks: [
        {
          type: 'section',
          block_id: '1',
          text: { type: 'mrkdwn', text: summary },
        },
        {
          type: 'divider',
          block_id: '2',
        },
        {
          type: 'context',
          block_id: '3',
          elements: [{ type: 'mrkdwn', text: meta }],
        },
      ],
    });
  }
}
