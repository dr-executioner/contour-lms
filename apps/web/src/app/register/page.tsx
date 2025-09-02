"use client"

import { useRouter } from "next/navigation";
import { colors } from "../../constants/colors";
import { FormEvent, useState } from "react"
import { useAuth } from "../../context/AuthContext";
import { InputField } from "../../../../../packages/ui/src/inputField"
import { AuthFooter } from "../../../../../packages/ui/src/authFooter"
import Link from "next/link";



export default function RegisterPage(): JSX.Element {
  const router = useRouter();
const { supabase} = useAuth()
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const minPasswordLength = 6;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim() || !password) {
      setErrorMsg("Email and password are required.");
      return;
    }

    if (password.length < minPasswordLength) {
      setErrorMsg(`Password must be at least ${minPasswordLength} characters.`);
      return;
    }

    if (password !== confirm) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      // Sign up via Supabase (v2 client)
      // Options.data is a safe place to store profile attributes like full_name
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName ? fullName.trim() : undefined,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message || "Could not register. Try again.");
        return;
      }

      // If your Supabase project is configured to auto-confirm and return a session,
      // data.session will be present and you can redirect immediately.
      // Otherwise, show a clear message asking the user to check their email.
      // Both flows are handled here.
      if ((data as any)?.session) {
        // user is signed in immediately
        setSuccessMsg("Registered — redirecting to dashboard...");
        // small delay so the user sees the success state
        setTimeout(() => {
          router.push("/dashboard");
        }, 700);
      } else {
        // email confirmation flow (most common default)
        setSuccessMsg(
          "Registration successful. Check your email for a confirmation link to complete sign up."
        );
      }
    } catch (err: any) {
      console.error("signUp err", err);
      setErrorMsg(err?.message ?? "Unexpected error during registration");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        background: `linear-gradient(135deg, ${colors.dark.bg} 0%, #0f0f23 40%, ${colors.dark.surface} 100%)`,
      }}
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: `linear-gradient(45deg, ${colors.primary[500]}, ${colors.accent.purple})` }}
        />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: `linear-gradient(45deg, ${colors.accent.pink}, ${colors.primary[600]})` }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Glass card */}
        <div
          className="backdrop-blur-xl rounded-2xl p-8 shadow-2xl border"
          style={{
            backgroundColor: `${colors.dark.surface}cc`,
            borderColor: colors.dark.border,
            boxShadow: `0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px ${colors.dark.border}33`,
          }}
        >
          {/* header */}
          <div className="text-center mb-6">
            <div
              className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.accent.purple})` }}
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: colors.dark.text }}>
              Create account
            </h1>
            <p className="text-sm" style={{ color: colors.dark.textMuted }}>
              Start your student journey — secure, private, and quick.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <InputField
              id="fullName"
              label="Full name (optional)"
              value={fullName}
              placeholder="Jane Doe"
              onChange={setFullName}
            />

            <InputField
              id="email"
              label="Email"
              type="email"
              value={email}
              placeholder="you@example.com"
              onChange={setEmail}
              autoComplete="email"
              required
            />

            <InputField
              id="password"
              label="Password"
              type="password"
              value={password}
              placeholder="Choose a secure password"
              onChange={setPassword}
              autoComplete="new-password"
              required
            />

            <InputField
              id="confirm"
              label="Confirm password"
              type="password"
              value={confirm}
              placeholder="Re-type your password"
              onChange={setConfirm}
              autoComplete="new-password"
              required
            />

            {errorMsg && (
              <div className="mt-2 rounded-md p-3 text-sm" style={{ backgroundColor: `${colors.error}15`, borderLeft: `4px solid ${colors.error}` }}>
                <strong className="block" style={{ color: colors.error }}>{errorMsg}</strong>
              </div>
            )}


 {successMsg && (
            <div 
              className="mt-6 p-4 rounded-xl border animate-fadeIn"
              style={{ 
                backgroundColor: `${colors.success}15`,
                borderColor: `${colors.success}40`,
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm mt-1" style={{ color: colors.dark.textMuted }}>
                      {successMsg}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}



            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary[500]}, ${colors.primary[600]})`,
                  boxShadow: `0 10px 25px -5px ${colors.primary[500]}40`,
                }}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </div>
          </form>

          <AuthFooter bottomText={<>Already have an account? <Link href="/login" className="text-indigo-300 hover:text-white font-medium">Sign in</Link></>}/>
        </div>

        {/* floating decorative dots */}
        <div className="absolute -z-10 top-4 left-4 w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.accent.purple }} />
        <div className="absolute -z-10 bottom-8 right-8 w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: colors.primary[400] }} />
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
.animate-fadeIn{
animation : fadeIn 0.3s ease-in-out	
}
      `}</style>
    </div>
  );
}
