import type {
  IHookFunctions,
  IWebhookFunctions,
  INodeType,
  INodeTypeDescription,
  IWebhookResponseData,
} from 'n8n-workflow';

import { TimesheetApiClient } from '../Timesheet/helpers/TimesheetApi';

export class TimesheetTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Timesheet Trigger',
    name: 'timesheetTrigger',
    icon: 'file:timesheet.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["events"].join(", ")}}',
    description: 'Starts the workflow when timesheet.io events occur',
    defaults: {
      name: 'Timesheet Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'timesheetApi',
        required: true,
        displayOptions: {
          show: {
            authentication: ['apiKey'],
          },
        },
      },
      {
        name: 'timesheetOAuth2Api',
        required: true,
        displayOptions: {
          show: {
            authentication: ['oAuth2'],
          },
        },
      },
      {
        name: 'timesheetOAuth21Api',
        required: true,
        displayOptions: {
          show: {
            authentication: ['oAuth21'],
          },
        },
      },
    ],
    webhooks: [
      {
        name: 'default',
        httpMethod: 'POST',
        responseMode: 'onReceived',
        path: 'webhook',
      },
    ],
    properties: [
      {
        displayName: 'Authentication',
        name: 'authentication',
        type: 'options',
        options: [
          {
            name: 'API Key',
            value: 'apiKey',
          },
          {
            name: 'OAuth2',
            value: 'oAuth2',
          },
          {
            name: 'OAuth 2.1 (PKCE)',
            value: 'oAuth21',
          },
        ],
        default: 'apiKey',
      },
      {
        displayName: 'Events',
        name: 'events',
        type: 'multiOptions',
        required: true,
        default: [],
        description: 'The events to listen to',
        options: [
          {
            name: 'Timer Start',
            value: 'timer.start',
            description: 'Triggered when a timer is started',
          },
          {
            name: 'Timer Stop',
            value: 'timer.stop',
            description: 'Triggered when a timer is stopped',
          },
          {
            name: 'Timer Pause',
            value: 'timer.pause',
            description: 'Triggered when a timer is paused',
          },
          {
            name: 'Timer Resume',
            value: 'timer.resume',
            description: 'Triggered when a timer is resumed',
          },
          {
            name: 'Task Create',
            value: 'task.create',
            description: 'Triggered when a task is created',
          },
          {
            name: 'Task Update',
            value: 'task.update',
            description: 'Triggered when a task is updated',
          },
          {
            name: 'Project Create',
            value: 'project.create',
            description: 'Triggered when a project is created',
          },
          {
            name: 'Project Update',
            value: 'project.update',
            description: 'Triggered when a project is updated',
          },
          {
            name: 'Team Create',
            value: 'team.create',
            description: 'Triggered when a team is created',
          },
          {
            name: 'Team Update',
            value: 'team.update',
            description: 'Triggered when a team is updated',
          },
          {
            name: 'Todo Create',
            value: 'todo.create',
            description: 'Triggered when a todo is created',
          },
          {
            name: 'Todo Update',
            value: 'todo.update',
            description: 'Triggered when a todo is updated',
          },
          {
            name: 'Tag Create',
            value: 'tag.create',
            description: 'Triggered when a tag is created',
          },
          {
            name: 'Tag Update',
            value: 'tag.update',
            description: 'Triggered when a tag is updated',
          },
          {
            name: 'Rate Create',
            value: 'rate.create',
            description: 'Triggered when a rate is created',
          },
          {
            name: 'Rate Update',
            value: 'rate.update',
            description: 'Triggered when a rate is updated',
          },
        ],
      },
    ],
  };

  webhookMethods = {
    default: {
      async checkExists(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        const webhookUrl = this.getNodeWebhookUrl('default');
        const events = this.getNodeParameter('events') as string[];

        if (webhookData.webhookIds === undefined) {
          return false;
        }

        const client = await TimesheetApiClient.fromHook(this);
        const webhookIds = webhookData.webhookIds as string[];

        // Check if all registered webhooks still exist
        for (const webhookId of webhookIds) {
          try {
            const webhook = await client.getClient().webhooks.get(webhookId);
            // Verify webhook still points to our URL
            if (webhook.target !== webhookUrl) {
              return false;
            }
          } catch {
            // Webhook doesn't exist anymore
            return false;
          }
        }

        // Check if we have webhooks for all selected events
        if (webhookIds.length !== events.length) {
          return false;
        }

        return true;
      },

      async create(this: IHookFunctions): Promise<boolean> {
        const webhookUrl = this.getNodeWebhookUrl('default');
        if (!webhookUrl) {
          throw new Error('Webhook URL could not be determined');
        }

        const events = this.getNodeParameter('events') as string[];
        const webhookData = this.getWorkflowStaticData('node');

        const client = await TimesheetApiClient.fromHook(this);
        const webhookIds: string[] = [];

        // Create a webhook for each selected event
        for (const event of events) {
          try {
            const webhook = await client.getClient().webhooks.create({
              target: webhookUrl,
              event,
            });
            webhookIds.push(webhook.id);
          } catch (error) {
            // Clean up any webhooks we created before the error
            for (const webhookId of webhookIds) {
              try {
                await client.getClient().webhooks.delete(webhookId);
              } catch {
                // Ignore deletion errors
              }
            }
            throw error;
          }
        }

        webhookData.webhookIds = webhookIds;
        return true;
      },

      async delete(this: IHookFunctions): Promise<boolean> {
        const webhookData = this.getWorkflowStaticData('node');
        const webhookIds = webhookData.webhookIds as string[] | undefined;

        if (!webhookIds || webhookIds.length === 0) {
          return true;
        }

        const client = await TimesheetApiClient.fromHook(this);

        // Delete all registered webhooks
        for (const webhookId of webhookIds) {
          try {
            await client.getClient().webhooks.delete(webhookId);
          } catch {
            // Ignore errors if webhook is already deleted
          }
        }

        // Clear webhook data
        delete webhookData.webhookIds;
        return true;
      },
    },
  };

  // eslint-disable-next-line @typescript-eslint/require-await
  async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
    const bodyData = this.getBodyData();
    const events = this.getNodeParameter('events') as string[];

    // Extract event type from the webhook payload
    const eventType = (bodyData.event || bodyData.type || '') as string;

    // Only process if this event is one we're listening for
    if (eventType && events.includes(eventType)) {
      return {
        workflowData: [
          [
            {
              json: bodyData,
            },
          ],
        ],
      };
    }

    // Return empty if event doesn't match our filters
    return {
      workflowData: [[]],
    };
  }
}
