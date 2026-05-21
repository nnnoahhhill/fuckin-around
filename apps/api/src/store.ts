import {
  assertSingleUseApproval,
  assertValidActionIntent,
  type ActionIntent,
  type AgentSession,
  type ApprovalDecision,
  type AuditEvent,
  type ExecutionResult,
  type InstructionSource,
  type UserInstruction
} from '@ghostline/protocol';

export interface GhostlineState {
  session: AgentSession;
  instructions: UserInstruction[];
  intents: ActionIntent[];
  approvals: ApprovalDecision[];
  results: ExecutionResult[];
  audit: AuditEvent[];
}

export class UnsupportedInstructionError extends Error {
  constructor(text: string) {
    super(`Instruction is outside the configured demo skills: ${text}`);
  }
}

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;

export function createInitialState(): GhostlineState {
  const createdAt = now();

  const session: AgentSession = {
    id: id('session'),
    ownerId: 'owner_local',
    mode: 'assist',
    capabilities: [
      'desktop.view',
      'desktop.control',
      'social.read',
      'social.react',
      'social.message',
      'marketplace.read',
      'marketplace.message',
      'media.publish',
      'music.react',
      'payments.quote',
      'payments.authorize',
      'storage.read',
      'storage.write'
    ],
    moneyPolicy: {
      currency: 'USD',
      perActionLimitCents: 5000,
      dailyLimitCents: 15000,
      allowedMerchantIds: ['spotify', 'apple', 'tiktok_promote', 'marketplace_seller'],
      requiresFreshApprovalAboveCents: 1
    },
    activeDisplay: {
      name: 'Ghostline virtual desktop',
      resolution: '1920x1080',
      transport: 'webrtc'
    },
    createdAt
  };

  return {
    session,
    instructions: [],
    intents: [],
    approvals: [],
    results: [],
    audit: [
      {
        id: id('audit'),
        event: 'instruction.received',
        subjectId: session.id,
        actor: 'system',
        summary: 'Ghostline demo session is ready on a virtual display.',
        createdAt
      }
    ]
  };
}

export function createInstructionIntent(
  state: GhostlineState,
  text: string,
  source: InstructionSource
): { instruction: UserInstruction; intent: ActionIntent } {
  const instruction: UserInstruction = {
    id: id('instruction'),
    text,
    source,
    createdAt: now()
  };

  const intent = planSingleIntent(instruction);
  assertValidActionIntent(intent);

  state.instructions.unshift(instruction);
  state.intents.unshift(intent);
  state.audit.unshift({
    id: id('audit'),
    event: 'instruction.received',
    subjectId: instruction.id,
    actor: 'user',
    summary: text,
    createdAt: instruction.createdAt
  });
  state.audit.unshift({
    id: id('audit'),
    event: 'intent.created',
    subjectId: intent.id,
    actor: 'agent',
    summary: intent.summary,
    createdAt: intent.createdAt
  });

  return { instruction, intent };
}

export function approveIntent(state: GhostlineState, intentId: string, approvedBy: string): ExecutionResult {
  const intent = getIntent(state, intentId);

  if (!intent.requiresApproval) {
    return executeIntent(state, intent);
  }

  const decision: ApprovalDecision = {
    id: id('approval'),
    intentId,
    decision: 'approve',
    approvedBy,
    singleUse: true,
    createdAt: now(),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  };

  assertSingleUseApproval(decision);
  state.approvals.unshift(decision);
  state.audit.unshift({
    id: id('audit'),
    event: 'approval.recorded',
    subjectId: decision.id,
    actor: 'user',
    summary: `Approved one execution for ${intent.summary}`,
    createdAt: decision.createdAt
  });

  return executeIntent(state, intent);
}

export function rejectIntent(state: GhostlineState, intentId: string, approvedBy: string): ExecutionResult {
  const intent = getIntent(state, intentId);
  const completedAt = now();
  const result: ExecutionResult = {
    id: id('result'),
    intentId,
    status: 'rejected',
    output: `Rejected: ${intent.summary}`,
    evidence: [],
    completedAt
  };

  state.results.unshift(result);
  state.audit.unshift({
    id: id('audit'),
    event: 'execution.rejected',
    subjectId: result.id,
    actor: 'user',
    summary: `${approvedBy} rejected ${intent.summary}`,
    createdAt: completedAt
  });

  return result;
}

function executeIntent(state: GhostlineState, intent: ActionIntent): ExecutionResult {
  const completedAt = now();
  const result: ExecutionResult = {
    id: id('result'),
    intentId: intent.id,
    status: 'completed',
    output: executionOutput(intent),
    evidence: [
      {
        type: intent.kind === 'view_snapshot' ? 'screenshot' : 'audit_log',
        uri: `/evidence/${intent.id}`,
        redacted: true
      }
    ],
    completedAt
  };

  state.results.unshift(result);
  state.audit.unshift({
    id: id('audit'),
    event: 'execution.completed',
    subjectId: result.id,
    actor: 'agent',
    summary: result.output,
    createdAt: completedAt
  });

  return result;
}

