import type { IExecuteFunctions } from 'n8n-workflow';
import type { TimesheetApiClient } from '../helpers/TimesheetApi';
import type { SettingsResponseData } from '../types';

/**
 * Get user settings
 */
export async function getSettings(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  _itemIndex: number,
): Promise<SettingsResponseData> {
  const settings = await client.getClient().settings.get();

  return {
    theme: settings.theme,
    language: settings.language,
    timezone: settings.timezone,
    currency: settings.currency,
    distance: settings.distance,
    dateFormat: settings.dateFormat,
    timeFormat: settings.timeFormat,
    durationFormat: settings.durationFormat,
    csvSeparator: settings.csvSeparator,
    slotDuration: settings.slotDuration,
    snapDuration: settings.snapDuration,
    entriesPerPage: settings.entriesPerPage,
    firstDay: settings.firstDay,
    defaultTaskDuration: settings.defaultTaskDuration,
    defaultBreakDuration: settings.defaultBreakDuration,
    showRelatives: settings.showRelatives,
    weeklySummary: settings.weeklySummary,
    monthlySummary: settings.monthlySummary,
    timerRounding: settings.timerRounding,
    timerRoundingType: settings.timerRoundingType,
    timerEditView: settings.timerEditView,
    pauseRounding: settings.pauseRounding,
    pauseRoundingType: settings.pauseRoundingType,
    pauseEditView: settings.pauseEditView,
    autofillProjectSelection: settings.autofillProjectSelection,
    lastUpdate: settings.lastUpdate,
  };
}

/**
 * Update user settings
 */
export async function updateSettings(
  this: IExecuteFunctions,
  client: TimesheetApiClient,
  itemIndex: number,
): Promise<SettingsResponseData> {
  const updateFields = this.getNodeParameter('updateFields', itemIndex, {});

  const updateData = {
    theme: updateFields.theme as 'light' | 'dark' | 'system' | undefined,
    language: updateFields.language as string | undefined,
    timezone: updateFields.timezone as string | undefined,
    currency: updateFields.currency as string | undefined,
    distance: updateFields.distance as string | undefined,
    dateFormat: updateFields.dateFormat as string | undefined,
    timeFormat: updateFields.timeFormat as string | undefined,
    durationFormat: updateFields.durationFormat as string | undefined,
    csvSeparator: updateFields.csvSeparator as string | undefined,
    slotDuration: updateFields.slotDuration as number | undefined,
    snapDuration: updateFields.snapDuration as number | undefined,
    entriesPerPage: updateFields.entriesPerPage as number | undefined,
    firstDay: updateFields.firstDay as number | undefined,
    defaultTaskDuration: updateFields.defaultTaskDuration as number | undefined,
    defaultBreakDuration: updateFields.defaultBreakDuration as number | undefined,
    showRelatives: updateFields.showRelatives as boolean | undefined,
    weeklySummary: updateFields.weeklySummary as boolean | undefined,
    monthlySummary: updateFields.monthlySummary as boolean | undefined,
    timerRounding: updateFields.timerRounding as number | undefined,
    timerRoundingType: updateFields.timerRoundingType as number | undefined,
    timerEditView: updateFields.timerEditView as boolean | undefined,
    pauseRounding: updateFields.pauseRounding as number | undefined,
    pauseRoundingType: updateFields.pauseRoundingType as number | undefined,
    pauseEditView: updateFields.pauseEditView as boolean | undefined,
    autofillProjectSelection: updateFields.autofillProjectSelection as boolean | undefined,
  };

  const settings = await client.getClient().settings.update(updateData);

  return {
    theme: settings.theme,
    language: settings.language,
    timezone: settings.timezone,
    currency: settings.currency,
    distance: settings.distance,
    dateFormat: settings.dateFormat,
    timeFormat: settings.timeFormat,
    durationFormat: settings.durationFormat,
    csvSeparator: settings.csvSeparator,
    slotDuration: settings.slotDuration,
    snapDuration: settings.snapDuration,
    entriesPerPage: settings.entriesPerPage,
    firstDay: settings.firstDay,
    defaultTaskDuration: settings.defaultTaskDuration,
    defaultBreakDuration: settings.defaultBreakDuration,
    showRelatives: settings.showRelatives,
    weeklySummary: settings.weeklySummary,
    monthlySummary: settings.monthlySummary,
    timerRounding: settings.timerRounding,
    timerRoundingType: settings.timerRoundingType,
    timerEditView: settings.timerEditView,
    pauseRounding: settings.pauseRounding,
    pauseRoundingType: settings.pauseRoundingType,
    pauseEditView: settings.pauseEditView,
    autofillProjectSelection: settings.autofillProjectSelection,
    lastUpdate: settings.lastUpdate,
  };
}
