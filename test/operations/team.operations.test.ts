/**
 * Tests for team operations
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as teamOps from '../../nodes/Timesheet/operations/team.operations';
import { createMockExecuteFunctions, createMockPage } from '../helpers/mocks';

const mockTeam = {
  id: 'team-1',
  name: 'Engineering',
  description: 'Engineering team',
  color: 3,
  projects: 5,
  members: 8,
  created: 1706533200000,
  lastUpdate: 1706533200000,
};

const mockTeams = [mockTeam, { ...mockTeam, id: 'team-2', name: 'Design' }];

describe('Team Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = {
      teams: {
        create: vi.fn(),
        get: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
        search: vi.fn(),
      },
    };
    mockApiClient = { getClient: () => mockClient };
  });

  describe('createTeam', () => {
    it('should create a team with required fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('Engineering') // name
        .mockReturnValueOnce({}); // additionalFields

      mockClient.teams.create.mockResolvedValue(mockTeam);

      const result = await teamOps.createTeam.call(mockContext, mockApiClient, 0);

      expect(mockClient.teams.create).toHaveBeenCalledWith({
        name: 'Engineering',
        description: undefined,
        color: undefined,
      });

      expect(result).toEqual({
        id: 'team-1',
        name: 'Engineering',
        description: 'Engineering team',
        color: 3,
        projects: 5,
        members: 8,
        created: 1706533200000,
        lastUpdate: 1706533200000,
      });
    });

    it('should create a team with additional fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('Design')
        .mockReturnValueOnce({ description: 'Design team', color: 7 });

      mockClient.teams.create.mockResolvedValue({
        ...mockTeam,
        name: 'Design',
        description: 'Design team',
        color: 7,
      });

      const result = await teamOps.createTeam.call(mockContext, mockApiClient, 0);

      expect(mockClient.teams.create).toHaveBeenCalledWith({
        name: 'Design',
        description: 'Design team',
        color: 7,
      });
      expect(result.name).toBe('Design');
      expect(result.description).toBe('Design team');
      expect(result.color).toBe(7);
    });
  });

  describe('getTeam', () => {
    it('should retrieve a team by ID', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('team-1');
      mockClient.teams.get.mockResolvedValue(mockTeam);

      const result = await teamOps.getTeam.call(mockContext, mockApiClient, 0);

      expect(mockClient.teams.get).toHaveBeenCalledWith('team-1');
      expect(result.id).toBe('team-1');
      expect(result.name).toBe('Engineering');
    });
  });

  describe('updateTeam', () => {
    it('should update team fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('team-1')
        .mockReturnValueOnce({ name: 'Platform', color: 9 });

      mockClient.teams.update.mockResolvedValue({
        ...mockTeam,
        name: 'Platform',
        color: 9,
      });

      const result = await teamOps.updateTeam.call(mockContext, mockApiClient, 0);

      expect(mockClient.teams.update).toHaveBeenCalledWith('team-1', {
        name: 'Platform',
        description: undefined,
        color: 9,
      });
      expect(result.name).toBe('Platform');
    });
  });

  describe('deleteTeam', () => {
    it('should delete a team', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('team-1');
      mockClient.teams.delete.mockResolvedValue(undefined);

      const result = await teamOps.deleteTeam.call(mockContext, mockApiClient, 0);

      expect(mockClient.teams.delete).toHaveBeenCalledWith('team-1');
      expect(result).toEqual({ success: true, id: 'team-1' });
    });
  });

  describe('getManyTeams', () => {
    it('should return limited teams', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({}) // filters
        .mockReturnValueOnce(10); // limit

      mockClient.teams.search.mockResolvedValue(createMockPage(mockTeams));

      const result = await teamOps.getManyTeams.call(mockContext, mockApiClient, 0);

      expect(mockClient.teams.search).toHaveBeenCalledWith({
        sort: undefined,
        order: undefined,
        limit: 10,
      });
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('team-1');
    });

    it('should return all teams with pagination', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(true) // returnAll
        .mockReturnValueOnce({}); // filters

      const page1 = createMockPage([mockTeams[0]], 2);
      const page2 = createMockPage([mockTeams[1]], 2);
      page1.hasNextPage = true;
      page2.hasNextPage = false;

      mockClient.teams.search.mockResolvedValueOnce(page1);
      page1.nextPage.mockResolvedValueOnce(page2);

      const result = await teamOps.getManyTeams.call(mockContext, mockApiClient, 0);

      expect(result).toHaveLength(2);
    });
  });
});
