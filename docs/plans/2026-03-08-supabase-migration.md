# Supabase Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace Docker PostgreSQL+PostGIS with Supabase, wiring up Supabase Auth on mobile and a SupabaseModule (service-role key) in NestJS.

**Architecture:** Mobile uses Supabase JS SDK (anon key) for auth and session management; NestJS uses Supabase JS SDK (service-role key) via a SupabaseModule for all DB operations; a SupabaseAuthGuard validates Bearer tokens on protected endpoints.

**Tech Stack:** `@supabase/supabase-js`, `@react-native-async-storage/async-storage`, Supabase hosted Postgres+PostGIS, Redis (unchanged), NestJS, Expo Router v4.

**Supabase project ref:** `zblklorjtydmtxmgmyra`

---

## Task 1: Create supabase directory and migration files

**Files:**
- Create: `supabase/config.toml`
- Create: `supabase/migrations/20260308000001_enable_postgis.sql`
- Create: `supabase/migrations/20260308000002_create_tables.sql`

**Step 1: Create supabase/config.toml**

```toml
project_id = "zblklorjtydmtxmgmyra"
```

**Step 2: Create the PostGIS migration**

```sql
-- supabase/migrations/20260308000001_enable_postgis.sql
create extension if not exists postgis;
```

**Step 3: Create the tables migration**

```sql
-- supabase/migrations/20260308000002_create_tables.sql

create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null unique,
  username text not null unique,
  display_name text not null,
  state text not null,
  created_at timestamptz default now() not null
);

create table public.hunts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  start_time timestamptz,
  end_time timestamptz,
  weapon_type text,
  notes text,
  created_at timestamptz default now() not null
);

create table public.stand_locations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  geom geometry(Point, 4326),
  notes text,
  created_at timestamptz default now() not null
);

create table public.trail_cameras (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  geom geometry(Point, 4326),
  created_at timestamptz default now() not null
);

create table public.posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  caption text,
  created_at timestamptz default now() not null
);

create table public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  body text not null,
  created_at timestamptz default now() not null
);

create table public.harvests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  species text not null,
  score_estimate numeric,
  harvest_date date,
  created_at timestamptz default now() not null
);

create table public.trophy_entries (
  id uuid default gen_random_uuid() primary key,
  harvest_id uuid references public.harvests(id) on delete cascade not null,
  category text,
  season_year integer,
  ranking_score numeric,
  created_at timestamptz default now() not null
);
```

**Step 4: Apply migrations via Supabase dashboard**

Go to your Supabase project → SQL Editor → run `20260308000001_enable_postgis.sql` first, then `20260308000002_create_tables.sql`.

Verify in Table Editor that all 8 tables appear.

**Step 5: Commit**

```bash
git add supabase/
git commit -m "feat: add supabase migrations for postgis and schema tables"
```

---

## Task 2: Update Docker Compose — remove postgres, keep Redis

**Files:**
- Modify: `infra/docker/docker-compose.dev.yml`

**Step 1: Replace the file contents**

```yaml
version: '3.9'

services:
  redis:
    image: redis:7.2-alpine
    container_name: ridge_redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

**Step 2: Verify**

```bash
docker compose -f infra/docker/docker-compose.dev.yml config
```

Expected: no errors, only redis service listed.

**Step 3: Commit**

```bash
git add infra/docker/docker-compose.dev.yml
git commit -m "chore: remove postgres from docker-compose, keep redis"
```

---

## Task 3: Add Supabase package and remove unused packages from backend-api

**Files:**
- Modify: `apps/backend-api/package.json`

**Step 1: Add @supabase/supabase-js**

```bash
pnpm --filter @ridge/backend-api add @supabase/supabase-js
```

**Step 2: Remove packages no longer needed**

```bash
pnpm --filter @ridge/backend-api remove @nestjs/jwt @nestjs/passport @nestjs/typeorm passport passport-jwt typeorm pg bcryptjs
pnpm --filter @ridge/backend-api remove --save-dev @types/bcryptjs @types/passport-jwt
```

**Step 3: Verify type-check still passes**

```bash
pnpm --filter @ridge/backend-api type-check
```

Expected: no errors (all removed packages were unused stubs).

**Step 4: Commit**

```bash
git add apps/backend-api/package.json pnpm-lock.yaml
git commit -m "chore(backend): add @supabase/supabase-js, remove unused orm/auth packages"
```

---

## Task 4: Create backend .env files

**Files:**
- Create: `apps/backend-api/.env`
- Create: `apps/backend-api/.env.example`
- Modify: `.gitignore` (root)

**Step 1: Create .env.example (committed to git)**

```bash
# apps/backend-api/.env.example
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Step 2: Create .env (NOT committed — fill in real values)**

