# 04 · Auth Screens (Sign Up, Verification, Sign In)

Status: done

## Goal
Build Roam's Sign Up, Email Verification, and Sign In screens matching the attached design (`Create your account`), wire complete mocked authentication and form/navigation interactions between onboarding and a mocked signed-in home screen, and leave Clerk integration mocked for the dedicated Auth task.

## Decisions
- **Top header matching design (`AuthScreenShell`):** Left circular outlined back button (`Button variant="secondary" size="sm" iconOnly leftIcon={ChevronLeft}`) and right-aligned `roam` wordmark (`AppText variant="brand"`).
- **Proposed new design-system tokens & primitives:**
  - `global.css` + `AppText`: add `@utility type-brand` (`PlusJakartaSans_700Bold`, `26px`, line-height `30px`, letter-spacing `-0.9px`) for the top-right `roam` header mark.
  - `Input` (`src/components/ui/input.tsx`): add `variant="stacked"` rendering the design's `64px` rounded-rectangle (`radius.lg` + `borderCurve: "continuous"`) `surface-gray` box with leading icon, internal top label (`text-primary`), inline `TextInput`, password visibility toggle, and lavender focus / error borders, while keeping existing `default` and `search` pill variants unchanged for `/design-system`.
  - `AppleIcon` (`src/components/ui/apple-icon.tsx`): vector Apple logo using `useThemeColors().textPrimary` so it adapts cleanly across light and dark modes.
- **Sign Up (`src/app/(auth)/sign-up.tsx`):**
  - Headline `"Create\nyour account"`, subtitle `"Join roam to save your stays, get personalized recommendations and access them across all your devices."`
  - Three `stacked` inputs: Full name (`User`, placeholder `"e.g. Adrian Hajdin"`), Email address (`Mail`, placeholder `"you@example.com"`), Password (`Lock`, placeholder `"At least 8 characters"`, `secureTextEntry`).
  - `"Create account"` primary yellow button (`rightIcon={ArrowRight}`, `rightIconAlign="end"`): validates non-empty name, valid email, and `>= 8` char password; on success stores pending signup info and navigates to `/(auth)/verify`.
  - `"or"` hairline divider, `"Continue with Google"` + `"Continue with Apple"` secondary pill buttons (mocked OAuth sets mocked session and navigates to `/home`), and underlined `"Already have an account? Sign in"` footer link (`→ /sign-in`).
- **Verification (`src/app/(auth)/verify.tsx`):**
  - Headline `"Verify\nyour email"`, subtitle showing the pending email address.
  - 6 individual rounded OTP digit cells (`src/components/auth/otp-input.tsx`) backed by a single hidden `TextInput` (`keyboardType="number-pad"`, `textContentType="oneTimeCode"`, `maxLength={6}`) so typing, backspace, paste, and iOS/Android autofill work seamlessly with zero focus flicker.
  - `"Verify & continue"` primary yellow button (`rightIcon={ArrowRight}`, `rightIconAlign="end"`): requires 6 digits, simulates brief verification, signs in mocked user, and routes (`replace`) to `/home`.
  - `"Resend code"` link with 30-second countdown timer and inline `info` `Alert` confirmation.
- **Sign In (`src/app/(auth)/sign-in.tsx`):**
  - Headline `"Welcome\nback"`, subtitle `"Sign in to save stays, view your trips, and ask about policies."`
  - Two `stacked` inputs: Email address (`Mail`) and Password (`Lock`, `secureTextEntry`).
  - Right-aligned `"Forgot password?"` link triggering a mocked password-reset confirmation `Alert` (validating email first or prompting the user to enter their email).
  - `"Sign in"` primary yellow button, `"or"` divider, `"Continue with Google"` + `"Continue with Apple"` buttons, and underlined `"Don't have an account? Sign up"` footer link (`→ /sign-up`).
- **Mocked auth state & `/home` destination:**
  - Lightweight in-memory `MockAuthProvider` (`src/components/auth/mock-auth-context.tsx`) wrapped in `src/app/_layout.tsx` holding `{ name, email, provider }` and `signIn`, `completeSignUp`, `signInWithProvider`, `signOut`.
  - Mocked signed-in placeholder at `src/app/home.tsx` (`/home`) displaying the signed-in user summary, a link to `/design-system`, and a `"Sign out"` button returning to `/`.
- **Onboarding connection:** Ensure `Continue with Google` on `/` (`src/app/index.tsx`) routes to `/sign-in?provider=google` cleanly, and `(auth)` flows handle back navigation gracefully.

