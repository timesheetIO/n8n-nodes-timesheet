# Quick Start Guide

## Installation

```bash
cd n8n-nodes-timesheet
npm install
```

## Build

```bash
npm run build
```

This will:
1. Compile TypeScript to JavaScript in the `dist/` directory
2. Run ESLint to check code quality
3. Generate declaration files

## Test Locally

### Option 1: Link to n8n

```bash
# In the n8n-nodes-timesheet directory
npm link

# In your n8n custom nodes directory
cd ~/.n8n/custom
npm link n8n-nodes-timesheet

# Restart n8n
n8n start
```

### Option 2: Copy to n8n

```bash
# Build first
npm run build

# Copy to n8n custom nodes
cp -r dist ~/.n8n/custom/n8n-nodes-timesheet/

# Restart n8n
n8n start
```

## Configure Authentication

### Using API Key

1. Generate an API key at: https://my.timesheet.io/development
2. In n8n, go to **Credentials** → **New Credential**
3. Select **Timesheet API**
4. Enter your API key (format: `ts_{prefix}.{secret}`)
5. Click **Test** to verify the connection
6. **Save**

### Using OAuth2

1. Register your n8n instance as an OAuth2 application
2. Configure redirect URI: `https://your-n8n-instance/rest/oauth2-credential/callback`
3. In n8n, go to **Credentials** → **New Credential**
4. Select **Timesheet OAuth2 API**
5. Enter `client_id` and `client_secret`
6. Click **Connect my account**
7. Authorize the application
8. **Save**

## Create Your First Workflow

### Example 1: Start Timer on Project

1. Add a **Manual Trigger** node
2. Add a **Timesheet** node
3. Configure:
   - **Authentication**: Select your credential
   - **Resource**: Timer
   - **Operation**: Start
   - **Project**: Select from dropdown or enter ID
4. Execute the workflow
5. Check the output - timer should be running!

### Example 2: List Recent Tasks

1. Add a **Schedule Trigger** node (daily at 9 AM)
2. Add a **Timesheet** node
3. Configure:
   - **Authentication**: Select your credential
   - **Resource**: Task
   - **Operation**: Get Many
   - **Return All**: False
   - **Limit**: 10
   - **Filters** → **Sort By**: Date/Time
   - **Filters** → **Sort Order**: Descending
4. Add a **Send Email** node to send daily summary
5. Activate the workflow

### Example 3: Create Project from Form

1. Add a **Webhook** node (responds to POST requests)
2. Add a **Timesheet** node
3. Configure:
   - **Authentication**: Select your credential
   - **Resource**: Project
   - **Operation**: Create
   - **Title**: `{{ $json["project_name"] }}`
   - **Additional Fields** → **Description**: `{{ $json["description"] }}`
4. Add a **Respond to Webhook** node
5. Activate the workflow
6. Test with cURL:

```bash
curl -X POST https://your-n8n-instance/webhook/create-project \
  -H "Content-Type: application/json" \
  -d '{"project_name": "New Client Project", "description": "Website redesign"}'
```

## Available Resources

### Timer Operations
- **Start**: Begin tracking time on a project
- **Stop**: Stop the running timer
- **Pause**: Take a break
- **Resume**: Continue after a break
- **Get Status**: Check current timer state
- **Update**: Modify task details (description, tags, billable)

### Project Operations
- **Create**: Create a new project
- **Get**: Get project details by ID
- **Update**: Modify project details
- **Delete**: Remove a project
- **Get Many**: List projects with filters

### Task Operations
- **Create**: Create a time entry
- **Get**: Get task details by ID
- **Update**: Modify task details
- **Delete**: Remove a task
- **Get Many**: List tasks with filters

## Development

### Run Tests

```bash
npm test
```

### Watch Mode (for development)

```bash
npm run dev
```

This will recompile TypeScript files as you edit them.

### Lint and Format

```bash
npm run lint
npm run lint:fix
npm run format
```

## Debugging

### Enable n8n Debug Logs

```bash
export N8N_LOG_LEVEL=debug
n8n start
```

### Check n8n Logs

```bash
# macOS/Linux
tail -f ~/.n8n/n8n.log

# Or check the terminal where n8n is running
```

### Common Issues

#### "Node not found"
- Make sure you ran `npm run build`
- Check that the dist/ directory exists
- Restart n8n after linking

#### "Authentication failed"
- Verify your API key format: `ts_{prefix}.{secret}`
- Check that the API key is active at https://my.timesheet.io/development
- Test the credential in n8n

#### "Module not found: @timesheet/sdk"
- Run `npm install` in the n8n-nodes-timesheet directory
- The SDK should be listed in dependencies

## Next Steps

1. **Add More Resources**: Implement Tag, Rate, Team, Expense resources
2. **Add Binary Data Support**: For document downloads
3. **Create Example Workflows**: Add to docs/examples/
4. **Write Tests**: Add unit tests for operations
5. **Publish to npm**: Share with the n8n community

## Resources

- [n8n Documentation](https://docs.n8n.io)
- [Timesheet API Docs](https://api.timesheet.io)
- [TypeScript SDK](https://github.com/timesheetIO/timesheet-typescript)
- [n8n Community](https://community.n8n.io)

## Support

- **Issues**: https://github.com/timesheetIO/n8n-nodes-timesheet/issues
- **Email**: support@timesheet.io
- **Community**: https://community.timesheet.io
