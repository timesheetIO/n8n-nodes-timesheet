/**
 * Tests for organization operations
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as organizationOps from '../../nodes/Timesheet/operations/organization.operations';
import { createMockExecuteFunctions, createMockPage } from '../helpers/mocks';

const mockOrganization = {
  id: 'org-1',
  name: 'Acme Inc',
  description: 'Test org',
  color: 5,
  aiChatEnabled: true,
  created: 1706533200000,
  lastUpdate: 1706533200000,
};

const mockOrganizations = [
  mockOrganization,
  { ...mockOrganization, id: 'org-2', name: 'Beta LLC' },
];

describe('Organization Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = {
      organizations: {
        get: vi.fn(),
        update: vi.fn(),
        search: vi.fn(),
      },
    };
    mockApiClient = { getClient: () => mockClient };
  });

  describe('getOrganization', () => {
    it('should retrieve an organization by ID (resource locator)', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce({ mode: 'list', value: 'org-1' });
      mockClient.organizations.get.mockResolvedValue(mockOrganization);

      const result = await organizationOps.getOrganization.call(mockContext, mockApiClient, 0);

      expect(mockClient.organizations.get).toHaveBeenCalledWith('org-1');
      expect(result.id).toBe('org-1');
      expect(result.name).toBe('Acme Inc');
    });

    it('should accept a plain string ID', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('org-1');
      mockClient.organizations.get.mockResolvedValue(mockOrganization);

      await organizationOps.getOrganization.call(mockContext, mockApiClient, 0);

      expect(mockClient.organizations.get).toHaveBeenCalledWith('org-1');
    });
  });

  describe('updateOrganization', () => {
    it('should update organization fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce({ mode: 'list', value: 'org-1' })
        .mockReturnValueOnce({ name: 'New Name', aiChatEnabled: false });

      mockClient.organizations.update.mockResolvedValue({
        ...mockOrganization,
        name: 'New Name',
        aiChatEnabled: false,
      });

      const result = await organizationOps.updateOrganization.call(mockContext, mockApiClient, 0);

      expect(mockClient.organizations.update).toHaveBeenCalledWith('org-1', {
        name: 'New Name',
        description: undefined,
        color: undefined,
        aiChatEnabled: false,
      });
      expect(result.name).toBe('New Name');
    });
  });

  describe('getManyOrganizations', () => {
    it('should return limited organizations', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce(10); // limit

      mockClient.organizations.search.mockResolvedValue(createMockPage(mockOrganizations));

      const result = await organizationOps.getManyOrganizations.call(mockContext, mockApiClient, 0);

      expect(mockClient.organizations.search).toHaveBeenCalledWith({ limit: 10 });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('org-1');
    });

    it('should return all organizations with pagination', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce(true); // returnAll

      const page1 = createMockPage([mockOrganizations[0]], 2);
      const page2 = createMockPage([mockOrganizations[1]], 2);
      page1.hasNextPage = true;
      page2.hasNextPage = false;

      mockClient.organizations.search.mockResolvedValueOnce(page1);
      page1.nextPage.mockResolvedValueOnce(page2);

      const result = await organizationOps.getManyOrganizations.call(mockContext, mockApiClient, 0);

      expect(result).toHaveLength(2);
    });
  });
});
