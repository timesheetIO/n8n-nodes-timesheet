import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class TimesheetApi implements ICredentialType {
  name = 'timesheetApi';
  displayName = 'Timesheet API';
  documentationUrl = 'https://api.timesheet.io';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: { password: true },
      default: '',
      required: true,
      description:
        'API Key from https://my.timesheet.io/development in format: ts_{prefix}.{secret}',
    },
    {
      displayName: 'Base URL',
      name: 'baseUrl',
      type: 'string',
      default: 'https://api.timesheet.io',
      required: false,
      description:
        'Base URL for API requests (default: https://api.timesheet.io - SDK will append /v1 automatically)',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        Authorization: '={{"ApiKey " + $credentials.apiKey}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/v1/profiles/me',
      method: 'GET',
    },
  };
}
