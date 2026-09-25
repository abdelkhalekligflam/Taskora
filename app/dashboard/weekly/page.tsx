"use client"

import { useState } from "react"
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Command,
  Flame,
  Plus,
  Search,
  Target,
  Timer,
} from "lucide-react"

const days = [
  { day: "Mon", date: "23", count: "6 tasks", tasks: [
    ["09:00 AM", "Quarterly Revenue Review", "Work"],
    ["01:00 PM", "Project Sync", "Team"],
  ]},
  { day: "Tue", date: "24", count: "5 tasks", today: true, tasks: [
    ["10:00 AM", "Design System Audit", "Design"],
    ["02:00 PM", "Update Documentation", "Dev"],
    ["05:00 PM", "Gym Workout", "Personal"],
  ]},
  { day: "Wed", date: "25", count: "4 tasks", tasks: [
    ["10:00 AM", "Client Presentation", "High Priority"],
    ["03:30 PM", "Code Review & Merge", "Dev"],
  ]},
  { day: "Thu", date: "26", count: "5 tasks", tasks: [
    ["11:00 AM", "Product Roadmap 2027", "Strategy"],
    ["02:00 PM", "1:1 with VP Engineering", "Work"],
  ]},
  { day: "Fri", date: "27", count: "7 tasks", tasks: [
    ["03:00 PM", "Weekly Retrospective", "Team"],
    ["04:30 PM", "Release v2.4 to Staging", "Dev"],
  ]},
  { day: "Sat", date: "28", count: "Weekend", weekend: true, tasks: [
    ["08:30 AM", "Trail Run / 10k", "Personal"],
    ["02:00 PM", "Read Design Systems Book", "Personal"],
  ]},
  { day: "Sun", date: "29", count: "Weekend", weekend: true, tasks: [
    ["05:00 PM", "Weekly Review & Meal Prep", "Routine"],
  ]},
]

