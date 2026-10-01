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

const uiTranslations: Record<string, { fr: string; ar: string }> = {
  "Daily Tasks · Live from Supabase": { fr: "Tâches quotidiennes · Données Supabase", ar: "المهام اليومية · بيانات Supabase" },
  "Today's Tasks": { fr: "Tâches du jour", ar: "مهام اليوم" },
  "Task list": { fr: "Liste des tâches", ar: "قائمة المهام" },
  "Completion": { fr: "Progression", ar: "الإنجاز" },
  "Add task": { fr: "Ajouter une tâche", ar: "إضافة مهمة" },
  "Create first task": { fr: "Créer la première tâche", ar: "إنشاء أول مهمة" },
  "No tasks yet": { fr: "Aucune tâche pour le moment", ar: "لا توجد مهام بعد" },
  "Create tasks and mark them complete. Data is stored in your account.": { fr: "Créez des tâches et marquez-les comme terminées. Les données sont enregistrées dans votre compte.", ar: "أنشئ المهام وحدد المكتمل منها. يتم حفظ البيانات في حسابك." },
  "Create your first Taskora task. It will be saved in Supabase and linked to your account.": { fr: "Créez votre première tâche Taskora. Elle sera enregistrée et liée à votre compte.", ar: "أنشئ أول مهمة في Taskora. سيتم حفظها وربطها بحسابك." },
  "Create task": { fr: "Créer une tâche", ar: "إنشاء مهمة" },
  "Edit task": { fr: "Modifier la tâche", ar: "تعديل المهمة" },
  "Delete task?": { fr: "Supprimer la tâche ?", ar: "حذف المهمة؟" },
  "Delete": { fr: "Supprimer", ar: "حذف" }, "Cancel": { fr: "Annuler", ar: "إلغاء" }, "Save changes": { fr: "Enregistrer", ar: "حفظ التغييرات" }, "Saved": { fr: "Enregistré", ar: "تم الحفظ" },
  "Title": { fr: "Titre", ar: "العنوان" }, "Description": { fr: "Description", ar: "الوصف" }, "Category": { fr: "Catégorie", ar: "الفئة" }, "Priority": { fr: "Priorité", ar: "الأولوية" }, "Schedule": { fr: "Planification", ar: "الجدولة" }, "Duration": { fr: "Durée", ar: "المدة" },
  "Low": { fr: "Faible", ar: "منخفضة" }, "Medium": { fr: "Moyenne", ar: "متوسطة" }, "High": { fr: "Élevée", ar: "مرتفعة" },
  "Weekly Planner": { fr: "Planificateur hebdomadaire", ar: "المخطط الأسبوعي" }, "Week View": { fr: "Vue semaine", ar: "عرض الأسبوع" }, "Agenda View": { fr: "Vue agenda", ar: "عرض الأجندة" }, "Weekly Agenda": { fr: "Agenda hebdomadaire", ar: "الأجندة الأسبوعية" },
  "Start Timer": { fr: "Démarrer le minuteur", ar: "بدء المؤقت" }, "2 days remaining": { fr: "2 jours restants", ar: "يومان متبقيان" }, "16 sessions": { fr: "16 sessions", ar: "16 جلسة" }, "Avg duration: 48m": { fr: "Durée moy. : 48 min", ar: "متوسط المدة: 48 د" },
  "Monthly View": { fr: "Vue mensuelle", ar: "العرض الشهري" }, "Month": { fr: "Mois", ar: "الشهر" }, "Agenda": { fr: "Agenda", ar: "الأجندة" }, "Add Event": { fr: "Ajouter un événement", ar: "إضافة حدث" }, "Selected Day": { fr: "Jour sélectionné", ar: "اليوم المحدد" }, "Day Velocity": { fr: "Vélocité du jour", ar: "سرعة اليوم" }, "Calendar synced": { fr: "Calendrier synchronisé", ar: "تمت مزامنة التقويم" }, "Monthly Goals": { fr: "Objectifs mensuels", ar: "الأهداف الشهرية" }, "Productivity Heatmap": { fr: "Carte de productivité", ar: "خريطة الإنتاجية" }, "Monthly Insights": { fr: "Analyses mensuelles", ar: "رؤى شهرية" }, "Less": { fr: "Moins", ar: "أقل" }, "More": { fr: "Plus", ar: "أكثر" },
  "Productivity Insights": { fr: "Analyses de productivité", ar: "تحليلات الإنتاجية" }, "Last 30 Days": { fr: "30 derniers jours", ar: "آخر 30 يوما" }, "Export Report": { fr: "Exporter le rapport", ar: "تصدير التقرير" }, "Weekly Output": { fr: "Production hebdomadaire", ar: "الإنتاج الأسبوعي" }, "Daily task delivery vs planned workload": { fr: "Tâches réalisées par rapport à la charge planifiée", ar: "المهام المنجزة مقارنة بالعمل المخطط" }, "Peak Output": { fr: "Pic de production", ar: "ذروة الإنتاج" }, "Focus Allocation": { fr: "Répartition du focus", ar: "توزيع وقت التركيز" }, "Logged": { fr: "Enregistré", ar: "مسجل" }, "Adjust Schedule": { fr: "Ajuster le planning", ar: "تعديل الجدول" },
  "Long-term Objectives": { fr: "Objectifs à long terme", ar: "أهداف طويلة المدى" }, "Set measurable targets and track progress over time.": { fr: "Définissez des objectifs mesurables et suivez leur progression.", ar: "حدد أهدافا قابلة للقياس وتابع تقدمها مع الوقت." }, "Your goals": { fr: "Vos objectifs", ar: "أهدافك" }, "Progress": { fr: "Progression", ar: "التقدم" }, "No goals yet": { fr: "Aucun objectif pour le moment", ar: "لا توجد أهداف بعد" }, "Create first goal": { fr: "Créer le premier objectif", ar: "إنشاء أول هدف" }, "Create goal": { fr: "Créer un objectif", ar: "إنشاء هدف" }, "Edit goal": { fr: "Modifier l'objectif", ar: "تعديل الهدف" }, "Delete goal?": { fr: "Supprimer l'objectif ?", ar: "حذف الهدف؟" }, "Mark complete": { fr: "Marquer terminé", ar: "تحديد كمكتمل" }, "Active": { fr: "Actif", ar: "نشط" }, "Paused": { fr: "En pause", ar: "متوقف مؤقتا" }, "Archived": { fr: "Archivé", ar: "مؤرشف" },
  "Settings": { fr: "Paramètres", ar: "الإعدادات" }, "Workspace Preferences": { fr: "Préférences de l'espace", ar: "تفضيلات مساحة العمل" }, "Manage your Taskora profile and personal preferences.": { fr: "Gérez votre profil Taskora et vos préférences personnelles.", ar: "إدارة ملف Taskora وتفضيلاتك الشخصية." }, "Profile": { fr: "Profil", ar: "الملف الشخصي" }, "Full name": { fr: "Nom complet", ar: "الاسم الكامل" }, "Email": { fr: "E-mail", ar: "البريد الإلكتروني" }, "Appearance": { fr: "Apparence", ar: "المظهر" }, "Choose how Taskora should look.": { fr: "Choisissez l'apparence de Taskora.", ar: "اختر مظهر Taskora." }, "Light": { fr: "Clair", ar: "فاتح" }, "Dark": { fr: "Sombre", ar: "داكن" }, "System": { fr: "Système", ar: "النظام" }, "Language & Region": { fr: "Langue et région", ar: "اللغة والمنطقة" }, "Language": { fr: "Langue", ar: "اللغة" }, "Timezone": { fr: "Fuseau horaire", ar: "المنطقة الزمنية" }, "Notifications": { fr: "Notifications", ar: "الإشعارات" }, "In-app notifications": { fr: "Notifications dans l'application", ar: "إشعارات داخل التطبيق" }, "Email notifications": { fr: "Notifications par e-mail", ar: "إشعارات البريد الإلكتروني" }, "Subscription": { fr: "Abonnement", ar: "الاشتراك" }, "Free Plan": { fr: "Plan gratuit", ar: "الخطة المجانية" }, "Upgrade to Pro": { fr: "Passer à Pro", ar: "الترقية إلى Pro" },
  "Loading settings...": { fr: "Chargement des paramètres...", ar: "جاري تحميل الإعدادات..." }, "Loading goals...": { fr: "Chargement des objectifs...", ar: "جاري تحميل الأهداف..." }, "Loading calendar...": { fr: "Chargement du calendrier...", ar: "جاري تحميل التقويم..." },
  "Search tasks, projects, tags...": { fr: "Rechercher tâches, projets, tags...", ar: "ابحث في المهام والمشاريع والوسوم..." }, "New Task": { fr: "Nouvelle tâche", ar: "مهمة جديدة" }, "Today": { fr: "Aujourd'hui", ar: "اليوم" },
}

