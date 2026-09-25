"use client"

import { FormEvent, useState } from "react"
import {
  Activity,
  Eye,
  EyeOff,
  Headphones,
  Loader2,
  LockKeyhole,
} from "lucide-react"
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

          {/* FOCUS ENGINE */}
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-[520px]">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/40">
                    Deep Focus Engine
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                    Stay in the flow.
                  </h3>
                </div>

                <Activity className="h-5 w-5 text-white/40" />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl shadow-black/20">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-white/35">
                      Current session
                    </p>

                    <p className="mt-3 text-6xl font-semibold tracking-[-0.05em]">
                      18:39
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-white/35">
                      Velocity
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                      87%
                    </p>
                  </div>
                </div>

                {/* PROGRESS */}
                <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[72%] rounded-full bg-[#7C7CFF]" />
                </div>

                {/* AUDIO */}
                <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                      <Headphones className="h-4 w-4 text-white/60" />
                    </div>

                    <div>
                      <p className="text-sm font-medium">
                        Binaural 40Hz Flow
                      </p>

                      <p className="mt-0.5 text-xs text-white/35">
                        Focus audio active
                      </p>
                    </div>
                  </div>

                  <span className="flex items-center gap-2 text-xs text-white/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Active
                  </span>
                </div>
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
                    className="text-xs font-medium text-[#4143D5] hover:underline"
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

            {/* REMEMBER */}
            {mode === "signin" && (
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-500">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-neutral-300 accent-[#4143D5]"
                />

                Remember this device for 30 days
              </label>
            )}

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