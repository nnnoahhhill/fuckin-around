import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { URL } from 'node:url';

import { type InstructionSource } from '@ghostline/protocol';

import {
  approveIntent,
  createInitialState,
  createInstructionIntent,
  rejectIntent,
  UnsupportedInstructionError
} from './store.js';

const port = Number(process.env.PORT ?? 8787);
const state = createInitialState();

const server = createServer(async (request, response) => {
  try {
    await route(request, response);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    const status = error instanceof UnsupportedInstructionError ? 422 : 500;
    sendJson(response, status, { error: message });
  }
});

server.listen(port, () => {
  console.log(`Ghostline API listening on http://localhost:${port}`);
});

async function route(request: IncomingMessage, response: ServerResponse): Promise<void> {
  setCorsHeaders(response);

  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
  const path = requestUrl.pathname;

  if (request.method === 'GET' && path === '/api/health') {
    sendJson(response, 200, { ok: true, service: 'ghostline-api' });
    return;
  }

  if (request.method === 'GET' && path === '/api/session') {
    sendJson(response, 200, state.session);
    return;
  }

  if (request.method === 'GET' && path === '/api/intents') {
    sendJson(response, 200, {
      instructions: state.instructions,
      intents: state.intents,
      results: state.results
    });
    return;
  }

  if (request.method === 'GET' && path === '/api/audit') {
    sendJson(response, 200, state.audit);
    return;
  }

  if (request.method === 'POST' && path === '/api/instructions') {
    const body = await readJson<{ text?: string; source?: InstructionSource }>(request);

    if (!body.text || !body.source) {
      sendJson(response, 400, { error: 'text and source are required' });
      return;
    }

    const payload = createInstructionIntent(state, body.text, body.source);
    sendJson(response, 201, payload);
    return;
  }

  const approveMatch = path.match(/^\/api\/intents\/([^/]+)\/approve$/);
  if (request.method === 'POST' && approveMatch) {
    const result = approveIntent(state, approveMatch[1], 'owner_local');
    sendJson(response, 201, result);
    return;
  }

  const rejectMatch = path.match(/^\/api\/intents\/([^/]+)\/reject$/);
  if (request.method === 'POST' && rejectMatch) {
    const result = rejectIntent(state, rejectMatch[1], 'owner_local');
    sendJson(response, 201, result);
    return;
  }

  sendJson(response, 404, { error: `Unknown route: ${request.method} ${path}` });
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  setCorsHeaders(response);
  response.writeHead(status, {
    'Content-Type': 'application/json'
  });
  response.end(JSON.stringify(body, null, 2));
}

function setCorsHeaders(response: ServerResponse): void {
  response.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN ?? 'http://localhost:5173');
  response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function readJson<T>(request: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];

  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString('utf8');

  if (!rawBody) {
    throw new Error('Request body is required');
  }

  return JSON.parse(rawBody) as T;
}
