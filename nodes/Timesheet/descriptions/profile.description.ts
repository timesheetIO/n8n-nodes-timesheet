import type { INodeProperties } from 'n8n-workflow';

export const profileOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['profile'],
      },
    },
    options: [
      {
        name: 'Get',
        value: 'get',
        description: 'Get user profile',
        action: 'Get profile',
      },
      {
        name: 'Update',
        value: 'update',
        description: 'Update user profile',
        action: 'Update profile',
      },
    ],
    default: 'get',
  },
];

export const profileFields: INodeProperties[] = [
  // ----------------------------------
  //         profile:get
  // ----------------------------------
  {
    displayName: 'Note',
    name: 'notice',
    type: 'notice',
    default: '',
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['get'],
      },
    },
    description: 'Returns your user profile including email, name, image, and account settings.',
  },

  // ----------------------------------
  //         profile:update
  // ----------------------------------
  {
    displayName: 'Update Fields',
    name: 'updateFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['profile'],
        operation: ['update'],
      },
    },
    options: [
      {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        default: '',
        description: 'User email address',
      },
      {
        displayName: 'First Name',
        name: 'firstname',
        type: 'string',
        default: '',
        description: 'User first name',
      },
      {
        displayName: 'Last Name',
        name: 'lastname',
        type: 'string',
        default: '',
        description: 'User last name',
      },
      {
        displayName: 'Image URL',
        name: 'imageUrl',
        type: 'string',
        default: '',
        description: 'Profile image URL',
      },
      {
        displayName: 'Newsletter',
        name: 'newsletter',
        type: 'boolean',
        default: false,
        description: 'Whether to receive newsletter emails',
      },
    ],
  },
];
