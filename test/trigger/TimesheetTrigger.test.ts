import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { IHookFunctions, IWebhookFunctions } from 'n8n-workflow';
import { TimesheetTrigger } from '../../nodes/TimesheetTrigger/TimesheetTrigger.node';
import { TimesheetApiClient } from '../../nodes/Timesheet/helpers/TimesheetApi';
import { createMockTimesheetClient, mockWebhook } from '../helpers/mocks';

// Mock TimesheetApiClient
vi.mock('../../nodes/Timesheet/helpers/TimesheetApi', () => {
  return {
    TimesheetApiClient: {
      fromHook: vi.fn(),
    },
  };
});

describe('TimesheetTrigger', () => {
  let trigger: TimesheetTrigger;
  let mockClient: ReturnType<typeof createMockTimesheetClient>;
  let mockHookContext: Partial<IHookFunctions>;
  let mockWebhookContext: Partial<IWebhookFunctions>;
  let webhookData: Record<string, unknown>;

  beforeEach(() => {
    trigger = new TimesheetTrigger();
    mockClient = createMockTimesheetClient();
    webhookData = {};

    // Mock TimesheetApiClient.fromHook to return our mock client
    const mockApiClient = {
      getClient: vi.fn(() => mockClient),
    };
    vi.mocked(TimesheetApiClient.fromHook).mockResolvedValue(mockApiClient as any);

    // Mock IHookFunctions context
    mockHookContext = {
      getNodeParameter: vi.fn(),
      getWorkflowStaticData: vi.fn(() => webhookData) as any,
      getNodeWebhookUrl: vi.fn(() => 'https://n8n.example.com/webhook/test'),
      getCredentials: vi.fn().mockImplementation((type: string) => {
        if (type === 'timesheetApi') {
          return Promise.resolve({
            baseUrl: 'https://api.timesheet.io',
            apiKey: 'test-api-key',
          });
        }
        return Promise.resolve({
          baseUrl: 'https://api.timesheet.io',
          oauthTokenData: {
            access_token: 'test-oauth-token',
          },
        });
      }),
    };

    // Mock IWebhookFunctions context
    mockWebhookContext = {
      getBodyData: vi.fn(),
      getNodeParameter: vi.fn(),
    };
  });

  describe('Node Description', () => {
    it('should have correct metadata', () => {
      expect(trigger.description.displayName).toBe('Timesheet Trigger');
      expect(trigger.description.name).toBe('timesheetTrigger');
      expect(trigger.description.group).toContain('trigger');
      expect(trigger.description.version).toBe(1);
    });

    it('should have events parameter with all 16 event types', () => {
      const eventsParam = trigger.description.properties.find((p) => p.name === 'events');
      expect(eventsParam).toBeDefined();
      expect(eventsParam?.type).toBe('multiOptions');
      expect(eventsParam?.required).toBe(true);

      const options = (eventsParam as any).options;
      expect(options).toHaveLength(16);

      // Verify all event types are present
      const eventValues = options.map((opt: any) => opt.value);
      expect(eventValues).toContain('timer.start');
      expect(eventValues).toContain('timer.stop');
      expect(eventValues).toContain('timer.pause');
      expect(eventValues).toContain('timer.resume');
      expect(eventValues).toContain('task.create');
      expect(eventValues).toContain('task.update');
      expect(eventValues).toContain('project.create');
      expect(eventValues).toContain('project.update');
      expect(eventValues).toContain('team.create');
      expect(eventValues).toContain('team.update');
      expect(eventValues).toContain('todo.create');
      expect(eventValues).toContain('todo.update');
      expect(eventValues).toContain('tag.create');
      expect(eventValues).toContain('tag.update');
      expect(eventValues).toContain('rate.create');
      expect(eventValues).toContain('rate.update');
    });

    it('should support API Key, OAuth2 and OAuth 2.1 authentication', () => {
      const authParam = trigger.description.properties.find((p) => p.name === 'authentication');
      expect(authParam).toBeDefined();

      const options = (authParam as any).options;
      expect(options).toHaveLength(3);
      expect(options[0].value).toBe('apiKey');
      expect(options[1].value).toBe('oAuth2');
      expect(options[2].value).toBe('oAuth21');
    });
  });

  describe('checkExists', () => {
    it('should return false when webhookIds is undefined', async () => {
      (mockHookContext.getNodeParameter as any).mockReturnValue(['timer.start']);

      const result = await trigger.webhookMethods.default.checkExists.call(
        mockHookContext as IHookFunctions,
      );

      expect(result).toBe(false);
    });

    it('should return false when webhook count does not match events count', async () => {
      webhookData.webhookIds = ['webhook-1'];
      (mockHookContext.getNodeParameter as any).mockReturnValue(['timer.start', 'timer.stop']);

      const result = await trigger.webhookMethods.default.checkExists.call(
        mockHookContext as IHookFunctions,
      );

      expect(result).toBe(false);
    });

    it('should return false when webhook target URL has changed', async () => {
      webhookData.webhookIds = ['webhook-1'];
      (mockHookContext.getNodeParameter as any).mockImplementation(
        (param: string, _index?: number) => {
          if (param === 'events') return ['timer.start'];
          if (param === 'authentication') return 'apiKey';
          return undefined;
        },
      );

      mockClient.webhooks.get.mockResolvedValue({
        ...mockWebhook,
        target: 'https://different-url.com/webhook',
      });

      const result = await trigger.webhookMethods.default.checkExists.call(
        mockHookContext as IHookFunctions,
      );

      expect(result).toBe(false);
    });

    it('should return false when webhook no longer exists', async () => {
      webhookData.webhookIds = ['webhook-1'];
      (mockHookContext.getNodeParameter as any).mockImplementation(
        (param: string, _index?: number) => {
          if (param === 'events') return ['timer.start'];
          if (param === 'authentication') return 'apiKey';
          return undefined;
        },
      );

      mockClient.webhooks.get.mockRejectedValue(new Error('Webhook not found'));

      const result = await trigger.webhookMethods.default.checkExists.call(
        mockHookContext as IHookFunctions,
      );

      expect(result).toBe(false);
    });

    it('should return true when all webhooks exist and are valid', async () => {
      webhookData.webhookIds = ['webhook-1'];
      (mockHookContext.getNodeParameter as any).mockImplementation(
        (param: string, _index?: number) => {
          if (param === 'events') return ['timer.start'];
          if (param === 'authentication') return 'apiKey';
          return undefined;
        },
      );

      mockClient.webhooks.get.mockResolvedValue({
        ...mockWebhook,
        target: 'https://n8n.example.com/webhook/test',
      });

      const result = await trigger.webhookMethods.default.checkExists.call(
        mockHookContext as IHookFunctions,
      );

      expect(result).toBe(true);
    });
  });

  describe('create', () => {
    it('should throw error if webhook URL is undefined', async () => {
      (mockHookContext.getNodeWebhookUrl as any).mockReturnValue(undefined);
      (mockHookContext.getNodeParameter as any).mockReturnValue(['timer.start']);

      await expect(
        trigger.webhookMethods.default.create.call(mockHookContext as IHookFunctions),
      ).rejects.toThrow('Webhook URL could not be determined');
    });

    it('should create webhooks for all selected events', async () => {
      (mockHookContext.getNodeParameter as any).mockImplementation(
        (param: string, _index?: number) => {
          if (param === 'events') return ['timer.start', 'timer.stop', 'task.create'];
          if (param === 'authentication') return 'apiKey';
          return undefined;
        },
      );

      mockClient.webhooks.create
        .mockResolvedValueOnce({ ...mockWebhook, id: 'webhook-1', event: 'timer.start' })
        .mockResolvedValueOnce({ ...mockWebhook, id: 'webhook-2', event: 'timer.stop' })
        .mockResolvedValueOnce({ ...mockWebhook, id: 'webhook-3', event: 'task.create' });

      const result = await trigger.webhookMethods.default.create.call(
        mockHookContext as IHookFunctions,
      );

      expect(result).toBe(true);
      expect(mockClient.webhooks.create).toHaveBeenCalledTimes(3);
      expect(mockClient.webhooks.create).toHaveBeenCalledWith({
        target: 'https://n8n.example.com/webhook/test',
        event: 'timer.start',
      });
      expect(webhookData.webhookIds).toEqual(['webhook-1', 'webhook-2', 'webhook-3']);
    });

    it('should cleanup webhooks on error during creation', async () => {
      (mockHookContext.getNodeParameter as any).mockImplementation(
        (param: string, _index?: number) => {
          if (param === 'events') return ['timer.start', 'timer.stop', 'task.create'];
          if (param === 'authentication') return 'apiKey';
          return undefined;
        },
      );

      mockClient.webhooks.create
        .mockResolvedValueOnce({ ...mockWebhook, id: 'webhook-1', event: 'timer.start' })
        .mockResolvedValueOnce({ ...mockWebhook, id: 'webhook-2', event: 'timer.stop' })
        .mockRejectedValueOnce(new Error('Failed to create webhook'));

      mockClient.webhooks.delete.mockResolvedValue(undefined);

      await expect(
        trigger.webhookMethods.default.create.call(mockHookContext as IHookFunctions),
      ).rejects.toThrow('Failed to create webhook');

      // Should have attempted to delete the successfully created webhooks
      expect(mockClient.webhooks.delete).toHaveBeenCalledWith('webhook-1');
      expect(mockClient.webhooks.delete).toHaveBeenCalledWith('webhook-2');
    });

    it('should work with OAuth2 authentication', async () => {
      (mockHookContext.getNodeParameter as any).mockImplementation(
        (param: string, _index?: number) => {
          if (param === 'events') return ['timer.start'];
          if (param === 'authentication') return 'oAuth2';
          return undefined;
        },
      );

      mockClient.webhooks.create.mockResolvedValueOnce({
        ...mockWebhook,
        id: 'webhook-1',
        event: 'timer.start',
      });

      const result = await trigger.webhookMethods.default.create.call(
        mockHookContext as IHookFunctions,
      );

      expect(result).toBe(true);
      expect(webhookData.webhookIds).toEqual(['webhook-1']);
    });
  });

  describe('delete', () => {
    it('should return true when no webhooks are registered', async () => {
      const result = await trigger.webhookMethods.default.delete.call(
        mockHookContext as IHookFunctions,
      );

      expect(result).toBe(true);
      expect(mockClient.webhooks.delete).not.toHaveBeenCalled();
    });

    it('should delete all registered webhooks', async () => {
      webhookData.webhookIds = ['webhook-1', 'webhook-2', 'webhook-3'];
      (mockHookContext.getNodeParameter as any).mockImplementation(
        (param: string, _index?: number) => {
          if (param === 'authentication') return 'apiKey';
          return undefined;
        },
      );

      mockClient.webhooks.delete.mockResolvedValue(undefined);

      const result = await trigger.webhookMethods.default.delete.call(
        mockHookContext as IHookFunctions,
      );

      expect(result).toBe(true);
      expect(mockClient.webhooks.delete).toHaveBeenCalledTimes(3);
      expect(mockClient.webhooks.delete).toHaveBeenCalledWith('webhook-1');
      expect(mockClient.webhooks.delete).toHaveBeenCalledWith('webhook-2');
      expect(mockClient.webhooks.delete).toHaveBeenCalledWith('webhook-3');
      expect(webhookData.webhookIds).toBeUndefined();
    });

    it('should ignore errors when deleting webhooks', async () => {
      webhookData.webhookIds = ['webhook-1', 'webhook-2'];
      (mockHookContext.getNodeParameter as any).mockImplementation(
        (param: string, _index?: number) => {
          if (param === 'authentication') return 'apiKey';
          return undefined;
        },
      );

      mockClient.webhooks.delete
        .mockRejectedValueOnce(new Error('Webhook not found'))
        .mockResolvedValueOnce(undefined);

      const result = await trigger.webhookMethods.default.delete.call(
        mockHookContext as IHookFunctions,
      );

      expect(result).toBe(true);
      expect(mockClient.webhooks.delete).toHaveBeenCalledTimes(2);
      expect(webhookData.webhookIds).toBeUndefined();
    });
  });

  describe('webhook', () => {
    it('should process matching event and return workflow data', async () => {
      const eventData = {
        event: 'timer.start',
        data: {
          taskId: 'task-123',
          projectId: 'project-456',
        },
      };

      (mockWebhookContext.getBodyData as any).mockReturnValue(eventData);
      (mockWebhookContext.getNodeParameter as any).mockReturnValue([
        'timer.start',
        'timer.stop',
        'task.create',
      ]);

      const result = await trigger.webhook.call(mockWebhookContext as IWebhookFunctions);

      expect(result.workflowData).toHaveLength(1);
      expect(result.workflowData![0]).toHaveLength(1);
      expect(result.workflowData![0][0].json).toEqual(eventData);
    });

    it('should handle event field named "type"', async () => {
      const eventData = {
        type: 'task.create',
        data: {
          taskId: 'task-789',
        },
      };

      (mockWebhookContext.getBodyData as any).mockReturnValue(eventData);
      (mockWebhookContext.getNodeParameter as any).mockReturnValue(['task.create', 'task.update']);

      const result = await trigger.webhook.call(mockWebhookContext as IWebhookFunctions);

      expect(result.workflowData).toHaveLength(1);
      expect(result.workflowData![0]).toHaveLength(1);
      expect(result.workflowData![0][0].json).toEqual(eventData);
    });

    it('should return empty data when event does not match filters', async () => {
      const eventData = {
        event: 'project.create',
        data: {
          projectId: 'project-999',
        },
      };

      (mockWebhookContext.getBodyData as any).mockReturnValue(eventData);
      (mockWebhookContext.getNodeParameter as any).mockReturnValue(['timer.start', 'timer.stop']);

      const result = await trigger.webhook.call(mockWebhookContext as IWebhookFunctions);

      expect(result.workflowData).toHaveLength(1);
      expect(result.workflowData![0]).toHaveLength(0);
    });

    it('should return empty data when event field is missing', async () => {
      const eventData = {
        data: {
          someField: 'someValue',
        },
      };

      (mockWebhookContext.getBodyData as any).mockReturnValue(eventData);
      (mockWebhookContext.getNodeParameter as any).mockReturnValue(['timer.start']);

      const result = await trigger.webhook.call(mockWebhookContext as IWebhookFunctions);

      expect(result.workflowData).toHaveLength(1);
      expect(result.workflowData![0]).toHaveLength(0);
    });
  });
});
