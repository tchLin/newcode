# Session JSON, version 1

Both **Download JSON** and `session.json` in the review ZIP have the same document structure. Exporting does not upload anything. This is a session analysis artifact, not an importable progress backup.

| Field | Meaning |
| --- | --- |
| `format`, `schemaVersion` | `newcode-session`, `1`; check these before parsing. |
| `id` | UUID for one visit to a workspace. A new visit starts a new session. |
| `startedAt`, `updatedAt`, `endedAt`, `exportedAt` | UTC ISO timestamps. `endedAt` can be null for an open or uncleanly closed session. |
| `problem` | ID, title, brief, track, difficulty, supplied checks, prior completion state. |
| `initialMode`, `model` | Starting assistance mode and configured model/runtime. This is not evidence that the model was actually loaded. |
| `events` | Ordered activity records with stable event IDs. |
| `snapshots` | Immutable code checkpoints; each contains an ID, timestamp, language, and filename-to-source map. Identical content in the same language is deduplicated. |
| `final` | Last captured files, language, review notes, and export snapshot ID. For both algorithms and labs the final files cover the selected language; earlier language checkpoints remain in `snapshots`. |
| `analysis` | Deterministic metrics, review opportunities, and interpretation limits. No AI grade. |

## Events

Every event has `id`, `type`, and `at`. Sequence order breaks timestamp ties. An operation's event occupies its starting position even when it completes later; use `completedAt` when analyzing its completion.

- `session.started`, `session.ended`: session boundaries.
- `ai.turn`: `prompt`, `response`, exact `request` messages, `model`, `generation` settings, `language`, `mode`, `selectedFile`, `includeCode`, `snapshotId`, `status`, and optionally `completedAt`, `finishReason`, `error`.
- `test.run`: `language`, `mode`, `selectedFile`, `provider`, `snapshotId`, `status`, and optionally `completedAt`, `results` (name, passed, failure detail), `diagnostics`, `error`.
- `hint.revealed`: stable hint ID, level, title, exact text, language, and mode. Legacy sessions may use `hint.opened`.
- `agent.run`: user prompt, mode, language, model, starting snapshot, status, summary, and step count.
- `agent.request`: step, parent `runId`, exact request messages, streamed/full response, generation settings, finish reason when available, snapshot, and status.
- `agent.action`: validated action or validation failure, step, parent run ID, outcome, optional prior source and tool result. Edit outcomes distinguish `awaiting_approval`, `accepted`, `rejected`, `applied`, and `error`. Approval does not prove an edit was applied.
- `agent.finished`: terminal loop outcome (`completed`, `step_limit`, `cancelled`, or `error`) and summary. A model-provided summary is not independent proof of success.
- `mode.changed`, `language.changed`, `file.reset`, `timer.changed`: explicitly observed user activity. Timer actions include started, paused, reset, duration.changed, and expired. Timers are optional on both tracks; countdown expiry never submits code or ends a session.

Modes are `solo`, `hints`, `chat`, and `agent`. Older sessions retain their original `strict` / `assisted` names. Mode changes preserve the same session; prior assistance stays recorded. `test.run.source` is `user` or `agent` on new sessions.

AI statuses are `streaming`, `completed`, `truncated` (model output limit), `error`, `cancelled` (explicit unload/solo/navigation cancellation), or `interrupted`. Test statuses are `running`, `completed`, `error`, `cancelled`, or `interrupted`. A completed test run can still contain failing checks. Cancellation cannot guarantee remote execution was stopped.

Agent requests use `running` while generating and preserve partial streamed text when interrupted. The JSON analysis includes modes used, activity per mode, agent runs, applied/rejected edits, and invalid/failed actions. It does not grade ability or establish independence from outside tools.

`request` is the exact message array sent to WebLLM, including the system prompt and any truncated recent context. The full transcript is retained in `events`, even though only a limited part is sent to the model. `includeCode` governs model context; exported checkpoints still contain the user's code, as stated next to the download controls.

## Example: analyze with Python

```python
import json
from pathlib import Path

session = json.loads(Path("session.json").read_text(encoding="utf-8"))
assert session["format"] == "newcode-session"
assert session["schemaVersion"] == 1

snapshots = {s["id"]: s for s in session["snapshots"]}
turns = [e for e in session["events"] if e["type"] == "ai.turn"]
runs = [e for e in session["events"] if e["type"] == "test.run"]

for turn in turns:
    print(turn["id"], turn["at"], turn["status"])
    print("User:", turn["prompt"])
    print("Assistant:", turn["response"])
    code_at_request = snapshots[turn["snapshotId"]]["files"]
    # Compare source text as data. Do not execute exported code.

for run in runs:
    if run["status"] == "completed":
        passed = sum(r["passed"] for r in run["results"])
        print(run["language"], passed, "/", len(run["results"]))
```

## Analysis boundaries

Elapsed wall-clock span runs to session end or last saved activity and includes idle time. Do not use it as active coding time. Compare test runs within the same language and task. Prompt volume is not a proxy for prompt quality. A run following a reply establishes sequence, not use of that advice or causality. Initial code may be a saved/imported draft, so a fast first passing run is not necessarily a solve from scratch.

History is local to the browser origin and can be cleared or evicted. A crash may lose the last unsaved update. Legacy JSON uses `newcode-legacy-chat` and explicitly lacks exact context, checkpoints, and test history; do not mix it into complete-session metrics without marking those gaps.
