import type { IExecuteFunctions } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import type { ProfileResponseData } from '../types';

/**
 * Get user profile
 */
export async function getProfile(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  _itemIndex: number,
): Promise<ProfileResponseData> {
  return await client.getClient().profile.getProfile();
}

/**
 * Update user profile
 */
export async function updateProfile(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ProfileResponseData> {
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const updateData = {
    email: updateFields.email as string | undefined,
    firstname: updateFields.firstname as string | undefined,
    lastname: updateFields.lastname as string | undefined,
    imageUrl: updateFields.imageUrl as string | undefined,
    newsletter: updateFields.newsletter as boolean | undefined,
  };

  return await client.getClient().profile.updateProfile(updateData);
}
