"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { usePreferences } from "@/components/providers/preferences-provider"

type Task={id:string;title:string;category:string|null;status:"todo"|"in_progress"|"completed";scheduled_at:string|null;duration_minutes:number|null}
const supabase=createClient()
const tx={en:{title:"Weekly Planner",intro:"Your real scheduled tasks for this week.",today:"Today",planned:"Planned",completed:"Completed",pending:"Pending",empty:"No scheduled tasks",loading:"Loading week..."},fr:{title:"Planificateur hebdomadaire",intro:"Vos vraies tâches planifiées pour cette semaine.",today:"Aujourd'hui",planned:"Planifiées",completed:"Terminées",pending:"En attente",empty:"Aucune tâche planifiée",loading:"Chargement de la semaine..."},ar:{title:"المخطط الأسبوعي",intro:"مهامك الحقيقية المجدولة لهذا الأسبوع.",today:"اليوم",planned:"المجدولة",completed:"المكتملة",pending:"المتبقية",empty:"لا توجد مهام مجدولة",loading:"جاري تحميل الأسبوع..."}} as const
const locale={en:"en-US",fr:"fr-FR",ar:"ar-MA"} as const
function startOfWeek(d:Date){const x=new Date(d);const day=(x.getDay()+6)%7;x.setDate(x.getDate()-day);x.setHours(0,0,0,0);return x}
export default function WeeklyPage(){
 const {language}=usePreferences();const t=tx[language]
 const [week,setWeek]=useState(()=>startOfWeek(new Date()));const [tasks,setTasks]=useState<Task[]>([]);const[loading,setLoading]=useState(true);const[error,setError]=useState<string|null>(null)
 useEffect(()=>{async function load(){setLoading(true);setError(null);const end=new Date(week);end.setDate(end.getDate()+7);const{data,error}=await supabase.from("tasks").select("id,title,category,status,scheduled_at,duration_minutes").gte("scheduled_at",week.toISOString()).lt("scheduled_at",end.toISOString()).order("scheduled_at",{ascending:true});if(error)setError(error.message);else setTasks((data??[]) as Task[]);setLoading(false)}void load()},[week])
 const days=useMemo(()=>Array.from({length:7},(_,i)=>{const d=new Date(week);d.setDate(d.getDate()+i);return d}),[week])
 const byDay=(d:Date)=>tasks.filter(x=>x.scheduled_at&&new Date(x.scheduled_at).toDateString()===d.toDateString())
 const completed=tasks.filter(x=>x.status==="completed").length
 function move(n:number){const d=new Date(week);d.setDate(d.getDate()+n*7);setWeek(d)}
 function today(){setWeek(startOfWeek(new Date()))}
 return <div className="min-h-screen bg-[#F9F9FD] px-8 py-8 lg:px-10"><div className="mx-auto max-w-[1600px]">
  <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><div><p className="text-[11px] font-semibold uppercase tracking-[.15em] text-[#4143D5]">{t.title}</p><h1 className="mt-2 text-[32px] font-semibold text-neutral-950">{week.toLocaleDateString(locale[language],{month:"short",day:"numeric"})} – {days[6].toLocaleDateString(locale[language],{month:"short",day:"numeric",year:"numeric"})}</h1><p className="mt-1 text-sm text-neutral-500">{t.intro}</p></div><div className="flex h-10 items-center rounded-xl border border-neutral-200 bg-white p-1"><button onClick={()=>move(-1)} className="h-8 w-8"><ChevronLeft className="mx-auto h-4 w-4"/></button><button onClick={today} className="h-8 rounded-lg bg-neutral-100 px-4 text-xs font-semibold">{t.today}</button><button onClick={()=>move(1)} className="h-8 w-8"><ChevronRight className="mx-auto h-4 w-4"/></button></div></section>
  <section className="mt-6 grid gap-4 sm:grid-cols-3"><Stat label={t.planned} value={tasks.length}/><Stat label={t.completed} value={completed}/><Stat label={t.pending} value={tasks.length-completed}/></section>
  {error&&<div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
  {loading?<div className="flex min-h-[400px] items-center justify-center text-neutral-400"><Loader2 className="me-2 h-5 w-5 animate-spin"/>{t.loading}</div>:<section className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-7">{days.map(d=>{const list=byDay(d);const isToday=d.toDateString()===new Date().toDateString();return <article key={d.toISOString()} className={`min-h-[420px] rounded-2xl border bg-white p-3 ${isToday?"border-[#4143D5]":"border-neutral-200"}`}><div className={`-mx-3 -mt-3 mb-3 rounded-t-2xl p-3 ${isToday?"bg-[#4143D5] text-white":"bg-neutral-50"}`}><p className="text-[10px] font-semibold uppercase">{d.toLocaleDateString(locale[language],{weekday:"short"})}</p><p className="mt-1 text-xl font-bold">{d.getDate()}</p></div><div className="space-y-2">{list.length===0?<p className="py-8 text-center text-[10px] text-neutral-400">{t.empty}</p>:list.map(task=><div key={task.id} className="rounded-xl border border-neutral-100 bg-neutral-50 p-2.5"><div className="flex items-center justify-between gap-2"><span className="flex items-center gap-1 text-[10px] text-neutral-400"><Clock3 className="h-3 w-3"/>{new Date(task.scheduled_at!).toLocaleTimeString(locale[language],{hour:"2-digit",minute:"2-digit"})}</span>{task.status==="completed"&&<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500"/>}</div><p className="mt-2 text-xs font-semibold text-neutral-800">{task.title}</p>{task.category&&<p className="mt-1 text-[9px] text-neutral-400">{task.category}</p>}</div>)}</div></article>})}</section>}
 </div></div>
}
function Stat({label,value}:{label:string;value:number}){return <div className="rounded-2xl border border-neutral-200 bg-white p-5"><p className="text-xs text-neutral-400">{label}</p><p className="mt-2 text-2xl font-bold text-neutral-950">{value}</p></div>}
