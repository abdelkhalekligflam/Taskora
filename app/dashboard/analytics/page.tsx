"use client"

import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Command,
  Download,
  Search,
  Sparkles,
  Timer,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react"

const output = [
  { day: "Mon", planned: 20, done: 18 },
  { day: "Tue", planned: 25, done: 24 },
  { day: "Wed", planned: 24, done: 22 },
  { day: "Thu", planned: 28, done: 26, peak: true },
  { day: "Fri", planned: 22, done: 20 },
  { day: "Sat", planned: 10, done: 8 },
  { day: "Sun", planned: 8, done: 6 },
]

const heat = Array.from({ length: 84 }, (_, index) => (index * 7 + index % 5) % 4)

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#F9F9FD]">
      <header className="flex h-[72px] items-center justify-between border-b border-neutral-200 bg-white px-8 lg:px-10">
        <div className="relative w-full max-w-[420px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="text" placeholder="Search tasks, projects, tags..." className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-16 text-sm outline-none transition focus:border-[#4143D5] focus:bg-white focus:ring-2 focus:ring-[#4143D5]/10" />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[10px] text-neutral-400"><Command className="h-3 w-3" /><span>K</span></div>
        </div>
        <button type="button" className="relative ml-6 flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 hover:bg-neutral-50">
          <Bell className="h-[18px] w-[18px]" /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#4143D5]" />
        </button>
      </header>

      <main className="px-8 py-8 lg:px-10">
        <div className="mx-auto max-w-[1500px] space-y-6">
          <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#5E62F2]" /><span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#5E62F2]">Analytics</span></div>
              <h1 className="mt-1.5 text-[32px] font-semibold tracking-[-0.035em] text-neutral-950">Productivity Insights</h1>
              <p className="mt-1 text-sm text-neutral-500">Understand your work patterns, identify peak focus hours, and improve team velocity.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="flex h-9 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700"><CalendarDays className="h-4 w-4 text-neutral-400" />Last 30 Days<ChevronDown className="h-3.5 w-3.5 text-neutral-400" /></button>
              <button type="button" className="flex h-9 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700"><Download className="h-4 w-4 text-neutral-400" />Export Report</button>
            </div>
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi title="Tasks Completed" value="124" trend="+12%" detail="16 ahead of goal vs last month" progress={82} icon={<CheckCircle2 className="h-5 w-5" />} />
            <Kpi title="Completion Rate" value="94%" trend="+4%" detail="Top 5% of global workspaces" progress={94} icon={<TrendingUp className="h-5 w-5" />} primary />
            <Kpi title="Focus Time" value="28.4h" trend="+8%" detail="Avg 5.6h/day across sprints" progress={71} icon={<Timer className="h-5 w-5" />} />
            <Kpi title="Average Task Time" value="42m" trend="-4m" detail="Optimized resolution speed" progress={65} icon={<Zap className="h-5 w-5" />} down />
          </section>

          <section className="grid gap-6 lg:grid-cols-12">
            <article className="rounded-2xl border border-neutral-200 bg-white p-6 lg:col-span-8">
              <div className="flex items-start justify-between gap-4">
                <div><h2 className="text-lg font-semibold text-neutral-950">Weekly Output</h2><p className="mt-1 text-xs text-neutral-400">Daily task delivery vs planned workload</p></div>
                <div className="flex gap-4 text-[10px] font-medium text-neutral-500"><span>■ Completed</span><span className="text-neutral-300">■ Planned</span></div>
              </div>
              <div className="mt-8 flex h-[250px] items-end justify-between gap-3 border-b border-neutral-200 px-2">
                {output.map((item) => (
                  <div key={item.day} className="flex h-full flex-1 flex-col items-center justify-end">
                    {item.peak && <span className="mb-2 rounded-lg bg-neutral-900 px-2 py-1 text-[9px] font-semibold text-white">Peak Output</span>}
                    <div className="relative flex h-[190px] w-full max-w-[48px] items-end justify-center">
                      <div className="absolute bottom-0 w-7 rounded-t bg-neutral-200" style={{ height: `${item.planned * 5.5}px` }} />
                      <div className="absolute bottom-0 w-7 rounded-t bg-[#4143D5]" style={{ height: `${item.done * 5.5}px` }} />
                    </div>
                    <span className={`mt-3 text-[11px] font-semibold ${item.peak ? "text-[#4143D5]" : "text-neutral-500"}`}>{item.day}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap justify-between gap-2 rounded-xl bg-neutral-50 px-4 py-3 text-[10px] text-neutral-500"><span>Average pace: <strong className="text-neutral-800">21.2 tasks/day</strong> during work hours</span><span className="font-semibold text-[#4143D5]">High consistency · 93.4% accuracy</span></div>
            </article>

            <article className="rounded-2xl border border-neutral-200 bg-white p-6 lg:col-span-4">
              <div className="flex justify-between"><div><h2 className="text-lg font-semibold text-neutral-950">Monthly Goals</h2><p className="mt-1 text-xs text-neutral-400">Q4 Sprint Commitments</p></div><span className="h-fit rounded-md bg-neutral-100 px-2 py-1 text-[10px] text-neutral-500">Oct 2026</span></div>
              <div className="my-6 flex flex-col items-center">
                <div className="flex h-36 w-36 items-center justify-center rounded-full bg-[conic-gradient(#4143D5_0_75%,#EDEDF1_75%_100%)]">
                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white"><span className="text-3xl font-bold text-[#4143D5]">75%</span><span className="text-[9px] font-semibold uppercase text-neutral-400">Paced</span></div>
                </div>
                <p className="mt-3 text-xs font-semibold text-neutral-800">9 of 12 milestones achieved</p>
              </div>
              <div className="space-y-2">
                <Milestone title="Ship Taskora 2.0" done />
                <Milestone title="Close Q3 Financials" done />
                <Milestone title="Draft 2027 Strategy" />
              </div>
            </article>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold text-neutral-950">Productivity Heatmap</h2><p className="mt-1 text-xs text-neutral-400">12-week velocity matrix & habit regularity</p></div><span className="rounded-md bg-neutral-100 px-2 py-1 text-[10px] font-medium text-neutral-500">18-Day Streak</span></div>
              <div className="mt-5 rounded-xl bg-neutral-50 p-3 text-xs text-neutral-600"><strong>Oct 23:</strong> 14 tasks completed · 4.2h focus time <span className="float-right font-semibold text-[#4143D5]">Peak Day</span></div>
              <div className="mt-5 grid grid-cols-12 gap-1.5">
                {heat.map((level, index) => <span key={index} className={`aspect-square rounded-[3px] ${level === 3 ? "bg-[#4143D5]" : level === 2 ? "bg-[#5E62F2]" : level === 1 ? "bg-[#C0C1FF]" : "bg-neutral-100"}`} />)}
              </div>
              <div className="mt-4 flex justify-between text-[10px] text-neutral-400"><span>Aug — Oct</span><span>Less · · · More</span></div>
            </article>

            <article className="rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex items-start justify-between"><div><h2 className="text-lg font-semibold text-neutral-950">Focus Allocation</h2><p className="mt-1 text-xs text-neutral-400">Time distribution by active workspace</p></div><span className="rounded-md bg-neutral-100 px-2 py-1 text-[10px] text-neutral-500">28.4h Total</span></div>
              <div className="mt-7 grid items-center gap-6 sm:grid-cols-2">
                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full bg-[conic-gradient(#4143D5_0_40%,#5E62F2_40%_70%,#C0C1FF_70%_90%,#D9DADE_90%_100%)]">
                  <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white"><span className="text-xl font-bold">28.4h</span><span className="text-[9px] uppercase text-neutral-400">Logged</span></div>
                </div>
                <div className="space-y-2">
                  <Allocation label="Work" time="11.4h" value="40%" dot="bg-[#4143D5]" />
                  <Allocation label="Personal" time="8.5h" value="30%" dot="bg-[#5E62F2]" />
                  <Allocation label="Learning" time="5.7h" value="20%" dot="bg-[#C0C1FF]" />
                  <Allocation label="Other" time="2.8h" value="10%" dot="bg-neutral-300" />
                </div>
              </div>
            </article>
          </section>

          <section className="flex flex-col justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-100 p-5 md:flex-row md:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4143D5] text-white"><Sparkles className="h-5 w-5" /></div>
              <div><p className="text-sm font-semibold text-neutral-900">AI Weekly Summary · Optimum Velocity Detected</p><p className="mt-1 text-xs text-neutral-500">Your peak focus window occurs on Thursdays between 09:30 AM and 01:15 PM with 32% lower interruption rates.</p></div>
            </div>
            <button type="button" className="h-9 shrink-0 rounded-lg bg-white px-4 text-xs font-semibold text-neutral-700 shadow-sm">Adjust Schedule</button>
          </section>
        </div>
      </main>
    </div>
  )
}

function Kpi({ title, value, trend, detail, progress, icon, primary = false, down = false }: { title: string; value: string; trend: string; detail: string; progress: number; icon: React.ReactNode; primary?: boolean; down?: boolean }) {
  return <article className="rounded-2xl border border-neutral-200 bg-white p-5"><div className="flex items-center justify-between text-xs text-neutral-500"><span>{title}</span><span className={primary ? "text-[#4143D5]" : "text-neutral-400"}>{icon}</span></div><div className="mt-4 flex items-baseline gap-2"><span className={`text-[28px] font-bold tracking-[-0.03em] ${primary ? "text-[#4143D5]" : "text-neutral-950"}`}>{value}</span><span className="flex items-center gap-1 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">{down ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}{trend}</span></div><p className="mt-1 text-[10px] text-neutral-400">{detail}</p><div className="mt-4 h-1 overflow-hidden rounded-full bg-neutral-100"><div className="h-full rounded-full bg-[#4143D5]" style={{ width: `${progress}%` }} /></div></article>
}

function Milestone({ title, done = false }: { title: string; done?: boolean }) {
  return <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-2.5"><div className="flex min-w-0 items-center gap-2"><span className={done ? "text-emerald-500" : "text-[#5E62F2]"}>{done ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}</span><span className="truncate text-xs font-medium text-neutral-700">{title}</span></div><span className={`rounded-md px-2 py-1 text-[9px] font-semibold ${done ? "bg-emerald-50 text-emerald-700" : "bg-[#EEEEFF] text-[#4143D5]"}`}>{done ? "Done" : "In Progress"}</span></div>
}

function Allocation({ label, time, value, dot }: { label: string; time: string; value: string; dot: string }) {
  return <div className="flex items-center justify-between rounded-lg bg-neutral-50 p-2.5"><div className="flex items-center gap-2"><span className={`h-2.5 w-2.5 rounded-full ${dot}`} /><span className="text-xs font-medium text-neutral-700">{label}</span></div><div className="flex gap-3 text-[10px]"><span className="text-neutral-400">{time}</span><span className="font-semibold text-[#4143D5]">{value}</span></div></div>
}
