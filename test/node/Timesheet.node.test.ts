/**
 * Tests for Timesheet node loadOptions and listSearch methods
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { ILoadOptionsFunctions } from 'n8n-workflow';
import { Timesheet } from '../../nodes/Timesheet/Timesheet.node';
import { TimesheetApiClient } from '../../nodes/Timesheet/helpers/TimesheetApi';
import { createMockTimesheetClient, createMockPage } from '../helpers/mocks';

// Mock TimesheetApiClient
vi.mock('../../nodes/Timesheet/helpers/TimesheetApi', () => {
  return {
    TimesheetApiClient: {
      fromLoadOptions: vi.fn(),
      fromExecute: vi.fn(),
    },
  };
});

describe('Timesheet Node', () => {
  let node: Timesheet;
  let mockClient: ReturnType<typeof createMockTimesheetClient>;
  let mockLoadOptionsContext: Partial<ILoadOptionsFunctions>;

  beforeEach(() => {
    node = new Timesheet();
    mockClient = createMockTimesheetClient();

    // Mock API client
    const mockApiClient = {
      getClient: vi.fn(() => mockClient),
    };
    vi.mocked(TimesheetApiClient.fromLoadOptions).mockResolvedValue(mockApiClient as any);

    // Mock ILoadOptionsFunctions context
    mockLoadOptionsContext = {
      getCredentials: vi.fn().mockResolvedValue({
        baseUrl: 'https://api.timesheet.io',
        apiKey: 'test-api-key',
      }),
      getNode: vi.fn(() => ({
        id: 'test-node-id',
        name: 'Test Node',
        type: 'n8n-nodes-timesheet.timesheet',
        typeVersion: 1,
        position: [0, 0] as [number, number],
        parameters: {},
      })),
    };
  });

  describe('Node Description', () => {
    it('should have correct metadata', () => {
      expect(node.description.displayName).toBe('Timesheet');
      expect(node.description.name).toBe('timesheet');
      expect(node.description.version).toBe(1);
    });

    it('should have all resources', () => {
      const resourceParam = node.description.properties.find((p) => p.name === 'resource');
      expect(resourceParam).toBeDefined();

      const options = (resourceParam as any).options;
      const resourceValues = options.map((opt: any) => opt.value);

      expect(resourceValues).toContain('timer');
      expect(resourceValues).toContain('project');
      expect(resourceValues).toContain('task');
      expect(resourceValues).toContain('tag');
      expect(resourceValues).toContain('rate');
      expect(resourceValues).toContain('profile');
      expect(resourceValues).toContain('settings');
      expect(resourceValues).toContain('webhook');
    });

    it('should support both API Key and OAuth2 authentication', () => {
      const authParam = node.description.properties.find((p) => p.name === 'authentication');
      expect(authParam).toBeDefined();

      const options = (authParam as any).options;
      expect(options).toHaveLength(2);
      expect(options[0].value).toBe('apiKey');
      expect(options[1].value).toBe('oAuth2');
    });
  });

  describe('loadOptions', () => {
    describe('getProjects', () => {
      it('should return projects as options', async () => {
        const mockProjects = [
          { id: 'proj-1', title: 'Project Alpha' },
          { id: 'proj-2', title: 'Project Beta' },
        ];
        const page = createMockPage(mockProjects);
        mockClient.projects.list.mockResolvedValue(page);

        const result = await node.methods.loadOptions.getProjects.call(
          mockLoadOptionsContext as ILoadOptionsFunctions,
        );

        expect(mockClient.projects.list).toHaveBeenCalledWith({ limit: 100, status: 'active' });
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ name: 'Project Alpha', value: 'proj-1' });
        expect(result[1]).toEqual({ name: 'Project Beta', value: 'proj-2' });
      });

      it('should throw error on failure', async () => {
        mockClient.projects.list.mockRejectedValue(new Error('API Error'));

        await expect(
          node.methods.loadOptions.getProjects.call(
            mockLoadOptionsContext as ILoadOptionsFunctions,
          ),
        ).rejects.toThrow('Failed to load projects: API Error');
      });
    });

    describe('getTags', () => {
      it('should return tags as options', async () => {
        const mockTags = [
          { id: 'tag-1', name: 'Development' },
          { id: 'tag-2', name: 'Testing' },
        ];
        const page = createMockPage(mockTags);
        mockClient.tags.list.mockResolvedValue(page);

        const result = await node.methods.loadOptions.getTags.call(
          mockLoadOptionsContext as ILoadOptionsFunctions,
        );

        expect(mockClient.tags.list).toHaveBeenCalledWith({ limit: 100 });
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ name: 'Development', value: 'tag-1' });
        expect(result[1]).toEqual({ name: 'Testing', value: 'tag-2' });
      });

      it('should throw error on failure', async () => {
        mockClient.tags.list.mockRejectedValue(new Error('Network Error'));

        await expect(
          node.methods.loadOptions.getTags.call(mockLoadOptionsContext as ILoadOptionsFunctions),
        ).rejects.toThrow('Failed to load tags: Network Error');
      });
    });

    describe('getTeams', () => {
      it('should return teams as options', async () => {
        const mockTeams = [
          { id: 'team-1', name: 'Engineering' },
          { id: 'team-2', name: 'Design' },
        ];
        const page = createMockPage(mockTeams);
        mockClient.teams.list.mockResolvedValue(page);

        const result = await node.methods.loadOptions.getTeams.call(
          mockLoadOptionsContext as ILoadOptionsFunctions,
        );

        expect(mockClient.teams.list).toHaveBeenCalledWith({ limit: 100 });
        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ name: 'Engineering', value: 'team-1' });
        expect(result[1]).toEqual({ name: 'Design', value: 'team-2' });
      });

      it('should throw error on failure', async () => {
        mockClient.teams.list.mockRejectedValue(new Error('Unauthorized'));

        await expect(
          node.methods.loadOptions.getTeams.call(mockLoadOptionsContext as ILoadOptionsFunctions),
        ).rejects.toThrow('Failed to load teams: Unauthorized');
      });
    });
  });

  describe('listSearch', () => {
    describe('searchProjects', () => {
      it('should return projects with pagination', async () => {
        const mockProjects = [
          { id: 'proj-1', title: 'Project Alpha' },
          { id: 'proj-2', title: 'Project Beta' },
        ];
        const page = createMockPage(mockProjects);
        page.hasNextPage = true;
        mockClient.projects.search.mockResolvedValue(page);

        const result = await node.methods.listSearch.searchProjects.call(
          mockLoadOptionsContext as ILoadOptionsFunctions,
        );

        expect(mockClient.projects.search).toHaveBeenCalledWith({
          page: 1,
          limit: 50,
          status: 'active',
          sort: 'alpha',
          order: 'asc',
        });

        expect(result.results).toHaveLength(2);
        expect(result.results[0]).toEqual({
          name: 'Project Alpha',
          value: 'proj-1',
          url: 'https://my.timesheet.io/projects/show/proj-1',
        });
        expect(result.paginationToken).toBe('2');
      });

      it('should filter projects by title', async () => {
        const mockProjects = [
          { id: 'proj-1', title: 'Alpha Project' },
          { id: 'proj-2', title: 'Beta Project' },
        ];
        const page = createMockPage(mockProjects);
        mockClient.projects.search.mockResolvedValue(page);

        const result = await node.methods.listSearch.searchProjects.call(
          mockLoadOptionsContext as ILoadOptionsFunctions,
          'Alpha',
        );

        expect(result.results).toHaveLength(1);
        expect(result.results[0].name).toBe('Alpha Project');
      });

      it('should handle pagination token', async () => {
        const mockProjects = [{ id: 'proj-3', title: 'Project Gamma' }];
        const page = createMockPage(mockProjects);
        page.hasNextPage = false;
        mockClient.projects.search.mockResolvedValue(page);

        const result = await node.methods.listSearch.searchProjects.call(
          mockLoadOptionsContext as ILoadOptionsFunctions,
          undefined,
          '2',
        );

        expect(mockClient.projects.search).toHaveBeenCalledWith({
          page: 2,
          limit: 50,
          status: 'active',
          sort: 'alpha',
          order: 'asc',
        });

        expect(result.paginationToken).toBeUndefined();
      });

      it('should throw error on failure', async () => {
        mockClient.projects.search.mockRejectedValue(new Error('Connection failed'));

        await expect(
          node.methods.listSearch.searchProjects.call(
            mockLoadOptionsContext as ILoadOptionsFunctions,
          ),
        ).rejects.toThrow('Failed to search projects: Connection failed');
      });
    });

    describe('searchTeams', () => {
      it('should return teams with correct URL format', async () => {
        const mockTeams = [
          { id: 'team-1', name: 'Engineering' },
          { id: 'team-2', name: 'Design' },
        ];
        const page = createMockPage(mockTeams);
        mockClient.teams.search.mockResolvedValue(page);

        const result = await node.methods.listSearch.searchTeams.call(
          mockLoadOptionsContext as ILoadOptionsFunctions,
        );

        expect(result.results).toHaveLength(2);
        expect(result.results[0]).toEqual({
          name: 'Engineering',
          value: 'team-1',
          url: 'https://my.timesheet.io/teams/show/team-1',
        });
      });

      it('should filter teams by name', async () => {
        const mockTeams = [
          { id: 'team-1', name: 'Engineering Team' },
          { id: 'team-2', name: 'Design Team' },
        ];
        const page = createMockPage(mockTeams);
        mockClient.teams.search.mockResolvedValue(page);

        const result = await node.methods.listSearch.searchTeams.call(
          mockLoadOptionsContext as ILoadOptionsFunctions,
          'Design',
        );

        expect(result.results).toHaveLength(1);
        expect(result.results[0].name).toBe('Design Team');
      });
    });

    describe('searchTags', () => {
      it('should return tags without URL', async () => {
        const mockTags = [
          { id: 'tag-1', name: 'Development' },
          { id: 'tag-2', name: 'Testing' },
        ];
        const page = createMockPage(mockTags);
        mockClient.tags.search.mockResolvedValue(page);

        const result = await node.methods.listSearch.searchTags.call(
          mockLoadOptionsContext as ILoadOptionsFunctions,
        );

        expect(result.results).toHaveLength(2);
        expect(result.results[0]).toEqual({
          name: 'Development',
          value: 'tag-1',
        });
        expect(result.results[0]).not.toHaveProperty('url');
      });

      it('should filter tags by name', async () => {
        const mockTags = [
          { id: 'tag-1', name: 'Frontend Development' },
          { id: 'tag-2', name: 'Backend Development' },
          { id: 'tag-3', name: 'Testing' },
        ];
        const page = createMockPage(mockTags);
        mockClient.tags.search.mockResolvedValue(page);

        const result = await node.methods.listSearch.searchTags.call(
          mockLoadOptionsContext as ILoadOptionsFunctions,
          'backend',
        );

        expect(result.results).toHaveLength(1);
        expect(result.results[0].name).toBe('Backend Development');
      });
    });

    describe('searchRates', () => {
      it('should return rates with factor in name', async () => {
        const mockRates = [
          { id: 'rate-1', title: 'Standard', factor: 1.0 },
          { id: 'rate-2', title: 'Overtime', factor: 1.5 },
        ];
        const page = createMockPage(mockRates);
        mockClient.rates.search.mockResolvedValue(page);

        const result = await node.methods.listSearch.searchRates.call(
          mockLoadOptionsContext as ILoadOptionsFunctions,
        );

        expect(result.results).toHaveLength(2);
        expect(result.results[0]).toEqual({
          name: 'Standard (1x)',
          value: 'rate-1',
        });
        expect(result.results[1]).toEqual({
          name: 'Overtime (1.5x)',
          value: 'rate-2',
        });
      });

      it('should filter rates by title', async () => {
        const mockRates = [
          { id: 'rate-1', title: 'Standard Rate', factor: 1.0 },
          { id: 'rate-2', title: 'Overtime Rate', factor: 1.5 },
          { id: 'rate-3', title: 'Holiday Rate', factor: 2.0 },
        ];
        const page = createMockPage(mockRates);
        mockClient.rates.search.mockResolvedValue(page);

        const result = await node.methods.listSearch.searchRates.call(
          mockLoadOptionsContext as ILoadOptionsFunctions,
          'overtime',
        );

        expect(result.results).toHaveLength(1);
        expect(result.results[0].name).toBe('Overtime Rate (1.5x)');
      });

      it('should throw error on failure', async () => {
        mockClient.rates.search.mockRejectedValue(new Error('Rate limit exceeded'));

        await expect(
          node.methods.listSearch.searchRates.call(mockLoadOptionsContext as ILoadOptionsFunctions),
        ).rejects.toThrow('Failed to search rates: Rate limit exceeded');
      });
    });
  });
});
