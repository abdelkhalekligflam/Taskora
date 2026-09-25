"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  CalendarDays,
  CalendarRange,
  CheckSquare2,
  ChevronDown,
  CircleHelp,
  LayoutDashboard,
  Settings,
  Sparkles,
  Target,
} from "lucide-react"

import { usePreferences } from "@/components/providers/preferences-provider"

const navigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Daily", href: "/dashboard/daily", icon: CheckSquare2 },
  { name: "Weekly", href: "/dashboard/weekly", icon: CalendarDays },
  { name: "Monthly", href: "/dashboard/monthly", icon: CalendarRange },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Goals", href: "/dashboard/goals", icon: Target },
  { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { t } = usePreferences()

  const navLabel = (name: string) =>
    ({ Overview: t.overview, Daily: t.daily, Weekly: t.weekly, Monthly: t.monthly, Analytics: t.analytics, Goals: t.goals, Calendar: t.calendar } as Record<string, string>)[name] ?? name

  return (
    <aside className="fixed inset-y-0 left-0 rtl:left-auto rtl:right-0 z-40 hidden w-[248px] border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-[#1C1F26] lg:flex lg:flex-col">
      <div className="flex h-[72px] items-center px-6">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4143D5] text-white">
            <Sparkles className="h-[18px] w-[18px]" />
          </div>
          <div>
            <p className="text-[17px] font-bold tracking-tight text-neutral-950 dark:text-neutral-100">Taskora</p>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">{t.workspace}</p>
          </div>
        </Link>
      </div>

      <div className="px-4 pt-3">
        <button type="button" className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-left transition hover:bg-neutral-100 dark:border-neutral-800 dark:bg-[#252830] dark:hover:bg-[#2D3039]">
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100">{t.personalWorkspace}</p>
            <p className="mt-0.5 text-[10px] text-neutral-400">{t.freePlan}</p>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
        </button>
      </div>

      <div className="mt-8 px-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">{t.workspace}</p>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)

            return (
              <Link key={item.name} href={item.href} className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${active ? "bg-[#EEEEFF] text-[#4143D5] dark:bg-[#30314F] dark:text-[#AEB0FF]" : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-[#252830] dark:hover:text-neutral-100"}`}>
                <Icon className="h-[18px] w-[18px]" />
                <span>{navLabel(item.name)}</span>
              </Link>
            )
          })}
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
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E9E9FF] text-xs font-bold text-[#4143D5]">AK</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100">{t.myAccount}</p>
            <p className="truncate text-[10px] text-neutral-400">{t.member}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
