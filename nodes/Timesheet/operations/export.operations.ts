import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import type {
  ExportResponseData,
  ExportFieldsResponseData,
  ExportReportTypesResponseData,
  ExportTemplateResponseData,
} from '../types';
import type { ExportFormat, ExportTemplate } from '@timesheet/sdk';

/**
 * Export operation handlers
 */

// Helper to convert comma-separated string to array
function parseIdList(value: string | undefined): string[] | undefined {
  if (!value || value.trim() === '') return undefined;
  return value.split(',').map((id) => id.trim());
}

// Helper to convert date to YYYY-MM-DD format
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

export async function generateExport(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ExportResponseData> {
  const reportType = this.getNodeParameter('reportType', itemIndex) as number;
  const startDate = this.getNodeParameter('startDate', itemIndex) as string;
  const endDate = this.getNodeParameter('endDate', itemIndex) as string;
  const format = this.getNodeParameter('format', itemIndex, 'xlsx') as ExportFormat;
  const additionalOptions = this.getNodeParameter(
    'additionalOptions',
    itemIndex,
    {},
  ) as IDataObject;

  const params = {
    report: reportType,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    format,
    filename: additionalOptions.filename as string | undefined,
    projectIds: parseIdList(additionalOptions.projectIds as string | undefined),
    teamIds: parseIdList(additionalOptions.teamIds as string | undefined),
    userIds: parseIdList(additionalOptions.userIds as string | undefined),
    tagIds: parseIdList(additionalOptions.tagIds as string | undefined),
    type: additionalOptions.type as string | undefined,
    filter: additionalOptions.filter as string | undefined,
    splitTask: additionalOptions.splitTask as boolean | undefined,
    summarize: additionalOptions.summarize as boolean | undefined,
  };

  const result = await client.getClient().reports.export.generate(params);

  return {
    url: result.url,
  };
}

export async function sendExport(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<IDataObject> {
  const reportType = this.getNodeParameter('reportType', itemIndex) as number;
  const startDate = this.getNodeParameter('startDate', itemIndex) as string;
  const endDate = this.getNodeParameter('endDate', itemIndex) as string;
  const format = this.getNodeParameter('format', itemIndex, 'xlsx') as ExportFormat;
  const email = this.getNodeParameter('email', itemIndex) as string;
  const additionalOptions = this.getNodeParameter(
    'additionalOptions',
    itemIndex,
    {},
  ) as IDataObject;

  const params = {
    report: reportType,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    format,
    email,
    filename: additionalOptions.filename as string | undefined,
    projectIds: parseIdList(additionalOptions.projectIds as string | undefined),
    teamIds: parseIdList(additionalOptions.teamIds as string | undefined),
    userIds: parseIdList(additionalOptions.userIds as string | undefined),
    tagIds: parseIdList(additionalOptions.tagIds as string | undefined),
    type: additionalOptions.type as string | undefined,
    filter: additionalOptions.filter as string | undefined,
    splitTask: additionalOptions.splitTask as boolean | undefined,
    summarize: additionalOptions.summarize as boolean | undefined,
  };

  await client.getClient().reports.export.send(params);

  return {
    success: true,
    email,
    message: `Export sent to ${email}`,
  };
}

export async function generateFromTemplate(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<IDataObject> {
  const templateId = this.getNodeParameter('templateId', itemIndex) as string;
  const startDate = this.getNodeParameter('startDate', itemIndex) as string;
  const endDate = this.getNodeParameter('endDate', itemIndex) as string;

  const params = {
    templateId,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };

  const data = await client.getClient().reports.export.generateFromTemplate(params);

  // Convert ArrayBuffer to base64 for transport
  const base64Data = Buffer.from(data).toString('base64');

  return {
    success: true,
    templateId,
    data: base64Data,
    dataType: 'base64',
    message: 'Export generated from template. Data is base64 encoded.',
  };
}

export async function getExportFields(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ExportFieldsResponseData> {
  const scope = this.getNodeParameter('scope', itemIndex, 'all') as 'all' | 'project' | 'team';

  // The API has no 'all' scope; omitting the scope returns every field.
  const result = await client
    .getClient()
    .reports.export.getFields(scope === 'all' ? undefined : scope);

  return {
    fields: result.fields.map((field) => ({
      id: field.fieldId,
      name: field.name,
      description: field.description,
      type: field.type,
      category: field.category,
      scope: field.scope,
      defaultEnabled: field.defaultEnabled,
      defaultPosition: field.defaultPosition,
    })),
  };
}

export async function getReportTypes(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  _itemIndex: number,
): Promise<ExportReportTypesResponseData> {
  const result = await client.getClient().reports.export.getReportTypes();

  return {
    reports: result.items.map((report) => ({
      id: report.id,
      name: report.name,
      acceptsCustomFields: report.acceptFields,
      fieldScope: report.fieldScope,
      dataCategory: report.dataCategory,
    })),
  };
}

export async function listTemplates(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ExportTemplateResponseData[]> {
  const returnAll = this.getNodeParameter('returnAll', itemIndex, false);
  const limit = returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50);

  const page = await client.getClient().reports.export.listTemplates({ limit });

  const templates: ExportTemplate[] = returnAll ? await page.toArray() : page.items.slice(0, limit);

  return templates.map(
    (template): ExportTemplateResponseData => ({
      id: template.id,
      name: template.name,
      report: template.report,
      format: template.format,
      filter: template.filter,
      splitTask: template.splitTask,
      summarize: template.summarize,
      email: template.email,
      filename: template.filename,
      projectIds: template.projectIds,
      teamIds: template.teamIds,
      created: template.created,
      lastUpdate: template.lastUpdate,
    }),
  );
}

export async function createTemplate(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ExportTemplateResponseData> {
  const name = this.getNodeParameter('templateName', itemIndex) as string;
  const options = this.getNodeParameter('templateOptions', itemIndex, {}) as IDataObject;

  const createData = {
    name,
    report: options.report as number | undefined,
    format: options.format as string | undefined,
    projectIds: parseIdList(options.projectIds as string | undefined),
    teamIds: parseIdList(options.teamIds as string | undefined),
    filter: options.filter as string | undefined,
    splitTask: options.splitTask as boolean | undefined,
    summarize: options.summarize as boolean | undefined,
    email: options.email as string | undefined,
    filename: options.filename as string | undefined,
  };

  const template = await client.getClient().reports.export.createTemplate(createData);

  return {
    id: template.id,
    name: template.name,
    report: template.report,
    format: template.format,
    filter: template.filter,
    splitTask: template.splitTask,
    summarize: template.summarize,
    email: template.email,
    filename: template.filename,
    projectIds: template.projectIds,
    teamIds: template.teamIds,
    created: template.created,
    lastUpdate: template.lastUpdate,
  };
}

export async function getTemplate(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ExportTemplateResponseData> {
  const templateId = this.getNodeParameter('templateId', itemIndex) as string;

  const template = await client.getClient().reports.export.getTemplate(templateId);

  return {
    id: template.id,
    name: template.name,
    report: template.report,
    format: template.format,
    filter: template.filter,
    splitTask: template.splitTask,
    summarize: template.summarize,
    email: template.email,
    filename: template.filename,
    projectIds: template.projectIds,
    teamIds: template.teamIds,
    created: template.created,
    lastUpdate: template.lastUpdate,
  };
}

export async function updateTemplate(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ExportTemplateResponseData> {
  const templateId = this.getNodeParameter('templateId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const updateData = {
    name: updateFields.name as string | undefined,
    report: updateFields.report as number | undefined,
    format: updateFields.format as string | undefined,
    projectIds: parseIdList(updateFields.projectIds as string | undefined),
    teamIds: parseIdList(updateFields.teamIds as string | undefined),
    filter: updateFields.filter as string | undefined,
    splitTask: updateFields.splitTask as boolean | undefined,
    summarize: updateFields.summarize as boolean | undefined,
    email: updateFields.email as string | undefined,
    filename: updateFields.filename as string | undefined,
  };

  const template = await client.getClient().reports.export.updateTemplate(templateId, updateData);

  return {
    id: template.id,
    name: template.name,
    report: template.report,
    format: template.format,
    filter: template.filter,
    splitTask: template.splitTask,
    summarize: template.summarize,
    email: template.email,
    filename: template.filename,
    projectIds: template.projectIds,
    teamIds: template.teamIds,
    created: template.created,
    lastUpdate: template.lastUpdate,
  };
}

export async function deleteTemplate(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<IDataObject> {
  const templateId = this.getNodeParameter('templateId', itemIndex) as string;

  await client.getClient().reports.export.deleteTemplate(templateId);

  return {
    success: true,
    id: templateId,
  };
}
