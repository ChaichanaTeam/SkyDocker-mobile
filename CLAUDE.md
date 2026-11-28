@AGENTS.md

## Graphify

Graph-based code navigation. The skill is in `.claude/skills/graphify/` (Codex variant); the commands below take priority over its examples.

- Before broad code exploration, run `npm run graph:query -- "<question or symbols>"`. For focused relationships use `npm run graph:explain -- "<symbol>"` and `npm run graph:path -- "<A>" "<B>"`.
- After every code change or addition, run `npm run graph:update`.
- If the graph is missing, run `npm run graph:build`. Output is in `graphify-out/`.
- Verify results against the source files. The AST graph cannot see string-based Expo Router routes or HTTP calls to the backend.
- First-time setup: `uv venv --python 3.12 .graphify-venv`, then `uv pip install --python .graphify-venv -r requirements-graphify.txt`.
