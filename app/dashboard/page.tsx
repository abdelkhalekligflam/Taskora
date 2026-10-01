"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { CalendarDays, CheckCircle2, Clock3, Command, Plus, Search, Target } from "lucide-react"
import { usePreferences } from "@/components/providers/preferences-provider"
import { createClient } from "@/lib/supabase/client"
import NotificationBell from "@/components/notifications/notification-bell"

type Task = {
  id: string
  title: string
  status: string
  priority: "low" | "medium" | "high"
  scheduled_at: string | null
  duration_minutes: number | null
  created_at: string
  completed_at: string | null
}

type Goal = {
  id: string
  title: string
  status: "active" | "completed" | "paused" | "archived"
  current_value: number
  target_value: number | null
  unit: string | null
  target_date: string | null
}

const supabase = createClient()

const copy = {
  en: { total:"total", minutes:"min", pending:"pending", notifications:"Notifications", noPriorities:"No pending priorities", noPrioritiesDetail:"Your pending tasks will appear here.", goals:"Goals", noGoals:"No active goals yet.", viewGoals:"View goals", high:"High", medium:"Medium", low:"Low" },
  fr: { total:"au total", minutes:"min", pending:"en attente", notifications:"Notifications", noPriorities:"Aucune priorité en attente", noPrioritiesDetail:"Vos tâches en attente apparaîtront ici.", goals:"Objectifs", noGoals:"Aucun objectif actif.", viewGoals:"Voir les objectifs", high:"Haute", medium:"Moyenne", low:"Basse" },
  ar: { total:"المجموع", minutes:"دقيقة", pending:"قيد الانتظار", notifications:"الإشعارات", noPriorities:"لا توجد أولويات معلقة", noPrioritiesDetail:"ستظهر هنا مهامك المعلقة.", goals:"الأهداف", noGoals:"لا توجد أهداف نشطة بعد.", viewGoals:"عرض الأهداف", high:"عالية", medium:"متوسطة", low:"منخفضة" },
} as const

