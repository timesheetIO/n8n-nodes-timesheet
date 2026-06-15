/**
 * Tests for automation operations
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as automationOps from '../../nodes/Timesheet/operations/automation.operations';
import { createMockExecuteFunctions, createMockPage } from '../helpers/mocks';

const mockAutomation = {
  id: 'automation-1',
  typeId: 0,
  action: 0,
  enabled: true,
  shared: false,
  name: 'Office Geofence',
  project: { id: 'proj-123' },
  created: 1706533200000,
  lastUpdate: 1706533200000,
};

const mockAutomations = [
  mockAutomation,
  { ...mockAutomation, id: 'automation-2', name: 'Home WLAN', typeId: 1 },
];

describe('Automation Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = {
      automations: {
        create: vi.fn(),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        search: vi.fn(),
      },
    };
    mockApiClient = { getClient: () => mockClient };
  });

  describe('createAutomation', () => {
    it('should create an automation with required fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('proj-123') // projectId
        .mockReturnValueOnce(0) // typeId
        .mockReturnValueOnce(0) // action
        .mockReturnValueOnce({}); // additionalFields

      mockClient.automations.create.mockResolvedValue(mockAutomation);

      const result = await automationOps.createAutomation.call(mockContext, mockApiClient, 0);

      expect(mockClient.automations.create).toHaveBeenCalledWith({
        projectId: 'proj-123',
        typeId: 0,
        action: 0,
        enabled: undefined,
        shared: undefined,
        address: undefined,
        latitude: undefined,
        longitude: undefined,
        radius: undefined,
        ssid: undefined,
        beaconUUID: undefined,
      });

      expect(result).toEqual({
        id: 'automation-1',
        projectId: 'proj-123',
        typeId: 0,
        action: 0,
        enabled: true,
        shared: false,
        name: 'Office Geofence',
        created: 1706533200000,
        lastUpdate: 1706533200000,
      });
    });

    it('should extract projectId from a resource locator object', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'proj-456' }) // projectId
        .mockReturnValueOnce(1) // typeId
        .mockReturnValueOnce(2) // action
        .mockReturnValueOnce({ ssid: 'OfficeWifi', enabled: false }); // additionalFields

      mockClient.automations.create.mockResolvedValue({
        ...mockAutomation,
        typeId: 1,
        action: 2,
        project: { id: 'proj-456' },
      });

      await automationOps.createAutomation.call(mockContext, mockApiClient, 0);

      expect(mockClient.automations.create).toHaveBeenCalledWith({
        projectId: 'proj-456',
        typeId: 1,
        action: 2,
        enabled: false,
        shared: undefined,
        address: undefined,
        latitude: undefined,
        longitude: undefined,
        radius: undefined,
        ssid: 'OfficeWifi',
        beaconUUID: undefined,
      });
    });
  });

  describe('getAutomation', () => {
    it('should retrieve an automation by ID', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('automation-1');
      mockClient.automations.get.mockResolvedValue(mockAutomation);

      const result = await automationOps.getAutomation.call(mockContext, mockApiClient, 0);

      expect(mockClient.automations.get).toHaveBeenCalledWith('automation-1');
      expect(result.id).toBe('automation-1');
      expect(result.projectId).toBe('proj-123');
    });
  });

  describe('updateAutomation', () => {
    it('should update automation fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('automation-1')
        .mockReturnValueOnce({ enabled: false, radius: 250 });

      mockClient.automations.update.mockResolvedValue({
        ...mockAutomation,
        enabled: false,
      });

      const result = await automationOps.updateAutomation.call(mockContext, mockApiClient, 0);

      expect(mockClient.automations.update).toHaveBeenCalledWith('automation-1', {
        enabled: false,
        shared: undefined,
        address: undefined,
        latitude: undefined,
        longitude: undefined,
        radius: 250,
        ssid: undefined,
        beaconUUID: undefined,
      });
      expect(result.enabled).toBe(false);
    });
  });

  describe('deleteAutomation', () => {
    it('should delete an automation', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('automation-1');
      mockClient.automations.delete.mockResolvedValue(undefined);

      const result = await automationOps.deleteAutomation.call(mockContext, mockApiClient, 0);

      expect(mockClient.automations.delete).toHaveBeenCalledWith('automation-1');
      expect(result).toEqual({ success: true, id: 'automation-1' });
    });
  });

  describe('getManyAutomations', () => {
    it('should return limited automations', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({}) // filters
        .mockReturnValueOnce(10); // limit

      mockClient.automations.search.mockResolvedValue(createMockPage(mockAutomations));

      const result = await automationOps.getManyAutomations.call(mockContext, mockApiClient, 0);

      expect(mockClient.automations.search).toHaveBeenCalledWith({
        projectId: undefined,
        status: undefined,
        limit: 10,
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('automation-1');
    });

    it('should extract projectId filter from a resource locator object', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({ projectId: { mode: 'list', value: 'proj-123' }, status: 'enabled' }) // filters
        .mockReturnValueOnce(50); // limit

      mockClient.automations.search.mockResolvedValue(createMockPage([mockAutomation]));

      await automationOps.getManyAutomations.call(mockContext, mockApiClient, 0);

      expect(mockClient.automations.search).toHaveBeenCalledWith({
        projectId: 'proj-123',
        status: 'enabled',
        limit: 50,
      });
    });

    it('should return all automations with pagination', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(true) // returnAll
        .mockReturnValueOnce({}); // filters

      const page1 = createMockPage([mockAutomations[0]], 2);
      const page2 = createMockPage([mockAutomations[1]], 2);
      page1.hasNextPage = true;
      page2.hasNextPage = false;

      mockClient.automations.search.mockResolvedValueOnce(page1);
      page1.nextPage.mockResolvedValueOnce(page2);

      const result = await automationOps.getManyAutomations.call(mockContext, mockApiClient, 0);

      expect(result).toHaveLength(2);
    });
  });
});
