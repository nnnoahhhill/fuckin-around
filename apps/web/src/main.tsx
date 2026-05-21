import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';

import {
  ONE_INPUT_ONE_OUTPUT_RULE,
  type ActionIntent,
  type AgentSession,
  type ExecutionResult,
  type InstructionSource,
  type UserInstruction
} from '@ghostline/protocol';

import './styles.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787';

interface TimelineState {
  instructions: UserInstruction[];
  intents: ActionIntent[];
  results: ExecutionResult[];
}

const samplePrompts = [
  'Show me the latest photo from my pinned person.',
  'Like this song on Spotify.',
  'Browse marketplace for a used cargo bike and message the seller.',
  'Post the selected TikTok draft.'
];

function App() {
  const [session, setSession] = useState<AgentSession | null>(null);
  const [timeline, setTimeline] = useState<TimelineState>({
    instructions: [],
    intents: [],
    results: []
  });
  const [text, setText] = useState(samplePrompts[0]);
  const [source, setSource] = useState<InstructionSource>('text');
  const [status, setStatus] = useState('Connect the API, then give Ghostline one instruction.');
  const [busy, setBusy] = useState(false);

  const latestResult = timeline.results[0];
  const approvalQueue = useMemo(
    () =>
      timeline.intents.filter(
        (intent) =>
          intent.requiresApproval &&
          !timeline.results.some((result) => result.intentId === intent.id)
      ),
    [timeline.intents, timeline.results]
  );

  useEffect(() => {
    void refresh();
  }, []);

  async function refresh() {
    const [sessionResponse, intentsResponse] = await Promise.all([
      api<AgentSession>('/api/session'),
      api<TimelineState>('/api/intents')
    ]);

    setSession(sessionResponse);
    setTimeline(intentsResponse);
  }

  async function submitInstruction(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setStatus('Planning one action intent.');

    try {
      const payload = await api<{ instruction: UserInstruction; intent: ActionIntent }>('/api/instructions', {
        method: 'POST',
        body: JSON.stringify({ text, source })
      });

      setStatus(
        payload.intent.requiresApproval
          ? 'Intent created. Approve or reject this single action.'
          : 'Intent created and ready to execute.'
      );
      await refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Instruction failed.');
    } finally {
      setBusy(false);
    }
  }

  async function decide(intentId: string, decision: 'approve' | 'reject') {
    setBusy(true);
    setStatus(`${decision === 'approve' ? 'Approving' : 'Rejecting'} one action.`);

    try {
      await api<ExecutionResult>(`/api/intents/${intentId}/${decision}`, {
        method: 'POST'
      });
      setStatus(decision === 'approve' ? 'One approved action executed.' : 'Action rejected.');
      await refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Decision failed.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">agent workstation</p>
          <h1>Ghostline</h1>
          <p className="hero-copy">
            A headless computer-use server that texts, calls, streams, and asks before doing
            irreversible stuff.
          </p>
        </div>
        <div className="device">
          <span className="notch" />
          <strong>hands free</strong>
          <small>voice, text, call, remote view</small>
        </div>
      </section>

      <section className="grid">
        <article className="panel command-panel">
          <div className="panel-heading">
            <p className="eyebrow">one input / one output</p>
            <h2>Tell the agent what to do</h2>
          </div>
          <form onSubmit={submitInstruction}>
            <textarea value={text} onChange={(event) => setText(event.target.value)} />
            <div className="form-row">
              <select value={source} onChange={(event) => setSource(event.target.value as InstructionSource)}>
                <option value="text">text</option>
                <option value="voice">voice</option>
                <option value="call">call</option>
                <option value="device_button">device button</option>
              </select>
              <button disabled={busy}>Plan action</button>
            </div>
          </form>
          <div className="prompt-list">
            {samplePrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => setText(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
          <p className="status">{status}</p>
        </article>

        <article className="panel desktop-panel">
          <div className="panel-heading">
            <p className="eyebrow">virtual display</p>
            <h2>{session?.activeDisplay.name ?? 'Ghostline desktop'}</h2>
          </div>
          <div className="remote-frame">
            <div className="browser-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="photo-card">
              <p>latest screenshot</p>
              <h3>Only the relevant app region is shown.</h3>
              <small>{latestResult?.output ?? 'No action executed yet.'}</small>
            </div>
          </div>
          <div className="display-meta">
            <span>{session?.activeDisplay.resolution ?? '1920x1080'}</span>
            <span>{session?.activeDisplay.transport ?? 'webrtc'}</span>
            <span>{session?.mode ?? 'assist'}</span>
          </div>
        </article>

        <article className="panel queue-panel">
          <div className="panel-heading">
            <p className="eyebrow">approval queue</p>
            <h2>Single actions only</h2>
          </div>
          {approvalQueue.length === 0 ? (
            <p className="empty">No pending approvals.</p>
          ) : (
            <div className="cards">
              {approvalQueue.map((intent) => (
                <div className="intent-card" key={intent.id}>
                  <strong>{intent.summary}</strong>
                  <p>{intent.expectedOutput}</p>
                  <div className="tags">
                    <span>{intent.capability}</span>
                    <span>{intent.risk}</span>
                    <span>{intent.irreversible ? 'irreversible' : 'reversible'}</span>
                  </div>
                  <div className="actions">
                    <button disabled={busy} onClick={() => decide(intent.id, 'approve')}>
                      Approve one
                    </button>
                    <button disabled={busy} className="secondary" onClick={() => decide(intent.id, 'reject')}>
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </article>

        <article className="panel protocol-panel">
          <div className="panel-heading">
            <p className="eyebrow">guard rails</p>
            <h2>Protocol hard limits</h2>
          </div>
          <dl>
            <div>
              <dt>Intent per instruction</dt>
              <dd>{ONE_INPUT_ONE_OUTPUT_RULE.maxIntentsPerInstruction}</dd>
            </div>
            <div>
              <dt>Execution per approval</dt>
              <dd>{ONE_INPUT_ONE_OUTPUT_RULE.maxExecutionsPerApproval}</dd>
            </div>
            <div>
              <dt>Bulk social messaging</dt>
              <dd>{String(ONE_INPUT_ONE_OUTPUT_RULE.bulkSocialMessagingAllowed)}</dd>
            </div>
            <div>
              <dt>Money approval above</dt>
              <dd>
                {session
                  ? `${session.moneyPolicy.currency} ${(
                      session.moneyPolicy.requiresFreshApprovalAboveCents / 100
                    ).toFixed(2)}`
                  : '$0.01'}
              </dd>
            </div>
          </dl>
        </article>
      </section>
    </main>
  );
}

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  });

  const body = (await response.json()) as T | { error: string };

  if (!response.ok) {
    throw new Error(hasErrorMessage(body) ? body.error : `${response.status} ${response.statusText}`);
  }

  return body as T;
}

function hasErrorMessage(value: unknown): value is { error: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'error' in value &&
    typeof (value as { error: unknown }).error === 'string'
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
