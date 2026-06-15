/**
 * Tests for rate operations
 */
import { describe, it, expect, beforeEach } from 'vitest';
import * as rateOps from '../../nodes/Timesheet/operations/rate.operations';
import {
  createMockExecuteFunctions,
  createMockTimesheetClient,
  createMockApiClient,
  mockRate,
  mockRates,
  createMockPage,
} from '../helpers/mocks';

describe('Rate Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = createMockTimesheetClient();
    mockApiClient = createMockApiClient(mockClient);
  });

  describe('createRate', () => {
    it('should create a rate with required fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('Standard Rate') // title
        .mockReturnValueOnce(1.0) // factor
        .mockReturnValueOnce({}); // additionalFields

      mockClient.rates.create.mockResolvedValue(mockRate);

      const result = await rateOps.createRate.call(mockContext, mockApiClient, 0);

      expect(mockClient.rates.create).toHaveBeenCalledWith({
        title: 'Standard Rate',
        factor: '1',
        extra: undefined,
        enabled: undefined,
        archived: undefined,
        teamId: undefined,
      });

      expect(result).toEqual({
        id: 'rate-1',
        title: 'Standard Rate',
        factor: 1.0,
        extra: 0,
        enabled: true,
        archived: false,
        teamId: 'team-123',
        created: 1706533200000,
        lastUpdate: 1706533200000,
      });
    });

    it('should create a rate with all fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('Overtime Rate')
        .mockReturnValueOnce(1.5)
        .mockReturnValueOnce({
          extra: 10,
          enabled: true,
          archived: false,
          teamId: 'team-456',
        });

      const customRate = {
        ...mockRate,
        title: 'Overtime Rate',
        factor: 1.5,
        extra: 10,
        team: {
          id: 'team-456',
          name: 'Custom Team',
        },
      };
      mockClient.rates.create.mockResolvedValue(customRate);

      const result = await rateOps.createRate.call(mockContext, mockApiClient, 0);

      expect(mockClient.rates.create).toHaveBeenCalledWith({
        title: 'Overtime Rate',
        factor: '1.5',
        extra: '10',
        enabled: true,
        archived: false,
        teamId: 'team-456',
      });

      expect(result.title).toBe('Overtime Rate');
      expect(result.factor).toBe(1.5);
      expect(result.extra).toBe(10);
      expect(result.teamId).toBe('team-456');
    });
  });

  describe('getRate', () => {
    it('should retrieve a rate by ID', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('rate-1');

      mockClient.rates.get.mockResolvedValue(mockRate);

      const result = await rateOps.getRate.call(mockContext, mockApiClient, 0);

      expect(mockClient.rates.get).toHaveBeenCalledWith('rate-1');

      expect(result).toEqual({
        id: 'rate-1',
        title: 'Standard Rate',
        factor: 1.0,
        extra: 0,
        enabled: true,
        archived: false,
        teamId: 'team-123',
        created: 1706533200000,
        lastUpdate: 1706533200000,
      });
    });
  });

  describe('updateRate', () => {
    it('should update rate fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('rate-1') // rateId
        .mockReturnValueOnce({
          title: 'Updated Rate',
          factor: 2.0,
          extra: 15,
          enabled: false,
          archived: true,
        });

      const updatedRate = {
        ...mockRate,
        title: 'Updated Rate',
        factor: 2.0,
        extra: 15,
        enabled: false,
        archived: true,
      };
      mockClient.rates.update.mockResolvedValue(updatedRate);

      const result = await rateOps.updateRate.call(mockContext, mockApiClient, 0);

      expect(mockClient.rates.update).toHaveBeenCalledWith('rate-1', {
        title: 'Updated Rate',
        factor: '2',
        extra: '15',
        enabled: false,
        archived: true,
        deleted: undefined,
      });

      expect(result.title).toBe('Updated Rate');
      expect(result.factor).toBe(2.0);
      expect(result.extra).toBe(15);
      expect(result.enabled).toBe(false);
      expect(result.archived).toBe(true);
    });

    it('should handle partial updates', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('rate-1')
        .mockReturnValueOnce({ title: 'New Title Only' });

      mockClient.rates.update.mockResolvedValue({
        ...mockRate,
        title: 'New Title Only',
      });

      await rateOps.updateRate.call(mockContext, mockApiClient, 0);

      expect(mockClient.rates.update).toHaveBeenCalledWith('rate-1', {
        title: 'New Title Only',
        factor: undefined,
        extra: undefined,
        enabled: undefined,
        archived: undefined,
        deleted: undefined,
      });
    });
  });

  describe('deleteRate', () => {
    it('should delete a rate', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('rate-1');

      mockClient.rates.delete.mockResolvedValue(undefined);

      const result = await rateOps.deleteRate.call(mockContext, mockApiClient, 0);

      expect(mockClient.rates.delete).toHaveBeenCalledWith('rate-1');

      expect(result).toEqual({
        success: true,
        id: 'rate-1',
      });
    });
  });

  describe('getManyRates', () => {
    it('should return limited rates', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({}) // filters
        .mockReturnValueOnce(10); // limit

      const page = createMockPage(mockRates);
      mockClient.rates.search.mockResolvedValue(page);

      const result = await rateOps.getManyRates.call(mockContext, mockApiClient, 0);

      expect(mockClient.rates.search).toHaveBeenCalledWith({
        teamId: undefined,
        status: 'active',
        sort: undefined,
        order: undefined,
        limit: 10,
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('rate-1');
      expect(result[1].id).toBe('rate-2');
    });

    it('should return all rates with pagination', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(true) // returnAll
        .mockReturnValueOnce({}); // filters

      const page1 = createMockPage([mockRates[0]], 3);
      const page2 = createMockPage([mockRates[1]], 3);
      const page3 = createMockPage([{ ...mockRate, id: 'rate-3' }], 3);

      page1.hasNextPage = true;
      page2.hasNextPage = true;
      page3.hasNextPage = false;

      mockClient.rates.search.mockResolvedValueOnce(page1);
      page1.nextPage.mockResolvedValueOnce(page2);
      page2.nextPage.mockResolvedValueOnce(page3);

      const result = await rateOps.getManyRates.call(mockContext, mockApiClient, 0);

      expect(mockClient.rates.search).toHaveBeenCalledTimes(1);
      expect(page1.nextPage).toHaveBeenCalledTimes(1);
      expect(page2.nextPage).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(3);
    });

    it('should apply filters', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({
          teamId: 'team-123',
          archived: false,
          sort: 'created',
          order: 'desc',
        })
        .mockReturnValueOnce(20);

      const page = createMockPage([mockRate]);
      mockClient.rates.search.mockResolvedValue(page);

      await rateOps.getManyRates.call(mockContext, mockApiClient, 0);

      expect(mockClient.rates.search).toHaveBeenCalledWith({
        teamId: 'team-123',
        status: 'active',
        sort: 'created',
        order: 'desc',
        limit: 20,
      });
    });

    it('should include archived rates when filter is true', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false)
        .mockReturnValueOnce({
          archived: true,
        })
        .mockReturnValueOnce(10);

      const page = createMockPage(mockRates);
      mockClient.rates.search.mockResolvedValue(page);

      await rateOps.getManyRates.call(mockContext, mockApiClient, 0);

      expect(mockClient.rates.search).toHaveBeenCalledWith({
        teamId: undefined,
        status: 'all',
        sort: undefined,
        order: undefined,
        limit: 10,
      });
    });

    it('should handle empty results', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false)
        .mockReturnValueOnce({})
        .mockReturnValueOnce(10);

      const page = createMockPage([]);
      mockClient.rates.search.mockResolvedValue(page);

      const result = await rateOps.getManyRates.call(mockContext, mockApiClient, 0);

      expect(result).toHaveLength(0);
    });
  });
});
