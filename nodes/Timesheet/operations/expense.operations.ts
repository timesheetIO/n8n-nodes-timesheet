import type { IExecuteFunctions } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import { normalizeDateTime } from '../helpers/dateTimeHelper';

/**
 * Expense response data
 */
export interface ExpenseResponseData {
  id: string;
  taskId?: string;
  description?: string;
  dateTime?: string;
  amount?: string;
  refunded?: boolean;
  fileName?: string;
  created?: number;
  lastUpdate?: number;
}

/**
 * Create a new expense
 */
export async function createExpense(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ExpenseResponseData> {
  const taskId = this.getNodeParameter('taskId', itemIndex) as string;
  const dateTime = this.getNodeParameter('dateTime', itemIndex) as string;
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

  const createData = {
    taskId,
    dateTime: normalizeDateTime(dateTime)!,
    description: additionalFields.description as string | undefined,
    amount: additionalFields.amount as string | undefined,
    refunded: additionalFields.refunded as boolean | undefined,
  };

  const expense = await client.getClient().expenses.create(createData);

  return mapExpense(expense);
}

/**
 * Get an expense by ID
 */
export async function getExpense(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ExpenseResponseData> {
  const expenseId = this.getNodeParameter('expenseId', itemIndex) as string;

  const expense = await client.getClient().expenses.get(expenseId);

  return mapExpense(expense);
}

/**
 * Update an expense
 */
export async function updateExpense(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ExpenseResponseData> {
  const expenseId = this.getNodeParameter('expenseId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const dateTime = updateFields.dateTime as string | undefined;
  const updateData = {
    description: updateFields.description as string | undefined,
    dateTime: dateTime !== undefined ? normalizeDateTime(dateTime) : undefined,
    amount: updateFields.amount as string | undefined,
    refunded: updateFields.refunded as boolean | undefined,
  };

  const expense = await client.getClient().expenses.update(expenseId, updateData);

  return mapExpense(expense);
}

/**
 * Delete an expense
 */
export async function deleteExpense(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<{ success: boolean; id: string }> {
  const expenseId = this.getNodeParameter('expenseId', itemIndex) as string;

  await client.getClient().expenses.delete(expenseId);

  return {
    success: true,
    id: expenseId,
  };
}

/**
 * Get many expenses with optional filters and pagination
 */
export async function getManyExpenses(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ExpenseResponseData[]> {
  const returnAll = this.getNodeParameter('returnAll', itemIndex, false);
  const filters = this.getNodeParameter('filters', itemIndex, {});

  const params = {
    taskId: filters.taskId as string | undefined,
    startDate: filters.startDate as string | undefined,
    endDate: filters.endDate as string | undefined,
    limit: returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50),
  };

  const page = await client.getClient().expenses.search(params);

  const expenses = returnAll ? [] : page.items.slice(0, params.limit);

  if (returnAll) {
    let currentPage = page;
    expenses.push(...currentPage.items);

    while (currentPage.hasNextPage) {
      currentPage = await currentPage.nextPage();
      expenses.push(...currentPage.items);
    }
  }

  return expenses.map(mapExpense);
}

interface RawExpense {
  id: string;
  description?: string;
  dateTime?: string;
  amount?: string;
  refunded?: boolean;
  fileName?: string;
  created?: number;
  lastUpdate?: number;
  task?: { id: string };
}

function mapExpense(expense: RawExpense): ExpenseResponseData {
  return {
    id: expense.id,
    taskId: expense.task?.id,
    description: expense.description,
    dateTime: expense.dateTime,
    amount: expense.amount,
    refunded: expense.refunded,
    fileName: expense.fileName,
    created: expense.created,
    lastUpdate: expense.lastUpdate,
  };
}
