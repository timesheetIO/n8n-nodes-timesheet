import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { IExecuteFunctions } from 'n8n-workflow';
import * as settingsOps from '../../nodes/Timesheet/operations/settings.operations';
import {
  createMockExecuteFunctions,
  createMockTimesheetClient,
  createMockApiClient,
  mockSettings,
} from '../helpers/mocks';

describe('Settings Operations', () => {
  let mockContext: IExecuteFunctions;
  let mockClient: ReturnType<typeof createMockTimesheetClient>;
  let mockApiClient: ReturnType<typeof createMockApiClient>;

  beforeEach(() => {
    mockContext = createMockExecuteFunctions();
    mockClient = createMockTimesheetClient();
    mockApiClient = createMockApiClient(mockClient);
  });

  describe('getSettings', () => {
    it('should get user settings', async () => {
      mockClient.settings.get.mockResolvedValue(mockSettings);

      const result = await settingsOps.getSettings.call(mockContext, mockApiClient, 0);

      expect(mockClient.settings.get).toHaveBeenCalledWith();
      expect(result.theme).toBe('system');
      expect(result.language).toBe('en');
      expect(result.timezone).toBe('America/New_York');
      expect(result.currency).toBe('USD');
      expect(result.dateFormat).toBe('MM/DD/YYYY');
      expect(result.timeFormat).toBe('hh:mm A');
    });

    it('should return all settings fields', async () => {
      mockClient.settings.get.mockResolvedValue(mockSettings);

      const result = await settingsOps.getSettings.call(mockContext, mockApiClient, 0);

      // Verify all expected fields are present
      expect(result).toHaveProperty('theme');
      expect(result).toHaveProperty('language');
      expect(result).toHaveProperty('timezone');
      expect(result).toHaveProperty('currency');
      expect(result).toHaveProperty('distance');
      expect(result).toHaveProperty('dateFormat');
      expect(result).toHaveProperty('timeFormat');
      expect(result).toHaveProperty('durationFormat');
      expect(result).toHaveProperty('csvSeparator');
      expect(result).toHaveProperty('slotDuration');
      expect(result).toHaveProperty('snapDuration');
      expect(result).toHaveProperty('entriesPerPage');
      expect(result).toHaveProperty('firstDay');
      expect(result).toHaveProperty('defaultTaskDuration');
      expect(result).toHaveProperty('defaultBreakDuration');
      expect(result).toHaveProperty('showRelatives');
      expect(result).toHaveProperty('weeklySummary');
      expect(result).toHaveProperty('monthlySummary');
      expect(result).toHaveProperty('timerRounding');
      expect(result).toHaveProperty('timerRoundingType');
      expect(result).toHaveProperty('timerEditView');
      expect(result).toHaveProperty('pauseRounding');
      expect(result).toHaveProperty('pauseRoundingType');
      expect(result).toHaveProperty('pauseEditView');
      expect(result).toHaveProperty('autofillProjectSelection');
      expect(result).toHaveProperty('lastUpdate');
    });
  });

  describe('updateSettings', () => {
    it('should update theme setting', async () => {
      mockContext.getNodeParameter = vi.fn().mockReturnValueOnce({ theme: 'dark' });

      mockClient.settings.update.mockResolvedValue({
        ...mockSettings,
        theme: 'dark',
      });

      const result = await settingsOps.updateSettings.call(mockContext, mockApiClient, 0);

      expect(mockClient.settings.update).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: 'dark',
        }),
      );

      expect(result.theme).toBe('dark');
    });

    it('should update language and timezone', async () => {
      mockContext.getNodeParameter = vi.fn().mockReturnValueOnce({
        language: 'de',
        timezone: 'Europe/Berlin',
      });

      mockClient.settings.update.mockResolvedValue({
        ...mockSettings,
        language: 'de',
        timezone: 'Europe/Berlin',
      });

      const result = await settingsOps.updateSettings.call(mockContext, mockApiClient, 0);

      expect(mockClient.settings.update).toHaveBeenCalledWith(
        expect.objectContaining({
          language: 'de',
          timezone: 'Europe/Berlin',
        }),
      );

      expect(result.language).toBe('de');
      expect(result.timezone).toBe('Europe/Berlin');
    });

    it('should update date and time formats', async () => {
      mockContext.getNodeParameter = vi.fn().mockReturnValueOnce({
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
        durationFormat: 'HH:mm:ss',
      });

      mockClient.settings.update.mockResolvedValue({
        ...mockSettings,
        dateFormat: 'DD/MM/YYYY',
        timeFormat: 'HH:mm',
        durationFormat: 'HH:mm:ss',
      });

      const result = await settingsOps.updateSettings.call(mockContext, mockApiClient, 0);

      expect(mockClient.settings.update).toHaveBeenCalledWith(
        expect.objectContaining({
          dateFormat: 'DD/MM/YYYY',
          timeFormat: 'HH:mm',
          durationFormat: 'HH:mm:ss',
        }),
      );

      expect(result.dateFormat).toBe('DD/MM/YYYY');
      expect(result.timeFormat).toBe('HH:mm');
      expect(result.durationFormat).toBe('HH:mm:ss');
    });

    it('should update duration settings', async () => {
      mockContext.getNodeParameter = vi.fn().mockReturnValueOnce({
        defaultTaskDuration: 7200,
        defaultBreakDuration: 900,
        slotDuration: 3600,
      });

      mockClient.settings.update.mockResolvedValue({
        ...mockSettings,
        defaultTaskDuration: 7200,
        defaultBreakDuration: 900,
        slotDuration: 3600,
      });

      const result = await settingsOps.updateSettings.call(mockContext, mockApiClient, 0);

      expect(mockClient.settings.update).toHaveBeenCalledWith(
        expect.objectContaining({
          defaultTaskDuration: 7200,
          defaultBreakDuration: 900,
          slotDuration: 3600,
        }),
      );

      expect(result.defaultTaskDuration).toBe(7200);
      expect(result.defaultBreakDuration).toBe(900);
      expect(result.slotDuration).toBe(3600);
    });

    it('should update boolean preferences', async () => {
      mockContext.getNodeParameter = vi.fn().mockReturnValueOnce({
        showRelatives: false,
        weeklySummary: true,
        monthlySummary: true,
        timerEditView: true,
      });

      mockClient.settings.update.mockResolvedValue({
        ...mockSettings,
        showRelatives: false,
        weeklySummary: true,
        monthlySummary: true,
        timerEditView: true,
      });

      const result = await settingsOps.updateSettings.call(mockContext, mockApiClient, 0);

      expect(mockClient.settings.update).toHaveBeenCalledWith(
        expect.objectContaining({
          showRelatives: false,
          weeklySummary: true,
          monthlySummary: true,
          timerEditView: true,
        }),
      );

      expect(result.showRelatives).toBe(false);
      expect(result.weeklySummary).toBe(true);
      expect(result.monthlySummary).toBe(true);
      expect(result.timerEditView).toBe(true);
    });

    it('should update first day of week', async () => {
      mockContext.getNodeParameter = vi.fn().mockReturnValueOnce({
        firstDay: 0,
      });

      mockClient.settings.update.mockResolvedValue({
        ...mockSettings,
        firstDay: 0,
      });

      const result = await settingsOps.updateSettings.call(mockContext, mockApiClient, 0);

      expect(mockClient.settings.update).toHaveBeenCalledWith(
        expect.objectContaining({
          firstDay: 0,
        }),
      );

      expect(result.firstDay).toBe(0);
    });

    it('should handle empty update fields', async () => {
      mockContext.getNodeParameter = vi.fn().mockReturnValueOnce({});

      mockClient.settings.update.mockResolvedValue(mockSettings);

      const result = await settingsOps.updateSettings.call(mockContext, mockApiClient, 0);

      expect(mockClient.settings.update).toHaveBeenCalled();
      expect(result.theme).toBe('system');
    });
  });
});
