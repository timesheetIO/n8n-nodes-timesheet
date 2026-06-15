/**
 * Mock helpers for testing n8n node operations
 *
 * Mock data aligns with @timesheet/sdk types.
 */
import { vi, type Mock } from 'vitest';
import type { IExecuteFunctions, INode } from 'n8n-workflow';

// Type for mocked SDK client methods - preserves vi.fn() mock capabilities
type MockedMethod = Mock<(...args: any[]) => any>;

/**
 * Type for mocked TimesheetClient that preserves mock method access
 */
export interface MockTimesheetClient {
  timer: {
    start: MockedMethod;
    stop: MockedMethod;
    pause: MockedMethod;
    resume: MockedMethod;
    get: MockedMethod;
    update: MockedMethod;
  };
  projects: {
    create: MockedMethod;
    get: MockedMethod;
    update: MockedMethod;
    delete: MockedMethod;
    list: MockedMethod;
    search: MockedMethod;
  };
  tasks: {
    create: MockedMethod;
    get: MockedMethod;
    update: MockedMethod;
    delete: MockedMethod;
    search: MockedMethod;
  };
  tags: {
    create: MockedMethod;
    get: MockedMethod;
    update: MockedMethod;
    delete: MockedMethod;
    search: MockedMethod;
    list: MockedMethod;
  };
  rates: {
    create: MockedMethod;
    get: MockedMethod;
    update: MockedMethod;
    delete: MockedMethod;
    search: MockedMethod;
  };
  teams: {
    list: MockedMethod;
    search: MockedMethod;
  };
  profile: {
    getProfile: MockedMethod;
    updateProfile: MockedMethod;
  };
  settings: {
    get: MockedMethod;
    update: MockedMethod;
  };
  webhooks: {
    create: MockedMethod;
    get: MockedMethod;
    update: MockedMethod;
    delete: MockedMethod;
    search: MockedMethod;
  };
}

/**
 * Creates a mock IExecuteFunctions context for testing operations
 */
export function createMockExecuteFunctions(
  overrides: Partial<IExecuteFunctions> = {},
): IExecuteFunctions {
  return {
    getNodeParameter: vi.fn(),
    getNode: vi.fn(
      () =>
        ({
          id: 'test-node-id',
          name: 'Test Node',
          type: 'n8n-nodes-timesheet.timesheet',
          typeVersion: 1,
          position: [0, 0] as [number, number],
          parameters: {},
        }) as INode,
    ),
    getCredentials: vi.fn(),
    getInputData: vi.fn(() => []),
    getWorkflowDataProxy: vi.fn(),
    helpers: {} as any,
    ...overrides,
  } as unknown as IExecuteFunctions;
}

/**
 * Creates a mock Timesheet SDK client with proper mock types
 */
export function createMockTimesheetClient(): MockTimesheetClient {
  return {
    timer: {
      start: vi.fn(),
      stop: vi.fn(),
      pause: vi.fn(),
      resume: vi.fn(),
      get: vi.fn(),
      update: vi.fn(),
    },
    projects: {
      create: vi.fn(),
      get: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      list: vi.fn(),
      search: vi.fn(),
    },
    tasks: {
      create: vi.fn(),
      get: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      search: vi.fn(),
    },
    tags: {
      create: vi.fn(),
      get: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      search: vi.fn(),
      list: vi.fn(),
    },
    rates: {
      create: vi.fn(),
      get: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      search: vi.fn(),
    },
    teams: {
      list: vi.fn(),
      search: vi.fn(),
    },
    profile: {
      getProfile: vi.fn(),
      updateProfile: vi.fn(),
    },
    settings: {
      get: vi.fn(),
      update: vi.fn(),
    },
    webhooks: {
      create: vi.fn(),
      get: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      search: vi.fn(),
    },
  };
}

/**
 * Type for mock API client wrapper
 */
export interface MockApiClient {
  getClient: Mock<(...args: any[]) => MockTimesheetClient>;
  paginate: Mock<(...args: any[]) => any>;
}

/**
 * Creates a mock TimesheetApiClient wrapper
 * Returns any to allow passing to operations that expect TimesheetApiClient
 */
export function createMockApiClient(mockClient: MockTimesheetClient): any {
  return {
    getClient: vi.fn(() => mockClient),
    paginate: vi.fn(),
  } as MockApiClient;
}

/**
 * Mock NavigablePage for pagination tests
 */
export function createMockPage<T>(items: T[], count: number = items.length) {
  return {
    items,
    params: {
      count,
      page: 1,
      limit: items.length,
    },
    hasNextPage: false,
    nextPage: vi.fn(),
  };
}

// =============================================================================
// Sample Data - aligned with @timesheet/sdk types
// =============================================================================

/**
 * Timer responses (SDK: Timer interface)
 */
export const mockTimerRunning = {
  status: 'running' as const,
  task: {
    id: 'task-123',
    projectId: 'proj-123',
    project: {
      id: 'proj-123',
      title: 'Test Project',
      color: 5,
    },
    description: 'Working on tests',
    duration: 3600,
    startDateTime: '2025-01-29T10:00:00+00:00',
    billable: true,
  },
};

export const mockTimerStopped = {
  status: 'stopped' as const,
  task: {
    id: 'task-123',
    projectId: 'proj-123',
    project: {
      id: 'proj-123',
      title: 'Test Project',
      color: 5,
    },
    duration: 7200,
    startDateTime: '2025-01-29T10:00:00+00:00',
    endDateTime: '2025-01-29T12:00:00+00:00',
  },
};

