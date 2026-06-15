import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';

/**
 * Organization response data
 */
export interface OrganizationResponseData {
  id: string;
  name?: string;
  description?: string;
  color?: number;
  aiChatEnabled?: boolean;
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
 * Get an organization by ID
 */
export async function getOrganization(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<OrganizationResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );

  const organization = await client.getClient().organizations.get(organizationId);

  return mapOrganization(organization);
}

/**
 * Update an organization
 */
export async function updateOrganization(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<OrganizationResponseData> {
  const organizationId = extractId(
    this.getNodeParameter('organizationId', itemIndex) as IDataObject | string,
  );
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const updateData = {
    name: updateFields.name as string | undefined,
    description: updateFields.description as string | undefined,
    color: updateFields.color as number | undefined,
    aiChatEnabled: updateFields.aiChatEnabled as boolean | undefined,
  };

  const organization = await client.getClient().organizations.update(organizationId, updateData);

  return mapOrganization(organization);
}

/**
 * Get many organizations with pagination
 */
export async function getManyOrganizations(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<OrganizationResponseData[]> {
  const returnAll = this.getNodeParameter('returnAll', itemIndex, false);

  const params = {
    limit: returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50),
  };

  const page = await client.getClient().organizations.search(params);

  const organizations = returnAll ? [] : page.items.slice(0, params.limit);

  if (returnAll) {
    let currentPage = page;
    organizations.push(...currentPage.items);

    while (currentPage.hasNextPage) {
      currentPage = await currentPage.nextPage();
      organizations.push(...currentPage.items);
    }
  }

  return organizations.map(mapOrganization);
}

interface RawOrganization {
  id: string;
  name?: string;
  description?: string;
  color?: number;
  aiChatEnabled?: boolean;
  created?: number;
  lastUpdate?: number;
}

function mapOrganization(organization: RawOrganization): OrganizationResponseData {
  return {
    id: organization.id,
    name: organization.name,
    description: organization.description,
    color: organization.color,
    aiChatEnabled: organization.aiChatEnabled,
    created: organization.created,
    lastUpdate: organization.lastUpdate,
  };
}
