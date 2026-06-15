/**
 * Tests for expense operations
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as expenseOps from '../../nodes/Timesheet/operations/expense.operations';
import { createMockExecuteFunctions, createMockPage } from '../helpers/mocks';

const mockExpense = {
  id: 'expense-1',
  description: 'Taxi',
  dateTime: '2025-01-29T10:00:00+00:00',
  amount: '12.50',
  refunded: false,
  fileName: undefined,
  task: { id: 'task-123' },
  created: 1706533200000,
  lastUpdate: 1706533200000,
};

const mockExpenses = [mockExpense, { ...mockExpense, id: 'expense-2', description: 'Lunch' }];

describe('Expense Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = {
      expenses: {
        create: vi.fn(),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        search: vi.fn(),
      },
    };
    mockApiClient = { getClient: () => mockClient };
  });

  describe('createExpense', () => {
    it('should create an expense with required fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('task-123') // taskId
        .mockReturnValueOnce('2025-01-29T10:00:00+00:00') // dateTime
        .mockReturnValueOnce({}); // additionalFields

      mockClient.expenses.create.mockResolvedValue(mockExpense);

      const result = await expenseOps.createExpense.call(mockContext, mockApiClient, 0);

      expect(mockClient.expenses.create).toHaveBeenCalledWith({
        taskId: 'task-123',
        dateTime: '2025-01-29T10:00:00+00:00',
        description: undefined,
        amount: undefined,
        refunded: undefined,
      });

      expect(result).toEqual({
        id: 'expense-1',
        taskId: 'task-123',
        description: 'Taxi',
        dateTime: '2025-01-29T10:00:00+00:00',
        amount: '12.50',
        refunded: false,
        fileName: undefined,
        created: 1706533200000,
        lastUpdate: 1706533200000,
      });
    });

    it('should create an expense with additional fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('task-123')
        .mockReturnValueOnce('2025-01-29T10:00:00+00:00')
        .mockReturnValueOnce({ amount: '20.00', description: 'Hotel', refunded: true });

      mockClient.expenses.create.mockResolvedValue({
        ...mockExpense,
        amount: '20.00',
        description: 'Hotel',
        refunded: true,
      });

      const result = await expenseOps.createExpense.call(mockContext, mockApiClient, 0);

      expect(mockClient.expenses.create).toHaveBeenCalledWith({
        taskId: 'task-123',
        dateTime: '2025-01-29T10:00:00+00:00',
        description: 'Hotel',
        amount: '20.00',
        refunded: true,
      });
      expect(result.amount).toBe('20.00');
      expect(result.description).toBe('Hotel');
    });
  });

  describe('getExpense', () => {
    it('should retrieve an expense by ID', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('expense-1');
      mockClient.expenses.get.mockResolvedValue(mockExpense);

      const result = await expenseOps.getExpense.call(mockContext, mockApiClient, 0);

      expect(mockClient.expenses.get).toHaveBeenCalledWith('expense-1');
      expect(result.id).toBe('expense-1');
      expect(result.taskId).toBe('task-123');
    });
  });

  describe('updateExpense', () => {
    it('should update expense fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('expense-1')
        .mockReturnValueOnce({ amount: '30.00', refunded: true });

      mockClient.expenses.update.mockResolvedValue({
        ...mockExpense,
        amount: '30.00',
        refunded: true,
      });

      const result = await expenseOps.updateExpense.call(mockContext, mockApiClient, 0);

      expect(mockClient.expenses.update).toHaveBeenCalledWith('expense-1', {
        description: undefined,
        dateTime: undefined,
        amount: '30.00',
        refunded: true,
      });
      expect(result.amount).toBe('30.00');
    });
  });

  describe('deleteExpense', () => {
    it('should delete an expense', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('expense-1');
      mockClient.expenses.delete.mockResolvedValue(undefined);

      const result = await expenseOps.deleteExpense.call(mockContext, mockApiClient, 0);

      expect(mockClient.expenses.delete).toHaveBeenCalledWith('expense-1');
      expect(result).toEqual({ success: true, id: 'expense-1' });
    });
  });

  describe('getManyExpenses', () => {
    it('should return limited expenses', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({}) // filters
        .mockReturnValueOnce(10); // limit

      mockClient.expenses.search.mockResolvedValue(createMockPage(mockExpenses));

      const result = await expenseOps.getManyExpenses.call(mockContext, mockApiClient, 0);

      expect(mockClient.expenses.search).toHaveBeenCalledWith({
        taskId: undefined,
        startDate: undefined,
        endDate: undefined,
        limit: 10,
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('expense-1');
    });

    it('should return all expenses with pagination', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(true) // returnAll
        .mockReturnValueOnce({}); // filters

      const page1 = createMockPage([mockExpenses[0]], 2);
      const page2 = createMockPage([mockExpenses[1]], 2);
      page1.hasNextPage = true;
      page2.hasNextPage = false;

      mockClient.expenses.search.mockResolvedValueOnce(page1);
      page1.nextPage.mockResolvedValueOnce(page2);

      const result = await expenseOps.getManyExpenses.call(mockContext, mockApiClient, 0);

      expect(result).toHaveLength(2);
    });
  });
});