## Out of scope
- Installing `@clerk/clerk-expo` or hitting real Clerk / OAuth endpoints.
- Persisting mocked sessions across app restarts (`SecureStore` / `AsyncStorage`).
- Building the full Home, Search, or Trips tab screens.

## Steps

### 1. Extend design tokens and UI primitives
- Add `@utility type-brand` to `global.css` and `"brand"` variant to `src/components/ui/app-text.tsx`.
- Update `src/components/ui/input.tsx` to support `variant="stacked"` (rounded `radius.lg`, `borderCurve: "continuous"`, internal top label + `TextInput`, leading icon, password toggle, focus/error states).
- Create `src/components/ui/apple-icon.tsx` and export `AppleIcon` from `src/components/ui/index.ts`.

Done when `global.css` and `src/components/ui/` pass `tsc --noEmit` and `expo lint`.

### 2. Add `MockAuthProvider` and update `AuthScreenShell`
- Create `src/components/auth/mock-auth-context.tsx` with `MockAuthProvider` and `useMockAuth()`.
- Update `src/app/_layout.tsx` to wrap `<Stack>` in `<MockAuthProvider>` and register `<Stack.Screen name="home" options={{ headerShown: false }} />`.
- Update `src/components/auth/auth-screen-shell.tsx` to match the design's top bar (`ChevronLeft` circular outlined button on the left, `roam` `brand` wordmark on the right) and underlined dark footer link.

Done when `MockAuthProvider` and `AuthScreenShell` compile cleanly.

### 3. Build `OtpInput` and `(auth)` screens (`sign-up`, `verify`, `sign-in`)
- Create `src/components/auth/otp-input.tsx` for the 6-cell OTP input with active lavender border, error state, paste/autofill support, and tap-to-focus.
- Update `src/app/(auth)/sign-up.tsx` to match the attached design (`Full name`, `Email address`, `Password`, `Create account`, `or` divider, `Continue with Google`, `Continue with Apple`, `Sign in` link) and route to `/verify` with email/name params on valid submit.
- Create `src/app/(auth)/verify.tsx` with 6-digit `OtpInput`, 30s resend countdown, validation, and transition to `/home`.
- Update `src/app/(auth)/sign-in.tsx` with stacked inputs, `"Forgot password?"` action, `Sign in`, `or` divider, Google/Apple buttons, and `Sign up` link.

Done when all three auth screens validate inputs, show inline feedback, and navigate cleanly between each other.

### 4. Add mocked signed-in `/home` screen
- Create `src/app/home.tsx` showing the signed-in user's name/email/provider, a link to `/design-system`, and a `"Sign out"` button that clears the mocked session and returns to `/`.

Done when completing Sign Up → Verify, Sign In, or Google/Apple auth lands on `/home` and Sign Out returns to `/`.

## Verification
1. `npx tsc --noEmit` — passes with 0 errors.
2. `npx expo lint` — passes with 0 errors.
3. Em-dash & design-system token audit across `src/` (excluding `src/theme/`): 0 em/en dashes, 0 hardcoded hex colors, 0 raw `fontSize:` literals, 0 legacy shadows/elevation, 0 `TouchableOpacity` usages.
4. Metro export check (`npx expo export --platform web` and `--platform ios --no-bytecode` to temp dir) confirming `(auth)/sign-up`, `(auth)/verify`, `(auth)/sign-in`, and `home` bundle cleanly.
5. Report device/iOS Simulator checks explicitly if unavailable on Windows.

## AGENTS.md updates
Update `## Who owns what` (`**Auth:**`) if needed to note `(auth)/verify` alongside `sign-in.tsx` and `sign-up.tsx`.

## Result
Implemented Sign Up (`src/app/(auth)/sign-up.tsx`), Email Verification (`src/app/(auth)/verify.tsx`), Sign In (`src/app/(auth)/sign-in.tsx`), and mocked Home (`src/app/home.tsx`) connected via `MockAuthProvider` (`src/components/auth/mock-auth-context.tsx`), `AuthScreenShell`, `SocialAuthSection`, and `OtpInput`. Extended `global.css` / `AppText` (`type-brand`), `Input` (`variant="stacked"`), and `AppleIcon`. `npx tsc --noEmit`, `npx expo lint`, the em-dash and design-system token grep audits, and both Metro web and iOS (`--no-bytecode`) exports passed. iOS Simulator visual comparison could not run on Windows.
