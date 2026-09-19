import { motion } from 'framer-motion'
import { Zap, ShieldCheck, ClipboardCheck, Building2 } from 'lucide-react'

const FEATURES = [
  { icon: ShieldCheck, text: 'Issue and track permits to work in real time' },
  { icon: ClipboardCheck, text: 'Build and accept contractor allocations in minutes' },
  { icon: Building2, text: 'One register for contractors, sites and documents' },
]

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-12 text-white lg:flex">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_60%,white,transparent_30%)]" />
        <div className="relative flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
            <Zap className="h-5 w-5" fill="currentColor" />
          </div>
          <span className="text-lg font-bold">CNE Contract Portal</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-md"
        >
          <h2 className="text-3xl font-bold leading-tight">Run your permits and allocations from one place.</h2>
          <p className="mt-3 text-sm text-blue-100/80">
            A faster, cleaner way to manage permits to work, contractor allocations and site documentation.
          </p>
          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-blue-50/90">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </motion.div>

        <p className="relative text-xs text-blue-100/50">© {new Date().getFullYear()} CNE Contract Portal</p>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="h-5 w-5" fill="currentColor" />
            </div>
            <span className="text-base font-bold">CNE Contract Portal</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}
