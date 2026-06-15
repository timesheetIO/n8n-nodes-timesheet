/**
 * Tests for todo operations
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as todoOps from '../../nodes/Timesheet/operations/todo.operations';
import { createMockExecuteFunctions, createMockPage } from '../helpers/mocks';

const mockTodo = {
  id: 'todo-1',
  name: 'Write tests',
  description: 'Cover todo operations',
  status: 0,
  dueDate: '2025-01-29T10:00:00+00:00',
  progress: 0,
  project: { id: 'proj-123' },
  created: 1706533200000,
  lastUpdate: 1706533200000,
};

const mockTodos = [mockTodo, { ...mockTodo, id: 'todo-2', name: 'Ship it' }];

describe('Todo Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = {
      todos: {
        create: vi.fn(),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        search: vi.fn(),
      },
    };
    mockApiClient = { getClient: () => mockClient };
  });

  describe('createTodo', () => {
    it('should create a todo with required fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('proj-123') // projectId
        .mockReturnValueOnce('Write tests') // name
        .mockReturnValueOnce({}); // additionalFields

      mockClient.todos.create.mockResolvedValue(mockTodo);

      const result = await todoOps.createTodo.call(mockContext, mockApiClient, 0);

      expect(mockClient.todos.create).toHaveBeenCalledWith({
        name: 'Write tests',
        projectId: 'proj-123',
        description: undefined,
        dueDate: undefined,
        assignedUsers: undefined,
        estimatedHours: undefined,
        estimatedMinutes: undefined,
      });

      expect(result).toEqual({
        id: 'todo-1',
        name: 'Write tests',
        description: 'Cover todo operations',
        projectId: 'proj-123',
        status: 0,
        dueDate: '2025-01-29T10:00:00+00:00',
        progress: 0,
        created: 1706533200000,
        lastUpdate: 1706533200000,
      });
    });

    it('should create a todo with additional fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('proj-123')
        .mockReturnValueOnce('Plan sprint')
        .mockReturnValueOnce({
          description: 'Details',
          dueDate: '2025-01-29T10:00:00+00:00',
          assignedUsers: 'user-1,user-2',
          estimatedHours: 2,
          estimatedMinutes: 30,
        });

      mockClient.todos.create.mockResolvedValue({
        ...mockTodo,
        name: 'Plan sprint',
        description: 'Details',
      });

      const result = await todoOps.createTodo.call(mockContext, mockApiClient, 0);

      expect(mockClient.todos.create).toHaveBeenCalledWith({
        name: 'Plan sprint',
        projectId: 'proj-123',
        description: 'Details',
        dueDate: '2025-01-29T10:00:00+00:00',
        assignedUsers: 'user-1,user-2',
        estimatedHours: 2,
        estimatedMinutes: 30,
      });
      expect(result.name).toBe('Plan sprint');
      expect(result.description).toBe('Details');
    });
  });

  describe('getTodo', () => {
    it('should retrieve a todo by ID', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('todo-1');
      mockClient.todos.get.mockResolvedValue(mockTodo);

      const result = await todoOps.getTodo.call(mockContext, mockApiClient, 0);

      expect(mockClient.todos.get).toHaveBeenCalledWith('todo-1');
      expect(result.id).toBe('todo-1');
      expect(result.projectId).toBe('proj-123');
    });
  });

  describe('updateTodo', () => {
    it('should update todo fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('todo-1')
        .mockReturnValueOnce({ name: 'Updated', status: 1 });

      mockClient.todos.update.mockResolvedValue({
        ...mockTodo,
        name: 'Updated',
        status: 1,
      });

      const result = await todoOps.updateTodo.call(mockContext, mockApiClient, 0);

      expect(mockClient.todos.update).toHaveBeenCalledWith('todo-1', {
        name: 'Updated',
        description: undefined,
        status: 1,
        dueDate: undefined,
        assignedUsers: undefined,
        estimatedHours: undefined,
        estimatedMinutes: undefined,
        deleted: undefined,
      });
      expect(result.name).toBe('Updated');
      expect(result.status).toBe(1);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('todo-1');
      mockClient.todos.delete.mockResolvedValue(undefined);

      const result = await todoOps.deleteTodo.call(mockContext, mockApiClient, 0);

      expect(mockClient.todos.delete).toHaveBeenCalledWith('todo-1');
      expect(result).toEqual({ success: true, id: 'todo-1' });
    });
  });

  describe('getManyTodos', () => {
    it('should return limited todos', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({ projectId: 'proj-123', status: 'open' }) // filters
        .mockReturnValueOnce(10); // limit

      mockClient.todos.search.mockResolvedValue(createMockPage(mockTodos));

      const result = await todoOps.getManyTodos.call(mockContext, mockApiClient, 0);

      expect(mockClient.todos.search).toHaveBeenCalledWith({
        projectId: 'proj-123',
        status: 'open',
        limit: 10,
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('todo-1');
    });

    it('should return all todos with pagination', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(true) // returnAll
        .mockReturnValueOnce({}); // filters

      const page1 = createMockPage([mockTodos[0]], 2);
      const page2 = createMockPage([mockTodos[1]], 2);
      page1.hasNextPage = true;
      page2.hasNextPage = false;

      mockClient.todos.search.mockResolvedValueOnce(page1);
      page1.nextPage.mockResolvedValueOnce(page2);

      const result = await todoOps.getManyTodos.call(mockContext, mockApiClient, 0);

      expect(result).toHaveLength(2);
    });
  });
});
