/**
 * Tests for task operations
 */
import { describe, it, expect, beforeEach } from 'vitest';
import * as taskOps from '../../nodes/Timesheet/operations/task.operations';
import {
  createMockExecuteFunctions,
  createMockTimesheetClient,
  createMockApiClient,
  mockTask,
  mockTasks,
  createMockPage,
} from '../helpers/mocks';

describe('Task Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = createMockTimesheetClient();
    mockApiClient = createMockApiClient(mockClient);
  });

  describe('createTask', () => {
    it('should create a task with required fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ value: 'proj-123' }) // projectId
        .mockReturnValueOnce('2025-01-29T10:00:00+00:00') // startDateTime
        .mockReturnValueOnce('2025-01-29T12:00:00+00:00') // endDateTime
        .mockReturnValueOnce({}); // additionalFields

      mockClient.tasks.create.mockResolvedValue(mockTask);

      const result = await taskOps.createTask.call(mockContext, mockApiClient, 0);

      expect(mockClient.tasks.create).toHaveBeenCalledWith({
        projectId: 'proj-123',
        startDateTime: '2025-01-29T10:00:00+00:00',
        endDateTime: '2025-01-29T12:00:00+00:00',
        description: undefined,
        billable: undefined,
      });

      expect(result).toEqual({
        id: 'task-123',
        projectId: 'proj-123',
        projectTitle: 'Test Project',
        description: 'Test task',
        startDateTime: '2025-01-29T10:00:00+00:00',
        endDateTime: '2025-01-29T12:00:00+00:00',
        duration: 7200,
        hours: 2,
        minutes: 0,
        billable: true,
      });
    });

    it('should create a task with all fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ value: 'proj-123' })
        .mockReturnValueOnce('2025-01-29T10:00:00+00:00')
        .mockReturnValueOnce('2025-01-29T12:00:00+00:00')
        .mockReturnValueOnce({
          description: 'Working on feature X',
          billable: true,
        });

      mockClient.tasks.create.mockResolvedValue(mockTask);

      await taskOps.createTask.call(mockContext, mockApiClient, 0);

      expect(mockClient.tasks.create).toHaveBeenCalledWith({
        projectId: 'proj-123',
        startDateTime: '2025-01-29T10:00:00+00:00',
        endDateTime: '2025-01-29T12:00:00+00:00',
        description: 'Working on feature X',
        billable: true,
      });
    });

    it('should calculate hours and minutes correctly', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ value: 'proj-123' })
        .mockReturnValueOnce('2025-01-29T10:00:00+00:00')
        .mockReturnValueOnce('2025-01-29T11:30:00+00:00')
        .mockReturnValueOnce({});

      const taskWith90Minutes = {
        ...mockTask,
        duration: 5400, // 90 minutes
      };
      mockClient.tasks.create.mockResolvedValue(taskWith90Minutes);

      const result = await taskOps.createTask.call(mockContext, mockApiClient, 0);

      expect(result.hours).toBe(1);
      expect(result.minutes).toBe(30);
    });

    it('should throw error when endDateTime is before startDateTime', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ value: 'proj-123' }) // projectId
        .mockReturnValueOnce('2025-01-29T12:00:00+00:00') // startDateTime (later)
        .mockReturnValueOnce('2025-01-29T10:00:00+00:00') // endDateTime (earlier)
        .mockReturnValueOnce({}); // additionalFields

      await expect(taskOps.createTask.call(mockContext, mockApiClient, 0)).rejects.toThrow(
        'End Date Time must be after Start Date Time',
      );

      expect(mockClient.tasks.create).not.toHaveBeenCalled();
    });

    it('should throw error when endDateTime equals startDateTime', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ value: 'proj-123' }) // projectId
        .mockReturnValueOnce('2025-01-29T10:00:00+00:00') // startDateTime
        .mockReturnValueOnce('2025-01-29T10:00:00+00:00') // endDateTime (same)
        .mockReturnValueOnce({}); // additionalFields

      await expect(taskOps.createTask.call(mockContext, mockApiClient, 0)).rejects.toThrow(
        'End Date Time must be after Start Date Time',
      );

      expect(mockClient.tasks.create).not.toHaveBeenCalled();
    });

    it('should create task with string projectId (non-object format)', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('proj-456') // projectId as string
        .mockReturnValueOnce('2025-01-29T10:00:00+00:00') // startDateTime
        .mockReturnValueOnce('2025-01-29T12:00:00+00:00') // endDateTime
        .mockReturnValueOnce({}); // additionalFields

      mockClient.tasks.create.mockResolvedValue(mockTask);

      await taskOps.createTask.call(mockContext, mockApiClient, 0);

      expect(mockClient.tasks.create).toHaveBeenCalledWith({
        projectId: 'proj-456',
        startDateTime: '2025-01-29T10:00:00+00:00',
        endDateTime: '2025-01-29T12:00:00+00:00',
        description: undefined,
        billable: undefined,
      });
    });
  });

  describe('getTask', () => {
    it('should retrieve a task by ID', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('task-123');

      mockClient.tasks.get.mockResolvedValue(mockTask);

      const result = await taskOps.getTask.call(mockContext, mockApiClient, 0);

      expect(mockClient.tasks.get).toHaveBeenCalledWith('task-123');

      expect(result).toEqual({
        id: 'task-123',
        projectId: 'proj-123',
        projectTitle: 'Test Project',
        description: 'Test task',
        startDateTime: '2025-01-29T10:00:00+00:00',
        endDateTime: '2025-01-29T12:00:00+00:00',
        duration: 7200,
        hours: 2,
        minutes: 0,
        billable: true,
        paid: false,
        billed: false,
        tags: mockTask.tags,
      });
    });

    it('should handle task without tags', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('task-123');

      const taskWithoutTags = { ...mockTask, tags: undefined };
      mockClient.tasks.get.mockResolvedValue(taskWithoutTags);

      const result = await taskOps.getTask.call(mockContext, mockApiClient, 0);

      expect(result.tags).toBeUndefined();
    });
  });

  describe('updateTask', () => {
    it('should update task fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('task-123') // taskId
        .mockReturnValueOnce({
          description: 'Updated description',
          billable: false,
          billed: true,
        });

      const updatedTask = {
        ...mockTask,
        description: 'Updated description',
        billable: false,
        billed: true,
      };
      mockClient.tasks.update.mockResolvedValue(updatedTask);

      const result = await taskOps.updateTask.call(mockContext, mockApiClient, 0);

      expect(mockClient.tasks.update).toHaveBeenCalledWith('task-123', {
        startDateTime: undefined,
        endDateTime: undefined,
        description: 'Updated description',
        billable: false,
        billed: true,
        paid: undefined,
      });

      expect(result.description).toBe('Updated description');
      expect(result.billable).toBe(false);
    });

    it('should handle partial updates', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('task-123')
        .mockReturnValueOnce({ paid: true });

      mockClient.tasks.update.mockResolvedValue({ ...mockTask, paid: true });

      await taskOps.updateTask.call(mockContext, mockApiClient, 0);

      expect(mockClient.tasks.update).toHaveBeenCalledWith('task-123', {
        startDateTime: undefined,
        endDateTime: undefined,
        description: undefined,
        billable: undefined,
        billed: undefined,
        paid: true,
      });
    });

    it('should throw error when updating with endDateTime before startDateTime', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('task-123') // taskId
        .mockReturnValueOnce({
          startDateTime: '2025-01-29T14:00:00+00:00', // later
          endDateTime: '2025-01-29T10:00:00+00:00', // earlier
        });

      await expect(taskOps.updateTask.call(mockContext, mockApiClient, 0)).rejects.toThrow(
        'End Date Time must be after Start Date Time',
      );

      expect(mockClient.tasks.update).not.toHaveBeenCalled();
    });

    it('should update date times when endDateTime is after startDateTime', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('task-123') // taskId
        .mockReturnValueOnce({
          startDateTime: '2025-01-29T10:00:00+00:00',
          endDateTime: '2025-01-29T14:00:00+00:00',
        });

      mockClient.tasks.update.mockResolvedValue({
        ...mockTask,
        startDateTime: '2025-01-29T10:00:00+00:00',
        endDateTime: '2025-01-29T14:00:00+00:00',
      });

      const result = await taskOps.updateTask.call(mockContext, mockApiClient, 0);

      expect(mockClient.tasks.update).toHaveBeenCalledWith('task-123', {
        startDateTime: '2025-01-29T10:00:00+00:00',
        endDateTime: '2025-01-29T14:00:00+00:00',
        description: undefined,
        billable: undefined,
        billed: undefined,
        paid: undefined,
      });

      expect(result).toBeDefined();
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('task-123');

      mockClient.tasks.delete.mockResolvedValue(undefined);

      const result = await taskOps.deleteTask.call(mockContext, mockApiClient, 0);

      expect(mockClient.tasks.delete).toHaveBeenCalledWith('task-123');

      expect(result).toEqual({
        success: true,
        id: 'task-123',
      });
    });
  });

  describe('getManyTasks', () => {
    it('should return limited tasks', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({}) // filters
        .mockReturnValueOnce(10); // limit

      const page = createMockPage(mockTasks);
      mockClient.tasks.search.mockResolvedValue(page);

      const result = await taskOps.getManyTasks.call(mockContext, mockApiClient, 0);

      expect(mockClient.tasks.search).toHaveBeenCalledWith({
        projectId: undefined,
        startDate: undefined,
        endDate: undefined,
        running: undefined,
        sort: undefined,
        order: undefined,
        populateTags: true,
        limit: 10,
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('task-123');
      expect(result[1].id).toBe('task-456');
    });

    it('should return all tasks with pagination', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(true) // returnAll
        .mockReturnValueOnce({}); // filters

      const page1 = createMockPage([mockTasks[0]], 3);
      const page2 = createMockPage([mockTasks[1]], 3);
      const page3 = createMockPage([{ ...mockTask, id: 'task-789' }], 3);

      page1.hasNextPage = true;
      page2.hasNextPage = true;
      page3.hasNextPage = false;

      mockClient.tasks.search.mockResolvedValueOnce(page1);
      page1.nextPage.mockResolvedValueOnce(page2);
      page2.nextPage.mockResolvedValueOnce(page3);

      const result = await taskOps.getManyTasks.call(mockContext, mockApiClient, 0);

      expect(mockClient.tasks.search).toHaveBeenCalledTimes(1);
      expect(page1.nextPage).toHaveBeenCalledTimes(1);
      expect(page2.nextPage).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(3);
    });

    it('should apply filters including project ID from resource locator', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({
          projectId: { value: 'proj-123' }, // resource locator format
          startDate: '2025-01-29',
          endDate: '2025-01-30',
          running: false,
          sort: 'dateTime',
          order: 'desc',
        })
        .mockReturnValueOnce(20);

      const page = createMockPage([mockTask]);
      mockClient.tasks.search.mockResolvedValue(page);

      await taskOps.getManyTasks.call(mockContext, mockApiClient, 0);

      expect(mockClient.tasks.search).toHaveBeenCalledWith({
        projectId: 'proj-123',
        startDate: expect.stringMatching(/^2025-01-29T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/),
        endDate: expect.stringMatching(/^2025-01-30T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/),
        running: false,
        sort: 'dateTime',
        order: 'desc',
        populateTags: true,
        limit: 20,
      });
    });

    it('should include tags in response', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false)
        .mockReturnValueOnce({})
        .mockReturnValueOnce(10);

      const page = createMockPage([mockTask]);
      mockClient.tasks.search.mockResolvedValue(page);

      const result = await taskOps.getManyTasks.call(mockContext, mockApiClient, 0);

      expect(result[0].tags).toEqual([
        { id: 'tag-1', name: 'Development', color: 100 },
        { id: 'tag-2', name: 'Testing', color: 200 },
      ]);
    });

    it('should handle empty results', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false)
        .mockReturnValueOnce({})
        .mockReturnValueOnce(10);

      const page = createMockPage([]);
      mockClient.tasks.search.mockResolvedValue(page);

      const result = await taskOps.getManyTasks.call(mockContext, mockApiClient, 0);

      expect(result).toHaveLength(0);
    });
  });
});
