import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CheckCircle2, ClipboardList, MapPin, CalendarRange, Building2, FileText } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import Logo from '@/components/Logo'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageSpinner } from '@/components/common/Spinner'
import StatusBadge from '@/components/common/StatusBadge'
import { formatDate } from '@/lib/utils'

function usePublicAllocation(id) {
  return useQuery({
    queryKey: ['public-allocation', id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_public_allocation', { p_id: id })
      if (error) throw error
      return data?.[0] ?? null
    },
    enabled: Boolean(id),
  })
}

export default function AllocationAccept() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [name, setName] = useState('')

  const { data: allocation, isLoading, error } = usePublicAllocation(id)

  const acceptMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc('accept_allocation', { p_id: id, p_name: name })
      if (error) throw error
      return data
    },
    onSuccess: (accepted) => {
      if (!accepted) {
        toast.error('This allocation is no longer awaiting acceptance.')
        return
      }
      queryClient.invalidateQueries({ queryKey: ['public-allocation', id] })
    },
    onError: (err) => toast.error(err.message || 'Could not accept allocation'),
  })

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Logo size={34} />
          <span className="font-heading text-base font-bold">CNE Contract Portal</span>
        </div>

        <Card className="shadow-panel">
          <CardContent className="p-6 sm:p-8">
            {isLoading ? (
              <PageSpinner />
            ) : error || !allocation ? (
              <div className="py-8 text-center">
                <p className="text-sm font-medium text-foreground">Allocation not found</p>
                <p className="mt-1 text-sm text-muted-foreground">This link may have expired or is incorrect.</p>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {allocation.allocation_number}
                    </p>
                    <h1 className="text-xl font-bold text-foreground">{allocation.title}</h1>
                  </div>
                  <StatusBadge status={allocation.status} />
                </div>

                <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-4">
                  {allocation.contractor_name && (
                    <Row icon={Building2} value={allocation.contractor_name} />
                  )}
                  {allocation.site_name && <Row icon={MapPin} value={allocation.site_name} />}
                  <Row icon={CalendarRange} value={`${formatDate(allocation.start_date)} — ${formatDate(allocation.end_date)}`} />
                  {allocation.permit_number && <Row icon={FileText} value={`Linked permit: ${allocation.permit_number}`} />}
                </div>

                {allocation.scope_of_work && (
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Scope of work</p>
                    <p className="text-sm text-foreground/90 whitespace-pre-line">{allocation.scope_of_work}</p>
                  </div>
                )}

                {allocation.status === 'accepted' || allocation.accepted_by_name ? (
                  <div className="flex items-center gap-3 rounded-lg bg-success/10 p-4 text-success">
                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                    <p className="text-sm font-medium">
                      Accepted by {allocation.accepted_by_name}
                      {allocation.accepted_at ? ` on ${formatDate(allocation.accepted_at)}` : ''}.
                    </p>
                  </div>
                ) : allocation.status !== 'pending_acceptance' ? (
                  <div className="flex items-center gap-3 rounded-lg bg-muted p-4 text-muted-foreground">
                    <ClipboardList className="h-5 w-5 shrink-0" />
                    <p className="text-sm">This allocation isn’t currently awaiting acceptance.</p>
                  </div>
                ) : (
                  <form
                    className="space-y-3"
                    onSubmit={(e) => {
                      e.preventDefault()
                      if (!name.trim()) {
                        toast.error('Please enter your name')
                        return
                      }
                      acceptMutation.mutate()
                    }}
                  >
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Your name</Label>
                      <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
                    </div>
                    <Button type="submit" className="w-full" disabled={acceptMutation.isPending}>
                      <CheckCircle2 className="mr-1.5 h-4 w-4" />
                      {acceptMutation.isPending ? 'Accepting…' : 'Accept allocation'}
                    </Button>
                  </form>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function Row({ icon: Icon, value }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-foreground/90">
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      {value}
    </div>
  )
}
