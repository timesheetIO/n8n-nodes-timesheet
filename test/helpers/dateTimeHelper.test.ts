/**
 * Tests for dateTimeHelper
 */
import { describe, it, expect } from 'vitest';
import {
  formatDateTime,
  formatDate,
  normalizeDateTime,
} from '../../nodes/Timesheet/helpers/dateTimeHelper';

describe('dateTimeHelper', () => {
  describe('formatDateTime', () => {
    it('should return undefined for undefined input', () => {
      expect(formatDateTime(undefined)).toBeUndefined();
    });

    it('should preserve ISO string with timezone', () => {
      const input = '2025-10-28T10:30:00+02:00';
      const result = formatDateTime(input);
      expect(result).toBe(input);
    });

    it('should convert Z timezone to +00:00 offset', () => {
      const input = '2025-10-28T10:30:00Z';
      const result = formatDateTime(input);
      // Z notation is not valid, should be converted to explicit +00:00
      expect(result).toBe('2025-10-28T10:30:00+00:00');
    });

    it('should add timezone to ISO string without timezone', () => {
      const input = '2025-10-28T10:30:00';
      const result = formatDateTime(input);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    });

    it('should handle Date object', () => {
      const date = new Date('2025-10-28T10:30:00');
      const result = formatDateTime(date);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    });

    it('should handle Unix timestamp', () => {
      const timestamp = new Date('2025-10-28T10:30:00').getTime();
      const result = formatDateTime(timestamp);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    });

    it('should throw error for invalid date string', () => {
      expect(() => formatDateTime('invalid-date')).toThrow('Invalid datetime value');
    });
  });

  describe('formatDate', () => {
    it('should return undefined for undefined input', () => {
      expect(formatDate(undefined)).toBeUndefined();
    });

    it('should format date string to start of day', () => {
      const input = '2025-10-28';
      const result = formatDate(input);
      expect(result).toMatch(/^2025-10-28T00:00:00[+-]\d{2}:\d{2}$/);
    });

    it('should handle full datetime string', () => {
      const input = '2025-10-28T10:30:00+02:00';
      const result = formatDate(input);
      expect(result).toBe(input);
    });

    it('should throw error for invalid date', () => {
      expect(() => formatDate('invalid')).toThrow('Invalid date value');
    });
  });

  describe('normalizeDateTime', () => {
    it('should return undefined for falsy values', () => {
      expect(normalizeDateTime(undefined)).toBeUndefined();
      expect(normalizeDateTime(null as unknown as undefined)).toBeUndefined();
      expect(normalizeDateTime('')).toBeUndefined();
    });

    it('should normalize valid datetime string', () => {
      const input = '2025-10-28T10:30:00';
      const result = normalizeDateTime(input);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    });

    it('should preserve datetime with timezone', () => {
      const input = '2025-10-28T10:30:00+02:00';
      const result = normalizeDateTime(input);
      expect(result).toBe(input);
    });

    it('should handle Date object', () => {
      const date = new Date('2025-10-28T10:30:00');
      const result = normalizeDateTime(date);
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}$/);
    });

    it('should throw error with helpful message for invalid input', () => {
      expect(() => normalizeDateTime('not-a-date')).toThrow('Failed to format datetime');
    });
  });

  describe('timezone handling', () => {
    it('should preserve positive timezone offset', () => {
      const input = '2025-10-28T10:30:00+05:30';
      expect(formatDateTime(input)).toBe(input);
    });

    it('should preserve negative timezone offset', () => {
      const input = '2025-10-28T10:30:00-08:00';
      expect(formatDateTime(input)).toBe(input);
    });

    it('should add timezone to date without timezone', () => {
      const input = '2025-10-28T10:30:00';
      const result = formatDateTime(input);
      // Should have timezone offset in format +HH:mm or -HH:mm
      expect(result).toMatch(/[+-]\d{2}:\d{2}$/);
    });

    it('should convert UTC Z notation to +00:00', () => {
      const input = '2025-10-28T10:30:00Z';
      const result = formatDateTime(input);
      // Z must be converted to explicit +00:00 offset
      expect(result).toBe('2025-10-28T10:30:00+00:00');
      expect(result).not.toContain('Z');
    });

    it('should convert Z notation even with milliseconds', () => {
      const input = '2025-10-28T10:30:00.000Z';
      const result = formatDateTime(input);
      // Should convert to +00:00 and handle milliseconds
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+00:00$/);
      expect(result).not.toContain('Z');
    });
  });
});