Get your values from Supabase Dashboard → Project Settings → API:
- `SUPABASE_URL`: Project URL
- `SUPABASE_SERVICE_ROLE_KEY`: service_role key (keep secret — never expose to client)

```bash
# apps/backend-api/.env
SUPABASE_URL=https://zblklorjtydmtxmgmyra.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<paste from Supabase dashboard>
```

**Step 3: Ensure .env is gitignored**

Check root `.gitignore` — it should already contain `.env`. If not, add:

```
.env
*.local
```

**Step 4: Commit the example file**

```bash
git add apps/backend-api/.env.example .gitignore
git commit -m "chore(backend): add .env.example for supabase config"
```

---

## Task 5: Create SupabaseService

**Files:**
- Create: `apps/backend-api/src/modules/supabase/supabase.service.ts`
- Create: `apps/backend-api/src/modules/supabase/supabase.service.spec.ts`

**Step 1: Write the failing test**

```typescript
// apps/backend-api/src/modules/supabase/supabase.service.spec.ts
import { Test } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase.service';

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(async () => {
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';

    const module = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [SupabaseService],
    }).compile();

    service = module.get(SupabaseService);
  });

  it('should expose a db client', () => {
    expect(service.db).toBeDefined();
  });

  it('db client should have a from() method', () => {
    expect(typeof service.db.from).toBe('function');
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd apps/backend-api && npx jest supabase.service.spec.ts --no-coverage 2>&1 | head -20
```

Expected: FAIL — `Cannot find module './supabase.service'`

**Step 3: Write the implementation**

```typescript
// apps/backend-api/src/modules/supabase/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly client: SupabaseClient;

  constructor(private config: ConfigService) {
    this.client = createClient(
      config.getOrThrow<string>('SUPABASE_URL'),
      config.getOrThrow<string>('SUPABASE_SERVICE_ROLE_KEY'),
    );
  }

  get db(): SupabaseClient {
    return this.client;
  }
}
```

**Step 4: Run test to verify it passes**

```bash
cd apps/backend-api && npx jest supabase.service.spec.ts --no-coverage
```

Expected: PASS

**Step 5: Commit**

```bash
git add apps/backend-api/src/modules/supabase/
git commit -m "feat(backend): add SupabaseService"
```

---

## Task 6: Create SupabaseAuthGuard and CurrentUser decorator

**Files:**
- Create: `apps/backend-api/src/modules/supabase/supabase-auth.guard.ts`
- Create: `apps/backend-api/src/modules/supabase/current-user.decorator.ts`
- Create: `apps/backend-api/src/modules/supabase/supabase-auth.guard.spec.ts`

**Step 1: Write the failing test**

```typescript
// apps/backend-api/src/modules/supabase/supabase-auth.guard.spec.ts
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { SupabaseAuthGuard } from './supabase-auth.guard';

const mockRequest = (authHeader?: string) => ({
  headers: { authorization: authHeader },
});

const mockContext = (req: object): ExecutionContext =>
  ({
    switchToHttp: () => ({ getRequest: () => req }),
  }) as unknown as ExecutionContext;

describe('SupabaseAuthGuard', () => {
  let guard: SupabaseAuthGuard;
  let mockSupabaseService: { db: { auth: { getUser: jest.Mock } } };

  beforeEach(() => {
    mockSupabaseService = {
      db: { auth: { getUser: jest.fn() } },
    };
    guard = new SupabaseAuthGuard(mockSupabaseService as never);
  });

  it('throws UnauthorizedException when no authorization header', async () => {
    const ctx = mockContext(mockRequest());
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it('throws UnauthorizedException when token is invalid', async () => {
    mockSupabaseService.db.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('invalid'),
    });
    const ctx = mockContext(mockRequest('Bearer bad-token'));
    await expect(guard.canActivate(ctx)).rejects.toThrow(UnauthorizedException);
  });

  it('attaches user to request and returns true for valid token', async () => {
    const fakeUser = { id: 'user-123', email: 'test@test.com' };
    mockSupabaseService.db.auth.getUser.mockResolvedValue({
      data: { user: fakeUser },
      error: null,
    });
    const req = mockRequest('Bearer valid-token');
    const ctx = mockContext(req);
    const result = await guard.canActivate(ctx);
    expect(result).toBe(true);
    expect((req as never as { user: unknown }).user).toEqual(fakeUser);
  });
});
```

