import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import { normalizeDateTime } from '../helpers/dateTimeHelper';

/**
 * Todo response data
 */
export interface TodoResponseData {
  id: string;
  name?: string;
  description?: string;
  projectId?: string;
  status?: number;
  dueDate?: string;
  progress?: number;
  created?: number;
  lastUpdate?: number;
}

/**
 * Create a new todo
 */
export async function createTodo(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TodoResponseData> {
  const projectIdField = this.getNodeParameter('projectId', itemIndex, {}) as IDataObject | string;
  const projectId =
    typeof projectIdField === 'object' && projectIdField.value
      ? (projectIdField.value as string)
      : (projectIdField as string);
  const name = this.getNodeParameter('name', itemIndex) as string;
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

  const dueDate = additionalFields.dueDate as string | undefined;
  const createData = {
    name,
    projectId,
    description: additionalFields.description as string | undefined,
    dueDate: dueDate !== undefined ? normalizeDateTime(dueDate) : undefined,
    assignedUsers: additionalFields.assignedUsers as string | undefined,
    estimatedHours: additionalFields.estimatedHours as number | undefined,
    estimatedMinutes: additionalFields.estimatedMinutes as number | undefined,
  };

  const todo = await client.getClient().todos.create(createData);

  return mapTodo(todo);
}

/**
 * Get a todo by ID
 */
export async function getTodo(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TodoResponseData> {
  const todoId = this.getNodeParameter('todoId', itemIndex) as string;

  const todo = await client.getClient().todos.get(todoId);

  return mapTodo(todo);
}

/**
 * Update a todo
 */
export async function updateTodo(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TodoResponseData> {
  const todoId = this.getNodeParameter('todoId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const dueDate = updateFields.dueDate as string | undefined;
  const updateData = {
    name: updateFields.name as string | undefined,
    description: updateFields.description as string | undefined,
    status: updateFields.status as number | undefined,
    dueDate: dueDate !== undefined ? normalizeDateTime(dueDate) : undefined,
    assignedUsers: updateFields.assignedUsers as string | undefined,
    estimatedHours: updateFields.estimatedHours as number | undefined,
    estimatedMinutes: updateFields.estimatedMinutes as number | undefined,
    deleted: updateFields.deleted as boolean | undefined,
  };

  const todo = await client.getClient().todos.update(todoId, updateData);

  return mapTodo(todo);
}

/**
 * Delete a todo
 */
export async function deleteTodo(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<{ success: boolean; id: string }> {
  const todoId = this.getNodeParameter('todoId', itemIndex) as string;

  await client.getClient().todos.delete(todoId);

  return {
    success: true,
    id: todoId,
  };
}

/**
 * Get many todos with optional filters and pagination
 */
export async function getManyTodos(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TodoResponseData[]> {
  const returnAll = this.getNodeParameter('returnAll', itemIndex, false);
  const filters = this.getNodeParameter('filters', itemIndex, {});

  // Extract project ID from resource locator if present
  const projectIdField = filters.projectId as IDataObject | string | undefined;
  const projectId =
    projectIdField && typeof projectIdField === 'object'
      ? (projectIdField.value as string)
      : projectIdField;

  const params = {
    projectId,
    status: filters.status as 'open' | 'closed' | undefined,
    limit: returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50),
  };

  const page = await client.getClient().todos.search(params);

  const todos = returnAll ? [] : page.items.slice(0, params.limit);

  if (returnAll) {
    let currentPage = page;
    todos.push(...currentPage.items);

    while (currentPage.hasNextPage) {
      currentPage = await currentPage.nextPage();
      todos.push(...currentPage.items);
    }
  }

  return todos.map(mapTodo);
}

interface RawTodo {
  id: string;
  name?: string;
  description?: string;
  status?: number;
  dueDate?: string;
  progress?: number;
  created?: number;
  lastUpdate?: number;
  project?: { id: string };
}

function mapTodo(todo: RawTodo): TodoResponseData {
  return {
    id: todo.id,
    name: todo.name,
    description: todo.description,
    projectId: todo.project?.id,
    status: todo.status,
    dueDate: todo.dueDate,
    progress: todo.progress,
    created: todo.created,
    lastUpdate: todo.lastUpdate,
  };
}
