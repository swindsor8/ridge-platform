# RIDGE GitHub Starter Repo Blueprint

This document defines the recommended initial GitHub repository structure for the RIDGE platform.

The goal is to start with a clean, scalable monorepo that supports:

- mobile app development
- backend API development
- AI services
- shared packages
- infrastructure
- project documentation

RIDGE should be built as a **production-oriented monorepo** from day one.

---

# 1. Repository Name

Recommended repository name:

ridge-platform

Alternative names:

- ridge-hunt
- ridge-app
- ridge-monorepo

Preferred:

ridge-platform

---

# 2. Repository Purpose

This repository contains all core RIDGE systems:

- mobile app
- backend API
- AI services
- shared packages
- infrastructure configuration
- product documentation

This repo is the source of truth for engineering implementation.

---

# 3. Monorepo Structure

Recommended structure:

```text
ridge-platform/
  apps/
    mobile-app/
    backend-api/

  services/
    ai-movement-service/
    ai-trailcam-service/
    ai-terrain-service/
    ai-habitat-service/

  packages/
    shared-types/
    ui-components/
    config/
    eslint-config/
    tsconfig/

  docs/
    RIDGE_RDP_MASTER.md
    RIDGE_BRAND_SYSTEM.md
    RIDGE_DESIGN_SYSTEM.md
    RIDGE_TECH_ARCHITECTURE.md
    RIDGE_DATABASE_SCHEMA.md
    RIDGE_API_SPEC.md
    RIDGE_MVP_BUILD_PLAN.md
    RIDGE_PRODUCT_FEATURES.md
    RIDGE_COMMUNITY_SYSTEM.md
    RIDGE_SURVIVAL_SYSTEM.md
    RIDGE_SECURITY_ARCHITECTURE.md
    RIDGE_DATA_PRIVACY.md
    RIDGE_MODERATION_POLICY.md
    RIDGE_AI_SERVICES_ARCHITECTURE.md

  infra/
    terraform/
    docker/
    scripts/

  .github/
    workflows/

  .vscode/

  CLAUDE.md
  README.md
  package.json
  pnpm-workspace.yaml
  turbo.json
  .gitignore
  .env.example
