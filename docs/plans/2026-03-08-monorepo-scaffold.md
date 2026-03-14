# RIDGE Monorepo Scaffold Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Scaffold the full ridge-platform monorepo with root config, shared packages, NestJS backend shell, Expo Router mobile shell, AI service placeholders, and local dev infrastructure.

**Architecture:** pnpm workspaces + Turborepo monorepo with `apps/`, `services/`, `packages/`, and `infra/` directories. Shared TypeScript configs and types live in `packages/` and are consumed by both apps. Each app/service is independently runnable but shares tooling at the root.

**Tech Stack:** pnpm 9, Turborepo 2, TypeScript 5, Expo SDK 52 + Expo Router v4, NestJS 10, PostgreSQL + PostGIS, Redis, Docker Compose (local dev)

---

## Task 1: Root Monorepo Config

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `.gitignore`
- Create: `.env.example`
- Create: `CLAUDE.md`

**Step 1: Create root package.json**

```json
{
  "name": "ridge-platform",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "type-check": "turbo run type-check",
    "clean": "turbo run clean"
  },
  "devDependencies": {
    "turbo": "^2.3.0",
    "typescript": "^5.4.0",
    "prettier": "^3.3.0"
  },
  "packageManager": "pnpm@9.15.0",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  }
}
```

**Step 2: Create pnpm-workspace.yaml**

```yaml
packages:
  - 'apps/*'
  - 'services/*'
  - 'packages/*'
```

**Step 3: Create turbo.json**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".expo/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    },
    "clean": {
      "cache": false
    }
  }
}
```

**Step 4: Create .gitignore**

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
build/
.expo/
.next/
*.tsbuildinfo

# Environment
.env
.env.local
.env.*.local

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/settings.json
.idea/

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Python (AI services)
__pycache__/
*.py[cod]
.venv/
*.egg-info/

# Turbo
.turbo/

# Test coverage
coverage/
.nyc_output/
```

**Step 5: Create .env.example**

```bash
# Database
DATABASE_URL=postgresql://ridge:ridge@localhost:5432/ridge_dev
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=ridge_dev
DATABASE_USER=ridge
DATABASE_PASSWORD=ridge

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d

# AWS (S3 for media)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=ridge-media-dev

# API
API_PORT=3001
API_URL=http://localhost:3001

# AI Services
AI_MOVEMENT_SERVICE_URL=http://localhost:8001
AI_TRAILCAM_SERVICE_URL=http://localhost:8002
AI_TERRAIN_SERVICE_URL=http://localhost:8003
AI_HABITAT_SERVICE_URL=http://localhost:8004

# Map
MAPBOX_ACCESS_TOKEN=
```

**Step 6: Create CLAUDE.md**

```markdown
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
```

**Step 7: Verify files exist**

Run: `ls -la` in project root
Expected: package.json, pnpm-workspace.yaml, turbo.json, .gitignore, .env.example, CLAUDE.md all present

**Step 8: Commit**

```bash
git add package.json pnpm-workspace.yaml turbo.json .gitignore .env.example CLAUDE.md
git commit -m "chore: initialize monorepo root config"
```

---

## Task 2: Shared TypeScript Configs

**Files:**
- Create: `packages/tsconfig/package.json`
- Create: `packages/tsconfig/base.json`
- Create: `packages/tsconfig/react-native.json`
- Create: `packages/tsconfig/nestjs.json`

**Step 1: Create packages/tsconfig/package.json**

```json
{
  "name": "@ridge/tsconfig",
  "version": "0.0.1",
  "private": true,
  "files": [
    "base.json",
    "react-native.json",
    "nestjs.json"
  ]
}
```

**Step 2: Create packages/tsconfig/base.json**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

