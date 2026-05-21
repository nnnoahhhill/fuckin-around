# Hosting model

Ghostline should be open source first and managed-hosting second.

## Self-hosted

Self-hosters run:

- API service;
- web console;
- virtual desktop workers;
- TURN/WebRTC infrastructure;
- storage bucket;
- secrets vault;
- optional local model runtime.

This is the privacy-maximal mode. Users own hardware, tokens, storage, and logs.

## Managed

Managed Ghostline provides:

- virtual desktop capacity;
- low-latency relay infrastructure;
- backups and extra storage;
- device sync;
- speech and vision models;
- optional local-first encryption for private files;
- operational monitoring for stuck sessions.

## Deployment split

- `apps/web` can deploy as static assets.
- `apps/api` runs as a Node service.
- desktop workers run separately because they need display, audio, GPU, browser, and sandbox controls.

## Storage

Storage should be split by sensitivity:

- account tokens in vault;
- user files in encrypted object storage;
- screenshots in short-retention evidence storage;
- audit logs in append-only storage;
- model scratch space in ephemeral worker disks.

## Open protocol

The `packages/protocol` contract is the portability layer. Any compatible agent runtime can accept
the same instruction, produce the same intent shape, request the same approval, and write the same
execution result.
