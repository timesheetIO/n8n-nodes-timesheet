# n8n-nodes-timesheet

This is an n8n community node that provides integration with [Timesheet.io](https://timesheet.io) time tracking API.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Node Installation

```bash
# In n8n UI
Settings → Community Nodes → Install
# Enter: n8n-nodes-timesheet
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
npm link n8n-nodes-timesheet

# Restart n8n
n8n start
```

## Prerequisites

- n8n version 0.227.0 or above
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

### Current Implementation Status

✅ **Phase 1 - Core Setup**
- API Key authentication
- OAuth2 authentication
- Error handling
- Helper utilities

🚧 **Phase 2 - Core Resources** (In Progress)
- Timer operations
- Project operations
- Task operations

📋 **Phase 3 - Extended Resources** (Planned)
- Tag management
- Rate management
- Team management
- Expense tracking
- Note attachments
- Pause/break tracking
- Document generation
- Webhook management
- Automation rules
- Todo items
- Profile settings

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
| 1.x.x               | >= 0.227.0     | >= 18.x |

