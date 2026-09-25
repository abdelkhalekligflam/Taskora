import {
  Bell,
  CalendarDays,
  Command,
  Plus,
  Search,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F9F9FD]">
      {/* TOP HEADER */}
      <header className="flex h-[72px] items-center justify-between border-b border-neutral-200 bg-white px-8 lg:px-10">
        {/* Search */}
        <div className="relative w-full max-w-[420px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

          <input
            type="text"
            placeholder="Search tasks, projects..."
            className="h-10 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-10 pr-16 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#4143D5] focus:bg-white focus:ring-2 focus:ring-[#4143D5]/10"
          />

          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1 text-[10px] text-neutral-400">
            <Command className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>

        {/* Actions */}
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
            New task
          </button>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <div className="px-8 py-8 lg:px-10">
        <div className="mx-auto max-w-[1440px]">
          {/* PAGE HEADING */}
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4143D5]">
                Overview
              </p>

              <h1 className="mt-2 text-[32px] font-semibold tracking-[-0.03em] text-neutral-950">
                Good morning.
              </h1>

              <p className="mt-2 text-sm text-neutral-500">
                Here&apos;s what&apos;s happening in your workspace today.
              </p>
            </div>

            {/* DATE */}
            <div className="hidden items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 md:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEEEFF] text-[#4143D5]">
                <CalendarDays className="h-[18px] w-[18px]" />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                  Today
                </p>

                <p className="mt-0.5 text-sm font-semibold text-neutral-900">
                  September 25, 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}