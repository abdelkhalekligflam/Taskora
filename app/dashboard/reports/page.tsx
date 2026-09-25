"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Crown, Download, FileSpreadsheet, FileText, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { usePreferences } from "@/components/providers/preferences-provider"

const supabase = createClient()

const tx = {
  en: { title:"Reports & Export", intro:"Export your real Taskora data for reporting and analysis.", locked:"Reports and exports are a Pro feature.", upgrade:"Upgrade to Pro", tasksCsv:"Export tasks CSV", goalsCsv:"Export goals CSV", pdf:"Export PDF report", report:"Taskora Productivity Report", tasks:"Tasks", goals:"Goals", total:"Total", completed:"Completed", active:"Active", generated:"Generated", noData:"No data available.", colTitle:"Title", colStatus:"Status", colPriority:"Priority", colSchedule:"Schedule", colProgress:"Progress", colTarget:"Target date" },
  fr: { title:"Rapports & Export", intro:"Exportez vos données Taskora pour vos rapports et analyses.", locked:"Les rapports et exports sont une fonction Pro.", upgrade:"Passer à Pro", tasksCsv:"Exporter les tâches CSV", goalsCsv:"Exporter les objectifs CSV", pdf:"Exporter le rapport PDF", report:"Rapport de productivité Taskora", tasks:"Tâches", goals:"Objectifs", total:"Total", completed:"Terminées", active:"Actifs", generated:"Généré", noData:"Aucune donnée disponible.", colTitle:"Titre", colStatus:"Statut", colPriority:"Priorité", colSchedule:"Planification", colProgress:"Progression", colTarget:"Date cible" },
  ar: { title:"التقارير والتصدير", intro:"صدّر بيانات Taskora للتقارير والتحليل.", locked:"التقارير والتصدير ميزة Pro.", upgrade:"الترقية إلى Pro", tasksCsv:"تصدير المهام CSV", goalsCsv:"تصدير الأهداف CSV", pdf:"تصدير تقرير PDF", report:"تقرير إنتاجية Taskora", tasks:"المهام", goals:"الأهداف", total:"المجموع", completed:"المكتملة", active:"النشطة", generated:"تم الإنشاء", noData:"لا توجد بيانات.", colTitle:"العنوان", colStatus:"الحالة", colPriority:"الأولوية", colSchedule:"الموعد", colProgress:"التقدم", colTarget:"التاريخ المستهدف" },
} as const

type Row = Record<string, unknown>

