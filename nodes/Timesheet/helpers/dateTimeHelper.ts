/**
 * Helper functions for datetime formatting
 */

/**
 * Converts various datetime formats to ISO 8601 with explicit timezone offset
 * Format: yyyy-MM-ddTHH:mm:ss±HH:mm (e.g., "2025-10-28T10:30:00+02:00")
 *
 * IMPORTANT: Always uses explicit timezone offset (+02:00, -05:00, +00:00)
 * NEVER uses Z notation for UTC - converts "Z" to "+00:00"
 *
 * Handles:
 * - ISO 8601 strings with or without timezone
 * - Unix timestamps (milliseconds)
 * - Date objects
 * - n8n datetime picker output
 *
 * @param dateTime - Input datetime in various formats
 * @returns ISO 8601 formatted string with explicit timezone offset (e.g., "2025-10-28T10:30:00+02:00")
 */
export function formatDateTime(dateTime: string | number | Date | undefined): string | undefined {
  if (!dateTime) {
    return undefined;
  }

  // Special handling for Z notation in strings - convert Z to +00:00 without changing time
  if (typeof dateTime === 'string' && dateTime.endsWith('Z')) {
    // Remove Z and add +00:00, also remove milliseconds if present
    return dateTime.replace(/\.\d{3}Z$/, '+00:00').replace(/Z$/, '+00:00');
  }

  // If the original string has a valid timezone offset (+/-HH:mm), preserve it
  if (typeof dateTime === 'string' && hasValidTimezoneOffset(dateTime)) {
    return dateTime;
  }

  let date: Date;

  // Handle different input types
  if (typeof dateTime === 'string') {
    // Parse ISO string or other string formats
    date = new Date(dateTime);
  } else if (typeof dateTime === 'number') {
    // Handle Unix timestamp (milliseconds)
    date = new Date(dateTime);
  } else if (dateTime instanceof Date) {
    date = dateTime;
  } else {
    throw new Error('Invalid datetime format: unknown type');
  }

  // Validate the date
  if (isNaN(date.getTime())) {
    throw new Error('Invalid datetime value');
  }

  // Convert to explicit timezone offset using local timezone
  return formatToISOWithTimezone(date);
}

/**
 * Checks if a datetime string has a valid timezone offset in ±HH:mm format
 * Note: Does NOT accept Z notation, only explicit offsets like +02:00 or -05:00
 */
function hasValidTimezoneOffset(dateTimeStr: string): boolean {
  // Check for timezone offset pattern: +HH:mm or -HH:mm with leading zeros
  return /[+-]\d{2}:\d{2}$/.test(dateTimeStr);
}

/**
 * Formats a Date object to ISO 8601 with timezone offset
 * Example: "2025-10-28T10:30:00+02:00"
 */
function formatToISOWithTimezone(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Get timezone offset in minutes
  const timezoneOffset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
  const offsetMinutes = Math.abs(timezoneOffset) % 60;
  const offsetSign = timezoneOffset >= 0 ? '+' : '-';
  const timezone = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${timezone}`;
}

/**
 * Formats a date string (without time) to ISO 8601 at start of day with explicit timezone offset
 * Example: "2025-10-28" -> "2025-10-28T00:00:00+02:00"
 * Note: Always uses explicit timezone offset, never Z notation
 */
export function formatDate(dateStr: string | undefined): string | undefined {
  if (!dateStr) {
    return undefined;
  }

  // If it already looks like a full datetime, use formatDateTime
  if (dateStr.includes('T') || dateStr.includes(' ')) {
    return formatDateTime(dateStr);
  }

  // Parse as date and set to start of day
  const date = new Date(dateStr + 'T00:00:00');

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${dateStr}`);
  }

  return formatToISOWithTimezone(date);
}

/**
 * Converts n8n datetime picker output to Timesheet API format
 * This is the main function to use in operation handlers
 */
export function normalizeDateTime(value: string | number | Date | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  try {
    return formatDateTime(value);
  } catch (error) {
    throw new Error(
      `Failed to format datetime: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
}