**Step 3: Create packages/tsconfig/react-native.json**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-native",
    "lib": ["ESNext"],
    "allowJs": true,
    "noEmit": true
  }
}
```

**Step 4: Create packages/tsconfig/nestjs.json**

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "./base.json",
  "compilerOptions": {
    "target": "ES2021",
    "module": "commonjs",
    "moduleResolution": "node",
    "lib": ["ES2021"],
    "outDir": "./dist",
    "rootDir": "./src",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "incremental": true
  }
}
```

**Step 5: Commit**

```bash
git add packages/tsconfig/
git commit -m "chore: add shared tsconfig package"
```

---

## Task 3: Shared Types Package

**Files:**
- Create: `packages/shared-types/package.json`
- Create: `packages/shared-types/tsconfig.json`
- Create: `packages/shared-types/src/index.ts`
- Create: `packages/shared-types/src/user.types.ts`
- Create: `packages/shared-types/src/hunt.types.ts`
- Create: `packages/shared-types/src/map.types.ts`
- Create: `packages/shared-types/src/community.types.ts`

**Step 1: Create packages/shared-types/package.json**

```json
{
  "name": "@ridge/shared-types",
  "version": "0.0.1",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "@ridge/tsconfig": "workspace:*",
    "typescript": "^5.4.0"
  }
}
```

**Step 2: Create packages/shared-types/tsconfig.json**

```json
{
  "extends": "@ridge/tsconfig/nestjs.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Create packages/shared-types/src/user.types.ts**

```typescript
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  state: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
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

**Step 4: Create packages/shared-types/src/hunt.types.ts**

```typescript
export type WeaponType = 'bow' | 'rifle' | 'muzzleloader' | 'shotgun' | 'pistol';

export interface Hunt {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  weaponType: WeaponType;
  notes?: string;
}

export interface CreateHuntInput {
  weaponType: WeaponType;
  notes?: string;
}

export interface StandLocation {
  id: string;
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  notes?: string;
}

export interface CreateStandInput {
  name: string;
  latitude: number;
  longitude: number;
  notes?: string;
}

export interface TrailCamera {
  id: string;
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
}

export interface Harvest {
  id: string;
  userId: string;
  species: string;
  scoreEstimate?: number;
  harvestDate: string;
}
```

**Step 5: Create packages/shared-types/src/map.types.ts**

```typescript
export type MapLayerType = 'satellite' | 'topo' | 'hybrid';

export type MarkerType = 'stand' | 'trail_camera' | 'bedding' | 'travel_route' | 'food_source';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapMarker {
  id: string;
  type: MarkerType;
  coordinates: Coordinates;
  label?: string;
}

export interface WindData {
  speed: number;       // mph
  direction: number;   // degrees (0-360)
  timestamp: string;
}

export type WindRisk = 'safe' | 'caution' | 'danger';

export interface WindAnalysis {
  windData: WindData;
  standId: string;
  risk: WindRisk;
  scentConeAngle: number;
}
```

**Step 6: Create packages/shared-types/src/community.types.ts**

```typescript
export interface Post {
  id: string;
  userId: string;
  caption?: string;
  mediaUrls: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  body: string;
  createdAt: string;
}

export type TrophyCategory =
  | 'biggest_whitetail'
  | 'biggest_elk'
  | 'biggest_mule_deer'
  | 'biggest_turkey'
  | 'public_land_legend';

export interface TrophyEntry {
  id: string;
  harvestId: string;
  category: TrophyCategory;
  seasonYear: number;
  rankingScore: number;
}
```

**Step 7: Create packages/shared-types/src/index.ts**

```typescript
export * from './user.types';
export * from './hunt.types';
export * from './map.types';
export * from './community.types';
```

**Step 8: Commit**

```bash
git add packages/shared-types/
git commit -m "feat: add shared-types package with core domain types"
```

---

## Task 4: NestJS Backend Shell

