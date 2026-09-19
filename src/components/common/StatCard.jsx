import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export default function StatCard({ label, value, icon: Icon, tone = 'default', loading }) {
  const tones = {
    default: 'text-muted-foreground',
    success: 'text-success',
    warning: 'text-warning',
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="transition-colors hover:border-foreground/20">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            {Icon && <Icon className={cn('h-4 w-4', tones[tone])} />}
          </div>
          <p className="mt-2.5 font-heading text-3xl font-bold leading-none tabular-nums">
            {loading ? <span className="text-muted-foreground/40">–</span> : value}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
