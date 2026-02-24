import type {
  IExecuteFunctions,
  ILoadOptionsFunctions,
  IHookFunctions,
  IDataObject,
} from 'n8n-workflow';
import { TimesheetClient } from '@timesheet/sdk';

const DEFAULT_BASE_URL = 'https://api.timesheet.io';

interface TimesheetClientOptions {
  apiKey?: string;
  oauth2Token?: string;
  baseUrl?: string;
}

export class TimesheetApiClient {
  private client: TimesheetClient;

  constructor(options: TimesheetClientOptions) {
    const baseUrl = options.baseUrl || DEFAULT_BASE_URL;

    if (options.apiKey) {
      this.client = new TimesheetClient({
        baseUrl,
        apiKey: options.apiKey,
      });
    } else if (options.oauth2Token) {
      this.client = new TimesheetClient({
        baseUrl,
        oauth2Token: options.oauth2Token,
      });
    } else {
      throw new Error('Either apiKey or oauth2Token must be provided');
    }
  }

  /**
   * Create client instance from IExecuteFunctions context
   */
  static async fromExecute(
    context: IExecuteFunctions,
    itemIndex: number,
  ): Promise<TimesheetApiClient> {
    const authMode = context.getNodeParameter('authentication', itemIndex) as string;

    if (authMode === 'apiKey') {
      const credentials = await context.getCredentials('timesheetApi', itemIndex);
      return new TimesheetApiClient({
        baseUrl: (credentials.baseUrl as string) || undefined,
        apiKey: credentials.apiKey as string,
      });
    }

    // OAuth2
    const credentials = await context.getCredentials('timesheetOAuth2Api', itemIndex);
    const oauthToken = credentials.oauthTokenData as IDataObject;
    const accessToken = oauthToken.access_token as string;

    return new TimesheetApiClient({
      baseUrl: (credentials.baseUrl as string) || undefined,
      oauth2Token: accessToken,
    });
  }

  /**
   * Create client instance from ILoadOptionsFunctions context
   * (for dynamic dropdowns and resource locators)
   * Only supports API Key authentication for load options.
   */
  static async fromLoadOptions(context: ILoadOptionsFunctions): Promise<TimesheetApiClient> {
    const credentials = await context.getCredentials('timesheetApi');
    return new TimesheetApiClient({
      baseUrl: (credentials.baseUrl as string) || undefined,
      apiKey: credentials.apiKey as string,
    });
  }

  /**
   * Create client instance from IHookFunctions context
   * (for webhook triggers)
   */
  static async fromHook(context: IHookFunctions): Promise<TimesheetApiClient> {
    const authMode = context.getNodeParameter('authentication', 0) as string;

    if (authMode === 'apiKey') {
      const credentials = await context.getCredentials('timesheetApi');
      return new TimesheetApiClient({
        baseUrl: (credentials.baseUrl as string) || undefined,
        apiKey: credentials.apiKey as string,
      });
    }

    // OAuth2
    const credentials = await context.getCredentials('timesheetOAuth2Api');
    const oauthToken = credentials.oauthTokenData as IDataObject;
    const accessToken = oauthToken.access_token as string;

    return new TimesheetApiClient({
      baseUrl: (credentials.baseUrl as string) || undefined,
      oauth2Token: accessToken,
    });
  }

  /**
   * Get the underlying SDK client
   */
  getClient(): TimesheetClient {
    return this.client;
  }

  /**
   * Helper for paginated list operations
   */
  async paginate<T>(
    fetchPage: (page: number) => Promise<{ items: T[]; hasMore: boolean }>,
    options: { returnAll: boolean; limit: number },
  ): Promise<T[]> {
    const { returnAll, limit } = options;
    const results: T[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore && (returnAll || results.length < limit)) {
      const response = await fetchPage(page);
      results.push(...response.items);
      hasMore = response.hasMore;
      page++;

      if (!returnAll && results.length >= limit) {
        return results.slice(0, limit);
      }
    }

    return results;
  }
}
