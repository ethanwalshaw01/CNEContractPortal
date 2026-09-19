import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function StatCard({ label, value, icon: Icon, tone = 'primary', loading }) {
  const tones = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    accent: 'bg-accent text-accent-foreground',
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="border-border/70 shadow-soft transition-shadow hover:shadow-panel">
        <CardContent className="flex items-center gap-4 p-5">
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', tones[tone])}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold leading-none tabular-nums">{loading ? '—' : value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
