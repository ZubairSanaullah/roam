# 03 · Onboarding Flow & Auth Entry

Status: done

## Goal
Build Roam's 3-slide onboarding experience at `/` matching the reference design (full-bleed Unsplash photography, `roam` wordmark, `Skip` pill, dark-glass location badge, sloped-curve bottom sheet, 3-pill step indicator, headline, subtitle, `Get started` CTA, and `Continue with Google` CTA), move the Design System showcase to `/design-system`, and connect onboarding into Roam-styled Sign In and Sign Up screens ready for Clerk wiring.

## Decisions
- **Entry route & showcase move:** `src/app/index.tsx` becomes the onboarding route (`/`), shown to unauthenticated users until signed in; the Design System showcase moves to `src/app/design-system.tsx` (`/design-system`).
- **3-slide interactive flow:**
  - Slide 1 (`Whistler, BC`): `"Find a stay that\nfits your story"` · `"From mountain cabins to oceanfront villas, roam helps you find unforgettable stays for every kind of trip."` · `https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1200&q=80`
  - Slide 2 (`Amalfi Coast, Italy`): `"Describe your\nideal getaway"` · `"Tell roam what matters in one sentence: quiet views, pet-friendly patios, or under $300 a night."` · `https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80`
  - Slide 3 (`Lake Arrowhead, CA`): `"Book with total\nconfidence"` · `"Get exact answers on house rules, check-in, and cancellation straight from each stay's verified policies."` · `https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=80`
- **Action routing:**
  - `Skip` (top-right pill) → navigates directly to `/sign-in`.
  - `Get started` (primary yellow pill) → advances slides `1 → 2 → 3`; on slide 3, navigates to `/sign-up`.
  - `Continue with Google` (secondary outlined pill) → navigates to `/sign-in?provider=google`.
- **Auth screens without Clerk dependency yet:** Build `src/app/(auth)/_layout.tsx`, `src/app/(auth)/sign-in.tsx`, and `src/app/(auth)/sign-up.tsx` using Roam's design-system primitives (`AppText`, `Button`, `Input`, `Alert`, `GoogleIcon`) with back navigation to onboarding, cross-links between Sign In and Sign Up, and a non-blocking informational `Alert` explaining that live authentication will activate once Clerk is configured in the Auth task.
- **Proposed new design-system tokens (no hardcoded values in screens):**
  - `global.css` + `src/theme/colors.ts`:
    - `--color-lavender-indicator` (`#9E82FF` light / `#C9B4FF` dark) for the active onboarding step pill.
    - `--color-overlay-border` (`rgba(255, 255, 255, 0.28)`) for translucent photo badge borders.
    - `--color-top-scrim` (`rgba(255, 255, 255, 0.88)` light / `rgba(11, 11, 26, 0.85)` dark) for the top gradient scrim behind `roam` and `Skip`.
  - `global.css` + `AppText`:
    - `@utility type-wordmark` (`PlusJakartaSans_700Bold`, `40px`, line-height `44px`, letter-spacing `-1.4px`) for the header `roam` wordmark.
    - `@utility type-hero` (`PlusJakartaSans_700Bold`, `34px`, line-height `40px`, letter-spacing `-0.7px`) for the onboarding headline.
- **Button icon alignment:** Add `rightIconAlign?: "inline" | "end"` (default `"inline"`) to `src/components/ui/button.tsx` so `"Get started"` stays centered horizontally while `ArrowRight` aligns near the right edge of the pill.
- **No extra dependencies:** Render the top mist scrim and the bottom sheet's sloped-curve top edge using `react-native-svg` (already installed) instead of adding `expo-linear-gradient`.
- **Gesture & animation budget (`expo-animation`):** Swiping uses native horizontal `FlatList` paging (`pagingEnabled`, `showsHorizontalScrollIndicator={false}`, `bounces={false}`); step indicator pills animate smoothly using Reanimated CSS/spring transitions respecting reduced motion (`ReduceMotion.System`). No layout-property animations on scroll frames.

