/**
 * Type definitions for Timesheet n8n node operations
 */

import type { Project, Task, Rate, Webhook } from '@timesheet/sdk';

/**
 * Timer response data
 */
export interface TimerResponseData {
  status: string;
  projectId?: string;
  projectTitle?: string;
  duration: number;
  startDateTime?: string;
}

/**
 * Project response data with optional team ID
 */
export interface ProjectResponseData {
  id: string;
  title: string;
  description?: string;
  color?: number;
  archived?: boolean;
  teamId?: string;
}

/**
 * Task response data with duration breakdown
 */
export interface TaskResponseData {
  id: string;
  projectId?: string;
  projectTitle?: string;
  description?: string;
  startDateTime?: string;
  endDateTime?: string;
  duration: number;
  hours: number;
  minutes: number;
  billable?: boolean;
  billed?: boolean;
  paid?: boolean;
  tags?: Array<{
    id: string;
    name: string;
    color?: number;
  }>;
}

/**
 * SDK types extended with additional fields
 */
export interface ExtendedProject extends Project {
  teamId?: string;
}

export interface ExtendedTask extends Task {
  project?: {
    id: string;
    title: string;
    color?: number;
  };
  tags?: Array<{
    id: string;
    name: string;
    color?: number;
  }>;
}

/**
 * Tag response data
 */
export interface TagResponseData {
  id: string;
  name: string;
  color?: number;
  teamId?: string;
  archived?: boolean;
  created?: number;
  lastUpdate?: number;
}

/**
 * Rate response data
 */
export interface RateResponseData {
  id: string;
  title: string;
  factor: number;
  extra?: number;
  enabled?: boolean;
  archived?: boolean;
  teamId?: string;
  created?: number;
  lastUpdate?: number;
}

/**
 * Extended Rate type - Rate already has team property from SDK
 */
export type ExtendedRate = Rate;

/**
 * Profile response data
 */
export interface ProfileResponseData {
  email?: string;
  imageUrl?: string;
  firstname?: string;
  lastname?: string;
  newsletter?: boolean;
  activated?: boolean;
  user?: string;
  subscriptionId?: string;
  expires?: number;
  status?: number;
  plan?: number;
  valid?: boolean;
  expired?: boolean;
  product?: string;
  trial?: boolean;
  planBusiness?: boolean;
  planPro?: boolean;
  planPlus?: boolean;
  planBasic?: boolean;
  member?: boolean;
  personalSubscriptionActive?: boolean;
  organizationSubscriptionActive?: boolean;
  validProfile?: boolean;
  validAndActivated?: boolean;
}

/**
 * Settings response data
 */
export interface SettingsResponseData {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  timezone?: string;
  currency?: string;
  distance?: string;
  dateFormat?: string;
  timeFormat?: string;
  durationFormat?: string;
  csvSeparator?: string;
  slotDuration?: number;
  snapDuration?: number;
  entriesPerPage?: number;
  firstDay?: number;
  defaultTaskDuration?: number;
  defaultBreakDuration?: number;
  showRelatives?: boolean;
  weeklySummary?: boolean;
  monthlySummary?: boolean;
  timerRounding?: number;
  timerRoundingType?: number;
  timerEditView?: boolean;
  pauseRounding?: number;
  pauseRoundingType?: number;
  pauseEditView?: boolean;
  autofillProjectSelection?: boolean;
  lastUpdate?: number;
}

/**
 * Webhook response data
 */
export interface WebhookResponseData {
  id: string;
  target: string;
  event: string;
  created?: number;
  lastUpdate?: number;
}

/**
 * Extended Webhook type - same as SDK Webhook
 */
export type ExtendedWebhook = Webhook;

/**
 * Export response data
 */
export interface ExportResponseData {
  url: string;
}

/**
 * Export fields response data
 */
export interface ExportFieldsResponseData {
  fields: Array<{
    id: string;
    name: string;
    description?: string;
    type?: string;
    category?: string;
    scope?: string;
    defaultEnabled?: boolean;
    defaultPosition?: number;
  }>;
}

/**
 * Export report types response data
 */
export interface ExportReportTypesResponseData {
  reports: Array<{
    id: number;
    name: string;
    acceptsCustomFields?: boolean;
    fieldScope?: string;
    dataCategory?: string;
  }>;
}

/**
 * Export template response data
 */
export interface ExportTemplateResponseData {
  id: string;
  name: string;
  report?: number;
  format?: string;
  filter?: string;
  splitTask?: boolean;
  summarize?: boolean;
  email?: string;
  filename?: string;
  projectIds?: string[];
  teamIds?: string[];
  created?: number;
  lastUpdate?: number;
}

/**
 * Document report response data
 */
export interface DocumentReportResponseData {
  documentTitle?: string;
  documentDate?: string;
  invoiceNumber?: string;
  customerNumber?: string;
  companyName?: string;
  customerName?: string;
  subtotalAmount?: string;
  taxRate?: number;
  taxAmount?: string;
  totalAmount?: string;
  totalDuration?: string;
  taskSubtotal?: string;
  expenseSubtotal?: string;
  eInvoiceType?: string;
  showTaskTime?: boolean;
  showRates?: boolean;
  showTaxes?: boolean;
  includeExpenses?: boolean;
  includeNotes?: boolean;
  taskCount: number;
  expenseCount: number;
  noteCount: number;
  tasks?: unknown[];
  expenses?: unknown[];
  notes?: unknown[];
}

/**
 * Task report response data
 */
export interface TaskReportResponseData {
  taskId?: string;
  taskDate?: string;
  taskStartTime?: string;
  taskEndTime?: string;
  taskTimeRange?: string;
  taskDuration?: string;
  taskDurationRelative?: string;
  pauseDuration?: string;
  taskDescription?: string;
  taskLocation?: string;
  taskRateName?: string;
  taskRate?: string;
  taskTotal?: string;
  projectName?: string;
  projectClient?: string;
  memberName?: string;
  taskTags?: string;
  durationSeconds?: number;
  quantityHours?: number;
  unitPriceNumeric?: number;
  lineTotalNumeric?: number;
  billable?: boolean;
  paid?: boolean;
}

/**
 * Expense report response data
 */
export interface ExpenseReportResponseData {
  expenseId?: string;
  expenseDate?: string;
  expenseTime?: string;
  expenseAmount?: string;
  expenseDescription?: string;
  expenseDescriptionRaw?: string;
  expenseDateTimeRaw?: string;
  expenseAuthor?: string;
  amountNumeric?: number;
  hasAttachment: boolean;
}

/**
 * Note report response data
 */
export interface NoteReportResponseData {
  noteId?: string;
  noteDate?: string;
  noteContent?: string;
  noteType?: string;
  noteAuthor?: string;
  hasAttachment: boolean;
}

/**
 * PDF response data
 */
export interface PdfResponseData {
  id: string;
  type: 'document' | 'task' | 'expense' | 'note';
  data: string;
  dataType: 'base64';
  mimeType: 'application/pdf';
  filename: string;
}

/**
 * XML response data
 */
export interface XmlResponseData {
  id: string;
  type: 'document';
  data: string;
  dataType: 'xml';
  mimeType: 'application/xml';
  filename: string;
}
