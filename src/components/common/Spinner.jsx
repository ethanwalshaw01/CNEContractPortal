import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Spinner({ className, size = 'default' }) {
  const sizes = { sm: 'h-4 w-4', default: 'h-6 w-6', lg: 'h-10 w-10' }
  return <Loader2 className={cn('animate-spin text-primary', sizes[size], className)} />
}

export function PageSpinner() {
  return (
    <div className="flex h-64 w-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}
