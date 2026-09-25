"use client"

import { useEffect, useState } from "react"
import {
  Bell,
  Brain,
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Clock3,
  Command,
  Headphones,
  List,
  Pause,
  Play,
  Plus,
  Search,
  SkipForward,
  Sparkles,
  Timer,
} from "lucide-react"

const timeline = [
  {
    time: "08:00 AM",
    title: "Morning Routine & Daily Planning",
    meta: "Completed",
    completed: true,
  },
  {
    time: "09:30 AM",
    title: "Deep Work: Architecture Refactor",
    meta: "09:30 – 11:00 AM · Development",
    active: true,
  },
  {
    time: "11:30 AM",
    title: "Design Sync with Team",
    meta: "11:30 AM · Design",
  },
  {
    time: "12:30 PM",
    title: "Lunch & Walk Break",
    meta: "12:30 – 01:30 PM · Personal",
  },
  {
    time: "02:00 PM",
    title: "Quarterly Revenue Review",
    meta: "02:00 – 03:30 PM · High Priority",
  },
  {
    time: "04:00 PM",
    title: "Inbox Zero & Async Reviews",
    meta: "04:00 – 05:00 PM · Admin",
  },
]

export default function DailyPage() {
  const [secondsLeft, setSecondsLeft] = useState(18 * 60 + 42)
  const [running, setRunning] = useState(true)
  const [view, setView] = useState<"timeline" | "list">("timeline")

  useEffect(() => {
    if (!running || secondsLeft <= 0) return

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [running, secondsLeft])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const countdown = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`

  return (
    <div className="min-h-screen bg-[#F9F9FD]">
      <header className="flex h-[72px] items-center justify-between border-b border-neutral-200 bg-white px-8 lg:px-10">
        <div className="relative w-full max-w-[420px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search tasks, projects, tags..."
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-16 text-sm outline-none transition focus:border-[#4143D5] focus:bg-white focus:ring-2 focus:ring-[#4143D5]/10"
          />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[10px] text-neutral-400">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>

        <div className="ml-6 flex items-center gap-3">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#4143D5]" />
          </button>

          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg bg-[#4143D5] px-4 text-sm font-semibold text-white hover:bg-[#3638BD]"
          >
            <Plus className="h-4 w-4" />
            New task
          </button>
        </div>
      </header>

      <main className="px-8 py-8 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <section className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#4143D5]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  Daily Focus · Wednesday, Oct 24, 2026
                </p>
              </div>
              <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-neutral-950">
                Today&apos;s Schedule & Focus
              </h1>
              <p className="mt-1 text-sm text-neutral-500">
                4 focus blocks · 8 tasks scheduled · 3h 24m focus logged
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-9 items-center rounded-xl bg-neutral-100 p-1">
                <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-500 hover:bg-white">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="px-2 text-xs font-medium text-neutral-800">Today</span>
                <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-500 hover:bg-white">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="flex h-9 items-center rounded-xl bg-neutral-100 p-1">
                <button
                  type="button"
                  onClick={() => setView("timeline")}
                  className={`flex h-7 items-center gap-1.5 rounded-lg px-3 text-xs font-medium ${view === "timeline" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-400"}`}
                >
                  <Timer className="h-3.5 w-3.5" />
                  Timeline
                </button>
                <button
                  type="button"
                  onClick={() => setView("list")}
                  className={`flex h-7 items-center gap-1.5 rounded-lg px-3 text-xs font-medium ${view === "list" ? "bg-white text-neutral-950 shadow-sm" : "text-neutral-400"}`}
                >
                  <List className="h-3.5 w-3.5" />
                  List
                </button>
              </div>

              <button type="button" className="flex h-9 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                <CirclePlus className="h-4 w-4" />
                Add Block
              </button>

              <button type="button" className="flex h-9 items-center gap-2 rounded-lg bg-[#4143D5] px-4 text-sm font-semibold text-white hover:bg-[#3638BD]">
                <Play className="h-4 w-4 fill-current" />
                Start Focus Session
              </button>
            </div>
          </section>

          <div className="mt-6 grid gap-6 xl:grid-cols-12">
            <section className="space-y-5 xl:col-span-8">
              <div className="grid gap-3 rounded-2xl border border-neutral-200 bg-white p-3.5 md:grid-cols-3">
                <Metric icon={<Clock3 className="h-4 w-4" />} label="Next Up" value="Design Sync (11:30 AM)" />
                <Metric icon={<Sparkles className="h-4 w-4" />} label="Daily Velocity" value="75% complete" />
                <Metric icon={<Brain className="h-4 w-4" />} label="Focus Status" value="Flow state ready" />
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-5 w-5 text-[#4143D5]" />
                    <h2 className="text-lg font-semibold text-neutral-950">
                      {view === "timeline" ? "Timeline & Agenda" : "Daily Agenda"}
                    </h2>
                  </div>
                  <div className="hidden gap-4 text-[11px] text-neutral-400 md:flex">
                    <span>● Completed</span>
                    <span className="text-[#4143D5]">● In Progress</span>
                    <span>● Scheduled</span>
                  </div>
                </div>

                <div className="mt-5 space-y-4">
                  {timeline.map((item) => (
                    <div key={item.time} className="flex gap-4">
                      <div className="w-[72px] shrink-0 pt-3 text-right text-[11px] font-semibold text-neutral-400">
                        {item.time}
                      </div>
                      <div
                        className={`flex-1 rounded-xl border p-4 transition ${item.active ? "border-[#C9C9FF] bg-[#EEEEFF]/70" : "border-transparent bg-neutral-50"}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${item.completed ? "bg-neutral-200 text-neutral-500" : item.active ? "bg-[#4143D5] text-white" : "bg-white text-neutral-400"}`}>
                              {item.completed ? <Check className="h-3.5 w-3.5" /> : item.active ? <Timer className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
                            </div>
                            <div>
                              <p className={`text-sm font-medium ${item.completed ? "text-neutral-400 line-through" : "text-neutral-900"}`}>
                                {item.title}
                              </p>
                              <p className="mt-1 text-xs text-neutral-400">{item.meta}</p>
                            </div>
                          </div>
                          {item.active && (
                            <span className="rounded-full bg-[#4143D5] px-2 py-1 text-[10px] font-semibold text-white">
                              ACTIVE
                            </span>
                          )}
                        </div>

                        {item.active && (
                          <div className="mt-4 space-y-2 rounded-lg bg-white/80 p-3 text-xs">
                            <label className="flex items-center gap-2 text-neutral-400 line-through">
                              <input type="checkbox" defaultChecked className="accent-[#4143D5]" />
                              API routes cleanup & auth validation
                            </label>
                            <label className="flex items-center gap-2 text-neutral-700">
                              <input type="checkbox" className="accent-[#4143D5]" />
                              Database indexing on daily agenda table
                            </label>
                            <label className="flex items-center gap-2 text-neutral-700">
                              <input type="checkbox" className="accent-[#4143D5]" />
                              Unit tests for batch syncing queue
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <div className="flex gap-4">
                    <div className="w-[72px] shrink-0 pt-2 text-right text-[11px] font-semibold text-neutral-300">
                      01:30 PM
                    </div>
                    <button type="button" className="flex-1 rounded-xl border border-dashed border-neutral-200 py-3 text-xs font-medium text-neutral-400 hover:border-[#BDBDFF] hover:text-[#4143D5]">
                      + Add task or break block
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <aside className="space-y-5 xl:col-span-4">
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#4143D5]" />
                    <h2 className="text-lg font-semibold text-neutral-950">Deep Focus Engine</h2>
                  </div>
                  <span className="rounded-md bg-[#EEEEFF] px-2 py-1 text-[10px] font-bold text-[#4143D5]">
                    SESSION 3/5
                  </span>
                </div>

                <div className="mt-4 rounded-xl bg-neutral-50 p-5 text-center">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                    Elapsed Time Remaining
                  </p>
                  <p className="mt-1 text-[42px] font-semibold tracking-[-0.04em] text-neutral-950">
                    {countdown}
                  </p>
                  <p className="mt-1 truncate text-sm font-medium text-[#4143D5]">
                    Deep Work: Architecture Refactor
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
                      <div className="h-full w-[72%] rounded-full bg-[#4143D5]" />
                    </div>
                    <span className="text-[10px] font-semibold text-neutral-400">72%</span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <button type="button" onClick={() => setRunning((value) => !value)} className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-neutral-100 text-xs font-medium text-neutral-700 hover:bg-neutral-200">
                    {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                    {running ? "Pause" : "Resume"}
                  </button>
                  <button type="button" onClick={() => setSecondsLeft((value) => value + 300)} className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-neutral-100 text-xs font-medium text-neutral-700 hover:bg-neutral-200">
                    <SkipForward className="h-3.5 w-3.5" />
                    +5m
                  </button>
                  <button type="button" onClick={() => { setSecondsLeft(0); setRunning(false) }} className="flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#4143D5] text-xs font-semibold text-white hover:bg-[#3638BD]">
                    <Check className="h-3.5 w-3.5" />
                    Finish
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-700">
                    <Headphones className="h-4 w-4 text-neutral-400" />
                    Binaural 40Hz Flow
                  </div>
                  <span className="text-[10px] font-semibold text-[#4143D5]">ACTIVE</span>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-neutral-950">The Big 3 Objectives</h2>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">Must Finish Today</span>
                </div>
                <div className="mt-4 space-y-3">
                  <Objective title="Finalize Q3 Budget Draft" detail="Done 08:30 AM" done />
                  <Objective title="Ship Taskora API Documentation v2.4" detail="60% complete · Est. 1h left" active />
                  <Objective title="Review Design System PR with Elena" detail="At 11:30 AM Sync · 14 components" />
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-neutral-950">Daily Scratchpad</h2>
                  <span className="rounded-md bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-400">Auto-saved</span>
                </div>
                <div className="mt-4 space-y-2 rounded-xl bg-neutral-50 p-3 text-xs leading-5 text-neutral-600">
                  <p>• Ping Marcus before 3 PM about staging credentials.</p>
                  <p>• Double check Figma tokens against Tailwind theme mapping.</p>
                  <p>• Review PR #382 on reactive query hydration.</p>
                </div>
                <input
                  type="text"
                  placeholder="Type a quick note or task..."
                  className="mt-3 h-9 w-full rounded-lg bg-neutral-50 px-3 text-xs outline-none focus:ring-2 focus:ring-[#4143D5]/10"
                />
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-neutral-50 px-3 py-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEEEFF] text-[#4143D5]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">{label}</p>
        <p className="mt-0.5 truncate text-xs font-semibold text-neutral-800">{value}</p>
      </div>
    </div>
  )
}

function Objective({
  title,
  detail,
  done = false,
  active = false,
}: {
  title: string
  detail: string
  done?: boolean
  active?: boolean
}) {
  return (
    <div className={`rounded-xl p-3 ${active ? "bg-[#EEEEFF]/70" : "bg-neutral-50"}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${done ? "bg-[#4143D5] text-white" : active ? "border border-[#4143D5] bg-white" : "bg-neutral-200"}`}>
          {done && <Check className="h-3 w-3" />}
          {active && <span className="h-2 w-2 rounded-sm bg-[#4143D5]" />}
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-medium ${done ? "text-neutral-400 line-through" : "text-neutral-800"}`}>{title}</p>
          <p className={`mt-1 text-[11px] ${active ? "font-medium text-[#4143D5]" : "text-neutral-400"}`}>{detail}</p>
        </div>
      </div>
    </div>
  )
}
