import type { IExecuteFunctions } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import type { WebhookResponseData } from '../types';

/**
 * Create a new webhook
 */
export async function createWebhook(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<WebhookResponseData> {
  const target = this.getNodeParameter('target', itemIndex) as string;
  const event = this.getNodeParameter('event', itemIndex) as string;

  const createData = {
    target,
    event,
  };

  const webhook = await client.getClient().webhooks.create(createData);

  return {
    id: webhook.id,
    target: webhook.target,
    event: webhook.event,
    created: webhook.created,
    lastUpdate: webhook.lastUpdate,
  };
}

/**
 * Get a webhook by ID
 */
export async function getWebhook(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<WebhookResponseData> {
  const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;

  const webhook = await client.getClient().webhooks.get(webhookId);

  return {
    id: webhook.id,
    target: webhook.target,
    event: webhook.event,
    created: webhook.created,
    lastUpdate: webhook.lastUpdate,
  };
}

/**
 * Update a webhook
 */
export async function updateWebhook(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<WebhookResponseData> {
  const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const updateData = {
    target: updateFields.target as string | undefined,
    event: updateFields.event as string | undefined,
  };

  const webhook = await client.getClient().webhooks.update(webhookId, updateData);

  return {
    id: webhook.id,
    target: webhook.target,
    event: webhook.event,
    created: webhook.created,
    lastUpdate: webhook.lastUpdate,
  };
}

/**
 * Delete a webhook
 */
export async function deleteWebhook(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<{ success: boolean }> {
  const webhookId = this.getNodeParameter('webhookId', itemIndex) as string;

  await client.getClient().webhooks.delete(webhookId);

  return { success: true };
}

/**
 * Get many webhooks with optional filters
 */
export async function getManyWebhooks(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<WebhookResponseData[]> {
  const returnAll = this.getNodeParameter('returnAll', itemIndex, false);
  const filters = this.getNodeParameter('filters', itemIndex, {});

  const params = {
    event: filters.event as string | undefined,
    sort: filters.sort as 'created' | 'lastUpdate' | 'target' | 'event' | undefined,
    order: filters.order as 'asc' | 'desc' | undefined,
    limit: returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50),
  };

  const page = await client.getClient().webhooks.search(params);

  const webhooks = returnAll ? [] : page.items.slice(0, params.limit as number);

  if (returnAll) {
    let currentPage = page;
    webhooks.push(...currentPage.items);

    while (currentPage.hasNextPage) {
      currentPage = await currentPage.nextPage();
      webhooks.push(...currentPage.items);
    }
  }

  return webhooks.map((webhook) => ({
    id: webhook.id,
    target: webhook.target,
    event: webhook.event,
    created: webhook.created,
    lastUpdate: webhook.lastUpdate,
  }));
}
