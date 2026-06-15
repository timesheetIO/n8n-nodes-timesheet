import type { IExecuteFunctions } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import { normalizeDateTime } from '../helpers/dateTimeHelper';

/**
 * Note response data
 */
export interface NoteResponseData {
  id: string;
  taskId?: string;
  text?: string;
  dateTime?: string;
  uri?: string;
  created?: number;
  lastUpdate?: number;
}

/**
 * Create a new note
 */
export async function createNote(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<NoteResponseData> {
  const taskId = this.getNodeParameter('taskId', itemIndex) as string;
  const text = this.getNodeParameter('text', itemIndex) as string;
  const dateTime = this.getNodeParameter('dateTime', itemIndex) as string;
  const additionalFields = this.getNodeParameter('additionalFields', itemIndex, {});

  const createData = {
    taskId,
    text,
    dateTime: normalizeDateTime(dateTime)!,
    uri: additionalFields.uri as string | undefined,
    driveId: additionalFields.driveId as string | undefined,
  };

  const note = await client.getClient().notes.create(createData);

  return mapNote(note);
}

/**
 * Get a note by ID
 */
export async function getNote(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<NoteResponseData> {
  const noteId = this.getNodeParameter('noteId', itemIndex) as string;

  const note = await client.getClient().notes.get(noteId);

  return mapNote(note);
}

/**
 * Update a note
 */
export async function updateNote(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<NoteResponseData> {
  const noteId = this.getNodeParameter('noteId', itemIndex) as string;
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const dateTime = updateFields.dateTime as string | undefined;
  const updateData = {
    text: updateFields.text as string | undefined,
    dateTime: dateTime !== undefined ? normalizeDateTime(dateTime) : undefined,
    uri: updateFields.uri as string | undefined,
    driveId: updateFields.driveId as string | undefined,
  };

  const note = await client.getClient().notes.update(noteId, updateData);

  return mapNote(note);
}

/**
 * Delete a note
 */
export async function deleteNote(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<{ success: boolean; id: string }> {
  const noteId = this.getNodeParameter('noteId', itemIndex) as string;

  await client.getClient().notes.delete(noteId);

  return {
    success: true,
    id: noteId,
  };
}

/**
 * Get many notes with optional filters and pagination
 */
export async function getManyNotes(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<NoteResponseData[]> {
  const returnAll = this.getNodeParameter('returnAll', itemIndex, false);
  const filters = this.getNodeParameter('filters', itemIndex, {});

  const params = {
    taskId: filters.taskId as string | undefined,
    startDate: filters.startDate as string | undefined,
    endDate: filters.endDate as string | undefined,
    limit: returnAll ? undefined : this.getNodeParameter('limit', itemIndex, 50),
  };

  const page = await client.getClient().notes.search(params);

  const notes = returnAll ? [] : page.items.slice(0, params.limit);

  if (returnAll) {
    let currentPage = page;
    notes.push(...currentPage.items);

    while (currentPage.hasNextPage) {
      currentPage = await currentPage.nextPage();
      notes.push(...currentPage.items);
    }
  }

  return notes.map(mapNote);
}

interface RawNote {
  id: string;
  text?: string;
  dateTime?: string;
  uri?: string;
  created?: number;
  lastUpdate?: number;
  task?: { id: string };
}

function mapNote(note: RawNote): NoteResponseData {
  return {
    id: note.id,
    taskId: note.task?.id,
    text: note.text,
    dateTime: note.dateTime,
    uri: note.uri,
    created: note.created,
    lastUpdate: note.lastUpdate,
  };
}
