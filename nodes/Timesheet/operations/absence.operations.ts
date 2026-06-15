import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import { normalizeDateTime } from '../helpers/dateTimeHelper';

/**
 * Absence response data
 */
export interface AbsenceResponseData {
  id: string;
  contractId?: string;
  absenceTypeId?: string;
  startDateTime?: string;
  endDateTime?: string;
  fullDay?: boolean;
  status?: string;
  totalDays?: string;
  reason?: string;
  // Runtime permission flags the API computes for the authenticated user.
  // Branch a workflow on these instead of hard-coding role checks: the node
  // does not gate operations, the API is the source of truth and returns 403
  // when an action is not allowed.
  canApprove?: boolean;
  canReject?: boolean;
  canCancel?: boolean;
  canEdit?: boolean;
  created?: number;
  lastUpdate?: number;
}

/**
 * Extract an ID from a resourceLocator value (object) or a plain string.
 */
function extractId(field: IDataObject | string | undefined): string {
  return field && typeof field === 'object' ? (field.value as string) : (field as string);
}

/**
 * Create a new absence
 */
export async function createAbsence(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AbsenceResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const contractId = this.getNodeParameter('contractId', itemIndex) as string;
  const absenceTypeId = this.getNodeParameter('absenceTypeId', itemIndex) as string;
  const startDateTime = this.getNodeParameter('startDateTime', itemIndex) as string;
  const endDateTime = this.getNodeParameter('endDateTime', itemIndex) as string;
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

  const createData = {
    contractId,
    absenceTypeId,
    startDateTime: normalizeDateTime(startDateTime)!,
    endDateTime: normalizeDateTime(endDateTime)!,
    fullDay: additionalFields.fullDay as boolean | undefined,
    reason: additionalFields.reason as string | undefined,
    documentationUrl: additionalFields.documentationUrl as string | undefined,
  };

  const absence = await client.getClient().absences.create(organizationId, createData);

  return mapAbsence(absence);
}

/**
 * Get an absence by ID
 */
export async function getAbsence(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AbsenceResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const absenceId = this.getNodeParameter('absenceId', itemIndex) as string;

  const absence = await client.getClient().absences.get(organizationId, absenceId);

  return mapAbsence(absence);
}

/**
 * Update an absence
 */
export async function updateAbsence(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AbsenceResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const absenceId = this.getNodeParameter('absenceId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const startDateTime = updateFields.startDateTime as string | undefined;
  const endDateTime = updateFields.endDateTime as string | undefined;
  const updateData = {
    startDateTime: startDateTime !== undefined ? normalizeDateTime(startDateTime) : undefined,
    endDateTime: endDateTime !== undefined ? normalizeDateTime(endDateTime) : undefined,
    fullDay: updateFields.fullDay as boolean | undefined,
    reason: updateFields.reason as string | undefined,
    documentationUrl: updateFields.documentationUrl as string | undefined,
  };

  const absence = await client.getClient().absences.update(organizationId, absenceId, updateData);

  return mapAbsence(absence);
}

/**
 * Delete an absence
 */
export async function deleteAbsence(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<{ success: boolean; id: string }> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const absenceId = this.getNodeParameter('absenceId', itemIndex) as string;

  await client.getClient().absences.delete(organizationId, absenceId);

  return {
    success: true,
    id: absenceId,
  };
}

/**
 * Get many absences with optional filters and pagination
 */
export async function getManyAbsences(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AbsenceResponseData[]> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const returnAll = this.getNodeParameter('returnAll', itemIndex, false);
  const filters = this.getNodeParameter('filters', itemIndex, {});

  const params = {
    contractId: filters.contractId as string | undefined,
    absenceTypeId: filters.absenceTypeId as string | undefined,
    status: filters.status as string | undefined,
    startDate: filters.startDate as string | undefined,
    endDate: filters.endDate as string | undefined,
    limit: returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50),
  };

  const page = await client.getClient().absences.search(organizationId, params);

  const absences = returnAll ? [] : page.items.slice(0, params.limit);

  if (returnAll) {
    let currentPage = page;
    absences.push(...currentPage.items);

    while (currentPage.hasNextPage) {
      currentPage = await currentPage.nextPage();
      absences.push(...currentPage.items);
    }
  }

  return absences.map(mapAbsence);
}

/**
 * Approve an absence
 */
export async function approveAbsence(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AbsenceResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const absenceId = this.getNodeParameter('absenceId', itemIndex) as string;

  const absence = await client.getClient().absences.approve(organizationId, absenceId);

  return mapAbsence(absence);
}

/**
 * Reject an absence
 */
export async function rejectAbsence(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AbsenceResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const absenceId = this.getNodeParameter('absenceId', itemIndex) as string;
  const reason = this.getNodeParameter('reason', itemIndex) as string;

  const absence = await client.getClient().absences.reject(organizationId, absenceId, { reason });

  return mapAbsence(absence);
}

/**
 * Cancel an absence
 */
export async function cancelAbsence(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AbsenceResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const absenceId = this.getNodeParameter('absenceId', itemIndex) as string;
  const reason = this.getNodeParameter('reason', itemIndex) as string;

  const absence = await client.getClient().absences.cancel(organizationId, absenceId, { reason });

  return mapAbsence(absence);
}

interface RawAbsence {
  id: string;
  contractId?: string;
  absenceTypeId?: string;
  startDateTime?: string;
  endDateTime?: string;
  fullDay?: boolean;
  status?: string;
  totalDays?: string;
  reason?: string;
  canApprove?: boolean;
  canReject?: boolean;
  canCancel?: boolean;
  canEdit?: boolean;
  created?: number;
  lastUpdate?: number;
}

function mapAbsence(absence: RawAbsence): AbsenceResponseData {
  return {
    id: absence.id,
    contractId: absence.contractId,
    absenceTypeId: absence.absenceTypeId,
    startDateTime: absence.startDateTime,
    endDateTime: absence.endDateTime,
    fullDay: absence.fullDay,
    status: absence.status,
    totalDays: absence.totalDays,
    reason: absence.reason,
    canApprove: absence.canApprove,
    canReject: absence.canReject,
    canCancel: absence.canCancel,
    canEdit: absence.canEdit,
    created: absence.created,
    lastUpdate: absence.lastUpdate,
  };
}
