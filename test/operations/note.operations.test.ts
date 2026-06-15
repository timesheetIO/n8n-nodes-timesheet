/**
 * Tests for note operations
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as noteOps from '../../nodes/Timesheet/operations/note.operations';
import { createMockExecuteFunctions, createMockPage } from '../helpers/mocks';

const mockNote = {
  id: 'note-1',
  text: 'Remember to call client',
  dateTime: '2025-01-29T10:00:00+00:00',
  uri: undefined,
  task: { id: 'task-123' },
  created: 1706533200000,
  lastUpdate: 1706533200000,
};

const mockNotes = [mockNote, { ...mockNote, id: 'note-2', text: 'Follow up email' }];

describe('Note Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = {
      notes: {
        create: vi.fn(),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        search: vi.fn(),
      },
    };
    mockApiClient = { getClient: () => mockClient };
  });

  describe('createNote', () => {
    it('should create a note with required fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('task-123') // taskId
        .mockReturnValueOnce('Remember to call client') // text
        .mockReturnValueOnce('2025-01-29T10:00:00+00:00') // dateTime
        .mockReturnValueOnce({}); // additionalFields

      mockClient.notes.create.mockResolvedValue(mockNote);

      const result = await noteOps.createNote.call(mockContext, mockApiClient, 0);

      expect(mockClient.notes.create).toHaveBeenCalledWith({
        taskId: 'task-123',
        text: 'Remember to call client',
        dateTime: '2025-01-29T10:00:00+00:00',
        uri: undefined,
        driveId: undefined,
      });

      expect(result).toEqual({
        id: 'note-1',
        taskId: 'task-123',
        text: 'Remember to call client',
        dateTime: '2025-01-29T10:00:00+00:00',
        uri: undefined,
        created: 1706533200000,
        lastUpdate: 1706533200000,
      });
    });

    it('should create a note with additional fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('task-123')
        .mockReturnValueOnce('Receipt attached')
        .mockReturnValueOnce('2025-01-29T10:00:00+00:00')
        .mockReturnValueOnce({ uri: 'https://example.com/file.pdf', driveId: 'drive-9' });

      mockClient.notes.create.mockResolvedValue({
        ...mockNote,
        text: 'Receipt attached',
        uri: 'https://example.com/file.pdf',
      });

      const result = await noteOps.createNote.call(mockContext, mockApiClient, 0);

      expect(mockClient.notes.create).toHaveBeenCalledWith({
        taskId: 'task-123',
        text: 'Receipt attached',
        dateTime: '2025-01-29T10:00:00+00:00',
        uri: 'https://example.com/file.pdf',
        driveId: 'drive-9',
      });
      expect(result.text).toBe('Receipt attached');
      expect(result.uri).toBe('https://example.com/file.pdf');
    });
  });

  describe('getNote', () => {
    it('should retrieve a note by ID', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('note-1');
      mockClient.notes.get.mockResolvedValue(mockNote);

      const result = await noteOps.getNote.call(mockContext, mockApiClient, 0);

      expect(mockClient.notes.get).toHaveBeenCalledWith('note-1');
      expect(result.id).toBe('note-1');
      expect(result.taskId).toBe('task-123');
    });
  });

  describe('updateNote', () => {
    it('should update note fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('note-1')
        .mockReturnValueOnce({ text: 'Updated text', uri: 'https://example.com/new.pdf' });

      mockClient.notes.update.mockResolvedValue({
        ...mockNote,
        text: 'Updated text',
        uri: 'https://example.com/new.pdf',
      });

      const result = await noteOps.updateNote.call(mockContext, mockApiClient, 0);

      expect(mockClient.notes.update).toHaveBeenCalledWith('note-1', {
        text: 'Updated text',
        dateTime: undefined,
        uri: 'https://example.com/new.pdf',
        driveId: undefined,
      });
      expect(result.text).toBe('Updated text');
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('note-1');
      mockClient.notes.delete.mockResolvedValue(undefined);

      const result = await noteOps.deleteNote.call(mockContext, mockApiClient, 0);

      expect(mockClient.notes.delete).toHaveBeenCalledWith('note-1');
      expect(result).toEqual({ success: true, id: 'note-1' });
    });
  });

  describe('getManyNotes', () => {
    it('should return limited notes', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({}) // filters
        .mockReturnValueOnce(10); // limit

      mockClient.notes.search.mockResolvedValue(createMockPage(mockNotes));

      const result = await noteOps.getManyNotes.call(mockContext, mockApiClient, 0);

      expect(mockClient.notes.search).toHaveBeenCalledWith({
        taskId: undefined,
        startDate: undefined,
        endDate: undefined,
        limit: 10,
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('note-1');
    });

    it('should return all notes with pagination', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(true) // returnAll
        .mockReturnValueOnce({}); // filters

      const page1 = createMockPage([mockNotes[0]], 2);
      const page2 = createMockPage([mockNotes[1]], 2);
      page1.hasNextPage = true;
      page2.hasNextPage = false;

      mockClient.notes.search.mockResolvedValueOnce(page1);
      page1.nextPage.mockResolvedValueOnce(page2);

      const result = await noteOps.getManyNotes.call(mockContext, mockApiClient, 0);

      expect(result).toHaveLength(2);
    });
  });
});
