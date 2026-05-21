import { describe, expect, it } from 'vitest';

import {
  assertSingleUseApproval,
  assertValidActionIntent,
  type ActionIntent,
  type ApprovalDecision
} from './index.js';

const baseIntent: ActionIntent = {
  id: 'intent_1',
  instructionId: 'instruction_1',
  kind: 'marketplace_outreach',
  capability: 'marketplace.message',
  target: {
    service: 'facebook_marketplace',
    id: 'listing_123',
    label: 'Used cargo bike'
  },
  summary: 'Ask one seller whether the cargo bike is still available.',
  parameters: {
    message: 'Hi, is this still available?'
  },
  risk: 'medium',
  requiresApproval: true,
  irreversible: true,
  expectedOutput: 'One seller message is sent.',
  createdAt: '2026-05-21T04:00:00.000Z'
};

describe('Ghostline action protocol', () => {
  it('accepts a single marketplace outreach intent that requires approval', () => {
    expect(() => assertValidActionIntent(baseIntent)).not.toThrow();
  });

  it('rejects marketplace messaging without approval', () => {
    expect(() =>
      assertValidActionIntent({
        ...baseIntent,
        requiresApproval: false
      })
    ).toThrow('marketplace_outreach intents require approval');
  });

  it('requires payment authorizations to be critical risk', () => {
    expect(() =>
      assertValidActionIntent({
        ...baseIntent,
        kind: 'payment_authorization',
        capability: 'payments.authorize',
        risk: 'high'
      })
    ).toThrow('payment_authorization intents must be critical risk');
  });

  it('requires approvals to be single-use', () => {
    const decision: ApprovalDecision = {
      id: 'approval_1',
      intentId: 'intent_1',
      decision: 'approve',
      approvedBy: 'owner',
      singleUse: true,
      createdAt: '2026-05-21T04:00:01.000Z'
    };

    expect(() => assertSingleUseApproval(decision)).not.toThrow();
  });
});
