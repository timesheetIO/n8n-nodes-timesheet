import type { INodeProperties } from 'n8n-workflow';

export const expenseOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['expense'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new expense',
        action: 'Create an expense',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete an expense',
        action: 'Delete an expense',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get an expense',
        action: 'Get an expense',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many expenses',
        action: 'Get many expenses',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an expense',
        action: 'Update an expense',
      },
    ],
    default: 'create',
  },
];

export const expenseFields: INodeProperties[] = [
  // ----------------------------------
  //         expense:create
  // ----------------------------------
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['expense'],
        operation: ['create'],
      },
    },
    description: 'ID of the task this expense belongs to',
  },
  {
    displayName: 'Date and Time',
    name: 'dateTime',
    type: 'dateTime',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['expense'],
        operation: ['create'],
      },
    },
    description: 'Date and time of the expense',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['expense'],
        operation: ['create'],
      },
    },
    options: [
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'string',
        default: '',
        description: 'Expense amount as a decimal string (e.g. 12.50)',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Description of the expense',
      },
      {
        displayName: 'Refunded',
        name: 'refunded',
        type: 'boolean',
        default: false,
        description: 'Whether the expense has been refunded',
      },
    ],
  },

  // ----------------------------------
  //         expense:delete
  // ----------------------------------
  {
    displayName: 'Expense ID',
    name: 'expenseId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['expense'],
        operation: ['delete'],
      },
    },
    description: 'ID of the expense to delete',
  },

  // ----------------------------------
  //         expense:get
  // ----------------------------------
  {
    displayName: 'Expense ID',
    name: 'expenseId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['expense'],
        operation: ['get'],
      },
    },
    description: 'ID of the expense to retrieve',
  },

  // ----------------------------------
  //         expense:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['expense'],
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
        resource: ['expense'],
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
        resource: ['expense'],
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
      {
        displayName: 'Start Date',
        name: 'startDate',
        type: 'dateTime',
        default: '',
        description: 'Only return expenses on or after this date',
      },
      {
        displayName: 'End Date',
        name: 'endDate',
        type: 'dateTime',
        default: '',
        description: 'Only return expenses on or before this date',
      },
    ],
  },

  // ----------------------------------
  //         expense:update
  // ----------------------------------
  {
    displayName: 'Expense ID',
    name: 'expenseId',
    type: 'string',
    default: '',
    required: true,
    displayOptions: {
      show: {
        resource: ['expense'],
        operation: ['update'],
      },
    },
    description: 'ID of the expense to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['expense'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'string',
        default: '',
        description: 'Updated expense amount as a decimal string (e.g. 12.50)',
      },
      {
        displayName: 'Date and Time',
        name: 'dateTime',
        type: 'dateTime',
        default: '',
        description: 'Updated date and time of the expense',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Updated description of the expense',
      },
      {
        displayName: 'Refunded',
        name: 'refunded',
        type: 'boolean',
        default: false,
        description: 'Whether the expense has been refunded',
      },
    ],
  },
];
