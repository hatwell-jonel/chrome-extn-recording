---
name: commit-changes
description: Use when the user asks to commit, stage, or create a commit. Also use when asked to analyze or generate a commit message. Do NOT use for general git operations like push, pull, branch, or rebase.
---

# commit-changes

Stage changes and commit with a conventional commit message.

## Commit Message Format

```
<type>(<scope>): <short summary>
```

**Examples:**
- `feat(auth): add login validation for JWT tokens`
- `fix(ui): correct button alignment in navbar`
- `refactor(api): simplify user service logic`

## Types

| Type       | Description |
|------------|-------------|
| feat       | New feature or functionality |
| fix        | Bug fix |
| refactor   | Code changes that do not add features or fix bugs |
| perf       | Performance improvements |
| style      | Code style changes (formatting, whitespace, etc.) |
| test       | Adding or updating tests |
| docs       | Documentation changes |
| build      | Build system or dependency changes |
| ci         | CI/CD pipeline changes |
| chore      | Maintenance tasks |

## Guidelines

- Use imperative tone ("add", not "added")
- Keep subject line under 72 characters
- Each commit represents one logical change
- Avoid mixing unrelated changes in one commit
- For complex commits, include a body after a blank line
- Always review `git diff` before committing

## Workflow

1. Run `git status` and `git diff` to review staged and unstaged changes
2. Group changes by logical feature/fix
3. Determine appropriate type and optional scope
4. For each logical group, create one commit
5. Prefer multiple small commits over one large commit