## Out of scope
- Installing `@clerk/clerk-expo` or implementing real Google OAuth / email-password Clerk sessions.
- Persisting onboarding state to `expo-secure-store` or `AsyncStorage` (onboarding remains the unauthenticated start route until Clerk auth gating is wired).
- PostHog analytics events.

## Steps

### 1. Extend design tokens and UI primitives
Update `global.css`, `src/theme/colors.ts`, `src/components/ui/app-text.tsx`, and `src/components/ui/button.tsx`:
- Add `--color-lavender-indicator`, `--color-overlay-border`, and `--color-top-scrim` tokens to `@theme` in `global.css` and mirror them in `palette` / `semanticColors` in `src/theme/colors.ts`.
- Add `@utility type-wordmark` and `@utility type-hero` in `global.css`, and expose `"wordmark"` and `"hero"` variants in `src/components/ui/app-text.tsx`.
- Add `rightIconAlign?: "inline" | "end"` to `Button` in `src/components/ui/button.tsx` (when `"end"`, keep the title centered and position `rightIcon` at the right edge with balanced spacing).

Done when `tsc --noEmit` and `expo lint` pass with zero errors and no hardcoded hex colors or font sizes leak outside `global.css` and `src/theme/`.

### 2. Move the Design System showcase to `/design-system`
Move the current showcase component from `src/app/index.tsx` to `src/app/design-system.tsx` and update `src/app/_layout.tsx` if needed so `/design-system` keeps its `"Roam Design System"` stack header while `/` (`index`) and `(auth)` use `headerShown: false`.

Done when `/design-system` renders the full showcase unchanged and root stack navigation supports headerless onboarding and auth routes.

### 3. Build the Onboarding screen in `src/app/index.tsx` (and screen-local data/components)
Create screen-local onboarding data and curved-sheet / slide composition in `src/components/onboarding/` (or `src/screens/onboarding/` — keep helpers outside `src/app/` per `AGENTS.md` and `expo-router`):
- Full-bleed horizontal `FlatList` carousel (`width` × hero height) rendering each slide's Unsplash photo (`expo-image`, `contentFit="cover"`, `transition={200}`) and bottom-left dark-glass location pill (`bg-glass-blur-dark` + `border-overlay-border` + `MapPin` icon + location label).
- Top overlay bar respecting `useSafeAreaInsets().top`: SVG top scrim gradient (`colors.topScrim` → transparent), `roam` wordmark (`AppText variant="wordmark"`), and translucent `Skip` pill button (`Pressable` with pressed opacity/scale feedback, 44pt min touch target, routing to `/sign-in`).
- Bottom sloped-curve container overlapping the bottom of the hero image:
  - `react-native-svg` curved top path (higher rounded shoulder on the left, smooth downward slope toward the right edge, filled with `colors.surface`).
  - Solid `bg-surface-white dark:bg-surface-elevated-dark` body with `useSafeAreaInsets().bottom` padding.
  - 3-pill step indicator (`bg-lavender-indicator` active pill, `bg-border-gray dark:bg-border-dark` inactive pills; tappable to jump to a slide).
  - Headline (`AppText variant="hero"`), subtitle (`AppText variant="body" tone="secondary"`).
  - Primary yellow `Button` (`variant="primary"`, `size="lg"`, `rightIcon={ArrowRight}`, `rightIconAlign="end"`, `"Get started"`).
  - Secondary `Button` (`variant="secondary"`, `size="lg"`, `leftElement={<GoogleIcon size={20} />}`, `"Continue with Google"`).
- Ensure responsive layout across standard iPhone widths and dynamic font scaling (allow text to wrap cleanly without overlapping the hero badge or clipping buttons).

Done when all 3 slides swipe and advance cleanly, `Skip` routes to `/sign-in`, `Continue with Google` routes to `/sign-in?provider=google`, and `Get started` advances `1 → 2 → 3` then routes to `/sign-up`.

