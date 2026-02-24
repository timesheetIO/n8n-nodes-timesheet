import type { INodeProperties } from 'n8n-workflow';

export const exportOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['export'],
      },
    },
    options: [
      {
        name: 'Generate',
        value: 'generate',
        description: 'Generate a timesheet export (Excel, CSV, or PDF)',
        action: 'Generate an export',
      },
      {
        name: 'Send via Email',
        value: 'send',
        description: 'Generate and send an export via email',
        action: 'Send export via email',
      },
      {
        name: 'Generate from Template',
        value: 'generateFromTemplate',
        description: 'Generate an export using a saved template',
        action: 'Generate export from template',
      },
      {
        name: 'Get Fields',
        value: 'getFields',
        description: 'Get available export fields',
        action: 'Get export fields',
      },
      {
        name: 'Get Report Types',
        value: 'getReportTypes',
        description: 'Get available report types',
        action: 'Get report types',
      },
      {
        name: 'List Templates',
        value: 'listTemplates',
        description: 'Get list of export templates',
        action: 'List export templates',
      },
      {
        name: 'Create Template',
        value: 'createTemplate',
        description: 'Create a new export template',
        action: 'Create export template',
      },
      {
        name: 'Get Template',
        value: 'getTemplate',
        description: 'Get a specific export template',
        action: 'Get export template',
      },
      {
        name: 'Update Template',
        value: 'updateTemplate',
        description: 'Update an export template',
        action: 'Update export template',
      },
      {
        name: 'Delete Template',
        value: 'deleteTemplate',
        description: 'Delete an export template',
        action: 'Delete export template',
      },
    ],
    default: 'generate',
  },
];

