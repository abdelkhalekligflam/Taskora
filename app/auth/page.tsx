import Image from "next/image"
"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function AuthPage() {
  const router = useRouter()
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

      router.replace("/dashboard")
      router.refresh()
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
    <main className="min-h-screen bg-[#f7f7f8] text-neutral-950">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_.95fr]">
        <section className="relative hidden overflow-hidden bg-[#0b0b0d] p-10 text-white lg:flex xl:p-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(99,102,241,.22),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(99,102,241,.12),transparent_30%)]" />
          <div className="absolute inset-0 opacity-[.08] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="relative z-10 flex w-full flex-col">
            <Link href="/" className="inline-flex w-fit items-center gap-3">
              <Image src="/taskora-logo.svg" alt="" width={40} height={40} className="h-10 w-10 object-contain" />
              <span className="text-lg font-semibold tracking-[-.03em]">Taskora</span>
            </Link>

            <div className="my-auto max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.05] px-3 py-1.5 text-[11px] font-medium text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Your private productivity workspace
              </div>
              <h2 className="mt-7 text-5xl font-semibold leading-[1.05] tracking-[-.055em] xl:text-6xl">
                Turn your plans into <span className="text-[#a5a6ff]">progress.</span>
              </h2>
              <p className="mt-6 max-w-lg text-[15px] leading-7 text-white/50">Tasks, goals, focus sessions and insights in one calm workspace built to keep your day moving.</p>
              <div className="mt-10 grid max-w-lg grid-cols-2 gap-3">
                {[["Daily planning","Keep priorities clear."],["Goals","Track measurable progress."],["Focus","Protect deep-work time."],["Insights","See how your work evolves."]].map(([title,text])=>
                  <div key={title} className="rounded-2xl border border-white/[.08] bg-white/[.035] p-4 backdrop-blur">
                    <CheckCircle2 className="h-4 w-4 text-[#8b8dff]" />
                    <p className="mt-3 text-sm font-medium">{title}</p><p className="mt-1 text-xs text-white/35">{text}</p>
                  </div>
                )}
              </div>
            </div>
            <p className="text-xs text-white/25">© {new Date().getFullYear()} Taskora</p>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="absolute left-5 top-5 lg:hidden"><Link href="/" className="flex items-center gap-2 font-semibold"><Image src="/taskora-logo.svg" alt="" width={32} height={32} className="h-8 w-8 object-contain" />Taskora</Link></div>
          <div className="w-full max-w-[420px]">
            <div className="mb-8">
              <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white shadow-sm"><LockKeyhole className="h-[18px] w-[18px] text-[#4143D5]"/></div>
              <p className="text-[11px] font-semibold uppercase tracking-[.16em] text-[#4143D5]">{mode === "signin" ? "Welcome back" : "Get started"}</p>
              <h1 className="mt-2 text-[34px] font-semibold tracking-[-.045em]">{mode === "signin" ? "Sign in to Taskora" : "Create your account"}</h1>
              <p className="mt-2 text-sm leading-6 text-neutral-500">{mode === "signin" ? "Continue to your personal productivity workspace." : "Create your workspace and start organizing your day."}</p>
            </div>

            <div className="mb-6 grid grid-cols-2 rounded-xl border border-neutral-200 bg-neutral-100/70 p-1">
              <button type="button" onClick={() => changeMode("signin")} className={`h-9 rounded-lg text-sm font-medium transition ${mode==="signin"?"bg-white text-neutral-950 shadow-sm":"text-neutral-500 hover:text-neutral-800"}`}>Sign in</button>
              <button type="button" onClick={() => changeMode("signup")} className={`h-9 rounded-lg text-sm font-medium transition ${mode==="signup"?"bg-white text-neutral-950 shadow-sm":"text-neutral-500 hover:text-neutral-800"}`}>Create account</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div><label htmlFor="email" className="mb-2 block text-xs font-medium text-neutral-700">Email address</label><input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="name@company.com" required autoComplete="email" className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-sm text-neutral-950 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-[#6869e8] focus:ring-4 focus:ring-[#4143D5]/10"/></div>
              <div>
                <div className="mb-2 flex items-center justify-between"><label htmlFor="password" className="text-xs font-medium text-neutral-700">Password</label>{mode==="signin"&&<button type="button" onClick={()=>void handleForgotPassword()} disabled={loading} className="text-xs font-medium text-[#4143D5] hover:text-[#3032aa] disabled:opacity-50">Forgot password?</button>}</div>
                <div className="relative"><input id="password" type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder={mode==="signin"?"Enter your password":"At least 8 characters"} required minLength={8} autoComplete={mode==="signin"?"current-password":"new-password"} className="h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 pr-11 text-sm text-neutral-950 shadow-sm outline-none transition placeholder:text-neutral-400 focus:border-[#6869e8] focus:ring-4 focus:ring-[#4143D5]/10"/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700" aria-label={showPassword?"Hide password":"Show password"}>{showPassword?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div>
                {mode==="signup"&&<p className="mt-2 text-[11px] text-neutral-400">Use 8 or more characters.</p>}
              </div>
              {error&&<div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs leading-5 text-red-700">{error}</div>}
              {success&&<div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-3 text-xs leading-5 text-emerald-700">{success}</div>}
              <button type="submit" disabled={loading} className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#4143D5] text-sm font-semibold text-white shadow-[0_8px_24px_rgba(65,67,213,.22)] transition hover:bg-[#3739bd] disabled:cursor-not-allowed disabled:opacity-60">{loading&&<Loader2 className="h-4 w-4 animate-spin"/>}{mode==="signin"?(loading?"Signing in...":"Sign in"):(loading?"Creating account...":"Create account")}</button>
            </form>

            <div className="mt-7 flex items-center justify-center gap-2 text-xs text-neutral-400"><LockKeyhole className="h-3.5 w-3.5"/><span>Secure authentication powered by Supabase</span></div>
          </div>
        </section>
      </div>
    </main>
  )
}
