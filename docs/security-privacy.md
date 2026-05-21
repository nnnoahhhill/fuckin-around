# Security and privacy

Ghostline should feel like hiring a very fast assistant who has to ask before touching anything
that matters.

## Isolation

- One virtual desktop per active user session.
- Ephemeral desktop containers for risky browsing sessions.
- Separate browser profiles per app/account.
- No cross-user clipboard, download directory, cookie jar, or model memory.
- User can end a session and revoke tokens immediately.

## Secrets

- Store app credentials and refresh tokens in a vault.
- Issue short-lived desktop tokens for each worker.
- Bind tokens to capability, target service, and session id.
- Never expose raw secrets to the browser console, model prompt, or web UI.

## Screenshots and remote frames

- Default screenshots are cropped to the relevant app region.
- Sensitive text regions are redacted before display to the user or model unless the user opens the
  full remote view.
- Raw video recordings are retained only when user policy enables them.
- Evidence references carry a `redacted` flag.

## Human handoff

The user can take control through WebRTC remote desktop. During handoff:

- the agent stops issuing input;
- keyboard and pointer authority belong to the user;
- the audit log records the control transition;
- the user can return control to the agent with one explicit command.

## Guard rails

- No bulk outbound messaging.
- No silent purchases, transfers, donations, subscriptions, boosts, ads, or tips.
- No contact scraping.
- No background account creation.
- No hidden deletion of posts, comments, chats, files, or account settings.

## Audit log

Audit logs are append-only and include:

- instruction text/source;
- generated intent;
- approval decision;
- execution result;
- evidence pointers;
- actor and timestamp.

The user owns export and deletion controls for audit data, subject to payment and abuse-prevention
records required by the hosting provider.
