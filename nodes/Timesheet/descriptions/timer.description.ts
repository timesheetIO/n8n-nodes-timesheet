import type { INodeProperties } from 'n8n-workflow';

export const timerOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['timer'],
      },
    },
    options: [
      {
        name: 'Start',
        value: 'start',
        description: 'Start tracking time on a project',
        action: 'Start timer',
      },
      {
        name: 'Stop',
        value: 'stop',
        description: 'Stop the currently running timer',
        action: 'Stop timer',
      },
      {
        name: 'Pause',
        value: 'pause',
        description: 'Pause the timer to take a break',
        action: 'Pause timer',
      },
      {
        name: 'Resume',
        value: 'resume',
        description: 'Resume a paused timer',
        action: 'Resume timer',
      },
      {
        name: 'Get Status',
        value: 'status',
        description: 'Get current timer status',
        action: 'Get timer status',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update current timer task details',
        action: 'Update timer',
      },
    ],
    default: 'start',
  },
];

export const timerFields: INodeProperties[] = [
  // Start operation fields
  {
    displayName: 'Project',
    name: 'projectId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['timer'],
        operation: ['start'],
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
        validation: [
          {
            type: 'regex',
            properties: {
              regex: '^[a-zA-Z0-9_-]+$',
              errorMessage: 'Invalid project ID format',
            },
          },
        ],
      },
    ],
    description: 'The project to track time for',
  },
  {
    displayName: 'Start Date Time',
    name: 'startDateTime',
    type: 'dateTime',
    default: '',
    displayOptions: {
      show: {
        resource: ['timer'],
        operation: ['start'],
      },
    },
    placeholder: '2025-10-28T10:30:00+02:00',
    description:
      'When to start the timer (defaults to now if not specified). Format: yyyy-MM-ddTHH:mm:ssZ (e.g., 2025-10-28T10:30:00+02:00)',
  },

  // Stop operation fields
  {
    displayName: 'End Date Time',
    name: 'endDateTime',
    type: 'dateTime',
    default: '',
    displayOptions: {
      show: {
        resource: ['timer'],
        operation: ['stop', 'resume'],
      },
    },
    placeholder: '2025-10-28T10:30:00+02:00',
    description:
      'When to stop/resume the timer (defaults to now if not specified). Format: yyyy-MM-ddTHH:mm:ssZ (e.g., 2025-10-28T10:30:00+02:00)',
  },

  // Pause operation fields
  {
    displayName: 'Pause Start Date Time',
    name: 'startDateTime',
    type: 'dateTime',
    default: '',
    displayOptions: {
      show: {
        resource: ['timer'],
        operation: ['pause'],
      },
    },
    placeholder: '2025-10-28T10:30:00+02:00',
    description:
      'When the pause started (defaults to now if not specified). Format: yyyy-MM-ddTHH:mm:ssZ (e.g., 2025-10-28T10:30:00+02:00)',
  },

  // Status operation fields
  {
    displayName: 'Note',
    name: 'notice',
    type: 'notice',
    default: '',
    displayOptions: {
      show: {
        resource: ['timer'],
        operation: ['status'],
      },
    },
    description:
      'Returns the current timer status including project information, duration, and running state.',
  },

  // Update operation fields
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['timer'],
        operation: ['update'],
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
        displayName: 'Tags',
        name: 'tags',
        type: 'multiOptions',
        default: [],
        description: 'Tags to categorize this task',
        typeOptions: {
          loadOptionsMethod: 'getTags',
        },
      },
      {
        displayName: 'Billable',
        name: 'billable',
        type: 'boolean',
        default: false,
        description: 'Whether this time should be billed to the client',
      },
      {
        displayName: 'Location',
        name: 'location',
        type: 'string',
        default: '',
        description: 'Physical location where work started',
      },
      {
        displayName: 'Location End',
        name: 'locationEnd',
        type: 'string',
        default: '',
        description: 'Physical location where work ended',
      },
      {
        displayName: 'Feeling',
        name: 'feeling',
        type: 'number',
        default: 3,
        typeOptions: {
          minValue: 1,
          maxValue: 5,
        },
        description: 'Mood or satisfaction rating (1=poor, 5=excellent)',
      },
    ],
  },
];
