export type InstructionSource = 'text' | 'voice' | 'call' | 'device_button';

export type Capability =
  | 'desktop.view'
  | 'desktop.control'
  | 'social.read'
  | 'social.react'
  | 'social.message'
  | 'marketplace.read'
  | 'marketplace.message'
  | 'media.publish'
  | 'music.react'
  | 'payments.quote'
  | 'payments.authorize'
  | 'storage.read'
  | 'storage.write';

export type ActionKind =
  | 'view_snapshot'
  | 'remote_control'
  | 'send_message'
  | 'react_to_content'
  | 'marketplace_outreach'
  | 'payment_authorization'
  | 'publish_media'
  | 'music_reaction';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type ApprovalDecisionValue = 'approve' | 'reject';

export type ExecutionStatus = 'completed' | 'rejected' | 'failed';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface UserInstruction {
  id: string;
  source: InstructionSource;
  text: string;
  createdAt: string;
}

export interface ActionTarget {
  service: string;
  id: string;
  label: string;
  url?: string;
}

export interface ActionIntent {
  id: string;
  instructionId: string;
  kind: ActionKind;
  capability: Capability;
  target: ActionTarget;
  summary: string;
  parameters: Record<string, JsonValue>;
  risk: RiskLevel;
  requiresApproval: boolean;
  irreversible: boolean;
  expectedOutput: string;
  createdAt: string;
}

export interface ApprovalDecision {
  id: string;
  intentId: string;
  decision: ApprovalDecisionValue;
  approvedBy: string;
  singleUse: true;
  createdAt: string;
  expiresAt?: string;
}

export interface EvidenceRef {
  type: 'screenshot' | 'video' | 'receipt' | 'remote_frame' | 'audit_log';
  uri: string;
  redacted: boolean;
}

export interface ExecutionResult {
  id: string;
  intentId: string;
  status: ExecutionStatus;
  output: string;
  evidence: EvidenceRef[];
  completedAt: string;
}

export interface AuditEvent {
  id: string;
  event:
    | 'instruction.received'
    | 'intent.created'
    | 'approval.recorded'
    | 'execution.completed'
    | 'execution.rejected'
    | 'execution.failed';
  subjectId: string;
  actor: 'user' | 'agent' | 'system';
  summary: string;
  createdAt: string;
}

export interface MoneyPolicy {
  currency: string;
  perActionLimitCents: number;
  dailyLimitCents: number;
  allowedMerchantIds: string[];
  requiresFreshApprovalAboveCents: number;
}

export interface AgentSession {
  id: string;
  ownerId: string;
  mode: 'observe' | 'assist' | 'take_control';
  capabilities: Capability[];
  moneyPolicy: MoneyPolicy;
  activeDisplay: {
    name: string;
    resolution: string;
    transport: 'webrtc' | 'vnc' | 'rdp';
  };
  createdAt: string;
}

export const ONE_INPUT_ONE_OUTPUT_RULE = {
  maxIntentsPerInstruction: 1,
  maxExecutionsPerApproval: 1,
  bulkSocialMessagingAllowed: false,
  bulkMarketplaceMessagingAllowed: false
} as const;

export function validateActionIntent(intent: ActionIntent): string[] {
  const errors: string[] = [];

  if (!intent.id) {
    errors.push('intent.id is required');
  }

  if (!intent.instructionId) {
    errors.push('intent.instructionId is required');
  }

  if (!intent.summary) {
    errors.push('intent.summary is required');
  }

  if (!intent.target.id || !intent.target.service || !intent.target.label) {
    errors.push('intent.target requires id, service, and label');
  }

  if (intent.kind === 'payment_authorization' && intent.risk !== 'critical') {
    errors.push('payment_authorization intents must be critical risk');
  }

  if (intent.kind === 'send_message' && intent.requiresApproval !== true) {
    errors.push('send_message intents require approval');
  }

  if (intent.kind === 'marketplace_outreach' && intent.requiresApproval !== true) {
    errors.push('marketplace_outreach intents require approval');
  }

  if (intent.kind === 'publish_media' && intent.requiresApproval !== true) {
    errors.push('publish_media intents require approval');
  }

  return errors;
}

export function assertValidActionIntent(intent: ActionIntent): void {
  const errors = validateActionIntent(intent);

  if (errors.length > 0) {
    throw new Error(`Invalid action intent: ${errors.join('; ')}`);
  }
}

export function assertSingleUseApproval(decision: ApprovalDecision): void {
  if (decision.singleUse !== true) {
    throw new Error('Approval decisions must be single-use');
  }
}
