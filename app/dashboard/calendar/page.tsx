"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarDays, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { usePreferences } from "@/components/providers/preferences-provider"

type Task = {
  id: string
  title: string
  category: string | null
  priority: "low" | "medium" | "high"
  status: "todo" | "in_progress" | "completed"
  scheduled_at: string | null
  duration_minutes: number | null
}

const supabase = createClient()
function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export default function CalendarPage() {
  const { t, language } = usePreferences()
  const locale = language === "fr" ? "fr-FR" : language === "ar" ? "ar-MA" : "en-US"
  const local = calendarCopy[language]
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      const start = new Date(month.getFullYear(), month.getMonth(), 1)
      const end = new Date(month.getFullYear(), month.getMonth() + 1, 1)

      const { data, error } = await supabase
        .from("tasks")
        .select("id,title,category,priority,status,scheduled_at,duration_minutes")
        .gte("scheduled_at", start.toISOString())
        .lt("scheduled_at", end.toISOString())
        .order("scheduled_at", { ascending: true })

      if (error) setError(error.message)
      else setTasks((data ?? []) as Task[])
      setLoading(false)
    }

    void load()
  }, [month])

  const cells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1)
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    const previousCount = new Date(month.getFullYear(), month.getMonth(), 0).getDate()
    const total = 42

    return Array.from({ length: total }, (_, index) => {
      const offset = index - first.getDay() + 1
      if (offset < 1) return { day: previousCount + offset, current: false, date: new Date(month.getFullYear(), month.getMonth() - 1, previousCount + offset) }
      if (offset > count) return { day: offset - count, current: false, date: new Date(month.getFullYear(), month.getMonth() + 1, offset - count) }
      return { day: offset, current: true, date: new Date(month.getFullYear(), month.getMonth(), offset) }
    })
  }, [month])

  const tasksByDay = useMemo(() => {
    const map = new Map<number, Task[]>()
    for (const task of tasks) {
      if (!task.scheduled_at) continue
      const date = new Date(task.scheduled_at)
      if (date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth()) {
        const day = date.getDate()
        map.set(day, [...(map.get(day) ?? []), task])
      }
    }
    return map
  }, [tasks, month])

  const selectedTasks = selectedDate.getFullYear() === month.getFullYear() && selectedDate.getMonth() === month.getMonth()
    ? tasksByDay.get(selectedDate.getDate()) ?? []
    : []

  const completed = tasks.filter((task) => task.status === "completed").length

  function moveMonth(delta: number) {
    const next = new Date(month.getFullYear(), month.getMonth() + delta, 1)
    setMonth(next)
    setSelectedDate(next)
  }

  function goToday() {
    const now = new Date()
    setMonth(new Date(now.getFullYear(), now.getMonth(), 1))
    setSelectedDate(now)
  }

  return (
    <div className="min-h-screen bg-[#F9F9FD] px-8 py-8 lg:px-10">
      <div className="mx-auto max-w-[1600px]">
        <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#4143D5]">{t.calendar}</p>
            <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-neutral-950">
              {month.toLocaleDateString(language === "fr" ? "fr-FR" : language === "ar" ? "ar-MA" : "en-US", { month: "long", year: "numeric" })}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">{t.calendarIntro}</p>
          </div>

          <div className="flex h-10 items-center rounded-xl border border-neutral-200 bg-white p-1">
            <button onClick={() => moveMonth(-1)} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"><ChevronLeft className="h-4 w-4" /></button>
            <button onClick={goToday} className="h-8 rounded-lg bg-neutral-100 px-4 text-xs font-semibold text-neutral-700">{t.today}</button>
            <button onClick={() => moveMonth(1)} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label={t.scheduled} value={String(tasks.length)} />
          <Stat label={t.completed} value={String(completed)} />
          <Stat label={t.pending} value={String(tasks.length - completed)} />
        </section>

        {error && <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <section className="mt-6 grid gap-6 xl:grid-cols-12">
          <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white xl:col-span-9">
            <div className="grid grid-cols-7 bg-neutral-50 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
              {Array.from({ length: 7 }, (_, index) => new Date(2026, 0, 4 + index).toLocaleDateString(locale, { weekday: "short" })).map((day) => <div key={day}>{day}</div>)}
            </div>

            {loading ? (
              <div className="flex min-h-[560px] items-center justify-center text-sm text-neutral-400"><Loader2 className="mr-2 h-5 w-5 animate-spin" />{local.loading}</div>
            ) : (
              <div className="grid grid-cols-7 gap-px bg-neutral-200">
                {cells.map((cell, index) => {
                  const dayTasks = cell.current ? tasksByDay.get(cell.day) ?? [] : []
                  const selected = cell.date.toDateString() === selectedDate.toDateString()
                  const today = cell.date.toDateString() === new Date().toDateString()

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => cell.current && setSelectedDate(cell.date)}
                      className={`min-h-[118px] p-2 text-left transition ${selected ? "bg-[#EEEEFF]" : "bg-white hover:bg-neutral-50"} ${cell.current ? "" : "opacity-35"}`}
                    >
                      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${today ? "bg-[#4143D5] text-white" : "text-neutral-700"}`}>{cell.day}</span>
                      <div className="mt-2 space-y-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div key={task.id} className={`truncate rounded-md px-1.5 py-1 text-[9px] font-semibold ${task.status === "completed" ? "bg-emerald-50 text-emerald-700 line-through" : task.priority === "high" ? "bg-red-50 text-red-700" : "bg-[#EEEEFF] text-[#4143D5]"}`}>
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 3 && <p className="px-1 text-[9px] font-semibold text-[#4143D5]">+{dayTasks.length - 3} more</p>}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <aside className="xl:col-span-3">
            <div className="sticky top-6 rounded-2xl border border-neutral-200 bg-white p-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#4143D5]">{t.selectedDay}</p>
              <h2 className="mt-1 text-lg font-semibold text-neutral-950">
                {selectedDate.toLocaleDateString(locale, { weekday: "long", month: "short", day: "numeric" })}
              </h2>
              <p className="mt-1 text-xs text-neutral-400">{selectedTasks.length} {local.scheduledTasks}</p>

              <div className="mt-5 space-y-3">
                {selectedTasks.length === 0 ? (
                  <div className="rounded-xl bg-neutral-50 px-4 py-8 text-center">
                    <CalendarDays className="mx-auto h-5 w-5 text-neutral-300" />
                    <p className="mt-2 text-xs text-neutral-400">{t.noScheduled}</p>
                  </div>
                ) : selectedTasks.map((task) => (
                  <div key={task.id} className="rounded-xl bg-neutral-50 p-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-[#4143D5]">
                        {task.scheduled_at ? new Date(task.scheduled_at).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }) : ""}
                      </span>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold capitalize text-neutral-500">{local.status[task.status]}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-neutral-800">{task.title}</p>
                    <div className="mt-1 flex gap-2 text-[10px] text-neutral-400">
                      {task.category && <span>{task.category}</span>}
                      {task.duration_minutes && <span>· {task.duration_minutes} {local.min}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl border border-neutral-200 bg-white p-5"><p className="text-xs text-neutral-400">{label}</p><p className="mt-2 text-2xl font-bold text-neutral-950">{value}</p></div>
}

const calendarCopy = {
  en: { loading: "Loading calendar...", more: "more", scheduledTasks: "scheduled tasks", min: "min", status: { todo: "Todo", in_progress: "In progress", completed: "Completed" } },
  fr: { loading: "Loading...", more: "plus", scheduledTasks: "taches planifiees", min: "min", status: { todo: "A faire", in_progress: "En cours", completed: "Terminee" } },
  ar: { loading: "Loading...", more: "more", scheduledTasks: "scheduled tasks", min: "min", status: { todo: "Todo", in_progress: "In progress", completed: "Completed" } },
} as const
