import type { INodeProperties } from 'n8n-workflow';

export const organizationOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['organization'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get an organization',
        action: 'Get an organization',
      },
      {
        name: 'Get Many',
        value: 'getMany',
        description: 'Get many organizations',
        action: 'Get many organizations',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update an organization',
        action: 'Update an organization',
      },
    ],
    default: 'get',
  },
];

const organizationLocator: INodeProperties = {
  displayName: 'Organization',
  name: 'organizationId',
  type: 'resourceLocator',
  default: { mode: 'list', value: '' },
  required: true,
  description: 'The organization to act on',
  displayOptions: {
    show: {
      resource: ['organization'],
      operation: ['get', 'update'],
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
};

export const organizationFields: INodeProperties[] = [
  // ----------------------------------
  //         organization:get / update
  // ----------------------------------
  organizationLocator,

  // ----------------------------------
  //         organization:update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['organization'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Updated name of the organization',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'Updated description of the organization',
      },
      {
        displayName: 'Color',
        name: 'color',
        type: 'number',
        default: 0,
        description: 'Color code for the organization',
      },
      {
        displayName: 'AI Chat Enabled',
        name: 'aiChatEnabled',
        type: 'boolean',
        default: false,
        description: 'Whether the AI chat assistant is enabled for this organization',
      },
    ],
  },

  // ----------------------------------
  //         organization:getMany
  // ----------------------------------
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['organization'],
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
        resource: ['organization'],
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
