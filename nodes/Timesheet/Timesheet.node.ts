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
import type { Project, Tag, Team, Rate, Organization } from '@timesheet/sdk';

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
import { expenseOperations, expenseFields } from './descriptions/expense.description';
import { noteOperations, noteFields } from './descriptions/note.description';
import { pauseOperations, pauseFields } from './descriptions/pause.description';
import { todoOperations, todoFields } from './descriptions/todo.description';
import { teamOperations, teamFields } from './descriptions/team.description';
import { automationOperations, automationFields } from './descriptions/automation.description';
import {
  organizationOperations,
  organizationFields,
} from './descriptions/organization.description';
import { absenceTypeOperations, absenceTypeFields } from './descriptions/absenceType.description';
import { absenceOperations, absenceFields } from './descriptions/absence.description';
import { contractOperations, contractFields } from './descriptions/contract.description';

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
import * as expenseOps from './operations/expense.operations';
import type { ExpenseResponseData } from './operations/expense.operations';
import * as noteOps from './operations/note.operations';
import type { NoteResponseData } from './operations/note.operations';
import * as pauseOps from './operations/pause.operations';
import type { PauseResponseData } from './operations/pause.operations';
import * as todoOps from './operations/todo.operations';
import type { TodoResponseData } from './operations/todo.operations';
import * as teamOps from './operations/team.operations';
import type { TeamResponseData } from './operations/team.operations';
import * as automationOps from './operations/automation.operations';
import type { AutomationResponseData } from './operations/automation.operations';
import * as organizationOps from './operations/organization.operations';
import type { OrganizationResponseData } from './operations/organization.operations';
import * as absenceTypeOps from './operations/absenceType.operations';
import type { AbsenceTypeResponseData } from './operations/absenceType.operations';
import * as absenceOps from './operations/absence.operations';
import type { AbsenceResponseData } from './operations/absence.operations';
import * as contractOps from './operations/contract.operations';
import type { ContractResponseData } from './operations/contract.operations';

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
  | ExpenseResponseData
  | ExpenseResponseData[]
  | NoteResponseData
  | NoteResponseData[]
  | PauseResponseData
  | PauseResponseData[]
  | TodoResponseData
  | TodoResponseData[]
  | TeamResponseData
  | TeamResponseData[]
  | AutomationResponseData
  | AutomationResponseData[]
  | OrganizationResponseData
  | OrganizationResponseData[]
  | AbsenceTypeResponseData
  | AbsenceTypeResponseData[]
  | AbsenceResponseData
  | AbsenceResponseData[]
  | ContractResponseData
  | ContractResponseData[]
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
          {
            name: 'Expense',
            value: 'expense',
          },
          {
            name: 'Note',
            value: 'note',
          },
          {
            name: 'Pause',
            value: 'pause',
          },
          {
            name: 'Todo',
            value: 'todo',
          },
          {
            name: 'Team',
            value: 'team',
          },
          {
            name: 'Automation',
            value: 'automation',
          },
          {
            name: 'Organization',
            value: 'organization',
          },
          {
            name: 'Absence Type',
            value: 'absenceType',
          },
          {
            name: 'Absence',
            value: 'absence',
          },
          {
            name: 'Contract',
            value: 'contract',
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
      // Expense
      ...expenseOperations,
      ...expenseFields,
      // Note
      ...noteOperations,
      ...noteFields,
      // Pause
      ...pauseOperations,
      ...pauseFields,
      // Todo
      ...todoOperations,
      ...todoFields,
      // Team
      ...teamOperations,
      ...teamFields,
      // Automation
      ...automationOperations,
      ...automationFields,
      // Organization
      ...organizationOperations,
      ...organizationFields,
      // Absence Type
      ...absenceTypeOperations,
      ...absenceTypeFields,
      // Absence
      ...absenceOperations,
      ...absenceFields,
      // Contract
      ...contractOperations,
      ...contractFields,
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

      // Get organizations for dropdowns
      async getOrganizations(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
        try {
          const client = await TimesheetApiClient.fromLoadOptions(this);
          const page = await client.getClient().organizations.list({ limit: 100 });

          return page.items.map((organization: Organization) => ({
            name: organization.name,
            value: organization.id,
          }));
        } catch (error) {
          throw new NodeOperationError(
            this.getNode(),
            `Failed to load organizations: ${error instanceof Error ? error.message : 'Unknown error'}`,
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

      // Search organizations for resource locator
      async searchOrganizations(
        this: ILoadOptionsFunctions,
        filter?: string,
        paginationToken?: string,
      ): Promise<INodeListSearchResult> {
        try {
          const client = await TimesheetApiClient.fromLoadOptions(this);

          const currentPage = paginationToken ? parseInt(paginationToken, 10) : 1;

          const page = await client.getClient().organizations.search({
            page: currentPage,
            limit: 50,
          });

          const filteredOrganizations = filter
            ? page.items.filter((organization: Organization) =>
                organization.name.toLowerCase().includes(filter.toLowerCase()),
              )
            : page.items;

          return {
            results: filteredOrganizations.map((organization: Organization) => ({
              name: organization.name,
              value: organization.id,
            })),
            paginationToken: page.hasNextPage ? String(currentPage + 1) : undefined,
          };
        } catch (error) {
          throw new NodeOperationError(
            this.getNode(),
            `Failed to search organizations: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
        } else if (resource === 'expense') {
          switch (operation) {
            case 'create':
              responseData = await expenseOps.createExpense.call(this, client, i);
              break;
            case 'get':
              responseData = await expenseOps.getExpense.call(this, client, i);
              break;
            case 'update':
              responseData = await expenseOps.updateExpense.call(this, client, i);
              break;
            case 'delete':
              responseData = await expenseOps.deleteExpense.call(this, client, i);
              break;
            case 'getMany':
              responseData = await expenseOps.getManyExpenses.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for expense resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'note') {
          switch (operation) {
            case 'create':
              responseData = await noteOps.createNote.call(this, client, i);
              break;
            case 'get':
              responseData = await noteOps.getNote.call(this, client, i);
              break;
            case 'update':
              responseData = await noteOps.updateNote.call(this, client, i);
              break;
            case 'delete':
              responseData = await noteOps.deleteNote.call(this, client, i);
              break;
            case 'getMany':
              responseData = await noteOps.getManyNotes.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for note resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'pause') {
          switch (operation) {
            case 'create':
              responseData = await pauseOps.createPause.call(this, client, i);
              break;
            case 'get':
              responseData = await pauseOps.getPause.call(this, client, i);
              break;
            case 'update':
              responseData = await pauseOps.updatePause.call(this, client, i);
              break;
            case 'delete':
              responseData = await pauseOps.deletePause.call(this, client, i);
              break;
            case 'getMany':
              responseData = await pauseOps.getManyPauses.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for pause resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'todo') {
          switch (operation) {
            case 'create':
              responseData = await todoOps.createTodo.call(this, client, i);
              break;
            case 'get':
              responseData = await todoOps.getTodo.call(this, client, i);
              break;
            case 'update':
              responseData = await todoOps.updateTodo.call(this, client, i);
              break;
            case 'delete':
              responseData = await todoOps.deleteTodo.call(this, client, i);
              break;
            case 'getMany':
              responseData = await todoOps.getManyTodos.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for todo resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'team') {
          switch (operation) {
            case 'create':
              responseData = await teamOps.createTeam.call(this, client, i);
              break;
            case 'get':
              responseData = await teamOps.getTeam.call(this, client, i);
              break;
            case 'update':
              responseData = await teamOps.updateTeam.call(this, client, i);
              break;
            case 'delete':
              responseData = await teamOps.deleteTeam.call(this, client, i);
              break;
            case 'getMany':
              responseData = await teamOps.getManyTeams.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for team resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'automation') {
          switch (operation) {
            case 'create':
              responseData = await automationOps.createAutomation.call(this, client, i);
              break;
            case 'get':
              responseData = await automationOps.getAutomation.call(this, client, i);
              break;
            case 'update':
              responseData = await automationOps.updateAutomation.call(this, client, i);
              break;
            case 'delete':
              responseData = await automationOps.deleteAutomation.call(this, client, i);
              break;
            case 'getMany':
              responseData = await automationOps.getManyAutomations.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for automation resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'organization') {
          switch (operation) {
            case 'get':
              responseData = await organizationOps.getOrganization.call(this, client, i);
              break;
            case 'update':
              responseData = await organizationOps.updateOrganization.call(this, client, i);
              break;
            case 'getMany':
              responseData = await organizationOps.getManyOrganizations.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for organization resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'absenceType') {
          switch (operation) {
            case 'create':
              responseData = await absenceTypeOps.createAbsenceType.call(this, client, i);
              break;
            case 'get':
              responseData = await absenceTypeOps.getAbsenceType.call(this, client, i);
              break;
            case 'update':
              responseData = await absenceTypeOps.updateAbsenceType.call(this, client, i);
              break;
            case 'delete':
              responseData = await absenceTypeOps.deleteAbsenceType.call(this, client, i);
              break;
            case 'getMany':
              responseData = await absenceTypeOps.getManyAbsenceTypes.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for absence type resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'absence') {
          switch (operation) {
            case 'create':
              responseData = await absenceOps.createAbsence.call(this, client, i);
              break;
            case 'get':
              responseData = await absenceOps.getAbsence.call(this, client, i);
              break;
            case 'update':
              responseData = await absenceOps.updateAbsence.call(this, client, i);
              break;
            case 'delete':
              responseData = await absenceOps.deleteAbsence.call(this, client, i);
              break;
            case 'getMany':
              responseData = await absenceOps.getManyAbsences.call(this, client, i);
              break;
            case 'approve':
              responseData = await absenceOps.approveAbsence.call(this, client, i);
              break;
            case 'reject':
              responseData = await absenceOps.rejectAbsence.call(this, client, i);
              break;
            case 'cancel':
              responseData = await absenceOps.cancelAbsence.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for absence resource`,
                { itemIndex: i },
              );
          }
        } else if (resource === 'contract') {
          switch (operation) {
            case 'create':
              responseData = await contractOps.createContract.call(this, client, i);
              break;
            case 'get':
              responseData = await contractOps.getContract.call(this, client, i);
              break;
            case 'update':
              responseData = await contractOps.updateContract.call(this, client, i);
              break;
            case 'delete':
              responseData = await contractOps.deleteContract.call(this, client, i);
              break;
            case 'getMany':
              responseData = await contractOps.getManyContracts.call(this, client, i);
              break;
            case 'activate':
              responseData = await contractOps.activateContract.call(this, client, i);
              break;
            case 'suspend':
              responseData = await contractOps.suspendContract.call(this, client, i);
              break;
            case 'reactivate':
              responseData = await contractOps.reactivateContract.call(this, client, i);
              break;
            case 'terminate':
              responseData = await contractOps.terminateContract.call(this, client, i);
              break;
            default:
              throw new NodeOperationError(
                this.getNode(),
                `Operation "${operation}" is not supported for contract resource`,
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
