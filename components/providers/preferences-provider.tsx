"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"
import { usePathname } from "next/navigation"

import { createClient } from "@/lib/supabase/client"

export type AppLanguage = "en" | "fr" | "ar"
type Theme = "light" | "dark" | "system"

const dictionaries = {
  en: {
    overview:"Overview", daily:"Daily", weekly:"Weekly", monthly:"Monthly", analytics:"Analytics", goals:"Goals", calendar:"Calendar",
    workspace:"Workspace", personalWorkspace:"Personal Workspace", freePlan:"Free plan", settings:"Settings", help:"Help & support", myAccount:"My Account", member:"Taskora member",
    search:"Search tasks, projects...", newTask:"New task", today:"Today", goodMorning:"Good morning.", overviewIntro:"Here's what's happening in your workspace today.",
    tasksCompleted:"Tasks completed", focusTime:"Focus time", dailyProgress:"Daily progress", currentStreak:"Current streak", todaysPriorities:"Today's priorities",
    prioritiesIntro:"Your most important work for today.", viewDaily:"View daily", prioritiesEmpty:"Your priorities will appear here", prioritiesEmptyDetail:"Add tasks to start planning your day.",
    focusEngine:"Focus engine", readyFocus:"Ready to focus?", focusDetail:"Start a focused session and protect time for your highest-priority work.", startFocus:"Start focus session",
    scheduled:"Scheduled", completed:"Completed", pending:"Pending", selectedDay:"Selected Day", noScheduled:"No scheduled tasks for this day.", calendarIntro:"Your scheduled Taskora tasks in one calendar view.",
  },
  fr: {
    overview:"Aperçu", daily:"Quotidien", weekly:"Hebdomadaire", monthly:"Mensuel", analytics:"Analyses", goals:"Objectifs", calendar:"Calendrier",
    workspace:"Espace", personalWorkspace:"Espace personnel", freePlan:"Plan gratuit", settings:"Paramètres", help:"Aide & support", myAccount:"Mon compte", member:"Membre Taskora",
    search:"Rechercher tâches, projets...", newTask:"Nouvelle tâche", today:"Aujourd'hui", goodMorning:"Bonjour.", overviewIntro:"Voici ce qui se passe dans votre espace aujourd'hui.",
    tasksCompleted:"Tâches terminées", focusTime:"Temps de concentration", dailyProgress:"Progression du jour", currentStreak:"Série actuelle", todaysPriorities:"Priorités du jour",
    prioritiesIntro:"Votre travail le plus important pour aujourd'hui.", viewDaily:"Voir le quotidien", prioritiesEmpty:"Vos priorités apparaîtront ici", prioritiesEmptyDetail:"Ajoutez des tâches pour commencer à planifier votre journée.",
    focusEngine:"Mode concentration", readyFocus:"Prêt à vous concentrer ?", focusDetail:"Démarrez une session ciblée et protégez du temps pour vos priorités.", startFocus:"Démarrer une session",
    scheduled:"Planifiées", completed:"Terminées", pending:"En attente", selectedDay:"Jour sélectionné", noScheduled:"Aucune tâche planifiée pour ce jour.", calendarIntro:"Toutes vos tâches Taskora planifiées dans un calendrier.",
  },
  ar: {
    overview:"نظرة عامة", daily:"اليومي", weekly:"الأسبوعي", monthly:"الشهري", analytics:"التحليلات", goals:"الأهداف", calendar:"التقويم",
    workspace:"مساحة العمل", personalWorkspace:"مساحة العمل الشخصية", freePlan:"الخطة المجانية", settings:"الإعدادات", help:"المساعدة والدعم", myAccount:"حسابي", member:"عضو Taskora",
    search:"ابحث في المهام والمشاريع...", newTask:"مهمة جديدة", today:"اليوم", goodMorning:"صباح الخير.", overviewIntro:"إليك ما يحدث في مساحة عملك اليوم.",
    tasksCompleted:"المهام المكتملة", focusTime:"وقت التركيز", dailyProgress:"تقدم اليوم", currentStreak:"السلسلة الحالية", todaysPriorities:"أولويات اليوم",
    prioritiesIntro:"أهم أعمالك لهذا اليوم.", viewDaily:"عرض اليوم", prioritiesEmpty:"ستظهر أولوياتك هنا", prioritiesEmptyDetail:"أضف مهام لبدء تخطيط يومك.",
    focusEngine:"محرك التركيز", readyFocus:"هل أنت مستعد للتركيز؟", focusDetail:"ابدأ جلسة تركيز وخصص وقتا لأهم أولوياتك.", startFocus:"ابدأ جلسة تركيز",
    scheduled:"المجدولة", completed:"المكتملة", pending:"المتبقية", selectedDay:"اليوم المحدد", noScheduled:"لا توجد مهام مجدولة لهذا اليوم.", calendarIntro:"مهام Taskora المجدولة في تقويم واحد.",
  },
} as const

type Dictionary = typeof dictionaries.en
type ContextValue = { language: AppLanguage; theme: Theme; t: Dictionary }

const PreferencesContext = createContext<ContextValue>({ language:"en", theme:"system", t:dictionaries.en })

function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", dark)
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [language, setLanguage] = useState<AppLanguage>("en")
  const [theme, setTheme] = useState<Theme>("system")

  useEffect(() => {
    const supabase = createClient()
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from("profiles").select("language,theme").eq("user_id", user.id).maybeSingle()
      if (!data) return
      const nextLanguage = (data.language ?? "en") as AppLanguage
      const nextTheme = (data.theme ?? "system") as Theme
      setLanguage(nextLanguage)
      setTheme(nextTheme)
      applyTheme(nextTheme)
      document.documentElement.lang = nextLanguage === "ar" ? "ar" : nextLanguage
      document.documentElement.dir = nextLanguage === "ar" ? "rtl" : "ltr"
    }
    void load()
  }, [pathname])

  useEffect(() => {
    if (theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const sync = () => applyTheme("system")
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [theme])

  const value = useMemo(() => ({ language, theme, t: dictionaries[language] as Dictionary }), [language, theme])
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  return useContext(PreferencesContext)
}
