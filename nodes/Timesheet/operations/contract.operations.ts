import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import { normalizeDateTime } from '../helpers/dateTimeHelper';

/**
 * Contract response data
 */
export interface ContractResponseData {
  id: string;
  organizationId?: string;
  name?: string;
  status?: string;
  validFrom?: string;
  validTo?: string;
  weeklyHours?: number;
  dailyHours?: number;
  salaryAmount?: number;
  salaryCurrency?: string;
  vacationDaysAnnual?: number;
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
 * Create a new contract
 */
export async function createContract(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ContractResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const name = this.getNodeParameter('name', itemIndex) as string;
  const userId = this.getNodeParameter('userId', itemIndex) as string;
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

  const validFrom = additionalFields.validFrom as string | undefined;
  const validTo = additionalFields.validTo as string | undefined;

  const createData = {
    name,
    userId,
    validFrom: validFrom !== undefined ? normalizeDateTime(validFrom) : undefined,
    validTo: validTo !== undefined ? normalizeDateTime(validTo) : undefined,
    weeklyHours: additionalFields.weeklyHours as number | undefined,
    dailyHours: additionalFields.dailyHours as number | undefined,
    workDays: additionalFields.workDays as string | undefined,
    vacationDaysAnnual: additionalFields.vacationDaysAnnual as number | undefined,
    salaryType: additionalFields.salaryType as string | undefined,
    salaryAmount: additionalFields.salaryAmount as number | undefined,
    salaryCurrency: additionalFields.salaryCurrency as string | undefined,
    overtimeEnabled: additionalFields.overtimeEnabled as boolean | undefined,
  };

  const contract = await client.getClient().contracts.create(organizationId, createData);

  return mapContract(contract);
}

/**
 * Get a contract by ID
 */
export async function getContract(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ContractResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const contractId = this.getNodeParameter('contractId', itemIndex) as string;

  const contract = await client.getClient().contracts.get(organizationId, contractId);

  return mapContract(contract);
}

/**
 * Update a contract
 */
export async function updateContract(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ContractResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const contractId = this.getNodeParameter('contractId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const validFrom = updateFields.validFrom as string | undefined;
  const validTo = updateFields.validTo as string | undefined;

  const updateData = {
    name: updateFields.name as string | undefined,
    validFrom: validFrom !== undefined ? normalizeDateTime(validFrom) : undefined,
    validTo: validTo !== undefined ? normalizeDateTime(validTo) : undefined,
    weeklyHours: updateFields.weeklyHours as number | undefined,
    dailyHours: updateFields.dailyHours as number | undefined,
    workDays: updateFields.workDays as string | undefined,
    vacationDaysAnnual: updateFields.vacationDaysAnnual as number | undefined,
    salaryAmount: updateFields.salaryAmount as number | undefined,
    overtimeEnabled: updateFields.overtimeEnabled as boolean | undefined,
  };

  const contract = await client
    .getClient()
    .contracts.update(organizationId, contractId, updateData);

  return mapContract(contract);
}

/**
 * Delete a contract
 */
export async function deleteContract(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<{ success: boolean; id: string }> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const contractId = this.getNodeParameter('contractId', itemIndex) as string;

  await client.getClient().contracts.delete(organizationId, contractId);

  return {
    success: true,
    id: contractId,
  };
}

/**
 * Get many contracts with optional filters and pagination
 */
export async function getManyContracts(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ContractResponseData[]> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const returnAll = this.getNodeParameter('returnAll', itemIndex, false);
  const filters = this.getNodeParameter('filters', itemIndex, {});

  const params = {
    user: filters.user as string | undefined,
    status: filters.status as string | undefined,
    limit: returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50),
  };

  const page = await client.getClient().contracts.list(organizationId, params);

  const contracts = returnAll ? [] : page.items.slice(0, params.limit);

  if (returnAll) {
    let currentPage = page;
    contracts.push(...currentPage.items);

    while (currentPage.hasNextPage) {
      currentPage = await currentPage.nextPage();
      contracts.push(...currentPage.items);
    }
  }

  return contracts.map(mapContract);
}

/**
 * Activate a contract
 */
export async function activateContract(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ContractResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const contractId = this.getNodeParameter('contractId', itemIndex) as string;

  const contract = await client.getClient().contracts.activate(organizationId, contractId);

  return mapContract(contract);
}

/**
 * Suspend a contract
 */
export async function suspendContract(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ContractResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const contractId = this.getNodeParameter('contractId', itemIndex) as string;

  const contract = await client.getClient().contracts.suspend(organizationId, contractId);

  return mapContract(contract);
}

/**
 * Reactivate a suspended contract
 */
export async function reactivateContract(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ContractResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const contractId = this.getNodeParameter('contractId', itemIndex) as string;

  const contract = await client.getClient().contracts.reactivate(organizationId, contractId);

  return mapContract(contract);
}

/**
 * Terminate a contract
 */
export async function terminateContract(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ContractResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const contractId = this.getNodeParameter('contractId', itemIndex) as string;

  const contract = await client.getClient().contracts.terminate(organizationId, contractId);

  return mapContract(contract);
}

interface RawContract {
  id: string;
  organizationId?: string;
  name?: string;
  status?: string;
  validFrom?: string;
  validTo?: string;
  weeklyHours?: number;
  dailyHours?: number;
  salaryAmount?: number;
  salaryCurrency?: string;
  vacationDaysAnnual?: number;
  created?: number;
  lastUpdate?: number;
}

function mapContract(contract: RawContract): ContractResponseData {
  return {
    id: contract.id,
    organizationId: contract.organizationId,
    name: contract.name,
    status: contract.status,
    validFrom: contract.validFrom,
    validTo: contract.validTo,
    weeklyHours: contract.weeklyHours,
    dailyHours: contract.dailyHours,
    salaryAmount: contract.salaryAmount,
    salaryCurrency: contract.salaryCurrency,
    vacationDaysAnnual: contract.vacationDaysAnnual,
    created: contract.created,
    lastUpdate: contract.lastUpdate,
  };
}
