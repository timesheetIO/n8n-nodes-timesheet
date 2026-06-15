/**
 * Tests for pause operations
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as pauseOps from '../../nodes/Timesheet/operations/pause.operations';
import { createMockExecuteFunctions, createMockPage } from '../helpers/mocks';

const mockPause = {
  id: 'pause-1',
  description: 'Lunch break',
  startDateTime: '2025-01-29T12:00:00+00:00',
  endDateTime: '2025-01-29T12:30:00+00:00',
  running: false,
  task: { id: 'task-123' },
  created: 1706533200000,
  lastUpdate: 1706533200000,
};

const mockPauses = [mockPause, { ...mockPause, id: 'pause-2', description: 'Coffee break' }];

describe('Pause Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = {
      pauses: {
        create: vi.fn(),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        search: vi.fn(),
      },
    };
    mockApiClient = { getClient: () => mockClient };
  });

  describe('createPause', () => {
    it('should create a pause with required fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('task-123') // taskId
        .mockReturnValueOnce('2025-01-29T12:00:00+00:00') // startDateTime
        .mockReturnValueOnce('2025-01-29T12:30:00+00:00') // endDateTime
        .mockReturnValueOnce({}); // additionalFields

      mockClient.pauses.create.mockResolvedValue(mockPause);

      const result = await pauseOps.createPause.call(mockContext, mockApiClient, 0);

      expect(mockClient.pauses.create).toHaveBeenCalledWith({
        taskId: 'task-123',
        startDateTime: '2025-01-29T12:00:00+00:00',
        endDateTime: '2025-01-29T12:30:00+00:00',
        description: undefined,
      });

      expect(result).toEqual({
        id: 'pause-1',
        taskId: 'task-123',
        description: 'Lunch break',
        startDateTime: '2025-01-29T12:00:00+00:00',
        endDateTime: '2025-01-29T12:30:00+00:00',
        running: false,
        created: 1706533200000,
        lastUpdate: 1706533200000,
      });
    });

    it('should create a pause with additional fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('task-123')
        .mockReturnValueOnce('2025-01-29T12:00:00+00:00')
        .mockReturnValueOnce('2025-01-29T12:30:00+00:00')
        .mockReturnValueOnce({ description: 'Tea break' });

      mockClient.pauses.create.mockResolvedValue({
        ...mockPause,
        description: 'Tea break',
      });

      const result = await pauseOps.createPause.call(mockContext, mockApiClient, 0);

      expect(mockClient.pauses.create).toHaveBeenCalledWith({
        taskId: 'task-123',
        startDateTime: '2025-01-29T12:00:00+00:00',
        endDateTime: '2025-01-29T12:30:00+00:00',
        description: 'Tea break',
      });
      expect(result.description).toBe('Tea break');
    });
  });

  describe('getPause', () => {
    it('should retrieve a pause by ID', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('pause-1');
      mockClient.pauses.get.mockResolvedValue(mockPause);

      const result = await pauseOps.getPause.call(mockContext, mockApiClient, 0);

      expect(mockClient.pauses.get).toHaveBeenCalledWith('pause-1');
      expect(result.id).toBe('pause-1');
      expect(result.taskId).toBe('task-123');
    });
  });

  describe('updatePause', () => {
    it('should update pause fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('pause-1')
        .mockReturnValueOnce({ description: 'Updated break' });

      mockClient.pauses.update.mockResolvedValue({
        ...mockPause,
        description: 'Updated break',
      });

      const result = await pauseOps.updatePause.call(mockContext, mockApiClient, 0);

      expect(mockClient.pauses.update).toHaveBeenCalledWith('pause-1', {
        description: 'Updated break',
        startDateTime: undefined,
        endDateTime: undefined,
        deleted: undefined,
      });
      expect(result.description).toBe('Updated break');
    });
  });

  describe('deletePause', () => {
    it('should delete a pause', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('pause-1');
      mockClient.pauses.delete.mockResolvedValue(undefined);

      const result = await pauseOps.deletePause.call(mockContext, mockApiClient, 0);

      expect(mockClient.pauses.delete).toHaveBeenCalledWith('pause-1');
      expect(result).toEqual({ success: true, id: 'pause-1' });
    });
  });

  describe('getManyPauses', () => {
    it('should return limited pauses', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({}) // filters
        .mockReturnValueOnce(10); // limit

      mockClient.pauses.search.mockResolvedValue(createMockPage(mockPauses));

      const result = await pauseOps.getManyPauses.call(mockContext, mockApiClient, 0);

      expect(mockClient.pauses.search).toHaveBeenCalledWith({
        taskId: undefined,
        limit: 10,
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('pause-1');
    });

    it('should return all pauses with pagination', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(true) // returnAll
        .mockReturnValueOnce({}); // filters

      const page1 = createMockPage([mockPauses[0]], 2);
      const page2 = createMockPage([mockPauses[1]], 2);
      page1.hasNextPage = true;
      page2.hasNextPage = false;

      mockClient.pauses.search.mockResolvedValueOnce(page1);
      page1.nextPage.mockResolvedValueOnce(page2);

      const result = await pauseOps.getManyPauses.call(mockContext, mockApiClient, 0);

      expect(result).toHaveLength(2);
    });
  });
});
