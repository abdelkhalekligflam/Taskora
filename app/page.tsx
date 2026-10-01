import Link from "next/link"
import { ArrowRight, BarChart3, CalendarDays, CheckCircle2, Clock3, Focus, LayoutDashboard, ShieldCheck, Target, Zap } from "lucide-react"

const features = [
  { icon: CheckCircle2, title: "Smart Task Management", text: "Create, schedule, prioritize and complete your work from one focused workspace." },
  { icon: CalendarDays, title: "Weekly & Monthly Planning", text: "Turn scheduled tasks into clear weekly and monthly views without duplicate planning." },
  { icon: Focus, title: "Focused Execution", text: "Keep priorities visible and move from planning to execution with less friction." },
  { icon: BarChart3, title: "Real Productivity Analytics", text: "See completion rate, planned focus time, goals and categories calculated from your own data." },
  { icon: Target, title: "Measurable Goals", text: "Set targets, track progress and connect daily execution with longer-term objectives." },
  { icon: ShieldCheck, title: "Private Workspace", text: "Your Taskora data is isolated per account with Supabase authentication and row-level security." },
]

export default function Home() {
  return <div className="min-h-screen overflow-hidden bg-[#F9F9FD] text-neutral-950">
    <header className="sticky top-0 z-50 border-b border-neutral-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5"><img src="/taskora-logo.svg" alt="" className="h-9 w-9 object-contain" /><span className="text-[17px] font-bold tracking-tight">Taskora</span></Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-neutral-500 md:flex"><a href="#features">Features</a><a href="#workspace">Workspace</a><a href="#product">Product</a></nav>
        <div className="flex items-center gap-2"><Link href="/auth" className="hidden h-9 items-center px-3 text-sm font-semibold sm:flex">Sign in</Link><Link href="/auth" className="flex h-9 items-center rounded-lg bg-[#4143D5] px-4 text-sm font-semibold text-white">Get started</Link></div>
      </div>
    </header>

    <main>
      <section className="relative px-5 pb-20 pt-20 text-center lg:px-8 lg:pt-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[#E8E8FF] opacity-70 blur-3xl"/>
        <div className="relative mx-auto max-w-[1040px]">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#D8D8FF] bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[.12em] text-[#4143D5]"><span className="h-2 w-2 rounded-full bg-[#4143D5]"/>Taskora · Intelligent Workspace</div>
          <h1 className="mx-auto mt-7 max-w-4xl text-[48px] font-semibold leading-[1.04] tracking-[-.05em] sm:text-[64px] lg:text-[76px]">Own your day. <span className="bg-gradient-to-r from-[#4143D5] to-[#7779F2] bg-clip-text text-transparent">Master your time.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-neutral-500 sm:text-lg">A focused productivity workspace that brings tasks, planning, goals and real insights into one beautifully organized system.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"><Link href="/auth" className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#4143D5] px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-200 sm:w-auto">Start for free <ArrowRight className="h-4 w-4"/></Link><a href="#workspace" className="flex h-11 w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 text-sm font-semibold sm:w-auto">See the workspace</a></div>
          <p className="mt-4 text-xs text-neutral-400">Create your account and start organizing real work immediately.</p>
        </div>

        <div id="workspace" className="relative mx-auto mt-16 max-w-[1120px] rounded-[24px] border border-neutral-200 bg-white p-2 shadow-[0_30px_80px_rgba(31,32,74,.14)]">
          <div className="flex h-10 items-center gap-2 rounded-t-[18px] bg-neutral-50 px-4"><span className="h-2.5 w-2.5 rounded-full bg-neutral-300"/><span className="h-2.5 w-2.5 rounded-full bg-neutral-300"/><span className="h-2.5 w-2.5 rounded-full bg-neutral-300"/><span className="mx-auto rounded-md bg-white px-12 py-1 text-[9px] text-neutral-400 sm:px-20">taskora / dashboard</span></div>
          <div className="grid min-h-[470px] overflow-hidden rounded-b-[18px] border-t border-neutral-100 text-left md:grid-cols-[190px_1fr]">
            <aside className="hidden border-r border-neutral-100 bg-white p-4 md:block"><div className="flex items-center gap-2 text-sm font-bold"><img src="/taskora-logo.svg" alt="" className="h-7 w-7 object-contain" />Taskora</div><div className="mt-8 space-y-1">{["Overview","Daily","Weekly","Monthly","Analytics","Goals"].map((x,i)=><div key={x} className={`rounded-lg px-3 py-2 text-xs font-medium ${i===0?"bg-[#EEEEFF] text-[#4143D5]":"text-neutral-400"}`}>{x}</div>)}</div></aside>
            <div className="bg-[#F9F9FD] p-5 sm:p-7">
              <div className="flex items-start justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-wider text-[#4143D5]">Overview</p><h2 className="mt-1 text-xl font-semibold">Your workspace</h2><p className="mt-1 text-[10px] text-neutral-400">A clean view of the data you create in Taskora.</p></div><span className="rounded-lg bg-[#4143D5] px-3 py-2 text-[9px] font-semibold text-white">New task</span></div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">{[[CheckCircle2,"Tasks"],[Clock3,"Focus time"],[Target,"Progress"]].map(([Icon,label])=><div key={String(label)} className="rounded-xl border border-neutral-200 bg-white p-4"><div className="flex justify-between text-[9px] text-neutral-400"><span>{String(label)}</span><Icon className="h-3.5 w-3.5"/></div><p className="mt-4 text-2xl font-bold">—</p><div className="mt-3 h-1.5 rounded-full bg-neutral-100"/></div>)}</div>
              <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_.6fr]"><div className="rounded-xl border border-neutral-200 bg-white p-4"><p className="text-xs font-semibold">Today&apos;s tasks</p><div className="mt-4 space-y-2">{[1,2,3,4].map(i=><div key={i} className="flex items-center gap-3 rounded-lg bg-neutral-50 p-3"><span className="h-4 w-4 rounded border border-neutral-300"/><span className="h-2 flex-1 rounded bg-neutral-200"/><span className="h-2 w-12 rounded bg-neutral-100"/></div>)}</div></div><div className="rounded-xl bg-[#17171B] p-5 text-white"><Zap className="h-5 w-5 text-[#9B9DFF]"/><p className="mt-5 text-xs font-semibold">Focused workspace</p><p className="mt-2 text-[10px] leading-5 text-white/50">Plan, execute and review without leaving Taskora.</p><div className="mt-6 h-8 rounded-lg bg-[#4143D5]"/></div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-neutral-200 bg-white px-5 py-20 lg:px-8"><div className="mx-auto max-w-[1200px]"><div className="max-w-2xl"><p className="text-[11px] font-semibold uppercase tracking-[.15em] text-[#4143D5]">Product</p><h2 className="mt-3 text-4xl font-semibold tracking-[-.035em]">One system for planning and execution.</h2><p className="mt-4 text-sm leading-6 text-neutral-500">Taskora keeps the important parts of personal productivity connected instead of scattering them across separate tools.</p></div><div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{features.map(({icon:Icon,title,text})=><article key={title} className="rounded-2xl border border-neutral-200 bg-[#FCFCFE] p-6"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEEEFF] text-[#4143D5]"><Icon className="h-[18px] w-[18px]"/></div><h3 className="mt-5 text-base font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-neutral-500">{text}</p></article>)}</div></div></section>

      <section id="product" className="px-5 py-20 lg:px-8"><div className="mx-auto grid max-w-[1200px] gap-10 rounded-[28px] bg-[#17171B] p-8 text-white lg:grid-cols-[1fr_.7fr] lg:p-12"><div><p className="text-[11px] font-semibold uppercase tracking-[.15em] text-[#9B9DFF]">Built around your data</p><h2 className="mt-3 max-w-xl text-4xl font-semibold tracking-[-.035em]">No fake productivity numbers. Your workspace reflects your work.</h2><p className="mt-4 max-w-xl text-sm leading-6 text-white/55">Tasks, goals, calendar views and analytics are driven by the information you add to Taskora.</p></div><div className="grid grid-cols-2 gap-3">{[[LayoutDashboard,"Overview"],[CalendarDays,"Planning"],[Target,"Goals"],[BarChart3,"Analytics"]].map(([Icon,label])=><div key={String(label)} className="rounded-2xl border border-white/10 bg-white/5 p-5"><Icon className="h-5 w-5 text-[#9B9DFF]"/><p className="mt-8 text-sm font-semibold">{String(label)}</p></div>)}</div></div></section>

      <section className="px-5 pb-24 pt-6 text-center lg:px-8"><div className="mx-auto max-w-[900px] rounded-[28px] bg-gradient-to-br from-[#4143D5] to-[#6669E8] px-6 py-14 text-white shadow-xl shadow-indigo-200"><h2 className="text-4xl font-semibold tracking-[-.035em]">Build a clearer way to work.</h2><p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/70">Create your Taskora workspace and turn your tasks, schedule and goals into one organized system.</p><Link href="/auth" className="mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-6 text-sm font-semibold text-[#4143D5]">Get started <ArrowRight className="h-4 w-4"/></Link></div></section>
    </main>

    <footer className="border-t border-neutral-200 bg-white px-5 py-8 lg:px-8"><div className="mx-auto flex max-w-[1200px] flex-col justify-between gap-5 sm:flex-row sm:items-center"><div className="flex items-center gap-2 text-sm font-bold"><img src="/taskora-logo.svg" alt="" className="h-8 w-8 object-contain" />Taskora</div><p className="text-xs text-neutral-400">Focused productivity workspace.</p><div className="flex gap-5 text-xs font-medium text-neutral-500"><Link href="/auth">Sign in</Link><a href="#features">Features</a></div></div></footer>
  </div>
}
