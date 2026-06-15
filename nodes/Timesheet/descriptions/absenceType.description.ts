import type { INodeProperties } from 'n8n-workflow';

export const absenceTypeOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['absenceType'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new absence type',
        action: 'Create an absence type',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete an absence type',
        action: 'Delete an absence type',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get an absence type',
        action: 'Get an absence type',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many absence types',
        action: 'Get many absence types',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an absence type',
        action: 'Update an absence type',
      },
    ],
    default: 'create',
  },
];

export const absenceTypeFields: INodeProperties[] = [
  // ----------------------------------
  //         Organization selector (all operations)
  // ----------------------------------
  {
    displayName: 'Organization',
    name: 'organizationId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    description: 'The organization the absence type belongs to',
    displayOptions: {
      show: {
        resource: ['absenceType'],
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
  //         absenceType:create
  // ----------------------------------
  {
    displayName: 'Code',
    name: 'code',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['absenceType'],
        operation: ['create'],
      },
    },
    description: 'Short code for the absence type (e.g. VAC, SICK)',
  },
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['absenceType'],
        operation: ['create'],
      },
    },
    description: 'Display name of the absence type',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['absenceType'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Affects Overtime',
        name: 'affectsOvertime',
        type: 'boolean',
        default: false,
        description: 'Whether this absence type affects overtime calculations',
      },
      {
        displayName: 'Color',
        name: 'color',
        type: 'number',
        default: 0,
        description: 'Color code for the absence type',
      },
      {
        displayName: 'Deducts From Quota',
        name: 'deductsFromQuota',
        type: 'boolean',
        default: false,
        description: 'Whether this absence type deducts from the vacation quota',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the absence type',
      },
      {
        displayName: 'Paid',
        name: 'paid',
        type: 'boolean',
        default: false,
        description: 'Whether absences of this type are paid',
      },
      {
        displayName: 'Requires Approval',
        name: 'requiresApproval',
        type: 'boolean',
        default: false,
        description: 'Whether absences of this type require approval',
      },
      {
        displayName: 'Requires Documentation',
        name: 'requiresDocumentation',
        type: 'boolean',
        default: false,
        description: 'Whether absences of this type require documentation',
      },
    ],
  },

  // ----------------------------------
  //         absenceType:get / update / delete
  // ----------------------------------
  {
    displayName: 'Absence Type ID',
    name: 'absenceTypeId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['absenceType'],
        operation: ['get', 'update', 'delete'],
      },
    },
    description: 'ID of the absence type',
  },

  // ----------------------------------
  //         absenceType:update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['absenceType'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Affects Overtime',
        name: 'affectsOvertime',
        type: 'boolean',
        default: false,
        description: 'Whether this absence type affects overtime calculations',
      },
      {
        displayName: 'Code',
        name: 'code',
        type: 'string',
        default: '',
        description: 'Short code for the absence type',
      },
      {
        displayName: 'Color',
        name: 'color',
        type: 'number',
        default: 0,
        description: 'Color code for the absence type',
      },
      {
        displayName: 'Deducts From Quota',
        name: 'deductsFromQuota',
        type: 'boolean',
        default: false,
        description: 'Whether this absence type deducts from the vacation quota',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the absence type',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Display name of the absence type',
      },
      {
        displayName: 'Paid',
        name: 'paid',
        type: 'boolean',
        default: false,
        description: 'Whether absences of this type are paid',
      },
      {
        displayName: 'Requires Approval',
        name: 'requiresApproval',
        type: 'boolean',
        default: false,
        description: 'Whether absences of this type require approval',
      },
      {
        displayName: 'Requires Documentation',
        name: 'requiresDocumentation',
        type: 'boolean',
        default: false,
        description: 'Whether absences of this type require documentation',
      },
    ],
  },

  // ----------------------------------
  //         absenceType:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['absenceType'],
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
        resource: ['absenceType'],
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
];
