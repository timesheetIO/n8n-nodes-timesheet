import type { IExecuteFunctions } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';

/**
 * Team response data
 */
export interface TeamResponseData {
  id: string;
  name?: string;
  description?: string;
  color?: number;
  projects?: number;
  members?: number;
  created?: number;
  lastUpdate?: number;
}

/**
 * Create a new team
 */
export async function createTeam(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TeamResponseData> {
  const name = this.getNodeParameter('name', itemIndex) as string;
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

  const createData = {
    name,
    description: additionalFields.description as string | undefined,
    color: additionalFields.color as number | undefined,
  };

  const team = await client.getClient().teams.create(createData);

  return mapTeam(team);
}

/**
 * Get a team by ID
 */
export async function getTeam(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TeamResponseData> {
  const teamId = this.getNodeParameter('teamId', itemIndex) as string;

  const team = await client.getClient().teams.get(teamId);

  return mapTeam(team);
}

/**
 * Update a team
 */
export async function updateTeam(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TeamResponseData> {
  const teamId = this.getNodeParameter('teamId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const updateData = {
    name: updateFields.name as string | undefined,
    description: updateFields.description as string | undefined,
    color: updateFields.color as number | undefined,
  };

  const team = await client.getClient().teams.update(teamId, updateData);

  return mapTeam(team);
}

/**
 * Delete a team
 */
export async function deleteTeam(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<{ success: boolean; id: string }> {
  const teamId = this.getNodeParameter('teamId', itemIndex) as string;

  await client.getClient().teams.delete(teamId);

  return {
    success: true,
    id: teamId,
  };
}

/**
 * Get many teams with optional filters and pagination
 */
export async function getManyTeams(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TeamResponseData[]> {
  const returnAll = this.getNodeParameter('returnAll', itemIndex, false);
  const filters = this.getNodeParameter('filters', itemIndex, {});

  const params = {
    sort: filters.sort as 'alpha' | 'permission' | 'created' | undefined,
    order: filters.order as 'asc' | 'desc' | undefined,
    limit: returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50),
  };

  const page = await client.getClient().teams.search(params);

  const teams = returnAll ? [] : page.items.slice(0, params.limit);

  if (returnAll) {
    let currentPage = page;
    teams.push(...currentPage.items);

    while (currentPage.hasNextPage) {
      currentPage = await currentPage.nextPage();
      teams.push(...currentPage.items);
    }
  }

  return teams.map(mapTeam);
}

interface RawTeam {
  id: string;
  name?: string;
  description?: string;
  color?: number;
  projects?: number;
  members?: number;
  created?: number;
  lastUpdate?: number;
}

function mapTeam(team: RawTeam): TeamResponseData {
  return {
    id: team.id,
    name: team.name,
    description: team.description,
    color: team.color,
    projects: team.projects,
    members: team.members,
    created: team.created,
    lastUpdate: team.lastUpdate,
  };
}
