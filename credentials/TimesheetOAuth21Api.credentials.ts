import type { ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

/**
 * Timesheet OAuth 2.1 API Credentials
 *
 * Implements OAuth 2.1 authentication with PKCE (Proof Key for Code Exchange).
 *
 * OAuth 2.1 key features:
 * - PKCE is REQUIRED for all clients (not just public clients)
 * - S256 code challenge method (more secure than plain)
 * - Automatic token refresh
 *
 * This credential uses n8n's built-in PKCE grant type support.
 */
export class TimesheetOAuth21Api implements ICredentialType {
  name = 'timesheetOAuth21Api';
  extends = ['oAuth2Api'];
  displayName = 'Timesheet OAuth 2.1 API (PKCE)';
  documentationUrl = 'https://api.timesheet.io/docs/oauth21';
  properties: INodeProperties[] = [
    {
      displayName: 'Grant Type',
      name: 'grantType',
      type: 'hidden',
      default: 'pkce',
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
      description: 'OAuth2 scopes (space-separated). Default: read write',
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
