import { motion } from 'framer-motion'
import { ShieldCheck, ClipboardCheck, Building2 } from 'lucide-react'
import Logo from '@/components/Logo'

const FEATURES = [
  { icon: ShieldCheck, text: 'Issue and track permits to work in real time' },
  { icon: ClipboardCheck, text: 'Build and accept contractor allocations in minutes' },
  { icon: Building2, text: 'One hub for contractors, sites and documents' },
]

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#161210] p-12 text-white lg:flex">
        <div className="absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_18%_20%,white,transparent_38%),radial-gradient(circle_at_82%_65%,white,transparent_34%)]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(244,236,226,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(244,236,226,0.06) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        <div className="relative flex items-center gap-2.5">
          <Logo markClassName="bg-white/10" size={38} />
          <span className="font-heading text-lg font-bold">CNE Contract Portal</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-md"
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-white/40">Contractor management hub</p>
          <h2 className="font-heading text-3xl font-bold leading-tight">
            Run your permits and allocations from one place.
          </h2>
          <p className="mt-3 text-sm text-white/60">
            A faster, cleaner way to manage permits to work, contractor allocations and site documentation.
          </p>
          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon className="h-4 w-4" />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </motion.div>

        <p className="relative text-xs text-white/35">© {new Date().getFullYear()} CNE Contract Portal</p>
      </div>

      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Logo size={34} />
            <span className="font-heading text-base font-bold">CNE Contract Portal</span>
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </motion.div>
      </div>
    </div>
  )
}
