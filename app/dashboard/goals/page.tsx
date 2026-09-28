"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { Check, Loader2, Pencil, Plus, Target, Trash2, X } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { usePreferences } from "@/components/providers/preferences-provider"

type Goal = {
  id: string
  title: string
  description: string | null
  target_value: number | null
  current_value: number
  unit: string | null
  status: "active" | "completed" | "paused" | "archived"
  target_date: string | null
  completed_at: string | null
}

const supabase = createClient()

export default function GoalsPage() {
  const { language } = usePreferences()
  const locale = language === "fr" ? "fr-FR" : language === "ar" ? "ar-MA" : "en-US"
  const g = goalLabels[language]
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState<Goal | null>(null)
  const [deleting, setDeleting] = useState<Goal | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [plan, setPlan] = useState<"free" | "pro">("free")

  async function loadGoals() {
    setLoading(true)
    const { data, error } = await supabase
      .from("goals")
      .select("id,title,description,target_value,current_value,unit,status,target_date,completed_at")
      .neq("status", "archived")
      .order("created_at", { ascending: false })

    if (error) setError(error.message)
    else setGoals((data ?? []) as Goal[])
    setLoading(false)
  }

  useEffect(() => {
    void loadGoals()
    void (async () => { const { data: { user } } = await supabase.auth.getUser(); if (user) { const { data } = await supabase.from("profiles").select("plan").eq("user_id", user.id).maybeSingle(); setPlan(data?.plan === "pro" ? "pro" : "free") } })()
  }, [])

  async function saveGoal(event: FormEvent<HTMLFormElement>, goal?: Goal) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    setSaving(true)
    setError(null)

    const payload = {
      title: String(form.get("title") ?? "").trim(),
      description: String(form.get("description") ?? "").trim() || null,
      target_value: Number(form.get("target_value") || 0),
      current_value: Number(form.get("current_value") || 0),
      unit: String(form.get("unit") ?? "").trim() || null,
      target_date: String(form.get("target_date") ?? "") || null,
      status: String(form.get("status") ?? "active") as Goal["status"],
    }

    const completedAt = payload.status === "completed"
      ? goal?.completed_at ?? new Date().toISOString()
      : null

    if (goal) {
      const { error } = await supabase.from("goals").update({ ...payload, completed_at: completedAt }).eq("id", goal.id)
      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    } else {
      if (plan === "free" && goals.filter((item) => item.status !== "archived").length >= 3) {
        setError("Free plan supports up to 3 goals. Upgrade to Pro for unlimited goals.")
        setSaving(false)
        return
      }
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError("Your session could not be verified.")
        setSaving(false)
        return
      }
      const { error } = await supabase.from("goals").insert({ ...payload, completed_at: completedAt, user_id: user.id })
      if (error) {
        setError(error.message)
        setSaving(false)
        return
      }
    }

    setShowCreate(false)
    setEditing(null)
    setSaving(false)
    await loadGoals()
  }

  async function completeGoal(goal: Goal) {
    const completed = goal.status !== "completed"
    const { error } = await supabase.from("goals").update({
      status: completed ? "completed" : "active",
      completed_at: completed ? new Date().toISOString() : null,
      current_value: completed && goal.target_value !== null ? goal.target_value : goal.current_value,
    }).eq("id", goal.id)

    if (error) setError(error.message)
    else await loadGoals()
  }

  async function deleteGoal() {
    if (!deleting) return
    setSaving(true)
    const { error } = await supabase.from("goals").delete().eq("id", deleting.id)
    if (error) setError(error.message)
    else setGoals((items) => items.filter((item) => item.id !== deleting.id))
    setDeleting(null)
    setSaving(false)
  }

  const completed = useMemo(() => goals.filter((goal) => goal.status === "completed").length, [goals])
  const active = goals.filter((goal) => goal.status === "active").length

  return (
    <div className="min-h-screen bg-[#F9F9FD] px-8 py-8 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#4143D5]">{g.goals}</p>
            <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-neutral-950">{g.heading}</h1>
            <p className="mt-1 text-sm text-neutral-500">{g.intro}</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="flex h-10 items-center gap-2 rounded-lg bg-[#4143D5] px-4 text-sm font-semibold text-white">
            <Plus className="h-4 w-4" /> {g.newGoal}
          </button>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label={g.total} value={String(goals.length)} />
          <Stat label={g.active} value={String(active)} />
          <Stat label={g.completed} value={String(completed)} />
        </section>

        {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="border-b border-neutral-100 pb-4">
            <h2 className="text-lg font-semibold text-neutral-950">{g.yourGoals}</h2>
            <p className="mt-1 text-xs text-neutral-400">{g.stored}</p>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center text-sm text-neutral-400"><Loader2 className="mr-2 h-5 w-5 animate-spin" />{g.loading}</div>
          ) : goals.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEEFF] text-[#4143D5]"><Target className="h-5 w-5" /></div>
              <h3 className="mt-4 text-sm font-semibold text-neutral-900">{g.empty}</h3>
              <p className="mt-1 text-xs text-neutral-400">{g.createHint}</p>
              <button onClick={() => setShowCreate(true)} className="mt-4 rounded-lg bg-[#4143D5] px-4 py-2 text-xs font-semibold text-white">{g.createFirst}</button>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {goals.map((goal) => {
                const progress = goal.target_value && goal.target_value > 0
                  ? Math.min(100, Math.round((Number(goal.current_value) / Number(goal.target_value)) * 100))
                  : goal.status === "completed" ? 100 : 0
                return (
                  <article key={goal.id} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEEEFF] text-[#4143D5]"><Target className="h-5 w-5" /></div>
                      <div className="flex gap-1">
                        <button onClick={() => setEditing(goal)} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-white hover:text-[#4143D5]"><Pencil className="h-3.5 w-3.5" /></button>
                        <button onClick={() => setDeleting(goal)} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-600"><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-neutral-900">{goal.title}</h3>
                    {goal.description && <p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-500">{goal.description}</p>}
                    <div className="mt-5 flex items-end justify-between">
                      <div><p className="text-[10px] uppercase tracking-wider text-neutral-400">{g.progress}</p><p className="mt-1 text-xl font-bold text-neutral-950">{progress}%</p></div>
                      <p className="text-xs font-medium text-neutral-500">{goal.current_value}{goal.unit ? ` ${goal.unit}` : ""} / {goal.target_value ?? "—"}{goal.unit ? ` ${goal.unit}` : ""}</p>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200"><div className="h-full rounded-full bg-[#4143D5]" style={{ width: `${progress}%` }} /></div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-[10px] text-neutral-400">{goal.target_date ? `${g.targetLabel}: ${new Date(goal.target_date + "T00:00:00").toLocaleDateString(locale)}` : g.noDeadline}</div>
                      <button onClick={() => void completeGoal(goal)} className={`rounded-lg px-3 py-1.5 text-[10px] font-semibold ${goal.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-white text-[#4143D5]"}`}>
                        {goal.status === "completed" ? g.completed : g.markComplete}
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {(showCreate || editing) && <GoalModal goal={editing} saving={saving} labels={g} onClose={() => { setShowCreate(false); setEditing(null) }} onSubmit={(event) => void saveGoal(event, editing ?? undefined)} />}

      {deleting && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <Trash2 className="h-6 w-6 text-red-600" />
            <h2 className="mt-4 text-lg font-semibold">Delete goal?</h2>
            <p className="mt-2 text-sm text-neutral-500">“{deleting.title}” will be permanently deleted.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setDeleting(null)} className="h-9 rounded-lg border border-neutral-200 px-4 text-xs font-semibold">Cancel</button>
              <button disabled={saving} onClick={() => void deleteGoal()} className="h-9 rounded-lg bg-red-600 px-4 text-xs font-semibold text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function GoalModal({ goal, saving, labels, onClose, onSubmit }: { goal: Goal | null; saving: boolean; labels: typeof goalLabels[keyof typeof goalLabels]; onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-wider text-[#4143D5]">Taskora Goals</p><h2 className="mt-1 text-xl font-semibold">{goal ? labels.editGoal : labels.createGoal}</h2></div><button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100"><X className="h-4 w-4" /></button></div>
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <Field label={labels.titleLabel}><input name="title" required maxLength={200} defaultValue={goal?.title ?? ""} className="goal-input" /></Field>
          <Field label={labels.descriptionLabel}><textarea name="description" rows={3} defaultValue={goal?.description ?? ""} className="goal-input h-auto resize-none py-2.5" /></Field>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label={labels.currentLabel}><input name="current_value" type="number" min="0" step="any" defaultValue={goal?.current_value ?? 0} className="goal-input" /></Field>
            <Field label={labels.targetValueLabel}><input name="target_value" type="number" min="0" step="any" required defaultValue={goal?.target_value ?? ""} className="goal-input" /></Field>
            <Field label={labels.unitLabel}><input name="unit" placeholder="tasks, hours..." defaultValue={goal?.unit ?? ""} className="goal-input" /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={labels.targetDateLabel}><input name="target_date" type="date" defaultValue={goal?.target_date ?? ""} className="goal-input" /></Field>
            <Field label={labels.statusLabel}><select name="status" defaultValue={goal?.status ?? "active"} className="goal-input"><option value="active">Active</option><option value="paused">Paused</option><option value="completed">Completed</option><option value="archived">Archived</option></select></Field>
          </div>
          <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4"><button type="button" onClick={onClose} className="h-9 rounded-lg border border-neutral-200 px-4 text-xs font-semibold">{labels.cancel}</button><button disabled={saving} className="flex h-9 items-center gap-2 rounded-lg bg-[#4143D5] px-4 text-xs font-semibold text-white">{saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />} {goal ? labels.save : labels.createGoal}</button></div>
        </form>
      </div>
      <style jsx global>{`
        .goal-input{height:40px;width:100%;border-radius:8px;border:1px solid #e5e5e5;background:#fafafa;padding:0 12px;font-size:13px;color:#171717!important;-webkit-text-fill-color:#171717;caret-color:#171717;color-scheme:light;outline:none}
        .goal-input::placeholder{color:#a3a3a3;-webkit-text-fill-color:#a3a3a3;opacity:1}
        .goal-input option{background:#fff;color:#171717}
        .goal-input:focus{border-color:#4143d5;background:white;color:#171717!important;-webkit-text-fill-color:#171717;box-shadow:0 0 0 2px rgba(65,67,213,.1)}
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{label}</span>{children}</label>
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white p-5"><p className="text-xs text-neutral-400">{label}</p><p className="mt-2 text-2xl font-bold text-neutral-950">{value}</p></div>
}

const goalLabels = {
 en: { goals:"Goals", heading:"Long-term Objectives", intro:"Set measurable targets and track progress over time.", newGoal:"New goal", total:"Total Goals", active:"Active", completed:"Completed", yourGoals:"Your goals", loading:"Loading goals...", empty:"No goals yet", progress:"Progress", noDeadline:"No deadline", markComplete:"Mark complete", stored:"Progress is stored securely in your Taskora account.", createHint:"Create a measurable long-term objective.", createFirst:"Create first goal", targetLabel:"Target", editGoal:"Edit goal", createGoal:"Create goal", titleLabel:"Title", descriptionLabel:"Description", currentLabel:"Current", targetValueLabel:"Target", unitLabel:"Unit", targetDateLabel:"Target date", statusLabel:"Status", cancel:"Cancel", save:"Save changes" },
 fr: { goals:"Objectifs", heading:"Objectifs à long terme", intro:"Définissez des objectifs mesurables et suivez leur progression.", newGoal:"Nouvel objectif", total:"Total des objectifs", active:"Actifs", completed:"Terminés", yourGoals:"Vos objectifs", loading:"Chargement des objectifs...", empty:"Aucun objectif", progress:"Progression", noDeadline:"Aucune échéance", markComplete:"Marquer terminé", stored:"La progression est enregistrée dans votre compte Taskora.", createHint:"Créez un objectif à long terme mesurable.", createFirst:"Créer le premier objectif", targetLabel:"Cible", editGoal:"Modifier l’objectif", createGoal:"Créer un objectif", titleLabel:"Titre", descriptionLabel:"Description", currentLabel:"Actuel", targetValueLabel:"Cible", unitLabel:"Unité", targetDateLabel:"Date cible", statusLabel:"Statut", cancel:"Annuler", save:"Enregistrer" },
 ar: { goals:"الأهداف", heading:"الأهداف طويلة المدى", intro:"حدد أهدافا قابلة للقياس وتابع تقدمها مع الوقت.", newGoal:"هدف جديد", total:"إجمالي الأهداف", active:"نشطة", completed:"مكتملة", yourGoals:"أهدافك", loading:"جاري تحميل الأهداف...", empty:"لا توجد أهداف", progress:"التقدم", noDeadline:"بدون موعد نهائي", markComplete:"وضع علامة مكتمل", stored:"يتم حفظ التقدم في حساب Taskora الخاص بك.", createHint:"أنشئ هدفا طويل المدى قابلا للقياس.", createFirst:"إنشاء أول هدف", targetLabel:"الهدف", editGoal:"تعديل الهدف", createGoal:"إنشاء هدف", titleLabel:"العنوان", descriptionLabel:"الوصف", currentLabel:"الحالي", targetValueLabel:"المستهدف", unitLabel:"الوحدة", targetDateLabel:"التاريخ المستهدف", statusLabel:"الحالة", cancel:"إلغاء", save:"حفظ التغييرات" }
} as const
