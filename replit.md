# RPG Idle — Mobile idle RPG with prestige, races, elements and Clerk auth

## Run & Operate
- `pnpm --filter @workspace/mobile run dev` — start Expo dev server (mobile app)
- `pnpm --filter @workspace/api-server run dev` — start API server
- Storage key: `rpg_idle_v4` (AsyncStorage)
- Required env vars: `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY` → auto-injected as `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` in dev script

## Stack
- Expo ~54, expo-router ~6 (file-based routing)
- React Native + TypeScript
- @clerk/expo (Core v3 API) — auth
- AsyncStorage — game state persistence
- pnpm workspace monorepo

## Where things live
- `artifacts/mobile/app/` — screens and layouts
- `artifacts/mobile/app/(auth)/` — sign-in, sign-up screens
- `artifacts/mobile/app/(tabs)/` — game tabs (battle, dungeon, equipment, skills, hero)
- `artifacts/mobile/app/race-select.tsx` — race selection wheel (root-level route)
- `artifacts/mobile/context/GameContext.tsx` — all game state, battle loop, race/class selection
- `artifacts/mobile/constants/game.ts` — classes, zones, skills, equipment definitions
- `artifacts/mobile/constants/races.ts` — 19 races with stats, abilities, elements
- `artifacts/mobile/constants/elements.ts` — 22 elements (basic, advanced, variants)

## Architecture decisions
- Race is stored as `raceId` in hero state (bonuses computed on the fly, not baked into base stats)
- Storage key bumped to `rpg_idle_v4` with migration logic for old saves
- Auth flow: sign-up → tabs layout → race-select (if no raceId) → tabs; sign-in → tabs directly
- `(tabs)/_layout.tsx` redirects to `/race-select` when `state.hero.raceId === null` (after game loads)
- `isLoading` flag in GameContext prevents premature redirect before AsyncStorage resolves
- Prestige preserves `raceId` (race is permanent); resets class stats and level

## Product
- 19 playable races (wheel/roleta picker) each with 3 active skills + 1 passive, racial stats, element affinities
- 22 elements: 8 basic (fogo/água/terra/trovão/gelo/vento/escuridão/luz), 7 advanced (arcano/veneno/metal/natureza/sangue/void/caos), 7 variants (sagrado/sombra/infernal/etc.)
- Expanded attribute system: HP, Armor, ATK.f, ATK.m, Crítico, Taxa Crítico, Sorte (max 20%), Esquiva (max 35%), Roubo de Vida, Velocidade, Poder Mágico, Fortuna, Regen HP, Penetração Armadura
- Dodge and life steal are active in combat loop
- 3 classes (Warrior, Mage, Archer), 5 zones, auto-combat, equipment drops, prestige
- Clerk auth with email verification (Portuguese UI)

## User preferences
- All game UI in Portuguese
- RPG dark gold theme
- Complex idle mechanics: race + class + equipment + skills + elements

## Gotchas
- `race-select.tsx` must be at root level (not inside `(auth)`) — auth layout redirects signed-in users away from the auth group
- `(auth)/race-select.tsx` exists only as a redirect shim to `/race-select`
- `expo-glass-effect` `isLiquidGlassAvailable()` is used in tabs layout — falls back to ClassicTabLayout on web/Android
- Clerk `tokenCache` from `@clerk/expo/token-cache` requires `expo-secure-store`

## Pointers
- Clerk Expo docs: https://clerk.com/docs/quickstarts/expo
- Expo Router docs: https://docs.expo.dev/router/introduction/
