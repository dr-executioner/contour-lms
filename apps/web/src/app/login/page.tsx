"use client";
import { useEffect, useState } from "react";
import { colors } from "../../constants/colors";
import { AuthFooter } from "../../../../../packages/ui/src/authFooter";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const { supabase, dispatch, state } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Auto-redirect if already logged in
    if (state.user) {
      router.replace("/dashboard");
    }
  }, [state.user, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(undefined);
    dispatch({ type: "LOADING" });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
    } else if (data.session && data.user) {
      dispatch({
        type: "LOGIN",
        payload: { user: data.user, session: data.session },
      });
      router.replace("/dashboard");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        background: `linear-gradient(135deg, ${colors.dark.bg} 0%, #0f0f23 50%, ${colors.dark.surface} 100%)`,
      }}
    >
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{
            background: `linear-gradient(45deg, ${colors.primary[500]}, ${colors.accent.purple})`,
          }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{
            background: `linear-gradient(45deg, ${colors.accent.pink}, ${colors.primary[600]})`,
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md">
        <div
          className="backdrop-blur-xl rounded-2xl p-8 shadow-2xl border"
          style={{
            backgroundColor: `${colors.dark.surface}cc`,
            borderColor: colors.dark.border,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px ${colors.dark.border}33`,
          }}
        >
          {/* Login form */}
          {!state.user && (
            <>
              <div className="text-center mb-8">
                <div
                  className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.accent.purple})`,
                  }}
                >
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold mb-2" style={{ color: colors.dark.text }}>
                  Welcome Back
                </h1>
                <p className="text-sm" style={{ color: colors.dark.textMuted }}>
                  Sign in to continue to your account
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.dark.text }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none text-white placeholder:text-gray-500"
                    style={{
                      backgroundColor: colors.dark.bg,
                      borderColor: colors.dark.border,
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                    style={{ color: colors.dark.text }}
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none text-white placeholder:text-gray-500"
                    style={{
                      backgroundColor: colors.dark.bg,
                      borderColor: colors.dark.border,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  style={{
                    background: email.trim()
                      ? `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`
                      : colors.dark.border,
                  }}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              {/* Error */}
              {error && (
                <div
                  className="mt-6 p-4 rounded-xl border"
                  style={{
                    backgroundColor: `${colors.error}15`,
                    borderColor: `${colors.error}40`,
                  }}
                >
                  <h3 className="font-medium" style={{ color: colors.error }}>
                    Authentication Failed
                  </h3>
                  <p className="text-sm mt-1" style={{ color: colors.dark.textMuted }}>
                    {error}
                  </p>
                </div>
              )}
            </>
          )}

          <AuthFooter
            bottomText={
              <>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-indigo-300 hover:text-white font-medium">
                  Register
                </Link>
              </>
            }
          />
        </div>
      </div>
    </div>
  );
}

