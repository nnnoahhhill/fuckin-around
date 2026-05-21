const baseUrl = process.env.GHOSTLINE_API_URL ?? 'http://localhost:8787';

async function request(path, init) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  });

  const body = await response.json();

  if (!response.ok) {
    throw new Error(`${init?.method ?? 'GET'} ${path} failed: ${response.status} ${JSON.stringify(body)}`);
  }

  return body;
}

const health = await request('/api/health');
if (health.service !== 'ghostline-api') {
  throw new Error('Health check did not hit Ghostline API');
}

const planned = await request('/api/instructions', {
  method: 'POST',
  body: JSON.stringify({
    source: 'text',
    text: 'Browse marketplace for a used cargo bike and message the seller.'
  })
});

if (planned.intent.requiresApproval !== true) {
  throw new Error('Marketplace outreach must require approval');
}

if (planned.intent.parameters.maxMessages !== 1) {
  throw new Error('Marketplace outreach must be limited to one message');
}

const result = await request(`/api/intents/${planned.intent.id}/approve`, {
  method: 'POST'
});

if (result.status !== 'completed') {
  throw new Error(`Expected completed execution, got ${result.status}`);
}

const unsupported = await fetch(`${baseUrl}/api/instructions`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    source: 'text',
    text: 'Do everything on my phone today.'
  })
});

if (unsupported.status !== 422) {
  throw new Error(`Unsupported instruction should fail with 422, got ${unsupported.status}`);
}

console.log('Ghostline API e2e passed');
