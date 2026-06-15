import type { INodeProperties } from 'n8n-workflow';

export const pauseOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['pause'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new pause',
        action: 'Create a pause',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a pause',
        action: 'Delete a pause',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a pause',
        action: 'Get a pause',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many pauses',
        action: 'Get many pauses',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a pause',
        action: 'Update a pause',
      },
    ],
    default: 'create',
  },
];

export const pauseFields: INodeProperties[] = [
  // ----------------------------------
  //         pause:create
  // ----------------------------------
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['pause'],
        operation: ['create'],
      },
    },
    description: 'ID of the task this pause belongs to',
  },
  {
    displayName: 'Start Date and Time',
    name: 'startDateTime',
    type: 'dateTime',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['pause'],
        operation: ['create'],
      },
    },
    description: 'Start date and time of the pause',
  },
  {
    displayName: 'End Date and Time',
    name: 'endDateTime',
    type: 'dateTime',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['pause'],
        operation: ['create'],
      },
    },
    description: 'End date and time of the pause',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['pause'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the pause',
      },
    ],
  },

  // ----------------------------------
  //         pause:delete
  // ----------------------------------
  {
    displayName: 'Pause ID',
    name: 'pauseId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['pause'],
        operation: ['delete'],
      },
    },
    description: 'ID of the pause to delete',
  },

  // ----------------------------------
  //         pause:get
  // ----------------------------------
  {
    displayName: 'Pause ID',
    name: 'pauseId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['pause'],
        operation: ['get'],
      },
    },
    description: 'ID of the pause to retrieve',
  },

  // ----------------------------------
  //         pause:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['pause'],
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
        resource: ['pause'],
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
        resource: ['pause'],
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
    ],
  },

  // ----------------------------------
  //         pause:update
  // ----------------------------------
  {
    displayName: 'Pause ID',
    name: 'pauseId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['pause'],
        operation: ['update'],
      },
    },
    description: 'ID of the pause to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['pause'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Updated description of the pause',
      },
      {
        displayName: 'End Date and Time',
        name: 'endDateTime',
        type: 'dateTime',
        default: '',
        description: 'Updated end date and time of the pause',
      },
      {
        displayName: 'Start Date and Time',
        name: 'startDateTime',
        type: 'dateTime',
        default: '',
        description: 'Updated start date and time of the pause',
      },
    ],
  },
];
