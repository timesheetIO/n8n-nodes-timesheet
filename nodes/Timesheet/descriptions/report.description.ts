import type { INodeProperties } from 'n8n-workflow';

export const reportOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['report'],
      },
    },
    options: [
      {
        name: 'Get Document Report',
        value: 'getDocumentReport',
        description: 'Get document report data (invoice/timesheet)',
        action: 'Get document report data',
      },
      {
        name: 'Get Document PDF',
        value: 'getDocumentPdf',
        description: 'Generate and download a document PDF',
        action: 'Get document PDF',
      },
      {
        name: 'Get Document XML',
        value: 'getDocumentXml',
        description: 'Get document XML (e-invoice format)',
        action: 'Get document XML',
      },
      {
        name: 'Get Task Report',
        value: 'getTaskReport',
        description: 'Get task report data',
        action: 'Get task report data',
      },
      {
        name: 'Get Task PDF',
        value: 'getTaskPdf',
        description: 'Generate and download a task PDF',
        action: 'Get task PDF',
      },
      {
        name: 'Get Expense Report',
        value: 'getExpenseReport',
        description: 'Get expense report data',
        action: 'Get expense report data',
      },
      {
        name: 'Get Expense PDF',
        value: 'getExpensePdf',
        description: 'Generate and download an expense PDF',
        action: 'Get expense PDF',
      },
      {
        name: 'Get Note Report',
        value: 'getNoteReport',
        description: 'Get note report data',
        action: 'Get note report data',
      },
      {
        name: 'Get Note PDF',
        value: 'getNotePdf',
        description: 'Generate and download a note PDF',
        action: 'Get note PDF',
      },
    ],
    default: 'getDocumentReport',
  },
];

export const reportFields: INodeProperties[] = [
  // Document ID field
  {
    displayName: 'Document ID',
    name: 'documentId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['report'],
        operation: ['getDocumentReport', 'getDocumentPdf', 'getDocumentXml'],
      },
    },
    default: '',
    description: 'The ID of the document (invoice/timesheet)',
  },

  // Task ID field
  {
    displayName: 'Task ID',
    name: 'taskId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['report'],
        operation: ['getTaskReport', 'getTaskPdf'],
      },
    },
    default: '',
    description: 'The ID of the task/time entry',
  },

  // Expense ID field
  {
    displayName: 'Expense ID',
    name: 'expenseId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['report'],
        operation: ['getExpenseReport', 'getExpensePdf'],
      },
    },
    default: '',
    description: 'The ID of the expense',
  },

  // Note ID field
  {
    displayName: 'Note ID',
    name: 'noteId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['report'],
        operation: ['getNoteReport', 'getNotePdf'],
      },
    },
    default: '',
    description: 'The ID of the note',
  },

  // PDF Output notice
  {
    displayName: 'Note',
    name: 'pdfNotice',
    type: 'notice',
    default: '',
    displayOptions: {
      show: {
        resource: ['report'],
        operation: ['getDocumentPdf', 'getTaskPdf', 'getExpensePdf', 'getNotePdf'],
      },
    },
    // eslint-disable-next-line n8n-nodes-base/node-param-description-miscased-id
    description:
      'PDF data will be returned as base64 encoded string. You can use this with the "Convert to File" node to save as a file.',
  },

  // XML Output notice
  {
    displayName: 'Note',
    name: 'xmlNotice',
    type: 'notice',
    default: '',
    displayOptions: {
      show: {
        resource: ['report'],
        operation: ['getDocumentXml'],
      },
    },
    description:
      'Returns e-invoice XML format based on document settings (Zugferd/XRechnung, ebInterface, or plain XML).',
  },
];