**Files:**
- Create: `apps/backend-api/package.json`
- Create: `apps/backend-api/tsconfig.json`
- Create: `apps/backend-api/tsconfig.build.json`
- Create: `apps/backend-api/nest-cli.json`
- Create: `apps/backend-api/src/main.ts`
- Create: `apps/backend-api/src/app.module.ts`
- Create: `apps/backend-api/src/app.controller.ts`
- Create: `apps/backend-api/src/app.service.ts`
- Create: `apps/backend-api/src/modules/auth/auth.module.ts`
- Create: `apps/backend-api/src/modules/users/users.module.ts`
- Create: `apps/backend-api/src/modules/hunts/hunts.module.ts`
- Create: `apps/backend-api/src/modules/map/map.module.ts`

**Step 1: Create apps/backend-api/package.json**

```json
{
  "name": "@ridge/backend-api",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "lint": "eslint \"{src,test}/**/*.ts\" --fix",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf dist"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/config": "^3.0.0",
    "@nestjs/jwt": "^10.0.0",
    "@nestjs/passport": "^10.0.0",
    "@nestjs/platform-fastify": "^10.0.0",
    "@nestjs/swagger": "^7.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "typeorm": "^0.3.0",
    "pg": "^8.11.0",
    "ioredis": "^5.3.0",
    "passport": "^0.6.0",
    "passport-jwt": "^4.0.0",
    "bcryptjs": "^2.4.3",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.0",
    "reflect-metadata": "^0.2.0",
    "rxjs": "^7.8.0",
    "@ridge/shared-types": "workspace:*"
  },
  "devDependencies": {
    "@nestjs/cli": "^10.0.0",
    "@nestjs/testing": "^10.0.0",
    "@ridge/tsconfig": "workspace:*",
    "@types/bcryptjs": "^2.4.0",
    "@types/node": "^20.0.0",
    "@types/passport-jwt": "^4.0.0",
    "typescript": "^5.4.0"
  }
}
```

**Step 2: Create apps/backend-api/tsconfig.json**

```json
{
  "extends": "@ridge/tsconfig/nestjs.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "paths": {
      "@ridge/shared-types": ["../../packages/shared-types/src"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Step 3: Create apps/backend-api/tsconfig.build.json**

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
}
```

**Step 4: Create apps/backend-api/nest-cli.json**

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
```

**Step 5: Create apps/backend-api/src/main.ts**

```typescript
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.setGlobalPrefix('api/v1');

  const config = new DocumentBuilder()
    .setTitle('RIDGE API')
    .setDescription('RIDGE Hunting Intelligence Platform API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.API_PORT ?? 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`RIDGE API running on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

bootstrap();
```

**Step 6: Create apps/backend-api/src/app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HuntsModule } from './modules/hunts/hunts.module';
import { MapModule } from './modules/map/map.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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

**Step 7: Create apps/backend-api/src/app.controller.ts**

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  health() {
    return this.appService.health();
  }
}
```

**Step 8: Create apps/backend-api/src/app.service.ts**

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health() {
    return {
      status: 'ok',
      service: 'ridge-api',
      timestamp: new Date().toISOString(),
    };
  }
}
```

**Step 9: Create module stubs**

Create `apps/backend-api/src/modules/auth/auth.module.ts`:
```typescript
import { Module } from '@nestjs/common';

@Module({})
export class AuthModule {}
```

Create `apps/backend-api/src/modules/users/users.module.ts`:
```typescript
import { Module } from '@nestjs/common';

@Module({})
export class UsersModule {}
```

Create `apps/backend-api/src/modules/hunts/hunts.module.ts`:
```typescript
import { Module } from '@nestjs/common';

@Module({})
export class HuntsModule {}
```

Create `apps/backend-api/src/modules/map/map.module.ts`:
```typescript
import { Module } from '@nestjs/common';

