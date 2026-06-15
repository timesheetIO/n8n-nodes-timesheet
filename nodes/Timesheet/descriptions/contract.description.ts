import type { INodeProperties } from 'n8n-workflow';

export const contractOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['contract'],
      },
    },
    options: [
      {
        name: 'Activate',
        value: 'activate',
        description: 'Activate a contract (requires manager or owner permission)',
        action: 'Activate a contract',
      },
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new contract',
        action: 'Create a contract',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a contract',
        action: 'Delete a contract',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a contract',
        action: 'Get a contract',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many contracts',
        action: 'Get many contracts',
      },
      {
        name: 'Reactivate',
        value: 'reactivate',
        description: 'Reactivate a suspended contract (requires manager or owner permission)',
        action: 'Reactivate a contract',
      },
      {
        name: 'Suspend',
        value: 'suspend',
        description: 'Suspend a contract (requires manager or owner permission)',
        action: 'Suspend a contract',
      },
      {
        name: 'Terminate',
        value: 'terminate',
        description: 'Terminate a contract (requires manager or owner permission)',
        action: 'Terminate a contract',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a contract',
        action: 'Update a contract',
      },
    ],
    default: 'create',
  },
];

export const contractFields: INodeProperties[] = [
  // ----------------------------------
  //         Organization selector (all operations)
  // ----------------------------------
  {
    displayName: 'Organization',
    name: 'organizationId',
    type: 'resourceLocator',
    default: { mode: 'list', value: '' },
    required: true,
    description: 'The organization the contract belongs to',
    displayOptions: {
      show: {
        resource: ['contract'],
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
  //         contract:create
  // ----------------------------------
  {
    displayName: 'Name',
    name: 'name',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['create'],
      },
    },
    description: 'Name of the contract',
  },
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['create'],
      },
    },
    description: 'ID of the user the contract applies to',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Daily Hours',
        name: 'dailyHours',
        type: 'number',
        default: 0,
        description: 'Number of working hours per day',
      },
      {
        displayName: 'Overtime Enabled',
        name: 'overtimeEnabled',
        type: 'boolean',
        default: false,
        description: 'Whether overtime tracking is enabled for this contract',
      },
      {
        displayName: 'Salary Amount',
        name: 'salaryAmount',
        type: 'number',
        default: 0,
        description: 'Salary amount for the contract',
      },
      {
        displayName: 'Salary Currency',
        name: 'salaryCurrency',
        type: 'string',
        default: '',
        description: 'Currency code for the salary (e.g. USD, EUR)',
      },
      {
        displayName: 'Salary Type',
        name: 'salaryType',
        type: 'string',
        default: '',
        description: 'Type of salary (e.g. hourly, monthly, annual)',
      },
      {
        displayName: 'Vacation Days Annual',
        name: 'vacationDaysAnnual',
        type: 'number',
        default: 0,
        description: 'Number of annual vacation days',
      },
      {
        displayName: 'Valid From',
        name: 'validFrom',
        type: 'dateTime',
        default: '',
        description: 'Date the contract becomes valid',
      },
      {
        displayName: 'Valid To',
        name: 'validTo',
        type: 'dateTime',
        default: '',
        description: 'Date the contract is valid until',
      },
      {
        displayName: 'Weekly Hours',
        name: 'weeklyHours',
        type: 'number',
        default: 0,
        description: 'Number of working hours per week',
      },
      {
        displayName: 'Work Days',
        name: 'workDays',
        type: 'string',
        default: '',
        description: 'Working days for the contract',
      },
    ],
  },

  // ----------------------------------
  //   contract:get / update / delete / activate / suspend / reactivate / terminate
  // ----------------------------------
  {
    displayName: 'Contract ID',
    name: 'contractId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['get', 'update', 'delete', 'activate', 'suspend', 'reactivate', 'terminate'],
      },
    },
    description: 'ID of the contract',
  },

  // ----------------------------------
  //         contract:update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['contract'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Daily Hours',
        name: 'dailyHours',
        type: 'number',
        default: 0,
        description: 'Number of working hours per day',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name of the contract',
      },
      {
        displayName: 'Overtime Enabled',
        name: 'overtimeEnabled',
        type: 'boolean',
        default: false,
        description: 'Whether overtime tracking is enabled for this contract',
      },
      {
        displayName: 'Salary Amount',
        name: 'salaryAmount',
        type: 'number',
        default: 0,
        description: 'Salary amount for the contract',
      },
      {
        displayName: 'Vacation Days Annual',
        name: 'vacationDaysAnnual',
        type: 'number',
        default: 0,
        description: 'Number of annual vacation days',
      },
      {
        displayName: 'Valid From',
        name: 'validFrom',
        type: 'dateTime',
        default: '',
        description: 'Date the contract becomes valid',
      },
      {
        displayName: 'Valid To',
        name: 'validTo',
        type: 'dateTime',
        default: '',
        description: 'Date the contract is valid until',
      },
      {
        displayName: 'Weekly Hours',
        name: 'weeklyHours',
        type: 'number',
        default: 0,
        description: 'Number of working hours per week',
      },
      {
        displayName: 'Work Days',
        name: 'workDays',
        type: 'string',
        default: '',
        description: 'Working days for the contract',
      },
    ],
  },

  // ----------------------------------
  //         contract:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['contract'],
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
        resource: ['contract'],
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
        resource: ['contract'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Status',
        name: 'status',
        type: 'string',
        default: '',
        description: 'Filter by contract status',
      },
      {
        displayName: 'User',
        name: 'user',
        type: 'string',
        default: '',
        description: 'Filter by user ID',
      },
    ],
  },
];
