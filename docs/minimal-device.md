# Minimal device concept

Ghostline can run as software only, but the best version is a small anti-screen companion device.

## Hardware goals

- Pocketable slab with an e-ink or low-refresh OLED idle screen.
- Push-to-talk button.
- Privacy switch for mic/camera.
- Speaker for short readouts and calls.
- Expandable screen or dock mode for remote desktop view.
- Camera for quick capture, document scan, and "show the agent this" moments.
- Local storage cache with server-backed long-term storage.

## Modes

| Mode | User experience |
| --- | --- |
| Listen | user speaks a task or voice memo |
| Readout | agent summarizes one thing aloud |
| Peek | device shows one screenshot/photo/card |
| Remote | expanded display shows the virtual desktop |
| Take control | user drives the server desktop directly |

## Local model option

Users should choose between:

- fully local model on their own server;
- hybrid local planner plus hosted speech/vision;
- managed Ghostline hosting with extra storage and device sync.

The protocol stays the same across modes so users can move from managed hosting to self-hosting
without changing how approvals work.

## Accessibility

Ghostline should be useful for people who cannot easily use touchscreens, keyboards, or mice.

Important accessibility surfaces:

- voice-first task entry;
- phone-call control;
- one-button approve/reject;
- speech readout of screenshots;
- low-latency remote control for caregivers or the user;
- deterministic audit trail for reviewing what happened.
