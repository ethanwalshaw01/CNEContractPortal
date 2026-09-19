import { Badge } from '@/components/ui/badge'
import { titleCase } from '@/lib/utils'

const VARIANTS = {
  draft: 'outline',
  pending_acceptance: 'warning',
  issued: 'secondary',
  accepted: 'secondary',
  live: 'success',
  completed: 'default',
  archived: 'outline',
  cancelled: 'destructive',
  active: 'success',
  inactive: 'outline',
}

export default function StatusBadge({ status, className }) {
  if (!status) return null
  return (
    <Badge variant={VARIANTS[status] ?? 'secondary'} className={className}>
      {titleCase(status)}
    </Badge>
  )
}
