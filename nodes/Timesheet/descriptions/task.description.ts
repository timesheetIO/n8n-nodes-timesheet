import type { INodeProperties } from 'n8n-workflow';

export const taskOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['task'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a time entry',
        action: 'Create a task',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a time entry',
        action: 'Delete a task',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a time entry by ID',
        action: 'Get a task',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get multiple time entries',
        action: 'Get many tasks',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a time entry',
        action: 'Update a task',
      },
    ],
    default: 'getMany',
  },
];

export const taskFields: INodeProperties[] = [
  // Common: Task ID field
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['get', 'update', 'delete'],
      },
    },
    default: '',
    description: 'The ID of the task/time entry',
  },

  // Create operation
  {
    displayName: 'Project',
    name: 'projectId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['create'],
      },
    },
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        placeholder: 'Select a project...',
        typeOptions: {
          searchListMethod: 'searchProjects',
          searchable: true,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'project_id',
      },
    ],
    description: 'The project this task belongs to',
  },
  {
    displayName: 'Start Date Time',
    name: 'startDateTime',
    type: 'dateTime',
    required: true,
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['create'],
      },
    },
    default: '',
    placeholder: '2025-10-28T10:30:00+02:00',
    description:
      'When the work started. Format: yyyy-MM-ddTHH:mm:ssZ (e.g., 2025-10-28T10:30:00+02:00)',
  },
  {
    displayName: 'End Date Time',
    name: 'endDateTime',
    type: 'dateTime',
    required: true,
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['create'],
      },
    },
    default: '',
    placeholder: '2025-10-28T10:30:00+02:00',
    description:
      'When the work ended (must be after start time). Format: yyyy-MM-ddTHH:mm:ssZ (e.g., 2025-10-28T10:30:00+02:00)',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Task description',
        typeOptions: {
          rows: 3,
        },
      },
      {
        displayName: 'Billable',
        name: 'billable',
        type: 'boolean',
        default: false,
        description: 'Whether this task is billable',
      },
    ],
  },

  // Update operation
  {
    displayName: 'Note',
    name: 'notice',
    type: 'notice',
    default: '',
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['update'],
      },
    },
    description:
      'Important: If the task is not running, End Date Time is required and must be after Start Date Time.',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Start Date Time',
        name: 'startDateTime',
        type: 'dateTime',
        default: '',
        placeholder: '2025-10-28T10:30:00+02:00',
        description:
          'Updated start time. Format: yyyy-MM-ddTHH:mm:ssZ (e.g., 2025-10-28T10:30:00+02:00)',
      },
      {
        displayName: 'End Date Time',
        name: 'endDateTime',
        type: 'dateTime',
        default: '',
        placeholder: '2025-10-28T10:30:00+02:00',
        description:
          'Updated end time (required for non-running tasks, must be after start time). Format: yyyy-MM-ddTHH:mm:ssZ (e.g., 2025-10-28T10:30:00+02:00)',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Updated description',
        typeOptions: {
          rows: 3,
        },
      },
      {
        displayName: 'Billable',
        name: 'billable',
        type: 'boolean',
        default: false,
        description: 'Updated billable status',
      },
      {
        displayName: 'Paid',
        name: 'paid',
        type: 'boolean',
        default: false,
        description: 'Mark as paid',
      },
      {
        displayName: 'Billed',
        name: 'billed',
        type: 'boolean',
        default: false,
        description: 'Mark as billed',
      },
    ],
  },

  // Get Many operation
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['getMany'],
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
        resource: ['task'],
        operation: ['getMany'],
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
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['task'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Project',
        name: 'projectId',
        type: 'resourceLocator',
        default: { mode: 'list', value: '' },
        modes: [
          {
            displayName: 'From List',
            name: 'list',
            type: 'list',
            placeholder: 'Select a project...',
            typeOptions: {
              searchListMethod: 'searchProjects',
              searchable: true,
            },
          },
          {
            displayName: 'By ID',
            name: 'id',
            type: 'string',
            placeholder: 'project_id',
          },
        ],
        description: 'Filter by project',
      },
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'dateTime',
        default: '',
        placeholder: '2025-10-28T10:30:00+02:00',
        description:
          'Filter tasks starting on or after this date. Format: yyyy-MM-ddTHH:mm:ssZ (e.g., 2025-10-28T10:30:00+02:00)',
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'dateTime',
        default: '',
        placeholder: '2025-10-28T10:30:00+02:00',
        description:
          'Filter tasks ending on or before this date. Format: yyyy-MM-ddTHH:mm:ssZ (e.g., 2025-10-28T10:30:00+02:00)',
      },
      {
        displayName: 'Billing Status',
        name: 'filter',
        type: 'options',
        options: [
          {
            name: 'All',
            value: 'all',
          },
          {
            name: 'Billable',
            value: 'billable',
          },
          {
            name: 'Not Billable',
            value: 'notBillable',
          },
          {
            name: 'Paid',
            value: 'paid',
          },
          {
            name: 'Unpaid',
            value: 'unpaid',
          },
          {
            name: 'Billed',
            value: 'billed',
          },
          {
            name: 'Outstanding',
            value: 'outstanding',
          },
        ],
        default: 'all',
        description: 'Filter by billing/payment status',
      },
      {
        displayName: 'Sort By',
        name: 'sort',
        type: 'options',
        options: [
          {
            name: 'Date/Time',
            value: 'dateTime',
          },
          {
            name: 'Duration',
            value: 'time',
          },
          {
            name: 'Created Date',
            value: 'created',
          },
        ],
        default: 'dateTime',
        description: 'Sort tasks by field',
      },
      {
        displayName: 'Sort Order',
        name: 'order',
        type: 'options',
        options: [
          {
            name: 'Ascending',
            value: 'asc',
          },
          {
            name: 'Descending',
            value: 'desc',
          },
        ],
        default: 'desc',
        description: 'Sort order',
      },
    ],
  },
];
