import { redirect } from "next/navigation"

import Sidebar from "@/components/layout/sidebar"
import { PreferencesProvider } from "@/components/providers/preferences-provider"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  return (
    <PreferencesProvider>
      <div className="min-h-screen bg-[#F9F9FD] text-neutral-950 transition-colors dark:bg-[#111318] dark:text-neutral-100">
        <Sidebar />
        <main className="min-h-screen lg:pl-[248px] rtl:lg:pl-0 rtl:lg:pr-[248px]">
          {children}
        </main>
      </div>
    </PreferencesProvider>
  )
}