**Step 2: Run test to verify it fails**

```bash
cd apps/backend-api && npx jest supabase-auth.guard.spec.ts --no-coverage 2>&1 | head -20
```

Expected: FAIL — `Cannot find module './supabase-auth.guard'`

**Step 3: Write the guard**

```typescript
// apps/backend-api/src/modules/supabase/supabase-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private supabase: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user: unknown;
    }>();

    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authorization token');
    }

    const token = authHeader.slice(7);
    const {
      data: { user },
      error,
    } = await this.supabase.db.auth.getUser(token);

    if (error || !user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    request.user = user;
    return true;
  }
}
```

**Step 4: Write the CurrentUser decorator**

```typescript
// apps/backend-api/src/modules/supabase/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from '@supabase/supabase-js';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<{ user: User }>();
    return request.user;
  },
);
```

**Step 5: Run test to verify it passes**

```bash
cd apps/backend-api && npx jest supabase-auth.guard.spec.ts --no-coverage
```

Expected: PASS (3 tests)

**Step 6: Commit**

```bash
git add apps/backend-api/src/modules/supabase/
git commit -m "feat(backend): add SupabaseAuthGuard and CurrentUser decorator"
```

---

## Task 7: Create SupabaseModule and wire into AppModule

**Files:**
- Create: `apps/backend-api/src/modules/supabase/supabase.module.ts`
- Modify: `apps/backend-api/src/app.module.ts`

**Step 1: Create SupabaseModule**

```typescript
// apps/backend-api/src/modules/supabase/supabase.module.ts
import { Global, Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SupabaseAuthGuard } from './supabase-auth.guard';

@Global()
@Module({
  providers: [SupabaseService, SupabaseAuthGuard],
  exports: [SupabaseService, SupabaseAuthGuard],
})
export class SupabaseModule {}
```

**Step 2: Update AppModule to import SupabaseModule**

