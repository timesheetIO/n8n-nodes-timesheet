/**
 * Tests for timer operations
 */
import { describe, it, expect, beforeEach } from 'vitest';
import * as timerOps from '../../nodes/Timesheet/operations/timer.operations';
import {
  createMockExecuteFunctions,
  createMockTimesheetClient,
  createMockApiClient,
  mockTimerRunning,
  mockTimerStopped,
} from '../helpers/mocks';

describe('Timer Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = createMockTimesheetClient();
    mockApiClient = createMockApiClient(mockClient);
  });

  describe('startTimer', () => {
    it('should start a timer with project ID', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ value: 'proj-123' }) // projectId
        .mockReturnValueOnce(''); // startDateTime

      mockClient.timer.start.mockResolvedValue(mockTimerRunning);

      const result = await timerOps.startTimer.call(mockContext, mockApiClient, 0);

      expect(mockClient.timer.start).toHaveBeenCalledWith({
        projectId: 'proj-123',
        startDateTime: undefined,
      });

      expect(result).toEqual({
        status: 'running',
        projectId: 'proj-123',
        projectTitle: 'Test Project',
        duration: 3600,
        startDateTime: '2025-01-29T10:00:00+00:00',
      });
    });

    it('should start a timer with custom start time', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ value: 'proj-123' }) // projectId
        .mockReturnValueOnce('2025-01-29T09:00:00+00:00'); // startDateTime

      mockClient.timer.start.mockResolvedValue(mockTimerRunning);

      await timerOps.startTimer.call(mockContext, mockApiClient, 0);

      expect(mockClient.timer.start).toHaveBeenCalledWith({
        projectId: 'proj-123',
        startDateTime: '2025-01-29T09:00:00+00:00',
      });
    });

    it('should start a timer with string projectId (non-object format)', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('proj-456') // projectId as plain string
        .mockReturnValueOnce(''); // startDateTime

      mockClient.timer.start.mockResolvedValue(mockTimerRunning);

      await timerOps.startTimer.call(mockContext, mockApiClient, 0);

      expect(mockClient.timer.start).toHaveBeenCalledWith({
        projectId: 'proj-456',
        startDateTime: undefined,
      });
    });

    it('should handle null task in timer response', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ value: 'proj-123' })
        .mockReturnValueOnce('');

      mockClient.timer.start.mockResolvedValue({ status: 'running', task: null });

      const result = await timerOps.startTimer.call(mockContext, mockApiClient, 0);

      expect(result.status).toBe('running');
      expect(result.duration).toBe(0);
      expect(result.projectId).toBeUndefined();
      expect(result.projectTitle).toBeUndefined();
    });
  });

  describe('stopTimer', () => {
    it('should stop the running timer', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce(''); // endDateTime

      mockClient.timer.stop.mockResolvedValue(mockTimerStopped);

      const result = await timerOps.stopTimer.call(mockContext, mockApiClient, 0);

      expect(mockClient.timer.stop).toHaveBeenCalledWith(undefined);

      expect(result).toEqual({
        status: 'stopped',
        duration: 7200,
        projectTitle: 'Test Project',
      });
    });

    it('should stop timer with custom end time', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('2025-01-29T12:30:00+00:00');

      mockClient.timer.stop.mockResolvedValue(mockTimerStopped);

      await timerOps.stopTimer.call(mockContext, mockApiClient, 0);

      expect(mockClient.timer.stop).toHaveBeenCalledWith({
        endDateTime: '2025-01-29T12:30:00+00:00',
      });
    });
  });

  describe('pauseTimer', () => {
    it('should pause the running timer', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce(''); // startDateTime

      const pausedTimer = { ...mockTimerRunning, status: 'paused' };
      mockClient.timer.pause.mockResolvedValue(pausedTimer);

      const result = await timerOps.pauseTimer.call(mockContext, mockApiClient, 0);

      expect(mockClient.timer.pause).toHaveBeenCalledWith(undefined);

      expect(result).toEqual({
        status: 'paused',
        projectTitle: 'Test Project',
        duration: 3600,
      });
    });

    it('should pause timer with custom start time', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('2025-01-29T11:00:00+00:00');

      const pausedTimer = { ...mockTimerRunning, status: 'paused' };
      mockClient.timer.pause.mockResolvedValue(pausedTimer);

      await timerOps.pauseTimer.call(mockContext, mockApiClient, 0);

      expect(mockClient.timer.pause).toHaveBeenCalledWith({
        startDateTime: '2025-01-29T11:00:00+00:00',
      });
    });
  });

  describe('resumeTimer', () => {
    it('should resume the paused timer', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce(''); // endDateTime

      mockClient.timer.resume.mockResolvedValue(mockTimerRunning);

      const result = await timerOps.resumeTimer.call(mockContext, mockApiClient, 0);

      expect(mockClient.timer.resume).toHaveBeenCalledWith(undefined);

      expect(result).toEqual({
        status: 'running',
        projectTitle: 'Test Project',
        duration: 3600,
      });
    });
  });

  describe('getTimerStatus', () => {
    it('should return current timer status', async () => {
      mockClient.timer.get.mockResolvedValue(mockTimerRunning);

      const result = await timerOps.getTimerStatus.call(mockContext, mockApiClient, 0);

      expect(mockClient.timer.get).toHaveBeenCalled();

      expect(result).toEqual({
        status: 'running',
        projectId: 'proj-123',
        projectTitle: 'Test Project',
        duration: 3600,
        startDateTime: '2025-01-29T10:00:00+00:00',
      });
    });

    it('should handle stopped timer status', async () => {
      mockClient.timer.get.mockResolvedValue({ status: 'stopped', task: null });

      const result = await timerOps.getTimerStatus.call(mockContext, mockApiClient, 0);

      expect(result.status).toBe('stopped');
      expect(result.duration).toBe(0);
    });
  });

  describe('updateTimer', () => {
    it('should update timer task details', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce({
        description: 'Updated description',
        tags: ['tag-1', 'tag-2'],
        billable: true,
        location: 'Office',
        feeling: 4,
      });

      const updatedTimer = {
        ...mockTimerRunning,
        task: {
          ...mockTimerRunning.task,
          description: 'Updated description',
        },
      };
      mockClient.timer.update.mockResolvedValue(updatedTimer);

      const result = await timerOps.updateTimer.call(mockContext, mockApiClient, 0);

      expect(mockClient.timer.update).toHaveBeenCalledWith({
        description: 'Updated description',
        tags: ['tag-1', 'tag-2'],
        billable: true,
        location: 'Office',
        locationEnd: undefined,
        feeling: 4,
      });

      expect(result.status).toBe('running');
      expect(result.projectTitle).toBe('Test Project');
    });

    it('should handle partial updates', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce({
        description: 'New description',
      });

      mockClient.timer.update.mockResolvedValue(mockTimerRunning);

      await timerOps.updateTimer.call(mockContext, mockApiClient, 0);

      expect(mockClient.timer.update).toHaveBeenCalledWith({
        description: 'New description',
        tags: undefined,
        billable: undefined,
        location: undefined,
        locationEnd: undefined,
        feeling: undefined,
      });
    });
  });
});
