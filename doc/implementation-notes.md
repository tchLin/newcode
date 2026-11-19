# Implementation decisions

The requested destination is a GitHub-hostable site, and the clarified connection model is visit-and-practice with browser-local progress. Accordingly, this implementation is static and does not register a hosted Sites project, add authentication, or deploy to an unrelated hosting provider.

The source document motivates two practice modes: algorithm work without AI and scoped engineering work with a lightweight model. The original Algo Arcade catalog supplies the first; three new two-file JavaScript exercises supply the second. Both work without downloading a model. The local AI panel is an opt-in enhancement with visible model-loading and hardware constraints.

The existing renderer and games remain under `dist/arcade/` so their established interactions are retained. The execution worker's path was changed from document-relative to module-relative to support reuse from the new top-level workspace. Tests cover that relocation and cancellation behavior. Both interfaces share the existing progress key when served on the same origin.

No contents of the original project were deleted, and no old Git metadata, node_modules, hosting project ID, credentials, or runtime data were copied.

References consulted for implementation:

- GitHub Pages Actions workflow: https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically
- WebLLM installation: https://webllm.mlc.ai/docs/user/get_started.html
- WebLLM worker integration: https://webllm.mlc.ai/docs/user/advanced_usage.html#using-web-workers
- WebLLM model catalog: https://github.com/mlc-ai/web-llm/blob/main/src/config.ts

The document's claims about individual employers, interview platforms, model intelligence, or universal browser memory limits were not needed to build the app and have not been republished as verified claims.
