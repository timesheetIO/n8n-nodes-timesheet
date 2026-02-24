import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  INodeExecutionData,
  INodeListSearchResult,
  INodePropertyOptions,
  INodeType,
  INodeTypeDescription,
  IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type { Project, Tag, Team, Rate } from '@timesheet/sdk';

import { TimesheetApiClient } from './helpers/TimesheetApi';
import { mapTimesheetError } from './helpers/errorMapping';
import type {
  TimerResponseData,
  ProjectResponseData,
  TaskResponseData,
  TagResponseData,
  RateResponseData,
  ProfileResponseData,
  SettingsResponseData,
  WebhookResponseData,
  ExportResponseData,
  ExportFieldsResponseData,
  ExportReportTypesResponseData,
  ExportTemplateResponseData,
  DocumentReportResponseData,
  TaskReportResponseData as TaskReportResponse,
  ExpenseReportResponseData,
  NoteReportResponseData,
  PdfResponseData,
  XmlResponseData,
} from './types';

// Import resource descriptions
import { timerOperations, timerFields } from './descriptions/timer.description';
import { projectOperations, projectFields } from './descriptions/project.description';
import { taskOperations, taskFields } from './descriptions/task.description';
import { tagOperations, tagFields } from './descriptions/tag.description';
import { rateOperations, rateFields } from './descriptions/rate.description';
import { profileOperations, profileFields } from './descriptions/profile.description';
import { settingsOperations, settingsFields } from './descriptions/settings.description';
import { webhookOperations, webhookFields } from './descriptions/webhook.description';
import { exportOperations, exportFields } from './descriptions/export.description';
import { reportOperations, reportFields } from './descriptions/report.description';

// Import operation handlers
import * as timerOps from './operations/timer.operations';
import * as projectOps from './operations/project.operations';
import * as taskOps from './operations/task.operations';
import * as tagOps from './operations/tag.operations';
import * as rateOps from './operations/rate.operations';
import * as profileOps from './operations/profile.operations';
import * as settingsOps from './operations/settings.operations';
import * as webhookOps from './operations/webhook.operations';
import * as exportOps from './operations/export.operations';
import * as reportOps from './operations/report.operations';

// Type alias for operation responses
type OperationResponse =
  | TimerResponseData
  | ProjectResponseData
  | ProjectResponseData[]
  | TaskResponseData
  | TaskResponseData[]
  | TagResponseData
  | TagResponseData[]
  | RateResponseData
  | RateResponseData[]
  | ProfileResponseData
  | SettingsResponseData
  | WebhookResponseData
  | WebhookResponseData[]
  | ExportResponseData
  | ExportFieldsResponseData
  | ExportReportTypesResponseData
  | ExportTemplateResponseData
  | ExportTemplateResponseData[]
  | DocumentReportResponseData
  | TaskReportResponse
  | ExpenseReportResponseData
  | NoteReportResponseData
  | PdfResponseData
  | XmlResponseData
  | { success: boolean }
  | IDataObject;

