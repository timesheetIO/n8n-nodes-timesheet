import { defineConfig } from 'vitest/config';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		setupFiles: ['./test/setup.ts'],
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			exclude: ['node_modules/**', 'dist/**', 'test/**', '**/*.test.ts'],
			all: true,
			lines: 80,
			functions: 80,
			branches: 80,
			statements: 80,
		},
	},
});
