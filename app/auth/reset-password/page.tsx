"use client"

import Link from "next/link"
import { FormEvent, useState } from "react"
import { Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else setSuccess(true)
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F9F9FD] p-6">
      <div className="w-full max-w-[440px] rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEEEFF] text-[#4143D5]">
          <LockKeyhole className="h-5 w-5" />
        </div>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-neutral-950">Set a new password</h1>
        <p className="mt-2 text-sm leading-6 text-neutral-500">Choose a new password for your Taskora account.</p>

        {success ? (
          <div className="mt-7">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">Your password has been updated successfully.</div>
            <Link href="/auth" className="mt-5 flex h-11 w-full items-center justify-center rounded-lg bg-[#4143D5] text-sm font-semibold text-white">Back to sign in</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <PasswordField label="New password" value={password} onChange={setPassword} show={showPassword} onToggle={() => setShowPassword((value) => !value)} />
            <PasswordField label="Confirm new password" value={confirmPassword} onChange={setConfirmPassword} show={showPassword} onToggle={() => setShowPassword((value) => !value)} />

            {error && <div className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700">{error}</div>}

            <button type="submit" disabled={loading} className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#4143D5] text-sm font-semibold text-white transition hover:bg-[#3638bd] disabled:opacity-60">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Updating password..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}

function PasswordField({ label, value, onChange, show, onToggle }: { label: string; value: string; onChange: (value: string) => void; show: boolean; onToggle: () => void }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-neutral-700">{label}</label>
      <div className="relative">
        <input type={show ? "text" : "password"} value={value} onChange={(event) => onChange(event.target.value)} required minLength={6} autoComplete="new-password" className="h-11 w-full rounded-lg border border-neutral-200 px-3.5 pr-11 text-sm text-neutral-950 outline-none focus:border-[#4143D5] focus:ring-2 focus:ring-[#4143D5]/10" />
        <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400" aria-label={show ? "Hide password" : "Show password"}>
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}
