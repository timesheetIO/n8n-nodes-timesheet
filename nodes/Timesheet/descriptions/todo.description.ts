import type { INodeProperties } from 'n8n-workflow';

export const todoOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['todo'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new todo',
        action: 'Create a todo',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a todo',
        action: 'Delete a todo',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a todo',
        action: 'Get a todo',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many todos',
        action: 'Get many todos',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a todo',
        action: 'Update a todo',
      },
    ],
    default: 'create',
  },
];

export const todoFields: INodeProperties[] = [
  // ----------------------------------
  //         todo:create
  // ----------------------------------
  {
    displayName: 'Project',
    name: 'projectId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['todo'],
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
    description: 'The project this todo belongs to',
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['todo'],
        operation: ['create'],
      },
    },
    description: 'Name of the todo',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['todo'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Assigned Users',
        name: 'assignedUsers',
        type: 'string',
        default: '',
        description: 'Comma-separated list of user IDs to assign',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the todo',
      },
      {
        displayName: 'Due Date',
        name: 'dueDate',
        type: 'dateTime',
        default: '',
        description: 'Date and time the todo is due',
      },
      {
        displayName: 'Estimated Hours',
        name: 'estimatedHours',
        type: 'number',
        default: 0,
        description: 'Estimated hours to complete the todo',
      },
      {
        displayName: 'Estimated Minutes',
        name: 'estimatedMinutes',
        type: 'number',
        default: 0,
        description: 'Estimated minutes to complete the todo',
      },
    ],
  },

  // ----------------------------------
  //         todo:delete
  // ----------------------------------
  {
    displayName: 'Todo ID',
    name: 'todoId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['todo'],
        operation: ['delete'],
      },
    },
    description: 'ID of the todo to delete',
  },

  // ----------------------------------
  //         todo:get
  // ----------------------------------
  {
    displayName: 'Todo ID',
    name: 'todoId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['todo'],
        operation: ['get'],
      },
    },
    description: 'ID of the todo to retrieve',
  },

  // ----------------------------------
  //         todo:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['todo'],
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
        resource: ['todo'],
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
        resource: ['todo'],
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
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          {
            name: 'Open',
            value: 'open',
          },
          {
            name: 'Closed',
            value: 'closed',
          },
        ],
        default: 'open',
        description: 'Filter by todo status',
      },
    ],
  },

  // ----------------------------------
  //         todo:update
  // ----------------------------------
  {
    displayName: 'Todo ID',
    name: 'todoId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['todo'],
        operation: ['update'],
      },
    },
    description: 'ID of the todo to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['todo'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Assigned Users',
        name: 'assignedUsers',
        type: 'string',
        default: '',
        description: 'Comma-separated list of user IDs to assign',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Updated description of the todo',
      },
      {
        displayName: 'Due Date',
        name: 'dueDate',
        type: 'dateTime',
        default: '',
        description: 'Updated date and time the todo is due',
      },
      {
        displayName: 'Estimated Hours',
        name: 'estimatedHours',
        type: 'number',
        default: 0,
        description: 'Estimated hours to complete the todo',
      },
      {
        displayName: 'Estimated Minutes',
        name: 'estimatedMinutes',
        type: 'number',
        default: 0,
        description: 'Estimated minutes to complete the todo',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Updated name of the todo',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'number',
        default: 0,
        description: '0=open, 1=closed',
      },
    ],
  },
];
