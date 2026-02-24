import type { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
      },
    },
    options: [
      {
        name: 'Create',
        value: 'create',
        description: 'Create a new webhook',
        action: 'Create webhook',
      },
      {
        name: 'Delete',
        value: 'delete',
        description: 'Delete a webhook',
        action: 'Delete webhook',
      },
      {
        name: 'Get',
        value: 'get',
        description: 'Get a webhook',
        action: 'Get webhook',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many webhooks',
        action: 'Get many webhooks',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update a webhook',
        action: 'Update webhook',
      },
    ],
    default: 'create',
  },
];

export const webhookFields: INodeProperties[] = [
  // ----------------------------------
  //         webhook:create
  // ----------------------------------
  {
    displayName: 'Target URL',
    name: 'target',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['create'],
      },
    },
    default: '',
    placeholder: 'https://example.com/webhook',
    description: 'The URL to send webhook notifications to',
  },
  {
    displayName: 'Event',
    name: 'event',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['create'],
      },
    },
    options: [
      {
        name: 'Timer Start',
        value: 'timer.start',
        description: 'Triggered when a timer is started',
      },
      {
        name: 'Timer Stop',
        value: 'timer.stop',
        description: 'Triggered when a timer is stopped',
      },
      {
        name: 'Timer Pause',
        value: 'timer.pause',
        description: 'Triggered when a timer is paused',
      },
      {
        name: 'Timer Resume',
        value: 'timer.resume',
        description: 'Triggered when a timer is resumed',
      },
      {
        name: 'Task Create',
        value: 'task.create',
        description: 'Triggered when a task is created',
      },
      {
        name: 'Task Update',
        value: 'task.update',
        description: 'Triggered when a task is updated',
      },
      {
        name: 'Project Create',
        value: 'project.create',
        description: 'Triggered when a project is created',
      },
      {
        name: 'Project Update',
        value: 'project.update',
        description: 'Triggered when a project is updated',
      },
      {
        name: 'Team Create',
        value: 'team.create',
        description: 'Triggered when a team is created',
      },
      {
        name: 'Team Update',
        value: 'team.update',
        description: 'Triggered when a team is updated',
      },
      {
        name: 'Todo Create',
        value: 'todo.create',
        description: 'Triggered when a todo is created',
      },
      {
        name: 'Todo Update',
        value: 'todo.update',
        description: 'Triggered when a todo is updated',
      },
      {
        name: 'Tag Create',
        value: 'tag.create',
        description: 'Triggered when a tag is created',
      },
      {
        name: 'Tag Update',
        value: 'tag.update',
        description: 'Triggered when a tag is updated',
      },
      {
        name: 'Rate Create',
        value: 'rate.create',
        description: 'Triggered when a rate is created',
      },
      {
        name: 'Rate Update',
        value: 'rate.update',
        description: 'Triggered when a rate is updated',
      },
    ],
    default: 'timer.start',
    description: 'The event that will trigger this webhook',
  },

  // ----------------------------------
  //         webhook:delete
  // ----------------------------------
  {
    displayName: 'Webhook ID',
    name: 'webhookId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['delete'],
      },
    },
    default: '',
    description: 'The ID of the webhook to delete',
  },

  // ----------------------------------
  //         webhook:get
  // ----------------------------------
  {
    displayName: 'Webhook ID',
    name: 'webhookId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['get'],
      },
    },
    default: '',
    description: 'The ID of the webhook to retrieve',
  },

  // ----------------------------------
  //         webhook:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['webhook'],
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
        resource: ['webhook'],
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
        resource: ['webhook'],
        operation: ['getMany'],
      },
    },
    options: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          {
            name: 'Timer Start',
            value: 'timer.start',
          },
          {
            name: 'Timer Stop',
            value: 'timer.stop',
          },
          {
            name: 'Timer Pause',
            value: 'timer.pause',
          },
          {
            name: 'Timer Resume',
            value: 'timer.resume',
          },
          {
            name: 'Task Create',
            value: 'task.create',
          },
          {
            name: 'Task Update',
            value: 'task.update',
          },
          {
            name: 'Project Create',
            value: 'project.create',
          },
          {
            name: 'Project Update',
            value: 'project.update',
          },
          {
            name: 'Team Create',
            value: 'team.create',
          },
          {
            name: 'Team Update',
            value: 'team.update',
          },
          {
            name: 'Todo Create',
            value: 'todo.create',
          },
          {
            name: 'Todo Update',
            value: 'todo.update',
          },
          {
            name: 'Tag Create',
            value: 'tag.create',
          },
          {
            name: 'Tag Update',
            value: 'tag.update',
          },
          {
            name: 'Rate Create',
            value: 'rate.create',
          },
          {
            name: 'Rate Update',
            value: 'rate.update',
          },
        ],
        default: 'timer.start',
        description: 'Filter by event type',
      },
      {
        displayName: 'Sort',
        name: 'sort',
        type: 'options',
        options: [
          {
            name: 'Created',
            value: 'created',
          },
          {
            name: 'Last Update',
            value: 'lastUpdate',
          },
          {
            name: 'Target',
            value: 'target',
          },
          {
            name: 'Event',
            value: 'event',
          },
        ],
        default: 'created',
        description: 'Sort webhooks by field',
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
        default: 'desc',
        description: 'Sort order',
      },
    ],
  },

  // ----------------------------------
  //         webhook:update
  // ----------------------------------
  {
    displayName: 'Webhook ID',
    name: 'webhookId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['update'],
      },
    },
    default: '',
    description: 'The ID of the webhook to update',
  },
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Target URL',
        name: 'target',
        type: 'string',
        default: '',
        placeholder: 'https://example.com/webhook',
        description: 'The URL to send webhook notifications to',
      },
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          {
            name: 'Timer Start',
            value: 'timer.start',
          },
          {
            name: 'Timer Stop',
            value: 'timer.stop',
          },
          {
            name: 'Timer Pause',
            value: 'timer.pause',
          },
          {
            name: 'Timer Resume',
            value: 'timer.resume',
          },
          {
            name: 'Task Create',
            value: 'task.create',
          },
          {
            name: 'Task Update',
            value: 'task.update',
          },
          {
            name: 'Project Create',
            value: 'project.create',
          },
          {
            name: 'Project Update',
            value: 'project.update',
          },
          {
            name: 'Team Create',
            value: 'team.create',
          },
          {
            name: 'Team Update',
            value: 'team.update',
          },
          {
            name: 'Todo Create',
            value: 'todo.create',
          },
          {
            name: 'Todo Update',
            value: 'todo.update',
          },
          {
            name: 'Tag Create',
            value: 'tag.create',
          },
          {
            name: 'Tag Update',
            value: 'tag.update',
          },
          {
            name: 'Rate Create',
            value: 'rate.create',
          },
          {
            name: 'Rate Update',
            value: 'rate.update',
          },
        ],
        default: 'timer.start',
        description: 'The event that will trigger this webhook',
      },
    ],
  },
];
