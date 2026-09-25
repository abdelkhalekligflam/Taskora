"use client"

import Link from "next/link"
import { FormEvent, useEffect, useState } from "react"
import { BookOpen, CircleHelp, ExternalLink, LifeBuoy, MessageSquareText } from "lucide-react"
import { usePreferences } from "@/components/providers/preferences-provider"
import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

const copy = {
  en: {
    eyebrow: "Support", title: "Help & support", intro: "Find quick answers and learn how the main Taskora workflows work.",
    faq: "Frequently asked questions",
    items: [
      ["Where is my data stored?", "Your tasks, goals and profile preferences are stored in your Taskora account through Supabase."],
      ["How do I change language or theme?", "Open Settings, then use Language & Region or Appearance. Your preferences are saved to your profile."],
      ["How do I plan a task?", "Create or edit a task in Daily and add a schedule. Scheduled tasks then appear in Calendar, Weekly and Monthly views."],
      ["How do goals work?", "Create a goal, set its current and target values, optionally add a deadline, and update progress as you work."],
    ],
    quick: "Quick links", daily: "Manage tasks", settings: "Preferences", goals: "Manage goals",
    contactTitle: "Contact us", contact: "Submit a support request here and we will keep it linked to your Taskora account.",
    email: "Email", message: "Message", emailPlaceholder: "you@example.com", messagePlaceholder: "How can we help?", send: "Send message", sending: "Sending...", sent: "Your support request was submitted.", failed: "Could not submit your request. Please try again.",
  },
  fr: {
    eyebrow: "Support", title: "Aide & support", intro: "Trouvez des réponses rapides et découvrez le fonctionnement des principaux outils Taskora.",
    faq: "Questions fréquentes",
    items: [
      ["Où sont stockées mes données ?", "Vos tâches, objectifs et préférences de profil sont stockés dans votre compte Taskora via Supabase."],
      ["Comment changer la langue ou le thème ?", "Ouvrez Paramètres, puis Langue et région ou Apparence. Vos préférences sont enregistrées dans votre profil."],
      ["Comment planifier une tâche ?", "Créez ou modifiez une tâche dans Quotidien et ajoutez une date. Elle apparaîtra ensuite dans Calendrier, Hebdomadaire et Mensuel."],
      ["Comment fonctionnent les objectifs ?", "Créez un objectif, définissez les valeurs actuelle et cible, ajoutez éventuellement une échéance et mettez à jour la progression."],
    ],
    quick: "Liens rapides", daily: "Gérer les tâches", settings: "Préférences", goals: "Gérer les objectifs",
    contactTitle: "Contactez-nous", contact: "Envoyez une demande de support ici. Elle restera liée à votre compte Taskora.",
    email: "E-mail", message: "Message", emailPlaceholder: "vous@exemple.com", messagePlaceholder: "Comment pouvons-nous vous aider ?", send: "Envoyer le message", sending: "Envoi...", sent: "Votre demande de support a été envoyée.", failed: "Impossible d’envoyer votre demande. Réessayez.",
  },
  ar: {
    eyebrow: "الدعم", title: "المساعدة والدعم", intro: "اعثر على إجابات سريعة وتعرف على طريقة استخدام أهم أدوات Taskora.",
    faq: "الأسئلة الشائعة",
    items: [
      ["أين يتم حفظ بياناتي؟", "يتم حفظ مهامك وأهدافك وتفضيلات ملفك في حساب Taskora عبر Supabase."],
      ["كيف أغير اللغة أو المظهر؟", "افتح الإعدادات ثم اللغة والمنطقة أو المظهر. يتم حفظ تفضيلاتك في ملفك."],
      ["كيف أخطط لمهمة؟", "أنشئ أو عدل مهمة في الصفحة اليومية وأضف موعدا. ستظهر بعدها في التقويم والعرض الأسبوعي والشهري."],
      ["كيف تعمل الأهداف؟", "أنشئ هدفا وحدد القيمة الحالية والمستهدفة ويمكنك إضافة موعد نهائي ثم تحديث التقدم."],
    ],
    quick: "روابط سريعة", daily: "إدارة المهام", settings: "التفضيلات", goals: "إدارة الأهداف",
    contactTitle: "تواصل معنا", contact: "أرسل بريدك الإلكتروني ورسالتك وسنرد عليك.",
    email: "البريد الإلكتروني", message: "الرسالة", emailPlaceholder: "you@example.com", messagePlaceholder: "كيف يمكننا مساعدتك؟", send: "إرسال الرسالة", sending: "جار الإرسال...", sent: "تم إرسال طلب الدعم.", failed: "تعذر إرسال الطلب. حاول مرة أخرى.",
  },
} as const

