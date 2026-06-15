import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';

/**
 * Automation response data
 */
export interface AutomationResponseData {
  id: string;
  projectId?: string;
  typeId?: number;
  action?: number;
  enabled?: boolean;
  shared?: boolean;
  name?: string;
  created?: number;
  lastUpdate?: number;
}

/**
 * Create a new automation
 */
export async function createAutomation(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AutomationResponseData> {
  const projectIdField = this.getNodeParameter('projectId', itemIndex, {}) as IDataObject | string;
  const projectId =
    typeof projectIdField === 'object' && projectIdField.value
      ? (projectIdField.value as string)
      : (projectIdField as string);
  const typeId = this.getNodeParameter('typeId', itemIndex) as number;
  const action = this.getNodeParameter('action', itemIndex) as number;
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

  const createData = {
    projectId,
    typeId: typeId as 0 | 1 | 2,
    action: action as 0 | 1 | 2,
    enabled: additionalFields.enabled as boolean | undefined,
    shared: additionalFields.shared as boolean | undefined,
    address: additionalFields.address as string | undefined,
    latitude: additionalFields.latitude as number | undefined,
    longitude: additionalFields.longitude as number | undefined,
    radius: additionalFields.radius as number | undefined,
    ssid: additionalFields.ssid as string | undefined,
    beaconUUID: additionalFields.beaconUUID as string | undefined,
  };

  const automation = await client.getClient().automations.create(createData);

  return mapAutomation(automation);
}

/**
 * Get an automation by ID
 */
export async function getAutomation(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AutomationResponseData> {
  const automationId = this.getNodeParameter('automationId', itemIndex) as string;

  const automation = await client.getClient().automations.get(automationId);

  return mapAutomation(automation);
}

/**
 * Update an automation
 */
export async function updateAutomation(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AutomationResponseData> {
  const automationId = this.getNodeParameter('automationId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const updateData = {
    enabled: updateFields.enabled as boolean | undefined,
    shared: updateFields.shared as boolean | undefined,
    address: updateFields.address as string | undefined,
    latitude: updateFields.latitude as number | undefined,
    longitude: updateFields.longitude as number | undefined,
    radius: updateFields.radius as number | undefined,
    ssid: updateFields.ssid as string | undefined,
    beaconUUID: updateFields.beaconUUID as string | undefined,
  };

  const automation = await client.getClient().automations.update(automationId, updateData);

  return mapAutomation(automation);
}

/**
 * Delete an automation
 */
export async function deleteAutomation(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<{ success: boolean; id: string }> {
  const automationId = this.getNodeParameter('automationId', itemIndex) as string;

  await client.getClient().automations.delete(automationId);

  return {
    success: true,
    id: automationId,
  };
}

/**
 * Get many automations with optional filters and pagination
 */
export async function getManyAutomations(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AutomationResponseData[]> {
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
    status: filters.status as 'enabled' | 'disabled' | undefined,
    limit: returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50),
  };

  const page = await client.getClient().automations.search(params);

  const automations = returnAll ? [] : page.items.slice(0, params.limit);

  if (returnAll) {
    let currentPage = page;
    automations.push(...currentPage.items);

    while (currentPage.hasNextPage) {
      currentPage = await currentPage.nextPage();
      automations.push(...currentPage.items);
    }
  }

  return automations.map(mapAutomation);
}

interface RawAutomation {
  id: string;
  typeId?: number;
  action?: number;
  enabled?: boolean;
  shared?: boolean;
  name?: string;
  created?: number;
  lastUpdate?: number;
  project?: { id: string };
}

function mapAutomation(automation: RawAutomation): AutomationResponseData {
  return {
    id: automation.id,
    projectId: automation.project?.id,
    typeId: automation.typeId,
    action: automation.action,
    enabled: automation.enabled,
    shared: automation.shared,
    name: automation.name,
    created: automation.created,
    lastUpdate: automation.lastUpdate,
  };
}
