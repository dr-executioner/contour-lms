"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  Dispatch,
  useEffect,
  useCallback,
} from "react";
import {
  createClient,
  SupabaseClient,
  Session,
  User,
} from "@supabase/supabase-js";

let supabase: SupabaseClient;

function getSupabaseClient() {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabase;
}

type AuthState = {
  user: User | null;
  session: Session | null;
  loading: boolean;
};

type AuthAction =
  | { type: "LOGIN"; payload: { user: User; session: Session } }
  | { type: "LOGOUT" }
  | { type: "LOADING" };

type AuthContextType = {
  state: AuthState;
  dispatch: Dispatch<AuthAction>;
  supabase: SupabaseClient;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const initialState: AuthState = {
  user: null,
  session: null,
  loading: true,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload.user,
        session: action.payload.session,
        loading: false,
      };
    case "LOGOUT":
      return { ...state, user: null, session: null, loading: false };
    case "LOADING":
      return { ...state, loading: true };
    default:
      return state;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const supabase = getSupabaseClient();

  // Check for active session on mount
  useEffect(() => {
    const init = async () => {
      dispatch({ type: "LOADING" });
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        dispatch({ type: "LOGIN", payload: { user: session.user, session } });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    };
    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch({ type: "LOGIN", payload: { user: session.user, session } });
      } else {
        dispatch({ type: "LOGOUT" });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      dispatch({ type: "LOADING" });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      if (data.session && data.user) {
        dispatch({
          type: "LOGIN",
          payload: { user: data.user, session: data.session },
        });
      }
    },
    [supabase]
  );

  const signUp = useCallback(
    async (email: string, password: string) => {
      dispatch({ type: "LOADING" });
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      if (data.session && data.user) {
        dispatch({
          type: "LOGIN",
          payload: { user: data.user, session: data.session },
        });
      }
    },
    [supabase]
  );

  const signOut = useCallback(async () => {
    dispatch({ type: "LOADING" });
    await supabase.auth.signOut();
    dispatch({ type: "LOGOUT" });
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{ state, dispatch, supabase, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

