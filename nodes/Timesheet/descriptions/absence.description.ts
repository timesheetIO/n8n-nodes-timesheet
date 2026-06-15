import type { INodeProperties } from 'n8n-workflow';

export const absenceOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['absence'],
      },
    },
    options: [
      {
        name: 'Approve',
        value: 'approve',
        description: 'Approve an absence (requires manager or owner permission)',
        action: 'Approve an absence',
      },
      {
        name: 'Cancel',
        value: 'cancel',
        description: 'Cancel an absence (requires manager or owner permission)',
        action: 'Cancel an absence',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new absence',
        action: 'Create an absence',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete an absence',
        action: 'Delete an absence',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get an absence',
        action: 'Get an absence',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many absences',
        action: 'Get many absences',
      },
      {
        name: 'Reject',
        value: 'reject',
        description: 'Reject an absence (requires manager or owner permission)',
        action: 'Reject an absence',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an absence',
        action: 'Update an absence',
      },
    ],
    default: 'create',
  },
];

export const absenceFields: INodeProperties[] = [
  // ----------------------------------
  //         Organization selector (all operations)
  // ----------------------------------
  {
    displayName: 'Organization',
    name: 'organizationId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    description: 'The organization the absence belongs to',
    displayOptions: {
      show: {
        resource: ['absence'],
      },
    },
    modes: [
      {
        displayName: 'From List',
        name: 'list',
        type: 'list',
        placeholder: 'Select an organization...',
        typeOptions: {
          searchListMethod: 'searchOrganizations',
          searchable: true,
        },
      },
      {
        displayName: 'By ID',
        name: 'id',
        type: 'string',
        placeholder: 'organization_id',
      },
    ],
  },

  // ----------------------------------
  //         absence:create
  // ----------------------------------
  {
    displayName: 'Contract ID',
    name: 'contractId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['absence'],
        operation: ['create'],
      },
    },
    description: 'ID of the contract the absence belongs to',
  },
  {
    displayName: 'Absence Type ID',
    name: 'absenceTypeId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['absence'],
        operation: ['create'],
      },
    },
    description: 'ID of the absence type',
  },
  {
    displayName: 'Start Date Time',
    name: 'startDateTime',
    type: 'dateTime',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['absence'],
        operation: ['create'],
      },
    },
    description: 'When the absence starts',
  },
  {
    displayName: 'End Date Time',
    name: 'endDateTime',
    type: 'dateTime',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['absence'],
        operation: ['create'],
      },
    },
    description: 'When the absence ends',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['absence'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Documentation URL',
        name: 'documentationUrl',
        type: 'string',
        default: '',
        description: 'URL to supporting documentation for the absence',
      },
      {
        displayName: 'Full Day',
        name: 'fullDay',
        type: 'boolean',
        default: false,
        description: 'Whether the absence spans full days',
      },
      {
        displayName: 'Reason',
        name: 'reason',
        type: 'string',
        default: '',
        description: 'Reason for the absence',
      },
    ],
  },

  // ----------------------------------
  //         absence:get / update / delete / approve / reject / cancel
  // ----------------------------------
  {
    displayName: 'Absence ID',
    name: 'absenceId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['absence'],
        operation: ['get', 'update', 'delete', 'approve', 'reject', 'cancel'],
      },
    },
    description: 'ID of the absence',
  },

  // ----------------------------------
  //         absence:update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['absence'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Documentation URL',
        name: 'documentationUrl',
        type: 'string',
        default: '',
        description: 'URL to supporting documentation for the absence',
      },
      {
        displayName: 'End Date Time',
        name: 'endDateTime',
        type: 'dateTime',
        default: '',
        description: 'When the absence ends',
      },
      {
        displayName: 'Full Day',
        name: 'fullDay',
        type: 'boolean',
        default: false,
        description: 'Whether the absence spans full days',
      },
      {
        displayName: 'Reason',
        name: 'reason',
        type: 'string',
        default: '',
        description: 'Reason for the absence',
      },
      {
        displayName: 'Start Date Time',
        name: 'startDateTime',
        type: 'dateTime',
        default: '',
        description: 'When the absence starts',
      },
    ],
  },

  // ----------------------------------
  //         absence:reject / cancel
  // ----------------------------------
  {
    displayName: 'Reason',
    name: 'reason',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['absence'],
        operation: ['reject', 'cancel'],
      },
    },
    description: 'Reason for rejecting or cancelling the absence',
  },

  // ----------------------------------
  //         absence:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['absence'],
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
        resource: ['absence'],
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
        resource: ['absence'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Absence Type ID',
        name: 'absenceTypeId',
        type: 'string',
        default: '',
        description: 'Filter by absence type ID',
      },
      {
        displayName: 'Contract ID',
        name: 'contractId',
        type: 'string',
        default: '',
        description: 'Filter by contract ID',
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'dateTime',
        default: '',
        description: 'Filter absences ending on or before this date',
      },
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'dateTime',
        default: '',
        description: 'Filter absences starting on or after this date',
      },
      {
        displayName: 'Status',
        name: 'status',
        type: 'string',
        default: '',
        description: 'Filter by absence status',
      },
    ],
  },
];