/**
 * Project data (SDK: Project interface)
 * Note: teamId is included for operations that extract it directly
 */
export const mockProject = {
  id: 'proj-123',
  title: 'Test Project',
  description: 'A test project',
  color: 5,
  archived: false,
  teamId: 'team-123',
  team: {
    id: 'team-123',
    name: 'Test Team',
  },
  created: 1706533200000,
  lastUpdate: 1706533200000,
};

export const mockProjects = [
  mockProject,
  {
    id: 'proj-456',
    title: 'Another Project',
    description: 'Another test project',
    color: 10,
    archived: false,
  },
];

/**
 * Task data (SDK: Task interface)
 */
export const mockTask = {
  id: 'task-123',
  projectId: 'proj-123',
  project: {
    id: 'proj-123',
    title: 'Test Project',
    color: 5,
  },
  description: 'Test task',
  startDateTime: '2025-01-29T10:00:00+00:00',
  endDateTime: '2025-01-29T12:00:00+00:00',
  duration: 7200,
  billable: true,
  billed: false,
  paid: false,
  tags: [
    { id: 'tag-1', name: 'Development', color: 100 },
    { id: 'tag-2', name: 'Testing', color: 200 },
  ],
};

export const mockTasks = [
  mockTask,
  {
    id: 'task-456',
    projectId: 'proj-456',
    project: {
      id: 'proj-456',
      title: 'Another Project',
    },
    description: 'Another task',
    startDateTime: '2025-01-29T14:00:00+00:00',
    endDateTime: '2025-01-29T16:00:00+00:00',
    duration: 7200,
    billable: false,
  },
];

/**
 * Tag data (SDK: Tag interface)
 */
export const mockTag = {
  id: 'tag-1',
  name: 'Development',
  color: 100,
  team: {
    id: 'team-123',
    name: 'Test Team',
  },
  archived: false,
  created: 1706533200000,
  lastUpdate: 1706533200000,
};

export const mockTags = [
  mockTag,
  {
    id: 'tag-2',
    name: 'Testing',
    color: 200,
    team: {
      id: 'team-123',
      name: 'Test Team',
    },
    archived: false,
    created: 1706533200000,
    lastUpdate: 1706533200000,
  },
];

/**
 * Rate data (SDK: Rate interface)
 */
export const mockRate = {
  id: 'rate-1',
  title: 'Standard Rate',
  factor: 1.0,
  extra: 0,
  enabled: true,
  archived: false,
  team: {
    id: 'team-123',
    name: 'Test Team',
  },
  created: 1706533200000,
  lastUpdate: 1706533200000,
};

export const mockRates = [
  mockRate,
  {
    id: 'rate-2',
    title: 'Overtime Rate',
    factor: 1.5,
    extra: 10,
    enabled: true,
    archived: false,
    team: {
      id: 'team-123',
      name: 'Test Team',
    },
    created: 1706533200000,
    lastUpdate: 1706533200000,
  },
];

/**
 * Profile data (SDK: Profile interface)
 */
export const mockProfile = {
  email: 'test@example.com',
  imageUrl: 'https://example.com/avatar.jpg',
  firstname: 'Test',
  lastname: 'User',
  newsletter: true,
  activated: true,
  user: 'user-123',
  subscriptionId: 'sub-123',
  expires: 1735689600000,
  status: 1,
  plan: 3,
  valid: true,
  expired: false,
  product: 'pro',
  trial: false,
  planBusiness: false,
  planPro: true,
  planPlus: false,
  planBasic: false,
  member: false,
  personalSubscriptionActive: true,
  organizationSubscriptionActive: false,
  validProfile: true,
  validAndActivated: true,
};

/**
 * Settings data (SDK: Settings interface)
 */
export const mockSettings = {
  theme: 'system' as const,
  language: 'en',
  timezone: 'America/New_York',
  currency: 'USD',
  distance: 'mi',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: 'hh:mm A',
  durationFormat: 'HH:mm',
  csvSeparator: ',',
  slotDuration: 1800,
  snapDuration: 900,
  entriesPerPage: 50,
  firstDay: 1,
  defaultTaskDuration: 3600,
  defaultBreakDuration: 1800,
  showRelatives: true,
  weeklySummary: false,
  monthlySummary: false,
  timerRounding: 0,
  timerRoundingType: 0,
  timerEditView: false,
  pauseRounding: 0,
  pauseRoundingType: 0,
  pauseEditView: false,
  autofillProjectSelection: false,
  lastUpdate: 1706533200000,
};

/**
 * Webhook data (SDK: Webhook interface)
 */
export const mockWebhook = {
  id: 'webhook-1',
  target: 'https://example.com/webhook',
  event: 'timer.start',
  created: 1706533200000,
  lastUpdate: 1706533200000,
};

export const mockWebhooks = [
  mockWebhook,
  {
    id: 'webhook-2',
    target: 'https://example.com/webhook2',
    event: 'task.create',
    created: 1706533200000,
    lastUpdate: 1706533200000,
  },
  {
    id: 'webhook-3',
    target: 'https://example.com/webhook3',
    event: 'timer.stop',
    created: 1706533200000,
    lastUpdate: 1706533200000,
  },
];
