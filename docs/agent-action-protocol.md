# Agent action protocol

Ghostline uses a strict one input / one output standard inspired by game anti-bot rules: one user
instruction can produce one actionable proposal, and one approval can execute one action.

## Rule

```text
UserInstruction -> ActionIntent -> ApprovalDecision -> ExecutionResult
```

Limits:

- `maxIntentsPerInstruction = 1`
- `maxExecutionsPerApproval = 1`
- bulk social messaging is not allowed
- bulk marketplace messaging is not allowed
- payment authorization always requires fresh approval

## Action intent requirements

Every action intent must include:

- `kind` - what type of action will happen;
- `capability` - the permission being used;
- `target` - app, account object, listing, post, track, or payment destination;
- `summary` - plain English statement of the action;
- `parameters` - exact message text, reaction, amount, draft id, or query;
- `risk` - low, medium, high, or critical;
- `requiresApproval` - true for messaging, posting, money, purchases, and account changes;
- `irreversible` - true when the action changes external state;
- `expectedOutput` - what the user should see after execution.

## Capability examples

| Capability | Example | Approval |
| --- | --- | --- |
| `desktop.view` | show a screenshot | no, unless policy says sensitive |
| `desktop.control` | click a visible button | yes for external side effects |
| `social.read` | show one new photo | no |
| `social.react` | like one post | yes |
| `social.message` | send one reply | yes |
| `marketplace.read` | summarize listings | no |
| `marketplace.message` | message one seller | yes |
| `media.publish` | publish one TikTok draft | yes |
| `music.react` | like current song | yes |
| `payments.authorize` | pay or transfer money | yes, critical |

## Account-use standard

Agents using social accounts must:

- identify the account and platform before action;
- operate inside the user's existing session or a delegated account created by the user;
- show the exact target and text/media before irreversible execution;
- execute one message, post, comment, like, or follow per approval;
- record evidence after execution;
- stop on platform checkpoints, captchas, policy warnings, or identity prompts.

## Unsupported instructions

Unsupported instructions fail closed. The API returns `422` when the configured skill set cannot
produce a valid single action intent.