export const exportFields: INodeProperties[] = [
  // Generate and Send operations - common fields
  {
    displayName: 'Report Type',
    name: 'reportType',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['export'],
        operation: ['generate', 'send'],
      },
    },
    options: [
      { name: 'Standard (Tasks)', value: 1 },
      { name: 'Detailed', value: 2 },
      { name: 'Summary by Project', value: 3 },
      { name: 'Summary by User', value: 4 },
      { name: 'Summary by Day', value: 5 },
      { name: 'Summary by Week', value: 6 },
      { name: 'Summary by Month', value: 7 },
      { name: 'Expenses', value: 10 },
      { name: 'Notes', value: 11 },
    ],
    default: 1,
    description: 'Type of report to generate',
  },
  {
    displayName: 'Start Date',
    name: 'startDate',
    type: 'dateTime',
    required: true,
    displayOptions: {
      show: {
        resource: ['export'],
        operation: ['generate', 'send', 'generateFromTemplate'],
      },
    },
    default: '',
    description: 'Start date for the export period (YYYY-MM-DD)',
  },
  {
    displayName: 'End Date',
    name: 'endDate',
    type: 'dateTime',
    required: true,
    displayOptions: {
      show: {
        resource: ['export'],
        operation: ['generate', 'send', 'generateFromTemplate'],
      },
    },
    default: '',
    description: 'End date for the export period (YYYY-MM-DD)',
  },
  {
    displayName: 'Format',
    name: 'format',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['export'],
        operation: ['generate', 'send'],
      },
    },
    options: [
      { name: 'Excel (.xlsx)', value: 'xlsx' },
      { name: 'Excel 1904 (.xlsx)', value: 'xlsx1904' },
      { name: 'CSV', value: 'csv' },
      { name: 'PDF', value: 'pdf' },
    ],
    default: 'xlsx',
    description: 'Export file format',
  },

  // Send operation - email field
  {
    displayName: 'Email',
    name: 'email',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['export'],
        operation: ['send'],
      },
    },
    default: '',
    placeholder: 'email@example.com',
    description: 'Email address to send the export to',
  },

  // Generate and Send - additional options
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['export'],
        operation: ['generate', 'send'],
      },
    },
    options: [
      {
        displayName: 'Filename',
        name: 'filename',
        type: 'string',
        default: '',
        description: 'Custom filename for the export',
      },
      {
        displayName: 'Project IDs',
        name: 'projectIds',
        type: 'string',
        default: '',
        description: 'Comma-separated project IDs to filter by',
      },
      {
        displayName: 'Team IDs',
        name: 'teamIds',
        type: 'string',
        default: '',
        description: 'Comma-separated team IDs to filter by',
      },
      {
        displayName: 'User IDs',
        name: 'userIds',
        type: 'string',
        default: '',
        description: 'Comma-separated user IDs to filter by',
      },
      {
        displayName: 'Tag IDs',
        name: 'tagIds',
        type: 'string',
        default: '',
        description: 'Comma-separated tag IDs to filter by',
      },
      {
        displayName: 'Task Type',
        name: 'type',
        type: 'options',
        options: [
          { name: 'All', value: 'all' },
          { name: 'Task', value: 'task' },
          { name: 'Mileage', value: 'mileage' },
          { name: 'Call', value: 'call' },
        ],
        default: 'all',
        description: 'Filter by task type',
      },
      {
        displayName: 'Status Filter',
        name: 'filter',
        type: 'options',
        options: [
          { name: 'All', value: 'all' },
          { name: 'Billable', value: 'billable' },
          { name: 'Not Billable', value: 'notBillable' },
          { name: 'Paid', value: 'paid' },
          { name: 'Unpaid', value: 'unpaid' },
          { name: 'Billed', value: 'billed' },
          { name: 'Outstanding', value: 'outstanding' },
        ],
        default: 'all',
        description: 'Filter by billing/payment status',
      },
      {
        displayName: 'Split Multi-Day Tasks',
        name: 'splitTask',
        type: 'boolean',
        default: false,
        description: 'Whether to split tasks that span multiple days',
      },
      {
        displayName: 'Summarize',
        name: 'summarize',
        type: 'boolean',
        default: false,
        description: 'Whether to summarize the data',
      },
    ],
  },

  // Generate from Template
  {
    displayName: 'Template ID',
    name: 'templateId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['export'],
        operation: ['generateFromTemplate', 'getTemplate', 'updateTemplate', 'deleteTemplate'],
      },
    },
    default: '',
    description: 'ID of the export template',
  },

  // Get Fields
  {
    displayName: 'Scope',
    name: 'scope',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['export'],
        operation: ['getFields'],
      },
    },
    options: [
      { name: 'All', value: 'all' },
      { name: 'Project', value: 'project' },
      { name: 'Team', value: 'team' },
    ],
    default: 'all',
    description: 'Scope of fields to retrieve',
  },

  // List Templates - pagination
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['export'],
        operation: ['listTemplates'],
      },
    },
    default: false,
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['export'],
        operation: ['listTemplates'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 100,
    },
    default: 50,
    description: 'Max number of results to return',
  },

  // Create Template
  {
    displayName: 'Template Name',
    name: 'templateName',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['export'],
        operation: ['createTemplate'],
      },
    },
    default: '',
    description: 'Name for the new template',
  },
  {
    displayName: 'Template Options',
    name: 'templateOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['export'],
        operation: ['createTemplate'],
      },
    },
    options: [
      {
        displayName: 'Report Type',
        name: 'report',
        type: 'options',
        options: [
          { name: 'Standard (Tasks)', value: 1 },
          { name: 'Detailed', value: 2 },
          { name: 'Summary by Project', value: 3 },
          { name: 'Summary by User', value: 4 },
          { name: 'Summary by Day', value: 5 },
          { name: 'Summary by Week', value: 6 },
          { name: 'Summary by Month', value: 7 },
          { name: 'Expenses', value: 10 },
          { name: 'Notes', value: 11 },
        ],
        default: 1,
        description: 'Type of report',
      },
      {
        displayName: 'Format',
        name: 'format',
        type: 'options',
        options: [
          { name: 'Excel (.xlsx)', value: 'xlsx' },
          { name: 'Excel 1904 (.xlsx)', value: 'xlsx1904' },
          { name: 'CSV', value: 'csv' },
          { name: 'PDF', value: 'pdf' },
        ],
        default: 'xlsx',
        description: 'Export format',
      },
      {
        displayName: 'Project IDs',
        name: 'projectIds',
        type: 'string',
        default: '',
        description: 'Comma-separated project IDs',
      },
      {
        displayName: 'Team IDs',
        name: 'teamIds',
        type: 'string',
        default: '',
        description: 'Comma-separated team IDs',
      },
      {
        displayName: 'Status Filter',
        name: 'filter',
        type: 'options',
        options: [
          { name: 'All', value: 'all' },
          { name: 'Billable', value: 'billable' },
          { name: 'Not Billable', value: 'notBillable' },
          { name: 'Paid', value: 'paid' },
          { name: 'Unpaid', value: 'unpaid' },
          { name: 'Billed', value: 'billed' },
          { name: 'Outstanding', value: 'outstanding' },
        ],
        default: 'all',
        description: 'Status filter',
      },
      {
        displayName: 'Split Multi-Day Tasks',
        name: 'splitTask',
        type: 'boolean',
        default: false,
        description: 'Whether to split tasks spanning multiple days',
      },
      {
        displayName: 'Summarize',
        name: 'summarize',
        type: 'boolean',
        default: false,
        description: 'Whether to summarize data',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Default email for sending exports',
      },
      {
        displayName: 'Filename',
        name: 'filename',
        type: 'string',
        default: '',
        description: 'Default filename',
      },
    ],
  },

  // Update Template
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['export'],
        operation: ['updateTemplate'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Updated template name',
      },
      {
        displayName: 'Report Type',
        name: 'report',
        type: 'options',
        options: [
          { name: 'Standard (Tasks)', value: 1 },
          { name: 'Detailed', value: 2 },
          { name: 'Summary by Project', value: 3 },
          { name: 'Summary by User', value: 4 },
          { name: 'Summary by Day', value: 5 },
          { name: 'Summary by Week', value: 6 },
          { name: 'Summary by Month', value: 7 },
          { name: 'Expenses', value: 10 },
          { name: 'Notes', value: 11 },
        ],
        default: 1,
        description: 'Updated report type',
      },
      {
        displayName: 'Format',
        name: 'format',
        type: 'options',
        options: [
          { name: 'Excel (.xlsx)', value: 'xlsx' },
          { name: 'Excel 1904 (.xlsx)', value: 'xlsx1904' },
          { name: 'CSV', value: 'csv' },
          { name: 'PDF', value: 'pdf' },
        ],
        default: 'xlsx',
        description: 'Updated export format',
      },
      {
        displayName: 'Project IDs',
        name: 'projectIds',
        type: 'string',
        default: '',
        description: 'Comma-separated project IDs',
      },
      {
        displayName: 'Team IDs',
        name: 'teamIds',
        type: 'string',
        default: '',
        description: 'Comma-separated team IDs',
      },
      {
        displayName: 'Status Filter',
        name: 'filter',
        type: 'options',
        options: [
          { name: 'All', value: 'all' },
          { name: 'Billable', value: 'billable' },
          { name: 'Not Billable', value: 'notBillable' },
          { name: 'Paid', value: 'paid' },
          { name: 'Unpaid', value: 'unpaid' },
          { name: 'Billed', value: 'billed' },
          { name: 'Outstanding', value: 'outstanding' },
        ],
        default: 'all',
        description: 'Updated status filter',
      },
      {
        displayName: 'Split Multi-Day Tasks',
        name: 'splitTask',
        type: 'boolean',
        default: false,
        description: 'Whether to split tasks spanning multiple days',
      },
      {
        displayName: 'Summarize',
        name: 'summarize',
        type: 'boolean',
        default: false,
        description: 'Whether to summarize data',
      },
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'Updated email for sending exports',
      },
      {
        displayName: 'Filename',
        name: 'filename',
        type: 'string',
        default: '',
        description: 'Updated filename',
      },
    ],
  },
];
