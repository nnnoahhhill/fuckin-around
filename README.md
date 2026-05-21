# Ghostline

Ghostline is a self-hostable agent workstation: a headless server with a virtual display,
remote-control stream, voice/text/call input, and a strict approval protocol for actions that
touch accounts, money, social posting, or messages.

The point is simple: your agent can use a computer like a person while you stay off your phone.
You stay in control through one-at-a-time action approvals, redacted screenshots, audit logs, and
capability-scoped sessions.

## Repo layout

- `apps/api` - Node HTTP API for sessions, instructions, action intents, approvals, and audit logs.
- `apps/web` - React command center for the virtual desktop, approval queue, and protocol limits.
- `packages/protocol` - Shared TypeScript action protocol and validation rules.
- `docs` - Architecture, agent protocol, security, privacy, money handling, device, and hosting docs.

## Run it

```bash
npm install
npm run dev:api
npm run dev:web
```

Open `http://localhost:5173`.

## Test it

```bash
npm run typecheck
npm test
npm run build
npm run e2e:api
```

`npm run e2e:api` expects `apps/api` to be running on `http://localhost:8787`.

## Core rule

Ghostline follows a one input / one output standard:

1. The user gives one instruction.
2. The agent creates one action intent.
3. The user approves or rejects that one intent.
4. The system executes at most one action and records evidence.

Bulk social messages, bulk marketplace messages, and silent money movement are outside the protocol.
