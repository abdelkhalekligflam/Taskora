"use client"

import { useState } from "react"
import {
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Command,
  Plus,
  Search,
  Target,
} from "lucide-react"

const events: Record<number, string[]> = {
  1: ["Roadmap Review"],
  6: ["Quarterly Planning", "Pay Invoice #402"],
  12: ["Design Critique"],
  18: ["Sprint Planning"],
  20: ["Quarterly Planning"],
  24: ["Team Sync (11:30)", "Doc Updates (14:00)", "Revenue Review"],
  27: ["Product Launch v2.4"],
  29: ["Post-Launch Retrospective"],
  30: ["Performance Audit"],
}

const days = Array.from({ length: 35 }, (_, index) => {
  if (index < 4) return { day: 27 + index, muted: true }
  return { day: index - 3, muted: false }
})

export default function MonthlyPage() {
  const [view, setView] = useState<"month" | "agenda">("month")
  const [selectedDay, setSelectedDay] = useState(24)

  return (
    <div className="min-h-screen bg-[#F9F9FD]">
      <header className="flex h-[72px] items-center justify-between border-b border-neutral-200 bg-white px-8 lg:px-10">
        <div className="relative w-full max-w-[420px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="text" placeholder="Search tasks, projects, tags..." className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-16 text-sm outline-none transition focus:border-[#4143D5] focus:bg-white focus:ring-2 focus:ring-[#4143D5]/10" />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[10px] text-neutral-400">
            <Command className="h-3 w-3" /><span>K</span>
          </div>
        </div>
        <div className="ml-6 flex items-center gap-3">
          <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#4143D5]" />
          </button>
          <button type="button" className="flex h-10 items-center gap-2 rounded-lg bg-[#4143D5] px-4 text-sm font-semibold text-white hover:bg-[#3638BD]">
            <Plus className="h-4 w-4" />New task
          </button>
        </div>
      </header>

      <main className="px-8 py-8 lg:px-10">
        <div className="mx-auto max-w-[1600px]">
          <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#4143D5]">Monthly View</span>
                <span className="h-1 w-1 rounded-full bg-neutral-300" />
                <span className="text-xs text-neutral-500">Q4 Planning & Cadence</span>
              </div>
              <div className="mt-1 flex items-center gap-3">
                <h1 className="text-[32px] font-semibold tracking-[-0.035em] text-neutral-950">October 2026</h1>
                <span className="rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-semibold text-[#4143D5]">Week 40 - 44</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex h-9 items-center rounded-xl border border-neutral-200 bg-white p-1">
                <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"><ChevronLeft className="h-4 w-4" /></button>
                <button type="button" className="h-7 rounded-lg bg-neutral-100 px-3 text-xs font-semibold text-neutral-700">Today</button>
                <button type="button" className="flex h-7 w-7 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100"><ChevronRight className="h-4 w-4" /></button>
              </div>
              <div className="flex h-9 items-center rounded-xl border border-neutral-200 bg-white p-1">
                <button type="button" onClick={() => setView("month")} className={`h-7 rounded-lg px-3 text-xs font-semibold ${view === "month" ? "bg-[#4143D5] text-white" : "text-neutral-500"}`}>Month</button>
                <button type="button" onClick={() => setView("agenda")} className={`h-7 rounded-lg px-3 text-xs font-semibold ${view === "agenda" ? "bg-[#4143D5] text-white" : "text-neutral-500"}`}>Agenda</button>
              </div>
              <button type="button" className="flex h-9 items-center gap-2 rounded-lg bg-[#4143D5] px-4 text-sm font-semibold text-white hover:bg-[#3638BD]"><Plus className="h-4 w-4" />Add Event</button>
            </div>
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-12">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white xl:col-span-8 2xl:col-span-9">
              {view === "month" ? (
                <>
                  <div className="grid grid-cols-7 bg-neutral-50 py-3 text-center text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => <div key={day}>{day}</div>)}
                  </div>
                  <div className="grid grid-cols-7 gap-px bg-neutral-200">
                    {days.map((item, index) => {
                      const dayEvents = item.muted ? [] : events[item.day] ?? []
                      const active = !item.muted && item.day === selectedDay
                      return (
                        <button key={index} type="button" onClick={() => !item.muted && setSelectedDay(item.day)} className={`group min-h-[112px] p-2 text-left transition ${active ? "bg-[#EEEEFF]" : "bg-white hover:bg-neutral-50"} ${item.muted ? "opacity-40" : ""}`}>
                          <div className="flex items-center justify-between">
                            <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${active ? "bg-[#4143D5] text-white" : "text-neutral-700"}`}>{item.day}</span>
                            {!item.muted && <Plus className="h-3.5 w-3.5 text-neutral-300 opacity-0 group-hover:opacity-100" />}
                          </div>
                          <div className="mt-2 space-y-1">
                            {dayEvents.slice(0, 2).map((event, eventIndex) => (
                              <div key={event} className={`truncate rounded-md px-1.5 py-1 text-[9px] font-semibold ${active && eventIndex === 0 ? "bg-[#4143D5] text-white" : event.includes("Launch") ? "bg-[#5E62F2] text-white" : "bg-neutral-100 text-neutral-600"}`}>{event}</div>
                            ))}
                            {dayEvents.length > 2 && <p className="px-1 text-[9px] font-semibold text-[#4143D5]">+{dayEvents.length - 2} more</p>}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 bg-neutral-50 px-4 py-3 text-[10px] font-medium text-neutral-500">
                    <div className="flex flex-wrap gap-4">
                      <span>● Work Sprint</span><span>● Design Critique</span><span>● Planning</span><span>● Administrative</span>
                    </div>
                    <span>Calendar synced</span>
                  </div>
                </>
              ) : (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-neutral-950">October Agenda</h2>
                  <div className="mt-4 divide-y divide-neutral-100">
                    {Object.entries(events).flatMap(([day, items]) => items.map((event) => (
                      <div key={day + event} className="grid gap-2 py-4 md:grid-cols-[80px_1fr_120px] md:items-center">
                        <span className="text-xs font-bold text-[#4143D5]">Oct {day}</span>
                        <span className="text-sm font-medium text-neutral-800">{event}</span>
                        <span className="text-xs text-neutral-400">Scheduled</span>
                      </div>
                    )))}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-4 xl:col-span-4 2xl:col-span-3">
              <div className="rounded-2xl border border-neutral-200 bg-white p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#4143D5]">Selected Day</p>
                <h2 className="mt-1 text-lg font-semibold text-neutral-950">October {selectedDay}, 2026</h2>
                <p className="mt-1 text-xs text-neutral-400">{(events[selectedDay] ?? []).length} scheduled items</p>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-neutral-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-[#4143D5] text-[10px] font-bold">75%</div>
                    <div><p className="text-xs font-semibold text-neutral-800">Day Velocity</p><p className="text-[10px] text-neutral-400">3 of 4 key blocks cleared</p></div>
                  </div>
                  <span className="rounded-md bg-[#EEEEFF] px-2 py-1 text-[10px] font-bold text-[#4143D5]">+18%</span>
                </div>

                <div className="mt-4 space-y-3">
                  {(events[selectedDay] ?? ["No scheduled events"]).map((event, index) => (
                    <div key={event} className="rounded-xl bg-neutral-50 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-semibold text-[#4143D5]">{index === 0 ? "09:00 AM - 10:00 AM" : index === 1 ? "11:30 AM - 12:30 PM" : "02:00 PM - 03:00 PM"}</span>
                        <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-[9px] font-semibold text-neutral-500">Scheduled</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-neutral-800">{event}</p>
                    </div>
                  ))}
                </div>

                <div className="relative mt-4 border-t border-neutral-100 pt-4">
                  <input type="text" placeholder={`Add task or event for Oct ${selectedDay}...`} className="h-9 w-full rounded-lg bg-neutral-50 pl-3 pr-10 text-xs outline-none focus:ring-2 focus:ring-[#4143D5]/10" />
                  <button type="button" className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-md bg-[#4143D5] text-white"><Plus className="h-3.5 w-3.5" /></button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <MiniStat label="Tasks" value="142" />
                <MiniStat label="Done" value="89" />
                <MiniStat label="Pending" value="53" />
              </div>
            </aside>
          </section>

          <section className="mt-5 grid gap-4 lg:grid-cols-3">
            <Summary title="Monthly Goals" icon={<Target className="h-5 w-5 text-[#4143D5]" />}>
              <Goal done title="Quarterly Performance Audit" detail="Completed · HR" />
              <Goal title="Finalize Website Redesign" detail="Due Oct 15 · Marketing" />
              <Goal title="Hire Senior React Developer" detail="Due Oct 28 · Engineering" />
            </Summary>
            <Summary title="Productivity Heatmap">
              <div className="grid grid-cols-10 gap-1.5">
                {Array.from({ length: 50 }, (_, index) => <span key={index} className={`aspect-square rounded-[3px] ${index % 5 === 0 ? "bg-[#4143D5]" : index % 3 === 0 ? "bg-[#AFAFFF]" : index % 2 === 0 ? "bg-[#DCDCFF]" : "bg-neutral-100"}`} />)}
              </div>
              <div className="mt-3 flex justify-between text-[10px] text-neutral-400"><span>Less</span><span>More</span></div>
            </Summary>
            <Summary title="Monthly Insights">
              <Insight icon={<CheckCircle2 className="h-4 w-4" />} label="Peak Day" value="Tuesday" />
              <Insight icon={<Clock3 className="h-4 w-4" />} label="Avg. Tasks" value="8.4 / Day" />
              <Insight icon={<Target className="h-4 w-4" />} label="Longest Streak" value="12 Days" />
            </Summary>
          </section>
        </div>
      </main>
    </div>
  )
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center"><p className="text-[9px] font-semibold uppercase text-neutral-400">{label}</p><p className="mt-1 text-lg font-bold text-neutral-900">{value}</p></div>
}

function Summary({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return <article className="rounded-2xl border border-neutral-200 bg-white p-5"><div className="mb-4 flex items-center justify-between"><h2 className="text-lg font-semibold text-neutral-950">{title}</h2>{icon}</div><div className="space-y-3">{children}</div></article>
}

function Goal({ title, detail, done = false }: { title: string; detail: string; done?: boolean }) {
  return <div className="flex items-start gap-3 rounded-xl bg-neutral-50 p-3"><div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${done ? "bg-[#4143D5] text-white" : "border border-neutral-300 bg-white"}`}>{done && <CheckCircle2 className="h-3.5 w-3.5" />}</div><div><p className={`text-xs font-semibold ${done ? "text-neutral-400 line-through" : "text-neutral-800"}`}>{title}</p><p className="mt-1 text-[10px] text-neutral-400">{detail}</p></div></div>
}

function Insight({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3"><div className="flex items-center gap-2 text-neutral-400">{icon}<span className="text-xs">{label}</span></div><span className="text-xs font-bold text-neutral-800">{value}</span></div>
}