export class Timesheet implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Timesheet',
    name: 'timesheet',
    icon: 'file:timesheet.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
    description: 'Interact with timesheet.io time tracking API',
    defaults: {
      name: 'Timesheet',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'timesheetApi',
        required: true,
        displayOptions: {
          show: {
            authentication: ['apiKey'],
          },
        },
      },
      {
        name: 'timesheetOAuth2Api',
        required: true,
        displayOptions: {
          show: {
            authentication: ['oAuth2'],
          },
        },
      },
      {
        name: 'timesheetOAuth21Api',
        required: true,
        displayOptions: {
          show: {
            authentication: ['oAuth21'],
          },
        },
      },
    ],
    properties: [
      {
        displayName: 'Authentication',
        name: 'authentication',
        type: 'options',
        options: [
          {
            name: 'API Key',
            value: 'apiKey',
          },
          {
            name: 'OAuth2',
            value: 'oAuth2',
          },
          {
            name: 'OAuth 2.1 (PKCE)',
            value: 'oAuth21',
          },
        ],
        default: 'apiKey',
      },
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Timer',
            value: 'timer',
          },
          {
            name: 'Project',
            value: 'project',
          },
          {
            name: 'Task',
            value: 'task',
          },
          {
            name: 'Tag',
            value: 'tag',
          },
          {
            name: 'Rate',
            value: 'rate',
          },
          {
            name: 'Profile',
            value: 'profile',
          },
          {
            name: 'Settings',
            value: 'settings',
          },
          {
            name: 'Webhook',
            value: 'webhook',
          },
          {
            name: 'Export',
            value: 'export',
          },
          {
            name: 'Report',
            value: 'report',
          },
        ],
        default: 'timer',
      },
      // Timer
      ...timerOperations,
      ...timerFields,
      // Project
      ...projectOperations,
      ...projectFields,
      // Task
      ...taskOperations,
      ...taskFields,
      // Tag
      ...tagOperations,
      ...tagFields,
      // Rate
      ...rateOperations,
      ...rateFields,
      // Profile
      ...profileOperations,
      ...profileFields,
      // Settings
      ...settingsOperations,
      ...settingsFields,
      // Webhook
      ...webhookOperations,
      ...webhookFields,
      // Export
      ...exportOperations,
      ...exportFields,
      // Report
      ...reportOperations,
      ...reportFields,
    ],
  };

  methods = {
    loadOptions: {
      // Get projects for dropdowns
      async getProjects(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        try {
          const client = await TimesheetApiClient.fromLoadOptions(this);
          const page = await client.getClient().projects.list({ limit: 100, status: 'active' });

          return page.items.map((project: Project) => ({
            name: project.title,
            value: project.id,
          }));
        } catch (error) {
          throw new NodeOperationError(
            this.getNode(),
            `Failed to load projects: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      },

      // Get tags for dropdowns
      async getTags(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        try {
          const client = await TimesheetApiClient.fromLoadOptions(this);
          const page = await client.getClient().tags.list({ limit: 100 });

          return page.items.map((tag: Tag) => ({
            name: tag.name,
            value: tag.id,
          }));
        } catch (error) {
          throw new NodeOperationError(
            this.getNode(),
            `Failed to load tags: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      },

      // Get teams for dropdowns
      async getTeams(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        try {
          const client = await TimesheetApiClient.fromLoadOptions(this);
          const page = await client.getClient().teams.list({ limit: 100 });

          return page.items.map((team: Team) => ({
            name: team.name,
            value: team.id,
          }));
        } catch (error) {
          throw new NodeOperationError(
            this.getNode(),
            `Failed to load teams: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      },
    },

    listSearch: {
      // Search projects for resource locator
      async searchProjects(
        this: ILoadOptionsFunctions,
        filter?: string,
        paginationToken?: string,
      ): Promise<INodeListSearchResult> {
        try {
          const client = await TimesheetApiClient.fromLoadOptions(this);

          // Parse pagination token to get the current page number (1-based)
          const currentPage = paginationToken ? parseInt(paginationToken, 10) : 1;

          // Use the search method with pagination
          // The SDK returns a NavigablePage which has hasNextPage property
          const page = await client.getClient().projects.search({
            page: currentPage,
            limit: 50,
            status: 'active',
            sort: 'alpha',
            order: 'asc',
          });

          // Filter results by title if filter is provided
          const filteredProjects = filter
            ? page.items.filter((project: Project) =>
                project.title.toLowerCase().includes(filter.toLowerCase()),
              )
            : page.items;

          // Use the SDK's hasNextPage to determine if there are more results
          return {
            results: filteredProjects.map((project: Project) => ({
              name: project.title,
              value: project.id,
              url: `https://my.timesheet.io/projects/show/${project.id}`,
            })),
            paginationToken: page.hasNextPage ? String(currentPage + 1) : undefined,
          };
        } catch (error) {
          throw new NodeOperationError(
            this.getNode(),
            `Failed to search projects: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      },

      // Search teams for resource locator
      async searchTeams(
        this: ILoadOptionsFunctions,
        filter?: string,
        paginationToken?: string,
      ): Promise<INodeListSearchResult> {
        try {
          const client = await TimesheetApiClient.fromLoadOptions(this);

          // Parse pagination token to get the current page number (1-based)
          const currentPage = paginationToken ? parseInt(paginationToken, 10) : 1;

          // Use the search method with pagination
          // The SDK returns a NavigablePage which has hasNextPage property
          const page = await client.getClient().teams.search({
            page: currentPage,
            limit: 50,
            sort: 'alpha',
            order: 'asc',
          });

          // Filter results by name if filter is provided
          const filteredTeams = filter
            ? page.items.filter((team: Team) =>
                team.name.toLowerCase().includes(filter.toLowerCase()),
              )
            : page.items;

          // Use the SDK's hasNextPage to determine if there are more results
          return {
            results: filteredTeams.map((team: Team) => ({
              name: team.name,
              value: team.id,
              url: `https://my.timesheet.io/teams/show/${team.id}`,
            })),
            paginationToken: page.hasNextPage ? String(currentPage + 1) : undefined,
          };
        } catch (error) {
          throw new NodeOperationError(
            this.getNode(),
            `Failed to search teams: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      },

      // Search tags for resource locator
      async searchTags(
        this: ILoadOptionsFunctions,
        filter?: string,
        paginationToken?: string,
      ): Promise<INodeListSearchResult> {
        try {
          const client = await TimesheetApiClient.fromLoadOptions(this);

          // Parse pagination token to get the current page number (1-based)
          const currentPage = paginationToken ? parseInt(paginationToken, 10) : 1;

          // Use the search method with pagination
          // The SDK returns a NavigablePage which has hasNextPage property
          const page = await client.getClient().tags.search({
            page: currentPage,
            limit: 50,
            sort: 'alpha',
            order: 'asc',
          });

          // Filter results by name if filter is provided
          const filteredTags = filter
            ? page.items.filter((tag: Tag) => tag.name.toLowerCase().includes(filter.toLowerCase()))
            : page.items;

          // Use the SDK's hasNextPage to determine if there are more results
          return {
            results: filteredTags.map((tag: Tag) => ({
              name: tag.name,
              value: tag.id,
            })),
            paginationToken: page.hasNextPage ? String(currentPage + 1) : undefined,
          };
        } catch (error) {
          throw new NodeOperationError(
            this.getNode(),
            `Failed to search tags: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      },

      // Search rates for resource locator
      async searchRates(
        this: ILoadOptionsFunctions,
        filter?: string,
        paginationToken?: string,
      ): Promise<INodeListSearchResult> {
        try {
          const client = await TimesheetApiClient.fromLoadOptions(this);

          // Parse pagination token to get the current page number (1-based)
          const currentPage = paginationToken ? parseInt(paginationToken, 10) : 1;

          // Use the search method with pagination
          // The SDK returns a NavigablePage which has hasNextPage property
          const page = await client.getClient().rates.search({
            page: currentPage,
            limit: 50,
            sort: 'alpha',
            order: 'asc',
          });

          // Filter results by title if filter is provided
          const filteredRates = filter
            ? page.items.filter((rate: Rate) =>
                rate.title.toLowerCase().includes(filter.toLowerCase()),
              )
            : page.items;

          // Use the SDK's hasNextPage to determine if there are more results
          return {
            results: filteredRates.map((rate: Rate) => ({
              name: `${rate.title} (${rate.factor}x)`,
              value: rate.id,
            })),
            paginationToken: page.hasNextPage ? String(currentPage + 1) : undefined,
          };
        } catch (error) {
          throw new NodeOperationError(
            this.getNode(),
            `Failed to search rates: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      },
    },
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0);

    for (let i = 0; i < items.length; i++) {
      try {
        const operation = this.getNodeParameter('operation', i);

        // Create API client
        const client = await TimesheetApiClient.fromExecute(this, i);

        let responseData: OperationResponse;

        // Route to appropriate operation handler based on resource
        if (resource === 'timer') {
          switch (operation) {
            case 'start':
              responseData = await timerOps.startTimer.call(this, client, i);
              break;
            case 'stop':
              responseData = await timerOps.stopTimer.call(this, client, i);
              break;
            case 'pause':
              responseData = await timerOps.pauseTimer.call(this, client, i);
              break;
            case 'resume':
              responseData = await timerOps.resumeTimer.call(this, client, i);
              break;
            case 'status':
              responseData = await timerOps.getTimerStatus.call(this, client, i);
              break;
            case 'update':
              responseData = await timerOps.updateTimer.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for timer resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'project') {
          switch (operation) {
            case 'create':
              responseData = await projectOps.createProject.call(this, client, i);
              break;
            case 'get':
              responseData = await projectOps.getProject.call(this, client, i);
              break;
            case 'update':
              responseData = await projectOps.updateProject.call(this, client, i);
              break;
            case 'delete':
              responseData = await projectOps.deleteProject.call(this, client, i);
              break;
            case 'getMany':
              responseData = await projectOps.getManyProjects.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for project resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'task') {
          switch (operation) {
            case 'create':
              responseData = await taskOps.createTask.call(this, client, i);
              break;
            case 'get':
              responseData = await taskOps.getTask.call(this, client, i);
              break;
            case 'update':
              responseData = await taskOps.updateTask.call(this, client, i);
              break;
            case 'delete':
              responseData = await taskOps.deleteTask.call(this, client, i);
              break;
            case 'getMany':
              responseData = await taskOps.getManyTasks.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for task resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'tag') {
          switch (operation) {
            case 'create':
              responseData = await tagOps.createTag.call(this, client, i);
              break;
            case 'get':
              responseData = await tagOps.getTag.call(this, client, i);
              break;
            case 'update':
              responseData = await tagOps.updateTag.call(this, client, i);
              break;
            case 'delete':
              responseData = await tagOps.deleteTag.call(this, client, i);
              break;
            case 'getMany':
              responseData = await tagOps.getManyTags.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for tag resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'rate') {
          switch (operation) {
            case 'create':
              responseData = await rateOps.createRate.call(this, client, i);
              break;
            case 'get':
              responseData = await rateOps.getRate.call(this, client, i);
              break;
            case 'update':
              responseData = await rateOps.updateRate.call(this, client, i);
              break;
            case 'delete':
              responseData = await rateOps.deleteRate.call(this, client, i);
              break;
            case 'getMany':
              responseData = await rateOps.getManyRates.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for rate resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'profile') {
          switch (operation) {
            case 'get':
              responseData = await profileOps.getProfile.call(this, client, i);
              break;
            case 'update':
              responseData = await profileOps.updateProfile.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for profile resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'settings') {
          switch (operation) {
            case 'get':
              responseData = await settingsOps.getSettings.call(this, client, i);
              break;
            case 'update':
              responseData = await settingsOps.updateSettings.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for settings resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'webhook') {
          switch (operation) {
            case 'create':
              responseData = await webhookOps.createWebhook.call(this, client, i);
              break;
            case 'get':
              responseData = await webhookOps.getWebhook.call(this, client, i);
              break;
            case 'update':
              responseData = await webhookOps.updateWebhook.call(this, client, i);
              break;
            case 'delete':
              responseData = await webhookOps.deleteWebhook.call(this, client, i);
              break;
            case 'getMany':
              responseData = await webhookOps.getManyWebhooks.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for webhook resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'export') {
          switch (operation) {
            case 'generate':
              responseData = await exportOps.generateExport.call(this, client, i);
              break;
            case 'send':
              responseData = await exportOps.sendExport.call(this, client, i);
              break;
            case 'generateFromTemplate':
              responseData = await exportOps.generateFromTemplate.call(this, client, i);
              break;
            case 'getFields':
              responseData = await exportOps.getExportFields.call(this, client, i);
              break;
            case 'getReportTypes':
              responseData = await exportOps.getReportTypes.call(this, client, i);
              break;
            case 'listTemplates':
              responseData = await exportOps.listTemplates.call(this, client, i);
              break;
            case 'createTemplate':
              responseData = await exportOps.createTemplate.call(this, client, i);
              break;
            case 'getTemplate':
              responseData = await exportOps.getTemplate.call(this, client, i);
              break;
            case 'updateTemplate':
              responseData = await exportOps.updateTemplate.call(this, client, i);
              break;
            case 'deleteTemplate':
              responseData = await exportOps.deleteTemplate.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for export resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'report') {
          switch (operation) {
            case 'getDocumentReport':
              responseData = await reportOps.getDocumentReport.call(this, client, i);
              break;
            case 'getDocumentPdf':
              responseData = await reportOps.getDocumentPdf.call(this, client, i);
              break;
            case 'getDocumentXml':
              responseData = await reportOps.getDocumentXml.call(this, client, i);
              break;
            case 'getTaskReport':
              responseData = await reportOps.getTaskReport.call(this, client, i);
              break;
            case 'getTaskPdf':
              responseData = await reportOps.getTaskPdf.call(this, client, i);
              break;
            case 'getExpenseReport':
              responseData = await reportOps.getExpenseReport.call(this, client, i);
              break;
            case 'getExpensePdf':
              responseData = await reportOps.getExpensePdf.call(this, client, i);
              break;
            case 'getNoteReport':
              responseData = await reportOps.getNoteReport.call(this, client, i);
              break;
            case 'getNotePdf':
              responseData = await reportOps.getNotePdf.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for report resource`,
                { itemIndex: i },
              );
          }
        } else {
          throw new NodeOperationError(this.getNode(), `Resource "${resource}" is not supported`, {
            itemIndex: i,
          });
        }

        // Handle array responses (getMany operations)
        if (Array.isArray(responseData)) {
          responseData.forEach((item) => {
            returnData.push({
              json: item as unknown as IDataObject,
              pairedItem: { item: i },
            });
          });
        } else {
          returnData.push({
            json: responseData as unknown as IDataObject,
            pairedItem: { item: i },
          });
        }
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({
            json: {
              error: error instanceof Error ? error.message : 'Unknown error',
            },
            pairedItem: { item: i },
          });
          continue;
        }
        // Map error to n8n-friendly format
        mapTimesheetError(error, this.getNode(), i);
      }
    }

    return [returnData];
  }
}
