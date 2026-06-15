import { NodeOperationError, type INode } from 'n8n-workflow';

/**
 * Maps Timesheet SDK errors to n8n-friendly error messages
 */
export function mapTimesheetError(error: unknown, node: INode, itemIndex: number): never {
  // Check if error has response data (Axios error structure)
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    error.response &&
    typeof error.response === 'object' &&
    'data' in error.response
  ) {
    const response = error.response as {
      status?: number;
      data?: {
        message?: string;
        error?: string;
        errors?: Array<{ field: string; message: string }>;
      };
      headers?: {
        'retry-after'?: string;
      };
    };

    // Authentication errors (401)
    if (response.status === 401) {
      throw new NodeOperationError(
        node,
        'Authentication failed. Please verify your API credentials.',
        { itemIndex },
      );
    }

    // Authorization errors (403)
    if (response.status === 403) {
      const detail = response.data?.message || response.data?.error;
      throw new NodeOperationError(
        node,
        'You do not have permission to perform this action. It usually requires manager or owner access in the relevant team or organization.',
        { itemIndex, description: detail },
      );
    }

    // Rate limiting errors (429)
    if (response.status === 429) {
      const retryAfter = response.headers?.['retry-after'] || '60';
      throw new NodeOperationError(
        node,
        `Rate limit exceeded. Please retry after ${retryAfter} seconds.`,
        { itemIndex },
      );
    }

    // Validation errors (400)
    if (response.status === 400 && response.data?.errors) {
      const validationErrors = response.data.errors
        .map((e) => `${e.field}: ${e.message}`)
        .join(', ');
      throw new NodeOperationError(node, `Validation error: ${validationErrors}`, { itemIndex });
    }

    // Generic API error with message
    const message = response.data?.message || response.data?.error || 'Unknown API error';
    throw new NodeOperationError(node, `API Error (${response.status || 'unknown'}): ${message}`, {
      itemIndex,
    });
  }

  // Generic error fallback
  let message = 'Unknown error occurred';
  if (error && typeof error === 'object' && 'message' in error) {
    message = (error.message as string) || message;
  } else if (error !== null && error !== undefined) {
    // Convert error to string, handling objects by stringifying them
    if (typeof error === 'object') {
      try {
        message = JSON.stringify(error);
      } catch {
        message = 'Error object could not be serialized';
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      message = String(error);
    }
  }

  throw new NodeOperationError(node, message, {
    itemIndex,
  });
}