export default function DashboardPage() {
  const { t, language } = usePreferences()
  const tx = copy[language]
  const [tasks, setTasks] = useState<Task[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [focusMinutes, setFocusMinutes] = useState(0)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("tasks")
        .select("id,title,status,priority,scheduled_at,duration_minutes,created_at,completed_at")
      setTasks((data ?? []) as Task[])

      const { data: goalData } = await supabase
        .from("goals")
        .select("id,title,status,current_value,target_value,unit,target_date")
        .neq("status", "archived")
        .order("created_at", { ascending: false })
      setGoals((goalData ?? []) as Goal[])

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const { data: sessions } = await supabase
        .from("focus_sessions")
        .select("duration_minutes")
        .gte("started_at", today.toISOString())
        .lt("started_at", tomorrow.toISOString())
      setFocusMinutes((sessions ?? []).reduce((sum, session) => sum + (session.duration_minutes ?? 0), 0))
    }
    void load()
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

  const todayKey = new Date().toDateString()
  const todayTasks = useMemo(() => tasks.filter((task) => {
    if (task.scheduled_at) return new Date(task.scheduled_at).toDateString() === todayKey
    return new Date(task.created_at).toDateString() === todayKey
  }), [tasks, todayKey])
  const completedToday = useMemo(() => tasks.filter((task) =>
    task.status === "completed" && task.completed_at && new Date(task.completed_at).toDateString() === todayKey
  ).length, [tasks, todayKey])
  const pendingToday = useMemo(() => todayTasks.filter((task) => task.status !== "completed").length, [todayTasks])
  const dailyTotal = pendingToday + completedToday
  const completion = dailyTotal ? Math.round((completedToday / dailyTotal) * 100) : 0
  const priorities = useMemo(() => tasks
    .filter((task) => task.status !== "completed" && (!task.scheduled_at || new Date(task.scheduled_at).toDateString() === todayKey))
    .sort((a, b) => {
      const weight = { high: 3, medium: 2, low: 1 }
      const priorityDiff = weight[b.priority] - weight[a.priority]
      if (priorityDiff) return priorityDiff
      if (!a.scheduled_at) return 1
      if (!b.scheduled_at) return -1
      return new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
    })
    .filter((task) => !searchQuery.trim() || task.title.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    .slice(0, 5), [tasks, searchQuery, todayKey])

  const stats = [
    { label: t.tasksCompleted, value: String(completedToday), detail: `${dailyTotal} ${tx.total}`, icon: CheckCircle2 },
    { label: t.focusTime, value: `${Math.round((focusMinutes / 60) * 10) / 10}h`, detail: `${focusMinutes} ${tx.minutes}`, icon: Clock3 },
    { label: t.dailyProgress, value: `${completion}%`, detail: `${pendingToday} ${tx.pending}`, icon: Target },
  ]

  const locale = language === "fr" ? "fr-FR" : language === "ar" ? "ar-MA" : "en-US"

  return <div className="min-h-screen bg-[#F9F9FD]">
    <header className="flex h-[72px] items-center justify-between border-b border-neutral-200 bg-white px-4 sm:px-8 lg:px-10">
      <div className="relative w-full max-w-[420px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"/>
        <input ref={searchInputRef} type="text" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder={t.search} className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-16 text-sm text-neutral-900 outline-none focus:border-[#4143D5] focus:bg-white focus:ring-2 focus:ring-[#4143D5]/10"/>
        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[10px] text-neutral-400"><Command className="h-3 w-3"/><span>K</span></div>
      </div>
      <div className="ml-3 flex items-center gap-2 sm:ml-6 sm:gap-3">
        <div className="hidden sm:block"><NotificationBell /></div>
        <Link href="/dashboard/daily" className="flex h-10 items-center gap-2 rounded-lg bg-[#4143D5] px-3 text-sm font-semibold text-white sm:px-4"><Plus className="h-4 w-4"/><span className="hidden sm:inline">{t.newTask}</span></Link>
      </div>
    </header>

    <main className="px-4 py-7 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1440px]">
        <div className="flex items-end justify-between gap-6">
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4143D5]">{t.overview}</p><h1 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-neutral-950">{t.goodMorning}</h1><p className="mt-2 text-sm text-neutral-500">{t.overviewIntro}</p></div>
          <div className="hidden items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 md:flex"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEEEFF] text-[#4143D5]"><CalendarDays className="h-[18px] w-[18px]"/></div><div><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{t.today}</p><p className="mt-0.5 text-sm font-semibold text-neutral-900">{new Date().toLocaleDateString(locale,{month:"long",day:"numeric",year:"numeric"})}</p></div></div>
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">{stats.map((stat)=>{const Icon=stat.icon;return <article key={stat.label} className="rounded-2xl border border-neutral-200 bg-white p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-medium text-neutral-500">{stat.label}</p><p className="mt-3 text-2xl font-semibold text-neutral-950">{stat.value}</p></div><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEEEFF] text-[#4143D5]"><Icon className="h-[18px] w-[18px]"/></div></div><p className="mt-5 border-t border-neutral-100 pt-4 text-xs text-neutral-400">{stat.detail}</p></article>})}</section>

        <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4"><div><h2 className="text-sm font-semibold text-neutral-950">{t.todaysPriorities}</h2><p className="mt-1 text-xs text-neutral-400">{t.prioritiesIntro}</p></div><Link href="/dashboard/daily" className="text-xs font-semibold text-[#4143D5]">{t.viewDaily}</Link></div>
          {priorities.length ? <div className="mt-5 divide-y divide-neutral-100">{priorities.map((task)=><div key={task.id} className="flex items-center gap-3 py-3"><span className={`h-2 w-2 shrink-0 rounded-full ${task.priority==="high"?"bg-red-500":task.priority==="medium"?"bg-amber-500":"bg-blue-500"}`}/><p className="min-w-0 flex-1 truncate text-sm font-medium text-neutral-800">{task.title}</p><span className="rounded-md bg-neutral-100 px-2 py-1 text-[10px] font-semibold text-neutral-500">{tx[task.priority]}</span>{task.scheduled_at&&<span className="hidden text-xs text-neutral-400 sm:inline">{new Date(task.scheduled_at).toLocaleDateString(locale,{month:"short",day:"numeric"})}</span>}</div>)}</div> : <div className="mt-5 flex min-h-[150px] items-center justify-center rounded-xl border border-dashed border-neutral-200 bg-neutral-50/60 text-center"><div><CheckCircle2 className="mx-auto h-5 w-5 text-neutral-300"/><p className="mt-3 text-sm font-medium text-neutral-600">{tx.noPriorities}</p><p className="mt-1 text-xs text-neutral-400">{tx.noPrioritiesDetail}</p></div></div>}
        </section>

        <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4"><h2 className="text-sm font-semibold text-neutral-950">{tx.goals}</h2><Link href="/dashboard/goals" className="text-xs font-semibold text-[#4143D5]">{tx.viewGoals}</Link></div>
          {goals.filter((goal)=>goal.status==="active").length ? <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{goals.filter((goal)=>goal.status==="active").slice(0,3).map((goal)=>{const progress=goal.target_value&&goal.target_value>0?Math.min(100,Math.round((goal.current_value/goal.target_value)*100)):0;return <Link href="/dashboard/goals" key={goal.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-4"><div className="flex items-center justify-between gap-3"><p className="truncate text-sm font-semibold text-neutral-800">{goal.title}</p><span className="text-xs font-semibold text-[#4143D5]">{progress}%</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-neutral-200"><div className="h-full rounded-full bg-[#4143D5]" style={{width:`${progress}%`}}/></div><p className="mt-2 text-xs text-neutral-400">{goal.current_value}{goal.unit?` ${goal.unit}`:""} / {goal.target_value??"—"}{goal.unit?` ${goal.unit}`:""}</p></Link>})}</div>:<p className="mt-5 text-sm text-neutral-400">{tx.noGoals}</p>}
        </section>
      </div>
    </main>
  </div>
}
