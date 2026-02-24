/**
 * Integration tests for Timesheet API
 *
 * These tests require real API credentials.
 * Set TIMESHEET_API_KEY environment variable to run.
 *
 * Run with: TIMESHEET_API_KEY=your_key npm run test:integration
 */
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { TimesheetClient } from '@timesheet/sdk';

const API_KEY = process.env.TIMESHEET_API_KEY;
const BASE_URL = process.env.TIMESHEET_BASE_URL || 'https://api.timesheet.io';

// Skip all tests if no API key provided
const describeIf = API_KEY ? describe : describe.skip;

describeIf('Timesheet API Integration', () => {
  let client: TimesheetClient;
  let testProjectId: string | null = null;
  let testTagId: string | null = null;
  let testTaskId: string | null = null;

  beforeAll(() => {
    client = new TimesheetClient({
      baseUrl: BASE_URL,
      apiKey: API_KEY!,
    });
  });

  afterAll(async () => {
    // Cleanup all test resources
    if (testTaskId) {
      try {
        await client.tasks.delete(testTaskId);
      } catch {
        /* ignore */
      }
    }
    if (testProjectId) {
      try {
        await client.projects.delete(testProjectId);
      } catch {
        /* ignore */
      }
    }
    if (testTagId) {
      try {
        await client.tags.delete(testTagId);
      } catch {
        /* ignore */
      }
    }
  });

  describe('Authentication', () => {
    it('should authenticate with valid API key', async () => {
      const profile = await client.profile.getProfile();
      expect(profile.email).toBeDefined();
    });
  });

  describe('Profile Operations', () => {
    it('should get user profile', async () => {
      const profile = await client.profile.getProfile();

      expect(profile.email).toBeDefined();
      expect(profile.valid).toBe(true);
    });

    it('should have subscription info', async () => {
      const profile = await client.profile.getProfile();

      expect(profile.plan).toBeDefined();
      expect(typeof profile.plan).toBe('number');
    });
  });

  describe('Settings Operations', () => {
    it('should get user settings', async () => {
      const settings = await client.settings.get();

      expect(settings.timezone).toBeDefined();
      expect(settings.language).toBeDefined();
      expect(settings.currency).toBeDefined();
    });

    it('should have formatting preferences', async () => {
      const settings = await client.settings.get();

      expect(settings.dateFormat).toBeDefined();
      expect(settings.timeFormat).toBeDefined();
      expect(settings.durationFormat).toBeDefined();
    });
  });

  describe('Project Operations', () => {
    it('should list projects', async () => {
      const page = await client.projects.list({ limit: 10 });

      expect(page.items).toBeDefined();
      expect(Array.isArray(page.items)).toBe(true);
    });

    it('should search projects', async () => {
      const page = await client.projects.search({ limit: 10, status: 'active' });

      expect(page.items).toBeDefined();
      expect(Array.isArray(page.items)).toBe(true);
    });

    it('should create, get, update, and delete a project', async () => {
      // Create
      const project = await client.projects.create({
        title: `Integration Test ${Date.now()}`,
        description: 'Created by integration test',
      });
      testProjectId = project.id;

      expect(project.id).toBeDefined();
      expect(project.title).toContain('Integration Test');
      expect(project.description).toBe('Created by integration test');

      // Get
      const fetched = await client.projects.get(project.id);
      expect(fetched.id).toBe(project.id);
      expect(fetched.title).toBe(project.title);

      // Update
      const updated = await client.projects.update(project.id, {
        description: 'Updated description',
      });
      expect(updated.description).toBe('Updated description');

      // Delete
      await client.projects.delete(project.id);
      testProjectId = null;

      // Verify deleted
      await expect(client.projects.get(project.id)).rejects.toThrow();
    });

    it('should handle project pagination', async () => {
      const page1 = await client.projects.list({ limit: 2, page: 1 });

      expect(page1.items.length).toBeLessThanOrEqual(2);
      expect(page1.params.page).toBe(1);
      expect(page1.params.limit).toBe(2);

      if (page1.hasNextPage) {
        const page2 = await client.projects.list({ limit: 2, page: 2 });
        expect(page2.params.page).toBe(2);

        // Ensure different results
        if (page1.items.length > 0 && page2.items.length > 0) {
          expect(page1.items[0].id).not.toBe(page2.items[0].id);
        }
      }
    });
  });

  describe('Tag Operations', () => {
    it('should list tags', async () => {
      const page = await client.tags.list({ limit: 10 });

      expect(page.items).toBeDefined();
      expect(Array.isArray(page.items)).toBe(true);
    });

    it('should search tags', async () => {
      const page = await client.tags.search({ limit: 10 });

      expect(page.items).toBeDefined();
    });

    it('should create, get, update, and delete a tag', async () => {
      // Create
      const tag = await client.tags.create({
        name: `Test Tag ${Date.now()}`,
        color: 100,
      });
      testTagId = tag.id;

      expect(tag.id).toBeDefined();
      expect(tag.name).toContain('Test Tag');
      expect(tag.color).toBe(100);

      // Get
      const fetched = await client.tags.get(tag.id);
      expect(fetched.id).toBe(tag.id);

      // Update
      const updated = await client.tags.update(tag.id, {
        name: 'Updated Tag Name',
      });
      expect(updated.name).toBe('Updated Tag Name');

      // Delete
      await client.tags.delete(tag.id);
      testTagId = null;

      // Verify deleted
      await expect(client.tags.get(tag.id)).rejects.toThrow();
    });
  });

  describe('Timer Operations', () => {
    beforeAll(async () => {
      // Ensure timer is stopped before running tests
      const timer = await client.timer.get();
      if (timer.status !== 'stopped') {
        await client.timer.stop();
      }
    });

    afterEach(async () => {
      // Always stop timer after each test
      try {
        const timer = await client.timer.get();
        if (timer.status !== 'stopped') {
          await client.timer.stop();
        }
      } catch {
        /* ignore */
      }
    });

    it('should get timer status', async () => {
      const timer = await client.timer.get();

      expect(timer.status).toBeDefined();
      expect(['running', 'paused', 'stopped']).toContain(timer.status);
    });

    it('should start and stop a timer', async () => {
      // First ensure timer is stopped
      const initial = await client.timer.get();
      if (initial.status !== 'stopped') {
        await client.timer.stop();
      }

      // Need a project to start timer
      const projects = await client.projects.list({ limit: 1 });
      if (projects.items.length === 0) {
        // Create a temp project
        const tempProject = await client.projects.create({
          title: `Timer Test ${Date.now()}`,
        });
        testProjectId = tempProject.id;
      }

      const projectId = testProjectId || projects.items[0]?.id;
      if (!projectId) {
        console.log('No project available for timer test, skipping');
        return;
      }

      // Start
      const started = await client.timer.start({ projectId });
      expect(started.status).toBe('running');

      // Stop
      const stopped = await client.timer.stop();
      expect(stopped.status).toBe('stopped');
    });

    it('should pause and resume a timer', async () => {
      // Ensure stopped first
      const initial = await client.timer.get();
      if (initial.status !== 'stopped') {
        await client.timer.stop();
      }

      // Get a project
      const projects = await client.projects.list({ limit: 1 });
      const projectId = testProjectId || projects.items[0]?.id;
      if (!projectId) {
        return;
      }

      // Start
      await client.timer.start({ projectId });

      // Pause
      const paused = await client.timer.pause();
      expect(paused.status).toBe('paused');

      // Resume
      const resumed = await client.timer.resume();
      expect(resumed.status).toBe('running');

      // Stop
      await client.timer.stop();
    });
  });

  describe('Task Operations', () => {
    let taskProjectId: string;

    beforeAll(async () => {
      // Create a project for task tests
      const project = await client.projects.create({
        title: `Task Test Project ${Date.now()}`,
      });
      taskProjectId = project.id;
      testProjectId = project.id;
    });

    it('should search tasks', async () => {
      const page = await client.tasks.search({ limit: 10 });

      expect(page.items).toBeDefined();
      expect(Array.isArray(page.items)).toBe(true);
    });

    it('should create, get, update, and delete a task', async () => {
      const now = new Date();
      const startDateTime = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
      const endDateTime = now.toISOString();

      // Create
      const task = await client.tasks.create({
        projectId: taskProjectId,
        startDateTime,
        endDateTime,
        description: 'Integration test task',
        billable: true,
      });
      testTaskId = task.id;

      expect(task.id).toBeDefined();
      expect(task.description).toBe('Integration test task');
      expect(task.billable).toBe(true);

      // Get
      const fetched = await client.tasks.get(task.id);
      expect(fetched.id).toBe(task.id);
      expect(fetched.project?.id).toBe(taskProjectId);

      // Update
      const updated = await client.tasks.update(task.id, {
        description: 'Updated task description',
        billable: false,
      });
      expect(updated.description).toBe('Updated task description');
      expect(updated.billable).toBe(false);

      // Delete
      await client.tasks.delete(task.id);
      testTaskId = null;

      // Verify deleted
      await expect(client.tasks.get(task.id)).rejects.toThrow();
    });

    it('should filter tasks by project', async () => {
      const page = await client.tasks.search({
        projectId: taskProjectId,
        limit: 10,
      });

      expect(page.items).toBeDefined();
      // All returned tasks should belong to the project
      for (const task of page.items) {
        expect(task.project?.id).toBe(taskProjectId);
      }
    });

    it('should filter tasks by date range', async () => {
      const today = new Date();
      const startDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
      ).toISOString();
      const endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1,
      ).toISOString();

      const page = await client.tasks.search({
        startDate,
        endDate,
        limit: 10,
      });

      expect(page.items).toBeDefined();
    });
  });

  describe('Rate Operations', () => {
    it('should search rates', async () => {
      const page = await client.rates.search({ limit: 10 });

      expect(page.items).toBeDefined();
      expect(Array.isArray(page.items)).toBe(true);
    });

    it('should have rate properties', async () => {
      const page = await client.rates.search({ limit: 1 });

      if (page.items.length > 0) {
        const rate = page.items[0];
        expect(rate.id).toBeDefined();
        expect(rate.title).toBeDefined();
        expect(typeof rate.factor).toBe('number');
      }
    });
  });

  describe('Team Operations', () => {
    it('should list teams', async () => {
      const page = await client.teams.list({ limit: 10 });

      expect(page.items).toBeDefined();
      expect(Array.isArray(page.items)).toBe(true);
    });

    it('should search teams', async () => {
      const page = await client.teams.search({ limit: 10 });

      expect(page.items).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent project', async () => {
      await expect(client.projects.get('non-existent-id-12345')).rejects.toThrow();
    });

    it('should return 404 for non-existent task', async () => {
      await expect(client.tasks.get('non-existent-task-id')).rejects.toThrow();
    });

    it('should return 404 for non-existent tag', async () => {
      await expect(client.tags.get('non-existent-tag-id')).rejects.toThrow();
    });
  });

  describe('Pagination', () => {
    it('should paginate projects correctly', async () => {
      const page1 = await client.projects.list({ limit: 2, page: 1 });
      expect(page1.items.length).toBeLessThanOrEqual(2);

      if (page1.hasNextPage) {
        const page2 = await client.projects.list({ limit: 2, page: 2 });
        expect(page2.items).toBeDefined();

        // Ensure different results
        if (page1.items.length > 0 && page2.items.length > 0) {
          expect(page1.items[0].id).not.toBe(page2.items[0].id);
        }
      }
    });

    it('should paginate tasks correctly', async () => {
      const page1 = await client.tasks.search({ limit: 2, page: 1 });
      expect(page1.items.length).toBeLessThanOrEqual(2);

      if (page1.hasNextPage) {
        const page2 = await client.tasks.search({ limit: 2, page: 2 });
        expect(page2.items).toBeDefined();
      }
    });

    it('should paginate tags correctly', async () => {
      const page1 = await client.tags.search({ limit: 2, page: 1 });
      expect(page1.items.length).toBeLessThanOrEqual(2);

      if (page1.hasNextPage) {
        const page2 = await client.tags.search({ limit: 2, page: 2 });
        expect(page2.items).toBeDefined();
      }
    });
  });
});
