"use client"

import Image from "next/image"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  BarChart3,
  CalendarDays,
  CalendarRange,
  CheckSquare2,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  TimerReset,
  FileDown,
  Settings,
  Target,
} from "lucide-react"

import { usePreferences } from "@/components/providers/preferences-provider"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Daily", href: "/dashboard/daily", icon: CheckSquare2 },
  { name: "Weekly", href: "/dashboard/weekly", icon: CalendarDays },
  { name: "Monthly", href: "/dashboard/monthly", icon: CalendarRange },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Goals", href: "/dashboard/goals", icon: Target },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
  { name: "Focus", href: "/dashboard/focus", icon: TimerReset, pro: true },
  { name: "Reports", href: "/dashboard/reports", icon: FileDown, pro: true },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { t, language } = usePreferences()
  const [plan, setPlan] = useState<"free" | "pro">("free")
  const [accountName, setAccountName] = useState("")
  const [accountEmail, setAccountEmail] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const loadAccount = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setAccountEmail(user.email ?? "")
      const { data } = await supabase.from("profiles").select("plan,full_name,avatar_url").eq("user_id", user.id).maybeSingle()
      setPlan(data?.plan === "pro" ? "pro" : "free")
      setAccountName(data?.full_name ?? "")
      setAvatarUrl(data?.avatar_url ?? null)
    }
    void loadAccount()
    const reload = () => void loadAccount()
    window.addEventListener("taskora-preferences-updated", reload)
    return () => window.removeEventListener("taskora-preferences-updated", reload)
  }, [])

  async function signOut() {
    await supabase.auth.signOut()
    router.replace("/auth")
    router.refresh()
  }

  const initials = (accountName || accountEmail || "T").trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("") || "T"
  const logoutLabel = language === "fr" ? "Déconnexion" : language === "ar" ? "تسجيل الخروج" : "Sign out"
  const openNavLabel = language === "fr" ? "Ouvrir la navigation" : language === "ar" ? "فتح القائمة" : "Open navigation"
  const closeNavLabel = language === "fr" ? "Fermer la navigation" : language === "ar" ? "إغلاق القائمة" : "Close navigation"

  const navLabel = (name: string) =>
    ({ Overview: t.overview, Daily: t.daily, Weekly: t.weekly, Monthly: t.monthly, Analytics: t.analytics, Goals: t.goals, Calendar: t.calendar, Focus: language === "fr" ? "Focus" : language === "ar" ? "التركيز" : "Focus", Reports: language === "fr" ? "Rapports" : language === "ar" ? "التقارير" : "Reports" } as Record<string, string>)[name] ?? name

  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false)
    }
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKeyDown)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [mobileOpen])

  const navItems = navigation.map((item) => {
    const Icon = item.icon
    const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)
    return <Link key={item.name} href={item.href} onClick={() => setMobileOpen(false)} className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${active ? "bg-[#EEEEFF] text-[#4143D5] dark:bg-[#30314F] dark:text-[#AEB0FF]" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-[#252830] dark:hover:text-neutral-100"}`}><Icon className="h-[18px] w-[18px]" /><span>{navLabel(item.name)}</span>{item.pro && <span className="ms-auto rounded bg-[#EEEEFF] px-1.5 py-0.5 text-[8px] font-bold uppercase text-[#4143D5] dark:bg-[#30314F] dark:text-[#AEB0FF]">Pro</span>}</Link>
  })

  return (
    <>
    <button type="button" onClick={() => setMobileOpen(true)} aria-label={openNavLabel} aria-expanded={mobileOpen} className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-[#4143D5] text-white shadow-lg lg:hidden rtl:left-auto rtl:right-4"><Menu className="h-5 w-5" /></button>
    {mobileOpen && <div className="fixed inset-0 z-[60] bg-black/35 lg:hidden" onClick={() => setMobileOpen(false)}><aside className="h-full w-[min(86vw,320px)] overflow-y-auto bg-white p-4 shadow-xl dark:bg-[#1C1F26]" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between px-2 py-2"><Link href="/dashboard" className="flex items-center gap-2 font-bold text-neutral-950 dark:text-neutral-100"><Image src="/taskora-logo.svg" alt="" width={32} height={32} className="h-8 w-8 object-contain" />Taskora</Link><button type="button" onClick={() => setMobileOpen(false)} aria-label={closeNavLabel} className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-[#252830]"><X className="h-5 w-5"/></button></div><nav className="mt-5 space-y-1">{navItems}</nav><div className="mt-5 border-t border-neutral-100 pt-3 dark:border-neutral-800"><Link href="/dashboard/settings" className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-neutral-500"><Settings className="h-[18px] w-[18px]"/>{t.settings}</Link><Link href="/dashboard/support" className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm text-neutral-500"><CircleHelp className="h-[18px] w-[18px]"/>{t.help}</Link><button type="button" onClick={() => void signOut()} className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm text-red-600"><LogOut className="h-[18px] w-[18px]"/>{logoutLabel}</button></div></aside></div>}
    <aside className="fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 z-40 hidden w-[248px] border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#1C1F26] lg:flex lg:flex-col">
      <div className="flex h-[72px] items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src="/taskora-logo.svg" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
          <div>
            <p className="text-[17px] font-bold tracking-tight text-neutral-950 dark:text-neutral-100">Taskora</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">{t.workspace}</p>
          </div>
        </Link>
      </div>

      <div className="px-4 pt-3">
        <div className="flex w-full items-center rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-left dark:border-neutral-800 dark:bg-[#252830]">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100">{t.personalWorkspace}</p>
            <p className="mt-0.5 text-[10px] text-neutral-400">{plan === "pro" ? "Pro" : t.freePlan}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 px-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">{t.workspace}</p>
        <nav className="space-y-1">
{navItems}
        </nav>
      </div>

      <div className="mt-auto border-t border-neutral-100 p-3 dark:border-neutral-800">
        <Link href="/dashboard/settings" className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-[#252830] dark:hover:text-neutral-100">
          <Settings className="h-[18px] w-[18px]" />
          {t.settings}
        </Link>
        <Link href="/dashboard/support" className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-[#252830] dark:hover:text-neutral-100">
          <CircleHelp className="h-[18px] w-[18px]" />
          {t.help}
        </Link>
        <div className="mt-3 flex items-center gap-3 rounded-xl px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E9E9FF] text-xs font-bold text-[#4143D5]">{avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : initials}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100">{accountName || t.myAccount}</p>
            <p className="truncate text-[10px] text-neutral-400">{accountEmail || t.member}</p>
          </div>
        </div>
        <button type="button" onClick={() => void signOut()} className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-neutral-500 transition hover:bg-red-50 hover:text-red-600 dark:text-neutral-400 dark:hover:bg-red-950/30 dark:hover:text-red-300">
          <LogOut className="h-[18px] w-[18px]" />
          {logoutLabel}
        </button>
      </div>
    </aside>
    </>
  )
}
