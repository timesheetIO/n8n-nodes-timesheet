import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import type { TagResponseData } from '../types';

/**
 * Create a new tag
 */
export async function createTag(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TagResponseData> {
  const name = this.getNodeParameter('name', itemIndex) as string;
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

  // Extract teamId from resourceLocator if present
  const teamIdField = additionalFields.teamId as IDataObject | string | undefined;
  const teamId =
    teamIdField && typeof teamIdField === 'object' ? (teamIdField.value as string) : teamIdField;

  const createData = {
    name,
    color: additionalFields.color as number | undefined,
    teamId,
  };

  const tag = await client.getClient().tags.create(createData);

  return {
    id: tag.id,
    name: tag.name,
    color: tag.color,
    teamId: tag.teamId,
    archived: tag.archived,
    created: tag.created,
    lastUpdate: tag.lastUpdate,
  };
}

/**
 * Get a tag by ID
 */
export async function getTag(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TagResponseData> {
  const tagId = this.getNodeParameter('tagId', itemIndex) as string;

  const tag = await client.getClient().tags.get(tagId);

  return {
    id: tag.id,
    name: tag.name,
    color: tag.color,
    teamId: tag.teamId,
    archived: tag.archived,
    created: tag.created,
    lastUpdate: tag.lastUpdate,
  };
}

/**
 * Update a tag
 */
export async function updateTag(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TagResponseData> {
  const tagId = this.getNodeParameter('tagId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const updateData = {
    name: updateFields.name as string | undefined,
    color: updateFields.color as number | undefined,
    archived: updateFields.archived as boolean | undefined,
  };

  const tag = await client.getClient().tags.update(tagId, updateData);

  return {
    id: tag.id,
    name: tag.name,
    color: tag.color,
    teamId: tag.teamId,
    archived: tag.archived,
    created: tag.created,
    lastUpdate: tag.lastUpdate,
  };
}

/**
 * Delete a tag
 */
export async function deleteTag(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<{ success: boolean; id: string }> {
  const tagId = this.getNodeParameter('tagId', itemIndex) as string;

  await client.getClient().tags.delete(tagId);

  return {
    success: true,
    id: tagId,
  };
}

/**
 * Get many tags with optional filters and pagination
 */
export async function getManyTags(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TagResponseData[]> {
  const returnAll = this.getNodeParameter('returnAll', itemIndex, false);
  const filters = this.getNodeParameter('filters', itemIndex, {});

  // Extract teamId from resourceLocator if present
  const teamIdField = filters.teamId as IDataObject | string | undefined;
  const teamId =
    teamIdField && typeof teamIdField === 'object' ? (teamIdField.value as string) : teamIdField;

  const params = {
    teamId,
    status: filters.archived ? ('all' as const) : ('active' as const),
    sort: filters.sort as 'alpha' | 'status' | 'created' | undefined,
    order: filters.order as 'asc' | 'desc' | undefined,
    limit: returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50),
  };

  const page = await client.getClient().tags.search(params);

  // Handle pagination manually to respect limit
  const tags = returnAll ? [] : page.items.slice(0, params.limit as number);

  if (returnAll) {
    // Fetch all pages
    let currentPage = page;
    tags.push(...currentPage.items);

    while (currentPage.hasNextPage) {
      currentPage = await currentPage.nextPage();
      tags.push(...currentPage.items);
    }
  }

  return tags.map((tag) => ({
    id: tag.id,
    name: tag.name,
    color: tag.color,
    teamId: tag.teamId,
    archived: tag.archived,
    created: tag.created,
    lastUpdate: tag.lastUpdate,
  }));
}
