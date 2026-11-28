# Vendored skill provenance

- Upstream: https://github.com/Graphify-Labs/graphify
- Official distribution: `graphifyy==0.9.96` (installed in the ignored project-local `.graphify-venv`).
- `SKILL.md` is the upstream `graphify/skill-codex.md` supplied by that package; `references/` and `.graphify_version` were copied by its project-scoped installer.
- Installed with `graphify install --project --platform codex`, then copied to `.claude/skills/graphify` so Claude Code can discover it. The installer's no-op `.codex/hooks.json` was removed; no hooks are required.
- Skill/reference contents are unchanged. `SKILL.md` is the Codex variant; root `CLAUDE.md` commands (`node scripts/graphify.mjs`, output `graphify-out/`) take priority over its generic examples.
- Upstream license notices are retained in `LICENSE`, `LICENSE-MIT` and `NOTICE`.
- To upgrade, install the chosen distribution in the local environment, review and replace its skill/reference files, update `requirements-graphify.txt`, rebuild the graph and recheck query/path commands. Do not run a user-global installer.