const originalText = new WeakMap<Text, string>()
const translatedText = new WeakSet<Text>()
const originalPlaceholder = new WeakMap<HTMLInputElement | HTMLTextAreaElement, string>()

const PreferencesContext = createContext<ContextValue>({ language:"en", theme:"system", t:dictionaries.en })

function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  document.documentElement.classList.toggle("dark", dark)
}

function GlobalTranslator({ language }: { language: AppLanguage }) {
  useEffect(() => {
    const translate = () => {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
      let node = walker.nextNode() as Text | null
      while (node) {
        const parent = node.parentElement
        if (parent && !["SCRIPT", "STYLE"].includes(parent.tagName)) {
          const current = node.nodeValue ?? ""
          if (!originalText.has(node)) originalText.set(node, current)
          const source = (originalText.get(node) ?? current).trim()
          const original = originalText.get(node) ?? current
          if (language === "en") {
            if (translatedText.has(node)) {
              node.nodeValue = original
              translatedText.delete(node)
            }
          } else {
            const translated = uiTranslations[source]?.[language]
            if (translated) {
              const leading = original.match(/^\\s*/)?.[0] ?? ""
              const trailing = original.match(/\\s*$/)?.[0] ?? ""
              node.nodeValue = leading + translated + trailing
              translatedText.add(node)
            }
          }
        }
        node = walker.nextNode() as Text | null
      }

      document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input[placeholder], textarea[placeholder]").forEach((element) => {
        if (!originalPlaceholder.has(element)) originalPlaceholder.set(element, element.placeholder)
        const source = originalPlaceholder.get(element) ?? element.placeholder
        if (language === "en") element.placeholder = source
        else if (uiTranslations[source]?.[language]) element.placeholder = uiTranslations[source][language]
      })
    }

    translate()
    const observer = new MutationObserver(() => translate())
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [language])
  return null
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
    const reload = () => void load()
    window.addEventListener("taskora-preferences-updated", reload)
    return () => window.removeEventListener("taskora-preferences-updated", reload)
  }, [pathname])

  useEffect(() => {
    if (theme !== "system") return
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const sync = () => applyTheme("system")
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [theme])

  const value = useMemo(() => ({ language, theme, t: dictionaries[language] as Dictionary }), [language, theme])
  return <PreferencesContext.Provider value={value}><GlobalTranslator language={language} />{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  return useContext(PreferencesContext)
}