function getIntent(state: GhostlineState, intentId: string): ActionIntent {
  const intent = state.intents.find((item) => item.id === intentId);

  if (!intent) {
    throw new Error(`Unknown intent: ${intentId}`);
  }

  return intent;
}

function planSingleIntent(instruction: UserInstruction): ActionIntent {
  const lowerText = instruction.text.toLowerCase();
  const createdAt = now();

  if (lowerText.includes('photo') || lowerText.includes('screenshot')) {
    return {
      id: id('intent'),
      instructionId: instruction.id,
      kind: 'view_snapshot',
      capability: 'social.read',
      target: {
        service: 'instagram',
        id: 'latest-post',
        label: 'Latest photo from pinned person',
        url: 'https://instagram.com/'
      },
      summary: 'Open the latest relevant social photo and show a redacted screenshot.',
      parameters: {
        screenshotOnly: true
      },
      risk: 'low',
      requiresApproval: false,
      irreversible: false,
      expectedOutput: 'A single screenshot is shown to the user.',
      createdAt
    };
  }

  if (lowerText.includes('marketplace') || lowerText.includes('seller')) {
    return {
      id: id('intent'),
      instructionId: instruction.id,
      kind: 'marketplace_outreach',
      capability: 'marketplace.message',
      target: {
        service: 'facebook_marketplace',
        id: 'selected-listing',
        label: 'Best matching marketplace listing',
        url: 'https://facebook.com/marketplace'
      },
      summary: 'Send exactly one approved message to one marketplace seller.',
      parameters: {
        message: 'Hi, is this still available?',
        maxMessages: 1
      },
      risk: 'medium',
      requiresApproval: true,
      irreversible: true,
      expectedOutput: 'One seller receives one user-approved message.',
      createdAt
    };
  }

  if (lowerText.includes('like') && lowerText.includes('song')) {
    return {
      id: id('intent'),
      instructionId: instruction.id,
      kind: 'music_reaction',
      capability: 'music.react',
      target: {
        service: 'spotify',
        id: 'now-playing',
        label: 'Current Spotify track'
      },
      summary: 'Like the currently playing song.',
      parameters: {
        reaction: 'like'
      },
      risk: 'low',
      requiresApproval: true,
      irreversible: false,
      expectedOutput: 'The current track is saved to liked songs.',
      createdAt
    };
  }

  if (lowerText.includes('like') || lowerText.includes('love u') || lowerText.includes('love you')) {
    return {
      id: id('intent'),
      instructionId: instruction.id,
      kind: 'send_message',
      capability: 'social.message',
      target: {
        service: 'instagram',
        id: 'latest-post-author',
        label: 'Latest post author'
      },
      summary: 'Send exactly one approved social reply to the latest post author.',
      parameters: {
        message: 'I love you babe, you look great.',
        maxMessages: 1
      },
      risk: 'medium',
      requiresApproval: true,
      irreversible: true,
      expectedOutput: 'One reply is sent after user approval.',
      createdAt
    };
  }

  if (lowerText.includes('tiktok') || lowerText.includes('post video')) {
    return {
      id: id('intent'),
      instructionId: instruction.id,
      kind: 'publish_media',
      capability: 'media.publish',
      target: {
        service: 'tiktok',
        id: 'draft-video',
        label: 'Selected TikTok draft'
      },
      summary: 'Publish one selected TikTok draft after approval.',
      parameters: {
        visibility: 'public',
        maxPosts: 1
      },
      risk: 'high',
      requiresApproval: true,
      irreversible: true,
      expectedOutput: 'One selected video is posted.',
      createdAt
    };
  }

  throw new UnsupportedInstructionError(instruction.text);
}

function executionOutput(intent: ActionIntent): string {
  switch (intent.kind) {
    case 'view_snapshot':
      return 'Displayed one redacted screenshot from the virtual desktop.';
    case 'marketplace_outreach':
      return 'Sent one approved marketplace message and recorded the listing price.';
    case 'music_reaction':
      return 'Liked the currently playing song.';
    case 'send_message':
      return 'Sent one approved social message.';
    case 'publish_media':
      return 'Published one approved media draft.';
    case 'payment_authorization':
      return 'Authorized one approved payment within policy.';
    case 'remote_control':
      return 'Completed one approved remote desktop action.';
    case 'react_to_content':
      return 'Applied one approved reaction.';
  }
}
