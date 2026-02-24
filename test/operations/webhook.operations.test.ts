import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { IExecuteFunctions } from 'n8n-workflow';
import * as webhookOps from '../../nodes/Timesheet/operations/webhook.operations';
import {
  createMockExecuteFunctions,
  createMockTimesheetClient,
  createMockApiClient,
  createMockPage,
  mockWebhook,
  mockWebhooks,
} from '../helpers/mocks';

describe('Webhook Operations', () => {
  let mockContext: IExecuteFunctions;
  let mockClient: ReturnType<typeof createMockTimesheetClient>;
  let mockApiClient: ReturnType<typeof createMockApiClient>;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = createMockTimesheetClient();
    mockApiClient = createMockApiClient(mockClient);
  });

  describe('createWebhook', () => {
    it('should create a webhook with target and event', async () => {
      mockContext.getNodeParameter = vi
        .fn()
        .mockReturnValueOnce('https://example.com/webhook')
        .mockReturnValueOnce('timer.start');

      mockClient.webhooks.create.mockResolvedValue(mockWebhook);

      const result = await webhookOps.createWebhook.call(mockContext, mockApiClient, 0);

      expect(mockClient.webhooks.create).toHaveBeenCalledWith({
        target: 'https://example.com/webhook',
        event: 'timer.start',
      });

      expect(result.id).toBe('webhook-1');
      expect(result.target).toBe('https://example.com/webhook');
      expect(result.event).toBe('timer.start');
      expect(result.created).toBe(1706533200000);
    });

    it('should create webhook with different event type', async () => {
      mockContext.getNodeParameter = vi
        .fn()
        .mockReturnValueOnce('https://api.example.com/hooks')
        .mockReturnValueOnce('task.create');

      const newWebhook = {
        ...mockWebhook,
        id: 'webhook-4',
        target: 'https://api.example.com/hooks',
        event: 'task.create',
      };

      mockClient.webhooks.create.mockResolvedValue(newWebhook);

      const result = await webhookOps.createWebhook.call(mockContext, mockApiClient, 0);

      expect(mockClient.webhooks.create).toHaveBeenCalledWith({
        target: 'https://api.example.com/hooks',
        event: 'task.create',
      });

      expect(result.event).toBe('task.create');
    });
  });

  describe('getWebhook', () => {
    it('should get a webhook by ID', async () => {
      mockContext.getNodeParameter = vi.fn().mockReturnValueOnce('webhook-1');

      mockClient.webhooks.get.mockResolvedValue(mockWebhook);

      const result = await webhookOps.getWebhook.call(mockContext, mockApiClient, 0);

      expect(mockClient.webhooks.get).toHaveBeenCalledWith('webhook-1');
      expect(result.id).toBe('webhook-1');
      expect(result.target).toBe('https://example.com/webhook');
      expect(result.event).toBe('timer.start');
    });
  });

  describe('updateWebhook', () => {
    it('should update webhook target', async () => {
      mockContext.getNodeParameter = vi
        .fn()
        .mockReturnValueOnce('webhook-1')
        .mockReturnValueOnce({ target: 'https://new.example.com/webhook' });

      mockClient.webhooks.update.mockResolvedValue({
        ...mockWebhook,
        target: 'https://new.example.com/webhook',
      });

      const result = await webhookOps.updateWebhook.call(mockContext, mockApiClient, 0);

      expect(mockClient.webhooks.update).toHaveBeenCalledWith('webhook-1', {
        target: 'https://new.example.com/webhook',
        event: undefined,
      });

      expect(result.target).toBe('https://new.example.com/webhook');
    });

    it('should update webhook event', async () => {
      mockContext.getNodeParameter = vi
        .fn()
        .mockReturnValueOnce('webhook-1')
        .mockReturnValueOnce({ event: 'timer.stop' });

      mockClient.webhooks.update.mockResolvedValue({
        ...mockWebhook,
        event: 'timer.stop',
      });

      const result = await webhookOps.updateWebhook.call(mockContext, mockApiClient, 0);

      expect(mockClient.webhooks.update).toHaveBeenCalledWith('webhook-1', {
        target: undefined,
        event: 'timer.stop',
      });

      expect(result.event).toBe('timer.stop');
    });

    it('should update both target and event', async () => {
      mockContext.getNodeParameter = vi.fn().mockReturnValueOnce('webhook-1').mockReturnValueOnce({
        target: 'https://updated.example.com/webhook',
        event: 'project.update',
      });

      mockClient.webhooks.update.mockResolvedValue({
        ...mockWebhook,
        target: 'https://updated.example.com/webhook',
        event: 'project.update',
      });

      const result = await webhookOps.updateWebhook.call(mockContext, mockApiClient, 0);

      expect(mockClient.webhooks.update).toHaveBeenCalledWith('webhook-1', {
        target: 'https://updated.example.com/webhook',
        event: 'project.update',
      });

      expect(result.target).toBe('https://updated.example.com/webhook');
      expect(result.event).toBe('project.update');
    });

    it('should handle empty update fields', async () => {
      mockContext.getNodeParameter = vi
        .fn()
        .mockReturnValueOnce('webhook-1')
        .mockReturnValueOnce({});

      mockClient.webhooks.update.mockResolvedValue(mockWebhook);

      const result = await webhookOps.updateWebhook.call(mockContext, mockApiClient, 0);

      expect(mockClient.webhooks.update).toHaveBeenCalledWith('webhook-1', {
        target: undefined,
        event: undefined,
      });

      expect(result.id).toBe('webhook-1');
    });
  });

  describe('deleteWebhook', () => {
    it('should delete a webhook', async () => {
      mockContext.getNodeParameter = vi.fn().mockReturnValueOnce('webhook-1');

      mockClient.webhooks.delete.mockResolvedValue(undefined);

      const result = await webhookOps.deleteWebhook.call(mockContext, mockApiClient, 0);

      expect(mockClient.webhooks.delete).toHaveBeenCalledWith('webhook-1');
      expect(result.success).toBe(true);
    });
  });

  describe('getManyWebhooks', () => {
    it('should get limited webhooks without filters', async () => {
      mockContext.getNodeParameter = vi
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce({})
        .mockReturnValueOnce(50);

      const page = createMockPage(mockWebhooks);
      mockClient.webhooks.search.mockResolvedValue(page);

      const result = await webhookOps.getManyWebhooks.call(mockContext, mockApiClient, 0);

      expect(mockClient.webhooks.search).toHaveBeenCalledWith({
        event: undefined,
        sort: undefined,
        order: undefined,
        limit: 50,
      });

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('webhook-1');
    });

    it('should get all webhooks with pagination', async () => {
      mockContext.getNodeParameter = vi.fn().mockReturnValueOnce(true).mockReturnValueOnce({});

      const page1 = createMockPage([mockWebhooks[0], mockWebhooks[1]], 3);
      const page2 = createMockPage([mockWebhooks[2]], 3);

      page1.hasNextPage = true;
      page2.hasNextPage = false;

      mockClient.webhooks.search.mockResolvedValueOnce(page1);
      page1.nextPage.mockResolvedValueOnce(page2);

      const result = await webhookOps.getManyWebhooks.call(mockContext, mockApiClient, 0);

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('webhook-1');
      expect(result[1].id).toBe('webhook-2');
      expect(result[2].id).toBe('webhook-3');
    });

    it('should filter webhooks by event', async () => {
      mockContext.getNodeParameter = vi
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce({ event: 'timer.start' })
        .mockReturnValueOnce(50);

      const page = createMockPage([mockWebhooks[0]]);
      mockClient.webhooks.search.mockResolvedValue(page);

      const result = await webhookOps.getManyWebhooks.call(mockContext, mockApiClient, 0);

      expect(mockClient.webhooks.search).toHaveBeenCalledWith({
        event: 'timer.start',
        sort: undefined,
        order: undefined,
        limit: 50,
      });

      expect(result).toHaveLength(1);
      expect(result[0].event).toBe('timer.start');
    });

    it('should sort webhooks', async () => {
      mockContext.getNodeParameter = vi
        .fn()
        .mockReturnValueOnce(false)
        .mockReturnValueOnce({ sort: 'created', order: 'desc' })
        .mockReturnValueOnce(50);

      const page = createMockPage(mockWebhooks);
      mockClient.webhooks.search.mockResolvedValue(page);

      const result = await webhookOps.getManyWebhooks.call(mockContext, mockApiClient, 0);

      expect(mockClient.webhooks.search).toHaveBeenCalledWith({
        event: undefined,
        sort: 'created',
        order: 'desc',
        limit: 50,
      });

      expect(result).toHaveLength(3);
    });
  });
});
