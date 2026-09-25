import { redirect } from "next/navigation"

import Sidebar from "@/components/layout/sidebar"
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
    <div className="min-h-screen bg-[#F9F9FD]">
      <Sidebar />

      <main className="min-h-screen lg:pl-[248px]">
        {children}
      </main>
    </div>
  )
}