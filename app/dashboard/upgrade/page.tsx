"use client"

import Link from "next/link"
import { useState } from "react"
import { Check, Crown, Sparkles } from "lucide-react"
import { usePreferences } from "@/components/providers/preferences-provider"

const copy = {
  en: { eyebrow:"Plans", title:"Choose your Taskora plan", intro:"Start with the core workspace for free. Upgrade when you need more advanced capabilities.", free:"Free", pro:"Pro", current:"Current plan", upgrade:"Upgrade to Pro", coming:"Billing coming soon", freeText:"For personal productivity and everyday planning.", proText:"For users who want more power from their workspace.", included:"Included", freeItems:["Tasks and planning","Daily, weekly and monthly views","Calendar","Goals","Basic analytics"], proItems:["Everything in Free","Advanced analytics","Advanced focus tools","Report exports","Future premium features"], note:"Pro checkout is not enabled yet. You will not be charged from this page.", back:"Back to settings" },
  fr: { eyebrow:"Plans", title:"Choisissez votre plan Taskora", intro:"Commencez gratuitement avec les fonctions essentielles. Passez à Pro lorsque vous avez besoin de fonctions avancées.", free:"Gratuit", pro:"Pro", current:"Plan actuel", upgrade:"Passer à Pro", coming:"Paiement bientôt disponible", freeText:"Pour la productivité personnelle et la planification quotidienne.", proText:"Pour les utilisateurs qui veulent plus de puissance.", included:"Inclus", freeItems:["Tâches et planification","Vues quotidienne, hebdomadaire et mensuelle","Calendrier","Objectifs","Analyses de base"], proItems:["Tout le plan Gratuit","Analyses avancées","Outils de concentration avancés","Export de rapports","Futures fonctions premium"], note:"Le paiement Pro n'est pas encore activé. Aucun montant ne sera facturé depuis cette page.", back:"Retour aux paramètres" },
  ar: { eyebrow:"الخطط", title:"اختر خطة Taskora", intro:"ابدأ مجانا بأدوات مساحة العمل الأساسية وانتقل إلى Pro عند الحاجة إلى مزايا متقدمة.", free:"مجاني", pro:"Pro", current:"الخطة الحالية", upgrade:"الترقية إلى Pro", coming:"الدفع متاح قريبا", freeText:"للإنتاجية الشخصية والتخطيط اليومي.", proText:"للمستخدمين الذين يريدون إمكانيات أكثر تقدما.", included:"يتضمن", freeItems:["المهام والتخطيط","العرض اليومي والأسبوعي والشهري","التقويم","الأهداف","تحليلات أساسية"], proItems:["كل مزايا الخطة المجانية","تحليلات متقدمة","أدوات تركيز متقدمة","تصدير التقارير","مزايا Premium مستقبلية"], note:"الدفع لخطة Pro غير مفعل بعد ولن يتم خصم أي مبلغ من هذه الصفحة.", back:"العودة إلى الإعدادات" },
} as const

const prices = {
  MAD: { symbol: "DH", monthly: 49, yearly: 490 },
  USD: { symbol: "$", monthly: 5, yearly: 50 },
  EUR: { symbol: "€", monthly: 5, yearly: 50 },
  GBP: { symbol: "£", monthly: 4, yearly: 40 },
} as const

type Currency = keyof typeof prices

export default function UpgradePage() {
  const { language } = usePreferences()
  const t = copy[language]
  const [currency, setCurrency] = useState<Currency>("MAD")
  const price = prices[currency]
  return (
    <main className="min-h-screen bg-[#F9F9FD] px-4 py-10 text-neutral-950 dark:bg-[#15171C] dark:text-neutral-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEEEFF] text-[#4143D5] dark:bg-[#30314F] dark:text-[#AEB0FF]"><Crown className="h-5 w-5"/></div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-[#4143D5]">{t.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{t.title}</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">{t.intro}</p>
        </div>
        <div className="mt-7 flex justify-center"><div className="inline-flex rounded-xl border border-neutral-200 bg-white p-1 dark:border-neutral-800 dark:bg-[#1C1F26]">{(Object.keys(prices) as Currency[]).map(code => <button key={code} type="button" onClick={() => setCurrency(code)} className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${currency === code ? "bg-[#4143D5] text-white" : "text-neutral-500 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-[#252830]"}`}>{code}</button>)}</div></div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Plan title={t.free} description={t.freeText} items={t.freeItems} label={t.included} price={`0 ${currency}`} priceDetail="/ month">
            <div className="flex h-11 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-sm font-semibold text-neutral-600 dark:border-neutral-700 dark:bg-[#252830] dark:text-neutral-300">{t.current}</div>
          </Plan>
          <Plan title={t.pro} description={t.proText} items={t.proItems} label={t.included} featured price={`${price.symbol}${price.monthly} ${currency}`} priceDetail={`/ month · ${price.symbol}${price.yearly} ${currency} / year`}>
            <button disabled className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#4143D5] text-sm font-semibold text-white opacity-80"><Sparkles className="h-4 w-4"/>{t.upgrade}</button>
            <p className="mt-2 text-center text-[11px] text-neutral-400">{t.coming}</p>
          </Plan>
        </div>
        <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-neutral-200 bg-white px-4 py-3 text-center text-xs leading-5 text-neutral-500 dark:border-neutral-800 dark:bg-[#1C1F26] dark:text-neutral-400">{t.note}</div>
        <div className="mt-6 text-center"><Link href="/dashboard/settings" className="text-sm font-semibold text-[#4143D5] hover:underline">{t.back}</Link></div>
      </div>
    </main>
  )
}

function Plan({title,description,items,label,price,priceDetail,featured=false,children}:{title:string;description:string;items:readonly string[];label:string;price:string;priceDetail:string;featured?:boolean;children:React.ReactNode}) {
  return <section className={`rounded-2xl border bg-white p-6 dark:bg-[#1C1F26] ${featured ? "border-[#4143D5] shadow-[0_12px_40px_rgba(65,67,213,.12)]" : "border-neutral-200 dark:border-neutral-800"}`}>
    <h2 className="text-2xl font-semibold">{title}</h2><div className="mt-3 flex items-end gap-2"><span className="text-3xl font-bold tracking-tight">{price}</span><span className="pb-1 text-xs text-neutral-400">{priceDetail}</span></div><p className="mt-3 min-h-12 text-sm leading-6 text-neutral-500 dark:text-neutral-400">{description}</p>
    <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.14em] text-neutral-400">{label}</p>
    <ul className="mt-3 space-y-3">{items.map(item=><li key={item} className="flex gap-2.5 text-sm"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EEEEFF] text-[#4143D5] dark:bg-[#30314F] dark:text-[#AEB0FF]"><Check className="h-3 w-3"/></span>{item}</li>)}</ul>
    <div className="mt-7">{children}</div>
  </section>
}
