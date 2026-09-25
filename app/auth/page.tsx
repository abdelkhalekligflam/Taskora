"use client"

import { FormEvent, useState } from "react"
import { CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [showPassword, setShowPassword] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setError(null)
    setSuccess(null)
    setLoading(true)

    const supabase = createClient()

    // SIGN IN
    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      window.location.href = "/dashboard"
      return
    }

    // CREATE ACCOUNT
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(
      "Account created. Check your email if confirmation is required."
    )

    setLoading(false)
  }

  const handleForgotPassword = async () => {
    setError(null)
    setSuccess(null)

    if (!email.trim()) {
      setError("Enter your email address first.")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/reset-password`
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo })

    if (error) setError(error.message)
    else setSuccess("Password reset link sent. Check your email.")
    setLoading(false)
  }

  const changeMode = (newMode: "signin" | "signup") => {
    setMode(newMode)
    setError(null)
    setSuccess(null)
  }

  return (
    <main className="min-h-screen bg-white lg:grid lg:grid-cols-2">
      {/* LEFT PANEL */}
      <section className="hidden min-h-screen bg-[#111113] text-white lg:flex">
        <div className="flex w-full flex-col p-10 xl:p-14">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Taskora
              </h2>

              <p className="mt-1 text-xs text-white/40">
                Hyper-Velocity Workspace
              </p>
            </div>

            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white/50">
              Desktop v2.4
            </span>
          </div>

          {/* PRODUCT VALUE — no fabricated session data */}
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-[520px]">
              <div className="mb-6">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">Focused productivity</p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight">Plan clearly. Execute with focus.</h3>
                <p className="mt-3 max-w-md text-sm leading-6 text-white/45">Your tasks, schedule, goals and analytics stay connected in one private workspace.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ["Tasks & planning", "Organize daily work and scheduled priorities."],
                  ["Goals", "Track measurable progress without duplicate data."],
                  ["Calendar", "See scheduled tasks across your month."],
                  ["Analytics", "Review metrics calculated from your own activity."],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#4143D5]/20 text-[#9B9DFF]">
                      {title === "Analytics" ? <Sparkles className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                    </div>
                    <p className="mt-4 text-sm font-semibold">{title}</p>
                    <p className="mt-2 text-xs leading-5 text-white/40">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="flex min-h-screen items-center justify-center bg-white p-6">
        <div className="w-full max-w-[440px]">
          {/* SECURITY */}
          <div className="mb-8 flex items-center gap-2 text-xs font-medium text-neutral-400">
            <LockKeyhole className="h-3.5 w-3.5" />
            <span>End-to-End Encrypted</span>
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
            {mode === "signin"
              ? "Welcome back"
              : "Create your account"}
          </h1>

          <p className="mt-2 text-sm text-neutral-500">
            {mode === "signin"
              ? "Sign in to your Taskora workspace."
              : "Start building your focused workspace."}
          </p>

          {/* TABS */}
          <div className="mt-8 grid grid-cols-2 border-b border-neutral-200">
            <button
              type="button"
              onClick={() => changeMode("signin")}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                mode === "signin"
                  ? "text-neutral-950"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              Sign in

              {mode === "signin" && (
                <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-[#4143D5]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => changeMode("signup")}
              className={`relative pb-3 text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "text-neutral-950"
                  : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              Create account

              {mode === "signup" && (
                <span className="absolute bottom-[-1px] left-0 h-[2px] w-full bg-[#4143D5]" />
              )}
            </button>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-neutral-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#4143D5] focus:ring-2 focus:ring-[#4143D5]/10"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-neutral-700"
                >
                  Password
                </label>

                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => void handleForgotPassword()}
                    disabled={loading}
                    className="text-xs font-medium text-[#4143D5] hover:underline disabled:opacity-50"
                  >
                    Forgot password?
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder={
                    mode === "signin"
                      ? "Enter your password"
                      : "Create a password"
                  }
                  required
                  minLength={6}
                  autoComplete={
                    mode === "signin"
                      ? "current-password"
                      : "new-password"
                  }
                  className="h-11 w-full rounded-lg border border-neutral-200 bg-white px-3.5 pr-11 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-[#4143D5] focus:ring-2 focus:ring-[#4143D5]/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition hover:text-neutral-700"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#4143D5] text-sm font-semibold text-white transition hover:bg-[#3638bd] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}

              {mode === "signin"
                ? loading
                  ? "Signing in..."
                  : "Sign in to Taskora"
                : loading
                  ? "Creating account..."
                  : "Create Taskora account"}
            </button>
          </form>
        </div>
      </section>
    </main>
  )
}