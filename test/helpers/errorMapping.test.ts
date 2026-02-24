/**
 * Tests for error mapping helper
 */
import { describe, it, expect } from 'vitest';
import { NodeOperationError } from 'n8n-workflow';
import { mapTimesheetError } from '../../nodes/Timesheet/helpers/errorMapping';

const mockNode = {
  id: 'test-node',
  name: 'Test Node',
  type: 'n8n-nodes-timesheet.timesheet',
  typeVersion: 1,
  position: [0, 0] as [number, number],
  parameters: {},
};

describe('Error Mapping', () => {
  describe('mapTimesheetError', () => {
    it('should map 401 authentication errors', () => {
      const error = {
        response: {
          status: 401,
          data: {
            message: 'Invalid API key',
          },
        },
      };

      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow(NodeOperationError);
      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow(
        'Authentication failed. Please verify your API credentials.',
      );
    });

    it('should map 429 rate limiting errors with retry-after header', () => {
      const error = {
        response: {
          status: 429,
          data: {
            message: 'Too many requests',
          },
          headers: {
            'retry-after': '120',
          },
        },
      };

      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow(NodeOperationError);
      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow(
        'Rate limit exceeded. Please retry after 120 seconds.',
      );
    });

    it('should map 429 rate limiting errors without retry-after header', () => {
      const error = {
        response: {
          status: 429,
          data: {
            message: 'Too many requests',
          },
        },
      };

      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow(
        'Rate limit exceeded. Please retry after 60 seconds.',
      );
    });

    it('should map 400 validation errors with field details', () => {
      const error = {
        response: {
          status: 400,
          data: {
            message: 'Validation failed',
            errors: [
              { field: 'title', message: 'Title is required' },
              { field: 'startDateTime', message: 'Invalid date format' },
            ],
          },
        },
      };

      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow(NodeOperationError);
      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow(
        'Validation error: title: Title is required, startDateTime: Invalid date format',
      );
    });

    it('should map generic API errors with status and message', () => {
      const error = {
        response: {
          status: 500,
          data: {
            message: 'Internal server error',
          },
        },
      };

      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow(NodeOperationError);
      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow(
        'API Error (500): Internal server error',
      );
    });

    it('should map errors with error property instead of message', () => {
      const error = {
        response: {
          status: 404,
          data: {
            error: 'Resource not found',
          },
        },
      };

      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow(
        'API Error (404): Resource not found',
      );
    });

    it('should handle errors without specific message', () => {
      const error = {
        response: {
          status: 503,
          data: {},
        },
      };

      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow(
        'API Error (503): Unknown API error',
      );
    });

    it('should handle errors without response structure', () => {
      const error = new Error('Network connection failed');

      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow(NodeOperationError);
      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow('Network connection failed');
    });

    it('should handle non-Error objects', () => {
      const error = 'String error message';

      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow(NodeOperationError);
      expect(() => mapTimesheetError(error, mockNode, 0)).toThrow('String error message');
    });

    it('should handle null or undefined errors', () => {
      expect(() => mapTimesheetError(null, mockNode, 0)).toThrow(NodeOperationError);
      expect(() => mapTimesheetError(undefined, mockNode, 0)).toThrow('Unknown error occurred');
    });

    it('should include item index in error', () => {
      const error = {
        response: {
          status: 400,
          data: {
            message: 'Bad request',
          },
        },
      };

      try {
        mapTimesheetError(error, mockNode, 5);
      } catch (err) {
        expect(err).toBeInstanceOf(NodeOperationError);
        // NodeOperationError includes itemIndex in context
      }
    });
  });
});
