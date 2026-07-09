---
description: Stage all unstaged/untracked changes and commit. Usage: /commit <message>
---

## Workflow

1. Run `git status` to check current state
2. Stage all changes: `git add -A`
3. Run `pnpm lint` and fix any errors it reports
4. Review `git diff --cached` to understand the changes
5. Group changes by logical feature/fix
6. Generate one conventional commit per group following AGENTS.md format
7. Execute each `git commit` with the generated message
8. No force-push, amend, or interactive mode