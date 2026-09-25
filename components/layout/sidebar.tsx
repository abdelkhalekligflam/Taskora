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
  Target,
  Sparkles,
} from "lucide-react"

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Daily",
    href: "/dashboard/daily",
    icon: CheckSquare2,
  },
  {
    name: "Weekly",
    href: "/dashboard/weekly",
    icon: CalendarDays,
  },
  {
    name: "Monthly",
    href: "/dashboard/monthly",
    icon: CalendarRange,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Goals",
    href: "/dashboard/goals",
    icon: Target,
  },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-neutral-200 bg-white lg:flex lg:flex-col">
      {/* LOGO */}
      <div className="flex h-[72px] items-center px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4143D5] text-white">
            <Sparkles className="h-[18px] w-[18px]" />
          </div>

          <div>
            <p className="text-[17px] font-bold tracking-tight text-neutral-950">
              Taskora
            </p>

            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-neutral-400">
              Workspace
            </p>
          </div>
        </Link>
      </div>

      {/* WORKSPACE */}
      <div className="px-4 pt-3">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-left transition hover:bg-neutral-100"
        >
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-neutral-900">
              Personal Workspace
            </p>

            <p className="mt-0.5 text-[10px] text-neutral-400">
              Free plan
            </p>
          </div>

          <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
        </button>
      </div>

      {/* NAVIGATION */}
      <div className="mt-8 px-3">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
          Workspace
        </p>

        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon

            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition ${
                  active
                    ? "bg-[#EEEEFF] text-[#4143D5]"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />

                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="mt-auto border-t border-neutral-100 p-3">
        <Link
          href="/dashboard/settings"
          className="flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-950"
        >
          <Settings className="h-[18px] w-[18px]" />
          Settings
        </Link>

        <button
          type="button"
          className="flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-950"
        >
          <CircleHelp className="h-[18px] w-[18px]" />
          Help & support
        </button>

        <div className="mt-3 flex items-center gap-3 rounded-xl px-3 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E9E9FF] text-xs font-bold text-[#4143D5]">
            AK
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-neutral-900">
              My Account
            </p>

            <p className="truncate text-[10px] text-neutral-400">
              Taskora member
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}