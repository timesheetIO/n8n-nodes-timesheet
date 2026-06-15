/**
 * Tests for absence operations
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as absenceOps from '../../nodes/Timesheet/operations/absence.operations';
import { createMockExecuteFunctions, createMockPage } from '../helpers/mocks';

const mockAbsence = {
  id: 'abs-1',
  contractId: 'contract-1',
  absenceTypeId: 'at-1',
  startDateTime: '2025-02-01T00:00:00+00:00',
  endDateTime: '2025-02-05T00:00:00+00:00',
  fullDay: true,
  status: 'pending',
  totalDays: '5',
  reason: 'Family vacation',
  created: 1706533200000,
  lastUpdate: 1706533200000,
};

const mockAbsences = [
  mockAbsence,
  { ...mockAbsence, id: 'abs-2', status: 'approved', reason: 'Sick leave' },
];

describe('Absence Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = {
      absences: {
        create: vi.fn(),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        search: vi.fn(),
        approve: vi.fn(),
        reject: vi.fn(),
        cancel: vi.fn(),
      },
    };
    mockApiClient = { getClient: () => mockClient };
  });

  describe('createAbsence', () => {
    it('should create an absence with required fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' }) // organizationId
        .mockReturnValueOnce('contract-1') // contractId
        .mockReturnValueOnce('at-1') // absenceTypeId
        .mockReturnValueOnce('2025-02-01T00:00:00+00:00') // startDateTime
        .mockReturnValueOnce('2025-02-05T00:00:00+00:00') // endDateTime
        .mockReturnValueOnce({}); // additionalFields

      mockClient.absences.create.mockResolvedValue(mockAbsence);

      const result = await absenceOps.createAbsence.call(mockContext, mockApiClient, 0);

      expect(mockClient.absences.create).toHaveBeenCalledWith('org-1', {
        contractId: 'contract-1',
        absenceTypeId: 'at-1',
        startDateTime: '2025-02-01T00:00:00+00:00',
        endDateTime: '2025-02-05T00:00:00+00:00',
        fullDay: undefined,
        reason: undefined,
        documentationUrl: undefined,
      });
      expect(result.id).toBe('abs-1');
      expect(result.contractId).toBe('contract-1');
    });

    it('should include additional fields when provided', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('contract-1')
        .mockReturnValueOnce('at-1')
        .mockReturnValueOnce('2025-02-01T00:00:00+00:00')
        .mockReturnValueOnce('2025-02-05T00:00:00+00:00')
        .mockReturnValueOnce({ fullDay: true, reason: 'Vacation', documentationUrl: 'https://x.test/doc' });

      mockClient.absences.create.mockResolvedValue(mockAbsence);

      await absenceOps.createAbsence.call(mockContext, mockApiClient, 0);

      expect(mockClient.absences.create).toHaveBeenCalledWith(
        'org-1',
        expect.objectContaining({
          fullDay: true,
          reason: 'Vacation',
          documentationUrl: 'https://x.test/doc',
        }),
      );
    });
  });

  describe('getAbsence', () => {
    it('should retrieve an absence', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('abs-1');
      mockClient.absences.get.mockResolvedValue(mockAbsence);

      const result = await absenceOps.getAbsence.call(mockContext, mockApiClient, 0);

      expect(mockClient.absences.get).toHaveBeenCalledWith('org-1', 'abs-1');
      expect(result.status).toBe('pending');
    });
  });

  describe('updateAbsence', () => {
    it('should update an absence', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('abs-1')
        .mockReturnValueOnce({ reason: 'Updated reason', fullDay: false });

      mockClient.absences.update.mockResolvedValue({
        ...mockAbsence,
        reason: 'Updated reason',
        fullDay: false,
      });

      const result = await absenceOps.updateAbsence.call(mockContext, mockApiClient, 0);

      expect(mockClient.absences.update).toHaveBeenCalledWith(
        'org-1',
        'abs-1',
        expect.objectContaining({ reason: 'Updated reason', fullDay: false }),
      );
      expect(result.reason).toBe('Updated reason');
    });

    it('should normalize dateTimes only when provided', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('abs-1')
        .mockReturnValueOnce({ startDateTime: '2025-03-01T00:00:00+00:00' });

      mockClient.absences.update.mockResolvedValue(mockAbsence);

      await absenceOps.updateAbsence.call(mockContext, mockApiClient, 0);

      expect(mockClient.absences.update).toHaveBeenCalledWith(
        'org-1',
        'abs-1',
        expect.objectContaining({
          startDateTime: '2025-03-01T00:00:00+00:00',
          endDateTime: undefined,
        }),
      );
    });
  });

  describe('deleteAbsence', () => {
    it('should delete an absence', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('abs-1');
      mockClient.absences.delete.mockResolvedValue(undefined);

      const result = await absenceOps.deleteAbsence.call(mockContext, mockApiClient, 0);

      expect(mockClient.absences.delete).toHaveBeenCalledWith('org-1', 'abs-1');
      expect(result).toEqual({ success: true, id: 'abs-1' });
    });
  });

  describe('getManyAbsences', () => {
    it('should return limited absences', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' }) // organizationId
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({}) // filters
        .mockReturnValueOnce(10); // limit

      mockClient.absences.search.mockResolvedValue(createMockPage(mockAbsences));

      const result = await absenceOps.getManyAbsences.call(mockContext, mockApiClient, 0);

      expect(mockClient.absences.search).toHaveBeenCalledWith('org-1', {
        contractId: undefined,
        absenceTypeId: undefined,
        status: undefined,
        startDate: undefined,
        endDate: undefined,
        limit: 10,
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('abs-1');
    });

    it('should pass filters through to search', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce(false)
        .mockReturnValueOnce({ contractId: 'contract-1', status: 'approved' })
        .mockReturnValueOnce(50);

      mockClient.absences.search.mockResolvedValue(createMockPage(mockAbsences));

      await absenceOps.getManyAbsences.call(mockContext, mockApiClient, 0);

      expect(mockClient.absences.search).toHaveBeenCalledWith(
        'org-1',
        expect.objectContaining({ contractId: 'contract-1', status: 'approved' }),
      );
    });
  });

  describe('approveAbsence', () => {
    it('should approve an absence with only org and id', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('abs-1');
      mockClient.absences.approve.mockResolvedValue({ ...mockAbsence, status: 'approved' });

      const result = await absenceOps.approveAbsence.call(mockContext, mockApiClient, 0);

      expect(mockClient.absences.approve).toHaveBeenCalledWith('org-1', 'abs-1');
      expect(mockClient.absences.approve).toHaveBeenCalledTimes(1);
      expect(result.status).toBe('approved');
    });
  });

  describe('rejectAbsence', () => {
    it('should reject an absence with a reason', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('abs-1')
        .mockReturnValueOnce('Not enough coverage');
      mockClient.absences.reject.mockResolvedValue({ ...mockAbsence, status: 'rejected' });

      const result = await absenceOps.rejectAbsence.call(mockContext, mockApiClient, 0);

      expect(mockClient.absences.reject).toHaveBeenCalledWith('org-1', 'abs-1', {
        reason: 'Not enough coverage',
      });
      expect(result.status).toBe('rejected');
    });
  });

  describe('cancelAbsence', () => {
    it('should cancel an absence with a reason', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce('abs-1')
        .mockReturnValueOnce('Plans changed');
      mockClient.absences.cancel.mockResolvedValue({ ...mockAbsence, status: 'cancelled' });

      const result = await absenceOps.cancelAbsence.call(mockContext, mockApiClient, 0);

      expect(mockClient.absences.cancel).toHaveBeenCalledWith('org-1', 'abs-1', {
        reason: 'Plans changed',
      });
      expect(result.status).toBe('cancelled');
    });
  });
});
