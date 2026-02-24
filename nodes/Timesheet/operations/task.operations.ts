import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import type { TaskResponseData, ExtendedTask } from '../types';
import { normalizeDateTime } from '../helpers/dateTimeHelper';

/**
 * Task operation handlers
 */

export async function createTask(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TaskResponseData> {
  const projectIdField = this.getNodeParameter('projectId', itemIndex, {}) as IDataObject | string;
  const projectId =
    typeof projectIdField === 'object' && projectIdField.value
      ? (projectIdField.value as string)
      : (projectIdField as string);
  const startDateTime = this.getNodeParameter('startDateTime', itemIndex) as string;
  const endDateTime = this.getNodeParameter('endDateTime', itemIndex) as string;
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

  const normalizedStartDateTime = normalizeDateTime(startDateTime)!;
  const normalizedEndDateTime = normalizeDateTime(endDateTime)!;

  // Validate that endDateTime is after startDateTime
  const startDate = new Date(normalizedStartDateTime);
  const endDate = new Date(normalizedEndDateTime);

  if (endDate <= startDate) {
    throw new Error('End Date Time must be after Start Date Time');
  }

  const createData = {
    projectId,
    startDateTime: normalizedStartDateTime,
    endDateTime: normalizedEndDateTime,
    description: additionalFields.description as string | undefined,
    billable: additionalFields.billable as boolean | undefined,
  };

  const task = await client.getClient().tasks.create(createData);
  const extendedTask = task as ExtendedTask;

  const duration = extendedTask.duration || 0;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);

  return {
    id: task.id,
    projectId: extendedTask.project?.id,
    projectTitle: extendedTask.project?.title,
    description: extendedTask.description,
    startDateTime: extendedTask.startDateTime,
    endDateTime: extendedTask.endDateTime,
    duration,
    hours,
    minutes,
    billable: extendedTask.billable,
  };
}

export async function getTask(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TaskResponseData> {
  const taskId = this.getNodeParameter('taskId', itemIndex) as string;

  const task = await client.getClient().tasks.get(taskId);
  const extendedTask = task as ExtendedTask;

  const duration = extendedTask.duration || 0;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);

  return {
    id: task.id,
    projectId: extendedTask.project?.id,
    projectTitle: extendedTask.project?.title,
    description: extendedTask.description,
    startDateTime: extendedTask.startDateTime,
    endDateTime: extendedTask.endDateTime,
    duration,
    hours,
    minutes,
    billable: extendedTask.billable,
    paid: extendedTask.paid,
    billed: extendedTask.billed,
    tags: extendedTask.tags,
  };
}

export async function updateTask(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TaskResponseData> {
  const taskId = this.getNodeParameter('taskId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const normalizedStartDateTime = normalizeDateTime(
    updateFields.startDateTime as string | undefined,
  );
  const normalizedEndDateTime = normalizeDateTime(updateFields.endDateTime as string | undefined);

  // Validate that if both startDateTime and endDateTime are provided, endDateTime must be after startDateTime
  if (normalizedStartDateTime && normalizedEndDateTime) {
    const startDate = new Date(normalizedStartDateTime);
    const endDate = new Date(normalizedEndDateTime);

    if (endDate <= startDate) {
      throw new Error('End Date Time must be after Start Date Time');
    }
  }

  const updateData = {
    startDateTime: normalizedStartDateTime,
    endDateTime: normalizedEndDateTime,
    description: updateFields.description as string | undefined,
    billable: updateFields.billable as boolean | undefined,
    billed: updateFields.billed as boolean | undefined,
    paid: updateFields.paid as boolean | undefined,
  };

  const task = await client.getClient().tasks.update(taskId, updateData);
  const extendedTask = task as ExtendedTask;

  const duration = extendedTask.duration || 0;
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);

  return {
    id: task.id,
    projectTitle: extendedTask.project?.title,
    description: extendedTask.description,
    startDateTime: extendedTask.startDateTime,
    endDateTime: extendedTask.endDateTime,
    duration,
    hours,
    minutes,
    billable: extendedTask.billable,
  };
}

export async function deleteTask(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<IDataObject> {
  const taskId = this.getNodeParameter('taskId', itemIndex) as string;

  await client.getClient().tasks.delete(taskId);

  return {
    success: true,
    id: taskId,
  };
}

export async function getManyTasks(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TaskResponseData[]> {
  const returnAll = this.getNodeParameter('returnAll', itemIndex, false);
  const filters = this.getNodeParameter('filters', itemIndex, {});

  // Extract project ID from resource locator if present
  const projectIdField = filters.projectId as IDataObject | string | undefined;
  const projectId =
    projectIdField && typeof projectIdField === 'object'
      ? (projectIdField.value as string)
      : projectIdField;

  const params = {
    projectId,
    startDate: normalizeDateTime(filters.startDate as string | undefined),
    endDate: normalizeDateTime(filters.endDate as string | undefined),
    running: filters.running as boolean | undefined,
    sort: filters.sort as 'dateTime' | 'time' | 'created' | undefined,
    order: filters.order as 'asc' | 'desc' | undefined,
    populateTags: true,
    limit: returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50),
  };

  const page = await client.getClient().tasks.search(params);

  // IMPORTANT: Use page.items directly to avoid fetching all pages
  const tasks: ExtendedTask[] = returnAll ? [] : page.items.slice(0, params.limit as number);

  if (returnAll) {
    // Manual pagination for returnAll
    let currentPage = 1;
    let hasMore = true;
    tasks.push(...page.items);

    while (hasMore && page.params?.count && tasks.length < page.params.count) {
      currentPage++;
      const nextPage = await client.getClient().tasks.search({
        ...params,
        page: currentPage,
      });
      tasks.push(...nextPage.items);
      hasMore = nextPage.items.length > 0;
    }
  }

  return tasks.map((task): TaskResponseData => {
    const duration = task.duration || 0;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);

    return {
      id: task.id,
      projectId: task.project?.id,
      projectTitle: task.project?.title,
      description: task.description,
      startDateTime: task.startDateTime,
      endDateTime: task.endDateTime,
      duration,
      hours,
      minutes,
      billable: task.billable,
      paid: task.paid,
      billed: task.billed,
      tags: task.tags,
    };
  });
}
