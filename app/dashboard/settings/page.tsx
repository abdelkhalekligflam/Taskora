"use client"

import { FormEvent, useEffect, useState } from "react"
import { Bell, Check, Globe2, Loader2, Palette, Save, Sparkles, UserRound } from "lucide-react"

import { createClient } from "@/lib/supabase/client"

type Profile = {
  full_name: string | null
  language: "en" | "fr" | "ar"
  timezone: string
  theme: "light" | "dark" | "system"
  notifications_enabled: boolean
  email_notifications: boolean
  plan: "free" | "pro"
}

const defaults: Profile = {
  full_name: "",
  language: "en",
  timezone: "Africa/Casablanca",
  theme: "system",
  notifications_enabled: true,
  email_notifications: true,
  plan: "free",
}

const supabase = createClient()

function applyTheme(theme: Profile["theme"]) {
  const root = document.documentElement
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  root.classList.toggle("dark", theme === "dark" || (theme === "system" && prefersDark))
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>(defaults)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("Your session could not be verified.")
        setLoading(false)
        return
      }

      setEmail(user.email ?? "")
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle()

      if (error) setError(error.message)
      else if (data) {
        const loadedProfile = data as Profile
        setProfile(loadedProfile)
        applyTheme(loadedProfile.theme)
      }
      else {
        const initial = { ...defaults, full_name: String(user.user_metadata?.full_name ?? "") }
        const { error: insertError } = await supabase.from("profiles").insert({ user_id: user.id, ...initial })
        if (insertError) setError(insertError.message)
        else {
          setProfile(initial)
          applyTheme(initial.theme)
        }
      }
      setLoading(false)
    }
    void load()
  }, [])

  useEffect(() => {
    applyTheme(profile.theme)
  }, [profile.theme])

  useEffect(() => {
    if (profile.theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const sync = () => applyTheme("system")
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [profile.theme])

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError("Your session could not be verified.")
      setSaving(false)
      return
    }

    const { error } = await supabase.from("profiles").update(profile).eq("user_id", user.id)
    if (error) setError(error.message)
    else {
      setSaved(true)
      window.dispatchEvent(new Event("taskora-preferences-updated"))
      window.setTimeout(() => setSaved(false), 2500)
    }
    setSaving(false)
  }

  if (loading) {
    return <div className="flex min-h-[70vh] items-center justify-center text-sm text-neutral-400"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Loading settings...</div>
  }

  return (
    <form onSubmit={saveSettings} className="settings-page min-h-screen px-8 py-8 lg:px-10">
      <div className="mx-auto max-w-[1200px]">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#4143D5]">Settings</p>
            <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-neutral-950">Workspace Preferences</h1>
            <p className="mt-1 text-sm text-neutral-500">Manage your Taskora profile and personal preferences.</p>
          </div>
          <button disabled={saving} className="flex h-10 items-center gap-2 rounded-lg bg-[#4143D5] px-4 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Saved" : "Save changes"}
          </button>
        </section>

        {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <Card icon={<UserRound />} title="Profile" description="Your personal Taskora identity.">
            <div className="flex items-center gap-4 rounded-xl bg-neutral-50 p-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEEEFF] text-lg font-bold text-[#4143D5]">
                {(profile.full_name || email || "T").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0"><p className="truncate text-sm font-semibold text-neutral-900">{profile.full_name || "Taskora User"}</p><p className="truncate text-xs text-neutral-400">{email}</p></div>
            </div>
            <Field label="Full name"><input value={profile.full_name ?? ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} className="settings-input" placeholder="Your name" /></Field>
            <Field label="Email"><input value={email} disabled className="settings-input opacity-60" /></Field>
          </Card>

          <div className="rounded-2xl bg-gradient-to-br from-[#4143D5] to-[#30329E] p-6 text-white shadow-sm">
            <div className="flex items-start justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Sparkles className="h-5 w-5" /></div><span className="rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider">{profile.plan === "pro" ? "Active" : "Free Plan"}</span></div>
            <h2 className="mt-8 text-2xl font-semibold">{profile.plan === "pro" ? "Pro Plan" : "Taskora Free"}</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-white/70">{profile.plan === "pro" ? "Advanced analytics, unlimited spaces and priority support are active." : "Core productivity features are active. Pro subscription will be available in a later billing phase."}</p>
            <button type="button" disabled className="mt-6 h-9 rounded-lg bg-white px-4 text-xs font-semibold text-[#4143D5] opacity-80">{profile.plan === "pro" ? "Manage subscription" : "Upgrade to Pro"}</button>
          </div>

          <Card icon={<Palette />} title="Appearance" description="Choose how Taskora should look.">
            <div className="grid grid-cols-3 gap-2">
              {(["light", "dark", "system"] as const).map((theme) => (
                <button key={theme} type="button" onClick={() => setProfile({ ...profile, theme })} className={`rounded-xl border p-4 text-left transition ${profile.theme === theme ? "border-[#4143D5] bg-[#EEEEFF]" : "border-neutral-200 bg-neutral-50"}`}>
                  <div className={`h-10 rounded-lg border ${theme === "dark" ? "border-neutral-700 bg-neutral-900" : theme === "system" ? "bg-gradient-to-r from-white to-neutral-900" : "bg-white"}`} />
                  <p className="mt-2 text-xs font-semibold capitalize text-neutral-700">{theme}</p>
                </button>
              ))}
            </div>
            <p className="text-[11px] leading-5 text-neutral-400">Theme changes are applied instantly and saved to your Taskora profile.</p>
          </Card>

          <Card icon={<Globe2 />} title="Language & Region" description="Set your preferred language and timezone.">
            <Field label="Language">
              <select value={profile.language} onChange={(e) => setProfile({ ...profile, language: e.target.value as Profile["language"] })} className="settings-input">
                <option value="en">English</option><option value="fr">Français</option><option value="ar">Darija / Arabic</option>
              </select>
            </Field>
            <Field label="Timezone">
              <select value={profile.timezone} onChange={(e) => setProfile({ ...profile, timezone: e.target.value })} className="settings-input">
                <option value="Africa/Casablanca">Morocco — Casablanca</option>
                <option value="Europe/Paris">Europe — Paris</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America — New York</option>
              </select>
            </Field>
            <p className="text-[11px] leading-5 text-neutral-400">Language changes are saved to your profile and applied across the Taskora workspace.</p>
          </Card>

          <Card icon={<Bell />} title="Notifications" description="Control reminders and product updates.">
            <Toggle label="In-app notifications" detail="Task reminders and important workspace alerts." checked={profile.notifications_enabled} onChange={(value) => setProfile({ ...profile, notifications_enabled: value })} />
            <Toggle label="Email notifications" detail="Receive important Taskora updates by email." checked={profile.email_notifications} onChange={(value) => setProfile({ ...profile, email_notifications: value })} />
          </Card>

          <Card icon={<Sparkles />} title="Subscription" description="Your current Taskora access level.">
            <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-4"><div><p className="text-sm font-semibold text-neutral-900 capitalize">{profile.plan} plan</p><p className="mt-1 text-xs text-neutral-400">{profile.plan === "free" ? "Core Taskora workspace features." : "All Taskora Pro capabilities."}</p></div><span className="rounded-full bg-[#EEEEFF] px-3 py-1 text-[10px] font-bold uppercase text-[#4143D5]">{profile.plan}</span></div>
            <p className="text-[11px] leading-5 text-neutral-400">Billing is not enabled yet, so this page never charges or changes your plan.</p>
          </Card>
        </div>
      </div>
      <style jsx global>{`
        .settings-page{background:#f9f9fd;color:#171717}
        .settings-input{height:40px;width:100%;border-radius:8px;border:1px solid #e5e5e5;background:#fafafa;padding:0 12px;font-size:13px;outline:none;color:#171717}
        .settings-input:focus{border-color:#4143d5;background:white;box-shadow:0 0 0 2px rgba(65,67,213,.1)}
        .dark .settings-page{background:#111318;color:#f5f5f5}
        .dark .settings-page .bg-white{background-color:#1c1f26}
        .dark .settings-page .bg-neutral-50{background-color:#252830}
        .dark .settings-page .border-neutral-200,.dark .settings-page .border-neutral-100{border-color:#343842}
        .dark .settings-page .text-neutral-950,.dark .settings-page .text-neutral-900,.dark .settings-page .text-neutral-800,.dark .settings-page .text-neutral-700{color:#f5f5f5}
        .dark .settings-page .text-neutral-500,.dark .settings-page .text-neutral-400{color:#a8adb7}
        .dark .settings-input{border-color:#343842;background:#252830;color:#f5f5f5}
        .dark .settings-input:focus{border-color:#6d6ff2;background:#1c1f26}
      `}</style>
    </form>
  )
}

function Card({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-neutral-200 bg-white p-6"><div className="flex items-start gap-3 border-b border-neutral-100 pb-4"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EEEEFF] text-[#4143D5] [&>svg]:h-4 [&>svg]:w-4">{icon}</div><div><h2 className="text-base font-semibold text-neutral-950">{title}</h2><p className="mt-0.5 text-xs text-neutral-400">{description}</p></div></div><div className="mt-5 space-y-4">{children}</div></section>
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{label}</span>{children}</label>
}

function Toggle({ label, detail, checked, onChange }: { label: string; detail: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <div className="flex items-center justify-between gap-4 rounded-xl bg-neutral-50 p-4"><div><p className="text-xs font-semibold text-neutral-800">{label}</p><p className="mt-1 text-[10px] text-neutral-400">{detail}</p></div><button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[#4143D5]" : "bg-neutral-300"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${checked ? "left-6" : "left-1"}`} /></button></div>
}
