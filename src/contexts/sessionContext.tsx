import React, { createContext, useContext, useMemo, useState, ReactNode, useEffect, useRef } from 'react';

export interface SessionState {
  loggedIn: boolean;
  sessionExpiry: number | null; // epoch ms
  sessionId: string | null;
}

interface SessionContextType extends SessionState {
  login: (durationMs?: number, sessionId?: string | null) => void;
  logout: () => void;
  setSession: (state: SessionState) => void;
}

const DEFAULT_SESSION: SessionState = {
  loggedIn: false,
  sessionExpiry: null,
  sessionId: null,
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);
const thirtyYears = 30 * 365 * 24 * 60 * 60 * 1000;
export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<SessionState>(DEFAULT_SESSION);
  const timeoutRef = useRef<number | null>(null);

  // Auto-logout effect: schedule logout when sessionExpiry is set, cancel when cleared/changed
  useEffect(() => {
    // clear previous timer
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const expiry = session.sessionExpiry;
    if (!expiry) return; // nothing to schedule

    const ms = expiry - Date.now();
    if (ms <= 0) {
      // already expired — logout synchronously
      setSessionState({ loggedIn: false, sessionExpiry: null, sessionId: null });
      return;
    }

    // schedule logout
    timeoutRef.current = window.setTimeout(() => {
      setSessionState({ loggedIn: false, sessionExpiry: null, sessionId: null });
      timeoutRef.current = null;
    }, ms);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [session.sessionExpiry]);

  const login = (durationMs = 30 * 60 * 1000, sessionId: string | null = null) => {
    const expiry = durationMs > thirtyYears ? durationMs : Date.now() + durationMs;
    setSessionState({ loggedIn: true, sessionExpiry: expiry, sessionId });
  };

  const logout = () => setSessionState({ loggedIn: false, sessionExpiry: null, sessionId: null });

  const setSession = (state: SessionState) => setSessionState(state);

  const value = useMemo(
    () => ({ ...session, login, logout, setSession }),
    [session]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a SessionProvider');
  return ctx;
}

export default SessionContext;
