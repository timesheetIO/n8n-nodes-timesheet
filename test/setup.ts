/**
 * Test Setup
 *
 * This file is run before all tests to set up the testing environment.
 */
import { config } from 'dotenv';

// Load environment variables
config();

// Log integration test availability
if (process.env.TIMESHEET_API_KEY) {
  console.log('Integration tests enabled: TIMESHEET_API_KEY is set');
} else {
  console.log('Integration tests will be skipped: TIMESHEET_API_KEY not set');
}