export default function ReportsPage() {
  const { language } = usePreferences()
  const t = tx[language]
  const [plan, setPlan] = useState<"free"|"pro">("free")
  const [loading, setLoading] = useState(true)
  const locale = language === "fr" ? "fr-FR" : language === "ar" ? "ar-MA" : "en-US"

  useEffect(() => {
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from("profiles").select("plan").eq("user_id", user.id).maybeSingle()
        setPlan(data?.plan === "pro" ? "pro" : "free")
      }
      setLoading(false)
    })()
  }, [])

  async function exportTable(table: "tasks"|"goals") {
    const { data, error } = await supabase.from(table).select("*")
    if (error || !data) return
    const rows = data as Row[]
    if (!rows.length) return
    const keys = Object.keys(rows[0])
    const esc = (value: unknown) => `"${String(value ?? "").replaceAll('"','""')}"`
    const csv = [keys.join(","), ...rows.map((row) => keys.map((key) => esc(row[key])).join(","))].join("\n")
    downloadBlob(new Blob([csv], { type: "text/csv;charset=utf-8" }), `taskora-${table}.csv`)
  }

  async function exportPdf() {
    const [{ data: tasks }, { data: goals }] = await Promise.all([
      supabase.from("tasks").select("title,status,priority,scheduled_at,duration_minutes").order("created_at", { ascending: false }),
      supabase.from("goals").select("title,status,current_value,target_value,unit,target_date").order("created_at", { ascending: false }),
    ])

    const taskRows = tasks ?? []
    const goalRows = goals ?? []
    const completedTasks = taskRows.filter((task) => task.status === "completed").length
    const activeGoals = goalRows.filter((goal) => goal.status === "active").length

    const escapeHtml = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char] ?? char))
    const taskHtml = taskRows.length ? taskRows.map((task) => `<tr><td>${escapeHtml(task.title)}</td><td>${escapeHtml(task.status)}</td><td>${escapeHtml(task.priority)}</td><td>${task.scheduled_at ? escapeHtml(new Date(task.scheduled_at).toLocaleString(locale)) : "—"}</td></tr>`).join("") : `<tr><td colspan="4">${t.noData}</td></tr>`
    const goalHtml = goalRows.length ? goalRows.map((goal) => `<tr><td>${escapeHtml(goal.title)}</td><td>${escapeHtml(goal.status)}</td><td>${escapeHtml(goal.current_value)} / ${escapeHtml(goal.target_value ?? "—")} ${escapeHtml(goal.unit)}</td><td>${goal.target_date ? escapeHtml(new Date(goal.target_date + "T00:00:00").toLocaleDateString(locale)) : "—"}</td></tr>`).join("") : `<tr><td colspan="4">${t.noData}</td></tr>`

    const html = `<!doctype html><html lang="${language}" dir="${language === "ar" ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${t.report}</title><style>
      @page{size:A4;margin:16mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#171717;margin:0;font-size:11px}h1{font-size:24px;margin:0}.brand{color:#4143D5;font-weight:800;letter-spacing:.08em}.meta{color:#737373;margin-top:6px}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:24px 0}.card{border:1px solid #e5e5e5;border-radius:10px;padding:12px}.value{font-size:20px;font-weight:700;margin-top:5px}h2{font-size:15px;margin:24px 0 8px}table{width:100%;border-collapse:collapse;page-break-inside:auto}tr{page-break-inside:avoid}th,td{padding:8px;border-bottom:1px solid #e5e5e5;text-align:start;vertical-align:top}th{background:#f7f7fb;font-size:9px;text-transform:uppercase;letter-spacing:.06em}.footer{margin-top:24px;color:#a3a3a3;font-size:9px}@media print{button{display:none}}
    </style></head><body><div class="brand">TASKORA</div><h1>${t.report}</h1><div class="meta">${t.generated}: ${escapeHtml(new Date().toLocaleString(locale))}</div>
    <div class="cards"><div class="card">${t.tasks} · ${t.total}<div class="value">${taskRows.length}</div></div><div class="card">${t.tasks} · ${t.completed}<div class="value">${completedTasks}</div></div><div class="card">${t.goals} · ${t.total}<div class="value">${goalRows.length}</div></div><div class="card">${t.goals} · ${t.active}<div class="value">${activeGoals}</div></div></div>
    <h2>${t.tasks}</h2><table><thead><tr><th>${t.colTitle}</th><th>${t.colStatus}</th><th>${t.colPriority}</th><th>${t.colSchedule}</th></tr></thead><tbody>${taskHtml}</tbody></table>
    <h2>${t.goals}</h2><table><thead><tr><th>${t.colTitle}</th><th>${t.colStatus}</th><th>${t.colProgress}</th><th>${t.colTarget}</th></tr></thead><tbody>${goalHtml}</tbody></table>
    <div class="footer">Taskora · ${escapeHtml(new Date().getFullYear())}</div><script>window.onload=()=>window.print()</script></body></html>`

    const reportWindow = window.open("", "_blank", "noopener,noreferrer")
    if (!reportWindow) return
    reportWindow.document.open()
    reportWindow.document.write(html)
    reportWindow.document.close()
  }

  if (loading) return <div className="flex min-h-[70vh] items-center justify-center"><Loader2 className="h-5 w-5 animate-spin"/></div>
  if (plan !== "pro") return <main className="min-h-screen bg-[#F9F9FD] p-10 dark:bg-[#111318]"><div className="mx-auto max-w-3xl rounded-3xl border bg-white p-10 text-center dark:border-neutral-800 dark:bg-[#1C1F26]"><Crown className="mx-auto h-10 w-10 text-[#4143D5]"/><h1 className="mt-5 text-3xl font-semibold dark:text-white">{t.locked}</h1><Link href="/dashboard/upgrade" className="mt-6 inline-flex rounded-lg bg-[#4143D5] px-5 py-3 text-sm font-semibold text-white">{t.upgrade}</Link></div></main>

  return <main className="min-h-screen bg-[#F9F9FD] p-8 dark:bg-[#111318] dark:text-white"><div className="mx-auto max-w-5xl"><h1 className="text-3xl font-semibold">{t.title}</h1><p className="mt-2 text-sm text-neutral-500">{t.intro}</p><div className="mt-7 grid gap-4 md:grid-cols-3"><ExportCard icon={<FileSpreadsheet/>} title={t.tasksCsv} onClick={() => void exportTable("tasks")}/><ExportCard icon={<Download/>} title={t.goalsCsv} onClick={() => void exportTable("goals")}/><ExportCard icon={<FileText/>} title={t.pdf} onClick={() => void exportPdf()}/></div></div></main>
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function ExportCard({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick: () => void }) {
  return <button onClick={onClick} className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-6 text-left transition hover:border-[#4143D5] dark:border-neutral-800 dark:bg-[#1C1F26]"><span className="text-[#4143D5] [&>svg]:h-6 [&>svg]:w-6">{icon}</span><span className="font-semibold">{title}</span></button>
}
