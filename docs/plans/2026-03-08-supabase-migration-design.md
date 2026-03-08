# Supabase Migration Design

**Date:** 2026-03-08
**Status:** Approved

## Overview

Replace the Docker Compose PostgreSQL+PostGIS setup with Supabase (hosted Postgres, Auth, Storage, Realtime). The mobile app uses Supabase JS SDK directly for auth and realtime; NestJS handles all data API endpoints using the Supabase JS SDK with a service-role key.

## Architecture

```
Mobile App
  ├── Supabase JS SDK (anon key)
  │     ├── supabase.auth.signIn/signUp/signOut
  │     ├── supabase.auth.onAuthStateChange (session management)
  │     └── supabase.channel() (realtime — Phase 3+)
  │
  └── NestJS API (Bearer token from Supabase session)
        ├── SupabaseAuthGuard verifies JWT → injects req.user
        └── All data endpoints (stands, hunts, map, etc.)

NestJS Backend
  └── SupabaseModule
        └── SupabaseService (service role key)
              └── supabase.from('table').select/insert/update/delete

Supabase Project (ref: zblklorjtydmtxmgmyra)
  ├── Auth (email/password, Apple, Google OAuth)
  ├── Postgres + PostGIS (all tables from schema doc)
  └── Storage (trail cam photos, harvest images — Phase 2+)

Docker Compose (simplified)
  └── Redis only
```

## Auth Flow

1. Mobile calls `supabase.auth.signInWithPassword()` → receives `access_token`
2. Mobile sends `Authorization: Bearer <access_token>` on all NestJS API calls
3. `SupabaseAuthGuard` calls `supabase.auth.getUser(token)` → validates + extracts `user.id`
4. NestJS services use service-role key to query DB (bypasses RLS, enforces auth via guards)

## NestJS Changes

### New SupabaseModule (`apps/backend-api/src/modules/supabase/`)
- `SupabaseService` — singleton wrapping `createClient(url, serviceRoleKey)`
- `SupabaseAuthGuard` — validates Bearer token, attaches user to `req.user`
- `@CurrentUser()` param decorator — extracts `req.user` in controllers

### Updated Modules
- `app.module.ts` imports `SupabaseModule` globally
- `AuthModule` — no longer issues JWTs; register endpoint creates Supabase user via service-role client; login/logout handled by mobile ↔ Supabase directly
- `UsersModule`, `HuntsModule`, `MapModule` — inject `SupabaseService` for all DB operations

### Environment
```
SUPABASE_URL=https://zblklorjtydmtxmgmyra.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<secret>
```

## Mobile App Changes

### New Files
- `lib/supabase.ts` — Supabase client initialized with anon key + AsyncStorage session persistence
- `lib/api.ts` — fetch/axios wrapper that auto-attaches `Authorization: Bearer <token>` to NestJS API calls
- Auth context — wraps `supabase.auth.onAuthStateChange()`, drives protected route navigation

### New Packages
- `@supabase/supabase-js`
- `@react-native-async-storage/async-storage`

### Environment
```
EXPO_PUBLIC_SUPABASE_URL=https://zblklorjtydmtxmgmyra.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key>
```

## Database & Infrastructure

### Supabase Setup
- Enable PostGIS: `create extension if not exists postgis;`
- Tables from schema doc with `geom` columns using `geometry(Point, 4326)`
- Migrations stored in `supabase/migrations/`

### Monorepo Structure Addition
```
supabase/
  migrations/
    20260308000001_enable_postgis.sql
    20260308000002_create_tables.sql
  config.toml
```

### Docker Compose
- Remove `postgres` service and `postgres_data` volume
- Keep Redis unchanged

### Shared Types
- `packages/shared-types` updated with Supabase-aligned TypeScript types matching DB schema

### Environment Files
- `.env` files for both apps added to `.gitignore`
- `.env.example` files committed to repo
