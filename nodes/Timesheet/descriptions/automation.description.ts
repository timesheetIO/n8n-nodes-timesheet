import type { INodeProperties } from 'n8n-workflow';

export const automationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['automation'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new automation',
        action: 'Create an automation',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete an automation',
        action: 'Delete an automation',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get an automation',
        action: 'Get an automation',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many automations',
        action: 'Get many automations',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an automation',
        action: 'Update an automation',
      },
    ],
    default: 'create',
  },
];

export const automationFields: INodeProperties[] = [
  // ----------------------------------
  //         automation:create
  // ----------------------------------
  {
    displayName: 'Project',
    name: 'projectId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    displayOptions: {
      show: {
        resource: ['automation'],
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
    description: 'The project this automation is attached to',
  },
  {
    displayName: 'Type',
    name: 'typeId',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['automation'],
        operation: ['create'],
      },
    },
    options: [
      {
        name: 'Geofence',
        value: 0,
      },
      {
        name: 'WLAN',
        value: 1,
      },
      {
        name: 'Beacon',
        value: 2,
      },
    ],
    default: 0,
    description: 'The trigger type of the automation',
  },
  {
    displayName: 'Action',
    name: 'action',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['automation'],
        operation: ['create'],
      },
    },
    options: [
      {
        name: 'Start',
        value: 0,
      },
      {
        name: 'Stop',
        value: 1,
      },
      {
        name: 'Pause',
        value: 2,
      },
    ],
    default: 0,
    description: 'The action triggered by the automation',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['automation'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        default: '',
        description: 'Address of the geofence location',
      },
      {
        displayName: 'Beacon UUID',
        name: 'beaconUUID',
        type: 'string',
        default: '',
        description: 'UUID of the beacon trigger',
      },
      {
        displayName: 'Enabled',
        name: 'enabled',
        type: 'boolean',
        default: true,
        description: 'Whether the automation is enabled',
      },
      {
        displayName: 'Latitude',
        name: 'latitude',
        type: 'number',
        default: 0,
        description: 'Latitude of the geofence location',
      },
      {
        displayName: 'Longitude',
        name: 'longitude',
        type: 'number',
        default: 0,
        description: 'Longitude of the geofence location',
      },
      {
        displayName: 'Radius',
        name: 'radius',
        type: 'number',
        default: 0,
        description: 'Radius of the geofence in meters',
      },
      {
        displayName: 'Shared',
        name: 'shared',
        type: 'boolean',
        default: false,
        description: 'Whether the automation is shared with the team',
      },
      {
        displayName: 'SSID',
        name: 'ssid',
        type: 'string',
        default: '',
        description: 'SSID of the WLAN trigger',
      },
    ],
  },

  // ----------------------------------
  //         automation:delete
  // ----------------------------------
  {
    displayName: 'Automation ID',
    name: 'automationId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['automation'],
        operation: ['delete'],
      },
    },
    description: 'ID of the automation to delete',
  },

  // ----------------------------------
  //         automation:get
  // ----------------------------------
  {
    displayName: 'Automation ID',
    name: 'automationId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['automation'],
        operation: ['get'],
      },
    },
    description: 'ID of the automation to retrieve',
  },

  // ----------------------------------
  //         automation:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['automation'],
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
        resource: ['automation'],
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
        resource: ['automation'],
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
            name: 'Enabled',
            value: 'enabled',
          },
          {
            name: 'Disabled',
            value: 'disabled',
          },
        ],
        default: 'enabled',
        description: 'Filter by enabled status',
      },
    ],
  },

  // ----------------------------------
  //         automation:update
  // ----------------------------------
  {
    displayName: 'Automation ID',
    name: 'automationId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['automation'],
        operation: ['update'],
      },
    },
    description: 'ID of the automation to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['automation'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        default: '',
        description: 'Updated address of the geofence location',
      },
      {
        displayName: 'Beacon UUID',
        name: 'beaconUUID',
        type: 'string',
        default: '',
        description: 'Updated UUID of the beacon trigger',
      },
      {
        displayName: 'Enabled',
        name: 'enabled',
        type: 'boolean',
        default: true,
        description: 'Whether the automation is enabled',
      },
      {
        displayName: 'Latitude',
        name: 'latitude',
        type: 'number',
        default: 0,
        description: 'Updated latitude of the geofence location',
      },
      {
        displayName: 'Longitude',
        name: 'longitude',
        type: 'number',
        default: 0,
        description: 'Updated longitude of the geofence location',
      },
      {
        displayName: 'Radius',
        name: 'radius',
        type: 'number',
        default: 0,
        description: 'Updated radius of the geofence in meters',
      },
      {
        displayName: 'Shared',
        name: 'shared',
        type: 'boolean',
        default: false,
        description: 'Whether the automation is shared with the team',
      },
      {
        displayName: 'SSID',
        name: 'ssid',
        type: 'string',
        default: '',
        description: 'Updated SSID of the WLAN trigger',
      },
    ],
  },
];
