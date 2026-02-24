/**
 * Tests for project operations
 */
import { describe, it, expect, beforeEach } from 'vitest';
import * as projectOps from '../../nodes/Timesheet/operations/project.operations';
import {
  createMockExecuteFunctions,
  createMockTimesheetClient,
  createMockApiClient,
  mockProject,
  mockProjects,
  createMockPage,
} from '../helpers/mocks';

describe('Project Operations', () => {
  let mockContext: any;
  let mockClient: any;
  let mockApiClient: any;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = createMockTimesheetClient();
    mockApiClient = createMockApiClient(mockClient);
  });

  describe('createProject', () => {
    it('should create a project with required fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('New Project') // title
        .mockReturnValueOnce({}); // additionalFields

      mockClient.projects.create.mockResolvedValue(mockProject);

      const result = await projectOps.createProject.call(mockContext, mockApiClient, 0);

      expect(mockClient.projects.create).toHaveBeenCalledWith({
        title: 'New Project',
        description: undefined,
        color: undefined,
        teamId: undefined,
        taskDefaultBillable: undefined,
      });

      expect(result).toEqual({
        id: 'proj-123',
        title: 'Test Project',
        description: 'A test project',
        color: 5,
        archived: false,
        teamId: 'team-123',
      });
    });

    it('should create a project with all fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('New Project') // title
        .mockReturnValueOnce({
          description: 'Project description',
          color: 10,
          teamId: 'team-456',
          taskDefaultBillable: true,
        });

      mockClient.projects.create.mockResolvedValue({
        ...mockProject,
        description: 'Project description',
        color: 10,
        teamId: 'team-456',
      });

      const result = await projectOps.createProject.call(mockContext, mockApiClient, 0);

      expect(mockClient.projects.create).toHaveBeenCalledWith({
        title: 'New Project',
        description: 'Project description',
        color: 10,
        teamId: 'team-456',
        taskDefaultBillable: true,
      });

      expect(result.description).toBe('Project description');
      expect(result.color).toBe(10);
      expect(result.teamId).toBe('team-456');
    });

    it('should create a project with teamId from resource locator format', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('New Project') // title
        .mockReturnValueOnce({
          description: 'Project with team',
          teamId: { value: 'team-789' }, // resource locator format
        });

      mockClient.projects.create.mockResolvedValue({
        ...mockProject,
        teamId: 'team-789',
      });

      const result = await projectOps.createProject.call(mockContext, mockApiClient, 0);

      expect(mockClient.projects.create).toHaveBeenCalledWith({
        title: 'New Project',
        description: 'Project with team',
        color: undefined,
        teamId: 'team-789',
        taskDefaultBillable: undefined,
      });

      expect(result.teamId).toBe('team-789');
    });
  });

  describe('getProject', () => {
    it('should retrieve a project by ID', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('proj-123');

      mockClient.projects.get.mockResolvedValue(mockProject);

      const result = await projectOps.getProject.call(mockContext, mockApiClient, 0);

      expect(mockClient.projects.get).toHaveBeenCalledWith('proj-123');

      expect(result).toEqual({
        id: 'proj-123',
        title: 'Test Project',
        description: 'A test project',
        color: 5,
        archived: false,
        teamId: 'team-123',
      });
    });
  });

  describe('updateProject', () => {
    it('should update project fields', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('proj-123') // projectId
        .mockReturnValueOnce({
          title: 'Updated Project',
          description: 'Updated description',
          archived: true,
        });

      const updatedProject = {
        ...mockProject,
        title: 'Updated Project',
        description: 'Updated description',
        archived: true,
      };
      mockClient.projects.update.mockResolvedValue(updatedProject);

      const result = await projectOps.updateProject.call(mockContext, mockApiClient, 0);

      expect(mockClient.projects.update).toHaveBeenCalledWith('proj-123', {
        title: 'Updated Project',
        description: 'Updated description',
        color: undefined,
        archived: true,
      });

      expect(result.title).toBe('Updated Project');
      expect(result.archived).toBe(true);
    });

    it('should handle partial updates', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce('proj-123')
        .mockReturnValueOnce({ title: 'New Title Only' });

      mockClient.projects.update.mockResolvedValue({
        ...mockProject,
        title: 'New Title Only',
      });

      await projectOps.updateProject.call(mockContext, mockApiClient, 0);

      expect(mockClient.projects.update).toHaveBeenCalledWith('proj-123', {
        title: 'New Title Only',
        description: undefined,
        color: undefined,
        archived: undefined,
      });
    });
  });

  describe('deleteProject', () => {
    it('should delete a project', async () => {
      mockContext.getNodeParameter.mockReturnValueOnce('proj-123');

      mockClient.projects.delete.mockResolvedValue(undefined);

      const result = await projectOps.deleteProject.call(mockContext, mockApiClient, 0);

      expect(mockClient.projects.delete).toHaveBeenCalledWith('proj-123');

      expect(result).toEqual({
        success: true,
        id: 'proj-123',
      });
    });
  });

  describe('getManyProjects', () => {
    it('should return limited projects', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({}) // filters
        .mockReturnValueOnce(10); // limit

      const page = createMockPage(mockProjects);
      mockClient.projects.list.mockResolvedValue(page);

      const result = await projectOps.getManyProjects.call(mockContext, mockApiClient, 0);

      expect(mockClient.projects.list).toHaveBeenCalledWith({
        teamId: undefined,
        status: undefined,
        sort: undefined,
        order: undefined,
        statistics: true,
        limit: 10,
      });

      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('proj-123');
      expect(result[1].id).toBe('proj-456');
    });

    it('should return all projects with pagination', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(true) // returnAll
        .mockReturnValueOnce({}); // filters

      const page1 = createMockPage(mockProjects.slice(0, 1), 3);
      const page2 = createMockPage(mockProjects.slice(1, 2), 3);
      const page3 = createMockPage([{ ...mockProject, id: 'proj-789' }], 3);

      mockClient.projects.list
        .mockResolvedValueOnce(page1)
        .mockResolvedValueOnce(page2)
        .mockResolvedValueOnce(page3);

      const result = await projectOps.getManyProjects.call(mockContext, mockApiClient, 0);

      expect(mockClient.projects.list).toHaveBeenCalledTimes(3);
      expect(result).toHaveLength(3);
    });

    it('should apply filters', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({
          teamId: 'team-123',
          status: 'active',
          sort: 'alpha',
          order: 'asc',
        })
        .mockReturnValueOnce(20);

      const page = createMockPage([mockProject]);
      mockClient.projects.list.mockResolvedValue(page);

      await projectOps.getManyProjects.call(mockContext, mockApiClient, 0);

      expect(mockClient.projects.list).toHaveBeenCalledWith({
        teamId: 'team-123',
        status: 'active',
        sort: 'alpha',
        order: 'asc',
        statistics: true,
        limit: 20,
      });
    });

    it('should apply teamId filter from resource locator format', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false) // returnAll
        .mockReturnValueOnce({
          teamId: { value: 'team-789' }, // resource locator format
          status: 'active',
        })
        .mockReturnValueOnce(10);

      const page = createMockPage([mockProject]);
      mockClient.projects.list.mockResolvedValue(page);

      await projectOps.getManyProjects.call(mockContext, mockApiClient, 0);

      expect(mockClient.projects.list).toHaveBeenCalledWith({
        teamId: 'team-789',
        status: 'active',
        sort: undefined,
        order: undefined,
        statistics: true,
        limit: 10,
      });
    });

    it('should handle empty results', async () => {
      mockContext.getNodeParameter
        .mockReturnValueOnce(false)
        .mockReturnValueOnce({})
        .mockReturnValueOnce(10);

      const page = createMockPage([]);
      mockClient.projects.list.mockResolvedValue(page);

      const result = await projectOps.getManyProjects.call(mockContext, mockApiClient, 0);

      expect(result).toHaveLength(0);
    });
  });
});
