import { createContext, useContext, useState, type ReactNode } from "react";

export type MockAuthProviderKind = "email" | "google" | "apple";

export interface MockUser {
  name: string;
  email: string;
  provider: MockAuthProviderKind;
}

interface PendingSignUp {
  name: string;
  email: string;
}

interface MockAuthContextValue {
  user: MockUser | null;
  pendingSignUp: PendingSignUp | null;
  beginSignUp: (data: PendingSignUp) => void;
  verifySignUpCode: (code: string) => MockUser;
  signInWithEmail: (email: string) => MockUser;
  signInWithProvider: (provider: "google" | "apple") => MockUser;
  signOut: () => void;
}

const MockAuthContext = createContext<MockAuthContextValue | null>(null);

/**
 * In-memory mocked auth session provider for onboarding and auth screen flows
 * before Clerk is connected.
 */
export function MockAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [pendingSignUp, setPendingSignUp] = useState<PendingSignUp | null>(null);

  const beginSignUp = (data: PendingSignUp) => {
    setPendingSignUp(data);
  };

  const verifySignUpCode = (_code: string): MockUser => {
    const nextUser: MockUser = {
      name: pendingSignUp?.name || "Roam Guest",
      email: pendingSignUp?.email || "guest@roam.app",
      provider: "email",
    };
    setUser(nextUser);
    setPendingSignUp(null);
    return nextUser;
  };

  const signInWithEmail = (email: string): MockUser => {
    const localPart = email.split("@")[0] || "Roam Guest";
    const formattedName = localPart
      .split(/[._-]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    const nextUser: MockUser = {
      name: formattedName || "Roam Guest",
      email,
      provider: "email",
    };
    setUser(nextUser);
    return nextUser;
  };

  const signInWithProvider = (provider: "google" | "apple"): MockUser => {
    const nextUser: MockUser =
      provider === "google"
        ? { name: "Alex Rivera", email: "alex.rivera@gmail.com", provider: "google" }
        : { name: "Alex Rivera", email: "alex.rivera@icloud.com", provider: "apple" };
    setUser(nextUser);
    return nextUser;
  };

  const signOut = () => {
    setUser(null);
    setPendingSignUp(null);
  };

  return (
    <MockAuthContext.Provider
      value={{
        user,
        pendingSignUp,
        beginSignUp,
        verifySignUpCode,
        signInWithEmail,
        signInWithProvider,
        signOut,
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
}

/**
 * Access mocked auth session state and transition helpers.
 */
export function useMockAuth(): MockAuthContextValue {
  const value = useContext(MockAuthContext);
  if (!value) {
    throw new Error("useMockAuth must be used inside MockAuthProvider");
  }
  return value;
}