Replace the contents of `apps/backend-api/src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HuntsModule } from './modules/hunts/hunts.module';
import { MapModule } from './modules/map/map.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SupabaseModule,
    AuthModule,
    UsersModule,
    HuntsModule,
    MapModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

**Step 3: Verify type-check**

```bash
pnpm --filter @ridge/backend-api type-check
```

Expected: no errors

**Step 4: Commit**

```bash
git add apps/backend-api/src/modules/supabase/supabase.module.ts apps/backend-api/src/app.module.ts
git commit -m "feat(backend): create SupabaseModule and register globally in AppModule"
```

---

## Task 8: Implement AuthModule — register and profile endpoints

**Files:**
- Modify: `apps/backend-api/src/modules/auth/auth.module.ts`
- Create: `apps/backend-api/src/modules/auth/auth.controller.ts`
- Create: `apps/backend-api/src/modules/auth/auth.service.ts`
- Create: `apps/backend-api/src/modules/auth/dto/register.dto.ts`

**Step 1: Create the register DTO**

```typescript
// apps/backend-api/src/modules/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  @MaxLength(30)
  username: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  displayName: string;

  @IsString()
  state: string;
}
```

**Step 2: Create AuthService**

```typescript
// apps/backend-api/src/modules/auth/auth.service.ts
import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private supabase: SupabaseService) {}

  async register(dto: RegisterDto): Promise<{ id: string; email: string }> {
    // 1. Create auth user via admin API (service role key required)
    const { data: authData, error: authError } =
      await this.supabase.db.auth.admin.createUser({
        email: dto.email,
        password: dto.password,
        email_confirm: true,
      });

    if (authError) {
      if (authError.message.includes('already registered')) {
        throw new ConflictException('Email already in use');
      }
      throw new InternalServerErrorException(authError.message);
    }

    const userId = authData.user.id;

    // 2. Insert public profile row
    const { error: profileError } = await this.supabase.db
      .from('users')
      .insert({
        id: userId,
        email: dto.email,
        username: dto.username,
        display_name: dto.displayName,
        state: dto.state,
      });

    if (profileError) {
      // Roll back: delete auth user
      await this.supabase.db.auth.admin.deleteUser(userId);
      if (profileError.message.includes('unique')) {
        throw new ConflictException('Username already taken');
      }
      throw new InternalServerErrorException(profileError.message);
    }

    return { id: userId, email: dto.email };
  }

  async getProfile(userId: string) {
    const { data, error } = await this.supabase.db
      .from('users')
      .select('id, email, username, display_name, state, created_at')
      .eq('id', userId)
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}
```

**Step 3: Create AuthController**

```typescript
// apps/backend-api/src/modules/auth/auth.controller.ts
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { SupabaseAuthGuard } from '../supabase/supabase-auth.guard';
import { CurrentUser } from '../supabase/current-user.decorator';
import type { User } from '@supabase/supabase-js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Get('profile')
  @UseGuards(SupabaseAuthGuard)
  getProfile(@CurrentUser() user: User) {
    return this.authService.getProfile(user.id);
  }
}
```

**Step 4: Update AuthModule**

```typescript
// apps/backend-api/src/modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
```

**Step 5: Verify type-check**

```bash
pnpm --filter @ridge/backend-api type-check
```

Expected: no errors

**Step 6: Commit**

```bash
git add apps/backend-api/src/modules/auth/
git commit -m "feat(backend): implement auth register and profile endpoints via Supabase"
```

---

## Task 9: Add Supabase packages to mobile-app

**Files:**
- Modify: `apps/mobile-app/package.json`
- Create: `apps/mobile-app/.env`
- Create: `apps/mobile-app/.env.example`

**Step 1: Install packages**

```bash
pnpm --filter @ridge/mobile-app add @supabase/supabase-js @react-native-async-storage/async-storage
```

**Step 2: Create .env.example**

```bash
# apps/mobile-app/.env.example
EXPO_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

**Step 3: Create .env (fill in real values)**

Get values from Supabase Dashboard → Project Settings → API:
- `EXPO_PUBLIC_SUPABASE_URL`: Project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`: anon/public key (safe to expose to client)
- `EXPO_PUBLIC_API_URL`: your NestJS backend URL

```bash
# apps/mobile-app/.env
EXPO_PUBLIC_SUPABASE_URL=https://zblklorjtydmtxmgmyra.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<paste anon key from Supabase dashboard>
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

**Step 4: Commit the example file**

```bash
git add apps/mobile-app/.env.example apps/mobile-app/package.json pnpm-lock.yaml
git commit -m "chore(mobile): add @supabase/supabase-js and async-storage packages"
```

---

## Task 10: Create mobile lib/supabase.ts

**Files:**
- Create: `apps/mobile-app/lib/supabase.ts`

**Step 1: Create the Supabase client**

