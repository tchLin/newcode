# Newcode

**Live site:** https://tchlin.github.io/newcode/

A static coding-practice website built for GitHub Pages. Visitors can open the site and practice immediately; drafts, bookmarks, completions, and lab notes are saved in their browser. No account, server, database, or API key is required.

## Run locally

```sh
npm run dev
```

Open **http://127.0.0.1:5173**. Requires Python 3 for the local HTTP server. Do not open `index.html` as a `file://` URL: module scripts and workers require HTTP or HTTPS.

No package installation is needed to run, test, or publish the committed site. Node.js 22+ and Python 3 (for independent ZIP validation) are used for checks:

```sh
npm test
npm run build
```

`npm run build` validates JavaScript syntax and local module imports. The complete publishable website is already in **`dist/`**.

## Publish on GitHub Pages

1. Create a GitHub repository for the contents of **this `newcode` directory**, with `package.json`, `dist`, `tests`, `scripts`, and `.github` at the repository root. Do not publish the entire parent `projects` folder.
2. Push the files to the repository's `main` branch. Include hidden `.github/workflows/pages.yml`.
3. In the repository, select **Settings → Pages → Build and deployment → Source → GitHub Actions**.
4. Run **Actions → Deploy Newcode to GitHub Pages → Run workflow**, or push another commit to `main`.
5. The workflow runs tests and static checks, uploads only `dist/`, and deploys it. Its deployment output gives the published URL, usually `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.

All application routes use URL hashes and all local assets use relative URLs, so repository subpaths and refreshed links work without server rewrite rules. No secrets need to be configured. The workflow follows [GitHub's Pages deployment guidance](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically).

The project repository is https://github.com/tchLin/newcode. GitHub Pages is configured through the included Actions workflow. The checkout has its own Git repository and does not inherit the older project's repository or Sites hosting identity.

## What is included

- **75 Blind 75 algorithm problems**, across 10 topics: searchable and filterable by topic, difficulty, completion, and bookmark.
- **Seven coding languages:** JavaScript, Python, C, C++, Java, Rust, and Go. Each problem/language pair retains its own draft and passed state.
- **CodeMirror editor:** syntax highlighting, indentation, undo/redo, find/replace, and Ctrl/Cmd+Enter to run. Escape followed by Tab leaves the editor.
- **75 original visual lessons**, preserved from Algo Arcade and accessible through “Visual games” or each problem's visual learning link. Games and the new library share progress on the same origin.
- **Three multi-file interview labs:** a stale cache and service, a cursor-paginated feed, and an event aggregation pipeline. Each has two editable JavaScript modules, eight acceptance checks, a 45- or 60-minute timer, review prompts, and saved notes.
- **Optional local AI:** read-only Qwen 2.5 Coder 1.5B chat, with a solo mode. You review suggestions and manually edit code.
- **Progress export/import:** portable JSON backups. Imported drafts replace matching local drafts; import does not run code.
- **Conversation and review exports:** direct JSON logs or a ZIP containing a readable report, JSON, and final code. Full session history is saved separately in IndexedDB and can be downloaded from My progress.

The interview labs apply the practice strategy in [`doc/lightweight-model-coding-interview-summary.md`](doc/lightweight-model-coding-interview-summary.md). The source document's company-specific claims, hardware limits, and speed estimates are not presented as verified facts on the site. The labs are small educational repositories, not replicas of any employer's interview.

## Local AI behavior

The AI module uses the documented [WebLLM worker API](https://webllm.mlc.ai/docs/user/advanced_usage.html#using-web-workers), pinned to `@mlc-ai/web-llm@0.2.79`, with model `Qwen2.5-Coder-1.5B-Instruct-q4f32_1-MLC`. The pinned package's model catalog reports approximately 1.9 GB of GPU memory. The first download is roughly 1 GB, and actual memory/download requirements vary.

- Nothing downloads until the visitor clicks **Load local model**.
- A WebGPU-compatible browser and sufficient GPU memory are required. HTTPS on Pages or localhost is needed. Unsupported devices can use all exercises and built-in hints without AI.
- The package comes from esm.run/jsDelivr; model files come from the URLs in WebLLM's model catalog, including Hugging Face and MLC's model libraries. Initial loading requires network access; model files can remain cached in browser storage.
- Inference runs locally. The application does not send prompts to a hosted model API.
- Context includes the problem brief and, if checked, up to 3,000 characters of the selected file. Total context and recent conversation are truncated for the small context window. The model cannot inspect the whole repository, run tests, or apply edits.
- Leaving the workspace or switching to solo mode terminates the model worker. “Unload model” also cancels an in-progress load. Loading times out after five minutes.
- New conversation logs have no 40-message cap. Complete recorded AI turns are stored with each session in IndexedDB. The model still receives only bounded recent context. Each workspace visit starts a separate session; older sessions remain downloadable from My progress. Older retained lab chats are available as clearly labelled legacy JSON, without reconstructed context or test history.
- Generation errors, including memory or context limits, are displayed in the chat panel. Generated advice may be wrong; the workflow is intentionally built around reviewing and testing it.

## Code execution and persistence

JavaScript and interview labs execute in disposable browser workers with two- and four-second limits, respectively. Lab modules use a small CommonJS-style `require('./file.js')` loader; Node APIs and npm packages are not supplied.

The six other languages reuse Algo Arcade's remote runners: Wandbox for C/C++/Java, Rust Playground for Rust, and Compiler Explorer for Python/Go. The editor states the selected destination. **Run tests sends the source and test inputs to that provider**; requests omit credentials. Availability, compiler versions, CORS policies, quotas, and rate limits depend on those external services. Remote calls have a 45-second client timeout, with no automatic retries. Cancellation stops waiting locally and does not guarantee that a provider cancels execution.

Practice results are client-side feedback, not an authoritative judge. Workers keep long-running code off the UI thread; they are not hardened security sandboxes. Tests check bounded fixtures and do not establish asymptotic complexity, even when a lab contains a larger test case.

Progress lives in browser localStorage (`algo-arcade-v1` and `newcode-labs-v1`); full session logs live in IndexedDB (`newcode-session-history`), scoped to the site origin. Clearing site storage removes it. Different browsers/devices do not synchronize. Export/import provides manual transfer. Opening the old app on a different origin does not migrate its storage automatically. Tabs do not provide conflict-free concurrent editing.

## Workspace layout

On desktop, the statement, code, tests, and AI conversation scroll independently inside the viewport. The chat composer remains below the conversation, and scrolling up to read older replies suspends automatic scrolling until you return to the bottom or choose **Jump to latest**. After loading, the model setup collapses to a compact **Model ready** row with an **Unload** control. Export options are in the **Download conversation** disclosure at the bottom of the assistant panel.

On narrow or very short screens, the panels stack, each with its own bounded scroll area. The page scrolls between panels while long statements and conversations scroll inside their panels.

## Conversation logs and review bundles

At the bottom of the coding partner panel, expand **Download conversation** and choose **Download JSON**. Use **Review bundle** for a single ZIP with `report.md`, `session.json`, `README.txt`, and final code files. Both exports include the same JSON data. CSV is not included: nested conversation/context/test data is represented directly in JSON.

Each log uses `format: "newcode-session"` and `schemaVersion: 1`, with a unique session ID and UTC timestamps. It records:

- Problem brief, checks, track, difficulty, and whether it was already solved when the session opened.
- Full prompts and responses, the exact bounded messages sent to the model, model/settings, selected file, code-context choice, completion time, and operation status.
- Immutable, deduplicated code checkpoints at opening, AI requests, test attempts, and closing/export; final work and review notes are retained separately. This is not a keystroke recording.
- Test results, failures, compiler notes, language/provider, hint opens, mode switches, file resets, and timer controls.
- Observable activity summaries and reflection suggestions. Counts and elapsed time are not interpreted as a skill score. Run progression is separated by language. A test after an AI response is not treated as proof that advice was used or caused improvement.

Sessions are saved automatically, with edits debounced and streaming text checkpointed about once per second. **My progress → Conversation & session history** provides JSON and ZIP downloads for previous visits. Closing/navigating interrupts pending work; a crash may leave the last saved status pending and can lose the latest unsaved changes. Export an important session before closing. If IndexedDB is unavailable or full, a warning appears and the session stays downloadable in memory until the page closes. There is no server upload or background analysis service.

Session JSON and ZIP are **analysis artifacts**, separate from resumable progress backups; the progress importer does not restore session archives. Prior sessions are not automatically fed into a new conversation. Older retained lab chats remain downloadable separately; messages that were previously discarded cannot be recovered.

The ZIP uses the store method for portability and has no CSV; it bundles files rather than compressing them. Direct JSON is the smallest provided export because it omits the readable report and separate code copies. JSON is not inherently smaller than CSV; its advantage here is preserving nested structures. Identical code checkpoints are stored once and referenced by ID.

The bundle's guide includes an optional review prompt for another AI: cite event/checkpoint IDs, separate evidence from uncertainty, and suggest specific practice exercises. Sharing is entirely the user's choice; exports include their prompts and code. See [the session format](doc/session-format.md) for field definitions and a parsing example.

## Reuse and project layout

The existing project was found at `../gamify_leetcode/algo-arcade`. Its source project was left unchanged. This website copies its exercise catalog, visual game components, CodeMirror bundle and license notices, language templates, execution/validation code, and tests. A separate new interface provides direct practice and the interview workflow.

`../sql-practice` was also reviewed. Its SQL/MySQL/Python/Spark stack depends on local servers and Docker, so it was not brought into the static GitHub Pages app. `../interview_agent` contains a Python agent rather than a reusable static coding UI.

```text
dist/index.html, styles.css     Newcode interface
dist/app.mjs                   Library, editor, timers, chat UI, progress
dist/labs.mjs                  Three original interview briefs and starter files
dist/lab-tests.mjs             Multi-file loader and lab acceptance checks
dist/lab-runner.mjs            Disposable lab worker entry point
dist/ai.mjs, ai-worker.mjs      Optional local WebLLM integration
dist/storage.mjs               Progress persistence and backup validation
dist/session-log.mjs           Session events, checkpoints, observations
dist/session-store.mjs         IndexedDB history with in-memory fallback
dist/session-export.mjs        Versioned JSON and readable review reports
dist/zip.mjs                   Dependency-free ZIP archive writer
dist/arcade/                   Reused Algo Arcade app, questions, and runtime
src/editor.mjs                 Reused CodeMirror source
scripts/build-editor.mjs       Optional editor bundle rebuild
scripts/check.mjs              Static build verification
tests/                         Reused and new regression checks
.github/workflows/pages.yml    GitHub Pages test-and-deploy workflow
doc/algo-arcade-source.md       Original app documentation and provenance
```

Third-party CodeMirror dependency license notices remain at `dist/arcade/vendor/editor.LICENSE.txt`. Existing learning links and problem identifiers are preserved. This is an independent educational project, unaffiliated with LeetCode or NeetCode.

To change the bundled editor, run `npm ci`, edit `src/editor.mjs`, and run `npm run build:editor`. Commit the rebuilt bundle and license notices. The new UI's CSS overrides the bundle's font size to 14 px. Normal UI changes do not need a bundler.

## Verification

- **81 automated tests pass**, including the 48 reused tests, 24 acceptance checks across three independently implemented lab solutions, deliberately incomplete starters, storage validation, AI context limits/cancellation, worker timeout/cancellation/recovery, full transcript retention, event status handling, export integrity, and independent Python ZIP verification.
- Browser worker entry points were exercised with a Node worker transport. This verifies module paths and execution behavior, but does not substitute for browser QA.
- **40 static modules** pass syntax/import checks. The local index and pinned WebLLM CDN module returned HTTP 200; the CDN module contains the selected model and required worker exports.
- **GitHub Pages deployment verified:** the Actions workflow passed all checks and deployed successfully on November 19, 2026. The public homepage and app module both returned HTTP 200.
- **Not verified here:** visual rendering and browser interactions (including IndexedDB persistence/download UI), an actual WebGPU model download/generation, fresh live submissions to external compiler providers, or browser interaction with the deployed site. The browser automation host was unavailable and native Chrome access was not approved.

Before sharing publicly, open the site in your target desktop/mobile browsers, complete a sample problem and lab, check backup import/export, load the optional model on a compatible device, and check any remote languages you intend to support.
