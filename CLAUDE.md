# RIDGE Platform — Claude Code Instructions

## Project Overview
RIDGE is a hunting intelligence platform. Monorepo using pnpm + Turborepo.

## Stack
- Mobile: React Native + Expo Router v4 (`apps/mobile-app`)
- Backend: NestJS + TypeScript (`apps/backend-api`)
- AI Services: Python + FastAPI (`services/`)
- DB: PostgreSQL + PostGIS
- Cache: Redis
- Infra: Docker Compose (local), AWS (production)

## Commands
- `pnpm dev` — start all apps in dev mode
- `pnpm build` — build all apps
- `pnpm lint` — lint all packages
- `pnpm type-check` — typecheck all packages

## Brand (LOCKED)
- Colors: Forest Green #1E3A2F, Burnt Orange #C56A2D, Bone Tan #E8E1D3, Charcoal #2A2A2A, Olive #4A5C45
- Fonts: Bebas Neue (headlines), Inter (body)
- Never modify brand, logo, or design system without owner approval.

## Architecture Rules
- AI features run as separate Python/FastAPI services, never embedded in mobile app
- Mobile app must support offline-first operation
- All geospatial data uses PostGIS geometry types
- Shared types live in `packages/shared-types`

## Phase 1 MVP (build this first)
Authentication, map screen, stand markers, hunt dashboard, wind analysis