@Module({})
export class MapModule {}
```

**Step 10: Commit**

```bash
git add apps/backend-api/
git commit -m "feat: add NestJS backend-api shell with module structure"
```

---

## Task 5: Expo Router Mobile App Shell

**Files:**
- Create: `apps/mobile-app/package.json`
- Create: `apps/mobile-app/tsconfig.json`
- Create: `apps/mobile-app/app.json`
- Create: `apps/mobile-app/constants/theme.ts`
- Create: `apps/mobile-app/app/_layout.tsx`
- Create: `apps/mobile-app/app/(tabs)/_layout.tsx`
- Create: `apps/mobile-app/app/(tabs)/map.tsx`
- Create: `apps/mobile-app/app/(tabs)/dashboard.tsx`
- Create: `apps/mobile-app/app/(tabs)/wind.tsx`
- Create: `apps/mobile-app/app/(tabs)/scout.tsx`
- Create: `apps/mobile-app/app/(tabs)/tailgate.tsx`

**Step 1: Create apps/mobile-app/package.json**

```json
{
  "name": "@ridge/mobile-app",
  "version": "0.0.1",
  "private": true,
  "main": "expo-router/entry",
  "scripts": {
    "dev": "expo start",
    "build:ios": "eas build --platform ios",
    "build:android": "eas build --platform android",
    "lint": "eslint . --ext .ts,.tsx",
    "type-check": "tsc --noEmit",
    "clean": "rm -rf .expo node_modules/.cache"
  },
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-font": "~13.0.0",
    "expo-location": "~18.0.0",
    "expo-sqlite": "~14.0.0",
    "expo-file-system": "~18.0.0",
    "react": "18.3.1",
    "react-native": "0.76.0",
    "react-native-maps": "1.20.1",
    "@react-navigation/native": "^6.1.0",
    "react-native-safe-area-context": "4.12.0",
    "react-native-screens": "~4.1.0",
    "@expo/vector-icons": "^14.0.0",
    "@ridge/shared-types": "workspace:*"
  },
  "devDependencies": {
    "@babel/core": "^7.24.0",
    "@ridge/tsconfig": "workspace:*",
    "@types/react": "~18.3.0",
    "@types/react-native": "~0.76.0",
    "typescript": "^5.4.0"
  }
}
```

**Step 2: Create apps/mobile-app/tsconfig.json**

```json
{
  "extends": "@ridge/tsconfig/react-native.json",
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@ridge/shared-types": ["../../packages/shared-types/src"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.d.ts", "expo-env.d.ts"],
  "exclude": ["node_modules"]
}
```

**Step 3: Create apps/mobile-app/app.json**

```json
{
  "expo": {
    "name": "Ridge Hunt",
    "slug": "ridge-hunt",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "ridge",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/images/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#1E3A2F"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.ridge.hunt",
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "RIDGE uses your location to track hunts and analyze wind direction.",
        "NSLocationAlwaysAndWhenInUseUsageDescription": "RIDGE uses your location in the background for breadcrumb tracking during active hunts."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/adaptive-icon.png",
        "backgroundColor": "#1E3A2F"
      },
      "package": "com.ridge.hunt",
      "permissions": [
        "ACCESS_FINE_LOCATION",
        "ACCESS_COARSE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION"
      ]
    },
    "plugins": [
      "expo-router",
      "expo-font",
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "RIDGE uses your location to track hunts and analyze wind direction."
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

**Step 4: Create apps/mobile-app/constants/theme.ts**

```typescript
// RIDGE Design System — locked brand tokens
export const Colors = {
  // Primary palette
  forestGreen: '#1E3A2F',
  burntOrange: '#C56A2D',
  boneTan: '#E8E1D3',
  charcoal: '#2A2A2A',
  olive: '#4A5C45',

  // Wind analysis
  windSafe: '#22C55E',
  windCaution: '#EAB308',
  windDanger: '#EF4444',

  // UI surfaces
  background: '#1A1A1A',
  surface: '#242424',
  surfaceElevated: '#2E2E2E',
  border: '#3A3A3A',

  // Text
  textPrimary: '#E8E1D3',
  textSecondary: '#A8A89A',
  textMuted: '#6B6B60',

  // Interactive
  primary: '#1E3A2F',
  primaryLight: '#2A5240',
  accent: '#C56A2D',
  accentLight: '#D4824A',
} as const;

export const Typography = {
  // Bebas Neue for headlines, Inter for body
  headline: 'BebasNeue-Regular',
  body: 'Inter-Regular',
  bodyMedium: 'Inter-Medium',
  bodySemiBold: 'Inter-SemiBold',
  bodyBold: 'Inter-Bold',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;
```

**Step 5: Create apps/mobile-app/app/_layout.tsx**

```tsx
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

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
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
```

**Step 6: Create apps/mobile-app/app/(tabs)/_layout.tsx**

```tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/theme';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

interface TabConfig {
  name: string;
  title: string;
  icon: IoniconsName;
  iconFocused: IoniconsName;
}

const TABS: TabConfig[] = [
  { name: 'map',       title: 'Map',       icon: 'map-outline',       iconFocused: 'map' },
  { name: 'dashboard', title: 'Dashboard', icon: 'grid-outline',       iconFocused: 'grid' },
  { name: 'wind',      title: 'Wind',      icon: 'partly-sunny-outline', iconFocused: 'partly-sunny' },
  { name: 'scout',     title: 'Scout',     icon: 'eye-outline',        iconFocused: 'eye' },
  { name: 'tailgate',  title: 'Tailgate',  icon: 'people-outline',     iconFocused: 'people' },
];

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.charcoal,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: Colors.burntOrange,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 11,
        },
      }}
    >
      {TABS.map(({ name, title, icon, iconFocused }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? iconFocused : icon}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
```

**Step 7: Create tab screen stubs**

Create `apps/mobile-app/app/(tabs)/map.tsx`:
```tsx
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '../../constants/theme';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MAP</Text>
      <Text style={styles.subtitle}>Hunting map coming in Phase 1</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: Typography.headline,
    fontSize: 48,
    color: Colors.textPrimary,
    letterSpacing: 4,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 8,
  },
});
```

Create `apps/mobile-app/app/(tabs)/dashboard.tsx` (same structure, title "DASHBOARD")
Create `apps/mobile-app/app/(tabs)/wind.tsx` (same structure, title "WIND")
Create `apps/mobile-app/app/(tabs)/scout.tsx` (same structure, title "SCOUT")
Create `apps/mobile-app/app/(tabs)/tailgate.tsx` (same structure, title "TAILGATE")

**Step 8: Create assets placeholder directory**

```bash
mkdir -p apps/mobile-app/assets/fonts apps/mobile-app/assets/images
```

Add a note: Font files (BebasNeue-Regular.ttf, Inter variants) need to be downloaded from Google Fonts and placed in `apps/mobile-app/assets/fonts/` before the app will load.

**Step 9: Commit**

```bash
git add apps/mobile-app/
git commit -m "feat: add Expo Router mobile-app shell with RIDGE tab navigation"
```

---

## Task 6: AI Service Placeholders

**Files:**
- Create: `services/ai-movement-service/README.md`
- Create: `services/ai-movement-service/requirements.txt`
- Create: `services/ai-movement-service/main.py`
- Create: `services/ai-trailcam-service/README.md`
- Create: `services/ai-trailcam-service/requirements.txt`
- Create: `services/ai-trailcam-service/main.py`
- Create: `services/ai-terrain-service/README.md`
- Create: `services/ai-terrain-service/main.py`
- Create: `services/ai-habitat-service/README.md`
- Create: `services/ai-habitat-service/main.py`

**Step 1: Create ai-movement-service/main.py (FastAPI stub)**

```python
from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(
    title="RIDGE Movement Prediction Service",
    description="AI service for predicting deer movement patterns",
    version="0.1.0",
)


class MovementPredictionRequest(BaseModel):
    latitude: float
    longitude: float
    radius_miles: float = 1.0
    timestamp: str


class MovementPredictionResponse(BaseModel):
    stand_id: str | None
    prediction_score: float
    peak_movement_windows: list[str]
    confidence: float


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-movement-service", "timestamp": datetime.utcnow().isoformat()}


@app.post("/predict", response_model=MovementPredictionResponse)
def predict_movement(request: MovementPredictionRequest):
    # Stub — real model integration in Phase 2
    return MovementPredictionResponse(
        stand_id=None,
        prediction_score=0.0,
        peak_movement_windows=[],
        confidence=0.0,
    )
```

**Step 2: Create requirements.txt for each AI service**

```
fastapi==0.115.0
uvicorn[standard]==0.30.0
pydantic==2.8.0
python-dotenv==1.0.0
httpx==0.27.0
```

**Step 3: Repeat stub pattern for trailcam, terrain, habitat services**

Each service follows the same FastAPI pattern:
- `/health` endpoint
- One primary endpoint stub matching the service's function
- No real ML logic yet — Phase 2 fills these in

**Step 4: Commit**

```bash
git add services/
git commit -m "feat: add AI service stubs (movement, trailcam, terrain, habitat)"
```

---

## Task 7: Local Dev Infrastructure

**Files:**
- Create: `infra/docker/docker-compose.dev.yml`
- Create: `infra/docker/.env.docker`

**Step 1: Create docker-compose.dev.yml**

```yaml
version: '3.9'

services:
  postgres:
    image: postgis/postgis:16-3.4
    container_name: ridge_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: ridge_dev
      POSTGRES_USER: ridge
      POSTGRES_PASSWORD: ridge
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

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
  postgres_data:
  redis_data:
```

**Step 2: Verify Docker is available**

Run: `docker --version`
Expected: Docker version 24+

**Step 3: Start dev infrastructure**

Run: `docker compose -f infra/docker/docker-compose.dev.yml up -d`
Expected: postgres and redis containers start cleanly

**Step 4: Verify containers**

Run: `docker compose -f infra/docker/docker-compose.dev.yml ps`
Expected: both services show as "running"

**Step 5: Commit**

```bash
git add infra/
git commit -m "chore: add Docker Compose dev infrastructure (postgres+postgis, redis)"
```

---

## Task 8: Install Dependencies and Verify

**Step 1: Install all workspace dependencies**

Run: `pnpm install`
Expected: dependencies installed across all workspaces, no errors

**Step 2: Build shared packages**

Run: `pnpm --filter @ridge/shared-types build`
Expected: `packages/shared-types/dist/` created with .js and .d.ts files

**Step 3: Type-check all packages**

Run: `pnpm type-check`
Expected: no TypeScript errors across workspaces

**Step 4: Verify backend starts (optional — requires DB)**

Run: `pnpm --filter @ridge/backend-api dev`
Expected: NestJS starts on port 3001, health endpoint responds at `http://localhost:3001/api/v1/health`

**Step 5: Final commit**

```bash
git add .
git commit -m "chore: verify monorepo scaffold — all packages build and type-check clean"
```

---

## Summary

After completing all 8 tasks, the monorepo will have:

| Path | Contents |
|---|---|
| `package.json` | Root pnpm+Turborepo config |
| `packages/tsconfig` | Shared TS configs for RN and NestJS |
| `packages/shared-types` | Core domain types (User, Hunt, Map, Community) |
| `apps/backend-api` | NestJS shell with Auth/Users/Hunts/Map module stubs |
| `apps/mobile-app` | Expo Router shell with RIDGE tab nav and design tokens |
| `services/ai-*` | FastAPI stubs for all 4 AI services |
| `infra/docker` | Docker Compose for local Postgres+PostGIS+Redis |

Next step after scaffold: **Phase 1 — Auth system** (NestJS JWT auth + Expo login/register screens).
