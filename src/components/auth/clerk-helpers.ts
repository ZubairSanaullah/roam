import { isClerkAPIResponseError, type useSSO } from "@clerk/expo";
import type { Href } from "expo-router";

/**
 * Splits a single full-name string into Clerk's optional first and last name fields.
 */
export function splitFullName(fullName: string): {
  firstName?: string;
  lastName?: string;
} {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return {};
  }
  const [firstName, ...rest] = parts;
  return {
    firstName,
    lastName: rest.length > 0 ? rest.join(" ") : undefined,
  };
}

/**
 * Extracts a user-friendly message from a Clerk API or hook error.
 */
export function formatClerkError(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!error) return fallback;

  if (isClerkAPIResponseError(error)) {
    const first = error.errors[0];
    return first?.longMessage || first?.message || error.message || fallback;
  }

  if (typeof error === "object" && error !== null) {
    const candidate = error as {
      longMessage?: string;
      message?: string;
      errors?: { longMessage?: string; message?: string }[];
    };
    if (Array.isArray(candidate.errors) && candidate.errors[0]) {
      return candidate.errors[0].longMessage || candidate.errors[0].message || fallback;
    }
    if (candidate.longMessage || candidate.message) {
      return candidate.longMessage || candidate.message || fallback;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

/**
 * Shared post-authentication navigation handler for Clerk `finalize({ navigate })`.
 */
export function navigateAfterClerkAuth(
  router: { replace: (href: Href) => void },
  params: {
    session?: { currentTask?: unknown } | null;
    decorateUrl: (url: string) => string;
  },
) {
  if (params.session?.currentTask) {
    return;
  }
  const url = params.decorateUrl("/home");
  if (url.startsWith("http") && typeof window !== "undefined") {
    window.location.href = url;
    return;
  }
  router.replace(url as Href);
}

/**
 * Runs Clerk browser SSO for Google or Apple and handles session activation or
 * multi-step verification redirects without surfacing errors on user cancel.
 */
export async function runClerkSSOFlow(
  startSSOFlow: ReturnType<typeof useSSO>["startSSOFlow"],
  strategy: "oauth_google" | "oauth_apple",
  router: { replace: (href: Href) => void; push: (href: Href) => void },
): Promise<string | null> {
  const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({ strategy });

  if (createdSessionId && setActive) {
    await setActive({ session: createdSessionId });
    router.replace("/home");
    return null;
  }

  if (signIn?.status === "needs_second_factor") {
    router.push("/verify?mode=sign-in-mfa");
    return null;
  }

  if (signUp?.status === "missing_requirements") {
    return "Additional account details are required to finish signing up.";
  }

  return null;
}
