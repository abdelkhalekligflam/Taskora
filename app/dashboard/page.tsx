"use client"

import { usePreferences } from "@/components/providers/preferences-provider"
import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Command,
  Flame,
  Plus,
  Search,
  Target,
  TrendingUp,
} from "lucide-react"

export default function DashboardPage() {
  const { t, language } = usePreferences()
  const [tasks,setTasks]=useState<{id:string;status:string;duration_minutes:number|null}[]>([])
  useEffect(()=>{async function load(){const {data}=await supabase.from("tasks").select("id,status,duration_minutes");setTasks(data??[])}void load()},[])
  const completed=useMemo(()=>tasks.filter(x=>x.status==="completed").length,[tasks])
  const minutes=tasks.reduce((sum,x)=>sum+(x.duration_minutes??0),0)
  const completion=tasks.length?Math.round(completed/tasks.length*100):0
  const translatedStats = [
    { label:t.tasksCompleted,value:String(completed),detail:`${tasks.length} total`,icon:CheckCircle2 },
    { label:t.focusTime,value:`${Math.round(minutes/60*10)/10}h`,detail:`${minutes} min`,icon:Clock3 },
    { label:t.dailyProgress,value:`${completion}%`,detail:`${tasks.length-completed} pending`,icon:Target },
  ]
  return (
    <div className="min-h-screen bg-[#F9F9FD]">
      <header className="flex h-[72px] items-center justify-between border-b border-neutral-200 bg-white px-8 lg:px-10">
        <div className="relative w-full max-w-[420px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

          <input
            type="text"
            placeholder={t.search}
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-16 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#4143D5] focus:bg-white focus:ring-2 focus:ring-[#4143D5]/10"
          />

          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[10px] text-neutral-400">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>

        <div className="ml-6 flex items-center gap-3">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#4143D5]" />
          </button>

          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-lg bg-[#4143D5] px-4 text-sm font-semibold text-white transition hover:bg-[#3638BD]"
          >
            <Plus className="h-4 w-4" />
            {t.newTask}
          </button>
        </div>
      </header>

      <div className="px-8 py-8 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4143D5]">
                {t.overview}
              </p>

              <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-neutral-950">
                {t.goodMorning}
              </h1>

              <p className="mt-2 text-sm text-neutral-500">
                {t.overviewIntro}
              </p>
            </div>

            <div className="hidden items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 md:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEEEFF] text-[#4143D5]">
                <CalendarDays className="h-[18px] w-[18px]" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  {t.today}
                </p>
                <p className="mt-0.5 text-sm font-semibold text-neutral-900">
                  {new Date().toLocaleDateString(language === "fr" ? "fr-FR" : language === "ar" ? "ar-MA" : "en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>
          </div>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {translatedStats.map((stat) => {
              const Icon = stat.icon

              return (
                <article
                  key={stat.label}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-neutral-500">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-neutral-950">
                        {stat.value}
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEEEFF] text-[#4143D5]">
                      <Icon className="h-[18px] w-[18px]" />
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-1.5 border-t border-neutral-100 pt-4">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    <p className="text-xs text-neutral-400">{stat.detail}</p>
                  </div>
                </article>
              )
            })}
          </section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="min-h-[260px] rounded-2xl border border-neutral-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-950">
                    {t.todaysPriorities}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {t.prioritiesIntro}
                  </p>
                </div>

                <button
                  type="button"
                  className="text-xs font-semibold text-[#4143D5] transition hover:text-[#3638BD]"
                >
                  {t.viewDaily}
                </button>
              </div>

              <div className="mt-8 flex min-h-[150px] items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60">
                <div className="text-center">
                  <CheckCircle2 className="mx-auto h-5 w-5 text-neutral-300" />
                  <p className="mt-3 text-sm font-medium text-neutral-600">
                    {t.prioritiesEmpty}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {t.prioritiesEmptyDetail}
                  </p>
                </div>
              </div>
            </div>

            </section>
        </div>
      </div>
    </div>
  )
}
