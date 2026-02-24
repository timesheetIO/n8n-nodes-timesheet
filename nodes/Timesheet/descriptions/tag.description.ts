import type { INodeProperties } from 'n8n-workflow';

export const tagOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['tag'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new tag',
        action: 'Create a tag',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a tag',
        action: 'Delete a tag',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a tag',
        action: 'Get a tag',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many tags',
        action: 'Get many tags',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a tag',
        action: 'Update a tag',
      },
    ],
    default: 'create',
  },
];

export const tagFields: INodeProperties[] = [
  // ----------------------------------
  //         tag:create
  // ----------------------------------
  {
    displayName: 'Team',
    name: 'teamId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description:
      'Team this tag belongs to (required when teams are activated in your profile, leave empty otherwise)',
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
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['create'],
      },
    },
    description: 'Name of the tag',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Color',
        name: 'color',
        type: 'number',
        default: 0,
        description: 'Color code for the tag (0-999)',
      },
    ],
  },

  // ----------------------------------
  //         tag:delete
  // ----------------------------------
  {
    displayName: 'Tag ID',
    name: 'tagId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['delete'],
      },
    },
    description: 'ID of the tag to delete',
  },

  // ----------------------------------
  //         tag:get
  // ----------------------------------
  {
    displayName: 'Tag ID',
    name: 'tagId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['get'],
      },
    },
    description: 'ID of the tag to retrieve',
  },

  // ----------------------------------
  //         tag:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['tag'],
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
        resource: ['tag'],
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
        resource: ['tag'],
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
        displayName: 'Archived',
        name: 'archived',
        type: 'boolean',
        default: false,
        description: 'Include archived tags',
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
  //         tag:update
  // ----------------------------------
  {
    displayName: 'Tag ID',
    name: 'tagId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['update'],
      },
    },
    description: 'ID of the tag to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['tag'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Updated name of the tag',
      },
      {
        displayName: 'Color',
        name: 'color',
        type: 'number',
        default: 0,
        description: 'Updated color code for the tag (0-999)',
      },
      {
        displayName: 'Archived',
        name: 'archived',
        type: 'boolean',
        default: false,
        description: 'Whether the tag is archived',
      },
    ],
  },
];
