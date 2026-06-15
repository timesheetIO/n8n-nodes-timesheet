import type { INodeProperties } from 'n8n-workflow';

export const noteOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['note'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new note',
        action: 'Create a note',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a note',
        action: 'Delete a note',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a note',
        action: 'Get a note',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many notes',
        action: 'Get many notes',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a note',
        action: 'Update a note',
      },
    ],
    default: 'create',
  },
];

export const noteFields: INodeProperties[] = [
  // ----------------------------------
  //         note:create
  // ----------------------------------
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['create'],
      },
    },
    description: 'ID of the task this note belongs to',
  },
  {
    displayName: 'Text',
    name: 'text',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['create'],
      },
    },
    description: 'Text content of the note',
  },
  {
    displayName: 'Date and Time',
    name: 'dateTime',
    type: 'dateTime',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['create'],
      },
    },
    description: 'Date and time of the note',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Drive ID',
        name: 'driveId',
        type: 'string',
        default: '',
        description: 'Drive ID of an attached file',
      },
      {
        displayName: 'URI',
        name: 'uri',
        type: 'string',
        default: '',
        description: 'URI of an attached file',
      },
    ],
  },

  // ----------------------------------
  //         note:delete
  // ----------------------------------
  {
    displayName: 'Note ID',
    name: 'noteId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['delete'],
      },
    },
    description: 'ID of the note to delete',
  },

  // ----------------------------------
  //         note:get
  // ----------------------------------
  {
    displayName: 'Note ID',
    name: 'noteId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['get'],
      },
    },
    description: 'ID of the note to retrieve',
  },

  // ----------------------------------
  //         note:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['note'],
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
        resource: ['note'],
        operation: ['getMany'],
        returnAll: [false],
      },
    },
    typeOptions: {
      minValue: 1,
      maxValue: 500,
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
        resource: ['note'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Task ID',
        name: 'taskId',
        type: 'string',
        default: '',
        description: 'Filter by task ID',
      },
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'dateTime',
        default: '',
        description: 'Only return notes on or after this date',
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'dateTime',
        default: '',
        description: 'Only return notes on or before this date',
      },
    ],
  },

  // ----------------------------------
  //         note:update
  // ----------------------------------
  {
    displayName: 'Note ID',
    name: 'noteId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['update'],
      },
    },
    description: 'ID of the note to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['note'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Date and Time',
        name: 'dateTime',
        type: 'dateTime',
        default: '',
        description: 'Updated date and time of the note',
      },
      {
        displayName: 'Drive ID',
        name: 'driveId',
        type: 'string',
        default: '',
        description: 'Updated drive ID of an attached file',
      },
      {
        displayName: 'Text',
        name: 'text',
        type: 'string',
        default: '',
        description: 'Updated text content of the note',
      },
      {
        displayName: 'URI',
        name: 'uri',
        type: 'string',
        default: '',
        description: 'Updated URI of an attached file',
      },
    ],
  },
];
