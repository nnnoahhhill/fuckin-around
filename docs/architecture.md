# Architecture

## System overview

Ghostline has four planes:

1. **User interface plane** - mobile app, web console, call bridge, voice memo input, and optional
   minimal hardware device.
2. **Agent plane** - planner, browser/computer-use worker, app-specific skills, and action intent
   generator.
3. **Desktop plane** - isolated virtual display with browser, app sessions, storage mounts, and
   low-latency remote view/control.
4. **Trust plane** - capability registry, approval service, audit log, secrets vault, payment limits,
   redaction, and session recording.

## Runtime flow

1. User sends one instruction by text, voice, call, or device button.
2. API records the instruction.
3. Planner emits one `ActionIntent`.
4. Trust plane validates capability, risk, target, and approval requirements.
5. User approves or rejects that exact intent.
6. Desktop worker executes one action on the virtual display.
7. Evidence is attached: screenshot, remote frame, receipt, or audit log.
8. User can take over the session through the same virtual display.

## App modules

- `apps/api` owns session state, instruction intake, action intent planning, approvals, execution
  results, and audit records.
- `apps/web` shows the virtual display, action composer, approval queue, protocol limits, and
  session metadata.
- `packages/protocol` defines the shared TypeScript contract for instructions, intents, approvals,
  evidence, sessions, and money policy.

## Real desktop execution

The current repo ships the control plane and demo execution loop. Production desktop execution adds:

- ephemeral Linux containers with Xvfb or Wayland headless sessions;
- WebRTC for low-latency video, with VNC/RDP available as explicitly configured transports;
- browser automation through Playwright plus human-control handoff;
- audio capture/output for music and calls;
- hardware-backed secrets access with short-lived account tokens;
- per-app skill packages for Instagram, TikTok, Spotify, marketplace, email, maps, and storage.

## Data model

Core objects:

- `UserInstruction` - one user request.
- `ActionIntent` - one planned action with capability, risk, target, params, and expected output.
- `ApprovalDecision` - one single-use approval or rejection.
- `ExecutionResult` - outcome and evidence for one execution.
- `AuditEvent` - append-only operational record.
- `AgentSession` - active virtual display and capability scope.

## Non-goals for the first version

- Bulk outbound messaging.
- Autonomous spending.
- Hidden posting or reacting.
- Cross-account data blending.
- Account creation without user identity proof and platform-specific consent.
