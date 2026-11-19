# Algo Arcade

A browser-based platform for learning coding patterns through games. **All 75 Blind 75 problems are playable**, each with two interactive rounds followed by a coding exercise in JavaScript, C, C++, Java, Rust, Go, or Python. Every problem has its official name and number, and algorithm tutorial links. Merge k Sorted Lists appears in both Linked List and Heap, with shared progress and XP.

The previous expansion added 30 problems: 53, 33, 268, 371, 190, 1143, 377, 213, 91, 62, 128, 261, 323, 252, 253, 125, 5, 647, 424, 139, 238, 338, 54, 347, 56, 57, 73, 48, 15, and 417. Visual boards cover arrays and pointers, binary transfers, DP tables, disjoint-set graphs, interval timelines, frequency buckets, and matrix traversal.

The final 25 cover Clone Graph, Alien Dictionary, all six linked-list problems, Group Anagrams, Encode and Decode Strings, all fourteen tree/trie problems, and Find Median from Data Stream. Visual boards show node identities and links, binary-tree branches, trie terminal markers, and two-heap balance.

## Run

Run `npm run dev` from this directory, then open http://localhost:5173. No package installation or build is required. Run `npm test` to verify game transitions, solution validation, draft migration, result parsing, and transport failures. `npm run test:remote` explicitly submits reference solutions to the execution providers, making 450 sequential requests to check all six remote languages across the 75 exercises. To check just the four advanced lessons in one language, run e.g. `npm run test:remote -- python advanced`. Use `npm run test:remote -- python expansion` for the 30-game expansion individually. `npm run test:expansion:remote` combines the 30 independent reference solutions into one compilation per remote language (six requests, 151 cases per language); add a language argument to select one. The `new` selector covers all exercises using the typed-signature harness. It requires Node 18+ and internet access and is intentionally excluded from the default test suite.

`npm run test:structures:local` verifies the final 25 exercises without network requests: 130 independent reference cases and 25 compiling starter interfaces in each of seven languages. Install local C/C++, Java, Rust, Go, and Python compilers, or set `AA_C`, `AA_CPP`, `AA_JAVA`, `AA_JAVAC`, `AA_RUST`, `AA_GO`, and `AA_PYTHON` to their executable paths. An optional language argument limits the run, for example `npm run test:structures:local -- rust`. `npm run test:structures:remote` explicitly submits the same reference suite to the providers; it is opt-in and was not rerun for this batch because external source submission was blocked by automatic approval review. Local verification uses Clang, Java 21, Rust 2021 edition, Go 1.23, and Python.

## Structure

- `dist/index.html` and `dist/styles.css`: responsive interface.
- `dist/logic.mjs`: challenge definitions, roadmap, game rules, and output validation.
- `dist/app.mjs`: navigation, progress, game-to-code transition, editor, and runner lifecycle.
- `dist/languages.mjs`: language catalog, starter templates, language-specific explanations, compilation harnesses, and result parsing.
- `dist/more-games.mjs` and `dist/more-game-ui.mjs`: interactive running-minimum, letter-count, and staircase lessons.
- `dist/more-languages.mjs`: typed starters and test harnesses for scalar/string outputs and integer-array, integer-matrix, and character-grid inputs. C string answers must be allocated with malloc/calloc; the harness frees them.
- `dist/expansion-catalog.mjs`, `dist/expansion-traces.mjs`, and `dist/expansion-ui.mjs`: the 30-game expansion, immutable algorithm snapshots, validated decision steps, and reusable visual boards.
- `dist/expansion-languages.mjs`: unsigned scalars, array/matrix answers, string dictionaries, and in-place matrix mutation contracts. C arrays use return sizes and owned allocations; Java unsigned results are displayed unsigned; Go nil slices normalize to empty arrays.
- `dist/pattern-games.mjs` and `dist/pattern-game-ui.mjs`: Word Search backtracking, unique-character sliding windows, House Robber prefix decisions, Jump Game reachability, and min/max products.
- `dist/strategy-games.mjs` and `dist/strategy-game-ui.mjs`: Course Schedule prerequisite graphs, Non-overlapping Intervals timelines, rotated-array binary search, Coin Change DP tables, and Number of 1 Bits operations. All five have two rounds, tutorials, and seven-language coding exercises.
- `dist/advanced-games.mjs` and `dist/advanced-game-ui.mjs`: two-pointer water diagrams, LIS predecessor links, BFS queues on island grids, and sliding-window frequency visualizations.
- `dist/tutorials.mjs`: algorithm tutorial mappings for all 75 unique problems. Every lesson includes a tutorial panel in both game and code views.
- `dist/structure-catalog.mjs` and `dist/structure-traces.mjs`: the final 25 games, two rounds each, and immutable node/algorithm snapshots.
- `dist/structure-runtime.mjs`, `dist/structure-types.mjs`, `dist/structure-native.mjs`, and `dist/structure-languages.mjs`: actual node builders, seven-language interfaces, stateful operation drivers, and bounded result serializers.
- `dist/structure-validation.mjs`: typed validation for tree shape, graph topology, unordered anagram groups, arbitrary valid alien alphabets, and operation results.
- `dist/javascript-runner.mjs`: shared JavaScript execution logic used by the disposable worker and unit tests.
- `dist/coding-state.mjs`: migration of existing JavaScript progress, independent per-language drafts, and passed-language tracking.
- `dist/execution.mjs`: local and remote execution, cancellation, and response limits.
- `dist/runner.mjs`: disposable Web Worker for local JavaScript execution, with a two-second timeout controlled by the page.
- `src/editor.mjs`: CodeMirror editor with VS Code-inspired dark syntax colors, JetBrains Mono, line numbers, bracket matching, indentation, undo/redo, and find/replace. The selected language controls its parser (C and C++ share the C-family parser).
- `dist/vendor/editor.mjs`: committed, self-hosted editor bundle; no runtime CDN required. Rebuild after editing `src/editor.mjs` with `npm ci` followed by `npm run build:editor`. The build also collects third-party license notices into `dist/vendor/editor.LICENSE.txt`.