export default function SupportPage() {
  const { language } = usePreferences()
  const t = copy[language]
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    void (async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user?.email) setEmail(user.email)
    })()
  }, [])

  async function submitSupport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback(null)
    const trimmedMessage = message.trim()
    if (trimmedMessage.length < 10) {
      setFeedback({ type: "error", text: t.failed })
      return
    }

    setSending(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setFeedback({ type: "error", text: t.failed })
      setSending(false)
      return
    }

    const { error } = await supabase.from("support_tickets").insert({
      user_id: user.id,
      email: email.trim(),
      message: trimmedMessage,
    })

    if (error) setFeedback({ type: "error", text: t.failed })
    else {
      setMessage("")
      setFeedback({ type: "success", text: t.sent })
    }
    setSending(false)
  }

  return (
    <main className="min-h-screen bg-[#F9F9FD] px-4 py-8 text-neutral-950 dark:bg-[#15171C] dark:text-neutral-100 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEEEFF] text-[#4143D5] dark:bg-[#30314F] dark:text-[#AEB0FF]"><LifeBuoy className="h-5 w-5"/></div>
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#4143D5]">{t.eyebrow}</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">{t.title}</h1></div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">{t.intro}</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
          <section className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-[#1C1F26] sm:p-6">
            <div className="flex items-center gap-2"><CircleHelp className="h-4 w-4 text-[#4143D5]"/><h2 className="text-sm font-semibold">{t.faq}</h2></div>
            <div className="mt-5 divide-y divide-neutral-100 dark:divide-neutral-800">
              {t.items.map(([question, answer]) => <div key={question} className="py-4 first:pt-0 last:pb-0"><h3 className="text-sm font-semibold">{question}</h3><p className="mt-2 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{answer}</p></div>)}
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-[#1C1F26]">
              <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-[#4143D5]"/><h2 className="text-sm font-semibold">{t.quick}</h2></div>
              <div className="mt-4 space-y-2">
                {[[t.daily,"/dashboard/daily"],[t.goals,"/dashboard/goals"],[t.settings,"/dashboard/settings"]].map(([label,href]) => <Link key={href} href={href} className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2.5 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-[#252830]"><span>{label}</span><ExternalLink className="h-3.5 w-3.5 text-neutral-400"/></Link>)}
              </div>
            </section>
            <section className="rounded-2xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-[#1C1F26]">
              <div className="flex items-center gap-2"><MessageSquareText className="h-4 w-4 text-[#4143D5]"/><h2 className="text-sm font-semibold">{t.contactTitle}</h2></div>
              <p className="mt-3 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{t.contact}</p>
              <form className="mt-4 space-y-3" onSubmit={submitSupport}>
                <label className="block text-xs font-semibold">{t.email}<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t.emailPlaceholder} className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#4143D5] dark:border-neutral-700" /></label>
                <label className="block text-xs font-semibold">{t.message}<textarea required minLength={10} maxLength={5000} rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder={t.messagePlaceholder} className="mt-1.5 w-full resize-none rounded-lg border border-neutral-200 bg-transparent px-3 py-2.5 text-sm outline-none focus:border-[#4143D5] dark:border-neutral-700" /></label>
                {feedback && <div className={`rounded-lg border px-3 py-2.5 text-xs ${feedback.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700"}`}>{feedback.text}</div>}<button type="submit" disabled={sending} className="w-full rounded-lg bg-[#4143D5] px-3 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60">{sending ? t.sending : t.send}</button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