```typescript
// apps/mobile-app/lib/supabase.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

**Step 2: Verify type-check**

```bash
pnpm --filter @ridge/mobile-app type-check
```

Expected: no errors

**Step 3: Commit**

```bash
git add apps/mobile-app/lib/supabase.ts
git commit -m "feat(mobile): add Supabase client with AsyncStorage session persistence"
```

---

## Task 11: Create mobile lib/api.ts

**Files:**
- Create: `apps/mobile-app/lib/api.ts`

**Step 1: Create the API wrapper**

```typescript
// apps/mobile-app/lib/api.ts
import { supabase } from './supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API ${response.status}: ${body}`);
  }

  return response.json() as Promise<T>;
}
```

**Step 2: Verify type-check**

```bash
pnpm --filter @ridge/mobile-app type-check
```

Expected: no errors

**Step 3: Commit**

```bash
git add apps/mobile-app/lib/api.ts
git commit -m "feat(mobile): add API client wrapper with Supabase auth token injection"
```

---

## Task 12: Create AuthContext

**Files:**
- Create: `apps/mobile-app/context/AuthContext.tsx`

**Step 1: Create the context**

```tsx
// apps/mobile-app/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{ session, user: session?.user ?? null, loading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
```

**Step 2: Verify type-check**

```bash
pnpm --filter @ridge/mobile-app type-check
```

Expected: no errors

**Step 3: Commit**

```bash
git add apps/mobile-app/context/AuthContext.tsx
git commit -m "feat(mobile): add AuthContext with Supabase session management"
```

---

## Task 13: Update root _layout.tsx to use AuthContext and protect routes

**Files:**
- Modify: `apps/mobile-app/app/_layout.tsx`
- Create: `apps/mobile-app/app/(auth)/_layout.tsx`
- Create: `apps/mobile-app/app/(auth)/login.tsx`
- Create: `apps/mobile-app/app/(auth)/register.tsx`

**Step 1: Update root _layout.tsx**

Replace `apps/mobile-app/app/_layout.tsx` contents:

```tsx
import { useEffect } from 'react';
import { Stack, router, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider, useAuth } from '../context/AuthContext';

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { session, loading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      router.replace('/(tabs)/map');
    }
  }, [session, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'BebasNeue-Regular': require('../assets/fonts/BebasNeue-Regular.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('../assets/fonts/Inter-Medium.ttf'),
    'Inter-SemiBold': require('../assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Bold': require('../assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  );
}
```

**Step 2: Create (auth) layout**

```tsx
// apps/mobile-app/app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
```

**Step 3: Create login screen (stub)**

```tsx
// apps/mobile-app/app/(auth)/login.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RIDGE</Text>
      <Text style={styles.subtitle}>Login — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 64,
    color: Colors.burntOrange,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.boneTan,
    marginTop: 8,
  },
});
```

**Step 4: Create register screen (stub)**

```tsx
// apps/mobile-app/app/(auth)/register.tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/theme';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>RIDGE</Text>
      <Text style={styles.subtitle}>Register — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.charcoal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 64,
    color: Colors.burntOrange,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.boneTan,
    marginTop: 8,
  },
});
```

**Step 5: Verify type-check**

```bash
pnpm --filter @ridge/mobile-app type-check
```

Expected: no errors

**Step 6: Commit**

```bash
git add apps/mobile-app/app/
git commit -m "feat(mobile): add auth route group, protect tabs with Supabase session"
```

---

## Task 14: Update shared-types for Supabase alignment

**Files:**
- Modify: `packages/shared-types/src/user.types.ts`

**Step 1: Update user types to match DB schema**

The `AuthTokens` type is no longer needed (Supabase handles tokens). Keep `User`, `LoginCredentials`, `RegisterInput` but align with DB column names:

```typescript
// packages/shared-types/src/user.types.ts
export interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  state: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  displayName: string;
  state: string;
}
```

**Step 2: Build shared-types and run root type-check**

```bash
pnpm --filter @ridge/shared-types build
pnpm type-check
```

Expected: no errors across all packages

**Step 3: Commit**

```bash
git add packages/shared-types/src/user.types.ts
git commit -m "chore(shared-types): align User type with Supabase DB schema"
```

---

## Task 15: Final verification

**Step 1: Full monorepo type-check**

```bash
pnpm type-check
```

Expected: passes with no errors

**Step 2: Start Redis and backend dev server**

```bash
docker compose -f infra/docker/docker-compose.dev.yml up -d
pnpm --filter @ridge/backend-api dev
```

Expected: NestJS starts on port 3000, Swagger at http://localhost:3000/api/docs

**Step 3: Smoke test register endpoint**

```bash
curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@ridge.app","username":"testuser","password":"password123","displayName":"Test User","state":"TX"}' \
  | jq .
```

Expected: `{"id": "<uuid>", "email": "test@ridge.app"}`

Verify the user appears in Supabase Dashboard → Authentication → Users.

**Step 4: Update MEMORY.md to reflect completed Supabase migration**

Update `/home/seth/.claude/projects/-home-seth-Projects-ridge-platform/memory/MEMORY.md`:
- Change Docker Compose note to "Redis only"
- Note Supabase project ref and that DB is now hosted on Supabase
- Remove `@nestjs/jwt`, `typeorm`, `pg` from backend notes

**Step 5: Final commit**

```bash
git add .
git commit -m "chore: supabase migration complete — all packages verified"
```