### 4. Build connected Sign In and Sign Up screens in `src/app/(auth)/`
Create `src/app/(auth)/_layout.tsx`, `src/app/(auth)/sign-in.tsx`, and `src/app/(auth)/sign-up.tsx`:
- `src/app/(auth)/_layout.tsx`: Stack navigator (`headerShown: false`).
- `src/app/(auth)/sign-in.tsx`:
  - Back button (`ArrowLeft`, 44×44 touch target) returning to onboarding (`router.back()` / `router.replace("/")`).
  - `roam` wordmark + `"Welcome back"` heading + short subtitle.
  - If navigated via `provider=google`, show a clear `Alert` banner noting Google sign-in activates once Clerk is connected.
  - Email (`Mail` icon) and Password (`Lock` icon, `secureTextEntry`) `Input` fields with simple client-side validation feedback (empty/invalid email error state).
  - `"Sign in"` primary `Button` and `"Continue with Google"` secondary `Button` (both trigger a clean status `Alert` previewing the upcoming Clerk integration).
  - Footer link `"Don't have an account? Sign up"` navigating to `/sign-up`.
- `src/app/(auth)/sign-up.tsx`:
  - Back button, `roam` wordmark + `"Create your account"` heading + short subtitle.
  - Full name (`User` icon), Email (`Mail` icon), and Password (`Lock` icon, `secureTextEntry`) `Input` fields with client-side validation feedback.
  - `"Create account"` primary `Button` and `"Continue with Google"` secondary `Button`.
  - Footer link `"Already have an account? Sign in"` navigating to `/sign-in`.

Done when the user can seamlessly move between `/`, `/sign-in`, `/sign-up`, and back without dead ends or runtime warnings.

## Verification
1. `npx tsc --noEmit` — passes with 0 errors.
2. `npx expo lint` — passes with 0 errors.
3. `npx expo install --check` — confirms SDK 58 dependency compatibility.
4. Design-system audit grep checks across `src/` (excluding `src/theme/`): 0 hardcoded hex colors, 0 raw `fontSize:` literals, 0 legacy `shadow*`/`elevation:` props, 0 `TouchableOpacity` usages.
5. Verify all 3 Unsplash URLs return HTTP 200 and load cleanly.
6. Run Metro exports (`npx expo export --platform ios --no-bytecode` and `npx expo export --platform web` to a temporary directory) and verify web rendering/layout + interactive navigation (`/`, slide `1 → 2 → 3`, `Skip` → `/sign-in`, `Get started` → `/sign-up`, `Continue with Google` → `/sign-in?provider=google`, `/design-system`), noting iOS Simulator screenshot availability explicitly on Windows.

## AGENTS.md updates
Add a brief note under `## Who owns what` or `## Rules` if any lasting routing convention is introduced (e.g. unauthenticated entry at `/` onboarding routing into `(auth)/sign-in` and `(auth)/sign-up`, with `/design-system` holding the component showcase).

## Result
Built Roam's 3-slide onboarding experience at `src/app/index.tsx` (with `src/components/onboarding/onboarding-slides.ts` and `src/components/onboarding/onboarding-chrome.tsx`), relocated the design-system showcase to `src/app/design-system.tsx`, extended `global.css`, `src/theme/colors.ts`, `AppText`, `AppIcon`, `Alert`, and `Button` with the required tokens/variants (`wordmark`, `hero`, `lavenderIndicator`, `overlayBorder`, `topScrim`, `onOverlay`, `info` alert, and `rightIconAlign="end"`), and connected onboarding into `src/app/(auth)/sign-in.tsx` and `src/app/(auth)/sign-up.tsx` via `src/components/auth/auth-screen-shell.tsx`. `npx tsc --noEmit`, `npx expo lint`, `npx expo install --check`, the design-system grep audit, Unsplash HTTP 200 checks, and both Metro web and iOS (`--no-bytecode`) exports passed. iOS Simulator visual comparison could not run on Windows.
