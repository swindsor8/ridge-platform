# RIDGE Development Rules

Claude must follow these development rules when generating code.

## Commit Discipline

Never create large commits.

Commits should represent small logical steps.

Example:

- initialize backend auth module
- add stand location schema
- add map service endpoints

## File Size

Avoid creating files larger than ~500 lines unless necessary.

Large systems should be broken into modules.

## Feature Development

Build features incrementally.

Example workflow:

1. database schema
2. backend service
3. API endpoints
4. mobile UI
5. integration tests

## Code Style

Use TypeScript for all backend and mobile code.

Follow strict typing rules.

## Architecture

Follow the architecture defined in:

/docs/RIDGE_TECH_ARCHITECTURE.md
