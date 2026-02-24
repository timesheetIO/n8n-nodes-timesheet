import type { INodeProperties } from 'n8n-workflow';

export const projectOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['project'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new project',
        action: 'Create a project',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a project',
        action: 'Delete a project',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a project by ID',
        action: 'Get a project',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get multiple projects',
        action: 'Get many projects',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a project',
        action: 'Update a project',
      },
    ],
    default: 'getMany',
  },
];

export const projectFields: INodeProperties[] = [
  // Common: Project ID field
  {
    displayName: 'Project ID',
    name: 'projectId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['get', 'update', 'delete'],
      },
    },
    default: '',
    description: 'The ID of the project',
  },

  // Create operation
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
    default: '',
    description: 'Project name or title',
  },
  {
    displayName: 'Team',
    name: 'teamId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    description:
      'Team this project belongs to (required when teams are activated in your profile, leave empty otherwise)',
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
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Project description',
        typeOptions: {
          rows: 3,
        },
      },
      {
        displayName: 'Color',
        name: 'color',
        type: 'number',
        default: 0,
        typeOptions: {
          minValue: 0,
          maxValue: 23,
        },
        description: 'Color code for visual identification (0-23)',
      },
      {
        displayName: 'Task Default Billable',
        name: 'taskDefaultBillable',
        type: 'boolean',
        default: false,
        description: 'Whether tasks in this project should be billable by default',
      },
    ],
  },

  // Update operation
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['project'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'Updated project title',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Updated project description',
        typeOptions: {
          rows: 3,
        },
      },
      {
        displayName: 'Archived',
        name: 'archived',
        type: 'boolean',
        default: false,
        description: 'Whether to archive this project',
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
        resource: ['project'],
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
        resource: ['project'],
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
        resource: ['project'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Search',
        name: 'search',
        type: 'string',
        default: '',
        description: 'Search projects by title (partial match)',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'options',
        options: [
          {
            name: 'All',
            value: 'all',
          },
          {
            name: 'Active',
            value: 'active',
          },
          {
            name: 'Archived',
            value: 'inactive',
          },
        ],
        default: 'all',
        description: 'Filter by project status',
      },
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
        displayName: 'Sort By',
        name: 'sort',
        type: 'options',
        options: [
          {
            name: 'Alphabetical',
            value: 'alpha',
          },
          {
            name: 'Created Date',
            value: 'created',
          },
          {
            name: 'Duration',
            value: 'duration',
          },
        ],
        default: 'alpha',
        description: 'Sort projects by field',
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
        default: 'asc',
        description: 'Sort order',
      },
    ],
  },
];
