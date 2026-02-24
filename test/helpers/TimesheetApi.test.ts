/**
 * Tests for TimesheetApi helper
 */
import { describe, it, expect, vi } from 'vitest';
import { TimesheetApiClient } from '../../nodes/Timesheet/helpers/TimesheetApi';

// Mock the SDK
vi.mock('@timesheet/sdk', () => {
  return {
    TimesheetClient: vi.fn().mockImplementation((config) => {
      return {
        config,
        timer: {},
        projects: {},
        tasks: {},
      };
    }),
  };
});

describe('TimesheetApi Helper', () => {
  describe('fromExecute', () => {
    it('should create client with API key authentication', async () => {
      const mockContext = {
        getNodeParameter: vi.fn().mockReturnValue('apiKey'),
        getCredentials: vi.fn().mockResolvedValue({
          baseUrl: 'https://api.timesheet.io',
          apiKey: 'ts_test.secret123',
        }),
      };

      const client = await TimesheetApiClient.fromExecute(mockContext as any, 0);

      expect(mockContext.getNodeParameter).toHaveBeenCalledWith('authentication', 0);
      expect(mockContext.getCredentials).toHaveBeenCalledWith('timesheetApi', 0);
      expect(client).toBeInstanceOf(TimesheetApiClient);
    });

    it('should create client with OAuth2 authentication', async () => {
      const mockContext = {
        getNodeParameter: vi.fn().mockReturnValue('oAuth2'),
        getCredentials: vi.fn().mockResolvedValue({
          baseUrl: 'https://api.timesheet.io',
          oauthTokenData: {
            access_token: 'oauth_access_token',
          },
        }),
      };

      const client = await TimesheetApiClient.fromExecute(mockContext as any, 0);

      expect(mockContext.getCredentials).toHaveBeenCalledWith('timesheetOAuth2Api', 0);
      expect(client).toBeInstanceOf(TimesheetApiClient);
    });

    it('should use default base URL if not provided', async () => {
      const mockContext = {
        getNodeParameter: vi.fn().mockReturnValue('apiKey'),
        getCredentials: vi.fn().mockResolvedValue({
          apiKey: 'ts_test.secret123',
        }),
      };

      const client = await TimesheetApiClient.fromExecute(mockContext as any, 0);

      expect(client).toBeInstanceOf(TimesheetApiClient);
    });
  });

  describe('fromLoadOptions', () => {
    it('should create client with API key for load options', async () => {
      const mockContext = {
        getCredentials: vi.fn().mockResolvedValue({
          baseUrl: 'https://api.timesheet.io',
          apiKey: 'ts_test.secret123',
        }),
      };

      const client = await TimesheetApiClient.fromLoadOptions(mockContext as any);

      expect(mockContext.getCredentials).toHaveBeenCalledWith('timesheetApi');
      expect(client).toBeInstanceOf(TimesheetApiClient);
    });
  });

  describe('getClient', () => {
    it('should return the SDK client instance', async () => {
      const mockContext = {
        getNodeParameter: vi.fn().mockReturnValue('apiKey'),
        getCredentials: vi.fn().mockResolvedValue({
          baseUrl: 'https://api.timesheet.io',
          apiKey: 'ts_test.secret123',
        }),
      };

      const apiClient = await TimesheetApiClient.fromExecute(mockContext as any, 0);
      const sdkClient = apiClient.getClient();

      expect(sdkClient).toBeDefined();
      expect(sdkClient.timer).toBeDefined();
      expect(sdkClient.projects).toBeDefined();
      expect(sdkClient.tasks).toBeDefined();
    });
  });

  describe('constructor', () => {
    it('should create client with API key config', () => {
      const client = new TimesheetApiClient({
        baseUrl: 'https://api.timesheet.io',
        apiKey: 'ts_test.secret123',
      });

      expect(client).toBeInstanceOf(TimesheetApiClient);
      expect(client.getClient()).toBeDefined();
    });

    it('should create client with OAuth2 config', () => {
      const client = new TimesheetApiClient({
        baseUrl: 'https://api.timesheet.io',
        oauth2Token: 'oauth_access_token',
      });

      expect(client).toBeInstanceOf(TimesheetApiClient);
      expect(client.getClient()).toBeDefined();
    });

    it('should use default base URL if not specified', () => {
      const client = new TimesheetApiClient({
        apiKey: 'ts_test.secret123',
      });

      expect(client).toBeInstanceOf(TimesheetApiClient);
    });

    it('should throw error when neither apiKey nor oauth2Token is provided', () => {
      expect(
        () =>
          new TimesheetApiClient({
            baseUrl: 'https://api.timesheet.io',
          }),
      ).toThrow('Either apiKey or oauth2Token must be provided');
    });
  });

  describe('fromHook', () => {
    it('should create client with API key for hook context', async () => {
      const mockContext = {
        getNodeParameter: vi.fn().mockReturnValue('apiKey'),
        getCredentials: vi.fn().mockResolvedValue({
          baseUrl: 'https://api.timesheet.io',
          apiKey: 'ts_test.secret123',
        }),
      };

      const client = await TimesheetApiClient.fromHook(mockContext as any);

      expect(mockContext.getNodeParameter).toHaveBeenCalledWith('authentication', 0);
      expect(mockContext.getCredentials).toHaveBeenCalledWith('timesheetApi');
      expect(client).toBeInstanceOf(TimesheetApiClient);
    });

    it('should create client with OAuth2 for hook context', async () => {
      const mockContext = {
        getNodeParameter: vi.fn().mockReturnValue('oAuth2'),
        getCredentials: vi.fn().mockResolvedValue({
          baseUrl: 'https://api.timesheet.io',
          oauthTokenData: {
            access_token: 'oauth_access_token',
          },
        }),
      };

      const client = await TimesheetApiClient.fromHook(mockContext as any);

      expect(mockContext.getNodeParameter).toHaveBeenCalledWith('authentication', 0);
      expect(mockContext.getCredentials).toHaveBeenCalledWith('timesheetOAuth2Api');
      expect(client).toBeInstanceOf(TimesheetApiClient);
    });
  });

  describe('paginate', () => {
    it('should return limited results when returnAll is false', async () => {
      const client = new TimesheetApiClient({
        baseUrl: 'https://api.timesheet.io',
        apiKey: 'ts_test.secret123',
      });

      const fetchPage = vi.fn().mockImplementation((page: number) => {
        if (page === 1) {
          return Promise.resolve({ items: [1, 2, 3, 4, 5], hasMore: true });
        }
        return Promise.resolve({ items: [6, 7, 8, 9, 10], hasMore: false });
      });

      const result = await client.paginate(fetchPage, { returnAll: false, limit: 3 });

      expect(result).toEqual([1, 2, 3]);
      expect(fetchPage).toHaveBeenCalledTimes(1);
    });

    it('should return all results when returnAll is true', async () => {
      const client = new TimesheetApiClient({
        baseUrl: 'https://api.timesheet.io',
        apiKey: 'ts_test.secret123',
      });

      const fetchPage = vi.fn().mockImplementation((page: number) => {
        if (page === 1) {
          return Promise.resolve({ items: [1, 2, 3], hasMore: true });
        }
        if (page === 2) {
          return Promise.resolve({ items: [4, 5, 6], hasMore: true });
        }
        return Promise.resolve({ items: [7, 8], hasMore: false });
      });

      const result = await client.paginate(fetchPage, { returnAll: true, limit: 100 });

      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
      expect(fetchPage).toHaveBeenCalledTimes(3);
    });

    it('should stop fetching when limit is reached', async () => {
      const client = new TimesheetApiClient({
        baseUrl: 'https://api.timesheet.io',
        apiKey: 'ts_test.secret123',
      });

      const fetchPage = vi.fn().mockImplementation((page: number) => {
        if (page === 1) {
          return Promise.resolve({ items: [1, 2, 3, 4, 5], hasMore: true });
        }
        if (page === 2) {
          return Promise.resolve({ items: [6, 7, 8, 9, 10], hasMore: true });
        }
        return Promise.resolve({ items: [11, 12], hasMore: false });
      });

      const result = await client.paginate(fetchPage, { returnAll: false, limit: 7 });

      // Should fetch page 1 (5 items), then page 2 to reach limit
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7]);
      expect(fetchPage).toHaveBeenCalledTimes(2);
    });

    it('should handle empty first page', async () => {
      const client = new TimesheetApiClient({
        baseUrl: 'https://api.timesheet.io',
        apiKey: 'ts_test.secret123',
      });

      const fetchPage = vi.fn().mockResolvedValue({ items: [], hasMore: false });

      const result = await client.paginate(fetchPage, { returnAll: true, limit: 100 });

      expect(result).toEqual([]);
      expect(fetchPage).toHaveBeenCalledTimes(1);
    });
  });
});
