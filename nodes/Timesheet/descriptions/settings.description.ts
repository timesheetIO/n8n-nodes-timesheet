import type { INodeProperties } from 'n8n-workflow';

export const settingsOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['settings'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get user settings',
        action: 'Get settings',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update user settings',
        action: 'Update settings',
      },
    ],
    default: 'get',
  },
];

export const settingsFields: INodeProperties[] = [
  // ----------------------------------
  //         settings:get
  // ----------------------------------
  {
    displayName: 'Note',
    name: 'notice',
    type: 'notice',
    default: '',
    displayOptions: {
      show: {
        resource: ['settings'],
        operation: ['get'],
      },
    },
    description:
      'Returns your account settings including theme, language, timezone, currency, and display preferences.',
  },

  // ----------------------------------
  //         settings:update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['settings'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Theme',
        name: 'theme',
        type: 'options',
        options: [
          {
            name: 'Light',
            value: 'light',
          },
          {
            name: 'Dark',
            value: 'dark',
          },
          {
            name: 'System',
            value: 'system',
          },
        ],
        default: 'system',
        description: 'UI theme preference',
      },
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: '',
        description: 'Language code (e.g., "en", "de", "fr")',
      },
      {
        displayName: 'Timezone',
        name: 'timezone',
        type: 'string',
        default: '',
        description: 'Timezone (e.g., "Europe/Berlin", "America/New_York")',
      },
      {
        displayName: 'Currency',
        name: 'currency',
        type: 'string',
        default: '',
        description: 'Currency code (e.g., "USD", "EUR", "GBP")',
      },
      {
        displayName: 'Date Format',
        name: 'dateFormat',
        type: 'string',
        default: '',
        description: 'Date format string',
      },
      {
        displayName: 'Time Format',
        name: 'timeFormat',
        type: 'string',
        default: '',
        description: 'Time format string',
      },
      {
        displayName: 'Duration Format',
        name: 'durationFormat',
        type: 'string',
        default: '',
        description: 'Duration format string',
      },
      {
        displayName: 'First Day of Week',
        name: 'firstDay',
        type: 'options',
        options: [
          {
            name: 'Sunday',
            value: 0,
          },
          {
            name: 'Monday',
            value: 1,
          },
          {
            name: 'Tuesday',
            value: 2,
          },
          {
            name: 'Wednesday',
            value: 3,
          },
          {
            name: 'Thursday',
            value: 4,
          },
          {
            name: 'Friday',
            value: 5,
          },
          {
            name: 'Saturday',
            value: 6,
          },
        ],
        default: 1,
        description: 'First day of the week for calendar views',
      },
      {
        displayName: 'Default Task Duration',
        name: 'defaultTaskDuration',
        type: 'number',
        default: 3600,
        description: 'Default task duration in seconds',
      },
      {
        displayName: 'Default Break Duration',
        name: 'defaultBreakDuration',
        type: 'number',
        default: 1800,
        description: 'Default break duration in seconds',
      },
      {
        displayName: 'Entries Per Page',
        name: 'entriesPerPage',
        type: 'number',
        default: 50,
        description: 'Number of entries to display per page',
      },
      {
        displayName: 'Show Relatives',
        name: 'showRelatives',
        type: 'boolean',
        default: true,
        description: 'Whether to show relative time formats',
      },
      {
        displayName: 'Weekly Summary',
        name: 'weeklySummary',
        type: 'boolean',
        default: false,
        description: 'Whether to receive weekly summary emails',
      },
      {
        displayName: 'Monthly Summary',
        name: 'monthlySummary',
        type: 'boolean',
        default: false,
        description: 'Whether to receive monthly summary emails',
      },
      {
        displayName: 'Timer Rounding',
        name: 'timerRounding',
        type: 'number',
        default: 0,
        description: 'Timer rounding value in seconds',
      },
      {
        displayName: 'Timer Edit View',
        name: 'timerEditView',
        type: 'boolean',
        default: false,
        description: 'Whether to show timer edit view by default',
      },
      {
        displayName: 'Pause Rounding',
        name: 'pauseRounding',
        type: 'number',
        default: 0,
        description: 'Pause rounding value in seconds',
      },
      {
        displayName: 'Pause Edit View',
        name: 'pauseEditView',
        type: 'boolean',
        default: false,
        description: 'Whether to show pause edit view by default',
      },
      {
        displayName: 'Autofill Project Selection',
        name: 'autofillProjectSelection',
        type: 'boolean',
        default: false,
        description: 'Whether to autofill project selection',
      },
    ],
  },
];
