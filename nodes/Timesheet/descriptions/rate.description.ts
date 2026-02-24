import type { INodeProperties } from 'n8n-workflow';

export const rateOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['rate'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new rate',
        action: 'Create a rate',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a rate',
        action: 'Delete a rate',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a rate',
        action: 'Get a rate',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many rates',
        action: 'Get many rates',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a rate',
        action: 'Update a rate',
      },
    ],
    default: 'create',
  },
];

export const rateFields: INodeProperties[] = [
  // ----------------------------------
  //         rate:create
  // ----------------------------------
  {
    displayName: 'Team',
    name: 'teamId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description:
      'Team this rate belongs to (required when teams are activated in your profile, leave empty otherwise)',
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        placeholder: 'Select a team...',
        typeOptions: {
          searchListMethod: 'searchTeams',
          searchable: true,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'team_id',
      },
    ],
  },
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['rate'],
        operation: ['create'],
      },
    },
    description: 'Title of the rate',
  },
  {
    displayName: 'Factor',
    name: 'factor',
    type: 'number',
    default: 1.0,
    required: true,
    displayOptions: {
      show: {
        resource: ['rate'],
        operation: ['create'],
      },
    },
    description: 'Multiplier factor for the rate (e.g., 1.5 for time-and-a-half)',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['rate'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Extra',
        name: 'extra',
        type: 'number',
        default: 0,
        description: 'Additional amount to add to the rate',
      },
      {
        displayName: 'Enabled',
        name: 'enabled',
        type: 'boolean',
        default: true,
        description: 'Whether the rate is enabled',
      },
      {
        displayName: 'Archived',
        name: 'archived',
        type: 'boolean',
        default: false,
        description: 'Whether the rate is archived',
      },
    ],
  },

  // ----------------------------------
  //         rate:delete
  // ----------------------------------
  {
    displayName: 'Rate ID',
    name: 'rateId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['rate'],
        operation: ['delete'],
      },
    },
    description: 'ID of the rate to delete',
  },

  // ----------------------------------
  //         rate:get
  // ----------------------------------
  {
    displayName: 'Rate ID',
    name: 'rateId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['rate'],
        operation: ['get'],
      },
    },
    description: 'ID of the rate to retrieve',
  },

  // ----------------------------------
  //         rate:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['rate'],
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
        resource: ['rate'],
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
        resource: ['rate'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Team',
        name: 'teamId',
        type: 'resourceLocator',
        default: { mode: 'list', value: '' },
        description: 'Filter by team (only applicable when teams are activated in your profile)',
        modes: [
          {
            displayName: 'From List',
            name: 'list',
            type: 'list',
            placeholder: 'Select a team...',
            typeOptions: {
              searchListMethod: 'searchTeams',
              searchable: true,
            },
          },
          {
            displayName: 'By ID',
            name: 'id',
            type: 'string',
            placeholder: 'team_id',
          },
        ],
      },
      {
        displayName: 'Include Archived',
        name: 'archived',
        type: 'boolean',
        default: false,
        description: 'Include archived rates in results',
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
            name: 'Status',
            value: 'status',
          },
          {
            name: 'Created',
            value: 'created',
          },
        ],
        default: 'alpha',
        description: 'Sort order for results',
      },
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
        description: 'Sort direction',
      },
    ],
  },

  // ----------------------------------
  //         rate:update
  // ----------------------------------
  {
    displayName: 'Rate ID',
    name: 'rateId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['rate'],
        operation: ['update'],
      },
    },
    description: 'ID of the rate to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['rate'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'Updated title of the rate',
      },
      {
        displayName: 'Factor',
        name: 'factor',
        type: 'number',
        default: 1.0,
        description: 'Updated multiplier factor for the rate',
      },
      {
        displayName: 'Extra',
        name: 'extra',
        type: 'number',
        default: 0,
        description: 'Updated additional amount',
      },
      {
        displayName: 'Enabled',
        name: 'enabled',
        type: 'boolean',
        default: true,
        description: 'Whether the rate is enabled',
      },
      {
        displayName: 'Archived',
        name: 'archived',
        type: 'boolean',
        default: false,
        description: 'Whether the rate is archived',
      },
      {
        displayName: 'Deleted',
        name: 'deleted',
        type: 'boolean',
        default: false,
        description: 'Whether the rate is deleted',
      },
    ],
  },
];
