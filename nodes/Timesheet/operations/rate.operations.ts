import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import type { RateResponseData, ExtendedRate } from '../types';

/**
 * Create a new rate
 */
export async function createRate(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<RateResponseData> {
  const title = this.getNodeParameter('title', itemIndex) as string;
  const factor = this.getNodeParameter('factor', itemIndex) as number;
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

  // Extract teamId from resourceLocator if present
  const teamIdField = additionalFields.teamId as IDataObject | string | undefined;
  const teamId =
    teamIdField && typeof teamIdField === 'object' ? (teamIdField.value as string) : teamIdField;

  const createData = {
    title,
    factor,
    extra: additionalFields.extra as number | undefined,
    enabled: additionalFields.enabled as boolean | undefined,
    archived: additionalFields.archived as boolean | undefined,
    teamId,
  };

  const rate = await client.getClient().rates.create(createData);
  const extendedRate = rate;

  return {
    id: rate.id,
    title: rate.title,
    factor: rate.factor,
    extra: rate.extra,
    enabled: rate.enabled,
    archived: rate.archived,
    teamId: extendedRate.team?.id,
    created: rate.created,
    lastUpdate: rate.lastUpdate,
  };
}

/**
 * Get a rate by ID
 */
export async function getRate(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<RateResponseData> {
  const rateId = this.getNodeParameter('rateId', itemIndex) as string;

  const rate = await client.getClient().rates.get(rateId);
  const extendedRate = rate;

  return {
    id: rate.id,
    title: rate.title,
    factor: rate.factor,
    extra: rate.extra,
    enabled: rate.enabled,
    archived: rate.archived,
    teamId: extendedRate.team?.id,
    created: rate.created,
    lastUpdate: rate.lastUpdate,
  };
}

/**
 * Update a rate
 */
export async function updateRate(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<RateResponseData> {
  const rateId = this.getNodeParameter('rateId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const updateData = {
    title: updateFields.title as string | undefined,
    factor: updateFields.factor as number | undefined,
    extra: updateFields.extra as number | undefined,
    enabled: updateFields.enabled as boolean | undefined,
    archived: updateFields.archived as boolean | undefined,
    deleted: updateFields.deleted as boolean | undefined,
  };

  const rate = await client.getClient().rates.update(rateId, updateData);
  const extendedRate = rate;

  return {
    id: rate.id,
    title: rate.title,
    factor: rate.factor,
    extra: rate.extra,
    enabled: rate.enabled,
    archived: rate.archived,
    teamId: extendedRate.team?.id,
    created: rate.created,
    lastUpdate: rate.lastUpdate,
  };
}

/**
 * Delete a rate
 */
export async function deleteRate(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<{ success: boolean; id: string }> {
  const rateId = this.getNodeParameter('rateId', itemIndex) as string;

  await client.getClient().rates.delete(rateId);

  return {
    success: true,
    id: rateId,
  };
}

/**
 * Get many rates with optional filters and pagination
 */
export async function getManyRates(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<RateResponseData[]> {
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

  const page = await client.getClient().rates.search(params);

  // Handle pagination manually to respect limit
  const rates: ExtendedRate[] = returnAll ? [] : page.items.slice(0, params.limit);

  if (returnAll) {
    // Fetch all pages
    let currentPage = page;
    rates.push(...currentPage.items);

    while (currentPage.hasNextPage) {
      currentPage = await currentPage.nextPage();
      rates.push(...currentPage.items);
    }
  }

  return rates.map(
    (rate): RateResponseData => ({
      id: rate.id,
      title: rate.title,
      factor: rate.factor,
      extra: rate.extra,
      enabled: rate.enabled,
      archived: rate.archived,
      teamId: rate.team?.id,
      created: rate.created,
      lastUpdate: rate.lastUpdate,
    }),
  );
}
