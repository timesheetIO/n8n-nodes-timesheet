import type { IExecuteFunctions } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import type {
  DocumentReportResponseData,
  TaskReportResponseData,
  ExpenseReportResponseData,
  NoteReportResponseData,
  PdfResponseData,
  XmlResponseData,
} from '../types';

/**
 * Report operation handlers
 */

// Document Report Operations

export async function getDocumentReport(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<DocumentReportResponseData> {
  const documentId = this.getNodeParameter('documentId', itemIndex) as string;

  const report = await client.getClient().reports.documents.get(documentId);

  return {
    documentTitle: report.documentTitle,
    documentDate: report.documentDate,
    invoiceNumber: report.invoiceNumber,
    customerNumber: report.customerNumber,
    companyName: report.companyName,
    customerName: report.customerName,
    subtotalAmount: report.subtotalAmount,
    taxRate: report.taxRate,
    taxAmount: report.taxAmount,
    totalAmount: report.totalAmount,
    totalDuration: report.totalDuration,
    taskSubtotal: report.taskSubtotal,
    expenseSubtotal: report.expenseSubtotal,
    eInvoiceType: report.eInvoiceType,
    showTaskTime: report.showTaskTime,
    showRates: report.showRates,
    showTaxes: report.showTaxes,
    includeExpenses: report.includeExpenses,
    includeNotes: report.includeNotes,
    taskCount: report.tasks?.length ?? 0,
    expenseCount: report.expenses?.length ?? 0,
    noteCount: report.notes?.length ?? 0,
    tasks: report.tasks,
    expenses: report.expenses,
    notes: report.notes,
  };
}

export async function getDocumentPdf(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<PdfResponseData> {
  const documentId = this.getNodeParameter('documentId', itemIndex) as string;

  const pdfData = await client.getClient().reports.documents.getPdf(documentId);

  // Convert ArrayBuffer to base64
  const base64Data = Buffer.from(pdfData).toString('base64');

  return {
    id: documentId,
    type: 'document',
    data: base64Data,
    dataType: 'base64',
    mimeType: 'application/pdf',
    filename: `document-${documentId}.pdf`,
  };
}

export async function getDocumentXml(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<XmlResponseData> {
  const documentId = this.getNodeParameter('documentId', itemIndex) as string;

  const xmlData = await client.getClient().reports.documents.getXml(documentId);

  return {
    id: documentId,
    type: 'document',
    data: xmlData,
    dataType: 'xml',
    mimeType: 'application/xml',
    filename: `document-${documentId}.xml`,
  };
}

// Task Report Operations

export async function getTaskReport(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<TaskReportResponseData> {
  const taskId = this.getNodeParameter('taskId', itemIndex) as string;

  const report = await client.getClient().reports.tasks.get(taskId);

  return {
    taskId: report.taskId,
    taskDate: report.taskDate,
    taskStartTime: report.taskStartTime,
    taskEndTime: report.taskEndTime,
    taskTimeRange: report.taskTimeRange,
    taskDuration: report.taskDuration,
    taskDurationRelative: report.taskDurationRelative,
    pauseDuration: report.pauseDuration,
    taskDescription: report.taskDescription,
    taskLocation: report.taskLocation,
    taskRateName: report.taskRateName,
    taskRate: report.taskRate,
    taskTotal: report.taskTotal,
    projectName: report.projectName,
    projectClient: report.projectClient,
    memberName: report.memberName,
    taskTags: report.taskTags,
    durationSeconds: report.durationSeconds,
    quantityHours: report.quantityHours,
    unitPriceNumeric: report.unitPriceNumeric,
    lineTotalNumeric: report.lineTotalNumeric,
    billable: report.billable,
    paid: report.paid,
  };
}

export async function getTaskPdf(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<PdfResponseData> {
  const taskId = this.getNodeParameter('taskId', itemIndex) as string;

  const pdfData = await client.getClient().reports.tasks.getPdf(taskId);

  // Convert ArrayBuffer to base64
  const base64Data = Buffer.from(pdfData).toString('base64');

  return {
    id: taskId,
    type: 'task',
    data: base64Data,
    dataType: 'base64',
    mimeType: 'application/pdf',
    filename: `task-${taskId}.pdf`,
  };
}

// Expense Report Operations

export async function getExpenseReport(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<ExpenseReportResponseData> {
  const expenseId = this.getNodeParameter('expenseId', itemIndex) as string;

  const report = await client.getClient().reports.expenses.get(expenseId);

  return {
    expenseId: report.expenseId,
    expenseDate: report.expenseDate,
    expenseTime: report.expenseTime,
    expenseAmount: report.expenseAmount,
    expenseDescription: report.expenseDescription,
    expenseDescriptionRaw: report.expenseDescriptionRaw,
    expenseDateTimeRaw: report.expenseDateTimeRaw,
    expenseAuthor: report.expenseAuthor,
    amountNumeric: report.amountNumeric,
    hasAttachment: !!report.attachmentBase64,
  };
}

export async function getExpensePdf(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<PdfResponseData> {
  const expenseId = this.getNodeParameter('expenseId', itemIndex) as string;

  const pdfData = await client.getClient().reports.expenses.getPdf(expenseId);

  // Convert ArrayBuffer to base64
  const base64Data = Buffer.from(pdfData).toString('base64');

  return {
    id: expenseId,
    type: 'expense',
    data: base64Data,
    dataType: 'base64',
    mimeType: 'application/pdf',
    filename: `expense-${expenseId}.pdf`,
  };
}

// Note Report Operations

export async function getNoteReport(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<NoteReportResponseData> {
  const noteId = this.getNodeParameter('noteId', itemIndex) as string;

  const report = await client.getClient().reports.notes.get(noteId);

  return {
    noteId,
    noteDate: report.noteDate,
    noteContent: report.noteContent,
    noteType: report.noteType,
    noteAuthor: report.noteAuthor,
    hasAttachment: !!report.attachmentBase64,
  };
}

export async function getNotePdf(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<PdfResponseData> {
  const noteId = this.getNodeParameter('noteId', itemIndex) as string;

  const pdfData = await client.getClient().reports.notes.getPdf(noteId);

  // Convert ArrayBuffer to base64
  const base64Data = Buffer.from(pdfData).toString('base64');

  return {
    id: noteId,
    type: 'note',
    data: base64Data,
    dataType: 'base64',
    mimeType: 'application/pdf',
    filename: `note-${noteId}.pdf`,
  };
}
