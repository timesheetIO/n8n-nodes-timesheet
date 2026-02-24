import type { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

export class TimesheetOAuth2Api implements ICredentialType {
  name = 'timesheetOAuth2Api';
  extends = ['oAuth2Api'];
  displayName = 'Timesheet OAuth2 API';
  documentationUrl = 'https://api.timesheet.io';
  properties: INodeProperties[] = [
    {
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'authorizationCode',
    },
    {
      displayName: 'Authorization URL',
      name: 'authUrl',
      type: 'hidden',
      default: 'https://api.timesheet.io/oauth2/auth',
    },
    {
      displayName: 'Access Token URL',
      name: 'accessTokenUrl',
      type: 'hidden',
      default: 'https://api.timesheet.io/oauth2/token',
    },
    {
      displayName: 'Scope',
      name: 'scope',
      type: 'string',
      default: 'read write',
      required: false,
      description: 'OAuth2 scopes (optional)',
    },
    {
      displayName: 'Auth URI Query Parameters',
      name: 'authQueryParameters',
      type: 'hidden',
      default: 'response_type=code',
    },
    {
      displayName: 'Authentication',
      name: 'authentication',
      type: 'hidden',
      default: 'body',
      description: 'Send credentials in request body',
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

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.baseUrl}}',
      url: '/v1/profiles/me',
      method: 'GET',
    },
  };
}
