# 02 · Roam Design System

Status: done

## Goal
Implement Roam's visual design system from the reference sheet—custom Geometric Sans font (`Plus Jakarta Sans`), light and derived dark color palettes, 4-point spacing, radii, shadows, shared Tailwind/NativeWind v5 styles, and reusable UI primitives—so every screen draws from a single visual source of truth.

## Decisions
- **Font family:** Install `@expo-google-fonts/plus-jakarta-sans` (`Regular`, `Medium`, `SemiBold`, `Bold`) and load weights via `expo-font` `useFonts` + `expo-splash-screen` in `src/app/_layout.tsx` so custom fonts render identically across iOS, Android, and Web without relying on native-only config plugins. Static font weights map to separate `--font-*` families in `global.css` (without combining `fontWeight` on native, avoiding iOS font synthesis).
- **Icons:** Install `lucide-react-native` and Expo-compatible `react-native-svg` (`npx expo install react-native-svg`), wrapped via an `AppIcon` primitive that resolves semantic light/dark colors from the theme.
- **Single source of truth (`global.css` + thin JS bridge):** Per `expo-design-system`, CSS tokens (`@theme`, `:root`, `@utility` classes) in `./global.css` are the primary source of truth for NativeWind v5. A minimal `src/theme/colors.ts` + `src/theme/index.ts` mirrors only the values needed by non-`className` React Native props (`lucide-react-native` `color`, `TextInput` `placeholderTextColor`, `ActivityIndicator`, navigation headers) and exposes `useThemeColors()`.
- **Colors (light exact from reference, dark derived):**
  - Light exact: `primary-yellow` `#FFC629`, `lavender` `#C9B4FF`, `text-primary` `#0B0B1A`, `text-secondary` `#6B7280`, `surface-white` `#FFFFFF`, `surface-gray` `#F4F5F7`, `border-gray` `#E5E7EB`, `glass-blur` `rgba(255, 255, 255, 0.7)`.
  - Derived dark counterparts (since `app.json` has `userInterfaceStyle: "automatic"`): `surface-dark` `#0B0B1A`, `surface-elevated-dark` `#151528`, `surface-subtle-dark` `#1F1F36`, `border-dark` `#2D2D48`, `text-primary-dark` `#F9FAFB`, `text-secondary-dark` `#9CA3AF`, `glass-blur-dark` `rgba(11, 11, 26, 0.72)`.
  - Derived semantic & badge tints (light/dark pairs): lavender tint (`#EFEAFF` / `#241E42`, accent `#6D4AFF` / `#C9B4FF`), success (`#DCFCE7` bg / `#15803D` fg; dark `#123121` / `#4ADE80`), error (`#FEE2E2` bg / `#DC2626` fg; dark `#351418` / `#F87171`), badge-yellow (`#FEF3C7` / `#0B0B1A`; dark `#332911` / `#FDE68A`), badge-info (`#DBEAFE` / `#1D4ED8`; dark `#172554` / `#93C5FD`), badge-promo (`#FCE7F3` / `#9D174D`; dark `#3B1226` / `#F9A8D4`).
- **Typography scale (from reference):** `display` (`56px`, line-height `1.0`, Bold), `heading` (`28px`, line-height `1.2`, Bold), `title` (`18px`, line-height `1.25`, Bold — estimated for card headings), `body` (`16px`, line-height `1.5`, Regular), `caption` (`14px`, line-height `1.35`, Medium), `button` (`17px`, line-height `1.2`, Medium), `label` (`12px`, line-height `1.2`, Medium — estimated for badges/chips).
- **Spacing & radii (4-pt grid + estimated radii):** Spacing steps `xs: 4px`, `sm: 8px`, `md: 12px`, `base: 16px`, `lg: 20px`, `xl: 24px`, `2xl: 32px`, `3xl: 48px`. Radii `sm: 8px`, `md: 12px`, `lg: 16px`, `xl: 20px`, `2xl: 24px`, `full: 9999px` (paired with `borderCurve: "continuous"` on non-capsule native surfaces).
- **Shadows (`boxShadow` only):** `card` (`0 2px 8px rgba(11, 11, 26, 0.06)`), `raised` (`0 6px 18px rgba(11, 11, 26, 0.10)`), `glass` (`0 8px 24px rgba(11, 11, 26, 0.12)`).
- **Core UI primitives:** Build `AppText`, `AppIcon`, `Button`, `Input`, `Chip`, `Badge`, `Alert`, and `Card` in `src/components/ui/` following the `expo-design-system` component contract (`variant`, `size`, pressed/disabled/loading states via `Pressable`, `style` + `className` overrides merged last, accessibility roles/states/labels).

