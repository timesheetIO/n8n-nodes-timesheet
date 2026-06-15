/**
 * Tests for contract operations
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as contractOps from '../../nodes/Timesheet/operations/contract.operations';
import { createMockExecuteFunctions, createMockPage } from '../helpers/mocks';

const mockContract = {
  id: 'contract-1',
  organizationId: 'org-1',
  name: 'Full Time',
  status: 'active',
  validFrom: '2025-01-01T00:00:00+00:00',
  validTo: '2025-12-31T00:00:00+00:00',
  weeklyHours: 40,
  dailyHours: 8,
  salaryAmount: 60000,
  salaryCurrency: 'USD',
  vacationDaysAnnual: 25,
  created: 1706533200000,
  lastUpdate: 1706533200000,
};

const mockContracts = [
  mockContract,
  { ...mockContract, id: 'contract-2', name: 'Part Time', weeklyHours: 20 },
];

describe('Contract Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = {
      contracts: {
        create: vi.fn(),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        list: vi.fn(),
        activate: vi.fn(),
        suspend: vi.fn(),
        reactivate: vi.fn(),
        terminate: vi.fn(),
      },
    };
    mockApiClient = { getClient: () => mockClient };
  });

  describe('createContract', () => {
    it('should create a contract with required fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' }) // organizationId
        .mockReturnValueOnce('Full Time') // name
        .mockReturnValueOnce('user-1') // userId
        .mockReturnValueOnce({}); // additionalFields

      mockClient.contracts.create.mockResolvedValue(mockContract);

      const result = await contractOps.createContract.call(mockContext, mockApiClient, 0);

      expect(mockClient.contracts.create).toHaveBeenCalledWith('org-1', {
        name: 'Full Time',
        userId: 'user-1',
        validFrom: undefined,
        validTo: undefined,
        weeklyHours: undefined,
        dailyHours: undefined,
        workDays: undefined,
        vacationDaysAnnual: undefined,
        salaryType: undefined,
        salaryAmount: undefined,
        salaryCurrency: undefined,
        overtimeEnabled: undefined,
      });
      expect(result.id).toBe('contract-1');
      expect(result.organizationId).toBe('org-1');
    });

    it('should normalize validFrom/validTo when provided', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' }) // organizationId
        .mockReturnValueOnce('Full Time') // name
        .mockReturnValueOnce('user-1') // userId
        .mockReturnValueOnce({
          validFrom: '2025-01-01T00:00:00+00:00',
          weeklyHours: 40,
        }); // additionalFields

      mockClient.contracts.create.mockResolvedValue(mockContract);

      await contractOps.createContract.call(mockContext, mockApiClient, 0);

      expect(mockClient.contracts.create).toHaveBeenCalledWith(
        'org-1',
        expect.objectContaining({
          name: 'Full Time',
          userId: 'user-1',
          validFrom: '2025-01-01T00:00:00+00:00',
          weeklyHours: 40,
        }),
      );
    });
  });

  describe('getContract', () => {
    it('should retrieve a contract', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('contract-1');
      mockClient.contracts.get.mockResolvedValue(mockContract);

      const result = await contractOps.getContract.call(mockContext, mockApiClient, 0);

      expect(mockClient.contracts.get).toHaveBeenCalledWith('org-1', 'contract-1');
      expect(result.name).toBe('Full Time');
    });
  });

  describe('updateContract', () => {
    it('should update a contract', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('contract-1')
        .mockReturnValueOnce({ name: 'Updated', weeklyHours: 35 });

      mockClient.contracts.update.mockResolvedValue({
        ...mockContract,
        name: 'Updated',
        weeklyHours: 35,
      });

      const result = await contractOps.updateContract.call(mockContext, mockApiClient, 0);

      expect(mockClient.contracts.update).toHaveBeenCalledWith(
        'org-1',
        'contract-1',
        expect.objectContaining({ name: 'Updated', weeklyHours: 35 }),
      );
      expect(result.name).toBe('Updated');
    });
  });

  describe('deleteContract', () => {
    it('should delete a contract', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('contract-1');
      mockClient.contracts.delete.mockResolvedValue(undefined);

      const result = await contractOps.deleteContract.call(mockContext, mockApiClient, 0);

      expect(mockClient.contracts.delete).toHaveBeenCalledWith('org-1', 'contract-1');
      expect(result).toEqual({ success: true, id: 'contract-1' });
    });
  });

  describe('getManyContracts', () => {
    it('should return limited contracts with filters', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' }) // organizationId
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({ user: 'user-1', status: 'active' }) // filters
        .mockReturnValueOnce(10); // limit

      mockClient.contracts.list.mockResolvedValue(createMockPage(mockContracts));

      const result = await contractOps.getManyContracts.call(mockContext, mockApiClient, 0);

      expect(mockClient.contracts.list).toHaveBeenCalledWith('org-1', {
        user: 'user-1',
        status: 'active',
        limit: 10,
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('contract-1');
    });
  });

  describe('state transitions', () => {
    it('activate should call SDK with org and contract ID', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('contract-1');
      mockClient.contracts.activate.mockResolvedValue({ ...mockContract, status: 'active' });

      const result = await contractOps.activateContract.call(mockContext, mockApiClient, 0);

      expect(mockClient.contracts.activate).toHaveBeenCalledWith('org-1', 'contract-1');
      expect(result.status).toBe('active');
    });

    it('suspend should call SDK with org and contract ID', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('contract-1');
      mockClient.contracts.suspend.mockResolvedValue({ ...mockContract, status: 'suspended' });

      const result = await contractOps.suspendContract.call(mockContext, mockApiClient, 0);

      expect(mockClient.contracts.suspend).toHaveBeenCalledWith('org-1', 'contract-1');
      expect(result.status).toBe('suspended');
    });

    it('reactivate should call SDK with org and contract ID', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('contract-1');
      mockClient.contracts.reactivate.mockResolvedValue({ ...mockContract, status: 'active' });

      const result = await contractOps.reactivateContract.call(mockContext, mockApiClient, 0);

      expect(mockClient.contracts.reactivate).toHaveBeenCalledWith('org-1', 'contract-1');
      expect(result.status).toBe('active');
    });

    it('terminate should call SDK with org and contract ID', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('contract-1');
      mockClient.contracts.terminate.mockResolvedValue({ ...mockContract, status: 'terminated' });

      const result = await contractOps.terminateContract.call(mockContext, mockApiClient, 0);

      expect(mockClient.contracts.terminate).toHaveBeenCalledWith('org-1', 'contract-1');
      expect(result.status).toBe('terminated');
    });
  });
});
