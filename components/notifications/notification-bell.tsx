"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Bell, CheckCheck, Clock3, Loader2, X } from "lucide-react"

import { createClient } from "@/lib/supabase/client"
import { usePreferences } from "@/components/providers/preferences-provider"

type Reminder = {
  id: string
  remind_at: string
  delivered_at: string | null
  read_at: string | null
  tasks: { title: string; scheduled_at: string | null } | null
}

const supabase = createClient()

const copy = {
  en: { label: "Notifications", title: "Reminders", empty: "No reminders yet.", markAll: "Mark all read", due: "Task reminder", loading: "Loading...", unread: "unread", task: "Task" },
  fr: { label: "Notifications", title: "Rappels", empty: "Aucun rappel pour le moment.", markAll: "Tout marquer comme lu", due: "Rappel de tâche", loading: "Chargement...", unread: "non lus", task: "Tâche" },
  ar: { label: "الإشعارات", title: "التذكيرات", empty: "لا توجد تذكيرات بعد.", markAll: "تحديد الكل كمقروء", due: "تذكير بالمهمة", loading: "جار التحميل...", unread: "غير مقروء", task: "مهمة" },
} as const

export default function NotificationBell() {
  const { language } = usePreferences()
  const t = copy[language]
  const locale = language === "fr" ? "fr-FR" : language === "ar" ? "ar-MA" : "en-US"
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Reminder[]>([])
  const [loading, setLoading] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from("task_reminders")
      .select("id,remind_at,delivered_at,read_at,tasks(title,scheduled_at)")
      .eq("status", "delivered")
      .order("delivered_at", { ascending: false })
      .limit(20)
    setItems((data ?? []) as unknown as Reminder[])
    setLoading(false)
  }, [])

  useEffect(() => {
    // Initial remote notification synchronization.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  useEffect(() => {
    const timer = window.setInterval(() => void load(), 60_000)
    return () => window.clearInterval(timer)
  }, [load])

  useEffect(() => {
    function close(event: MouseEvent) {
      if (root.current && !root.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", close)
    return () => document.removeEventListener("mousedown", close)
  }, [])

  const unread = items.filter((item) => !item.read_at).length

  async function markRead(id: string) {
    const now = new Date().toISOString()
    const { error } = await supabase.from("task_reminders").update({ read_at: now }).eq("id", id)
    if (!error) setItems((current) => current.map((item) => item.id === id ? { ...item, read_at: now } : item))
  }

  async function markAllRead() {
    const ids = items.filter((item) => !item.read_at).map((item) => item.id)
    if (!ids.length) return
    const now = new Date().toISOString()
    const { error } = await supabase.from("task_reminders").update({ read_at: now }).in("id", ids)
    if (!error) setItems((current) => current.map((item) => ({ ...item, read_at: item.read_at ?? now })))
  }

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        onClick={() => { setOpen((value) => !value); if (!open) void load() }}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 dark:border-neutral-700 dark:bg-[#252830] dark:text-neutral-300"
        aria-label={t.label}
      >
        <Bell className="h-[18px] w-[18px]" />
        {unread > 0 && <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#4143D5] px-1 text-[9px] font-bold text-white">{unread > 9 ? "9+" : unread}</span>}
      </button>

      {open && (
        <div className="absolute right-0 z-[120] mt-2 w-[360px] overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-[#1C1F26] rtl:left-0 rtl:right-auto">
          <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
            <div>
              <p className="text-sm font-semibold text-neutral-950 dark:text-white">{t.title}</p>
              <p className="text-[10px] text-neutral-400">{unread} {t.unread}</p>
            </div>
            <div className="flex items-center gap-1">
              {unread > 0 && <button type="button" onClick={() => void markAllRead()} className="flex h-8 items-center gap-1 rounded-lg px-2 text-[10px] font-semibold text-[#4143D5] hover:bg-[#EEEEFF] dark:hover:bg-[#30314F]"><CheckCheck className="h-3.5 w-3.5" />{t.markAll}</button>}
              <button type="button" onClick={() => setOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="flex h-32 items-center justify-center gap-2 text-xs text-neutral-400"><Loader2 className="h-4 w-4 animate-spin" />{t.loading}</div>
            ) : items.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-xs text-neutral-400">{t.empty}</div>
            ) : items.map((item) => (
              <button key={item.id} type="button" onClick={() => void markRead(item.id)} className={`block w-full border-b border-neutral-100 px-4 py-3 text-left last:border-0 dark:border-neutral-800 ${item.read_at ? "bg-white dark:bg-[#1C1F26]" : "bg-[#F7F7FF] dark:bg-[#25263A]"}`}>
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#EEEEFF] text-[#4143D5] dark:bg-[#30314F] dark:text-[#AEB0FF]"><Clock3 className="h-4 w-4" /></span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#4143D5]">{t.due}</p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.tasks?.title ?? t.task}</p>
                    <p className="mt-1 text-[10px] text-neutral-400">{new Date(item.delivered_at ?? item.remind_at).toLocaleString(locale)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