The editor saves every change to the existing per-language draft. Ctrl/Cmd+Enter runs tests; Tab indents; Escape followed by Tab moves keyboard focus out of the editor. During a run, the editor is read-only. Language switches and navigation destroy the old editor instance and cancel the active run.

The catalog has 75 unique playable problems and no planned placeholders. Difficulty badges distinguish Easy, Medium, and Hard. Tutorial links point to USACO Guide, CP-Algorithms, VisuAlgo, and NeetCode; they are external references, not embedded or copied course content. Links were reviewed in October 2026.

Progress and code drafts use localStorage on the current browser. Each problem/language pair has its own draft and passed state. Existing JavaScript drafts and completions are migrated; an empty draft is preserved. Language preference persists across reloads. XP is awarded once per problem, regardless of how many languages pass. This prototype has no accounts or cross-device sync.

## Code execution

JavaScript runs in a disposable browser worker with a two-second limit. C, C++, and Java compile and run through the public [Wandbox API](https://wandbox.org). Rust uses the official [Rust Playground](https://play.rust-lang.org). Go and Python use [Compiler Explorer](https://godbolt.org). All three support browser submissions without an API key or backend. The UI explains that pressing Run tests sends source and test inputs to the selected provider. Requests omit credentials, suppress the referrer, and use `save: false` for Wandbox (no permalink requested); Rust uses only its execution endpoint, and Compiler Explorer requests set `allowStoreCodeDebug: false`. No sharing endpoints are called. The provider still receives the code; no claim of zero retention is made. Never submit secrets.

All tests for one exercise share one compilation. Compiler versions are pinned in `languages.mjs`: C11/C++17 on GCC 13.2, OpenJDK 21, Go 1.23, and Python 3.12. Rust uses the Playground’s stable compiler with the 2021 edition. Go and C/Rust need the declarations included in their starter; Java/C++/Python generally use a `Solution` class; the structure design exercises use their named classes and operations. The generated harness owns main/entry-point functions. C Two Sum answers must be malloc-allocated with `*returnSize` set; the harness frees them.

The UI stops waiting after 45 seconds, supports cancellation, and ignores stale responses after navigation or language changes. Cancelling a browser request does not guarantee cancellation on the compiler provider. Network, rate-limit, compiler, and runtime failures leave drafts intact. Remote response size is limited to 200 KB; program output is limited to 64 KB. Compiler diagnostics are displayed as text. A malformed, missing, or duplicate test result cannot award completion.

Remote execution depends on the providers’ availability. Wandbox has IP-based limits and no uptime guarantee ([maintainer FAQ](https://github.com/melpon/wandbox#faq)). Production growth should use a managed or self-hosted execution service with authentication, quotas, and appropriate isolation. Compiler availability can change; verify replacements against `https://wandbox.org/api/list.json` or `https://godbolt.org/api/compilers/<language>?fields=id,name,supportsExecute`, as applicable. No automatic submissions or background retries are made.

Practice tests check outputs, not algorithmic complexity. Results and XP are browser-local practice feedback, not an authoritative judge. The JavaScript worker isolates execution from the UI thread; it is not a hardened multi-user execution sandbox. Browser fonts are requested from Google Fonts, with local fallbacks.

Problem taxonomy reference: https://leetcode.com/discuss/post/460599/blind-75-leetcode-questions-by-krishnade-9xev/

This is an independent educational project, not affiliated with LeetCode.

## Structure exercise interfaces

Examples are JSON-friendly display formats, not the function arguments after adaptation. List arrays become actual `ListNode` chains. Tree arrays use breadth-first/level-order null gaps and become `TreeNode` references. Graph rows become neighbors on distinct `Node` objects. The runner provides node definitions; do not repeat them in submitted code. Rust uses `Option<Rc<RefCell<...>>>` aliases (`ListLink`, `TreeLink`, `GraphLink`) so cycles and reference identity are representable; these list signatures differ from LeetCode’s owned `Box` versions. Go node fields use `Val`, `Next`, `Left`, `Right`, and `Neighbors`.

For #141, `pos` is a zero-based tail connection index used only by the harness, never a solution argument. #143 must rewire original nodes and preserve their values. #235 receives existing target references and must return an existing node. #133 rejects any cloned node that aliases an input node and verifies the resulting topology. Node serializers reject cycles where an acyclic list or tree is required.

The design exercises use `Trie`, `WordDictionary`, and `MedianFinder` instances, with state retained across each test’s operation sequence and reset for the next test. Go constructors are `NewTrie`, `NewWordDictionary`, and `NewMedianFinder`; method names are exported. C uses the supplied constructor and object-pointer function interfaces. Void operations display null.

#271 uses `StringCodec.encode/decode`; #297 uses `TreeCodec.serialize/deserialize`. Separate fresh instances encode and decode. C uses paired stateless functions with the corresponding prefixes. Any self-contained string format is accepted, including escaped or length-prefixed formats. Empty strings, delimiters, newlines, and Unicode are tested. Use matching length units for encoding and decoding. Tree results preserve null positions and trim only trailing nulls.

These are bounded educational practice fixtures, not exhaustive complexity or security checks. They accept alternate valid output order where appropriate and preserve multiplicity for anagrams. The C structure harness keeps node allocations alive for the short-lived test program; returned nodes must not point to stack storage. All language-specific interface differences are shown with the starter and contract.
