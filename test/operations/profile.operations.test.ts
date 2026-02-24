import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { IExecuteFunctions } from 'n8n-workflow';
import * as profileOps from '../../nodes/Timesheet/operations/profile.operations';
import {
  createMockExecuteFunctions,
  createMockTimesheetClient,
  createMockApiClient,
  mockProfile,
} from '../helpers/mocks';

describe('Profile Operations', () => {
  let mockContext: IExecuteFunctions;
  let mockClient: ReturnType<typeof createMockTimesheetClient>;
  let mockApiClient: ReturnType<typeof createMockApiClient>;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = createMockTimesheetClient();
    mockApiClient = createMockApiClient(mockClient);
  });

  describe('getProfile', () => {
    it('should get user profile', async () => {
      mockClient.profile.getProfile.mockResolvedValue(mockProfile);

      const result = await profileOps.getProfile.call(mockContext, mockApiClient, 0);

      expect(mockClient.profile.getProfile).toHaveBeenCalledWith();
      expect(result.email).toBe('test@example.com');
      expect(result.firstname).toBe('Test');
      expect(result.lastname).toBe('User');
      expect(result.newsletter).toBe(true);
      expect(result.activated).toBe(true);
      expect(result.valid).toBe(true);
      expect(result.planPro).toBe(true);
    });

    it('should return all profile fields', async () => {
      mockClient.profile.getProfile.mockResolvedValue(mockProfile);

      const result = await profileOps.getProfile.call(mockContext, mockApiClient, 0);

      // Verify all expected fields are present
      expect(result).toHaveProperty('email');
      expect(result).toHaveProperty('imageUrl');
      expect(result).toHaveProperty('firstname');
      expect(result).toHaveProperty('lastname');
      expect(result).toHaveProperty('newsletter');
      expect(result).toHaveProperty('activated');
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('subscriptionId');
      expect(result).toHaveProperty('expires');
      expect(result).toHaveProperty('status');
      expect(result).toHaveProperty('plan');
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('expired');
      expect(result).toHaveProperty('product');
      expect(result).toHaveProperty('trial');
      expect(result).toHaveProperty('planBusiness');
      expect(result).toHaveProperty('planPro');
      expect(result).toHaveProperty('planPlus');
      expect(result).toHaveProperty('planBasic');
      expect(result).toHaveProperty('member');
      expect(result).toHaveProperty('personalSubscriptionActive');
      expect(result).toHaveProperty('organizationSubscriptionActive');
      expect(result).toHaveProperty('validProfile');
      expect(result).toHaveProperty('validAndActivated');
    });
  });

  describe('updateProfile', () => {
    it('should update profile with email', async () => {
      mockContext.getNodeParameter = vi.fn().mockReturnValueOnce({ email: 'newemail@example.com' });

      mockClient.profile.updateProfile.mockResolvedValue({
        ...mockProfile,
        email: 'newemail@example.com',
      });

      const result = await profileOps.updateProfile.call(mockContext, mockApiClient, 0);

      expect(mockClient.profile.updateProfile).toHaveBeenCalledWith({
        email: 'newemail@example.com',
        firstname: undefined,
        lastname: undefined,
        imageUrl: undefined,
        newsletter: undefined,
      });

      expect(result.email).toBe('newemail@example.com');
    });

    it('should update profile with multiple fields', async () => {
      mockContext.getNodeParameter = vi.fn().mockReturnValueOnce({
        firstname: 'John',
        lastname: 'Doe',
        newsletter: false,
      });

      mockClient.profile.updateProfile.mockResolvedValue({
        ...mockProfile,
        firstname: 'John',
        lastname: 'Doe',
        newsletter: false,
      });

      const result = await profileOps.updateProfile.call(mockContext, mockApiClient, 0);

      expect(mockClient.profile.updateProfile).toHaveBeenCalledWith({
        email: undefined,
        firstname: 'John',
        lastname: 'Doe',
        imageUrl: undefined,
        newsletter: false,
      });

      expect(result.firstname).toBe('John');
      expect(result.lastname).toBe('Doe');
      expect(result.newsletter).toBe(false);
    });

    it('should update profile with image URL', async () => {
      mockContext.getNodeParameter = vi
        .fn()
        .mockReturnValueOnce({ imageUrl: 'https://example.com/newavatar.jpg' });

      mockClient.profile.updateProfile.mockResolvedValue({
        ...mockProfile,
        imageUrl: 'https://example.com/newavatar.jpg',
      });

      const result = await profileOps.updateProfile.call(mockContext, mockApiClient, 0);

      expect(mockClient.profile.updateProfile).toHaveBeenCalledWith({
        email: undefined,
        firstname: undefined,
        lastname: undefined,
        imageUrl: 'https://example.com/newavatar.jpg',
        newsletter: undefined,
      });

      expect(result.imageUrl).toBe('https://example.com/newavatar.jpg');
    });

    it('should handle empty update fields', async () => {
      mockContext.getNodeParameter = vi.fn().mockReturnValueOnce({});

      mockClient.profile.updateProfile.mockResolvedValue(mockProfile);

      const result = await profileOps.updateProfile.call(mockContext, mockApiClient, 0);

      expect(mockClient.profile.updateProfile).toHaveBeenCalledWith({
        email: undefined,
        firstname: undefined,
        lastname: undefined,
        imageUrl: undefined,
        newsletter: undefined,
      });

      expect(result.email).toBe('test@example.com');
    });
  });
});
