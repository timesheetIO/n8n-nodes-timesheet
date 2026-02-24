import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import type { TimerResponseData } from '../types';
import { normalizeDateTime } from '../helpers/dateTimeHelper';

/**
 * Timer operation handlers
 */

export async function startTimer(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TimerResponseData> {
  const projectIdField = this.getNodeParameter('projectId', itemIndex, {}) as IDataObject | string;
  const projectId =
    typeof projectIdField === 'object' && projectIdField.value
      ? (projectIdField.value as string)
      : (projectIdField as string);
  const startDateTime = this.getNodeParameter('startDateTime', itemIndex, '') as string;

  const params = {
    projectId,
    startDateTime: normalizeDateTime(startDateTime),
  };

  const timer = await client.getClient().timer.start(params);

  return {
    status: timer.status,
    projectId: timer.task?.project?.id,
    projectTitle: timer.task?.project?.title,
    duration: timer.task?.duration || 0,
    startDateTime: timer.task?.startDateTime,
  };
}

export async function stopTimer(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TimerResponseData> {
  const endDateTime = this.getNodeParameter('endDateTime', itemIndex, '') as string;

  const params = endDateTime ? { endDateTime: normalizeDateTime(endDateTime)! } : undefined;
  const timer = await client.getClient().timer.stop(params);

  const duration = timer.task?.duration || 0;

  return {
    status: timer.status,
    duration,
    projectTitle: timer.task?.project?.title,
  };
}

export async function pauseTimer(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TimerResponseData> {
  const startDateTime = this.getNodeParameter('startDateTime', itemIndex, '') as string;

  const params = startDateTime ? { startDateTime: normalizeDateTime(startDateTime)! } : undefined;
  const timer = await client.getClient().timer.pause(params);

  return {
    status: timer.status,
    projectTitle: timer.task?.project?.title,
    duration: timer.task?.duration || 0,
  };
}

export async function resumeTimer(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TimerResponseData> {
  const endDateTime = this.getNodeParameter('endDateTime', itemIndex, '') as string;

  const params = endDateTime ? { endDateTime: normalizeDateTime(endDateTime)! } : undefined;
  const timer = await client.getClient().timer.resume(params);

  return {
    status: timer.status,
    projectTitle: timer.task?.project?.title,
    duration: timer.task?.duration || 0,
  };
}

export async function getTimerStatus(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  _itemIndex: number,
): Promise<TimerResponseData> {
  const timer = await client.getClient().timer.get();

  const duration = timer.task?.duration || 0;

  return {
    status: timer.status,
    projectId: timer.task?.project?.id,
    projectTitle: timer.task?.project?.title,
    duration,
    startDateTime: timer.task?.startDateTime,
  };
}

export async function updateTimer(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TimerResponseData> {
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

  const updateData = {
    description: additionalFields.description as string | undefined,
    tags: additionalFields.tags as string[] | undefined,
    billable: additionalFields.billable as boolean | undefined,
    location: additionalFields.location as string | undefined,
    locationEnd: additionalFields.locationEnd as string | undefined,
    feeling: additionalFields.feeling as number | undefined,
  };

  const timer = await client.getClient().timer.update(updateData);

  return {
    status: timer.status,
    projectTitle: timer.task?.project?.title,
    duration: timer.task?.duration || 0,
  };
}