export default function WeeklyPage() {
  const [view, setView] = useState<"week" | "agenda">("week")

  return (
    <div className="min-h-screen bg-[#F9F9FD]">
      <header className="flex h-[72px] items-center justify-between border-b border-neutral-200 bg-white px-8 lg:px-10">
        <div className="relative w-full max-w-[420px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="text" placeholder="Search tasks, projects, tags..." className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-16 text-sm outline-none transition focus:border-[#4143D5] focus:bg-white focus:ring-2 focus:ring-[#4143D5]/10" />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[10px] text-neutral-400">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>

        <div className="ml-6 flex items-center gap-3">
          <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#4143D5]" />
          </button>
          <button type="button" className="flex h-10 items-center gap-2 rounded-lg bg-[#4143D5] px-4 text-sm font-semibold text-white hover:bg-[#3638BD]">
            <Plus className="h-4 w-4" />
            New task
          </button>
        </div>
      </header>

      <main className="px-8 py-8 lg:px-10">
        <div className="mx-auto max-w-[1600px]">
          <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#4143D5]">Weekly Planner</span>
                <span className="h-1.5 w-1.5 rounded-full bg-[#5E62F2]" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-neutral-400">Q4 Sprint 4</span>
              </div>
              <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.035em] text-neutral-950">
                October 23 – October 29, 2026
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-9 items-center rounded-xl border border-neutral-200 bg-white p-1">
                <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"><ChevronLeft className="h-4 w-4" /></button>
                <button type="button" className="h-7 rounded-lg px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-100">Today</button>
                <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"><ChevronRight className="h-4 w-4" /></button>
              </div>

              <div className="flex h-9 items-center rounded-xl border border-neutral-200 bg-white p-1">
                <button type="button" onClick={() => setView("week")} className={`h-7 rounded-lg px-3 text-xs font-semibold ${view === "week" ? "bg-[#4143D5] text-white" : "text-neutral-500 hover:bg-neutral-100"}`}>Week View</button>
                <button type="button" onClick={() => setView("agenda")} className={`h-7 rounded-lg px-3 text-xs font-semibold ${view === "agenda" ? "bg-[#4143D5] text-white" : "text-neutral-500 hover:bg-neutral-100"}`}>Agenda View</button>
              </div>

              <button type="button" className="flex h-9 items-center gap-2 rounded-xl bg-[#4143D5] px-4 text-sm font-semibold text-white hover:bg-[#3638BD]">
                <Plus className="h-4 w-4" />
                Schedule Event / Task
              </button>
            </div>
          </section>

          <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="Total Planned" value="42 Tasks" icon={<CalendarDays className="h-5 w-5" />} />
            <Stat label="Completed" value="38 Done" icon={<CheckCircle2 className="h-5 w-5" />} />
            <Stat label="Velocity" value="91%" badge="+4%" icon={<Target className="h-5 w-5" />} />
            <Stat label="Active Streak" value="14 Days" icon={<Flame className="h-5 w-5" />} />
          </section>

          {view === "week" ? (
            <section className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
              {days.map((item) => (
                <article key={item.day} className={`flex min-h-[500px] flex-col rounded-2xl border bg-white p-3 ${item.today ? "border-[#AFAFFF] ring-2 ring-[#4143D5]/10" : "border-neutral-200"} ${item.weekend ? "bg-neutral-100/80" : ""}`}>
                  <div className={`-mx-3 -mt-3 mb-3 flex items-center justify-between rounded-t-2xl px-3 py-3 ${item.today ? "bg-[#4143D5] text-white" : "bg-neutral-50"}`}>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${item.today ? "text-white/70" : "text-neutral-400"}`}>{item.day}</span>
                      <span className="text-lg font-bold">{item.date}</span>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[9px] font-semibold ${item.today ? "bg-white/15 text-white" : "bg-neutral-200/70 text-neutral-500"}`}>{item.count}</span>
                  </div>

                  <div className="flex flex-1 flex-col gap-2.5">
                    {item.tasks.map(([time, title, category]) => (
                      <div key={title} className={`rounded-xl border p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${item.today && title === "Design System Audit" ? "border-[#C9C9FF] bg-[#EEEEFF]" : "border-neutral-100 bg-white"}`}>
                        <div className="flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1 text-[10px] font-medium text-neutral-400"><Clock3 className="h-3 w-3" />{time}</span>
                          <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[9px] font-semibold text-neutral-500">{category}</span>
                        </div>
                        <p className="mt-2 text-xs font-semibold leading-4 text-neutral-800">{title}</p>
                      </div>
                    ))}

                    {item.day === "Sun" && (
                      <div className="flex min-h-[80px] items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-white/60 text-center text-[10px] font-medium text-neutral-400">
                        Unscheduled Focus Block
                      </div>
                    )}
                  </div>

                  <button type="button" className={`mt-3 flex h-8 items-center justify-center gap-1 rounded-lg text-[11px] font-semibold transition ${item.today ? "bg-[#4143D5] text-white hover:bg-[#3638BD]" : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"}`}>
                    <Plus className="h-3.5 w-3.5" />
                    Add item
                  </button>
                </article>
              ))}
            </section>
          ) : (
            <section className="mt-5 rounded-2xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-950">Weekly Agenda</h2>
              <div className="mt-5 divide-y divide-neutral-100">
                {days.flatMap((day) => day.tasks.map(([time, title, category]) => (
                  <div key={day.day + title} className="grid gap-2 py-4 md:grid-cols-[100px_110px_1fr_120px] md:items-center">
                    <span className="text-xs font-bold text-neutral-500">{day.day} {day.date}</span>
                    <span className="text-xs text-neutral-400">{time}</span>
                    <span className="text-sm font-medium text-neutral-800">{title}</span>
                    <span className="w-fit rounded-md bg-neutral-100 px-2 py-1 text-[10px] font-semibold text-neutral-500">{category}</span>
                  </div>
                )))}
              </div>
            </section>
          )}

          <section className="mt-5 grid gap-4 lg:grid-cols-3">
            <InfoCard title="Sprint Milestones">
              <div className="space-y-2.5 text-sm text-neutral-600">
                <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#4143D5]" /><span className="line-through text-neutral-400">Finalize database schema overhaul</span></p>
                <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#4143D5]" /><span className="line-through text-neutral-400">Publish dark theme color audit</span></p>
                <p className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border border-neutral-300" />Deploy staging environment for design audit</p>
              </div>
              <div className="mt-4 flex justify-between border-t border-neutral-100 pt-3 text-[10px] font-semibold">
                <span className="text-neutral-400">67% Sprint Target Achieved</span>
                <span className="text-[#4143D5]">2 days remaining</span>
              </div>
            </InfoCard>

            <InfoCard title="Focus Sessions" icon={<Timer className="h-5 w-5 text-[#4143D5]" />}>
              <p className="text-sm leading-6 text-neutral-500">Target: 20 Deep Work Pomodoros this week. Currently logged: <strong className="text-neutral-800">16 sessions</strong>.</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-100"><div className="h-full w-4/5 rounded-full bg-[#4143D5]" /></div>
              <div className="mt-4 flex justify-between border-t border-neutral-100 pt-3 text-[10px] font-semibold">
                <span className="text-neutral-400">Avg duration: 48m</span>
                <span className="text-[#4143D5]">Start Timer</span>
              </div>
            </InfoCard>

            <InfoCard title="Planner Memo">
              <p className="text-sm leading-6 text-neutral-500">Remember to freeze external PRs by Thursday 4 PM for Friday staging deploy. Synchronize with design lead on Figma handoff tokens.</p>
              <p className="mt-4 border-t border-neutral-100 pt-3 text-[10px] font-medium text-neutral-400">Pinned today · 8:15 AM</p>
            </InfoCard>
          </section>
        </div>
      </main>
    </div>
  )
}

function Stat({ label, value, icon, badge }: { label: string; value: string; icon: React.ReactNode; badge?: string }) {
  return (
    <article className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{label}</p>
        <div className="mt-1 flex items-center gap-2">
          <p className="text-2xl font-bold tracking-[-0.03em] text-neutral-950">{value}</p>
          {badge && <span className="rounded-md bg-[#EEEEFF] px-1.5 py-1 text-[9px] font-bold text-[#4143D5]">{badge}</span>}
        </div>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-100 text-[#4143D5]">{icon}</div>
    </article>
  )
}

function InfoCard({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-950">{title}</h2>
        {icon}
      </div>
      {children}
    </article>
  )
}
