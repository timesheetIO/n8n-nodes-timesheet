# n8n-nodes-timesheet

This is an n8n community node that provides integration with [Timesheet.io](https://timesheet.io) time tracking API.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Node Installation

```bash
# In n8n UI
Settings → Community Nodes → Install
# Enter: @timesheet/n8n-nodes-timesheet
```

### Manual Installation (Development)

```bash
# Clone and build
git clone https://github.com/timesheetIO/n8n-nodes-timesheet.git
cd n8n-nodes-timesheet
npm install
npm run build

# Link to n8n
npm link
cd ~/.n8n/custom
npm link @timesheet/n8n-nodes-timesheet

# Restart n8n
n8n start
```

## Prerequisites

- n8n version 1.0.0 or above
- Node.js 18.x or above
- timesheet.io account ([sign up](https://my.timesheet.io/signup))
- API credentials (see Authentication below)

## Credentials

### Option 1: API Key (Recommended for Automation)

1. Generate an API key at: https://my.timesheet.io/development
2. In n8n, create a new "Timesheet API" credential
3. Enter your API key in format: `ts_{prefix}.{secret}`
4. Test the connection

### Option 2: OAuth2 (For User-Authorized Apps)

1. Register your n8n instance as an OAuth2 application
2. Configure redirect URI: `https://your-n8n-instance/rest/oauth2-credential/callback`
3. In n8n, create a new "Timesheet OAuth2 API" credential
4. Enter client ID and client secret
5. Complete OAuth2 authorization flow

## Operations

### Supported resources

The Timesheet node supports the following resources. Each resource provides
create, get, update, delete, and get many operations unless noted otherwise.

- Timer (start, stop, pause, resume, status, update)
- Project
- Task
- Tag
- Rate
- Expense
- Note
- Pause
- Todo
- Team
- Automation
- Webhook
- Organization (get, update, get many)
- Absence Type
- Absence (create, get, update, delete, get many, approve, reject, cancel)
- Contract (create, get, update, delete, get many, activate, suspend, reactivate, terminate)
- Profile (get, update)
- Settings (get, update)
- Export (generate, send, templates, fields, report types)
- Report (document, task, expense, and note reports as data or PDF/XML)

Organization, Absence Type, Absence, and Contract are organization-scoped. Pick
the organization on each operation, then the resource. Some operations (for
example approving an absence or suspending a contract) require manager or owner
permission; the API enforces this and returns a clear error when an action is
not allowed. Absence responses include `canApprove`, `canReject`, `canCancel`,
and `canEdit` flags so a workflow can branch on what the current user may do.

The Timesheet Trigger node listens for webhook events (timer, task, project,
team, todo, tag, and rate events).

Not yet covered: documents (invoice generation) and team or organization member
management. These are planned for a later release.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Development mode (watch)
npm run dev

# Lint
npm run lint
npm run lint:fix

# Format
npm run format
npm run format:check

# Test
npm test
npm run test:watch
npm run test:coverage
```

## Resources

- [Timesheet API Documentation](https://api.timesheet.io)
- [TypeScript SDK](https://github.com/timesheetIO/timesheet-typescript)
- [n8n Documentation](https://docs.n8n.io)

## Support

- Issues: https://github.com/timesheetIO/n8n-nodes-timesheet/issues
- Email: support@timesheet.io
- Community: https://community.timesheet.io

## License

[MIT](LICENSE.md)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

## Compatibility

| n8n-nodes-timesheet | n8n            | Node.js |
|---------------------|----------------|---------|
| 1.x.x               | >= 1.0.0       | >= 18.x |

