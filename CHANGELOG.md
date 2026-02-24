# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-XX

### Added
- Initial release of n8n-nodes-timesheet
- **Authentication**:
  - API Key authentication support
  - OAuth2 authentication support
- **Timesheet Node** - Main action node with 8 resources:
  - **Timer operations**:
    - Start timer
    - Stop timer
    - Pause timer
    - Resume timer
    - Get timer status
    - Update timer task details
  - **Project operations**:
    - Create project
    - Get project
    - Update project
    - Delete project
    - Get many projects (with filters)
  - **Task operations**:
    - Create task/time entry
    - Get task
    - Update task
    - Delete task
    - Get many tasks (with filters)
  - **Tag operations**:
    - Create tag
    - Get tag
    - Update tag
    - Delete tag
    - Get many tags (with filters)
  - **Rate operations**:
    - Create rate
    - Get rate
    - Update rate
    - Delete rate
    - Get many rates (with filters)
  - **Profile operations**:
    - Get profile
    - Update profile
  - **Settings operations**:
    - Get settings
    - Update settings
  - **Webhook operations**:
    - Create webhook
    - Get webhook
    - Update webhook
    - Delete webhook
    - Get many webhooks (with filters)
- **Timesheet Trigger Node** - Webhook-based trigger node:
  - Automatic webhook registration on workflow activation
  - Automatic webhook cleanup on workflow deactivation
  - Support for 16 event types:
    - Timer events: start, stop, pause, resume
    - Task events: create, update
    - Project events: create, update
    - Team events: create, update
    - Todo events: create, update
    - Tag events: create, update
    - Rate events: create, update
  - Multi-event selection support
  - Both API Key and OAuth2 authentication
- **Additional Features**:
  - Resource locator support for project selection
  - Dynamic dropdown options for projects, tags, and teams
  - Searchable project selection
  - Comprehensive error handling and mapping
  - Support for pagination (returnAll and limit)
  - Integration with @timesheet/sdk v1.0.2
  - Full TypeScript type safety
  - 121 comprehensive unit tests

### Notes
- Based on Timesheet API v1 (https://api.timesheet.io/v1)
- Requires n8n version 0.227.0 or above
- Node.js 18.x or above required