## Out of scope
- Feature-specific composite components (Listing card, Policy card, Profile row, Bottom liquid-glass tab bar, Segmented control, Stepper/Toggle) — those belong to their respective feature screens until reused across 2+ screens per `expo-design-system` promotion rules.
- Creating custom brand SVG wordmark assets (`roam` logo) — to be supplied as real assets in `assets/` when needed.
- Refactoring navigation or adding new routes beyond updating `src/app/_layout.tsx` (font loading) and `src/app/index.tsx` (design-system preview).

## Steps

### 1. Install font and icon dependencies
Install the geometric font package and vector icon runtime using Expo-compatible tooling:
- `npx expo install @expo-google-fonts/plus-jakarta-sans react-native-svg`
- `npm install lucide-react-native`
- Run `npx expo install --check` to confirm SDK 58 compatibility.

Done when `package.json` and `package-lock.json` include `@expo-google-fonts/plus-jakarta-sans`, `react-native-svg`, and `lucide-react-native` cleanly.

### 2. Define design tokens and shared `@utility` styles in `global.css` and `src/theme/`
Update `global.css` (preserving the Tailwind v4 split imports and `@import "nativewind/theme";`) with:
- `@theme` tokens:
  - Fonts: `--font-sans` (`"PlusJakartaSans_400Regular"`), `--font-sans-medium` (`"PlusJakartaSans_500Medium"`), `--font-sans-semibold` (`"PlusJakartaSans_600SemiBold"`), `--font-sans-bold` (`"PlusJakartaSans_700Bold"`), `--font-display` (`"PlusJakartaSans_700Bold"`).
  - Reference palette colors (`--color-primary-yellow`, `--color-lavender`, `--color-text-primary`, `--color-text-secondary`, `--color-surface-white`, `--color-surface-gray`, `--color-border-gray`, `--color-glass-blur`) plus dark-mode surface/text/border colors and semantic/badge tints.
  - 4-pt spacing tokens (`--spacing-xs` through `--spacing-3xl`), radii tokens (`--radius-sm` through `--radius-full`), and `boxShadow` tokens (`--shadow-card`, `--shadow-raised`, `--shadow-glass`).
- Shared `@utility` classes for repeated surface/text/elevation patterns (e.g. `bg-app`, `bg-surface`, `bg-surface-subtle`, `border-subtle`, `text-ink`, `text-ink-muted`, `shadow-card`, `shadow-raised`, `shadow-glass`, `type-display`, `type-heading`, `type-title`, `type-body`, `type-caption`, `type-button`, `type-label`).
- Create `src/theme/colors.ts`, `src/theme/tokens.ts`, and `src/theme/index.ts` exporting `palette` (matching `global.css` exact values), `useThemeColors()` (resolving light/dark semantic colors from `useColorScheme()`), `spacing`, `radius`, `shadows`, and `fontFamilies` for non-`className` native props (`lucide-react-native`, `TextInput` placeholder/cursor, `ActivityIndicator`, navigation headers).

Done when `global.css` compiles with `@tailwindcss/cli` / Metro without warnings or errors and `src/theme/` passes `tsc --noEmit`.

### 3. Load Plus Jakarta Sans in `src/app/_layout.tsx`
Update `src/app/_layout.tsx`:
- Import `useFonts`, `PlusJakartaSans_400Regular`, `PlusJakartaSans_500Medium`, `PlusJakartaSans_600SemiBold`, `PlusJakartaSans_700Bold` from `@expo-google-fonts/plus-jakarta-sans`.
- Call `SplashScreen.preventAutoHideAsync()` at module scope and hide the splash screen once `fontsLoaded || fontError` is true.
- Guard rendering while `!fontsLoaded && !fontError` and configure the root `<Stack>` header styling using `useThemeColors()` (Surface White / Dark background, Text Primary foreground, Plus Jakarta Sans font).

Done when `src/app/_layout.tsx` loads all 4 weights cleanly and passes typecheck and lint.

