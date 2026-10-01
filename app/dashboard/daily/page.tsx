"use client"

import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import {
  Check,
  Clock3,
  Command,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Search,
  X,
} from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { usePreferences } from "@/components/providers/preferences-provider"
import NotificationBell from "@/components/notifications/notification-bell"

type Task = {
  id: string
  title: string
  description: string | null
  category: string | null
  priority: "low" | "medium" | "high"
  status: "todo" | "in_progress" | "completed"
  scheduled_at: string | null
  duration_minutes: number | null
  completed_at: string | null
  created_at: string
  recurrence?: "none" | "daily" | "weekly" | "monthly"
  reminder_minutes?: number | null
}

const supabase = createClient()

export default function DailyPage() {
  const { language } = usePreferences()
  const locale = language === "fr" ? "fr-FR" : language === "ar" ? "ar-MA" : "en-US"
  const dynamic = dailyDynamic[language]
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [plan, setPlan] = useState<"free" | "pro">("free")
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  async function loadTasks() {
    setLoading(true)
    setError(null)

    const { data, error: queryError } = await supabase
      .from("tasks")
      .select("id,title,description,category,priority,status,scheduled_at,duration_minutes,completed_at,created_at,recurrence,reminder_minutes")
      .order("scheduled_at", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false })

    if (queryError) {
      setError(queryError.message)
    } else {
      setTasks((data ?? []) as Task[])
    }

    setLoading(false)
  }

  useEffect(() => {
    // Initial remote data synchronization.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadTasks()
    void (async () => { const { data: { user } } = await supabase.auth.getUser(); if (user) { const { data } = await supabase.from("profiles").select("plan").eq("user_id", user.id).maybeSingle(); setPlan(data?.plan === "pro" ? "pro" : "free") } })()
  }, [])

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onShortcut)
    return () => window.removeEventListener("keydown", onShortcut)
  }, [])

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    setSaving(true)
    setError(null)

    const form = new FormData(formElement)
    const title = String(form.get("title") ?? "").trim()
    const description = String(form.get("description") ?? "").trim()
    const category = String(form.get("category") ?? "").trim()
    const priority = String(form.get("priority") ?? "medium")
    const scheduledAt = String(form.get("scheduled_at") ?? "")
    const duration = String(form.get("duration_minutes") ?? "")
    const recurrence = String(form.get("recurrence") ?? "none")
    const reminder = String(form.get("reminder_minutes") ?? "")

    if (plan === "free" && tasks.filter((task) => task.status !== "completed").length >= 100) {
      setError("Free plan supports up to 100 active tasks. Upgrade to Pro for unlimited tasks.")
      setSaving(false)
      return
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setError(dynamic.sessionError)
      setSaving(false)
      return
    }

    const { data: insertedTask, error: insertError } = await supabase.from("tasks").insert({
      user_id: user.id,
      title,
      description: description || null,
      category: category || null,
      priority,
      status: "todo",
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      duration_minutes: duration ? Number(duration) : null,
      recurrence: plan === "pro" ? recurrence : "none",
      reminder_minutes: plan === "pro" && reminder ? Number(reminder) : null,
    }).select("id,title,description,category,priority,status,scheduled_at,duration_minutes,completed_at,created_at,recurrence,reminder_minutes").single()

    if (insertError || !insertedTask) {
      setError(insertError?.message ?? "Could not create task.")
      setSaving(false)
      return
    }

    setTasks((current) => [insertedTask as Task, ...current])
    formElement.reset()
    setShowForm(false)
    setSaving(false)
  }

  async function updateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!editingTask) return

    const form = new FormData(event.currentTarget)
    const title = String(form.get("title") ?? "").trim()
    const description = String(form.get("description") ?? "").trim()
    const category = String(form.get("category") ?? "").trim()
    const priority = String(form.get("priority") ?? "medium")
    const scheduledAt = String(form.get("scheduled_at") ?? "")
    const duration = String(form.get("duration_minutes") ?? "")
    const recurrence = String(form.get("recurrence") ?? editingTask.recurrence ?? "none")
    const reminder = String(form.get("reminder_minutes") ?? editingTask.reminder_minutes ?? "")

    setSaving(true)
    setError(null)

    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        title,
        description: description || null,
        category: category || null,
        priority,
        scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        duration_minutes: duration ? Number(duration) : null,
        recurrence: plan === "pro" ? recurrence : "none",
        reminder_minutes: plan === "pro" && reminder ? Number(reminder) : null,
      })
      .eq("id", editingTask.id)

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    setEditingTask(null)
    setSaving(false)
    await loadTasks()
  }

  async function deleteTask() {
    if (!deletingTask) return

    setSaving(true)
    setError(null)

    const { error: deleteError } = await supabase
      .from("tasks")
      .delete()
      .eq("id", deletingTask.id)

    if (deleteError) {
      setError(deleteError.message)
      setSaving(false)
      return
    }

    setTasks((current) => current.filter((task) => task.id !== deletingTask.id))
    setDeletingTask(null)
    setSaving(false)
  }

  async function toggleTask(task: Task) {
    const completed = task.status !== "completed"

    const { error: updateError } = await supabase
      .from("tasks")
      .update({
        status: completed ? "completed" : "todo",
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq("id", task.id)

    if (updateError) {
      setError(updateError.message)
      return
    }

    if (completed && plan === "pro" && task.recurrence && task.recurrence !== "none" && task.scheduled_at) {
      const nextDate = getNextOccurrence(new Date(task.scheduled_at), task.recurrence)
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { error: recurrenceError } = await supabase.from("tasks").insert({
          user_id: user.id,
          title: task.title,
          description: task.description,
          category: task.category,
          priority: task.priority,
          status: "todo",
          scheduled_at: nextDate.toISOString(),
          duration_minutes: task.duration_minutes,
          recurrence: task.recurrence,
          reminder_minutes: task.reminder_minutes ?? null,
          generated_from_task_id: task.id,
        })
        if (recurrenceError) {
          setError(recurrenceError.message)
          await loadTasks()
          return
        }
      }
      await loadTasks()
      return
    }

    setTasks((current) =>
      current.map((item) =>
        item.id === task.id
          ? {
              ...item,
              status: completed ? "completed" : "todo",
              completed_at: completed ? new Date().toISOString() : null,
            }
          : item
      )
    )
  }

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return tasks
    return tasks.filter((task) =>
      [task.title, task.description, task.category, task.priority, task.status]
        .some((value) => value?.toLowerCase().includes(query))
    )
  }, [tasks, searchQuery])

  const todayKey = new Date().toDateString()
  const todayTasks = useMemo(
    () => tasks.filter((task) => task.scheduled_at && new Date(task.scheduled_at).toDateString() === todayKey),
    [tasks, todayKey]
  )
  const completed = useMemo(
    () => todayTasks.filter((task) => task.status === "completed").length,
    [todayTasks]
  )

  const completion = todayTasks.length
    ? Math.round((completed / todayTasks.length) * 100)
    : 0

  return (
    <div className="min-h-screen bg-[#F9F9FD]">
      <header className="flex h-[72px] items-center justify-between border-b border-neutral-200 bg-white px-8 lg:px-10">
        <div className="relative w-full max-w-[420px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search tasks, projects, tags..."
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-16 text-sm outline-none transition focus:border-[#4143D5] focus:bg-white focus:ring-2 focus:ring-[#4143D5]/10"
          />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[10px] text-neutral-400">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>

        <div className="ml-6 flex items-center gap-3">
          <NotificationBell />
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex h-10 items-center gap-2 rounded-lg bg-[#4143D5] px-4 text-sm font-semibold text-white hover:bg-[#3638BD]"
          >
            <Plus className="h-4 w-4" />
            New task
          </button>
        </div>
      </header>

      <main className="px-8 py-8 lg:px-10">
        <div className="mx-auto max-w-[1200px]">
          <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#4143D5]">
                Daily Tasks · Live from Supabase
              </p>
              <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-neutral-950">
                Today&apos;s Tasks
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                {todayTasks.length} {dynamic.tasks} · {completed} {dynamic.completed} · {completion}% {dynamic.progress}
              </p>
            </div>

            <div className="min-w-[260px] rounded-2xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-neutral-500">Completion</span>
                <span className="font-bold text-[#4143D5]">{completion}%</span>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-[#4143D5] transition-all"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </section>

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-neutral-950">Task list</h2>
                <p className="mt-1 text-xs text-neutral-400">
                  Create tasks and mark them complete. Data is stored in your account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="flex h-9 items-center gap-2 rounded-lg border border-neutral-200 px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
              >
                <Plus className="h-4 w-4" />
                Add task
              </button>
            </div>

            {loading ? (
              <div className="flex min-h-[280px] items-center justify-center text-neutral-400">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EEEEFF] text-[#4143D5]">
                  <Check className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-neutral-900">No tasks yet</h3>
                <p className="mt-1 max-w-sm text-xs leading-5 text-neutral-400">
                  Create your first Taskora task. It will be saved in Supabase and linked to your account.
                </p>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="mt-4 flex h-9 items-center gap-2 rounded-lg bg-[#4143D5] px-4 text-xs font-semibold text-white"
                >
                  <Plus className="h-4 w-4" />
                  Create first task
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                {filteredTasks.map((task) => {
                  const isDone = task.status === "completed"
                  return (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 rounded-xl border border-neutral-100 bg-neutral-50 p-4"
                    >
                      <button
                        type="button"
                        onClick={() => void toggleTask(task)}
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition ${
                          isDone
                            ? "border-[#4143D5] bg-[#4143D5] text-white"
                            : "border-neutral-300 bg-white text-transparent hover:border-[#4143D5]"
                        }`}
                        aria-label={isDone ? "Mark task incomplete" : "Mark task complete"}
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                          <p className={`text-sm font-semibold ${isDone ? "text-neutral-400 line-through" : "text-neutral-900"}`}>
                            {task.title}
                          </p>
                          <Priority priority={task.priority} label={dynamic.priority[task.priority]} />
                          {task.category && (
                            <span className="rounded-md bg-white px-2 py-1 text-[9px] font-semibold text-neutral-500">
                              {task.category}
                            </span>
                          )}
                          </div>
                          <div className="flex shrink-0 items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingTask(task)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-white hover:text-[#4143D5]"
                              aria-label="Edit task"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingTask(task)}
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                              aria-label="Delete task"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                        {task.description && (
                          <p className="mt-1 text-xs leading-5 text-neutral-500">{task.description}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-3 text-[10px] text-neutral-400">
                          {task.scheduled_at && (
                            <span className="flex items-center gap-1">
                              <Clock3 className="h-3 w-3" />
                              {new Date(task.scheduled_at).toLocaleString(locale)}
                            </span>
                          )}
                          {task.duration_minutes && <span>{task.duration_minutes} {dynamic.min}</span>}
                          <span>{dynamic.status[task.status]}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4143D5]">Taskora</p>
                <h2 className="mt-1 text-xl font-semibold text-neutral-950">Create task</h2>
              </div>
              <button type="button" onClick={() => setShowForm(false)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={createTask} className="mt-5 space-y-4">
              <Field label="Title">
                <input name="title" required maxLength={200} placeholder="e.g. Review Taskora dashboard" className="input-taskora" />
              </Field>

              <Field label="Description">
                <textarea name="description" rows={3} placeholder="Optional details..." className="input-taskora h-auto resize-none py-2.5" />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Category">
                  <input name="category" placeholder="Work, Personal..." className="input-taskora" />
                </Field>
                <Field label="Priority">
                  <select name="priority" defaultValue="medium" className="input-taskora">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Schedule">
                  <input name="scheduled_at" type="datetime-local" className="input-taskora" />
                </Field>
                <Field label="Duration (minutes)">
                  <input name="duration_minutes" type="number" min="1" placeholder="45" className="input-taskora" />
                </Field>
              </div>

              {plan === "pro" && <div className="grid gap-4 sm:grid-cols-2"><Field label="Repeat"><select name="recurrence" defaultValue="none" className="input-taskora"><option value="none">Never</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select></Field><Field label="Reminder"><select name="reminder_minutes" defaultValue="" className="input-taskora"><option value="">No reminder</option><option value="10">10 min before</option><option value="30">30 min before</option><option value="60">1 hour before</option><option value="1440">1 day before</option></select></Field></div>}

          <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
                <button type="button" onClick={() => setShowForm(false)} className="h-9 rounded-lg border border-neutral-200 px-4 text-xs font-semibold text-neutral-600">
                  Cancel
                </button>
                <button disabled={saving} type="submit" className="flex h-9 items-center gap-2 rounded-lg bg-[#4143D5] px-4 text-xs font-semibold text-white disabled:opacity-60">
                  {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Create task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingTask && (
        <TaskFormModal
          title="Edit task"
          submitLabel="Save changes"
          task={editingTask}
          saving={saving}
          plan={plan}
          onClose={() => setEditingTask(null)}
          onSubmit={updateTask}
        />
      )}

      {deletingTask && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 className="h-5 w-5" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-neutral-950">Delete task?</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              “{deletingTask.title}” will be permanently deleted.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" onClick={() => setDeletingTask(null)} className="h-9 rounded-lg border border-neutral-200 px-4 text-xs font-semibold text-neutral-600">
                Cancel
              </button>
              <button disabled={saving} type="button" onClick={() => void deleteTask()} className="flex h-9 items-center gap-2 rounded-lg bg-red-600 px-4 text-xs font-semibold text-white disabled:opacity-60">
                {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .input-taskora {
          height: 40px;
          width: 100%;
          border-radius: 8px;
          border: 1px solid #e5e5e5;
          background: #fafafa;
          padding-left: 12px;
          padding-right: 12px;
          font-size: 13px;
          color: #171717 !important;
          -webkit-text-fill-color: #171717;
          caret-color: #171717;
          color-scheme: light;
          outline: none;
        }
        .input-taskora::placeholder {
          color: #a3a3a3;
          -webkit-text-fill-color: #a3a3a3;
          opacity: 1;
        }
        .input-taskora option {
          background: #ffffff;
          color: #171717;
        }
        .input-taskora:focus {
          border-color: #4143d5;
          background: white;
          color: #171717 !important;
          -webkit-text-fill-color: #171717;
          box-shadow: 0 0 0 2px rgba(65, 67, 213, 0.1);
        }
      `}</style>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
        {label}
      </span>
      {children}
    </label>
  )
}

function Priority({ priority, label: _label }: { priority: Task["priority"]; label: string }) {
  const classes = {
    low: "bg-blue-50 text-blue-700",
    medium: "bg-amber-50 text-amber-700",
    high: "bg-red-50 text-red-700",
  }

  return (
    <span className={`rounded-md px-2 py-1 text-[9px] font-bold uppercase ${classes[priority]}`}>
      {priority}
    </span>
  )
}


function TaskFormModal({
  title,
  submitLabel,
  task,
  saving,
  plan,
  onClose,
  onSubmit,
}: {
  title: string
  submitLabel: string
  task: Task
  saving: boolean
  plan: "free" | "pro"
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  const scheduled = task.scheduled_at
    ? new Date(new Date(task.scheduled_at).getTime() - new Date(task.scheduled_at).getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16)
    : ""

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4143D5]">Taskora</p>
            <h2 className="mt-1 text-xl font-semibold text-neutral-950">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <Field label="Title">
            <input name="title" required maxLength={200} defaultValue={task.title} className="input-taskora" />
          </Field>
          <Field label="Description">
            <textarea name="description" rows={3} defaultValue={task.description ?? ""} className="input-taskora h-auto resize-none py-2.5" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category">
              <input name="category" defaultValue={task.category ?? ""} className="input-taskora" />
            </Field>
            <Field label="Priority">
              <select name="priority" defaultValue={task.priority} className="input-taskora">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Schedule">
              <input name="scheduled_at" type="datetime-local" defaultValue={scheduled} className="input-taskora" />
            </Field>
            <Field label="Duration (minutes)">
              <input name="duration_minutes" type="number" min="1" defaultValue={task.duration_minutes ?? ""} className="input-taskora" />
            </Field>
          </div>
          {plan === "pro" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Repeat">
                <select name="recurrence" defaultValue={task.recurrence ?? "none"} className="input-taskora">
                  <option value="none">Never</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </Field>
              <Field label="Reminder">
                <select name="reminder_minutes" defaultValue={task.reminder_minutes ?? ""} className="input-taskora">
                  <option value="">No reminder</option>
                  <option value="10">10 min before</option>
                  <option value="30">30 min before</option>
                  <option value="60">1 hour before</option>
                  <option value="1440">1 day before</option>
                </select>
              </Field>
            </div>
          )}
          <div className="flex justify-end gap-2 border-t border-neutral-100 pt-4">
            <button type="button" onClick={onClose} className="h-9 rounded-lg border border-neutral-200 px-4 text-xs font-semibold text-neutral-600">
              Cancel
            </button>
            <button disabled={saving} type="submit" className="flex h-9 items-center gap-2 rounded-lg bg-[#4143D5] px-4 text-xs font-semibold text-white disabled:opacity-60">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function getNextOccurrence(date: Date, recurrence: "daily" | "weekly" | "monthly") {
  const next = new Date(date)
  if (recurrence === "daily") next.setDate(next.getDate() + 1)
  if (recurrence === "weekly") next.setDate(next.getDate() + 7)
  if (recurrence === "monthly") {
    const originalDay = next.getDate()
    next.setDate(1)
    next.setMonth(next.getMonth() + 1)
    const lastDayOfTargetMonth = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
    next.setDate(Math.min(originalDay, lastDayOfTargetMonth))
  }
  return next
}

const dailyDynamic = {
  en: { tasks: "tasks", completed: "completed", progress: "progress", min: "min", sessionError: "Your session could not be verified. Please sign in again.", status: { todo: "Todo", in_progress: "In progress", completed: "Completed" }, priority: { low: "Low", medium: "Medium", high: "High" } },
  fr: { tasks: "tâches", completed: "terminées", progress: "progression", min: "min", sessionError: "Votre session n’a pas pu être vérifiée. Veuillez vous reconnecter.", status: { todo: "À faire", in_progress: "En cours", completed: "Terminée" }, priority: { low: "Basse", medium: "Moyenne", high: "Haute" } },
  ar: { tasks: "مهام", completed: "مكتملة", progress: "تقدم", min: "دقيقة", sessionError: "تعذر التحقق من جلستك. يرجى تسجيل الدخول من جديد.", status: { todo: "للإنجاز", in_progress: "قيد التنفيذ", completed: "مكتملة" }, priority: { low: "منخفضة", medium: "متوسطة", high: "عالية" } },
} as const
