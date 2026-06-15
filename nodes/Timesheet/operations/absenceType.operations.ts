import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';

/**
 * Absence type response data
 */
export interface AbsenceTypeResponseData {
  id: string;
  organizationId?: string;
  code?: string;
  name?: string;
  description?: string;
  color?: number;
  paid?: boolean;
  requiresApproval?: boolean;
  requiresDocumentation?: boolean;
  deductsFromQuota?: boolean;
  affectsOvertime?: boolean;
  active?: boolean;
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
 * Create a new absence type
 */
export async function createAbsenceType(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AbsenceTypeResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const code = this.getNodeParameter('code', itemIndex) as string;
  const name = this.getNodeParameter('name', itemIndex) as string;
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

  const createData = {
    code,
    name,
    description: additionalFields.description as string | undefined,
    color: additionalFields.color as number | undefined,
    paid: additionalFields.paid as boolean | undefined,
    requiresApproval: additionalFields.requiresApproval as boolean | undefined,
    requiresDocumentation: additionalFields.requiresDocumentation as boolean | undefined,
    deductsFromQuota: additionalFields.deductsFromQuota as boolean | undefined,
    affectsOvertime: additionalFields.affectsOvertime as boolean | undefined,
  };

  const absenceType = await client.getClient().absenceTypes.create(organizationId, createData);

  return mapAbsenceType(absenceType);
}

/**
 * Get an absence type by ID
 */
export async function getAbsenceType(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AbsenceTypeResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const absenceTypeId = this.getNodeParameter('absenceTypeId', itemIndex) as string;

  const absenceType = await client.getClient().absenceTypes.get(organizationId, absenceTypeId);

  return mapAbsenceType(absenceType);
}

/**
 * Update an absence type
 */
export async function updateAbsenceType(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AbsenceTypeResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const absenceTypeId = this.getNodeParameter('absenceTypeId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const updateData = {
    code: updateFields.code as string | undefined,
    name: updateFields.name as string | undefined,
    description: updateFields.description as string | undefined,
    color: updateFields.color as number | undefined,
    paid: updateFields.paid as boolean | undefined,
    requiresApproval: updateFields.requiresApproval as boolean | undefined,
    requiresDocumentation: updateFields.requiresDocumentation as boolean | undefined,
    deductsFromQuota: updateFields.deductsFromQuota as boolean | undefined,
    affectsOvertime: updateFields.affectsOvertime as boolean | undefined,
  };

  const absenceType = await client
    .getClient()
    .absenceTypes.update(organizationId, absenceTypeId, updateData);

  return mapAbsenceType(absenceType);
}

/**
 * Delete an absence type
 */
export async function deleteAbsenceType(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<{ success: boolean; id: string }> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const absenceTypeId = this.getNodeParameter('absenceTypeId', itemIndex) as string;

  await client.getClient().absenceTypes.delete(organizationId, absenceTypeId);

  return {
    success: true,
    id: absenceTypeId,
  };
}

/**
 * Get many absence types with pagination
 */
export async function getManyAbsenceTypes(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<AbsenceTypeResponseData[]> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const returnAll = this.getNodeParameter('returnAll', itemIndex, false);

  const params = {
    limit: returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50),
  };

  const page = await client.getClient().absenceTypes.list(organizationId, params);

  const absenceTypes = returnAll ? [] : page.items.slice(0, params.limit);

  if (returnAll) {
    let currentPage = page;
    absenceTypes.push(...currentPage.items);

    while (currentPage.hasNextPage) {
      currentPage = await currentPage.nextPage();
      absenceTypes.push(...currentPage.items);
    }
  }

  return absenceTypes.map(mapAbsenceType);
}

interface RawAbsenceType {
  id: string;
  organizationId?: string;
  code?: string;
  name?: string;
  description?: string;
  color?: number;
  paid?: boolean;
  requiresApproval?: boolean;
  requiresDocumentation?: boolean;
  deductsFromQuota?: boolean;
  affectsOvertime?: boolean;
  active?: boolean;
  created?: number;
  lastUpdate?: number;
}

function mapAbsenceType(absenceType: RawAbsenceType): AbsenceTypeResponseData {
  return {
    id: absenceType.id,
    organizationId: absenceType.organizationId,
    code: absenceType.code,
    name: absenceType.name,
    description: absenceType.description,
    color: absenceType.color,
    paid: absenceType.paid,
    requiresApproval: absenceType.requiresApproval,
    requiresDocumentation: absenceType.requiresDocumentation,
    deductsFromQuota: absenceType.deductsFromQuota,
    affectsOvertime: absenceType.affectsOvertime,
    active: absenceType.active,
    created: absenceType.created,
    lastUpdate: absenceType.lastUpdate,
  };
}