### 4. Build reusable UI primitives in `src/components/ui/`
Implement the core primitives following the `expo-design-system` contract (`variant`, `size`, `Pressable` pressed state, disabled/loading guards, `className` and `style` overrides merged last, accessibility props, `borderCurve: "continuous"` on non-capsule surfaces):
- `src/components/ui/app-text.tsx`: `AppText` with `variant` (`display | heading | title | body | caption | button | label`) and `tone` (`primary | secondary | inverse | yellow | lavender | success | error`).
- `src/components/ui/app-icon.tsx`: `AppIcon` wrapping a `LucideIcon` with `size` (`sm | md | lg` or numeric) and semantic `tone` resolved from `useThemeColors()`.
- `src/components/ui/button.tsx`: `Button` supporting `variant` (`primary | secondary | lavender | ghost`), `size` (`sm | md | lg`), `title` (optional when `iconOnly`), `leftIcon`, `rightIcon`, `iconOnly`, `loading`, `disabled`, `className`, `style`, and `onPress`.
- `src/components/ui/input.tsx`: `Input` supporting `label`, `variant` (`default | search`), leading/trailing icons, secure password visibility toggle (`secureTextEntry`), real focus state styling (`border-lavender` + subtle lavender wash), error state, and `Input` forwarding of `TextInputProps`.
- `src/components/ui/chip.tsx`: `Chip` supporting `selected`, `accent` (`lavender | yellow`), optional leading icon, `disabled`, `accessibilityRole="button"`, `accessibilityState={{ selected }}`.
- `src/components/ui/badge.tsx`: `Badge` supporting `variant` (`yellow | success | promo | info | neutral`) and optional leading icon.
- `src/components/ui/alert.tsx`: `Alert` supporting `variant` (`success | error`), message text, and optional `onDismiss` button with accessible close label.
- `src/components/ui/card.tsx`: `Card` accepting `children` (composition over configuration), `variant` (`default | subtle | lavender | glass`), `padding` (`sm | md | lg`), `borderCurve: "continuous"`, and `className`/`style` overrides.
- `src/components/ui/index.ts`: barrel exports for all primitives.

Done when every primitive compiles cleanly under TypeScript strict mode and ESLint.

### 5. Build a Design System showcase in `src/app/index.tsx`
Replace the placeholder welcome screen in `src/app/index.tsx` with a scrollable Design System preview organized by the reference sections (Brand/Typography ramp, Color palette swatches, Buttons including icon buttons, Interactive Input fields with focus & password toggle, Tappable Filter chips, Badges, Alerts, and Cards) using exclusively the design tokens and `src/components/ui` primitives (zero hardcoded hexes or raw font sizes outside `global.css`/`src/theme/`).

Done when `src/app/index.tsx` renders all primitives cleanly and passes all token-audit checks.

## Verification
1. Run `npx tsc --noEmit` — passes with 0 errors.
2. Run `npx expo lint` — passes with 0 errors.
3. Run `npx expo install --check` — passes with compatible SDK 58 packages.
4. Run design-system audit grep checks from `expo-design-system/references/audit.md` across `src/` (excluding `src/theme/`): 0 hardcoded hex colors, 0 raw `fontSize:` literals, 0 legacy `shadow*`/`elevation:` props, 0 `TouchableOpacity` usages, 0 arbitrary Tailwind bracket classes (`[...]`).
5. Run Metro exports (`npx expo export --platform ios --clear` and `npx expo export --platform web --clear` to scratch) — both succeed with exit code 0, and verify emitted web CSS includes the custom font, color, spacing, radius, and shadow tokens.
6. Report any unavailable runtime checks (e.g., iOS simulator screenshot on Windows) explicitly as ❌ with reason.

## AGENTS.md updates
Update `## Who owns what` (`**Styling:**`) with the design-system token source (`global.css`), JS mirror (`src/theme/`), font (`@expo-google-fonts/plus-jakarta-sans`), and icon subpath convention (`lucide-react-native/icons/*`).

## Result
Implemented Roam's design system in `global.css` (`@theme` tokens and `@utility` type ramp), `src/theme/` (`palette`, `semanticColors`, `useThemeColors`, `fontFamilies`, `spacing`, `radius`, `shadows`, `iconSizes`), `src/app/_layout.tsx` (Plus Jakarta Sans font loading via `useFonts` + splash screen), `src/components/ui/` (`AppText`, `AppIcon`, `Button`, `Input`, `Chip`, `Badge`, `Alert`, `Card`), and a preview screen in `src/app/index.tsx`. Switching `lucide-react-native` to individual `lucide-react-native/icons/*` subpaths avoided transforming the full icon barrel in Metro. `tsc --noEmit`, `expo lint`, `expo install --check`, the design-system grep audit, Tailwind CLI, Metro iOS (`--no-bytecode`), and Metro web exports all passed (`hermesc -O` bytecode emission hit `LLVM ERROR: out of memory` under ~408 MB free host RAM).
