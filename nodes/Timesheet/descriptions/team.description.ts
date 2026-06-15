import type { INodeProperties } from 'n8n-workflow';

export const teamOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['team'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new team',
        action: 'Create a team',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a team',
        action: 'Delete a team',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a team',
        action: 'Get a team',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many teams',
        action: 'Get many teams',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a team',
        action: 'Update a team',
      },
    ],
    default: 'create',
  },
];

export const teamFields: INodeProperties[] = [
  // ----------------------------------
  //         team:create
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['create'],
      },
    },
    description: 'Name of the team',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Color',
        name: 'color',
        type: 'number',
        default: 0,
        description: 'Color of the team',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the team',
      },
    ],
  },

  // ----------------------------------
  //         team:delete
  // ----------------------------------
  {
    displayName: 'Team ID',
    name: 'teamId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['delete'],
      },
    },
    description: 'ID of the team to delete',
  },

  // ----------------------------------
  //         team:get
  // ----------------------------------
  {
    displayName: 'Team ID',
    name: 'teamId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['get'],
      },
    },
    description: 'ID of the team to retrieve',
  },

  // ----------------------------------
  //         team:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['team'],
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
        resource: ['team'],
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
        resource: ['team'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Order',
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
        default: 'asc',
        description: 'Sort order of the results',
      },
      {
        displayName: 'Sort',
        name: 'sort',
        type: 'options',
        options: [
          {
            name: 'Alphabetical',
            value: 'alpha',
          },
          {
            name: 'Permission',
            value: 'permission',
          },
          {
            name: 'Created',
            value: 'created',
          },
        ],
        default: 'alpha',
        description: 'Field to sort the results by',
      },
    ],
  },

  // ----------------------------------
  //         team:update
  // ----------------------------------
  {
    displayName: 'Team ID',
    name: 'teamId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['update'],
      },
    },
    description: 'ID of the team to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['team'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Color',
        name: 'color',
        type: 'number',
        default: 0,
        description: 'Updated color of the team',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Updated description of the team',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Updated name of the team',
      },
    ],
  },
];
