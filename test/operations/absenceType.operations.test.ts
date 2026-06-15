/**
 * Tests for absence type operations
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as absenceTypeOps from '../../nodes/Timesheet/operations/absenceType.operations';
import { createMockExecuteFunctions, createMockPage } from '../helpers/mocks';

const mockAbsenceType = {
  id: 'at-1',
  organizationId: 'org-1',
  code: 'VAC',
  name: 'Vacation',
  description: 'Paid time off',
  color: 5,
  paid: true,
  requiresApproval: true,
  requiresDocumentation: false,
  deductsFromQuota: true,
  affectsOvertime: false,
  active: true,
  created: 1706533200000,
  lastUpdate: 1706533200000,
};

const mockAbsenceTypes = [
  mockAbsenceType,
  { ...mockAbsenceType, id: 'at-2', code: 'SICK', name: 'Sick' },
];

describe('AbsenceType Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = {
      absenceTypes: {
        create: vi.fn(),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        list: vi.fn(),
      },
    };
    mockApiClient = { getClient: () => mockClient };
  });

  describe('createAbsenceType', () => {
    it('should create an absence type with required fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' }) // organizationId
        .mockReturnValueOnce('VAC') // code
        .mockReturnValueOnce('Vacation') // name
        .mockReturnValueOnce({}); // additionalFields

      mockClient.absenceTypes.create.mockResolvedValue(mockAbsenceType);

      const result = await absenceTypeOps.createAbsenceType.call(mockContext, mockApiClient, 0);

      expect(mockClient.absenceTypes.create).toHaveBeenCalledWith('org-1', {
        code: 'VAC',
        name: 'Vacation',
        description: undefined,
        color: undefined,
        paid: undefined,
        requiresApproval: undefined,
        requiresDocumentation: undefined,
        deductsFromQuota: undefined,
        affectsOvertime: undefined,
      });
      expect(result.id).toBe('at-1');
      expect(result.organizationId).toBe('org-1');
    });
  });

  describe('getAbsenceType', () => {
    it('should retrieve an absence type', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('at-1');
      mockClient.absenceTypes.get.mockResolvedValue(mockAbsenceType);

      const result = await absenceTypeOps.getAbsenceType.call(mockContext, mockApiClient, 0);

      expect(mockClient.absenceTypes.get).toHaveBeenCalledWith('org-1', 'at-1');
      expect(result.code).toBe('VAC');
    });
  });

  describe('updateAbsenceType', () => {
    it('should update an absence type', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('at-1')
        .mockReturnValueOnce({ name: 'Annual Leave', paid: false });

      mockClient.absenceTypes.update.mockResolvedValue({
        ...mockAbsenceType,
        name: 'Annual Leave',
        paid: false,
      });

      const result = await absenceTypeOps.updateAbsenceType.call(mockContext, mockApiClient, 0);

      expect(mockClient.absenceTypes.update).toHaveBeenCalledWith(
        'org-1',
        'at-1',
        expect.objectContaining({ name: 'Annual Leave', paid: false }),
      );
      expect(result.name).toBe('Annual Leave');
    });
  });

  describe('deleteAbsenceType', () => {
    it('should delete an absence type', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('at-1');
      mockClient.absenceTypes.delete.mockResolvedValue(undefined);

      const result = await absenceTypeOps.deleteAbsenceType.call(mockContext, mockApiClient, 0);

      expect(mockClient.absenceTypes.delete).toHaveBeenCalledWith('org-1', 'at-1');
      expect(result).toEqual({ success: true, id: 'at-1' });
    });
  });

  describe('getManyAbsenceTypes', () => {
    it('should return limited absence types', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' }) // organizationId
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce(10); // limit

      mockClient.absenceTypes.list.mockResolvedValue(createMockPage(mockAbsenceTypes));

      const result = await absenceTypeOps.getManyAbsenceTypes.call(mockContext, mockApiClient, 0);

      expect(mockClient.absenceTypes.list).toHaveBeenCalledWith('org-1', { limit: 10 });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('at-1');
    });
  });
});
