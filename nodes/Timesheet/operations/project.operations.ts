import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import type { ProjectResponseData, ExtendedProject } from '../types';

/**
 * Project operation handlers
 */

export async function createProject(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ProjectResponseData> {
  const title = this.getNodeParameter('title', itemIndex) as string;
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

  // Extract teamId from resourceLocator if present
  const teamIdField = additionalFields.teamId as IDataObject | string | undefined;
  const teamId =
    teamIdField && typeof teamIdField === 'object' ? (teamIdField.value as string) : teamIdField;

  const createData = {
    title,
    description: additionalFields.description as string | undefined,
    color: additionalFields.color as number | undefined,
    teamId,
    taskDefaultBillable: additionalFields.taskDefaultBillable as boolean | undefined,
  };

  const project = await client.getClient().projects.create(createData);
  const extendedProject = project as ExtendedProject;

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    color: project.color,
    archived: project.archived,
    teamId: extendedProject.teamId,
  };
}

export async function getProject(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ProjectResponseData> {
  const projectId = this.getNodeParameter('projectId', itemIndex) as string;

  const project = await client.getClient().projects.get(projectId);
  const extendedProject = project as ExtendedProject;

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    color: project.color,
    archived: project.archived,
    teamId: extendedProject.teamId,
  };
}

export async function updateProject(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ProjectResponseData> {
  const projectId = this.getNodeParameter('projectId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const updateData = {
    title: updateFields.title as string | undefined,
    description: updateFields.description as string | undefined,
    color: updateFields.color as number | undefined,
    archived: updateFields.archived as boolean | undefined,
  };

  const project = await client.getClient().projects.update(projectId, updateData);

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    color: project.color,
    archived: project.archived,
  };
}

export async function deleteProject(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<IDataObject> {
  const projectId = this.getNodeParameter('projectId', itemIndex) as string;

  await client.getClient().projects.delete(projectId);

  return {
    success: true,
    id: projectId,
  };
}

export async function getManyProjects(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ProjectResponseData[]> {
  const returnAll = this.getNodeParameter('returnAll', itemIndex, false);
  const filters = this.getNodeParameter('filters', itemIndex, {});

  // Extract teamId from resourceLocator if present
  const teamIdField = filters.teamId as IDataObject | string | undefined;
  const teamId =
    teamIdField && typeof teamIdField === 'object' ? (teamIdField.value as string) : teamIdField;

  const params = {
    teamId,
    status: filters.status as 'all' | 'active' | 'inactive' | undefined,
    sort: filters.sort as
      | 'alpha'
      | 'alphaNum'
      | 'client'
      | 'duration'
      | 'created'
      | 'status'
      | undefined,
    order: filters.order as 'asc' | 'desc' | undefined,
    statistics: true, // Include statistics for duration data
    limit: returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50),
  };

  const page = await client.getClient().projects.list(params);

  const projects: ExtendedProject[] = returnAll ? [] : page.items.slice(0, params.limit);

  if (returnAll) {
    let currentPage = page;
    projects.push(...currentPage.items);

    while (currentPage.hasNextPage) {
      currentPage = await currentPage.nextPage();
      projects.push(...currentPage.items);
    }
  }

  return projects.map(
    (project): ProjectResponseData => ({
      id: project.id,
      title: project.title,
      description: project.description,
      color: project.color,
      archived: project.archived,
      teamId: project.teamId,
    }),
  );
}
