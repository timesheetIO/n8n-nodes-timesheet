/**
 * Tests for tag operations
 */
import { describe, it, expect, beforeEach } from 'vitest';
import * as tagOps from '../../nodes/Timesheet/operations/tag.operations';
import {
  createMockExecuteFunctions,
  createMockTimesheetClient,
  createMockApiClient,
  mockTag,
  mockTags,
  createMockPage,
} from '../helpers/mocks';

describe('Tag Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = createMockTimesheetClient();
    mockApiClient = createMockApiClient(mockClient);
  });

  describe('createTag', () => {
    it('should create a tag with required fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('Development') // name
        .mockReturnValueOnce({}); // additionalFields

      mockClient.tags.create.mockResolvedValue(mockTag);

      const result = await tagOps.createTag.call(mockContext, mockApiClient, 0);

      expect(mockClient.tags.create).toHaveBeenCalledWith({
        name: 'Development',
        color: undefined,
        teamId: undefined,
      });

      expect(result).toEqual({
        id: 'tag-1',
        name: 'Development',
        color: 100,
        teamId: 'team-123',
        archived: false,
        created: 1706533200000,
        lastUpdate: 1706533200000,
      });
    });

    it('should create a tag with all fields', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('Development').mockReturnValueOnce({
        color: 150,
        teamId: 'team-456',
      });

      const customTag = {
        ...mockTag,
        color: 150,
        team: {
          id: 'team-456',
          name: 'Custom Team',
        },
      };
      mockClient.tags.create.mockResolvedValue(customTag);

      const result = await tagOps.createTag.call(mockContext, mockApiClient, 0);

      expect(mockClient.tags.create).toHaveBeenCalledWith({
        name: 'Development',
        color: 150,
        teamId: 'team-456',
      });

      expect(result.color).toBe(150);
      expect(result.teamId).toBe('team-456');
    });
  });

  describe('getTag', () => {
    it('should retrieve a tag by ID', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('tag-1');

      mockClient.tags.get.mockResolvedValue(mockTag);

      const result = await tagOps.getTag.call(mockContext, mockApiClient, 0);

      expect(mockClient.tags.get).toHaveBeenCalledWith('tag-1');

      expect(result).toEqual({
        id: 'tag-1',
        name: 'Development',
        color: 100,
        teamId: 'team-123',
        archived: false,
        created: 1706533200000,
        lastUpdate: 1706533200000,
      });
    });
  });

  describe('updateTag', () => {
    it('should update tag fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('tag-1') // tagId
        .mockReturnValueOnce({
          name: 'Updated Tag',
          color: 200,
          archived: true,
        });

      const updatedTag = {
        ...mockTag,
        name: 'Updated Tag',
        color: 200,
        archived: true,
      };
      mockClient.tags.update.mockResolvedValue(updatedTag);

      const result = await tagOps.updateTag.call(mockContext, mockApiClient, 0);

      expect(mockClient.tags.update).toHaveBeenCalledWith('tag-1', {
        name: 'Updated Tag',
        color: 200,
        archived: true,
      });

      expect(result.name).toBe('Updated Tag');
      expect(result.color).toBe(200);
      expect(result.archived).toBe(true);
    });

    it('should handle partial updates', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('tag-1')
        .mockReturnValueOnce({ name: 'New Name Only' });

      mockClient.tags.update.mockResolvedValue({
        ...mockTag,
        name: 'New Name Only',
      });

      await tagOps.updateTag.call(mockContext, mockApiClient, 0);

      expect(mockClient.tags.update).toHaveBeenCalledWith('tag-1', {
        name: 'New Name Only',
        color: undefined,
        archived: undefined,
      });
    });
  });

  describe('deleteTag', () => {
    it('should delete a tag', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('tag-1');

      mockClient.tags.delete.mockResolvedValue(undefined);

      const result = await tagOps.deleteTag.call(mockContext, mockApiClient, 0);

      expect(mockClient.tags.delete).toHaveBeenCalledWith('tag-1');

      expect(result).toEqual({
        success: true,
        id: 'tag-1',
      });
    });
  });

  describe('getManyTags', () => {
    it('should return limited tags', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({}) // filters
        .mockReturnValueOnce(10); // limit

      const page = createMockPage(mockTags);
      mockClient.tags.search.mockResolvedValue(page);

      const result = await tagOps.getManyTags.call(mockContext, mockApiClient, 0);

      expect(mockClient.tags.search).toHaveBeenCalledWith({
        teamId: undefined,
        status: 'active',
        sort: undefined,
        order: undefined,
        limit: 10,
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('tag-1');
      expect(result[1].id).toBe('tag-2');
    });

    it('should return all tags with pagination', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(true) // returnAll
        .mockReturnValueOnce({}); // filters

      const page1 = createMockPage([mockTags[0]], 3);
      const page2 = createMockPage([mockTags[1]], 3);
      const page3 = createMockPage([{ ...mockTag, id: 'tag-3' }], 3);

      page1.hasNextPage = true;
      page2.hasNextPage = true;
      page3.hasNextPage = false;

      mockClient.tags.search.mockResolvedValueOnce(page1);

      page1.nextPage.mockResolvedValueOnce(page2);
      page2.nextPage.mockResolvedValueOnce(page3);

      const result = await tagOps.getManyTags.call(mockContext, mockApiClient, 0);

      expect(mockClient.tags.search).toHaveBeenCalledTimes(1);
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
          sort: 'alpha',
          order: 'desc',
        })
        .mockReturnValueOnce(20);

      const page = createMockPage([mockTag]);
      mockClient.tags.search.mockResolvedValue(page);

      await tagOps.getManyTags.call(mockContext, mockApiClient, 0);

      expect(mockClient.tags.search).toHaveBeenCalledWith({
        teamId: 'team-123',
        status: 'active',
        sort: 'alpha',
        order: 'desc',
        limit: 20,
      });
    });

    it('should include archived tags when filter is true', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false)
        .mockReturnValueOnce({
          archived: true,
        })
        .mockReturnValueOnce(10);

      const page = createMockPage(mockTags);
      mockClient.tags.search.mockResolvedValue(page);

      await tagOps.getManyTags.call(mockContext, mockApiClient, 0);

      expect(mockClient.tags.search).toHaveBeenCalledWith({
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
      mockClient.tags.search.mockResolvedValue(page);

      const result = await tagOps.getManyTags.call(mockContext, mockApiClient, 0);

      expect(result).toHaveLength(0);
    });
  });
});
