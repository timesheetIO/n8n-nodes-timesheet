import type { IExecuteFunctions } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import { normalizeDateTime } from '../helpers/dateTimeHelper';

/**
 * Pause response data
 */
export interface PauseResponseData {
  id: string;
  taskId?: string;
  description?: string;
  startDateTime?: string;
  endDateTime?: string;
  running?: boolean;
  created?: number;
  lastUpdate?: number;
}

/**
 * Create a new pause
 */
export async function createPause(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<PauseResponseData> {
  const taskId = this.getNodeParameter('taskId', itemIndex) as string;
  const startDateTime = this.getNodeParameter('startDateTime', itemIndex) as string;
  const endDateTime = this.getNodeParameter('endDateTime', itemIndex) as string;
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

  const createData = {
    taskId,
    startDateTime: normalizeDateTime(startDateTime)!,
    endDateTime: normalizeDateTime(endDateTime)!,
    description: additionalFields.description as string | undefined,
  };

  const pause = await client.getClient().pauses.create(createData);

  return mapPause(pause);
}

/**
 * Get a pause by ID
 */
export async function getPause(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<PauseResponseData> {
  const pauseId = this.getNodeParameter('pauseId', itemIndex) as string;

  const pause = await client.getClient().pauses.get(pauseId);

  return mapPause(pause);
}

/**
 * Update a pause
 */
export async function updatePause(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<PauseResponseData> {
  const pauseId = this.getNodeParameter('pauseId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const startDateTime = updateFields.startDateTime as string | undefined;
  const endDateTime = updateFields.endDateTime as string | undefined;
  const updateData = {
    description: updateFields.description as string | undefined,
    startDateTime: startDateTime !== undefined ? normalizeDateTime(startDateTime) : undefined,
    endDateTime: endDateTime !== undefined ? normalizeDateTime(endDateTime) : undefined,
    deleted: updateFields.deleted as boolean | undefined,
  };

  const pause = await client.getClient().pauses.update(pauseId, updateData);

  return mapPause(pause);
}

/**
 * Delete a pause
 */
export async function deletePause(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<{ success: boolean; id: string }> {
  const pauseId = this.getNodeParameter('pauseId', itemIndex) as string;

  await client.getClient().pauses.delete(pauseId);

  return {
    success: true,
    id: pauseId,
  };
}

/**
 * Get many pauses with optional filters and pagination
 */
export async function getManyPauses(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<PauseResponseData[]> {
  const returnAll = this.getNodeParameter('returnAll', itemIndex, false);
  const filters = this.getNodeParameter('filters', itemIndex, {});

  const params = {
    taskId: filters.taskId as string | undefined,
    limit: returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50),
  };

  const page = await client.getClient().pauses.search(params);

  const pauses = returnAll ? [] : page.items.slice(0, params.limit);

  if (returnAll) {
    let currentPage = page;
    pauses.push(...currentPage.items);

    while (currentPage.hasNextPage) {
      currentPage = await currentPage.nextPage();
      pauses.push(...currentPage.items);
    }
  }

  return pauses.map(mapPause);
}

interface RawPause {
  id: string;
  description?: string;
  startDateTime?: string;
  endDateTime?: string;
  running?: boolean;
  created?: number;
  lastUpdate?: number;
  task?: { id: string };
}

function mapPause(pause: RawPause): PauseResponseData {
  return {
    id: pause.id,
    taskId: pause.task?.id,
    description: pause.description,
    startDateTime: pause.startDateTime,
    endDateTime: pause.endDateTime,
    running: pause.running,
    created: pause.created,
    lastUpdate: pause.lastUpdate,
  };
}
