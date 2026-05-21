# Ghostline

Ghostline is a self-hostable agent workstation: a headless server with a virtual display,
remote-control stream, voice/text/call input, and a strict approval protocol for actions that touch
accounts, money, social posting, or messages.

The point is simple: the agent can use a computer like a person while you stay off your phone. You
stay in control through one-at-a-time action approvals, redacted screenshots, audit logs, and
capability-scoped sessions. Think remote desktop plus assistant, but with explicit guard rails for
social accounts, marketplace messages, publishing, music reactions, and money.

## What is in this repo

This is the first working Ghostline prototype:

- a shared TypeScript protocol for instructions, action intents, approvals, execution results, and
  audit evidence;
- a Node API that plans one action from one instruction and enforces single-use approvals;
- a React console for command entry, virtual desktop preview, approval queue, and protocol limits;
- design docs for architecture, agent account use, security/privacy, money handling, hosting, and a
  minimal companion device.

## Repo layout

- `apps/api` - Node HTTP API for sessions, instructions, action intents, approvals, and audit logs.
- `apps/web` - React command center for the virtual desktop, approval queue, and protocol limits.
- `packages/protocol` - Shared TypeScript action protocol and validation rules.
- `docs` - Architecture, agent protocol, security, privacy, money handling, device, and hosting docs.

## Run locally

```bash
npm ci
npm run dev:api
npm run dev:web
```

Open `http://localhost:5173`.

The web dev server proxies `/api` to `http://localhost:8787`, so browser clients do not need direct
access to the API port.

## Demo flow

1. Open `http://localhost:5173`.
2. Press `M` to create one marketplace message intent.
3. Review the approval queue.
4. Press `A` to approve exactly that one action.
5. Confirm the virtual display card records the executed action.

## Test

```bash
npm run typecheck
npm test
npm run build
npm run e2e:api
```

`npm run e2e:api` expects `apps/api` to be running on `http://localhost:8787`.

## Core protocol rule

Ghostline follows a one input / one output standard:

1. The user gives one instruction.
2. The agent creates one action intent.
3. The user approves or rejects that one intent.
4. The system executes at most one action and records evidence.

Bulk social messages, bulk marketplace messages, and silent money movement are outside the protocol.

## Docs

- [Architecture](docs/architecture.md)
- [Agent action protocol](docs/agent-action-protocol.md)
- [Security and privacy](docs/security-privacy.md)
- [Money and trust](docs/money-and-trust.md)
- [Minimal device concept](docs/minimal-device.md)
- [Hosting model](docs/hosting.md)
